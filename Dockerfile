FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /workspace
COPY api-ai/pom.xml api-ai/pom.xml
COPY api-ai/src api-ai/src
COPY backend/src/main/resources/dados-mulheres backend/src/main/resources/dados-mulheres

RUN mvn -B -f api-ai/pom.xml -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app
COPY --from=build /workspace/api-ai/target/api-ai-0.0.1-SNAPSHOT.jar app.jar

ENV SERVER_PORT=8081
EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
