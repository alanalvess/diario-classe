package com.projetointegrador.diarioclasse.controller;

import com.projetointegrador.diarioclasse.dto.request.NotaRequest;
import com.projetointegrador.diarioclasse.dto.response.NotaResponse;
import com.projetointegrador.diarioclasse.service.NotaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notas")
public class NotaController {

    private final NotaService notaService;

    public NotaController(NotaService notaService) {
        this.notaService = notaService;
    }

    @PostMapping
    public ResponseEntity<NotaResponse> registrar(@RequestBody NotaRequest request) {
        return ResponseEntity.ok(notaService.registrar(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(notaService.buscarPorId(id));
    }

    @GetMapping("/aluno/{alunoId}")
    public ResponseEntity<List<NotaResponse>> listarPorAluno(@PathVariable Long alunoId) {
        return ResponseEntity.ok(notaService.listarPorAluno(alunoId));
    }

    @GetMapping("/disciplina/{disciplinaId}")
    public ResponseEntity<List<NotaResponse>> listarPorDisciplina(@PathVariable Long disciplinaId) {
        return ResponseEntity.ok(notaService.listarPorDisciplina(disciplinaId));
    }

    @GetMapping("/avaliacao/{avaliacaoId}")
    public ResponseEntity<List<NotaResponse>> listarPorAvaliacao(@PathVariable Long avaliacaoId) {
        return ResponseEntity.ok(notaService.listarPorAvaliacao(avaliacaoId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        notaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

