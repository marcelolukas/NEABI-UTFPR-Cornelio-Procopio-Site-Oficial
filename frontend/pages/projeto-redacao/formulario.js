formulario.onsubmit = function (event){
    event.preventDefault();

    const RespostasDoFormulario = new FormData(formulario)

    const Respostas = {
        nome: RespostasDoFormulario.get('nome'),
        comoSeDescreve: RespostasDoFormulario.get('como-se-descreveria'),
        atividadePreferida: RespostasDoFormulario.get('atividade-preferida'),
        pessoaQueSeInpira:RespostasDoFormulario.get('pessoa-inspira'),
        maiorSonho: RespostasDoFormulario.get('maior-sonho'),
        oQueGostariaDeMudar: RespostasDoFormulario.get('o-que-gostaria-de-mudar'),


    }

    console.log(Respostas);
}