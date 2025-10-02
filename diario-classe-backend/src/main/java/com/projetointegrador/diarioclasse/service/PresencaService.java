package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.request.PresencaRequest;
import com.projetointegrador.diarioclasse.dto.response.PresencaResponse;
import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Presenca;
import com.projetointegrador.diarioclasse.entity.Turma;
import com.projetointegrador.diarioclasse.repository.AlunoRepository;
import com.projetointegrador.diarioclasse.repository.PresencaRepository;
import com.projetointegrador.diarioclasse.repository.TurmaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PresencaService {

    private final PresencaRepository presencaRepository;
    private final AlunoRepository alunoRepository;
    private final TurmaRepository turmaRepository;

//    public PresencaResponse registrar(PresencaRequest request) {
//        Aluno aluno = alunoRepository.findById(request.alunoId())
//                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado"));
//
//        Turma turma = turmaRepository.findById(request.turmaId())
//                .orElseThrow(() -> new EntityNotFoundException("Turma não encontrada"));
//
//        Presenca presenca = Presenca.builder()
//                .data(request.data())
//                .presente(request.presente())
//                .aluno(aluno)
//                .turma(turma)
//                .metodoChamada(request.metodoChamada())
//                .build();
//
//        return toResponse(presencaRepository.save(presenca));
//    }

    public PresencaResponse registrar(PresencaRequest request) {
        Aluno aluno = alunoRepository.findById(request.alunoId())
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado"));

        Turma turma = turmaRepository.findById(request.turmaId())
                .orElseThrow(() -> new EntityNotFoundException("Turma não encontrada"));

        // busca presença existente para aluno/turma/data
        Optional<Presenca> existente = presencaRepository
                .findByAlunoIdAndTurmaIdAndData(aluno.getId(), turma.getId(), request.data());

        Presenca presenca;
        if (existente.isPresent()) {
            // se já existe, apenas atualiza
            presenca = existente.get();
            presenca.setPresente(request.presente());
            presenca.setMetodoChamada(request.metodoChamada());
        } else {
            // se não existe, cria nova presença
            presenca = Presenca.builder()
                    .data(request.data())
                    .presente(request.presente())
                    .aluno(aluno)
                    .turma(turma)
                    .metodoChamada(request.metodoChamada())
                    .build();
        }

        // salva (update ou insert)
        return toResponse(presencaRepository.save(presenca));
    }

    public PresencaResponse buscarPorId(Long id) {
        return presencaRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Presença não encontrada"));
    }

    public List<PresencaResponse> listarPorAluno(Long alunoId) {
        return presencaRepository.findByAlunoId(alunoId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<PresencaResponse> listarPorTurma(Long turmaId) {
        return presencaRepository.findByTurmaId(turmaId).stream()
                .map(this::toResponse)
                .toList();
    }

    public void deletar(Long id) {
        if (!presencaRepository.existsById(id)) {
            throw new EntityNotFoundException("Presença não encontrada");
        }
        presencaRepository.deleteById(id);
    }

//    public List<PresencaResponse> listarChamada(Long turmaId, LocalDate data) {
//        Turma turma = turmaRepository.findById(turmaId)
//                .orElseThrow(() -> new EntityNotFoundException("Turma não encontrada"));
//
//        List<Aluno> alunos = alunoRepository.findByTurmaId(turmaId);
//        List<Presenca> presencas = presencaRepository.findByTurmaIdAndData(turmaId, data);
//
//        // cria um map de presenças já existentes
//        Map<Long, Presenca> mapPresencas = presencas.stream()
//                .collect(Collectors.toMap(p -> p.getAluno().getId(), p -> p));
//
//        return alunos.stream().map(aluno -> {
//            Presenca presenca = mapPresencas.get(aluno.getId());
//            if (presenca == null) {
//                presenca = new Presenca();
//                presenca.setAluno(aluno);
//                presenca.setTurma(turma); // ✅ agora é entidade, não ID
//                presenca.setData(data);
//                presenca.setPresente(false);
//                presenca.setMetodoChamada("MANUAL");
//                presencaRepository.save(presenca);
//            }
//
//            return new PresencaResponse(
//                    presenca.getId(),
//                    presenca.getData(),
//                    presenca.getPresente(),
//                    presenca.getAluno().getId(),
//                    presenca.getAluno().getNome(),
//                    presenca.getTurma().getId(),
//                    presenca.getMetodoChamada()
//            );
//        }).toList();
//    }

    public List<PresencaResponse> listarChamada(Long turmaId, LocalDate data) {
        Turma turma = turmaRepository.findById(turmaId)
                .orElseThrow(() -> new EntityNotFoundException("Turma não encontrada"));

        List<Aluno> alunos = alunoRepository.findByTurmaId(turmaId);

        // busca presenças já registradas na data
        List<Presenca> presencas = presencaRepository.findByTurmaIdAndData(turmaId, data);

        Map<Long, Presenca> mapPresencas = presencas.stream()
                .collect(Collectors.toMap(
                        presenca -> presenca.getAluno().getId(),
                        presenca -> presenca, (presenca1, presenca2) -> presenca1));

        // retorna todos os alunos, com presença existente ou nula
        return alunos.stream().map(aluno -> {
            Presenca presenca = mapPresencas.get(aluno.getId());
            if (presenca == null) {
                // se não houver presença, retorna um objeto "vazio" para frontend preencher
                presenca = new Presenca();
                presenca.setAluno(aluno);
                presenca.setTurma(turma);
                presenca.setData(data);
                presenca.setPresente(false);
                presenca.setMetodoChamada(null); // ainda não registrada
            }
            return new PresencaResponse(
                    presenca.getId(),
                    presenca.getData(),
                    presenca.getPresente(),
                    presenca.getAluno().getId(),
                    presenca.getAluno().getNome(),
                    presenca.getTurma().getId(),
                    presenca.getMetodoChamada()
            );
        }).toList();
    }

    public PresencaResponse atualizarPresenca(Long presencaId, boolean presente) {
        Presenca presenca = presencaRepository.findById(presencaId)
                .orElseThrow(() -> new RuntimeException("Presença não encontrada"));
        presenca.setPresente(presente);
        presenca.setMetodoChamada("MANUAL");
        presencaRepository.save(presenca);
        return toResponse(presenca);
    }

    private PresencaResponse toResponse(Presenca presenca) {
        return new PresencaResponse(
                presenca.getId(),
                presenca.getData(),
                presenca.getPresente(),
                presenca.getAluno().getId(),
                presenca.getAluno().getNome(),
                presenca.getTurma().getId(),
                presenca.getMetodoChamada()
        );
    }

    public void deletarPorAlunoTurmaData(Long alunoId, Long turmaId, LocalDate data) {
        Optional<Presenca> presenca = presencaRepository.findByAlunoIdAndTurmaIdAndData(alunoId, turmaId, data);
        presenca.ifPresent(presencaRepository::delete);
    }

}

