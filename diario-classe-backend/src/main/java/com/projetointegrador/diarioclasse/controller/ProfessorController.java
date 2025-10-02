package com.projetointegrador.diarioclasse.controller;

import com.projetointegrador.diarioclasse.dto.request.ProfessorRequest;
import com.projetointegrador.diarioclasse.dto.request.patchrequest.ProfessorPatchRequest;
import com.projetointegrador.diarioclasse.dto.response.ProfessorResponse;
import com.projetointegrador.diarioclasse.service.ProfessorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/professores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ProfessorController {

    private final ProfessorService professorService;

    @PostMapping
    public ResponseEntity<ProfessorResponse> criar(@RequestBody ProfessorRequest request) {
        return ResponseEntity.ok(professorService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfessorResponse> atualizar(@PathVariable Long id, @RequestBody ProfessorRequest request) {
        return ResponseEntity.ok(professorService.atualizar(id, request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ProfessorResponse> patch(@PathVariable Long id, @RequestBody ProfessorPatchRequest request) {
        return ResponseEntity.ok(professorService.patch(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        professorService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfessorResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(professorService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<ProfessorResponse>> listarTodos() {
        return ResponseEntity.ok(professorService.listarTodos());
    }
}

