package com.diario.professorservice.entity;

import com.diario.professorservice.dto.request.ProfessorRequest;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

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

    @NotBlank(message = "O nome do professor é obrigatório")
    @Column(unique = true)
    private String nome;

    @NotNull(message = "A disciplinas do professor é obrigatória")
    @Column(unique = true)
    private String disciplinas;

    @NotNull(message = "A turmas do professor é obrigatória")
    private String turmas;

    public Professor(ProfessorRequest request) {
        this.id = request.id();
        this.nome = request.nome();
        this.disciplinas = request.disciplinas();
        this.turmas = request.turmas();
    }

    public void atualizarCampo(ProfessorRequest request) {
        this.nome = request.nome();
        this.disciplinas = request.disciplinas();
        this.turmas = request.turmas();
    }

    public void atualizarAtributos(Map<String, Object> atributos) {
        atributos.forEach((campo, valor) -> {
            switch (campo) {
                case "nome" -> this.nome = (String) valor;
                case "disciplinas" -> this.disciplinas = (String) valor;
                case "turmas" -> this.turmas = (String) valor;
                default -> throw new IllegalArgumentException("Campo não suportado: " + campo);
            }
        });
    }
}
