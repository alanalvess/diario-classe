package com.projetointegrador.diarioclasse.ml;

import com.projetointegrador.diarioclasse.dto.request.AlunoAnaliseRequest;
import com.projetointegrador.diarioclasse.dto.response.PredicaoResponse;
import com.projetointegrador.diarioclasse.entity.Aluno;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnaliseRiscoService {

    private final double MEDIA_MINIMA = 6.0;
    private final double PRESENCA_MINIMA = 75.0; // % de presença

    public Predicao analisarAluno(Aluno aluno) {
        // Média geral
        double media = aluno.calcularMediaGeral();

        // Frequência geral
        double frequencia = aluno.calcularFrequenciaGeral();

        boolean riscoReprovacao = media < MEDIA_MINIMA;
        boolean riscoEvasao = frequencia < PRESENCA_MINIMA;

        // score simples
        double score = (MEDIA_MINIMA - media > 0 ? (MEDIA_MINIMA - media)/10 : 0) +
                (PRESENCA_MINIMA - frequencia > 0 ? (PRESENCA_MINIMA - frequencia)/100 : 0);

        return new Predicao(aluno, riscoReprovacao, riscoEvasao, score);
    }

    public List<Predicao> analisarTurma(List<Aluno> alunos) {
        return alunos.stream()
                .map(this::analisarAluno)
                .toList();
    }
}
