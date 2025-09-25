FROM openjdk:21-jdk-alpine

WORKDIR /aluno-server
COPY target/aluno-service.jar app.jar

EXPOSE 8093

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s CMD wget -qO- http://localhost:8093/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
