package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.request.AlertaRequest;
import com.projetointegrador.diarioclasse.dto.response.AlertaResponse;
import com.projetointegrador.diarioclasse.entity.Alerta;
import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.enums.StatusAlerta;
import com.projetointegrador.diarioclasse.repository.AlertaRepository;
import com.projetointegrador.diarioclasse.repository.AlunoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertaService {

    private final AlertaRepository alertaRepository;
    private final AlunoRepository alunoRepository;

    public AlertaService(AlertaRepository alertaRepository, AlunoRepository alunoRepository) {
        this.alertaRepository = alertaRepository;
        this.alunoRepository = alunoRepository;
    }

    public AlertaResponse registrarAlerta(AlertaRequest request) {
        Alerta alerta = Alerta.builder()
                .aluno(alunoRepository.findById(request.alunoId()).orElseThrow())
                .riscoReprovacao(request.riscoReprovacao())
                .riscoEvasao(request.riscoEvasao())
                .scoreRisco(request.scoreRisco())
                .mensagemResumo(String.format(
                        "Aluno %s apresenta risco (score %.2f)",
                        request.alunoNome(), // ou pegar o nome do aluno
                        request.scoreRisco()
                ))
                .dataGeracao(request.dataGeracao())
                .status(request.status())
                .build();

        alertaRepository.save(alerta);
        return AlertaResponse.fromEntity(alerta);
    }


    public List<AlertaResponse> buscarPorAluno(Long alunoId) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        return alertaRepository.findByAluno(aluno)
                .stream()
                .map(AlertaResponse::fromEntity)
                .toList();
    }

    public List<AlertaResponse> listarTodos() {
        return alertaRepository.findAll()
                .stream()
                .map(AlertaResponse::fromEntity)
                .toList();
    }

    public AlertaResponse atualizarStatus(Long alertaId, StatusAlerta status) {
        Alerta alerta = alertaRepository.findById(alertaId)
                .orElseThrow(() -> new RuntimeException("Alerta não encontrado"));
        alerta.setStatus(status);
        alertaRepository.save(alerta);
        return AlertaResponse.fromEntity(alerta);
    }
}

