package com.projetointegrador.diarioclasse.utils;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RfidDebounce {

    private final Map<String, Long> ultimoUso = new ConcurrentHashMap<>();
    private static final long COOLDOWN_MS = 3000; // 3s

    public boolean podeProcessar(String uid) {
        long agora = System.currentTimeMillis();
        Long ultimo = ultimoUso.get(uid);

        if (ultimo == null || (agora - ultimo) > COOLDOWN_MS) {
            ultimoUso.put(uid, agora);
            return true;
        }
        return false;
    }
}
