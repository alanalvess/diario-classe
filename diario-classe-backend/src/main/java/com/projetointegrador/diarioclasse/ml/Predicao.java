package com.projetointegrador.diarioclasse.ml;

import com.projetointegrador.diarioclasse.entity.Aluno;

public class Predicao {

    private Aluno aluno;
    private boolean riscoReprovacao;
    private boolean riscoEvasao;
    private double scoreRisco; // 0 a 1, quanto maior mais crítico

    public Predicao(Aluno aluno, boolean riscoReprovacao, boolean riscoEvasao, double scoreRisco) {
        this.aluno = aluno;
        this.riscoReprovacao = riscoReprovacao;
        this.riscoEvasao = riscoEvasao;
        this.scoreRisco = scoreRisco;
    }

    // getters
    public Aluno getAluno() { return aluno; }
    public boolean isRiscoReprovacao() { return riscoReprovacao; }
    public boolean isRiscoEvasao() { return riscoEvasao; }
    public double getScoreRisco() { return scoreRisco; }
}
