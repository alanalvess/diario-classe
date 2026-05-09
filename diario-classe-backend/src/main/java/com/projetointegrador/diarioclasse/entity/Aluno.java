package com.projetointegrador.diarioclasse.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.projetointegrador.diarioclasse.dto.ResponsavelDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tb_alunos")
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;

    private String email;
    private String matricula;
    private LocalDate dataNascimento;

    private Double mediaGeral;
    private Double frequenciaGeral;
    private Boolean riscoReprovacao;
    private Boolean riscoEvasao;

    @ManyToOne
    @JoinColumn(name = "turma_id", nullable = false)
    @JsonIgnoreProperties("alunos")
    private Turma turma;

    @ManyToMany(mappedBy = "alunos")
    private List<Responsavel> responsaveis = new ArrayList<>();

    @OneToMany(mappedBy = "aluno")
    private List<Presenca> presencas = new ArrayList<>();

    @OneToMany(mappedBy = "aluno")
    private List<Observacao> observacoes = new ArrayList<>();

    public Aluno(Long id, String nome, List<ResponsavelDTO> responsaveisDto) {
        this.id = id;
        this.nome = nome;
        this.responsaveis = responsaveisDto.stream()
                .map(r -> new Responsavel(null, r.nome(), r.email())).collect(Collectors.toList());
    }

//    public Double getFrequenciaPorDisciplina(Disciplina disciplina) {
//        if (presencas == null || disciplina == null) return 0.0;
//
//        var presencasDisciplina = presencas.stream()
//                .filter(p -> p.getTurma().getDisciplinas().contains(disciplina))
//                .toList();
//
//        if (presencasDisciplina.isEmpty()) return 0.0;
//
//        long presentes = presencasDisciplina.stream().filter(Presenca::isPresente).count();
//        return (presentes * 100.0) / presencasDisciplina.size();
//    }

//    public boolean estaEmRiscoEvasao(Disciplina disciplina, Double frequenciaMinima) {
//        return getFrequenciaPorDisciplina(disciplina) < frequenciaMinima;
//    }

//    public List<Boolean> getPresencasPorDisciplina(Disciplina disciplina) {
//        if (presencas == null || disciplina == null) return Collections.emptyList();
//
//        return presencas.stream()
//                .filter(p -> p.getTurma().getDisciplinas().contains(disciplina))
//                .map(Presenca::isPresente)
//                .toList();
//    }
}
