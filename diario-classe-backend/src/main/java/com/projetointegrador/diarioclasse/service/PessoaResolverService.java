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

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PessoaResolverService {

    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final ResponsavelRepository responsavelRepository;
    private final UsuarioRepository usuarioRepository;

    public Map<String, PessoaInfo> resolverEmLote(List<Acesso> acessos) {

        Map<String, PessoaInfo> resultado = new HashMap<>();

        // IDs agrupados por tipo de acesso
        Map<Role, List<Long>> idsPorTipo = new HashMap<>();
        for (Acesso a : acessos) {
            Role r = a.getRole();
            if (r != null) {
                idsPorTipo.computeIfAbsent(r, k -> new ArrayList<>()).add(a.getPessoaId());
            }
        }

        // 🔵 ALUNOS
        List<Long> alunosIds = idsPorTipo.getOrDefault(Role.ALUNO, List.of());
        if (!alunosIds.isEmpty()) {
            List<Aluno> alunos = alunoRepository.findAllById(alunosIds);
            for (Aluno a : alunos) {
                String turmaNome = a.getTurma() != null ? a.getTurma().getNome() : "-";
                resultado.put(Role.ALUNO.name() + "-" + a.getId(), new PessoaInfo(a.getNome(), "Aluno", turmaNome));
            }
        }

        // 🟢 PROFESSORES
        List<Long> professoresIds = idsPorTipo.getOrDefault(Role.PROFESSOR, List.of());
        if (!professoresIds.isEmpty()) {
            List<Professor> professores = professorRepository.findAllById(professoresIds);
            for (Professor p : professores) {
                resultado.put(Role.PROFESSOR.name() + "-" + p.getId(), new PessoaInfo(p.getNome(), "Professor", "-"));
            }
        }

        // 🟡 RESPONSÁVEIS
        List<Long> responsaveisIds = idsPorTipo.getOrDefault(Role.RESPONSAVEL, List.of());
        if (!responsaveisIds.isEmpty()) {
            List<Responsavel> responsaveis = responsavelRepository.findAllById(responsaveisIds);
            for (Responsavel r : responsaveis) {
                resultado.put(Role.RESPONSAVEL.name() + "-" + r.getId(), new PessoaInfo(r.getNome(), "Responsável", "-"));
            }
        }

        // 🔴 USUÁRIOS
        Set<Long> usuarioIds = new HashSet<>();
        for (Role r : List.of(Role.ADMIN, Role.COORDENADOR, Role.USER)) {
            usuarioIds.addAll(idsPorTipo.getOrDefault(r, List.of()));
        }

        if (!usuarioIds.isEmpty()) {
            List<Usuario> usuarios = usuarioRepository.findAllById(usuarioIds);
            for (Usuario u : usuarios) {
                // Para cada Acesso deste usuário, coloca PessoaInfo com a role exata do Acesso
                for (Acesso a : acessos) {
                    if (a.getPessoaId().equals(u.getId())) {
                        resultado.put(a.getRole().name() + "-" + u.getId(), new PessoaInfo(u.getNome(), a.getRole().name(), "-"));
                    }
                }
            }
        }

        return resultado;
    }
}
