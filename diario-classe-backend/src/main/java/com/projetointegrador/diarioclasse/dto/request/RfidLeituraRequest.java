package com.projetointegrador.diarioclasse.dto.request;

import java.time.Instant;

public record RfidLeituraRequest(
        String uid,
        String deviceId,
        Instant timestamp
) {
}
