package com.projetointegrador.diarioclasse.entity;

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

    @ManyToOne
    private Aluno aluno;

    @ManyToOne
    private Turma turma;

    private String metodoChamada;

    // métodos utilitários
    public Boolean isFaltou() {
        return !presente;
    }
}
