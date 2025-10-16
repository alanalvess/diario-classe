package com.projetointegrador.diarioclasse.controller;

import com.projetointegrador.diarioclasse.dto.request.AlertaRequest;
import com.projetointegrador.diarioclasse.dto.response.AlertaResponse;
import com.projetointegrador.diarioclasse.enums.StatusAlerta;
import com.projetointegrador.diarioclasse.service.AlertaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alertas")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AlertaController {

    private final AlertaService alertaService;

    public AlertaController(AlertaService alertaService) {
        this.alertaService = alertaService;
    }

    @PostMapping
    public AlertaResponse criarAlerta(@RequestBody AlertaRequest request) {
        return alertaService.registrarAlerta(request);
    }

    @GetMapping("/aluno/{alunoId}")
    public List<AlertaResponse> listarPorAluno(@PathVariable Long alunoId) {
        return alertaService.buscarPorAluno(alunoId);
    }

    @GetMapping
    public List<AlertaResponse> listarTodos() {
        return alertaService.listarTodos();
    }

    @PatchMapping("/{id}/status")
    public AlertaResponse atualizarStatus(@PathVariable Long id,
                                          @RequestParam StatusAlerta status) {
        return alertaService.atualizarStatus(id, status);
    }
}

