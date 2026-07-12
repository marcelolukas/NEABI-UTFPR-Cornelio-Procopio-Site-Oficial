document.addEventListener("DOMContentLoaded", () => {
  const cabecalho = document.querySelector(".cabecalho");
  const botaoContato = document.querySelector(".botao-contato");
  const video = botaoContato ? botaoContato.querySelector(".icone-punho") : null;

  function obterLinkInicio() {
    const caminho = window.location.pathname.replace(/\\/g, "/");

    if (caminho.includes("/pages/mulheres/")) {
      return "../pagina_inicial.html";
    }

    if (caminho.includes("/pages/")) {
      return "pagina_inicial.html";
    }

    return "pages/pagina_inicial.html";
  }

  if (cabecalho && botaoContato && !cabecalho.querySelector(".botao-home-mobile")) {
    const botaoHomeMobile = document.createElement("a");

    botaoHomeMobile.className = "botao-home-mobile";
    botaoHomeMobile.href = obterLinkInicio();
    botaoHomeMobile.textContent = "Início";

    cabecalho.insertBefore(botaoHomeMobile, botaoContato);
  }

  if (botaoContato && video) {
    video.load();

    botaoContato.addEventListener("mouseenter", () => {
      video.currentTime = 0;
      video.play();
    });

    botaoContato.addEventListener("mouseleave", () => {
      video.pause();
      video.currentTime = 0;
    });
  }
});

const bgVideo = document.querySelector(".bg-video");

if (bgVideo) {
  bgVideo.playbackRate = 0.7;
}

