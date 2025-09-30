package com.projetointegrador.diarioclasse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Collections;
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
    @JoinTable(
            name = "responsavel_aluno",
            joinColumns = @JoinColumn(name = "responsavel_id"),
            inverseJoinColumns = @JoinColumn(name = "aluno_id")
    )
    private Set<Aluno> alunos;

    public Responsavel(Long id, String nome, String email) {
        this.id = id;
        this.nome = nome;
        this.email = email;
    }

    public List<Nota> visualizarNotasDoFilho(Aluno aluno) {
        if (alunos == null || !alunos.contains(aluno)) return Collections.emptyList();
        return aluno.getAlunoDisciplinas().stream()
                .flatMap(ad -> ad.getDisciplina().getAvaliacoes().stream())
                .flatMap(av -> av.getNotas().stream())
                .filter(n -> n.getAluno().equals(aluno))
                .toList();
    }

    public List<Presenca> visualizarPresencaDoFilho(Aluno aluno) {
        if (alunos == null || !alunos.contains(aluno)) return Collections.emptyList();
        return aluno.getPresencas();
    }

    public List<Observacao> visualizarObservacoesDoFilho(Aluno aluno) {
        if (alunos == null || !alunos.contains(aluno)) return Collections.emptyList();
        return aluno.getObservacoes();
    }
}

