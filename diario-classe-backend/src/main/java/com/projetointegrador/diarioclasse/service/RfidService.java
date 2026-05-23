package com.projetointegrador.diarioclasse.service;

import aj.org.objectweb.asm.commons.Remapper;
import com.projetointegrador.diarioclasse.dto.request.RfidLeituraRequest;
import com.projetointegrador.diarioclasse.dto.request.RfidVincularRequest;
import com.projetointegrador.diarioclasse.dto.response.RfidResponseDTO;
import com.projetointegrador.diarioclasse.entity.Acesso;
import com.projetointegrador.diarioclasse.entity.Aluno;
import com.projetointegrador.diarioclasse.entity.Rfid;
import com.projetointegrador.diarioclasse.entity.Usuario;
import com.projetointegrador.diarioclasse.enums.Role;
import com.projetointegrador.diarioclasse.enums.TipoAcesso;
import com.projetointegrador.diarioclasse.repository.AlunoRepository;
import com.projetointegrador.diarioclasse.repository.RfidCartaoRepository;
import com.projetointegrador.diarioclasse.repository.UsuarioRepository;
import com.projetointegrador.diarioclasse.utils.RfidDebounce;
import com.projetointegrador.diarioclasse.utils.RfidIdempotency;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RfidService {

    private final RfidCartaoRepository cartaoRepository;
    private final UsuarioRepository usuarioRepository; // Injetar para validar roles
    private final AlunoRepository alunoRepository;
    private final AcessoService acessoService;
    private final PresencaService presencaService;
    private final RfidDebounce rfidDebounce;
    private final PessoaIdResolverService pessoaIdResolverService;

    public RfidResponseDTO processarLeitura(RfidLeituraRequest request) {
        String uid = request.uid() == null ? "" : request.uid().trim().toUpperCase();

        if (!rfidDebounce.podeProcessar(uid)) {
            return RfidResponseDTO.erro("Aguarde... Processando");
        }

        Rfid rfid = cartaoRepository.findByUidIgnoreCase(uid)
                .orElseThrow(() -> new RuntimeException("Cartão não cadastrado"));

        Usuario usuario = usuarioRepository.findByEmail(rfid.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Role role = usuario.getRoles().stream().findFirst().orElse(Role.USER);

        Long pessoaId = pessoaIdResolverService.resolverPessoaId(rfid.getEmail(), role);

//        Acesso acesso = acessoService.registrarAcesso(usuario.getId(), role);
        Acesso acesso = acessoService.registrarAcesso(pessoaId, role);

        if (role == Role.ALUNO) {
            alunoRepository.findByEmailIgnoreCase(rfid.getEmail()).ifPresent(aluno -> {
                // O método registrarPresencaRFID já tem a trava para não duplicar no dia
                presencaService.registrarPresencaRFID((Aluno) aluno, Instant.now());
            });
        }

        return new RfidResponseDTO(
                "ok",
                usuario.getNome(),
                acesso.getTipo() == TipoAcesso.ENTRADA ? "Bem-vindo" : "Até logo",
                role.name(),
                LocalTime.now().toString().substring(0, 5),
                role.name()
        );
    }

    public void vincularCartao(RfidVincularRequest request) {
        // Valida se o usuário existe antes de vincular o e-mail ao UID
        usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Não existe usuário cadastrado com este e-mail"));

        Optional<Rfid> existente = cartaoRepository.findByUidIgnoreCase(request.uid());
        if (existente.isPresent()) {
            throw new RuntimeException("Este UID já está vinculado a outro e-mail");
        }

        Rfid cartao = Rfid.builder()
                .uid(request.uid().toUpperCase())
                .email(request.email().toLowerCase())
                .ativo(true)
                .build();

        cartaoRepository.save(cartao);
    }

    public Optional<Rfid> buscarPorEmail(String email) {
        return cartaoRepository.findByEmailIgnoreCase(email);
    }
}