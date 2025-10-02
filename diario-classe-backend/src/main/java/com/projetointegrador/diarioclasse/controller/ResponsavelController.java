package com.projetointegrador.diarioclasse.controller;

import com.projetointegrador.diarioclasse.dto.request.ResponsavelRequest;
import com.projetointegrador.diarioclasse.dto.request.patchrequest.ResponsavelPatchRequest;
import com.projetointegrador.diarioclasse.dto.response.ResponsavelResponse;
import com.projetointegrador.diarioclasse.service.ResponsavelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/responsaveis")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ResponsavelController {

    private final ResponsavelService responsavelService;

    @PostMapping
    public ResponseEntity<ResponsavelResponse> criar(@RequestBody ResponsavelRequest request) {
        return ResponseEntity.ok(responsavelService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponsavelResponse> atualizar(@PathVariable Long id, @RequestBody ResponsavelRequest request) {
        return ResponseEntity.ok(responsavelService.atualizar(id, request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ResponsavelResponse> patch(@PathVariable Long id, @RequestBody ResponsavelPatchRequest request) {
        return ResponseEntity.ok(responsavelService.patch(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        responsavelService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponsavelResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(responsavelService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<ResponsavelResponse>> listarTodos() {
        return ResponseEntity.ok(responsavelService.listarTodos());
    }
}

