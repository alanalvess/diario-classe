#FROM openjdk:21-jdk-oracle AS build
#
#WORKDIR /workspace/app
#
#COPY mvnw .
#COPY .mvn .mvn
#COPY pom.xml .
#COPY src src
#
#RUN chmod +x mvnw
#RUN ./mvnw clean package -DskipTests
#
#FROM openjdk:21-jdk-oracle
#
#WORKDIR /app
#
#COPY --from=build /workspace/app/target/*.jar app.jar
#
#ENTRYPOINT ["java", "-jar", "app.jar"]
FROM openjdk:21-jdk-oracle as build

WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN chmod +x ./mvnw

RUN ./mvnw install -DskipTests && \
    mkdir -p target/dependency && \
    (cd target/dependency; jar -xf ../*.jar)


FROM eclipse-temurin:21-jre-alpine

ARG DEPENDENCY=/workspace/app/target/dependency

COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

ENTRYPOINT ["java", "-cp", "app:app/lib/*", "com.projetointegrador.diarioclasse.DiarioClasseApplication"]
