package com.diario.alunoservice.service;

import com.diario.alunoservice.dto.request.AlunoRequest;
import com.diario.alunoservice.dto.response.AlunoResponse;
import com.diario.alunoservice.entity.Aluno;
import com.diario.alunoservice.mapper.AlunoMapper;
import com.diario.alunoservice.repository.AlunoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final AlunoMapper alunoMapper;

    public AlunoService(AlunoRepository alunoRepository, AlunoMapper alunoMapper) {
        this.alunoRepository = alunoRepository;
        this.alunoMapper = alunoMapper;
    }

    public List<AlunoResponse> listarTodos() {
        return alunoRepository.findAll()
                .stream()
                .map(alunoMapper::toResponse)
                .toList();
    }

    public AlunoResponse buscarPorId(Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado com ID: " + id));
        return alunoMapper.toResponse(aluno);
    }

    public AlunoResponse buscarPorNome(String nome) {
        Aluno aluno = alunoRepository.findByNomeIgnoreCase(nome)
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado com nome: " + nome));
        return alunoMapper.toResponse(aluno);
    }

    public AlunoResponse cadastrar(AlunoRequest request) {
        Aluno aluno = alunoMapper.toEntity(request);
        Aluno salvo = alunoRepository.save(aluno);
        return alunoMapper.toResponse(salvo);
    }

    public AlunoResponse atualizar(AlunoRequest request) {
        Aluno aluno = alunoRepository.findById(request.id())
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado com ID: " + request.id()));

        aluno.atualizarCampo(request);
        Aluno atualizado = alunoRepository.save(aluno);
        return alunoMapper.toResponse(atualizado);
    }

    public AlunoResponse atualizarAtributo(Long id, Map<String, Object> atributos) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado com ID: " + id));

        aluno.atualizarAtributos(atributos);
        Aluno atualizado = alunoRepository.save(aluno);
        return alunoMapper.toResponse(atualizado);
    }

    public void deletar(Long id) {
        if (!alunoRepository.existsById(id)) {
            throw new EntityNotFoundException("Aluno não encontrado com ID: " + id);
        }
        alunoRepository.deleteById(id);
    }
}
