package com.projetointegrador.diarioclasse.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projetointegrador.diarioclasse.dto.request.AlunoRequest;
import com.projetointegrador.diarioclasse.dto.request.patchrequest.AlunoPatchRequest;
import com.projetointegrador.diarioclasse.dto.response.AlunoResponse;
import com.projetointegrador.diarioclasse.service.AlunoService;
import com.projetointegrador.diarioclasse.service.QRCodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Map;

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

    @GetMapping("/{id}/qrcode")
    public ResponseEntity<byte[]> gerarQrCode(@PathVariable Long id) throws Exception {
        // Buscar aluno via service (DTO ou entidade)
        AlunoResponse aluno = alunoService.buscarPorId(id);

        // Criar JSON
        Map<String, Object> qrDataMap = Map.of(
                "alunoId", aluno.id(),
                "turmaId", aluno.turmaId(),
                "nome", aluno.nome(),
                "turmaid", aluno.turmaId()
        );

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(qrDataMap);

        // Converter JSON para Base64
        String base64QrData = Base64.getEncoder()
                .encodeToString(json.getBytes(StandardCharsets.UTF_8));

        // Gerar QR Code
        ByteArrayOutputStream qrOut = QRCodeGenerator.generateQRCodeImage(base64QrData, 200, 200);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(qrOut.toByteArray());
    }
}
