package com.projetointegrador.diarioclasse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tb_avaliacao")
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titulo;
    private LocalDate data;
    private Double peso;

    @ManyToOne
    @JoinColumn(name = "turma_id", nullable = false)
    private Turma turma;

    @ManyToOne
    @JoinColumn(name = "disciplina_id", nullable = false)
    private Disciplina disciplina;

    @OneToMany(mappedBy = "avaliacao")
    private List<Nota> notas;

    public Double calcularMedia() {
        if (notas == null || notas.isEmpty()) return 0.0;

        double soma = notas.stream()
                .mapToDouble(Nota::getValor)
                .sum();

        return soma / notas.size();
    }

    public Nota buscarNotaDoAluno(Aluno aluno) {
        return notas.stream()
                .filter(n -> n.getAluno().equals(aluno))
                .findFirst()
                .orElse(null);
    }
}
