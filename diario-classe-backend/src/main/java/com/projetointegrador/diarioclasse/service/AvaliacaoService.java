package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.request.AvaliacaoRequest;
import com.projetointegrador.diarioclasse.dto.request.ObservacaoRequest;
import com.projetointegrador.diarioclasse.dto.request.patchrequest.ObservacaoPatchRequest;
import com.projetointegrador.diarioclasse.dto.response.AvaliacaoResponse;
import com.projetointegrador.diarioclasse.dto.response.EvolucaoBimestralResponse;
import com.projetointegrador.diarioclasse.dto.response.ObservacaoResponse;
import com.projetointegrador.diarioclasse.entity.*;
import com.projetointegrador.diarioclasse.repository.AvaliacaoRepository;
import com.projetointegrador.diarioclasse.repository.DisciplinaRepository;
import com.projetointegrador.diarioclasse.repository.TurmaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;
    private final TurmaRepository turmaRepository;
    private final DisciplinaRepository disciplinaRepository;

    public AvaliacaoResponse criar(AvaliacaoRequest request) {
        Turma turma = turmaRepository.findById(request.turmaId())
                .orElseThrow(() -> new EntityNotFoundException("Turma não encontrada"));

        Disciplina disciplina = disciplinaRepository.findById(request.disciplinaId())
                .orElseThrow(() -> new EntityNotFoundException("Disciplina não encontrada"));

        Avaliacao avaliacao = Avaliacao.builder()
                .titulo(request.titulo())
                .data(request.data())
                .peso(request.peso())
                .bimestre(request.bimestre())
                .turma(turma)
                .disciplina(disciplina)
                .build();

        return toResponse(avaliacaoRepository.save(avaliacao));
    }

    public AvaliacaoResponse buscarPorId(Long id) {
        return avaliacaoRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Avaliação não encontrada"));
    }

    public List<AvaliacaoResponse> listarPorTurma(Long turmaId) {
        return avaliacaoRepository.findByTurmaId(turmaId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<AvaliacaoResponse> listarPorDisciplina(Long disciplinaId) {
        return avaliacaoRepository.findByDisciplinaId(disciplinaId).stream()
                .map(this::toResponse)
                .toList();
    }

    public AvaliacaoResponse atualizar(Long id, AvaliacaoRequest request) {
        Avaliacao avaliacao = avaliacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avaliação não encontrada"));

        Turma turma = turmaRepository.findById(request.turmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));
        Disciplina disciplina = disciplinaRepository.findById(request.disciplinaId())
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));

        avaliacao.setTitulo(request.titulo());
        avaliacao.setData(request.data());
        avaliacao.setPeso(request.peso());
        avaliacao.setBimestre(request.bimestre());
        avaliacao.setTurma(turma);
        avaliacao.setDisciplina(disciplina);

        avaliacaoRepository.save(avaliacao);
        return toResponse(avaliacao);
    }

    public AvaliacaoResponse patch(Long id, AvaliacaoRequest request) {
        Avaliacao avaliacao = avaliacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Observação não encontrada"));

        if (request.titulo() != null) avaliacao.setTitulo(request.titulo());
        if (request.data() != null) avaliacao.setData(request.data());
        if (request.peso() != null) avaliacao.setPeso(request.peso());
        if (request.bimestre() != null) avaliacao.setBimestre(request.bimestre());
        if (request.turmaId() != null) {
            Turma turma = turmaRepository.findById(request.turmaId())
                    .orElseThrow(() -> new RuntimeException("Turma não encontrada"));
            avaliacao.setTurma(turma);
        }
        if (request.disciplinaId() != null) {
            Disciplina disciplina = disciplinaRepository.findById(request.disciplinaId())
                    .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));
            avaliacao.setDisciplina(disciplina);
        }

        avaliacaoRepository.save(avaliacao);
        return toResponse(avaliacao);
    }

    public List<EvolucaoBimestralResponse> getEvolucaoBimestralPorTurma(Long turmaId) {
        List<Avaliacao> avaliacoes = avaliacaoRepository.findByTurmaId(turmaId);

        if (avaliacoes.isEmpty()) {
            return Collections.emptyList();
        }

        // Map: bimestre -> disciplina -> lista de notas
        Map<Integer, Map<String, List<Double>>> mediasMap = new HashMap<>();

        for (Avaliacao a : avaliacoes) {
            int bimestre = a.getBimestre();
            String disciplina = a.getDisciplina().getNome();

            mediasMap
                    .computeIfAbsent(bimestre, k -> new HashMap<>())
                    .computeIfAbsent(disciplina, k -> new ArrayList<>());

            List<Nota> notas = a.getNotas();
            if (notas == null || notas.isEmpty()) {
                // Mesmo sem notas lançadas, adiciona um placeholder 0.0 para não perder o bimestre
                mediasMap.get(bimestre).get(disciplina).add(0.0);
            } else {
                for (Nota n : notas) {
                    if (n.getValor() != null) {
                        mediasMap.get(bimestre).get(disciplina).add(n.getValor());
                    }
                }
            }
        }

        // Monta DTO
        List<EvolucaoBimestralResponse> resultado = new ArrayList<>();
        for (Integer bimestre : mediasMap.keySet()) {
            Map<String, Double> mediasPorDisciplina = new HashMap<>();
            for (Map.Entry<String, List<Double>> entry : mediasMap.get(bimestre).entrySet()) {
                List<Double> valores = entry.getValue();
                double media = valores.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
                mediasPorDisciplina.put(entry.getKey(), media);
            }
            resultado.add(new EvolucaoBimestralResponse(bimestre, mediasPorDisciplina));
        }

        resultado.sort(Comparator.comparing(EvolucaoBimestralResponse::bimestre));
        return resultado;
    }


    public void deletar(Long id) {
        if (!avaliacaoRepository.existsById(id)) {
            throw new EntityNotFoundException("Avaliação não encontrada");
        }
        avaliacaoRepository.deleteById(id);
    }

    private AvaliacaoResponse toResponse(Avaliacao avaliacao) {
        return new AvaliacaoResponse(
                avaliacao.getId(),
                avaliacao.getTitulo(),
                avaliacao.getData(),
                avaliacao.getPeso(),
                avaliacao.getBimestre(),
                avaliacao.getTurma().getId(),
                avaliacao.getDisciplina().getId(),
                avaliacao.calcularMedia()
        );
    }
}

