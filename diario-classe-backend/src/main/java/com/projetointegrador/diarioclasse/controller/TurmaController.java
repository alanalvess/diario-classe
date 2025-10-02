package com.projetointegrador.diarioclasse.controller;

import com.projetointegrador.diarioclasse.dto.request.TurmaRequest;
import com.projetointegrador.diarioclasse.dto.request.patchrequest.TurmaPatchRequest;
import com.projetointegrador.diarioclasse.dto.response.TurmaResponse;
import com.projetointegrador.diarioclasse.service.TurmaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/turmas")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TurmaController {

    private final TurmaService turmaService;

    public TurmaController(TurmaService turmaService) {
        this.turmaService = turmaService;
    }

    @PostMapping
    public ResponseEntity<TurmaResponse> criar(@RequestBody TurmaRequest request) {
        return ResponseEntity.ok(turmaService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TurmaResponse> atualizar(@PathVariable Long id, @RequestBody TurmaRequest request) {
        return ResponseEntity.ok(turmaService.atualizar(id, request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TurmaResponse> patch(@PathVariable Long id, @RequestBody TurmaPatchRequest request) {
        return ResponseEntity.ok(turmaService.patch(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        turmaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TurmaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(turmaService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<TurmaResponse>> listarTodos() {
        return ResponseEntity.ok(turmaService.listarTodos());
    }
}

