package com.projetointegrador.diarioclasse.controller;

import com.projetointegrador.diarioclasse.dto.request.PresencaRequest;
import com.projetointegrador.diarioclasse.dto.response.PresencaResponse;
import com.projetointegrador.diarioclasse.service.PresencaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/presencas")
@RequiredArgsConstructor
public class PresencaController {

    private final PresencaService presencaService;

    @PostMapping
    public ResponseEntity<PresencaResponse> registrar(@RequestBody PresencaRequest request) {
        return ResponseEntity.ok(presencaService.registrar(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PresencaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(presencaService.buscarPorId(id));
    }

    @GetMapping("/aluno/{alunoId}")
    public ResponseEntity<List<PresencaResponse>> listarPorAluno(@PathVariable Long alunoId) {
        return ResponseEntity.ok(presencaService.listarPorAluno(alunoId));
    }

    @GetMapping("/turma/{turmaId}")
    public ResponseEntity<List<PresencaResponse>> listarPorTurma(@PathVariable Long turmaId) {
        return ResponseEntity.ok(presencaService.listarPorTurma(turmaId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        presencaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/presenca/scan")
    public ResponseEntity<String> registrarPresencaQR(@RequestParam Long alunoId,
                                                      @RequestParam Long turmaId) {
        // Monta o request para o service
        PresencaRequest request = new PresencaRequest(
                LocalDate.now(),   // data da leitura
                true,              // aluno presente
                alunoId,
                turmaId,
                "QR_CODE"          // método de chamada
        );

        // Chama o service existente
        presencaService.registrar(request);

        return ResponseEntity.ok("✅ Presença registrada via QR Code!");
    }
}

