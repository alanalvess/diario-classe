package com.diario.alunoservice.entity;

import com.diario.alunoservice.dto.request.AlunoRequest;
import com.diario.alunoservice.enums.Turno;
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
@Table(name = "tb_alunos")
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do aluno é obrigatório")
    @Column(unique = true)
    private String nome;

    @NotNull(message = "A matricula do aluno é obrigatória")
    @Column(unique = true)
    private String matricula;

    @NotNull(message = "A turma do aluno é obrigatória")
    private String turma;

    @Enumerated(EnumType.STRING)
    private Turno turno;

    private String perfilDeRisco;

    public Aluno(AlunoRequest request) {
        this.id = request.id();
        this.nome = request.nome();
        this.matricula = request.matricula();
        this.turma = request.turma();
        this.turno = request.turno();
        this.perfilDeRisco = request.perfilDeRisco();
    }

    public void atualizarCampo(AlunoRequest request) {
        this.nome = request.nome();
        this.matricula = request.matricula();
        this.turma = request.turma();
        this.turno = request.turno();
        this.perfilDeRisco = request.perfilDeRisco();
    }

    public void atualizarAtributos(Map<String, Object> atributos) {
        atributos.forEach((campo, valor) -> {
            switch (campo) {
                case "nome" -> this.nome = (String) valor;
                case "matricula" -> this.matricula = (String) valor;
                case "turma" -> this.turma = (String) valor;
                case "turno" -> this.turno = Turno.valueOf(valor.toString().toUpperCase());
                default -> throw new IllegalArgumentException("Campo não suportado: " + campo);
            }
        });
    }
}
