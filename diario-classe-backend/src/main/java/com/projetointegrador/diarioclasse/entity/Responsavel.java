package com.projetointegrador.diarioclasse.entity;

import com.projetointegrador.diarioclasse.enums.Filiacao;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

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

    @Column(unique = true)
    private String email;
    private String telefone;
    private Filiacao filiacao;

    @ManyToMany
    @JoinTable(
            name = "responsavel_aluno",
            joinColumns = @JoinColumn(name = "responsavel_id"),
            inverseJoinColumns = @JoinColumn(name = "aluno_id")
    )
    private List<Aluno> alunos = new ArrayList<>();

    public Responsavel(Long id, String nome, String email) {
        this.id = id;
        this.nome = nome;
        this.email = email;
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

