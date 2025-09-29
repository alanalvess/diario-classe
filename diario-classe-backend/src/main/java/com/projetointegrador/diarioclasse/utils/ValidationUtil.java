package com.projetointegrador.diarioclasse.utils;

public class ValidationUtil {

    public static Boolean isEmailValid(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }
}
