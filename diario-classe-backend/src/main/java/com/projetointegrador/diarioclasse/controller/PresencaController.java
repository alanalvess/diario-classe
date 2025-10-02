package com.projetointegrador.diarioclasse.controller;

import com.projetointegrador.diarioclasse.dto.request.PresencaRequest;
import com.projetointegrador.diarioclasse.dto.response.PresencaResponse;
import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Presenca;
import com.projetointegrador.diarioclasse.entity.Turma;
import com.projetointegrador.diarioclasse.service.PresencaService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/presencas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
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

    @GetMapping("/turmas/{turmaId}")
    public ResponseEntity<List<PresencaResponse>> listarChamada(
            @PathVariable Long turmaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return ResponseEntity.ok(presencaService.listarChamada(turmaId, data));
    }

    // Atualiza presença de um aluno
    @PatchMapping("/{id}")
    public ResponseEntity<PresencaResponse> atualizarPresenca(
            @PathVariable Long id,
            @RequestParam boolean presente) {
        return ResponseEntity.ok(presencaService.atualizarPresenca(id, presente));
    }

    @PostMapping("/presencas/batch")
    public ResponseEntity<List<PresencaResponse>> registrarBatch(@RequestBody List<PresencaRequest> requests) {
        List<PresencaResponse> responses = requests.stream()
                .map(presencaService::registrar)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/turma/{turmaId}/aluno/{alunoId}")
    public ResponseEntity<Void> deletarPresencaPorData(
            @PathVariable Long turmaId,
            @PathVariable Long alunoId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        presencaService.deletarPorAlunoTurmaData(alunoId, turmaId, data);
        return ResponseEntity.noContent().build();
    }



}

