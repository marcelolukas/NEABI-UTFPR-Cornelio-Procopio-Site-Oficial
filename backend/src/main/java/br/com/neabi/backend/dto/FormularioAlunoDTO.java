package br.com.neabi.backend.dto;

import java.util.List;

// O record cria automaticamente os getters, construtores e o toString()
public record FormularioAlunoDTO(
    String nome,
    List<String> perfilSelecionado
) {}