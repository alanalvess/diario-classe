package com.projetointegrador.diarioclasse.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tb_presenca")
public class Presenca {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate data;
    private Boolean presente;
    private String metodoChamada;

    @ManyToOne
    @JoinColumn(name = "aluno_id", nullable = false)
    @JsonIgnoreProperties({"alunos", "presencas"})
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "turma_id", nullable = false)
    @JsonIgnoreProperties({"alunos", "presencas"})
    private Turma turma;

    // métodos utilitários
    public Boolean isPresente() {
        return Boolean.TRUE.equals(presente);
    }}
