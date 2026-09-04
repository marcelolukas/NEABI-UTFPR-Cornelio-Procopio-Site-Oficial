package com.neabi.api_ai;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.Normalizer;
import java.util.Locale;
import java.util.Optional;

import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

@Service
public class KnowledgeService {

    private static final int MAX_CONTEXT_LENGTH = 18000;
    private final ResourceLoader resourceLoader;

    public KnowledgeService(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    public KnowledgeContext findByPersonalidade(String personalidade) {
        String slug = toSlug(personalidade);

        if (slug.isBlank()) {
            return new KnowledgeContext("", "", false);
        }

        return readClasspathJson(slug)
                .or(() -> readDevelopmentJson(slug))
                .map(content -> new KnowledgeContext(slug, limit(content), true))
                .orElseGet(() -> new KnowledgeContext(slug, "", false));
    }

    private Optional<String> readClasspathJson(String slug) {
        Resource resource = resourceLoader.getResource("classpath:dados-mulheres/" + slug + ".json");

        if (!resource.exists()) {
            return Optional.empty();
        }

        try {
            return Optional.of(resource.getContentAsString(StandardCharsets.UTF_8));
        } catch (IOException exception) {
            return Optional.empty();
        }
    }

    private Optional<String> readDevelopmentJson(String slug) {
        Path userDir = Path.of(System.getProperty("user.dir"));
        Path[] candidates = {
                userDir.resolve("../backend/src/main/resources/dados-mulheres/" + slug + ".json").normalize(),
                userDir.resolve("backend/src/main/resources/dados-mulheres/" + slug + ".json").normalize()
        };

        for (Path candidate : candidates) {
            if (Files.isRegularFile(candidate)) {
                try {
                    return Optional.of(Files.readString(candidate, StandardCharsets.UTF_8));
                } catch (IOException exception) {
                    return Optional.empty();
                }
            }
        }

        return Optional.empty();
    }

    public String toSlug(String value) {
        if (value == null) {
            return "";
        }

        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");

        return normalized;
    }

    private String limit(String content) {
        if (content.length() <= MAX_CONTEXT_LENGTH) {
            return content;
        }

        return content.substring(0, MAX_CONTEXT_LENGTH)
                + "\n\n[Contexto truncado por limite tecnico. Use apenas as informacoes visiveis acima.]";
    }

    public record KnowledgeContext(String slug, String content, boolean found) {
    }
}
