const formulario = document.getElementById("formulario");
const botoesTag = document.querySelectorAll(".tag-selecionavel");

let tagsEscolhidas = [];

// 1. Lógica dos Botões (Tags) - Essa parte ficou perfeita e não muda!
botoesTag.forEach((botao) => {
  botao.addEventListener("click", () => {
    botao.classList.toggle("ativa");
    const valor = botao.getAttribute("data-value");

    if (botao.classList.contains("ativa")) {
      tagsEscolhidas.push(valor);
    } else {
      tagsEscolhidas = tagsEscolhidas.filter((item) => item !== valor);
    }
  });
});

// 2. Lógica de Envio para o Java (Agora moderna e Assíncrona!)
// Repare na palavra 'async' antes da palavra 'function'
formulario.onsubmit = async function (event) {
  event.preventDefault();

  if (tagsEscolhidas.length === 0) {
    alert("Por favor, selecione pelo menos uma opção que te represente!");
    return;
  }

  // Pegamos o nome do aluno caso a gente queira usar na tela de resultado
  const RespostasDoFormulario = new FormData(formulario);
  const nomeDoAluno = RespostasDoFormulario.get("nome");

  console.log(`O aluno ${nomeDoAluno} escolheu as tags:`, tagsEscolhidas);
  console.log("Buscando as personalidades no servidor...");

  // 3. A Mágica da Conexão (O Fetch via GET)
  try {
    // Vamos na rota /todas buscar a lista completa
    const resposta = await fetch("http://localhost:8080/api/match/todas");

    if (!resposta.ok) {
      throw new Error("Erro ao buscar as mulheres no servidor");
    }

    // Transformamos a resposta em uma lista do JavaScript
    const listaMulheres = await resposta.json();
    console.log("Resposta do backend (Lista de Mulheres):", listaMulheres);

    // ==========================================
    // 4. AQUI ENTRARÁ A LÓGICA DO MATCH!
    // ==========================================

    let pontuacaoDoMatch = 0;

    for(let tagsEscolhidas of resposta)


  } catch (error) {
    console.error("Erro na conexão:", error);
    alert("Oops! O servidor parece estar desligado.");
  }

};
