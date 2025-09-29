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
@Table(name = "tb_professores")
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String email;

    @ManyToMany
    private Set<Disciplina> disciplinas;

    @ManyToMany(mappedBy = "professores")
    private List<Turma> turmas;

    public void registrarNota(Aluno aluno, Avaliacao avaliacao, Double valor) {
        return;
    }

    public void registrarPresenca(Aluno aluno, Turma turma, Boolean presente, String metodoChamada) {
        return;
    }
    public void registrarObservacao(Aluno aluno, String descricao, String categoria) {
        return;
    }
    public List<Aluno> listarAlunosPorDisciplina(Disciplina disciplina) {
        return new ArrayList<>();
    }
    public List<Avaliacao> listarAvaliacoesPorTurma(Turma turma) {
        return new ArrayList<>();
    }
}