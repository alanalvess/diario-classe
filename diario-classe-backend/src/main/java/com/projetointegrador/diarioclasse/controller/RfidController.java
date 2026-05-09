package com.projetointegrador.diarioclasse.controller;

import com.projetointegrador.diarioclasse.dto.request.RfidLeituraRequest;
import com.projetointegrador.diarioclasse.dto.request.RfidVincularRequest;
import com.projetointegrador.diarioclasse.dto.response.RfidResponseDTO;
import com.projetointegrador.diarioclasse.service.RfidService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rfid")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class RfidController {

    @Value("${rfid.api.key}")
    private String apiKeyConfig;

    private final RfidService rfidService;

    @PostMapping("/leitura")
    public ResponseEntity<RfidResponseDTO> leitura(
            @RequestBody RfidLeituraRequest request,
            @RequestHeader(value = "x-api-key", required = false) String apiKey
    ) {

        // 🔒 validação segura (evita NullPointerException)
        if (apiKey == null || !apiKeyConfig.equals(apiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(RfidResponseDTO.erro("API Key inválida"));
        }

        try {
            RfidResponseDTO response = rfidService.processarLeitura(request);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity.ok(
                    RfidResponseDTO.erro(e.getMessage())
            );
        }
    }

    @PostMapping("/vincular")
    public ResponseEntity<?> vincular(@RequestBody RfidVincularRequest request) {

        rfidService.vincularCartao(request);

        return ResponseEntity.ok().body(
                Map.of("status", "ok", "mensagem", "Cartão vinculado com sucesso")
        );
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }
}