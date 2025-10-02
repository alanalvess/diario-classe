package com.projetointegrador.diarioclasse.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Collections;
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

    @ManyToMany
    @JoinTable(
            name = "turma_professor",
            joinColumns = @JoinColumn(name = "turma_id"),
            inverseJoinColumns = @JoinColumn(name = "professor_id")
    )
    private Set<Professor> professores;

    @ManyToMany
    @JoinTable(
            name = "turma_disciplina",
            joinColumns = @JoinColumn(name = "turma_id"),
            inverseJoinColumns = @JoinColumn(name = "disciplina_id")
    )
    private List<Disciplina> disciplinas;

    @OneToMany(mappedBy = "turma")
    @JsonIgnoreProperties("turma")
    private List<Aluno> alunos;

    @OneToMany(mappedBy = "turma")
    private List<Avaliacao> avaliacoes;

    public Double calcularMediaTurma() {
        if (alunos == null || alunos.isEmpty()) return 0.0;
        return alunos.stream()
                .filter(a -> a.getAlunoDisciplinas() != null)
                .mapToDouble(Aluno::calcularMediaGeral)
                .average()
                .orElse(0.0);
    }

    public Double calcularFrequenciaMedia() {
        if (alunos == null || alunos.isEmpty()) return 0.0;
        return alunos.stream()
                .mapToDouble(Aluno::calcularFrequenciaGeral)
                .average()
                .orElse(0.0);
    }

    public List<Aluno> listarAlunos() {
        return alunos != null ? alunos : Collections.emptyList();
    }

    public List<Disciplina> listarDisciplinas() {
        return disciplinas != null ? new ArrayList<>(disciplinas) : Collections.emptyList();
    }
}