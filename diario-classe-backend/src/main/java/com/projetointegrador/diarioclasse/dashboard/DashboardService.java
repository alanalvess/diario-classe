package com.projetointegrador.diarioclasse.dashboard;

import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.ml.AnaliseRiscoService;
import com.projetointegrador.diarioclasse.ml.Predicao;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final AnaliseRiscoService analiseRiscoService;

    public DashboardService(AnaliseRiscoService analiseRiscoService) {
        this.analiseRiscoService = analiseRiscoService;
    }

    // Média das notas da turma
    public double calcularMediaTurma(List<Aluno> alunos) {
        return alunos.stream()
                .mapToDouble(Aluno::calcularMediaGeral)
                .average()
                .orElse(0.0);
    }

    // Frequência média da turma
    public double calcularFrequenciaMedia(List<Aluno> alunos) {
        return alunos.stream()
                .mapToDouble(Aluno::calcularFrequenciaGeral)
                .average()
                .orElse(0.0);
    }

    // Alunos em risco
    public List<Predicao> listarAlunosEmRisco(List<Aluno> alunos) {
        return analiseRiscoService.analisarTurma(alunos).stream()
                .filter(p -> p.isRiscoReprovacao() || p.isRiscoEvasao())
                .toList();
    }

    // Exemplo de agregação por score
    public Map<String, Long> contarRiscoPorCategoria(List<Aluno> alunos) {
        return listarAlunosEmRisco(alunos).stream()
                .collect(Collectors.groupingBy(
                        p -> p.isRiscoReprovacao() ? "Risco Reprovação" : "Risco Evasão",
                        Collectors.counting()
                ));
    }
}
