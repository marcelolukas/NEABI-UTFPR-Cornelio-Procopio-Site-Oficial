const parametros = new URLSearchParams(window.location.search);
const idBuscado = parametros.get("id");

function selecionar(seletor) {
  return document.querySelector(seletor);
}

function definirTexto(seletor, valor) {
  const elemento = selecionar(seletor);

  if (elemento && typeof valor === "string" && valor.trim()) {
    elemento.innerText = valor;
  }
}

function definirHtml(seletor, valor) {
  const elemento = selecionar(seletor);

  if (elemento && typeof valor === "string" && valor.trim()) {
    elemento.innerHTML = valor;
  }
}

function definirImagem(seletor, src, alt = "") {
  const elemento = selecionar(seletor);

  if (elemento && typeof src === "string" && src.trim()) {
    elemento.src = src;

    if (alt) {
      elemento.alt = alt;
    }
  }
}

function renderizarGaleria(galeria) {
  const galeriaGrid = selecionar(".galeria-grid");

  if (!galeriaGrid || !Array.isArray(galeria) || galeria.length === 0) {
    return;
  }

  const figuras = galeria.map((item) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    const descricao = document.createElement("p");
    const credito = document.createElement("p");

    img.src = item.src;
    img.alt = item.alt || "Imagem da galeria";
    descricao.className = "galeria-descricao";
    descricao.textContent = item.descricao || item.legenda || "";
    credito.className = "galeria-credito";
    credito.textContent = item.credito || "";

    figure.appendChild(img);
    figcaption.appendChild(descricao);
    figcaption.appendChild(credito);
    figure.appendChild(figcaption);

    return figure;
  });

  galeriaGrid.replaceChildren(...figuras);
}

function configurarLightboxGaleria() {
  const galeriaGrid = selecionar(".galeria-grid");

  if (!galeriaGrid || selecionar(".galeria-lightbox")) {
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
    imagem.src = img.currentSrc || img.src;
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

  galeriaGrid.addEventListener("click", (event) => {
    const img = event.target.closest("img");

    if (!img) {
      return;
    }

    abrirLightbox(img);
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
}

if (!idBuscado || !Array.isArray(window.detalhes_mulheres)) {
  // Sem ID na URL, a página segue usando o conteúdo estático do HTML.
} else {
  const mulher = detalhes_mulheres.find((item) => String(item.id) === idBuscado);

  if (mulher) {
    definirImagem("#img-fundo", mulher.img, mulher.nome || "");
    definirTexto("#nome-principal", mulher.nome);
    definirTexto("#citacao-principal", mulher.citacao);
    definirTexto("#nome-menu-1", mulher.nome);
    definirTexto("#nome-menu-2", mulher.nome);
    definirTexto("#nome-titulo", mulher.nome);
    definirHtml("#texto-biografia", mulher.biografia);
    renderizarGaleria(mulher.galeria);
    configurarLightboxGaleria();
  } else {
    configurarLightboxGaleria();
  }
}

configurarLightboxGaleria();
