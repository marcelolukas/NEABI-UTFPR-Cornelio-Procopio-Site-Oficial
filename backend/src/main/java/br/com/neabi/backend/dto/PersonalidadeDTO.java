package br.com.neabi.backend.dto;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * DTO principal que mapeia a personalidade histórica e une os DTOs básicos,
 * listas de afinidade e as instruções da IA Generativa.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record PersonalidadeDTO(
        String id,
        DadosBasicosDTO dadosBasicos,
        InstrucoesIaDTO instrucoesIa, // Ajustado para bater com o JSON ("instrucoesIa")
        List<String> causas,
        Map<String, Integer> pesoCategorias
) {}