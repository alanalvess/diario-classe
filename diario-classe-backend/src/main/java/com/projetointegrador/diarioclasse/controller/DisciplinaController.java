package com.projetointegrador.diarioclasse.controller;

import com.projetointegrador.diarioclasse.dto.request.DisciplinaRequest;
import com.projetointegrador.diarioclasse.dto.request.TurmaRequest;
import com.projetointegrador.diarioclasse.dto.request.patchrequest.TurmaPatchRequest;
import com.projetointegrador.diarioclasse.dto.response.DisciplinaResponse;
import com.projetointegrador.diarioclasse.dto.response.TurmaResponse;
import com.projetointegrador.diarioclasse.service.DisciplinaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/disciplinas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class DisciplinaController {
    private final DisciplinaService disciplinaService;

    @PostMapping
    public ResponseEntity<DisciplinaResponse> criar(@RequestBody DisciplinaRequest request) {
        return ResponseEntity.ok(disciplinaService.criar(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisciplinaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(disciplinaService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<DisciplinaResponse>> listarTodas() {
        return ResponseEntity.ok(disciplinaService.listarTodas());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        disciplinaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/turma/{turmaId}")
    public ResponseEntity<List<DisciplinaResponse>> listarPorTurma(@PathVariable Long turmaId) {
        return ResponseEntity.ok(disciplinaService.listarPorTurma(turmaId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DisciplinaResponse> atualizar(@PathVariable Long id, @RequestBody DisciplinaRequest request) {
        return ResponseEntity.ok(disciplinaService.atualizar(id, request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<DisciplinaResponse> patch(@PathVariable Long id, @RequestBody DisciplinaRequest request) {
        return ResponseEntity.ok(disciplinaService.patch(id, request));
    }

}