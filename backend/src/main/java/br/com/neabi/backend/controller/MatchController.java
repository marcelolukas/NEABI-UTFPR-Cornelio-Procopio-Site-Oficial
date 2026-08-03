package br.com.neabi.backend.controller;

// --- DTOs e Serviços do Projeto ---
// DTO (Data Transfer Object): Molde para receber os dados do formulário do aluno
import br.com.neabi.backend.dto.FormularioAlunoDTO;
import br.com.neabi.backend.dto.PersonalidadeDTO;
// Classe do serviço para que o Controller consiga acessar a lógica de negócio
import br.com.neabi.backend.service.MatchService;

// --- Exceções do Java ---
// Trata possíveis erros de entrada e saída (leitura/escrita de arquivos)
import java.io.IOException;

// --- Recursos do Spring Framework ---
// Ferramenta que empacota as respostas HTTP (código de status, cabeçalhos e corpo)
import org.springframework.http.ResponseEntity;
// Importa todas as anotações Web do Spring (@RestController, @PostMapping, @RequestBody, etc.)
import org.springframework.web.bind.annotation.*;

/**
 * Controller responsável por receber as requisições do site e gerenciar a rota de Match do NEABI.
 * * @RestController Avisa ao Spring que a classe responde dados puros (texto/JSON) e não páginas HTML.
 * @RequestMapping("/api") Define que todas as rotas desta classe começam com 'http://localhost:8080/api'.
 * @CrossOrigin(origins = "*") Libera as portas de segurança (CORS) para permitir requisições do navegador.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MatchController {

    // Variável privada para guardar a referência do serviço.
    // A palavra 'final' garante que ela não será alterada após a inicialização.
    private final MatchService matchService;

    /**
     * Construtor da classe.
     * Quando a aplicação inicia, o Spring Boot injeta automaticamente a instância do MatchService aqui.
     */
    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    /**
     * Rota POST em '/api/match' que recebe as escolhas do aluno e aciona o serviço.
     * * @param dadosAluno Objeto JSON traduzido automaticamente para o molde FormularioAlunoDTO.
     * @return ResponseEntity com o texto do arquivo JSON e status HTTP 200 OK.
     * @throws IOException Caso ocorra alguma falha na leitura do arquivo físico.
     */
    @PostMapping("/match")
public ResponseEntity<PersonalidadeDTO> calcularMatch(@RequestBody FormularioAlunoDTO dadosAluno) throws IOException {

    // 1. O Service lê o JSON e converte para o Objeto Java de forma automática!
    PersonalidadeDTO personalidade = this.matchService.lerArquivoJson();

    // 2. Apenas para testar no terminal do VS Code se o nome veio correto:
    System.out.println("=========================================");
    System.out.println("SISTEMA LEOU O ARQUIVO COM SUCESSO!");
    System.out.println("Nome no DTO: " + personalidade.dadosBasicos().nome());
    System.out.println("Primeira causa: " + personalidade.causas().get(0));
    System.out.println("Prompt IA carregado? " + (personalidade.instrucoesIa() != null));
    System.out.println("=========================================");

    // 3. Devolve o Objeto diretamente (o Spring converte de volta para JSON para o site!)
    return ResponseEntity.ok(personalidade);
}
    }
