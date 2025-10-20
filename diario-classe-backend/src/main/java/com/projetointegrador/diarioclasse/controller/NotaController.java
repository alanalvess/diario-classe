package com.projetointegrador.diarioclasse.controller;

import com.projetointegrador.diarioclasse.dto.request.NotaRequest;
import com.projetointegrador.diarioclasse.dto.response.EvolucaoBimestralResponse;
import com.projetointegrador.diarioclasse.dto.response.MediaDisciplinaResponse;
import com.projetointegrador.diarioclasse.dto.response.NotaResponse;
import com.projetointegrador.diarioclasse.service.AvaliacaoService;
import com.projetointegrador.diarioclasse.service.NotaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/notas")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class NotaController {

    private final NotaService notaService;
    private final AvaliacaoService avaliacaoService;

    public NotaController(NotaService notaService, AvaliacaoService avaliacaoService) {
        this.notaService = notaService;
        this.avaliacaoService = avaliacaoService;
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

    @GetMapping("/turma/{turmaId}/media-por-disciplina")
    public ResponseEntity<List<MediaDisciplinaResponse>> mediaPorDisciplina(@PathVariable Long turmaId) {
        return ResponseEntity.ok(notaService.calcularMediaPorDisciplina(turmaId));
    }

    @GetMapping("/aluno/{alunoId}/evolucao-bimestral")
    public ResponseEntity<List<EvolucaoBimestralResponse>> evolucaoBimestralAluno(@PathVariable Long alunoId) {
        return ResponseEntity.ok(notaService.listarEvolucaoBimestral(alunoId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        notaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
