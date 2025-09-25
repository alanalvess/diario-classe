package com.diario.alunoservice.dto.request;

import com.diario.alunoservice.enums.Turno;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


public record AlunoRequest(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id,
        @Column(unique = true) @NotBlank(message = "O nome do aluno é obrigatório") String nome,
        @Column(unique = true) @NotNull(message = "A matricula do aluno é obrigatória") String matricula,
        @NotNull(message = "A turma do aluno é obrigatória") String turma,
        @NotNull(message = "O turno do aluno é obrigatório") Turno turno,
        String perfilDeRisco
) {
}
