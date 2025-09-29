package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.request.AvaliacaoRequest;
import com.projetointegrador.diarioclasse.dto.response.AvaliacaoResponse;
import com.projetointegrador.diarioclasse.entity.Avaliacao;
import com.projetointegrador.diarioclasse.entity.Disciplina;
import com.projetointegrador.diarioclasse.entity.Turma;
import com.projetointegrador.diarioclasse.repository.AvaliacaoRepository;
import com.projetointegrador.diarioclasse.repository.DisciplinaRepository;
import com.projetointegrador.diarioclasse.repository.TurmaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;
    private final TurmaRepository turmaRepository;
    private final DisciplinaRepository disciplinaRepository;

    public AvaliacaoResponse criar(AvaliacaoRequest request) {
        Turma turma = turmaRepository.findById(request.turmaId())
                .orElseThrow(() -> new EntityNotFoundException("Turma não encontrada"));

        Disciplina disciplina = disciplinaRepository.findById(request.disciplinaId())
                .orElseThrow(() -> new EntityNotFoundException("Disciplina não encontrada"));

        Avaliacao avaliacao = Avaliacao.builder()
                .titulo(request.titulo())
                .data(request.data())
                .peso(request.peso())
                .turma(turma)
                .disciplina(disciplina)
                .build();

        return toResponse(avaliacaoRepository.save(avaliacao));
    }

    public AvaliacaoResponse buscarPorId(Long id) {
        return avaliacaoRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Avaliação não encontrada"));
    }

    public List<AvaliacaoResponse> listarPorTurma(Long turmaId) {
        return avaliacaoRepository.findByTurmaId(turmaId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<AvaliacaoResponse> listarPorDisciplina(Long disciplinaId) {
        return avaliacaoRepository.findByDisciplinaId(disciplinaId).stream()
                .map(this::toResponse)
                .toList();
    }

    public void deletar(Long id) {
        if (!avaliacaoRepository.existsById(id)) {
            throw new EntityNotFoundException("Avaliação não encontrada");
        }
        avaliacaoRepository.deleteById(id);
    }

    private AvaliacaoResponse toResponse(Avaliacao avaliacao) {
        return new AvaliacaoResponse(
                avaliacao.getId(),
                avaliacao.getTitulo(),
                avaliacao.getData(),
                avaliacao.getPeso(),
                avaliacao.getTurma().getId(),
                avaliacao.getDisciplina().getId(),
                avaliacao.calcularMedia()
        );
    }
}

