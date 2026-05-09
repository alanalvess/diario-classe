package com.projetointegrador.diarioclasse.controller;

import com.projetointegrador.diarioclasse.dto.DashboardDTO;
import com.projetointegrador.diarioclasse.dto.PessoaInfo;
import com.projetointegrador.diarioclasse.dto.response.AcessoResponseDTO;
import com.projetointegrador.diarioclasse.entity.Acesso;
import com.projetointegrador.diarioclasse.enums.Role;
import com.projetointegrador.diarioclasse.repository.AcessoRepository;
import com.projetointegrador.diarioclasse.service.AcessoQueryService;
import com.projetointegrador.diarioclasse.service.PessoaResolverService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/acessos")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class AcessoController {

    private final AcessoRepository repository;
    private final AcessoQueryService queryService;
    private final PessoaResolverService pessoaResolver;

    // 📊 DASHBOARD
    @GetMapping("/dashboard")
    public DashboardDTO dashboard() {
        return queryService.dashboardHoje();
    }

    // 📅 HOJE
    @GetMapping("/hoje")
    public List<AcessoResponseDTO> hoje() {

        List<Acesso> acessos = repository.findHoje(LocalDate.now());

        Map<String, PessoaInfo> pessoas = pessoaResolver.resolverEmLote(acessos);

        return acessos.stream()
                .map(a -> toDTO(a, pessoas))
                .toList();
    }

    // 🔍 FILTROS
    @GetMapping
    public List<AcessoResponseDTO> listar(
            @RequestParam(required = false) LocalDate data,
            @RequestParam(required = false) Long pessoaId,
            @RequestParam(required = false) Role role
    ) {

        List<Acesso> acessos = repository.buscarComFiltro(data, pessoaId, role);

        Map<String, PessoaInfo> pessoas = pessoaResolver.resolverEmLote(acessos);

        return acessos.stream()
                .map(a -> toDTO(a, pessoas))
                .toList();
    }

    @GetMapping("/ultimos")
    public List<AcessoResponseDTO> ultimos(
            @RequestParam(defaultValue = "10") int limite
    ) {

        List<Acesso> acessos = repository
                .findAll(PageRequest.of(0, limite, Sort.by("dataHora").descending()))
                .getContent();

        Map<String, PessoaInfo> pessoas = pessoaResolver.resolverEmLote(acessos);

        return acessos.stream()
                .map(a -> toDTO(a, pessoas))
                .toList();
    }

    private AcessoResponseDTO toDTO(Acesso a, Map<String, PessoaInfo> pessoas) {

        String chave = a.getRole().name() + "-" + a.getPessoaId();

        PessoaInfo info = pessoas.getOrDefault(
                chave,
                new PessoaInfo("Desconhecido", "Desconhecido", "-")
        );

        return new AcessoResponseDTO(
                a.getId(),
                a.getPessoaId(),
                info.nome(),
                info.role(),
                info.turma(),
                a.getTipo(),
                a.getData()
        );
    }
}
