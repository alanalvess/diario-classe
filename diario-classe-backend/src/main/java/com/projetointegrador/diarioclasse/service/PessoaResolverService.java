package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.PessoaInfo;
import com.projetointegrador.diarioclasse.entity.*;
import com.projetointegrador.diarioclasse.enums.Role;
import com.projetointegrador.diarioclasse.repository.AlunoRepository;
import com.projetointegrador.diarioclasse.repository.ProfessorRepository;
import com.projetointegrador.diarioclasse.repository.ResponsavelRepository;
import com.projetointegrador.diarioclasse.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PessoaResolverService {

    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final ResponsavelRepository responsavelRepository;
    private final UsuarioRepository usuarioRepository;

    public Map<String, PessoaInfo> resolverEmLote(List<Acesso> acessos) {

        // 🔑 chave: "ROLE-ID"
        Map<String, PessoaInfo> resultado = new HashMap<>();

        // separar IDs por tipo
        Map<Role, List<Long>> idsPorTipo = acessos.stream()
                .collect(Collectors.groupingBy(
                        Acesso::getRole,
                        Collectors.mapping(Acesso::getPessoaId, Collectors.toList())
                ));

        // 🔵 ALUNOS (com turma)
        if (idsPorTipo.containsKey(Role.ALUNO)) {

            List<Aluno> alunos = alunoRepository.findAllById(idsPorTipo.get(Role.ALUNO));

            for (Aluno a : alunos) {
                String turmaNome = a.getTurma() != null ? a.getTurma().getNome() : "-";

                resultado.put(
                        chave(Role.ALUNO, a.getId()),
                        new PessoaInfo(a.getNome(), "Aluno", turmaNome)
                );
            }
        }

        // 🟢 PROFESSORES
        if (idsPorTipo.containsKey(Role.PROFESSOR)) {

            List<Professor> professores = professorRepository.findAllById(idsPorTipo.get(Role.PROFESSOR));

            for (Professor p : professores) {
                resultado.put(
                        chave(Role.PROFESSOR, p.getId()),
                        new PessoaInfo(p.getNome(), "Professor", "-")
                );
            }
        }

        // 🟡 RESPONSÁVEIS
        if (idsPorTipo.containsKey(Role.RESPONSAVEL)) {

            List<Responsavel> responsaveis = responsavelRepository.findAllById(idsPorTipo.get(Role.RESPONSAVEL));

            for (Responsavel r : responsaveis) {
                resultado.put(
                        chave(Role.RESPONSAVEL, r.getId()),
                        new PessoaInfo(r.getNome(), "Responsável", "-")
                );
            }
        }

        // 🔴 USUÁRIOS (admin/coordenador)
        if (idsPorTipo.containsKey(Role.COORDENADOR)
                || idsPorTipo.containsKey(Role.ADMIN)
                || idsPorTipo.containsKey(Role.USER)) {

            List<Long> ids = new ArrayList<>();

            ids.addAll(idsPorTipo.getOrDefault(Role.COORDENADOR, List.of()));
            ids.addAll(idsPorTipo.getOrDefault(Role.ADMIN, List.of()));
            ids.addAll(idsPorTipo.getOrDefault(Role.USER, List.of()));

            List<Usuario> usuarios = usuarioRepository.findAllById(ids);

            for (Usuario u : usuarios) {
                resultado.put(
                        chave(Role.COORDENADOR, u.getId()),
                        new PessoaInfo(u.getNome(), "User", "-")
                );
            }
        }

        return resultado;
    }

    private String chave(Role role, Long id) {
        return role.name() + "-" + id;
    }
}
