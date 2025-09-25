package com.diario.professorservice.service;

import com.diario.professorservice.dto.request.ProfessorRequest;
import com.diario.professorservice.dto.response.ProfessorResponse;
import com.diario.professorservice.entity.Professor;
import com.diario.professorservice.mapper.ProfessorMapper;
import com.diario.professorservice.repository.ProfessorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final ProfessorMapper professorMapper;

    public ProfessorService(ProfessorRepository professorRepository, ProfessorMapper professorMapper) {
        this.professorRepository = professorRepository;
        this.professorMapper = professorMapper;
    }

    public List<ProfessorResponse> listarTodos() {
        return professorRepository.findAll()
                .stream()
                .map(professorMapper::toResponse)
                .toList();
    }

    public ProfessorResponse buscarPorId(Long id) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado com ID: " + id));
        return professorMapper.toResponse(professor);
    }

    public ProfessorResponse buscarPorNome(String nome) {
        Professor professor = professorRepository.findByNomeIgnoreCase(nome)
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado com nome: " + nome));
        return professorMapper.toResponse(professor);
    }

    public ProfessorResponse cadastrar(ProfessorRequest request) {
        Professor professor = professorMapper.toEntity(request);
        Professor salvo = professorRepository.save(professor);
        return professorMapper.toResponse(salvo);
    }

    public ProfessorResponse atualizar(ProfessorRequest request) {
        Professor professor = professorRepository.findById(request.id())
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado com ID: " + request.id()));

        professor.atualizarCampo(request);
        Professor atualizado = professorRepository.save(professor);
        return professorMapper.toResponse(atualizado);
    }

    public ProfessorResponse atualizarAtributo(Long id, Map<String, Object> atributos) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado com ID: " + id));

        professor.atualizarAtributos(atributos);
        Professor atualizado = professorRepository.save(professor);
        return professorMapper.toResponse(atualizado);
    }

    public void deletar(Long id) {
        if (!professorRepository.existsById(id)) {
            throw new EntityNotFoundException("Professor não encontrado com ID: " + id);
        }
        professorRepository.deleteById(id);
    }
}
