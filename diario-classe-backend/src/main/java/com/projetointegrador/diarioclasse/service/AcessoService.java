package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.entity.Acesso;
import com.projetointegrador.diarioclasse.enums.Role;
import com.projetointegrador.diarioclasse.enums.TipoAcesso;
import com.projetointegrador.diarioclasse.repository.AcessoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AcessoService {

    @Autowired
    private AcessoRepository acessoRepository;

    public Acesso registrarAcesso(Long pessoaId, Role role) {

        LocalDate hoje = LocalDate.now();
        LocalDateTime inicio = hoje.atStartOfDay();
        LocalDateTime fim = hoje.plusDays(1).atStartOfDay();

        List<Acesso> acessosHoje = acessoRepository.findByRoleAndData(pessoaId, role, inicio, fim);

        TipoAcesso tipo;
        if (acessosHoje.isEmpty()) {
            tipo = TipoAcesso.ENTRADA;
        } else {
            Acesso ultimo = acessosHoje.get(acessosHoje.size() - 1);
            tipo = ultimo.getTipo() == TipoAcesso.ENTRADA ? TipoAcesso.SAIDA : TipoAcesso.ENTRADA;
        }

        Acesso acesso = Acesso.builder()
                .pessoaId(pessoaId)
                .role(role)
                .data(LocalDateTime.now())
                .tipo(tipo)
                .build();

        return acessoRepository.save(acesso);
    }
}