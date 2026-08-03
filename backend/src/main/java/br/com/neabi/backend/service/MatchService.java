package br.com.neabi.backend.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.neabi.backend.dto.PersonalidadeDTO;

@Service
public class MatchService {

    private final ObjectMapper objectMapper;

    public MatchService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public List<PersonalidadeDTO> lerMulheresJson() throws IOException {
        
        ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] resources = resolver.getResources("classpath:dados-mulheres/*.json");

        List<PersonalidadeDTO> listaMulheres = new ArrayList<>();

        for (Resource resource : resources) {
            String json = resource.getContentAsString(StandardCharsets.UTF_8);
            PersonalidadeDTO mulher = objectMapper.readValue(json, PersonalidadeDTO.class);
            listaMulheres.add(mulher);
        }

        return listaMulheres;
    }
}