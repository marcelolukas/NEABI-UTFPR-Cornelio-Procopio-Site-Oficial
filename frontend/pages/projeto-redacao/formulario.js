const formulario = document.getElementById('formulario');
const botoesTag = document.querySelectorAll('.tag-selecionavel');

let tagsEscolhidas = [];

// 1. Lógica dos Botões (Tags)
botoesTag.forEach(botao => {
    botao.addEventListener('click', () => {
        botao.classList.toggle('ativa');
        const valor = botao.getAttribute('data-value');
        
        if (botao.classList.contains('ativa')) {
            tagsEscolhidas.push(valor);
        } else {
            tagsEscolhidas = tagsEscolhidas.filter(item => item !== valor);
        }
    });
});

// 2. Lógica de Envio para o Java
formulario.onsubmit = function (event) {
    event.preventDefault();

    if (tagsEscolhidas.length === 0) {
        alert("Por favor, selecione pelo menos uma opção que te represente!");
        return; 
    }

    const RespostasDoFormulario = new FormData(formulario);

    // O pacote de dados que vai viajar para o Spring Boot
    const dadosParaEnviar = {
        nome: RespostasDoFormulario.get('nome'),
        perfilSelecionado: tagsEscolhidas
    };

    console.log("Enviando dados...", dadosParaEnviar);

    // 3. A Mágica da Conexão (O Fetch)
    fetch('http://localhost:8080/api/match', {
        method: 'POST', // Tipo de envio seguro
        headers: {
            'Content-Type': 'application/json' // Avisando o Java que é um JSON
        },
        body: JSON.stringify(dadosParaEnviar)  // Transformando o objeto JS em texto JSON
    })
    .then(resposta => resposta.text()) // Espera a resposta do Java
    .then(textoDoJava => {
        // Mostra a resposta do Java na tela do aluno!
        alert("Servidor respondeu: " + textoDoJava); 
    })
    .catch(erro => {
        console.error("Deu erro na conexão:", erro);
        alert("Oops! O servidor parece estar desligado.");
    });
};