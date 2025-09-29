package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.request.ProfessorRequest;
import com.projetointegrador.diarioclasse.dto.request.patchrequest.ProfessorPatchRequest;
import com.projetointegrador.diarioclasse.dto.response.ProfessorResponse;
import com.projetointegrador.diarioclasse.entity.Disciplina;
import com.projetointegrador.diarioclasse.entity.Professor;
import com.projetointegrador.diarioclasse.entity.Turma;
import com.projetointegrador.diarioclasse.repository.DisciplinaRepository;
import com.projetointegrador.diarioclasse.repository.ProfessorRepository;
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

    public ProfessorResponse criar(ProfessorRequest request) {
        Set<Disciplina> disciplinas = request.disciplinaIds().stream()
                .map(id -> disciplinaRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Disciplina não encontrada: " + id)))
                .collect(Collectors.toSet());

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

        Set<Disciplina> disciplinas = request.disciplinaIds().stream()
                .map(did -> disciplinaRepository.findById(did)
                        .orElseThrow(() -> new RuntimeException("Disciplina não encontrada: " + did)))
                .collect(Collectors.toSet());

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

    public ProfessorResponse buscarPorId(Long id) {
        return professorRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
    }

    public List<ProfessorResponse> listarTodos() {
        return professorRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    private ProfessorResponse toResponse(Professor professor) {
        Set<Long> disciplinaIds = professor.getDisciplinas() != null
                ? professor.getDisciplinas().stream().map(Disciplina::getId).collect(Collectors.toSet())
                : Collections.emptySet();

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

