package com.projetointegrador.diarioclasse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

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
    private List<Professor> professores = new ArrayList<>();

    @ManyToMany(mappedBy = "disciplinas")
    private List<Turma> turmas = new ArrayList<>();

    @OneToMany(mappedBy = "disciplina")
    private List<Avaliacao> avaliacoes = new ArrayList<>();

    // média dos alunos na disciplina
    public Double calcularMediaDisciplina(Turma turma) {
        if (avaliacoes == null || avaliacoes.isEmpty()) return 0.0;
        return avaliacoes.stream().filter(a -> a.getTurma().equals(turma)).flatMap(a -> a.getNotas().stream()).mapToDouble(Nota::getValor).average().orElse(0.0);
    }

    // alunos inscritos na disciplina via turma
    public List<Aluno> listarAlunos(Turma turma) {
        if (turma == null || turma.getAlunos() == null) return new ArrayList<>();
        return turma.getAlunos();
    }

}

