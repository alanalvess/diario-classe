package com.projetointegrador.diarioclasse.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
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
    @JoinTable(
            name = "professor_disciplina",
            joinColumns = @JoinColumn(name = "professor_id"),
            inverseJoinColumns = @JoinColumn(name = "disciplina_id")
    )
    private Set<Disciplina> disciplinas;

    @ManyToMany(mappedBy = "professores")
    private Set<Turma> turmas;

    public Nota registrarNota(Aluno aluno, Avaliacao avaliacao, Double valor) {
        return Nota.builder()
                .aluno(aluno)
                .avaliacao(avaliacao)
                .disciplina(avaliacao.getDisciplina())
                .valor(valor)
                .dataLancamento(LocalDate.now())
                .build();
    }

    public Presenca registrarPresenca(Aluno aluno, Turma turma, Boolean presente, String metodoChamada) {
        return Presenca.builder()
                .aluno(aluno)
                .turma(turma)
                .data(LocalDate.now())
                .presente(presente)
                .metodoChamada(metodoChamada)
                .build();
    }

    public Observacao registrarObservacao(Aluno aluno, String descricao, String categoria) {
        return Observacao.builder()
                .aluno(aluno)
                .professor(this)
                .descricao(descricao)
                .categoria(categoria)
                .data(LocalDate.now())
                .build();
    }

    public List<Aluno> listarAlunosPorDisciplina(Disciplina disciplina) {
        return turmas.stream()
                .filter(t -> t.getDisciplinas().contains(disciplina))
                .flatMap(t -> t.getAlunos().stream())
                .toList();
    }

    public List<Avaliacao> listarAvaliacoesPorTurma(Turma turma) {
        return turma.getAvaliacoes() != null ? turma.getAvaliacoes() : List.of();
    }}