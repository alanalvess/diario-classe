package com.projetointegrador.diarioclasse.ml;

import com.projetointegrador.diarioclasse.dto.request.AlunoAnaliseRequest;
import com.projetointegrador.diarioclasse.dto.response.PredicaoResponse;
import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Avaliacao;
import com.projetointegrador.diarioclasse.entity.Nota;
import com.projetointegrador.diarioclasse.entity.Presenca;
import com.projetointegrador.diarioclasse.repository.AlunoRepository;
import com.projetointegrador.diarioclasse.repository.AvaliacaoRepository;
import com.projetointegrador.diarioclasse.repository.NotaRepository;
import com.projetointegrador.diarioclasse.repository.PresencaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

//@Service
//public class AnaliseRiscoService {
//
//    private final double MEDIA_MINIMA = 6.0;
//    private final double PRESENCA_MINIMA = 75.0; // % de presença
//
////    public Predicao analisarAluno(Aluno aluno) {
////        // Média geral
//////        double media = aluno.calcularMediaGeral();
//////
//////        // Frequência geral
//////        double frequencia = aluno.calcularFrequenciaGeral();
////
//////        boolean riscoReprovacao = media < MEDIA_MINIMA;
//////        boolean riscoEvasao = frequencia < PRESENCA_MINIMA;
////
////        // score simples
//////        double score = (MEDIA_MINIMA - media > 0 ? (MEDIA_MINIMA - media)/10 : 0) +
//////                (PRESENCA_MINIMA - frequencia > 0 ? (PRESENCA_MINIMA - frequencia)/100 : 0);
////
//////        return new Predicao(aluno, riscoReprovacao, riscoEvasao, score);
////    }
//
////    public List<Predicao> analisarTurma(List<Aluno> alunos) {
////        return alunos.stream()
////                .map(this::analisarAluno)
////                .toList();
////    }
//}

@Service
public class AnaliseRiscoService {

    private static final double MEDIA_MINIMA = 6.0;
    private static final double FREQUENCIA_MINIMA = 75.0;

    private final AvaliacaoRepository avaliacaoRepository;
    private final PresencaRepository presencaRepository;
    private final NotaRepository notaRepository;

    public AnaliseRiscoService(AvaliacaoRepository avaliacaoRepository,
                               PresencaRepository presencaRepository,
                               NotaRepository notaRepository
    ) {
        this.avaliacaoRepository = avaliacaoRepository;
        this.presencaRepository = presencaRepository;
        this.notaRepository = notaRepository;
    }

    public Predicao analisarAluno(Aluno aluno) {
        double media = calcularMediaGeral(aluno);
        double frequencia = calcularFrequenciaGeral(aluno);

        boolean riscoReprovacao = media < MEDIA_MINIMA;
        boolean riscoEvasao = frequencia < FREQUENCIA_MINIMA;

        double score = (MEDIA_MINIMA - media > 0 ? (MEDIA_MINIMA - media)/10 : 0) +
                (FREQUENCIA_MINIMA - frequencia > 0 ? (FREQUENCIA_MINIMA - frequencia)/100 : 0);

        return new Predicao(aluno, riscoReprovacao, riscoEvasao, score);
    }


    public List<Predicao> analisarTurma(List<Aluno> alunos) {
        return alunos.stream()
                .map(this::analisarAluno)
                .toList();
    }

    public double calcularMediaGeral(Aluno aluno) {
        List<Nota> notas = notaRepository.findByAluno(aluno);

        if (notas.isEmpty()) return 0.0;

        double somaPesos = notas.stream()
                .mapToDouble(n -> n.getAvaliacao().getPeso() != null ? n.getAvaliacao().getPeso() : 1.0)
                .sum();

        double somaPonderada = notas.stream()
                .mapToDouble(n -> {
                    double peso = n.getAvaliacao().getPeso() != null ? n.getAvaliacao().getPeso() : 1.0;
                    return n.getValor() * peso;
                })
                .sum();

        return somaPesos > 0 ? somaPonderada / somaPesos : 0.0;
    }


    public double calcularFrequenciaGeral(Aluno aluno) {
        List<Presenca> presencas = presencaRepository.findByAluno(aluno);

        if (presencas == null || presencas.isEmpty()) return 0.0;

        long totalAulas = presencas.size();
        long presencasCount = presencas.stream()
                .filter(Presenca::getPresente) // true se presente
                .count();

        return (presencasCount * 100.0) / totalAulas;
    }



    private double calcularScore(double media, double frequencia) {
        double faltaMedia = Math.max(0, MEDIA_MINIMA - media) / 10.0;
        double faltaFreq = Math.max(0, FREQUENCIA_MINIMA - frequencia) / 100.0;
        return Math.min(1.0, faltaMedia + faltaFreq);
    }
}
