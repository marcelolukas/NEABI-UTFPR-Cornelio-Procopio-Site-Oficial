package br.com.neabi.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * DTO responsável por mapear as informações pessoais básicas de uma personalidade do NEABI.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record DadosBasicosDTO(
        String nome,
        String nomeCompleto,
        String grupo,
        String dataNascimento,
        String localNascimento,
        String nacionalidade,
        String estadoAtual,
        String dataFalecimento
) {}