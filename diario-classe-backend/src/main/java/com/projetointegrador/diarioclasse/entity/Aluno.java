package com.projetointegrador.diarioclasse.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.projetointegrador.diarioclasse.dto.ResponsavelDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.catalina.util.ResourceSet;

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
    private String matricula;
    private LocalDate dataNascimento;

    private Double mediaGeral;          // média de notas atual
    private Double frequenciaGeral;     // % de presença
    private Boolean riscoReprovacao;    // calculado via ML
    private Boolean riscoEvasao;        // calculado via ML

    @ManyToOne
    @JoinColumn(name = "turma_id", nullable = false)
    @JsonIgnoreProperties("alunos")
    private Turma turma;

    @ManyToMany(mappedBy = "alunos")
    private List<Responsavel> responsaveis = new ArrayList<>();

    @OneToMany(mappedBy = "aluno")
    private List<AlunoDisciplina> alunoDisciplinas = new ArrayList<>();

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

    public Double calcularMediaGeral() {
        if (alunoDisciplinas == null || alunoDisciplinas.isEmpty()) return 0.0;

        List<Double[]> medias = alunoDisciplinas.stream()
                .filter(ad -> ad.getDisciplina() != null && ad.getDisciplina().getAvaliacoes() != null)
                .flatMap(ad -> ad.getDisciplina().getAvaliacoes().stream()
                        .filter(av -> av.getNotas() != null)
                        .map(av -> {
                            Double nota = av.getNotas().stream()
                                    .filter(n -> n.getAluno().equals(this))
                                    .map(Nota::getValor)
                                    .findFirst()
                                    .orElse(ad.getNotaFinal() != null ? ad.getNotaFinal() : 0.0);
                            return new Double[]{nota, av.getPeso()};
                        }))
                .toList();

        double somaNotas = medias.stream().mapToDouble(a -> a[0] * a[1]).sum();
        double somaPesos = medias.stream().mapToDouble(a -> a[1]).sum();

        return somaPesos > 0 ? somaNotas / somaPesos : 0.0;
    }

    public Double calcularFrequenciaGeral() {
        if (alunoDisciplinas == null || alunoDisciplinas.isEmpty() || presencas == null) return 0.0;

        var freqMap = alunoDisciplinas.stream()
                .filter(ad -> ad.getDisciplina() != null)
                .collect(Collectors.toMap(
                        AlunoDisciplina::getDisciplina,
                        ad -> presencas.stream()
                                .filter(p -> p.getTurma().getDisciplinas().contains(ad.getDisciplina()))
                                .mapToInt(p -> p.isPresente() ? 1 : 0)
                                .sum(),
                        Integer::sum
                ));

        var totalMap = alunoDisciplinas.stream()
                .filter(ad -> ad.getDisciplina() != null)
                .collect(Collectors.toMap(
                        AlunoDisciplina::getDisciplina,
                        ad -> (int) presencas.stream()
                                .filter(p -> p.getTurma().getDisciplinas().contains(ad.getDisciplina()))
                                .count(),
                        Integer::sum
                ));

        Double somaPercentuais = 0.0;
        int count = 0;
        for (Disciplina d : freqMap.keySet()) {
            int total = totalMap.getOrDefault(d, 0);
            if (total > 0) {
                Double percentual = (freqMap.get(d) * 100.0) / total;
                somaPercentuais += percentual;
                count++;
            }
        }

        return count > 0 ? somaPercentuais / count : 0.0;
    }

    public Double getFrequenciaPorDisciplina(Disciplina disciplina) {
        if (presencas == null || disciplina == null) return 0.0;

        var presencasDisciplina = presencas.stream()
                .filter(p -> p.getTurma().getDisciplinas().contains(disciplina))
                .toList();

        if (presencasDisciplina.isEmpty()) return 0.0;

        long presentes = presencasDisciplina.stream().filter(Presenca::isPresente).count();
        return (presentes * 100.0) / presencasDisciplina.size();
    }

    public boolean estaEmRiscoReprovacao(Double notaMinima) {
        return calcularMediaGeral() < notaMinima;
    }

    public boolean estaEmRiscoReprovacao(Disciplina disciplina, Double notaMinima) {
        return getNotasPorDisciplina(disciplina).stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0) < notaMinima;
    }

    public boolean estaEmRiscoEvasao(Double frequenciaMinima) {
        return calcularFrequenciaGeral() < frequenciaMinima;
    }

    public boolean estaEmRiscoEvasao(Disciplina disciplina, Double frequenciaMinima) {
        return getFrequenciaPorDisciplina(disciplina) < frequenciaMinima;
    }

    public List<Double> getNotasPorDisciplina(Disciplina disciplina) {
        if (alunoDisciplinas == null || disciplina == null) return Collections.emptyList();

        return alunoDisciplinas.stream()
                .filter(ad -> disciplina.equals(ad.getDisciplina()) && ad.getNotaFinal() != null)
                .map(AlunoDisciplina::getNotaFinal)
                .toList();
    }

    public List<Boolean> getPresencasPorDisciplina(Disciplina disciplina) {
        if (presencas == null || disciplina == null) return Collections.emptyList();

        return presencas.stream()
                .filter(p -> p.getTurma().getDisciplinas().contains(disciplina))
                .map(Presenca::isPresente)
                .toList();
    }
}
