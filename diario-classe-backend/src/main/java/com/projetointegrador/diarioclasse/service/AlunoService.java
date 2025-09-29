package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.request.AlunoRequest;
import com.projetointegrador.diarioclasse.dto.request.patchrequest.AlunoPatchRequest;
import com.projetointegrador.diarioclasse.dto.response.AlunoResponse;
import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Turma;
import com.projetointegrador.diarioclasse.repository.AlunoRepository;
import com.projetointegrador.diarioclasse.repository.TurmaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final TurmaRepository turmaRepository;

    public AlunoService(
            AlunoRepository alunoRepository,
            TurmaRepository turmaRepository
    ) {
        this.alunoRepository = alunoRepository;
        this.turmaRepository = turmaRepository;
    }

    public AlunoResponse criar(AlunoRequest request) {
        Turma turma = turmaRepository.findById(request.turmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        Aluno aluno = Aluno.builder()
                .nome(request.nome())
                .matricula(request.matricula())
                .dataNascimento(request.dataNascimento())
                .turma(turma)
                .build();

        alunoRepository.save(aluno);
        return toResponse(aluno);
    }

    public AlunoResponse atualizar(Long id, AlunoRequest request) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        Turma turma = turmaRepository.findById(request.turmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        aluno.setNome(request.nome());
        aluno.setMatricula(request.matricula());
        aluno.setDataNascimento(request.dataNascimento());
        aluno.setTurma(turma);

        alunoRepository.save(aluno);
        return toResponse(aluno);
    }

    public AlunoResponse patch(Long id, AlunoPatchRequest request) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        if (request.nome() != null) aluno.setNome(request.nome());
        if (request.matricula() != null) aluno.setMatricula(request.matricula());
        if (request.dataNascimento() != null) aluno.setDataNascimento(request.dataNascimento());
        if (request.turmaId() != null) {
            Turma turma = turmaRepository.findById(request.turmaId())
                    .orElseThrow(() -> new RuntimeException("Turma não encontrada"));
            aluno.setTurma(turma);
        }

        alunoRepository.save(aluno);
        return toResponse(aluno);
    }

    public void deletar(Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        alunoRepository.delete(aluno);
    }

    public AlunoResponse buscarPorId(Long id) {
        return alunoRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
    }

    public List<AlunoResponse> listarTodos() {
        return alunoRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<AlunoResponse> listarPorTurma(Long turmaId) {
        return alunoRepository.findByTurmaId(turmaId).stream()
                .map(this::toResponse)
                .toList();
    }

    private AlunoResponse toResponse(Aluno aluno) {
        return new AlunoResponse(
                aluno.getId(),
                aluno.getNome(),
                aluno.getMatricula(),
                aluno.getDataNascimento(),
                aluno.getTurma() != null ? aluno.getTurma().getId() : null
        );
    }
}
