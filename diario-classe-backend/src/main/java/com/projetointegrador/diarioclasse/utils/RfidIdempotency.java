package com.projetointegrador.diarioclasse.utils;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RfidIdempotency {

    private final Map<String, Long> cache = new ConcurrentHashMap<>();
    private static final long TTL_MS = 5000;

    public boolean isDuplicado(String chave) {
        long agora = System.currentTimeMillis();

        Long ultimo = cache.get(chave);

        if (ultimo != null && (agora - ultimo) < TTL_MS) {
            return true;
        }

        cache.put(chave, agora);
        return false;
    }
}
