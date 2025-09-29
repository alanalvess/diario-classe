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
@Table(name = "tb_observacao")
public class Observacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate data;
    private String descricao;

    @ManyToOne
    private Professor professor;

    @ManyToOne
    private Aluno aluno;

    private String categoria; // COMPORTAMENTO, PARTICIPACAO, ATIVIDADE

    public Boolean isCategoriaComportamento() {
        return "COMPORTAMENTO".equals(categoria);
    }

}
