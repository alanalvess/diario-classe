package com.projetointegrador.diarioclasse.controller;

import com.projetointegrador.diarioclasse.dto.request.AvaliacaoRequest;
import com.projetointegrador.diarioclasse.dto.response.AvaliacaoResponse;
import com.projetointegrador.diarioclasse.service.AvaliacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/avaliacoes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    @PostMapping
    public ResponseEntity<AvaliacaoResponse> criar(@RequestBody AvaliacaoRequest request) {
        return ResponseEntity.ok(avaliacaoService.criar(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AvaliacaoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(avaliacaoService.buscarPorId(id));
    }

    @GetMapping("/turma/{turmaId}")
    public ResponseEntity<List<AvaliacaoResponse>> listarPorTurma(@PathVariable Long turmaId) {
        return ResponseEntity.ok(avaliacaoService.listarPorTurma(turmaId));
    }

    @GetMapping("/disciplina/{disciplinaId}")
    public ResponseEntity<List<AvaliacaoResponse>> listarPorDisciplina(@PathVariable Long disciplinaId) {
        return ResponseEntity.ok(avaliacaoService.listarPorDisciplina(disciplinaId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        avaliacaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

