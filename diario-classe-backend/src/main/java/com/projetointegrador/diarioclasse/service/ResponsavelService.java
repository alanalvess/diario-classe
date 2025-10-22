package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.request.ResponsavelRequest;
import com.projetointegrador.diarioclasse.dto.request.patchrequest.ResponsavelPatchRequest;
import com.projetointegrador.diarioclasse.dto.response.AlunoResponse;
import com.projetointegrador.diarioclasse.dto.response.ResponsavelResponse;
import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Responsavel;
import com.projetointegrador.diarioclasse.repository.AlunoRepository;
import com.projetointegrador.diarioclasse.repository.ResponsavelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResponsavelService {

    private final ResponsavelRepository responsavelRepository;
    private final AlunoRepository alunoRepository;

    public ResponsavelResponse criar(ResponsavelRequest request) {
        List<Aluno> alunos = Optional.ofNullable(request.alunoIds())
                .orElse(List.of())
                .stream()
                .map(id -> alunoRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Aluno não encontrado: " + id)))
                .toList();


        Responsavel responsavel = Responsavel.builder()
                .nome(request.nome())
                .email(request.email())
                .telefone(request.telefone())
                .filiacao(request.filiacao())
                .alunos(alunos)
                .build();

        responsavelRepository.save(responsavel);
        return toResponse(responsavel);
    }

    public ResponsavelResponse criarParaAluno(Long alunoId, ResponsavelRequest request) {
        // 🔹 Busca o aluno
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado: " + alunoId));

        // 🔹 Cria o responsável
        Responsavel responsavel = Responsavel.builder()
                .nome(request.nome())
                .email(request.email())
                .telefone(request.telefone())
                .filiacao(request.filiacao())
                .alunos(new ArrayList<>()) // sempre lista mutável
                .build();

        // 🔹 Salva o responsável (gera ID)
        responsavelRepository.save(responsavel);

        // 🔹 Faz o vínculo bidirecional
        responsavel.getAlunos().add(aluno);
        aluno.getResponsaveis().add(responsavel);

        // 🔹 Salva ambos para garantir sincronização no banco
        responsavelRepository.save(responsavel);
        alunoRepository.save(aluno);

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
        responsavel.setFiliacao(request.filiacao());
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
        if (request.filiacao() != null) responsavel.setFiliacao(request.filiacao());

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

    public ResponsavelResponse buscarPorEmail(String email) {
        Responsavel responsavel = responsavelRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o email informado."));

        return toResponse(responsavel);
    }

    public List<ResponsavelResponse> listarTodos() {
        return responsavelRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<AlunoResponse> listarAlunosPorResponsavel(Long responsavelId) {
        Responsavel responsavel = responsavelRepository.findById(responsavelId)
                .orElseThrow(() -> new RuntimeException("Responsável não encontrado"));

        return responsavel.getAlunos().stream()
                .map(aluno -> new AlunoResponse(
                        aluno.getId(),
                        aluno.getNome(),
                        aluno.getMatricula(),
                        aluno.getDataNascimento(),
                        aluno.getTurma() != null ? aluno.getTurma().getId() : null,
                        aluno.getTurma() != null ? aluno.getTurma().getNome() : null
                ))
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
                r.getFiliacao(),
                alunoIds
        );
    }

}
