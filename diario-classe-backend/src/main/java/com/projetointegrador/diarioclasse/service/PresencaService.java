package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.request.PresencaRequest;
import com.projetointegrador.diarioclasse.dto.response.PresencaResponse;
import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Presenca;
import com.projetointegrador.diarioclasse.entity.Turma;
import com.projetointegrador.diarioclasse.repository.AlunoRepository;
import com.projetointegrador.diarioclasse.repository.PresencaRepository;
import com.projetointegrador.diarioclasse.repository.TurmaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PresencaService {

    private final PresencaRepository presencaRepository;
    private final AlunoRepository alunoRepository;
    private final TurmaRepository turmaRepository;

    public PresencaResponse registrar(PresencaRequest request) {
        Aluno aluno = alunoRepository.findById(request.alunoId())
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado"));

        Turma turma = turmaRepository.findById(request.turmaId())
                .orElseThrow(() -> new EntityNotFoundException("Turma não encontrada"));

        Presenca presenca = Presenca.builder()
                .data(request.data())
                .presente(request.presente())
                .aluno(aluno)
                .turma(turma)
                .metodoChamada(request.metodoChamada())
                .build();

        return toResponse(presencaRepository.save(presenca));
    }

    public PresencaResponse buscarPorId(Long id) {
        return presencaRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Presença não encontrada"));
    }

    public List<PresencaResponse> listarPorAluno(Long alunoId) {
        return presencaRepository.findByAlunoId(alunoId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PresencaResponse> listarPorTurma(Long turmaId) {
        return presencaRepository.findByTurmaId(turmaId).stream()
                .map(this::toResponse)
                .toList();
    }

    public void deletar(Long id) {
        if (!presencaRepository.existsById(id)) {
            throw new EntityNotFoundException("Presença não encontrada");
        }
        presencaRepository.deleteById(id);
    }

    private PresencaResponse toResponse(Presenca presenca) {
        return new PresencaResponse(
                presenca.getId(),
                presenca.getData(),
                presenca.getPresente(),
                presenca.getAluno().getId(),
                presenca.getTurma().getId(),
                presenca.getMetodoChamada()
        );
    }
}

