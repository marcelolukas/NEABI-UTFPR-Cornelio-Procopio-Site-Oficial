package br.com.neabi.backend.controller;

// DTOs e Serviços do Projeto
import br.com.neabi.backend.dto.FormularioAlunoDTO;
import br.com.neabi.backend.dto.PersonalidadeDTO;
import br.com.neabi.backend.service.MatchService;

// Exceções e Listas do Java
import java.io.IOException;
import java.util.List;

// Recursos do Spring Framework
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/match")
@CrossOrigin(origins = "*")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    /**
     * Rota GET em '/api/match/todas' para listar todas as mulheres do catálogo.
     */
    @GetMapping("/todas")
    public ResponseEntity<List<PersonalidadeDTO>> listarTodas() throws IOException {

        // 1. Chama a função do MatchService que lê todos os JSONs da pasta
        List<PersonalidadeDTO> lista = this.matchService.lerMulheresJson();

        // 2. Devolve a lista preenchida com o status HTTP 200 (OK)
        return ResponseEntity.ok(lista);
    }
}