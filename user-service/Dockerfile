FROM openjdk:21-jdk-alpine

WORKDIR /user-service
COPY target/user-service.jar app.jar

EXPOSE 8091

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s CMD wget -qO- http://localhost:8091/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
