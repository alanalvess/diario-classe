package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.request.TurmaRequest;
import com.projetointegrador.diarioclasse.dto.request.patchrequest.TurmaPatchRequest;
import com.projetointegrador.diarioclasse.dto.response.TurmaResponse;
import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Disciplina;
import com.projetointegrador.diarioclasse.entity.Professor;
import com.projetointegrador.diarioclasse.entity.Turma;
import com.projetointegrador.diarioclasse.repository.AlunoRepository;
import com.projetointegrador.diarioclasse.repository.DisciplinaRepository;
import com.projetointegrador.diarioclasse.repository.ProfessorRepository;
import com.projetointegrador.diarioclasse.repository.TurmaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TurmaService {

    private final TurmaRepository turmaRepository;
    private final ProfessorRepository professorRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final AlunoRepository alunoRepository;

    public TurmaResponse criar(TurmaRequest request) {
        Set<Professor> professores = request.professorIds().stream()
                .map(id -> professorRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Professor não encontrado: " + id)))
                .collect(Collectors.toSet());

        List<Disciplina> disciplinas = request.disciplinaIds().stream()
                .map(id -> disciplinaRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Disciplina não encontrada: " + id)))
                .collect(Collectors.toList());

        Turma turma = Turma.builder()
                .nome(request.nome())
                .anoLetivo(request.anoLetivo())
                .professores(professores)
                .disciplinas(disciplinas)
                .alunos(new ArrayList<>())
                .build();

        turmaRepository.save(turma);
        return toResponse(turma);
    }

    public TurmaResponse atualizar(Long id, TurmaRequest request) {
        Turma turma = turmaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        Set<Professor> professores = request.professorIds().stream()
                .map(pid -> professorRepository.findById(pid)
                        .orElseThrow(() -> new RuntimeException("Professor não encontrado: " + pid)))
                .collect(Collectors.toSet());

        List<Disciplina> disciplinas = request.disciplinaIds().stream()
                .map(did -> disciplinaRepository.findById(did)
                        .orElseThrow(() -> new RuntimeException("Disciplina não encontrada: " + did)))
                .collect(Collectors.toList());

        turma.setNome(request.nome());
        turma.setAnoLetivo(request.anoLetivo());
        turma.setProfessores(professores);
        turma.setDisciplinas(disciplinas);

        turmaRepository.save(turma);
        return toResponse(turma);
    }

    public TurmaResponse patch(Long id, TurmaPatchRequest request) {
        var turma = turmaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        if (request.nome() != null) turma.setNome(request.nome());
        if (request.anoLetivo() != null) turma.setAnoLetivo(request.anoLetivo());

        turmaRepository.save(turma);
        return toResponse(turma);
    }

    public void deletar(Long id) {
        var turma = turmaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));
        turmaRepository.delete(turma);
    }

    public TurmaResponse buscarPorId(Long id) {
        return turmaRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));
    }

    public List<TurmaResponse> listarTodos() {
        return turmaRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    private TurmaResponse toResponse(Turma turma) {
        Set<Long> professorIds = turma.getProfessores() != null
                ? turma.getProfessores().stream().map(Professor::getId).collect(Collectors.toSet())
                : Collections.emptySet();

        List<Long> disciplinaIds = turma.getDisciplinas() != null
                ? turma.getDisciplinas().stream().map(Disciplina::getId).collect(Collectors.toList())
                : Collections.emptyList();

        List<Long> alunoIds = turma.getAlunos() != null
                ? turma.getAlunos().stream().map(Aluno::getId).toList()
                : Collections.emptyList();

        return new TurmaResponse(
                turma.getId(),
                turma.getNome(),
                turma.getAnoLetivo(),
                turma.calcularMediaTurma(),
                turma.calcularFrequenciaMedia(),
                professorIds,
                disciplinaIds,
                alunoIds
        );
    }
}

