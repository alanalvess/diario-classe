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
@Table(name = "tb_notas")
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double valor;

    @ManyToOne
    private Aluno aluno;

    @ManyToOne
    private Disciplina disciplina;

    @ManyToOne
    private Avaliacao avaliacao;

    private LocalDate dataLancamento;

    // normalmente apenas getters/setters, mas pode ter utilitário
    public Boolean estaAprovado(Double mediaMinima) {
        return valor >= mediaMinima;
    }
}
