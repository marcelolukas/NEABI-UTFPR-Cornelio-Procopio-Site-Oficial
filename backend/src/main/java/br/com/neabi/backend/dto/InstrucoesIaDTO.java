package br.com.neabi.backend.dto;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record InstrucoesIaDTO(
        String persona,
        List<String> tomDeVoz,
        List<String> temasChave,
        List<String> regrasEstritas
) {}