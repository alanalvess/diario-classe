FROM openjdk:21-jdk-alpine

WORKDIR /config-service
COPY target/config-service.jar app.jar

EXPOSE 8888

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s CMD wget -qO- http://localhost:8888/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
