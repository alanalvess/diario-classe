package com.diario.professorservice.mapper;

import com.diario.professorservice.dto.request.ProfessorRequest;
import com.diario.professorservice.dto.response.ProfessorResponse;
import com.diario.professorservice.entity.Professor;
import org.springframework.stereotype.Component;

@Component
public class ProfessorMapper {

    public Professor toEntity(ProfessorRequest request) {
        Professor entity = new Professor();

        entity.setNome(request.nome());
        entity.setDisciplinas(request.disciplinas());
        entity.setTurmas(request.turmas());

        return entity;
    }

    public ProfessorRequest toRequest(Professor professor) {
        return new ProfessorRequest(
                professor.getId(),
                professor.getNome(),
                professor.getDisciplinas(),
                professor.getTurmas()
        );
    }

    public ProfessorResponse toResponse(Professor professor) {
        return new ProfessorResponse(
                professor.getId(),
                professor.getNome(),
                professor.getDisciplinas(),
                professor.getTurmas()
        );
    }
}

