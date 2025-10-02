package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.request.AlunoDisciplinaRequest;
import com.projetointegrador.diarioclasse.dto.request.patchrequest.AlunoDisciplinaPatchRequest;
import com.projetointegrador.diarioclasse.dto.response.AlunoDisciplinaResponse;
import com.projetointegrador.diarioclasse.dto.response.UsuarioResponse;
import com.projetointegrador.diarioclasse.entity.*;
import com.projetointegrador.diarioclasse.repository.AlunoDisciplinaRepository;
import com.projetointegrador.diarioclasse.repository.AlunoRepository;
import com.projetointegrador.diarioclasse.repository.DisciplinaRepository;
import com.projetointegrador.diarioclasse.repository.TurmaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlunoDisciplinaService {

    private final AlunoDisciplinaRepository alunoDisciplinaRepository;
    private final AlunoRepository alunoRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final TurmaRepository turmaRepository;

    public AlunoDisciplinaService(
            AlunoDisciplinaRepository alunoDisciplinaRepository,
            AlunoRepository alunoRepository,
            DisciplinaRepository disciplinaRepository,
            TurmaRepository turmaRepository
    ) {
        this.alunoDisciplinaRepository = alunoDisciplinaRepository;
        this.alunoRepository = alunoRepository;
        this.disciplinaRepository = disciplinaRepository;
        this.turmaRepository = turmaRepository;
    }

    public AlunoDisciplinaResponse matricular(AlunoDisciplinaRequest request) {
        Aluno aluno = alunoRepository.findById(request.alunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        Disciplina disciplina = disciplinaRepository.findById(request.disciplinaId())
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));

        Turma turma = turmaRepository.findById(request.turmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        // Verifica se já existe registro de aluno-disciplina-turma
        Optional<AlunoDisciplina> existente = alunoDisciplinaRepository
                .findByAlunoIdAndDisciplinaIdAndTurmaId(aluno.getId(), disciplina.getId(), turma.getId());

        AlunoDisciplina alunoDisciplina;
        if (existente.isPresent()) {
            // Atualiza campos caso queira permitir alteração inicial
            alunoDisciplina = existente.get();
            if (request.notaFinal() != null) alunoDisciplina.setNotaFinal(request.notaFinal());
            if (request.frequencia() != null) alunoDisciplina.setFrequencia(request.frequencia());
            if (request.observacoes() != null && !request.observacoes().isBlank())
                alunoDisciplina.setObservacoes(request.observacoes());
        } else {
            alunoDisciplina = AlunoDisciplina.builder()
                    .aluno(aluno)
                    .disciplina(disciplina)
                    .turma(turma)
                    .notaFinal(request.notaFinal())
                    .frequencia(request.frequencia())
                    .observacoes(request.observacoes())
                    .build();
        }

        alunoDisciplinaRepository.save(alunoDisciplina);
        return toResponse(alunoDisciplina);
    }

    public AlunoDisciplinaResponse atualizarNotasEFrequencia(Long id, Double nota, Double frequencia, String obs) {
        AlunoDisciplina alunoDisciplina = alunoDisciplinaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro não encontrado"));

        if (nota != null) alunoDisciplina.setNotaFinal(nota);
        if (frequencia != null) alunoDisciplina.setFrequencia(frequencia);
        if (obs != null && !obs.isBlank()) alunoDisciplina.setObservacoes(obs);

        alunoDisciplinaRepository.save(alunoDisciplina);

        return toResponse(alunoDisciplina);
    }

    public AlunoDisciplinaResponse patch(Long id, AlunoDisciplinaPatchRequest request) {
        AlunoDisciplina alunoDisciplina = alunoDisciplinaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro não encontrado"));

        if (request.notaFinal() != null) alunoDisciplina.setNotaFinal(request.notaFinal());
        if (request.frequencia() != null) alunoDisciplina.setFrequencia(request.frequencia());
        if (request.observacoes() != null && !request.observacoes().isBlank())
            alunoDisciplina.setObservacoes(request.observacoes());

        alunoDisciplinaRepository.save(alunoDisciplina);

        return toResponse(alunoDisciplina);
    }

    public List<AlunoDisciplinaResponse> listarPorAluno(Long alunoId) {
        return alunoDisciplinaRepository.findByAlunoId(alunoId)
                .stream().map(this::toResponse).toList();
    }

    public List<AlunoDisciplinaResponse> listarPorDisciplina(Long disciplinaId) {
        return alunoDisciplinaRepository.findByDisciplinaId(disciplinaId)
                .stream().map(this::toResponse).toList();
    }

    public List<AlunoDisciplinaResponse> listarPorTurma(Long turmaId) {
        return alunoDisciplinaRepository.findByTurmaId(turmaId)
                .stream().map(this::toResponse).toList();
    }

    private AlunoDisciplinaResponse toResponse(AlunoDisciplina entity) {
        return new AlunoDisciplinaResponse(
                entity.getId(),
                entity.getAluno().getId(),
                entity.getDisciplina().getId(),
                entity.getTurma().getId(),
                entity.getNotaFinal(),
                entity.getFrequencia(),
                entity.getObservacoes()
        );
    }

}
