package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.request.ResponsavelRequest;
import com.projetointegrador.diarioclasse.dto.request.patchrequest.ResponsavelPatchRequest;
import com.projetointegrador.diarioclasse.dto.response.ResponsavelResponse;
import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Responsavel;
import com.projetointegrador.diarioclasse.repository.AlunoRepository;
import com.projetointegrador.diarioclasse.repository.ResponsavelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResponsavelService {

    private final ResponsavelRepository responsavelRepository;
    private final AlunoRepository alunoRepository;

    public ResponsavelResponse criar(ResponsavelRequest request) {
        List<Aluno> alunos = request.alunoIds().stream()
                .map(id -> alunoRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Aluno não encontrado: " + id)))
                .collect(Collectors.toList());

        Responsavel responsavel = Responsavel.builder()
                .nome(request.nome())
                .email(request.email())
                .telefone(request.telefone())
                .alunos(alunos)
                .build();

        responsavelRepository.save(responsavel);
        return toResponse(responsavel);
    }

    public ResponsavelResponse atualizar(Long id, ResponsavelRequest request) {
        Responsavel responsavel = responsavelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Responsável não encontrado"));

        List<Aluno> alunos = request.alunoIds().stream()
                .map(alunoId -> alunoRepository.findById(alunoId)
                        .orElseThrow(() -> new RuntimeException("Aluno não encontrado: " + alunoId)))
                .collect(Collectors.toList());

        responsavel.setNome(request.nome());
        responsavel.setEmail(request.email());
        responsavel.setTelefone(request.telefone());
        responsavel.setAlunos(alunos);

        responsavelRepository.save(responsavel);
        return toResponse(responsavel);
    }

    public ResponsavelResponse patch(Long id, ResponsavelPatchRequest request) {
        Responsavel responsavel = responsavelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Responsável não encontrado"));

        if (request.nome() != null) responsavel.setNome(request.nome());
        if (request.email() != null) responsavel.setEmail(request.email());
        if (request.telefone() != null) responsavel.setTelefone(request.telefone());

        responsavelRepository.save(responsavel);
        return toResponse(responsavel);
    }

    public void deletar(Long id) {
        Responsavel responsavel = responsavelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Responsável não encontrado"));
        responsavelRepository.delete(responsavel);
    }

    public ResponsavelResponse buscarPorId(Long id) {
        return responsavelRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Responsável não encontrado"));
    }

    public List<ResponsavelResponse> listarTodos() {
        return responsavelRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    private ResponsavelResponse toResponse(Responsavel r) {
        List<Long> alunoIds = r.getAlunos() != null
                ? r.getAlunos().stream().map(Aluno::getId).collect(Collectors.toList())
                : Collections.emptyList();

        return new ResponsavelResponse(
                r.getId(),
                r.getNome(),
                r.getEmail(),
                r.getTelefone(),
                alunoIds
        );
    }
}
