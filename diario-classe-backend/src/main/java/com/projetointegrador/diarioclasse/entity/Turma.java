package com.projetointegrador.diarioclasse.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tb_turmas")
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String anoLetivo;

    private Double mediaTurma;
    private Double frequenciaMedia;

    @JoinTable(
            name = "turma_professor",
            joinColumns = @JoinColumn(name = "turma_id"),
            inverseJoinColumns = @JoinColumn(name = "professor_id")
    )

    @ManyToMany
    private Set<Professor> professores;


    @OneToMany(mappedBy = "turma")
    private List<Aluno> alunos;

    @OneToMany(mappedBy = "turma")
    private List<Avaliacao> avaliacoes;

    @ManyToMany
    private Set<Disciplina> disciplinas;

    // média de todas as notas de todos os alunos
    public Double calcularMediaTurma() {
        return 0.0;
    }

    // média de presença
    public Double calcularFrequenciaMedia() {
        return 0.0;
    }

    public List<Aluno> listarAlunos() {
        return new ArrayList<>();
    }

    public List<Disciplina> listarDisciplinas() {
        return new ArrayList<>();
    }
}