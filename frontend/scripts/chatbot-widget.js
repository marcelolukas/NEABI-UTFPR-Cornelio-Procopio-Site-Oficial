(function () {
  const API_URL = "http://localhost:8081/api/chat";
  const INVITE_DELAY_MS = 45000;
  const PERSONALIDADES = {
    "alessandra-korap": "Alessandra Korap",
    "angela-davis": "Angela Davis",
    "apucuana": "Apucuana",
    "bartolina-sisa": "Bartolina Sisa",
    "carolina-maria-de-jesus": "Carolina Maria de Jesus",
    "celia": "Celia Xakriaba",
    "dandara-dos-palmares": "Dandara dos Palmares",
    "deb-haaland": "Deb Haaland",
    "eliane-potiguara": "Eliane Potiguara",
    "harriet": "Harriet Tubman",
    "ida-b-wells-barnett": "Ida B. Wells-Barnett",
    "joenia": "Joenia Wapichana",
    "leila-gonzalez": "Lelia Gonzalez",
    "maria-doze-homens": "Maria Doze Homens",
    "mercedes-baptista": "Mercedes Baptista",
    "rosa-parks": "Rosa Parks",
    "sonia-guajajara": "Sonia Guajajara",
    "tereza-de-benguela": "Tereza de Benguela",
    "tuire-kayapo": "Tuire Kayapo",
    "wangari-maathai": "Wangari Maathai",
  };

  function getCurrentScriptUrl() {
    return document.currentScript ? document.currentScript.src : "";
  }

  function loadStylesheet() {
    if (document.querySelector('link[href$="chatbot-widget.css"]')) {
      return;
    }

    const scriptUrl = getCurrentScriptUrl();
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = scriptUrl
      ? new URL("../styles/chatbot-widget.css", scriptUrl).toString()
      : "../../styles/chatbot-widget.css";
    document.head.appendChild(link);
  }

  function getSlugFromPage() {
    const bodySlug = document.body.dataset.personalidade;

    if (bodySlug) {
      return normalizeSlug(bodySlug);
    }

    const fileName = window.location.pathname.split("/").pop() || "";

    return normalizeSlug(
      fileName
        .replace(".html", "")
        .replace(/^conheca_trajetoria_/, "")
        .replace(/^conhece_trajetoria_/, ""),
    );
  }

  function normalizeSlug(value) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/_/g, "-")
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function getPersonalidade(slug) {
    const bodyName = document.body.dataset.personalidadeNome;

    if (bodyName) {
      return bodyName.trim();
    }

    return PERSONALIDADES[slug] || slug.replace(/-/g, " ");
  }

  function createWidget(personalidade, slug) {
    const root = document.createElement("section");
    root.className = "neabi-chatbot";
    root.setAttribute("aria-label", "Assistente virtual NEABI");
    root.innerHTML = `
      <div class="neabi-chatbot__invite" data-chat-invite>
        <button class="neabi-chatbot__invite-close" type="button" aria-label="Fechar convite" data-chat-dismiss>×</button>
        <strong>Quer saber mais sobre ${escapeHtml(personalidade)}?</strong>
        <span>Pergunte para mim.</span>
      </div>

    <div class="botao-chat-bot">
  <button
    class="neabi-chatbot__launcher"
    type="button"
    aria-label="Abrir assistente NEABI"
    data-chat-open
  >
    <img
      class="img-chat-bot"
      src="/frontend/assets/ui/logo-chat-bot.png"
      alt="Ícone do chatbot"
    />

    <div class="chatbot-textos">
      <p class="titulo-chat-bot">CONVERSE COM A IA</p>

      <span>
        Tem alguma dúvida sobre ${escapeHtml(personalidade)}?
      </span>
      <p class = "chat-bot-subtitulo">Pergunte ao nosso ChatBot.</p>
    </div>
  </button>
</div>

      <div class="neabi-chatbot__window" role="dialog" aria-label="Chat do assistente NEABI" aria-hidden="true" data-chat-window>

        <header class="neabi-chatbot__header">
          <div>
            <strong>Assistente NEABI</strong>
            <span>Sobre: ${escapeHtml(personalidade)}</span>
          </div>
          <div class="neabi-chatbot__actions">
            <button type="button" aria-label="Minimizar chat" data-chat-minimize>_</button>
            <button type="button" aria-label="Fechar chat" data-chat-close>×</button>
          </div>
        </header>

        <div class="neabi-chatbot__messages" data-chat-messages aria-live="polite">
          <article class="neabi-chatbot__message neabi-chatbot__message--bot">
            <p>Olá! 👋 Quer saber mais sobre  ${escapeHtml(personalidade)} ou sobre a exposição Vozes Negras e Indígenas promovida pelo NEABI TIA CIATA? Pode me perguntar!</p>
          </article>
        </div>

        <form class="neabi-chatbot__form" data-chat-form>
          <label class="neabi-chatbot__sr-only" for="neabi-chatbot-message">Digite sua pergunta</label>
          <textarea id="neabi-chatbot-message" name="message" rows="2" maxlength="1200" placeholder="Digite sua pergunta..." data-chat-input required></textarea>
          <button type="submit" aria-label="Enviar pergunta">Enviar</button>
        </form>
      </div>
    `;

    root.dataset.personalidade = personalidade;
    root.dataset.slug = slug;
    document.body.appendChild(root);
    return root;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatMarkdown(text) {
    if (typeof marked === "undefined" || typeof DOMPurify === "undefined") {
      return escapeHtml(text);
    }

    const html = marked.parse(text);
    return DOMPurify.sanitize(html);
  }

  function setupWidget(root, personalidade, slug) {
    const launcher = root.querySelector("[data-chat-open]");
    const windowElement = root.querySelector("[data-chat-window]");
    const invite = root.querySelector("[data-chat-invite]");
    const dismissButton = root.querySelector("[data-chat-dismiss]");
    const minimizeButton = root.querySelector("[data-chat-minimize]");
    const closeButton = root.querySelector("[data-chat-close]");
    const form = root.querySelector("[data-chat-form]");
    const input = root.querySelector("[data-chat-input]");
    const messages = root.querySelector("[data-chat-messages]");
    const submitButton = form.querySelector("button");
    const inviteKey = `neabi-chatbot-invite-${slug}`;

    function openChat() {
      root.classList.add("is-open");
      root.classList.remove("is-dismissed");
      windowElement.setAttribute("aria-hidden", "false");
      sessionStorage.setItem(inviteKey, "shown");
      input.focus();
      const botaochat = root.querySelector(".botao-chat-bot");
      botaochat.styledisplay ="none";
    }

    function minimizeChat() {
      root.classList.remove("is-open");
      windowElement.setAttribute("aria-hidden", "true");
    }

    function closeChat() {
      minimizeChat();
      root.classList.add("is-dismissed");
      sessionStorage.setItem(inviteKey, "shown");
    }

    function showInviteOnce() {
      if (sessionStorage.getItem(inviteKey)) {
        return;
      }

      root.classList.add("has-invite");
      sessionStorage.setItem(inviteKey, "shown");
    }

    function addMessage(text, author) {
      const message = document.createElement("article");
      const content = document.createElement("div");

      message.className = `neabi-chatbot__message neabi-chatbot__message--${author}`;
      content.className = "neabi-chatbot__message-content";

      if (author === "bot") {
        content.innerHTML = formatMarkdown(text);
      } else {
        content.textContent = text;
      }

      message.appendChild(content);
      messages.appendChild(message);
      messages.scrollTop = messages.scrollHeight;

      return message;
    }

    function setLoading(isLoading) {
      root.classList.toggle("is-loading", isLoading);
      input.disabled = isLoading;
      submitButton.disabled = isLoading;
    }

    async function sendMessage(text) {
      const message = text.trim();

      if (!message) {
        return;
      }

      addMessage(message, "user");
      input.value = "";
      setLoading(true);

      const loadingMessage = addMessage(
        "Estou pensando na melhor resposta para você...",
        "bot",
      );

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            personalidade,
          }),
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.answer || "Nao foi possivel responder agora.");
        }

        loadingMessage.querySelector(
          ".neabi-chatbot__message-content",
        ).innerHTML = formatMarkdown(
          data.answer || "Nao recebi uma resposta da API.",
        );
      } catch (error) {
        loadingMessage.querySelector(
          ".neabi-chatbot__message-content",
        ).innerHTML = formatMarkdown(
          error.message ||
            "Nao consegui conectar com a API. Verifique se o api-ai esta rodando na porta 8081.",
        );
      } finally {
        setLoading(false);
        input.focus();
      }
    }

    launcher.addEventListener("click", openChat);
    invite.addEventListener("click", (event) => {
      if (!event.target.closest("[data-chat-dismiss]")) {
        openChat();
      }
    });
    dismissButton.addEventListener("click", (event) => {
      event.stopPropagation();
      root.classList.remove("has-invite");
    });
    minimizeButton.addEventListener("click", minimizeChat);
    closeButton.addEventListener("click", closeChat);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      sendMessage(input.value);
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form.requestSubmit();
      }
    });

    window.setTimeout(showInviteOnce, INVITE_DELAY_MS);
  }

  function init() {
    const slug = getSlugFromPage();

    if (!slug) {
      return;
    }

    loadStylesheet();
    const personalidade = getPersonalidade(slug);
    const root = createWidget(personalidade, slug);
    setupWidget(root, personalidade, slug);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
