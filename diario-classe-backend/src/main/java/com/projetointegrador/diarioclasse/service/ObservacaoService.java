package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.request.ObservacaoRequest;
import com.projetointegrador.diarioclasse.dto.request.patchrequest.ObservacaoPatchRequest;
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
    private final ProfessorRepository professorRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final TurmaRepository turmaRepository;

    public ObservacaoResponse criar(ObservacaoRequest request) {
//        Aluno aluno = alunoRepository.findById(request.alunoId())
//                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
//
//        Professor professor = professorRepository.findById(request.professorId())
//                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
//
//        Observacao observacao = Observacao.builder()
//                .data(request.data())
//                .descricao(request.descricao())
//                .categoria(request.categoria())
//                .aluno(aluno)
//                .professor(professor)
//                .build();
//
//        observacaoRepository.save(observacao);
//        return toResponse(observacao);

        Aluno aluno = alunoRepository.findById(request.alunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
//        Professor professor = professorRepository.findById(request.professorId())
//                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        Turma turma = turmaRepository.findById(request.turmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));
        Disciplina disciplina = disciplinaRepository.findById(request.disciplinaId())
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));

        Observacao observacao = Observacao.builder()
                .data(request.data())
                .descricao(request.descricao())
                .categoria(request.categoria())
                .aluno(aluno)
//                .professor(professor)
                .turma(turma)
                .disciplina(disciplina)
                .build();

        observacaoRepository.save(observacao);
        return toResponse(observacao);
    }

    public ObservacaoResponse atualizar(Long id, ObservacaoRequest request) {
        Observacao observacao = observacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Observação não encontrada"));

        Aluno aluno = alunoRepository.findById(request.alunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

//        Professor professor = professorRepository.findById(request.professorId())
//                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));

        observacao.setData(request.data());
        observacao.setDescricao(request.descricao());
        observacao.setCategoria(request.categoria());
        observacao.setAluno(aluno);
//        observacao.setProfessor(professor);

        observacaoRepository.save(observacao);
        return toResponse(observacao);
    }

    public ObservacaoResponse patch(Long id, ObservacaoPatchRequest request) {
        Observacao observacao = observacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Observação não encontrada"));

        if (request.descricao() != null) observacao.setDescricao(request.descricao());
        if (request.categoria() != null) observacao.setCategoria(request.categoria());

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

    private ObservacaoResponse toResponse(Observacao obs) {
        return new ObservacaoResponse(
                obs.getId(),
                obs.getData(),
                obs.getDescricao(),
                obs.getCategoria(),
//                obs.getProfessor() != null ? obs.getProfessor().getId() : null,
                obs.getAluno() != null ? obs.getAluno().getId() : null,
                obs.getTurma() != null ? obs.getTurma().getId() : null,
                obs.getDisciplina() != null ? obs.getDisciplina().getId() : null
        );
    }
}
