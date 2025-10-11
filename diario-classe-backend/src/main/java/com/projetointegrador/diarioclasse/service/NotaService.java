package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.request.NotaRequest;
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
import java.util.List;
import java.util.Optional;

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
                    .aluno(aluno)
                    .disciplina(disciplinaRepository.findById(request.disciplinaId()).orElseThrow())
                    .avaliacao(avaliacaoRepository.findById(request.avaliacaoId()).orElseThrow())
                    .dataLancamento(request.dataLancamento() != null ? request.dataLancamento() : LocalDate.now())
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
                nota.getAluno().getId(),
                nota.getAluno().getNome(),
                nota.getDisciplina().getId(),
                nota.getDisciplina().getNome(),
                nota.getAvaliacao().getId(),
                nota.getDataLancamento()
        );
    }
}

