package com.projetointegrador.diarioclasse.dto.response;

public record RfidResponseDTO(
        String status,
        String nome,
        String mensagem,
        String role,
        String horario,
        String tipoPessoa // 👈 NOVO
) {
    public static RfidResponseDTO erro(String msg) {
        return new RfidResponseDTO("erro", "-", msg, "-", "--:--", "-");
    }
}
