package com.projetointegrador.diarioclasse.controller;

import com.projetointegrador.diarioclasse.dto.request.AlunoRequest;
import com.projetointegrador.diarioclasse.dto.request.patchrequest.AlunoPatchRequest;
import com.projetointegrador.diarioclasse.dto.response.AlunoResponse;
import com.projetointegrador.diarioclasse.service.AlunoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alunos")
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoService alunoService;

    @PostMapping
    public ResponseEntity<AlunoResponse> criar(@RequestBody AlunoRequest request) {
        return ResponseEntity.ok(alunoService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlunoResponse> atualizar(@PathVariable Long id, @RequestBody AlunoRequest request) {
        return ResponseEntity.ok(alunoService.atualizar(id, request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AlunoResponse> patch(@PathVariable Long id, @RequestBody AlunoPatchRequest request) {
        return ResponseEntity.ok(alunoService.patch(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        alunoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlunoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(alunoService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<AlunoResponse>> listarTodos() {
        return ResponseEntity.ok(alunoService.listarTodos());
    }

    @GetMapping("/turma/{turmaId}")
    public ResponseEntity<List<AlunoResponse>> listarPorTurma(@PathVariable Long turmaId) {
        return ResponseEntity.ok(alunoService.listarPorTurma(turmaId));
    }
}
