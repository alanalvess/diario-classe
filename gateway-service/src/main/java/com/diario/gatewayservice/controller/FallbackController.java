package com.diario.gatewayservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/userServiceFallBack")
    public ResponseEntity<String> userServiceFallback() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body("O serviço de usuário está temporariamente indisponível. Tente novamente mais tarde.");
    }

    @GetMapping("/alunoServiceFallBack")
    public ResponseEntity<String> alunoServiceFallback() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body("O serviço de alunos está temporariamente indisponível. Tente novamente mais tarde.");
    }
}
