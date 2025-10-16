package com.projetointegrador.diarioclasse.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projetointegrador.diarioclasse.dto.QRCodeDTO;
import com.projetointegrador.diarioclasse.dto.request.PresencaRequest;
import com.projetointegrador.diarioclasse.dto.response.PresencaResponse;
import com.projetointegrador.diarioclasse.service.PresencaService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;

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
    public ResponseEntity<String> registrarPresencaQR(@RequestParam String qrData) {
        try {
// Decodifica Base64
            byte[] decodedBytes = Base64.getDecoder().decode(qrData);
            String json = new String(decodedBytes, StandardCharsets.UTF_8);

            // Converte JSON para DTO
            QRCodeDTO dados = new ObjectMapper().readValue(json, QRCodeDTO.class);

            // Cria PresencaRequest
            PresencaRequest request = new PresencaRequest(
                    LocalDate.now(),
                    true,
                    dados.alunoId(),
                    dados.turmaId(),
                    "QR_CODE"
            );

            presencaService.registrar(request);

            return ResponseEntity.ok("✅ Presença registrada via QR Code!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("❌ Erro ao processar QR Code: " + e.getMessage());
        }
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

