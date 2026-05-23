package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.enums.Role;
import com.projetointegrador.diarioclasse.repository.AlunoRepository;
import com.projetointegrador.diarioclasse.repository.ProfessorRepository;
import com.projetointegrador.diarioclasse.repository.ResponsavelRepository;
import com.projetointegrador.diarioclasse.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import static com.projetointegrador.diarioclasse.enums.Role.ALUNO;

@Service
@RequiredArgsConstructor
public class PessoaIdResolverService {

    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final ResponsavelRepository responsavelRepository;
    private final UsuarioRepository usuarioRepository;

    public Long resolverPessoaId(String email, Role role) {

        return switch (role) {

            case ALUNO -> alunoRepository
                    .findByEmail(email)
                    .orElseThrow(() ->
                            new RuntimeException("Aluno não encontrado"))
                    .getId();

            case PROFESSOR -> professorRepository
                    .findByEmail(email)
                    .orElseThrow(() ->
                            new RuntimeException("Professor não encontrado"))
                    .getId();

            case RESPONSAVEL -> responsavelRepository
                    .findByEmail(email)
                    .orElseThrow(() ->
                            new RuntimeException("Responsável não encontrado"))
                    .getId();

            case ADMIN, USER, COORDENADOR -> usuarioRepository
                    .findByEmail(email)
                    .orElseThrow(() ->
                            new RuntimeException("Usuário não encontrado"))
                    .getId();

            default -> throw new RuntimeException("Role inválida");
        };
    }
}
