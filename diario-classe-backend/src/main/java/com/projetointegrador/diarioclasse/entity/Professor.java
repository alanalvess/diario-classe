package com.projetointegrador.diarioclasse.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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

    @ManyToMany(mappedBy = "professores")
    private List<Turma> turmas = new ArrayList<>();

    @OneToMany(mappedBy = "professor")
    private List<Observacao> observacoes = new ArrayList<>();

}