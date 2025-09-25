FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /workspace/app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src
RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /workspace/app/target/*.jar app.jar
EXPOSE ${PORT}
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s \
  CMD wget -qO- http://localhost:${PORT}/actuator/health || exit 1
ENTRYPOINT ["java", "-jar", "app.jar", "com.diario.professorservice.ProfessorServiceApplication"]
