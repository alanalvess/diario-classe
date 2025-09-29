package com.projetointegrador.diarioclasse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
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
    private Turma turma;

    @ManyToOne
    private Disciplina disciplina;

    @OneToMany(mappedBy = "avaliacao")
    private List<Nota> notas;

    // média ponderada das notas
    public Double calcularMedia() {
        Double media = 0.0;
        for (Nota nota : notas) {
            return 0.0;
        }
        return media;
    }

    public Nota buscarNotaDoAluno(Aluno aluno) {
        for (Nota nota : notas) {
            if (nota.getAluno().equals(aluno)) {
                return nota;
            }
        }
        return null;
    }

}
