package com.diario.alunoservice.mapper;

import com.diario.alunoservice.dto.request.AlunoRequest;
import com.diario.alunoservice.dto.response.AlunoResponse;
import com.diario.alunoservice.entity.Aluno;
import org.springframework.stereotype.Component;

@Component
public class AlunoMapper {

    public Aluno toEntity(AlunoRequest request) {
        Aluno entity = new Aluno();

        entity.setNome(request.nome());
        entity.setMatricula(request.matricula());
        entity.setTurma(request.turma());
        entity.setTurno(request.turno());
        entity.setPerfilDeRisco(request.perfilDeRisco());

        return entity;
    }

    public AlunoRequest toRequest(Aluno aluno) {
        return new AlunoRequest(
                aluno.getId(),
                aluno.getNome(),
                aluno.getMatricula(),
                aluno.getTurma(),
                aluno.getTurno(),
                aluno.getPerfilDeRisco()
        );
    }

    public AlunoResponse toResponse(Aluno aluno) {
        return new AlunoResponse(
                aluno.getId(),
                aluno.getNome(),
                aluno.getMatricula(),
                aluno.getTurma(),
                aluno.getTurno(),
                aluno.getPerfilDeRisco()
        );
    }
}

