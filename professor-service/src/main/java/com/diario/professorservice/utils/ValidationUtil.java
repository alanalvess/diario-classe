package com.diario.professorservice.utils;

public class ValidationUtil {

    public static boolean isEmailValid(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }
}
