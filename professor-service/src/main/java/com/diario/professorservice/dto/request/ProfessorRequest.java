package com.diario.professorservice.dto.request;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


public record ProfessorRequest(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id,
        @Column(unique = true) @NotBlank(message = "O nome do professor é obrigatório") String nome,
        @Column(unique = true) @NotNull(message = "A disciplinas do professor é obrigatória") String disciplinas,
        @NotNull(message = "A turmas do professor é obrigatória") String turmas

) {
}
