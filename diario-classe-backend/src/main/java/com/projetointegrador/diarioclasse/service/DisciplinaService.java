package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.request.DisciplinaRequest;
import com.projetointegrador.diarioclasse.dto.response.DisciplinaResponse;
import com.projetointegrador.diarioclasse.entity.Disciplina;
import com.projetointegrador.diarioclasse.entity.Turma;
import com.projetointegrador.diarioclasse.repository.DisciplinaRepository;
import com.projetointegrador.diarioclasse.repository.TurmaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DisciplinaService {
    private final DisciplinaRepository disciplinaRepository;
    private final TurmaRepository turmaRepository;

    public DisciplinaResponse criar(DisciplinaRequest request) {
        Disciplina disciplina = Disciplina.builder()
                .nome(request.nome())
                .codigo(request.codigo())
                .mediaTurma(0.0)
                .frequenciaMedia(0.0)
                .build();
        disciplinaRepository.save(disciplina);
        return toResponse(disciplina);
    }

    public DisciplinaResponse buscarPorId(Long id) {
        return disciplinaRepository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Disciplina não encontrada"));
    }

    public List<DisciplinaResponse> listarTodas() {
        return disciplinaRepository.findAll().stream().map(this::toResponse).toList();
    }

    public void deletar(Long id) {
        Disciplina disciplina = disciplinaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Disciplina com id " + id + " não encontrada"));
        disciplinaRepository.delete(disciplina);
    }

    public List<DisciplinaResponse> listarPorTurma(Long turmaId) {
        Turma turma = turmaRepository.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        return turma.getDisciplinas().stream()
                .map(d -> new DisciplinaResponse(
                        d.getId(),
                        d.getNome(),
                        d.getCodigo(),
                        d.getMediaTurma(),
                        d.getFrequenciaMedia()
                ))
                .toList();
    }


    private DisciplinaResponse toResponse(Disciplina disciplina) {
        return new DisciplinaResponse(
                disciplina.getId(),
                disciplina.getNome(),
                disciplina.getCodigo(),
                disciplina.getMediaTurma(),
                disciplina.getFrequenciaMedia()
        );
    }
}
