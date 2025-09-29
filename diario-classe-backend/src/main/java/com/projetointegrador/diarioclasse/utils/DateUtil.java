package com.projetointegrador.diarioclasse.utils;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class DateUtil {

    public static String formatarData(LocalDate data) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return data.format(formatter);
    }

    public static LocalDate converterParaLocalDate(String dataString) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            return LocalDate.parse(dataString, formatter);
        } catch (Exception e) {
            throw new IllegalArgumentException("Formato de data inválido. Use o formato dd/MM/yyyy.", e);
        }
    }


    public static Boolean isDataFutura(LocalDate data) {
        return data.isAfter(LocalDate.now());
    }
}
