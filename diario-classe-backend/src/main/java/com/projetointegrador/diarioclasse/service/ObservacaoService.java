package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.request.ObservacaoRequest;
import com.projetointegrador.diarioclasse.dto.request.patchrequest.ObservacaoPatchRequest;
import com.projetointegrador.diarioclasse.dto.response.ObservacaoResponse;
import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Disciplina;
import com.projetointegrador.diarioclasse.entity.Observacao;
import com.projetointegrador.diarioclasse.entity.Turma;
import com.projetointegrador.diarioclasse.repository.AlunoRepository;
import com.projetointegrador.diarioclasse.repository.DisciplinaRepository;
import com.projetointegrador.diarioclasse.repository.ObservacaoRepository;
import com.projetointegrador.diarioclasse.repository.TurmaRepository;
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

    public ObservacaoResponse criar(ObservacaoRequest request) {
        Aluno aluno = alunoRepository.findById(request.alunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        Turma turma = turmaRepository.findById(request.turmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));
        Disciplina disciplina = disciplinaRepository.findById(request.disciplinaId())
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));

        Observacao observacao = Observacao.builder()
                .data(request.data())
                .descricao(request.descricao())
                .categoria(request.categoria())
                .aluno(aluno)
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

        Turma turma = turmaRepository.findById(request.turmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));
        Disciplina disciplina = disciplinaRepository.findById(request.disciplinaId())
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));

        observacao.setData(request.data());
        observacao.setDescricao(request.descricao());
        observacao.setCategoria(request.categoria());
        observacao.setAluno(aluno);
        observacao.setTurma(turma);
        observacao.setDisciplina(disciplina);

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
