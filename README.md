# Site oficial do NEABI UTFPR Cornélio Procópio

## Chatbot

A API do chatbot usa Java 21, Spring Boot e a API compatível com OpenAI da Maritaca.

### Execução local

Defina a chave antes de iniciar a API:

```powershell
$env:MARITACA_API_KEY="sua-chave"
cd api-ai
.\mvnw.cmd spring-boot:run
```

Em desenvolvimento local, o widget usa `http://localhost:8081/api/chat`.

Se o chatbot responder que o assistente está temporariamente indisponível,
consulte o log da API. Uma resposta `401 invalid_api_key` indica que a chave
definida em `MARITACA_API_KEY` foi revogada, expirou ou foi copiada
incorretamente. Gere uma chave na plataforma da Maritaca, atualize a variável e
reinicie a API. Não coloque a chave no repositório.

### Docker

Copie `.env.example` para `.env`, preencha `MARITACA_API_KEY` e execute:

```powershell
docker compose up --build
```

### Site publicado

Quando frontend e API usam o mesmo domínio, o widget chama `/api/chat`. Se a API estiver em outro domínio, informe o endereço no carregamento do script:

```html
<script
  src="../../scripts/chatbot-widget.js"
  data-api-url="https://api.exemplo.org/api/chat"
></script>
```

A API permite requisições de outra origem. Em produção, prefira restringir o CORS ao domínio oficial do site.
