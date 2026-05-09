package com.projetointegrador.diarioclasse.service;

import com.projetointegrador.diarioclasse.dto.DashboardDTO;
import com.projetointegrador.diarioclasse.entity.Acesso;
import com.projetointegrador.diarioclasse.enums.Role;
import com.projetointegrador.diarioclasse.enums.TipoAcesso;
import com.projetointegrador.diarioclasse.repository.AcessoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AcessoQueryService {

    private final AcessoRepository repository;

    public DashboardDTO dashboardHoje() {

        LocalDate hoje = LocalDate.now();

        List<Acesso> acessos = repository.findHoje(hoje);

        long entradas = acessos.stream()
                .filter(a -> a.getTipo() == TipoAcesso.ENTRADA)
                .count();

        long saidas = acessos.stream()
                .filter(a -> a.getTipo() == TipoAcesso.SAIDA)
                .count();

        Map<Role, Long> porTipo = acessos.stream()
                .collect(Collectors.groupingBy(
                        Acesso::getRole,
                        Collectors.counting()
                ));

        return new DashboardDTO(
                acessos.size(),
                entradas,
                saidas,
                porTipo
        );
    }
}
