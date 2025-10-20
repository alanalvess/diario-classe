package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.request.ObservacaoRequest;
import com.projetointegrador.diarioclasse.dto.request.patchrequest.ObservacaoPatchRequest;
import com.projetointegrador.diarioclasse.dto.response.DisciplinaResponse;
import com.projetointegrador.diarioclasse.dto.response.ObservacaoResponse;
import com.projetointegrador.diarioclasse.entity.*;
import com.projetointegrador.diarioclasse.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ObservacaoService {

    private final ObservacaoRepository observacaoRepository;
    private final AlunoRepository alunoRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final TurmaRepository turmaRepository;
    private final ProfessorRepository professorRepository;

    public ObservacaoResponse criar(ObservacaoRequest request) {
        Aluno aluno = alunoRepository.findById(request.alunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        Turma turma = turmaRepository.findById(request.turmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));
        Disciplina disciplina = disciplinaRepository.findById(request.disciplinaId())
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));
        Professor professor = professorRepository.findById(request.professorId())
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));

        Observacao observacao = Observacao.builder()
                .data(request.data())
                .descricao(request.descricao())
                .categoria(request.categoria())
                .aluno(aluno)
                .turma(turma)
                .disciplina(disciplina)
                .professor(professor)
                .build();

        observacaoRepository.save(observacao);
        return toResponse(observacao);
    }

    public ObservacaoResponse atualizar(Long id, ObservacaoRequest request) {
        Observacao observacao = observacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Observação não encontrada"));

        Aluno aluno = alunoRepository.findById(request.alunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        Turma turma = turmaRepository.findById(request.turmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));
        Disciplina disciplina = disciplinaRepository.findById(request.disciplinaId())
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));
        Professor professor = professorRepository.findById(request.professorId())
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));


        observacao.setData(request.data());
        observacao.setDescricao(request.descricao());
        observacao.setCategoria(request.categoria());
        observacao.setAluno(aluno);
        observacao.setTurma(turma);
        observacao.setDisciplina(disciplina);
        observacao.setProfessor(professor);

        observacaoRepository.save(observacao);
        return toResponse(observacao);
    }

    public ObservacaoResponse patch(Long id, ObservacaoPatchRequest request) {
        Observacao observacao = observacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Observação não encontrada"));

        if (request.data() != null) observacao.setData(request.data());
        if (request.descricao() != null) observacao.setDescricao(request.descricao());
        if (request.categoria() != null) observacao.setCategoria(request.categoria());
        if (request.alunoId() != null) {
            Aluno aluno = alunoRepository.findById(request.alunoId())
                    .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
            observacao.setAluno(aluno);
        }
        if (request.turmaId() != null) {
            Turma turma = turmaRepository.findById(request.turmaId())
                    .orElseThrow(() -> new RuntimeException("Turma não encontrada"));
            observacao.setTurma(turma);
        }
        if (request.disciplinaId() != null) {
            Disciplina disciplina = disciplinaRepository.findById(request.disciplinaId())
                    .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));
            observacao.setDisciplina(disciplina);
        }
        if (request.professorId() != null) {
            Professor professor = professorRepository.findById(request.professorId())
                    .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
            observacao.setProfessor(professor);
        }

        observacaoRepository.save(observacao);
        return toResponse(observacao);
    }

    public void deletar(Long id) {
        Observacao observacao = observacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Observação não encontrada"));
        observacaoRepository.delete(observacao);
    }

    public ObservacaoResponse buscarPorId(Long id) {
        return observacaoRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Observação não encontrada"));
    }

    public List<ObservacaoResponse> listarTodos() {
        return observacaoRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ObservacaoResponse> listarPorAluno(Long alunoId) {
        return observacaoRepository.findByAlunoId(alunoId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ObservacaoResponse> listarPorTurma(Long turmaId) {
        Turma turma = turmaRepository.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        return turma.getObservacoes().stream()
                .map(o -> new ObservacaoResponse(
                        o.getId(),
                        o.getData(),
                        o.getDescricao(),
                        o.getCategoria(),
                        o.getProfessor().getId(),
                        o.getProfessor().getNome(),
                        o.getAluno().getId(),
                        o.getAluno().getNome(),
                        o.getTurma().getId(),
                        o.getTurma().getNome(),
                        o.getDisciplina().getId(),
                        o.getDisciplina().getNome()
                ))
                .toList();
    }

    private ObservacaoResponse toResponse(Observacao obs) {
        return new ObservacaoResponse(
                obs.getId(),
                obs.getData(),
                obs.getDescricao(),
                obs.getCategoria(),
                obs.getProfessor() != null ? obs.getProfessor().getId() : null,
                obs.getProfessor() != null ? obs.getProfessor().getNome() : null,
                obs.getAluno() != null ? obs.getAluno().getId() : null,
                obs.getAluno() != null ? obs.getAluno().getNome() : null,
                obs.getTurma() != null ? obs.getTurma().getId() : null,
                obs.getTurma() != null ? obs.getTurma().getNome() : null,
                obs.getDisciplina() != null ? obs.getDisciplina().getId() : null,
                obs.getDisciplina() != null ? obs.getDisciplina().getNome() : null
        );
    }

}
