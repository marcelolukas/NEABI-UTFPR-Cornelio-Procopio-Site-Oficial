package com.neabi.api_ai;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

class ChatControllerTests {

    private AiChatService aiChatService;
    private KnowledgeService knowledgeService;
    private ChatController controller;

    @BeforeEach
    void setUp() {
        aiChatService = mock(AiChatService.class);
        knowledgeService = mock(KnowledgeService.class);
        controller = new ChatController(aiChatService, knowledgeService);
    }

    @Test
    void returnsGeneratedAnswer() {
        when(knowledgeService.findByPersonalidade("Angela Davis"))
                .thenReturn(new KnowledgeService.KnowledgeContext("angela-davis", "conteudo", true));
        when(aiChatService.generate(anyString())).thenReturn("Resposta da IA");

        ResponseEntity<ChatController.ChatResponse> response = controller.chat(
                new ChatController.ChatRequest("Quem foi ela?", null, "Angela Davis"));

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Resposta da IA", response.getBody().answer());
    }

    @Test
    void returnsServiceUnavailableWhenProviderFails() {
        when(knowledgeService.findByPersonalidade("Angela Davis"))
                .thenReturn(new KnowledgeService.KnowledgeContext("angela-davis", "conteudo", true));
        when(aiChatService.generate(anyString())).thenThrow(new RuntimeException("falha de rede"));

        ResponseEntity<ChatController.ChatResponse> response = controller.chat(
                new ChatController.ChatRequest("Quem foi ela?", null, "Angela Davis"));

        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(
                "O assistente está temporariamente indisponível. Tente novamente em alguns instantes.",
                response.getBody().answer());
    }

    @Test
    void rejectsMessagesLongerThanFrontendLimit() {
        ResponseEntity<ChatController.ChatResponse> response = controller.chat(
                new ChatController.ChatRequest("a".repeat(501), null, "Angela Davis"));

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}
