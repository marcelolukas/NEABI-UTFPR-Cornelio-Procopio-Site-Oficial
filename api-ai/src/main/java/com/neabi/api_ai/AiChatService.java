package com.neabi.api_ai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiChatService {

    private final ChatClient chatClient;

    public AiChatService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String generate(String prompt) {
        String content = this.chatClient
                .prompt()
                .user(prompt)
                .call()
                .content();

        if (content == null || content.isBlank()) {
            throw new IllegalStateException("O provedor de IA retornou uma resposta vazia.");
        }

        return content;
    }
}
