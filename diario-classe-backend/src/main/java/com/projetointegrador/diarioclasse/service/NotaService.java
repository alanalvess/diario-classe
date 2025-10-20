package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.request.NotaRequest;
import com.projetointegrador.diarioclasse.dto.response.EvolucaoBimestralResponse;
import com.projetointegrador.diarioclasse.dto.response.MediaDisciplinaResponse;
import com.projetointegrador.diarioclasse.dto.response.NotaResponse;
import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Avaliacao;
import com.projetointegrador.diarioclasse.entity.Disciplina;
import com.projetointegrador.diarioclasse.entity.Nota;
import com.projetointegrador.diarioclasse.repository.AlunoRepository;
import com.projetointegrador.diarioclasse.repository.AvaliacaoRepository;
import com.projetointegrador.diarioclasse.repository.DisciplinaRepository;
import com.projetointegrador.diarioclasse.repository.NotaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotaService {

    private final NotaRepository notaRepository;
    private final AlunoRepository alunoRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final AvaliacaoRepository avaliacaoRepository;

    public NotaResponse registrar(NotaRequest request) {
        Aluno aluno = alunoRepository.findById(request.alunoId())
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado"));

        Disciplina disciplina = disciplinaRepository.findById(request.disciplinaId())
                .orElseThrow(() -> new EntityNotFoundException("Disciplina não encontrada"));

        Avaliacao avaliacao = avaliacaoRepository.findById(request.avaliacaoId())
                .orElseThrow(() -> new EntityNotFoundException("Avaliação não encontrada"));

        Optional<Nota> notaExistente = notaRepository.findByAlunoIdAndDisciplinaIdAndAvaliacaoId((
                request.alunoId()), request.disciplinaId(), request.avaliacaoId()
        );

        Nota nota;
        if (notaExistente.isPresent()) {
            // Atualiza
            nota = notaExistente.get();
            nota.setValor(request.valor());
        } else {
            // Cria nova

            nota = Nota.builder()
                    .valor(request.valor())
                    .dataLancamento(request.dataLancamento() != null ? request.dataLancamento() : LocalDate.now())
                    .aluno(aluno)
                    .disciplina(disciplina)
                    .avaliacao(avaliacao)
                    .build();
        }

//        return notaRepository.save(nota);

        return toResponse(notaRepository.save(nota));
    }

    public NotaResponse buscarPorId(Long id) {
        return notaRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Nota não encontrada"));
    }

    public List<NotaResponse> listarPorAluno(Long alunoId) {
        return notaRepository.findByAlunoId(alunoId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<NotaResponse> listarPorDisciplina(Long disciplinaId) {
        return notaRepository.findByDisciplinaId(disciplinaId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<NotaResponse> listarPorAvaliacao(Long avaliacaoId) {
        return notaRepository.findByAvaliacaoId(avaliacaoId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<MediaDisciplinaResponse> calcularMediaPorDisciplina(Long turmaId) {
        List<Disciplina> disciplinas = disciplinaRepository.findByTurmasId(turmaId);

        List<MediaDisciplinaResponse> medias = new ArrayList<>();

        for (Disciplina d : disciplinas) {
            Double media = notaRepository.findByDisciplinaIdAndAlunoTurmaId(d.getId(),turmaId)
                    .stream()
                    .mapToDouble(Nota::getValor)
                    .average()
                    .orElse(0.0);
            medias.add(new MediaDisciplinaResponse(d.getId(), d.getNome(), media));
        }

        return medias;
    }

    public List<EvolucaoBimestralResponse> listarEvolucaoBimestral(Long alunoId) {
        List<Nota> notas = notaRepository.findByAlunoId(alunoId);

        // Agrupa por bimestre (via avaliação) e disciplina
        Map<Integer, Map<String, Double>> medias = notas.stream()
                .filter(n -> n.getAvaliacao() != null && n.getAvaliacao().getBimestre() != null)
                .collect(Collectors.groupingBy(
                        n -> n.getAvaliacao().getBimestre(),
                        Collectors.groupingBy(
                                n -> n.getDisciplina().getNome(),
                                Collectors.averagingDouble(Nota::getValor)
                        )
                ));

        return medias.entrySet().stream()
                .map(e -> new EvolucaoBimestralResponse(
                        e.getKey(),
                        e.getValue()
                ))
                .sorted(Comparator.comparing(EvolucaoBimestralResponse::bimestre))
                .toList();
    }


    public void deletar(Long id) {
        if (!notaRepository.existsById(id)) {
            throw new EntityNotFoundException("Nota não encontrada");
        }
        notaRepository.deleteById(id);
    }

    private NotaResponse toResponse(Nota nota) {
        return new NotaResponse(
                nota.getId(),
                nota.getValor(),
                nota.getDataLancamento(),
                nota.getAluno().getId(),
                nota.getAluno().getNome(),
                nota.getDisciplina().getId(),
                nota.getDisciplina().getNome(),
                nota.getAvaliacao().getId(),
                nota.getAvaliacao().getTitulo()
        );
    }
}

