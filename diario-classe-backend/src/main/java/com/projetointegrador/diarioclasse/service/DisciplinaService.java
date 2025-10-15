package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.request.DisciplinaRequest;
import com.projetointegrador.diarioclasse.dto.request.TurmaRequest;
import com.projetointegrador.diarioclasse.dto.request.patchrequest.TurmaPatchRequest;
import com.projetointegrador.diarioclasse.dto.response.DisciplinaResponse;
import com.projetointegrador.diarioclasse.dto.response.TurmaResponse;
import com.projetointegrador.diarioclasse.entity.Disciplina;
import com.projetointegrador.diarioclasse.entity.Professor;
import com.projetointegrador.diarioclasse.entity.Turma;
import com.projetointegrador.diarioclasse.repository.DisciplinaRepository;
import com.projetointegrador.diarioclasse.repository.TurmaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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

    public DisciplinaResponse atualizar(Long id, DisciplinaRequest request) {
        Disciplina disciplina = disciplinaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));

        disciplina.setNome(request.nome());
        disciplina.setCodigo(request.codigo());

        disciplinaRepository.save(disciplina);
        return toResponse(disciplina);
    }

    public DisciplinaResponse patch(Long id, DisciplinaRequest request) {
        Disciplina disciplina = disciplinaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));

        if (request.nome() != null) disciplina.setNome(request.nome());
        if (request.codigo() != null) disciplina.setCodigo(request.codigo());

        disciplinaRepository.save(disciplina);
        return toResponse(disciplina);
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
