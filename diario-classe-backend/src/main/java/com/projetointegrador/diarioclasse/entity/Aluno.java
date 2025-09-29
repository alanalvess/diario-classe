package com.projetointegrador.diarioclasse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tb_alunos")
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String matricula;
    private LocalDate dataNascimento;

    private Double mediaGeral;          // média de notas atual
    private Double frequenciaGeral;     // % de presença
    private Boolean riscoReprovacao;    // calculado via ML
    private Boolean riscoEvasao;        // calculado via ML


    @ManyToOne
    private Turma turma;

    @ManyToMany(mappedBy = "alunos")
    private Set<Responsavel> responsaveis;

    // média de todas as notas
    public Double calcularMediaGeral() {
        return 0.0;
    }

    // % de presenças
    public Double calcularFrequenciaGeral() {
        return 0.0;
    }

    // pode chamar ML ou regras simples
    public Boolean estaEmRiscoReprovacao() {
        return riscoReprovacao;
    }

    // idem
    public Boolean estaEmRiscoEvasao() {
        return riscoEvasao;
    }

    public List<Nota> getNotasPorDisciplina(Disciplina d) {
        List<Nota> notas = new ArrayList<>();
        return notas;
    }

    public List<Presenca> getPresencasPorDisciplina(Disciplina d) {
        List<Presenca> presencas = new ArrayList<>();
        return presencas;
    }
}
