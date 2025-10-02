package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.request.ProfessorRequest;
import com.projetointegrador.diarioclasse.dto.request.patchrequest.ProfessorPatchRequest;
import com.projetointegrador.diarioclasse.dto.response.ProfessorResponse;
import com.projetointegrador.diarioclasse.entity.Disciplina;
import com.projetointegrador.diarioclasse.entity.Professor;
import com.projetointegrador.diarioclasse.entity.Turma;
import com.projetointegrador.diarioclasse.repository.DisciplinaRepository;
import com.projetointegrador.diarioclasse.repository.ProfessorRepository;
import com.projetointegrador.diarioclasse.repository.TurmaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final TurmaRepository turmaRepository;

    public List<ProfessorResponse> listarTodos() {
        return professorRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public ProfessorResponse buscarPorId(Long id) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Professor com id " + id + " não encontrado"));
        return toResponse(professor);
    }

    public ProfessorResponse criar(ProfessorRequest request) {
        List<Disciplina> disciplinas = request.disciplinaIds().stream()
                .map(id -> disciplinaRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Disciplina não encontrada: " + id)))
                .collect(Collectors.toList());

        Professor professor = Professor.builder()
                .nome(request.nome())
                .email(request.email())
                .disciplinas(disciplinas)
                .build();

        professorRepository.save(professor);
        return toResponse(professor);
    }

    public ProfessorResponse atualizar(Long id, ProfessorRequest request) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));

        List<Disciplina> disciplinas = request.disciplinaIds().stream()
                .map(did -> disciplinaRepository.findById(did)
                        .orElseThrow(() -> new RuntimeException("Disciplina não encontrada: " + did)))
                .collect(Collectors.toList());

        professor.setNome(request.nome());
        professor.setEmail(request.email());
        professor.setDisciplinas(disciplinas);

        professorRepository.save(professor);
        return toResponse(professor);
    }

    public ProfessorResponse patch(Long id, ProfessorPatchRequest request) {
        var professor = professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));

        if (request.nome() != null) professor.setNome(request.nome());
        if (request.email() != null) professor.setEmail(request.email());

        professorRepository.save(professor);
        return toResponse(professor);
    }

    public void deletar(Long id) {
        var professor = professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        professorRepository.delete(professor);
    }

    private ProfessorResponse toResponse(Professor professor) {
        List<Long> disciplinaIds = professor.getDisciplinas() != null
                ? professor.getDisciplinas().stream().map(Disciplina::getId).collect(Collectors.toList())
                : Collections.emptyList();

        List<Long> turmaIds = professor.getTurmas() != null
                ? professor.getTurmas().stream().map(Turma::getId).toList()
                : Collections.emptyList();

        return new ProfessorResponse(
                professor.getId(),
                professor.getNome(),
                professor.getEmail(),
                disciplinaIds,
                turmaIds
        );
    }
}

