(function () {
  const galerias = document.querySelectorAll(".galeria-grid, [data-lightbox-galeria]");

  if (!galerias.length || document.querySelector(".galeria-lightbox")) {
    return;
  }

  const lightbox = document.createElement("div");
  const botaoFechar = document.createElement("button");
  const container = document.createElement("div");
  const imagem = document.createElement("img");

  lightbox.className = "galeria-lightbox";
  lightbox.setAttribute("aria-hidden", "true");

  botaoFechar.className = "galeria-lightbox-fechar";
  botaoFechar.type = "button";
  botaoFechar.setAttribute("aria-label", "Fechar imagem ampliada");
  botaoFechar.textContent = "×";

  container.className = "galeria-lightbox-container";
  imagem.className = "galeria-lightbox-imagem";
  imagem.alt = "";

  container.appendChild(imagem);
  lightbox.appendChild(botaoFechar);
  lightbox.appendChild(container);
  document.body.appendChild(lightbox);

  function abrirLightbox(img) {
    imagem.src = img.dataset.fullSrc || img.currentSrc || img.src;
    imagem.alt = img.alt || "Imagem ampliada";
    imagem.style.width = "";
    imagem.style.height = "";

    lightbox.classList.add("ativo");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-aberto");
  }

  function fecharLightbox() {
    lightbox.classList.remove("ativo");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-aberto");
  }

  galerias.forEach((galeria) => {
    galeria.addEventListener("click", (event) => {
      const img = event.target.closest("img");

      if (!img) {
        return;
      }

      abrirLightbox(img);
    });
  });

  botaoFechar.addEventListener("click", fecharLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      fecharLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("ativo")) {
      fecharLightbox();
    }
  });
})();
