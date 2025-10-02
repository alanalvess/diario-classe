package com.projetointegrador.diarioclasse.controller;

import com.projetointegrador.diarioclasse.dto.request.ObservacaoRequest;
import com.projetointegrador.diarioclasse.dto.request.patchrequest.ObservacaoPatchRequest;
import com.projetointegrador.diarioclasse.dto.response.ObservacaoResponse;
import com.projetointegrador.diarioclasse.service.ObservacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/observacoes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ObservacaoController {

    private final ObservacaoService observacaoService;

    @PostMapping
    public ResponseEntity<ObservacaoResponse> criar(@RequestBody ObservacaoRequest request) {
        return ResponseEntity.ok(observacaoService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ObservacaoResponse> atualizar(@PathVariable Long id, @RequestBody ObservacaoRequest request) {
        return ResponseEntity.ok(observacaoService.atualizar(id, request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ObservacaoResponse> patch(@PathVariable Long id, @RequestBody ObservacaoPatchRequest request) {
        return ResponseEntity.ok(observacaoService.patch(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        observacaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ObservacaoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(observacaoService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<ObservacaoResponse>> listarTodos() {
        return ResponseEntity.ok(observacaoService.listarTodos());
    }

    @GetMapping("/aluno/{alunoId}")
    public ResponseEntity<List<ObservacaoResponse>> listarPorAluno(@PathVariable Long alunoId) {
        return ResponseEntity.ok(observacaoService.listarPorAluno(alunoId));
    }
}

