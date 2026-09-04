package com.neabi.api_ai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatClient chatClient;
    private final KnowledgeService knowledgeService;
    private static final int MAX_MESSAGE_LENGTH = 500;
    private static final String SYSTEM_CONTEXT = """
            Voce e o assistente educacional da exposicao virtual do NEABI da UTFPR de Cornelio Procopio.
            Sua funcao e ajudar visitantes a compreender trajetorias de mulheres negras e indigenas apresentadas
            no projeto. Responda sempre em portugues do Brasil, com linguagem clara, didatica, acessivel e respeitosa.
            Use prioritariamente a base de conhecimento fornecida nesta requisicao. Nao invente datas, acontecimentos,
            citacoes, contatos, fontes ou links. Se a base nao tiver informacoes suficientes, diga isso explicitamente.
            Perguntas com "ela", "dela", "sua trajetoria", "o que fez" e similares devem se referir a personalidade
            atualmente aberta no site.
            """;

    public ChatController(ChatClient.Builder chatClientBuilder, KnowledgeService knowledgeService) {
        this.chatClient = chatClientBuilder.build();
        this.knowledgeService = knowledgeService;
    }

    @PostMapping("/api/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String message = request == null ? "" : normalize(request.text());
        String personalidade = request == null ? "" : normalize(request.personalidade());

        if (message.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new ChatResponse("Digite uma pergunta para eu responder."));
        }

        if (message.length() > MAX_MESSAGE_LENGTH) {
            return ResponseEntity.badRequest()
                    .body(new ChatResponse("Sua pergunta esta muito longa. Tente resumir em ate 500 caracteres."));
        }

        KnowledgeService.KnowledgeContext knowledge = knowledgeService.findByPersonalidade(personalidade);
        String prompt = buildPrompt(message, personalidade, knowledge);
        String content = this.chatClient
                .prompt()
                .user(prompt)
                .call()
                .content();

        return ResponseEntity.ok(new ChatResponse(content));
    }

    @GetMapping({ "/api/chat", "/ai" })
    public String generation(@RequestParam String userInput) {
        ChatResponse response = this.chat(new ChatRequest(userInput, null, null)).getBody();
        return response == null ? "" : response.answer();
    }

    private String normalize(String message) {
        return message == null ? "" : message.trim();
    }

    private String buildPrompt(String message, String personalidade, KnowledgeService.KnowledgeContext knowledge) {
        String nomeContexto = personalidade == null || personalidade.isBlank()
                ? "nao identificada"
                : personalidade;
        String base = knowledge.found()
                ? knowledge.content()
                : "Nao ha JSON cadastrado para esta personalidade no momento.";

        return """
                %s

                Personalidade atualmente aberta no site: %s
                Identificador da personalidade: %s
                Base de conhecimento da exposicao:
                %s

                Regras para esta resposta:
                - Responda somente ao que estiver relacionado ao NEABI, a exposicao, educacao antirracista ou as personalidades do projeto.
                - Se a pergunta estiver fora desse escopo, explique educadamente o foco do assistente.
                - Se a resposta depender de uma informacao ausente na base, diga que essa informacao nao foi encontrada no conteudo disponivel.
                - Quando houver fontes ou referencias na base, mencione-as de forma resumida ao final.

                Pergunta do visitante:
                %s
                """.formatted(SYSTEM_CONTEXT, nomeContexto, knowledge.slug(), base, message);
    }

    public record ChatRequest(String message, String mensagem, String personalidade) {
        public String text() {
            return message != null ? message : mensagem;
        }
    }

    public record ChatResponse(String answer) {
    }
}
