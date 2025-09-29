package com.projetointegrador.diarioclasse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tb_responsaveis")
public class Responsavel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String email;
    private String telefone;

    @ManyToMany
    private Set<Aluno> alunos;

    // Métodos
    public List<Nota> visualizarNotasDoFilho(Aluno aluno) {
        return new ArrayList<>();
    }

    public List<Presenca> visualizarPresencaDoFilho(Aluno aluno) {
        return new ArrayList<>();
    }

    public List<Observacao> visualizarObservacoesDoFilho(Aluno aluno) {
        return new ArrayList<>();
    }

}

