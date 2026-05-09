package com.projetointegrador.diarioclasse.service;

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

//@Service
//@RequiredArgsConstructor
//public class RfidService {
//
//    private final RfidCartaoRepository cartaoRepository;
//    private final AlunoRepository alunoRepository;
//    private final AcessoService acessoService;
//    private final PresencaService presencaService;
//    private final RfidDebounce rfidDebounce;
//    private final RfidIdempotency rfidIdempotency;
//    private final UsuarioRepository usuarioRepository;
//
////    public RfidResponseDTO processarLeitura(RfidLeituraRequest request) {
////
////        // 🔹 1. Normaliza UID (remove espaços, caracteres invisíveis e coloca em maiúsculas)
////        String uid = request.uid() == null ? "" : request.uid().trim().replace(" ", "").toUpperCase();
////        System.out.println("UID recebido: '" + uid + "' length=" + uid.length());
////
//
//    /// /        // 🔹 2. Validação básica do UID
////        if (!uid.matches("[A-F0-9]{7,}")) {
////            return RfidResponseDTO.erro("UID inválido");
////        }
////
////        // 🔹 3. Debounce (evita múltiplas leituras rápidas)
////        if (!rfidDebounce.podeProcessar(uid)) {
////            return new RfidResponseDTO(
////                    "erro",
////                    "Aguarde",
////                    "Leitura muito rápida",
////                    "IGNORADO",
////                    "--:--",
////                    "-"
////            );
////        }
////
////        // 🔹 4. Idempotência (evita duplicação por retry/offline)
////        String chave = uid + "_" + Instant.now().getEpochSecond();
////        if (rfidIdempotency.isDuplicado(chave)) {
////            return RfidResponseDTO.erro("Leitura duplicada");
////        }
////
////        // 🔹 5. Busca cartão
////        var cartao = cartaoRepository.findByUidIgnoreCase(uid)
////                .orElseThrow(() -> new RuntimeException("Cartão não cadastrado: " + uid));
////
////        if (!cartao.getAtivo()) {
////            return new RfidResponseDTO(
////                    "erro",
////                    "Desconhecido",
////                    "Cartão inativo",
////                    "FALHA",
////                    "--:--",
////                    "-"
////            );
////        }
////
////        Long pessoaId = cartao.getPessoaId();
////        Role role = cartao.getRole();
////
////        // 🔹 6. Horário controlado pelo backend
////        Instant agora = Instant.now();
////        String horario = LocalTime.now().toString().substring(0, 5); // HH:mm
////
////        // 🔹 7. Registra acesso
////        Acesso acesso = acessoService.registrarAcesso(pessoaId, role);
////
////        String nome = "Usuário";
////
////        // 🔹 8. Se for aluno → registra presença (uma vez por dia)
////        if (role == Role.ALUNO) {
////            Aluno aluno = alunoRepository.findById(pessoaId)
////                    .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
////            nome = aluno.getNome();
////            presencaService.registrarPresencaRFID(aluno, agora);
////        }
////
////        // 🔹 9. Resposta enriquecida para ESP32
////        return new RfidResponseDTO(
////                "ok",
////                nome,
////                acesso.getTipo() == TipoAcesso.ENTRADA ? "Bem-vindo" : "Até logo",
////                acesso.getTipo().name(),
////                horario,
////                role.name()
////        );
////    }
//    public RfidResponseDTO processarLeitura(RfidLeituraRequest request) {
//        String uid = request.uid().trim().toUpperCase();
//
//        // 1. Acha o cartão pelo UID
//        Rfid rfid = cartaoRepository.findByUidIgnoreCase(uid)
//                .orElseThrow(() -> new RuntimeException("Cartão não cadastrado"));
//
//        // 2. Busca o Usuário pelo E-mail do cartão para saber "QUEM" ele é (Role)
//        Usuario usuario = usuarioRepository.findByEmail(rfid.getEmail())
//                .orElseThrow(() -> new RuntimeException("Usuário não encontrado para este cartão"));
//
//        // 3. Pega a Role (considerando a primeira da lista)
//        Role role = usuario.getRoles().get(0);
//        String nome = usuario.getNome();
//
//        // 4. Executa lógica específica por tipo (Sem precisar mudar as tabelas)
//        switch (role) {
//            case ALUNO -> registrarPresencaAluno(rfid.getEmail());
//            case PROFESSOR -> registrarPontoProfessor(rfid.getEmail());
//            case RESPONSAVEL -> registrarEntradaResponsavel(rfid.getEmail());
//        }
//
//        // 5. Registra o acesso genérico
//        acessoService.registrarAcesso(usuario.getId(), role);
//
//        return new RfidResponseDTO(
//                "ok",
//                nome,
//                "Acesso Liberado",
//                role.name(),
//                LocalTime.now().toString().substring(0, 5),
//                role.name()
//        );
//    }
//
//    public void vincularCartao(RfidVincularRequest request) {
//
//        Optional<Rfid> existente = cartaoRepository.findByUidIgnoreCase(request.uid());
//
//        if (existente.isPresent()) {
//            throw new RuntimeException("Cartão já vinculado");
//        }
//
//        Rfid cartao = Rfid.builder()
//                .uid(request.uid().toUpperCase())
//                .pessoaId(request.pessoaId())
//                .role(Role.valueOf(request.role()))
//                .ativo(true)
//                .build();
//
//        cartaoRepository.save(cartao);
//    }
//}

@Service
@RequiredArgsConstructor
public class RfidService {

    private final RfidCartaoRepository cartaoRepository;
    private final UsuarioRepository usuarioRepository; // Injetar para validar roles
    private final AlunoRepository alunoRepository;
    private final AcessoService acessoService;
    private final PresencaService presencaService;
    private final RfidDebounce rfidDebounce;

//    public RfidResponseDTO processarLeitura(RfidLeituraRequest request) {
//        String uid = request.uid() == null ? "" : request.uid().trim().toUpperCase();
//        System.out.println("UID recebido: '" + uid + "' length=" + uid.length());
//
//        // 1. Debounce
//        if (!rfidDebounce.podeProcessar(uid)) {
//            return RfidResponseDTO.erro("Aguarde... Processando");
//        }
//
//        // 2. Busca o vínculo do RFID pelo UID
//        Rfid rfid = cartaoRepository.findByUidIgnoreCase(uid)
//                .orElseThrow(() -> new RuntimeException("Cartão não cadastrado: " + uid));
//
//        if (!rfid.getAtivo()) {
//            return RfidResponseDTO.erro("Cartão inativo");
//        }
//
//        // 3. Busca o Usuário pelo e-mail registrado no RFID
//        Usuario usuario = usuarioRepository.findByEmail(rfid.getEmail())
//                .orElseThrow(() -> new RuntimeException("Usuário não encontrado para o e-mail: " + rfid.getEmail()));
//
//        // 4. Identifica a Role principal
//        Role role = usuario.getRoles().stream().findFirst().orElse(Role.USER);
//
//        // 5. Registra o acesso (Usando o ID do usuário como referência central)
//        Acesso acesso = acessoService.registrarAcesso(usuario.getId(), role);
//
//        // 6. Lógica específica (Ex: se for aluno, buscar nome na tabela de alunos)
//        String nomeParaExibir = usuario.getNome();
//        if (role == Role.ALUNO) {
//            alunoRepository.findByEmailIgnoreCase(rfid.getEmail()).ifPresent(aluno -> {
//                // Aqui você pode disparar a presença usando o objeto aluno
//                // presencaService.registrar(aluno);
//            });
//        }
//
//        return new RfidResponseDTO(
//                "ok",
//                nomeParaExibir,
//                acesso.getTipo() == TipoAcesso.ENTRADA ? "Bem-vindo" : "Até logo",
//                role.name(),
//                LocalTime.now().toString().substring(0, 5),
//                role.name()
//        );
//    }

    public RfidResponseDTO processarLeitura(RfidLeituraRequest request) {
        String uid = request.uid() == null ? "" : request.uid().trim().toUpperCase();

        if (!rfidDebounce.podeProcessar(uid)) {
            return RfidResponseDTO.erro("Aguarde... Processando");
        }

        // 1. Busca vínculo RFID
        Rfid rfid = cartaoRepository.findByUidIgnoreCase(uid)
                .orElseThrow(() -> new RuntimeException("Cartão não cadastrado"));

        // 2. Busca Usuário Central
        Usuario usuario = usuarioRepository.findByEmail(rfid.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // 3. Define a Role (ajuste conforme sua lógica de lista de roles)
        Role role = usuario.getRoles().stream().findFirst().orElse(Role.USER);

        // 4. REGISTRA ACESSO (Sempre ocorre: Entrada ou Saída)
        Acesso acesso = acessoService.registrarAcesso(usuario.getId(), role);

        // 5. REGISTRA PRESENÇA (Apenas se for Aluno)
        if (role == Role.ALUNO) {
            // Buscamos o Aluno pelo e-mail para ter acesso à Turma e ID do aluno
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
}