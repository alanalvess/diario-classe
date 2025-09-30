package com.projetointegrador.diarioclasse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DiarioClasseApplication {

    public static void main(String[] args) {
        SpringApplication.run(DiarioClasseApplication.class, args);
    }

}
