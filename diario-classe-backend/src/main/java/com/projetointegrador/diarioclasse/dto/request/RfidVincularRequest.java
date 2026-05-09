package com.projetointegrador.diarioclasse.dto.request;

import com.projetointegrador.diarioclasse.enums.Role;

//public record RfidVincularRequest(
//        String uid,
//        Long pessoaId,
//        String role
//) {
//
//}
public record RfidVincularRequest(
        String uid,
        String email // Mudou de Long pessoaId para String email
) {}