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
@Table(name = "tb_disciplinas")
public class Disciplina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String codigo;

    private Double mediaTurma;
    private Double frequenciaMedia;

    @ManyToMany(mappedBy = "disciplinas")
    private Set<Professor> professores;

    @ManyToMany(mappedBy = "disciplinas")
    private Set<Turma> turmas;

    @OneToMany(mappedBy = "disciplina")
    private List<Avaliacao> avaliacoes;

    // média dos alunos na disciplina
    public Double calcularMediaDisciplina(Turma turma) {
        return 0.0;
    }

    // alunos inscritos na disciplina via turma
    public List<Aluno> listarAlunos(Turma turma) {
        return new ArrayList<>();
    }

}

