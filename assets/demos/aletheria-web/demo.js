(() => {
  "use strict";

  const copy = {
    en: {
      title: "Aletheria",
      browserNote: [
        "Your progress is stored in this browser. Clearing site data starts a new identity; there is no account recovery.\n",
        "Version with more features here: ",
        "[",
        { text: "play on Discord in English", href: "https://discord.gg/xZskWzzk2D", newTab: true },
        "] [",
        { text: "play on Telegram in Russian", href: "https://t.me/Aletheria_bot", newTab: true },
        "]",
      ],
      connecting: "Connecting…",
      ready: "Ready",
      working: "The aether is responding…",
      reconnecting: "Connection interrupted. Restoring the latest safe state…",
      failed: "Could not connect to the game. Please try again shortly.",
      inputLabel: "Enter your response",
      send: "Send"
    },
    ru: {
      title: "Алетерия",
      browserNote: [
        "Прогресс хранится в этом браузере. В случае очистки данных сайта будет создан новый профиль; восстановить старый профиль нельзя. "
      ],
      connecting: "Подключение…",
      ready: "Готово",
      working: "Эфир отвечает…",
      reconnecting: "Связь прервалась. Восстанавливаем последнее безопасное состояние…",
      failed: "Не удалось подключиться к игре. Попробуйте снова чуть позже.",
      inputLabel: "Введите ваш ответ",
      send: "Отправить"
    }
  };

  const configuredBase = window.GPTTRPG_DEMO && window.GPTTRPG_DEMO.apiBaseUrl;
  const apiBase = String(configuredBase || "http://localhost:8080").replace(/\/$/, "");
  const gameShell = document.querySelector(".game-shell");
  const transcript = document.querySelector("#transcript");
  const options = document.querySelector("#options");
  const navigationOptions = document.querySelector("#navigation-options");
  const submenuOptions = document.querySelector("#submenu-options");
  const status = document.querySelector("#connection-status");
  const browserNote = document.querySelector("#browser-note");
  const actionForm = document.querySelector("#action-form");
  const actionInput = document.querySelector("#action-input");
  const actionLabel = document.querySelector("#action-label");
  const sendAction = document.querySelector("#send-action");
  const submenuPanel = document.querySelector("#submenu-panel");
  const submenuMessages = document.querySelector("#submenu-messages");

  let ui = copy.en;
  let language = "en";
  let token = null;
  let tokenKey = null;
  let revision = 0;
  let viewMode = "menu";
  let inputAllowed = false;
  let missionInputAllowed = false;
  let overlayInputAllowed = false;
  let busy = false;
  let presentation = null;
  let streamArticle = null;
  let streamText = null;
  let submittedMissionAction = false;

  function endpoint(path) { return `${apiBase}${path}`; }

  function setStatus(text, isError = false) {
    status.textContent = text;
    status.classList.toggle("error", isError);
  }

  function renderBrowserNote(parts) {
    browserNote.replaceChildren();
    for (const part of parts || []) {
      if (typeof part === "string") {
        browserNote.append(document.createTextNode(part));
        continue;
      }
      const link = document.createElement("a");
      link.href = part.href;
      link.textContent = part.text;
      if (part.newTab) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      browserNote.append(link);
    }
  }

  function setBusy(value) {
    busy = value;
    transcript.setAttribute("aria-busy", String(value));
    for (const button of document.querySelectorAll(".options button, .action-form button")) {
      button.disabled = value;
    }
    updateControls();
  }

  function appendSafeFormatting(container, text, enabled) {
    if (!enabled) {
      container.append(document.createTextNode(text));
      return;
    }
    const pattern = /([*_])([^*_]+)\1/g;
    let cursor = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      container.append(document.createTextNode(text.slice(cursor, match.index)));
      const emphasis = document.createElement(match[1] === "*" ? "strong" : "em");
      emphasis.textContent = match[2];
      container.append(emphasis);
      cursor = pattern.lastIndex;
    }
    container.append(document.createTextNode(text.slice(cursor)));
  }

  function appendPassageFormatting(container, text, enabled) {
    const value = String(text || "");
    const labelMatch = /(^|\n)(\[[^\]\r\n]+\])\r?\n(?=▸)/.exec(value);
    if (!labelMatch) {
      appendSafeFormatting(container, value, enabled);
      return;
    }

    const labelStart = labelMatch.index + labelMatch[1].length;
    appendSafeFormatting(container, value.slice(0, labelStart), enabled);
    const label = document.createElement("span");
    label.className = "passage-label";
    label.textContent = labelMatch[2];
    container.append(label, document.createTextNode("\n"));
    appendSafeFormatting(container, value.slice(labelMatch.index + labelMatch[0].length), enabled);
  }

  function renderOptions(container, labels, source) {
    const choices = labels || [];
    container.replaceChildren();
    for (const label of choices) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.disabled = busy;
      button.addEventListener("click", () => submitAction(label, source));
      container.append(button);
    }
  }

  function renderControls(labels, source, menuNavigationCount = 0) {
    const choices = labels || [];
    let primaryChoices = choices;
    let navigationChoices = [];
    let submenuChoices = [];
    if (source === "mission" && choices.length >= 4) {
      primaryChoices = choices.slice(0, -4);
      submenuChoices = choices.slice(-4);
    } else if (source === "menu" && menuNavigationCount > 0) {
      const navigationStart = Math.max(0, choices.length - menuNavigationCount);
      primaryChoices = choices.slice(0, navigationStart);
      navigationChoices = choices.slice(navigationStart);
    }
    renderOptions(options, primaryChoices, source);
    renderOptions(navigationOptions, navigationChoices, source);
    renderOptions(submenuOptions, submenuChoices, source);
  }

  function createMessage(message, role = "game", isPassage = false) {
    const article = document.createElement("article");
    article.className = `message ${role === "user" ? "user-message" : "game-message"}`;
    article.classList.toggle("passage-message", isPassage);
    if (message.image) {
      const image = document.createElement("img");
      image.src = new URL(message.image, `${apiBase}/`).href;
      image.alt = "";
      article.append(image);
    }
    if (Array.isArray(message.parts)) {
      for (const part of message.parts) {
        const body = document.createElement("div");
        const appendFormatting = isPassage ? appendPassageFormatting : appendSafeFormatting;
        appendFormatting(body, part.text || "", Boolean(part.markdown));
        article.append(body);
      }
    } else {
      const body = document.createElement("div");
      const appendFormatting = isPassage ? appendPassageFormatting : appendSafeFormatting;
      appendFormatting(body, message.text || "", Boolean(message.markdown));
      article.append(body);
    }
    return article;
  }

  function isNearBottom(element) {
    return element.scrollHeight - element.scrollTop - element.clientHeight < 80;
  }

  function followTranscript(force = false) {
    if (force || submittedMissionAction || isNearBottom(transcript)) {
      transcript.scrollTop = transcript.scrollHeight;
    }
  }

  function updateControls() {
    const allowMainInput = viewMode === "mission"
      ? missionInputAllowed || overlayInputAllowed
      : inputAllowed;
    const submenuBlocksInput = viewMode === "mission"
      && !submenuPanel.hidden
      && !overlayInputAllowed;
    actionForm.hidden = !allowMainInput;
    actionInput.disabled = busy || submenuBlocksInput;
    sendAction.disabled = busy || submenuBlocksInput;
  }

  function renderOverlay(overlay) {
    submenuMessages.replaceChildren();
    overlayInputAllowed = false;
    if (!overlay) {
      submenuPanel.hidden = true;
      return;
    }
    submenuPanel.hidden = false;
    for (const message of overlay.messages || []) {
      submenuMessages.append(createMessage(message, "game"));
    }
    overlayInputAllowed = Boolean(overlay.inputAllowed);
  }

  function renderPresentation(nextPresentation, forceFollow = false) {
    if (!nextPresentation) return;
    const wasNearBottom = isNearBottom(transcript);
    const previousScrollTop = transcript.scrollTop;
    presentation = nextPresentation;
    viewMode = nextPresentation.viewMode === "mission" ? "mission" : "menu";
    gameShell.dataset.viewMode = viewMode;
    transcript.replaceChildren();
    streamArticle = null;
    streamText = null;

    if (viewMode === "mission") {
      for (const entry of nextPresentation.missionHistory || []) {
        transcript.append(createMessage(entry, entry.role, entry.role === "game"));
      }
      const submenuChoices = nextPresentation.overlay && nextPresentation.overlay.options || [];
      renderControls(
        submenuChoices.length ? submenuChoices : nextPresentation.missionOptions,
        submenuChoices.length ? "overlay" : "mission"
      );
      missionInputAllowed = Boolean(nextPresentation.missionInputAllowed);
      inputAllowed = false;
      renderOverlay(nextPresentation.overlay);
      if (forceFollow || submittedMissionAction || wasNearBottom) {
        transcript.scrollTop = transcript.scrollHeight;
      } else {
        transcript.scrollTop = previousScrollTop;
      }
    } else {
      transcript.style.removeProperty("height");
      for (const message of nextPresentation.messages || []) {
        transcript.append(createMessage(message, "game"));
      }
      renderControls(
        nextPresentation.options,
        "menu",
        nextPresentation.menuNavigationCount
      );
      inputAllowed = Boolean(nextPresentation.inputAllowed);
      missionInputAllowed = false;
      renderOverlay(null);
      transcript.scrollTop = 0;
    }
    updateControls();
  }

  function legacyPresentation(payload) {
    return {
      viewMode: "menu",
      messages: payload.messages || [],
      options: [],
      inputAllowed: payload.inputAllowed,
      menuNavigationCount: 0,
      missionHistory: [],
      missionOptions: [],
      missionInputAllowed: false,
      overlay: null
    };
  }

  function renderSnapshot(payload) {
    revision = payload.revision;
    renderPresentation(payload.presentation || legacyPresentation(payload), true);
    if (payload.processing) {
      setBusy(true);
      setStatus(ui.working);
      window.setTimeout(() => resync().catch(showFatal), 1500);
    } else {
      setBusy(false);
      setStatus(ui.ready);
    }
  }

  async function responseError(response) {
    try {
      const payload = await response.json();
      return payload.error && payload.error.message ? payload.error.message : `HTTP ${response.status}`;
    } catch (_) {
      return `HTTP ${response.status}`;
    }
  }

  async function createSession() {
    const response = await fetch(endpoint("/api/v1/session"), { method: "POST", cache: "no-store" });
    if (!response.ok) throw new Error(await responseError(response));
    const payload = await response.json();
    token = payload.token;
    localStorage.setItem(tokenKey, token);
    renderSnapshot(payload);
  }

  async function resync() {
    if (!token) return createSession();
    const response = await fetch(endpoint("/api/v1/session"), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store"
    });
    if (response.status === 401) {
      localStorage.removeItem(tokenKey);
      token = null;
      return createSession();
    }
    if (!response.ok) throw new Error(await responseError(response));
    renderSnapshot(await response.json());
  }

  function handleMessageEvent(event) {
    if (event.target === "overlay") {
      submenuPanel.hidden = false;
      if (event.replace) submenuMessages.replaceChildren();
      submenuMessages.append(createMessage(event, event.role));
      const submenuChoices = event.options || [];
      renderControls(
        submenuChoices.length ? submenuChoices : presentation && presentation.missionOptions,
        submenuChoices.length ? "overlay" : "mission"
      );
      return;
    }
    if (event.target === "menu") {
      viewMode = "menu";
      gameShell.dataset.viewMode = "menu";
      if (event.replace) transcript.replaceChildren();
      transcript.append(createMessage(event, event.role));
      renderControls(event.options, "menu", event.menuNavigationCount);
      renderOverlay(null);
      return;
    }
    transcript.append(createMessage(event, event.role));
    followTranscript();
  }

  function startStream(event) {
    const shouldFollow = submittedMissionAction || isNearBottom(transcript);
    streamArticle = createMessage(
      { text: event.prefix || "", image: event.image, markdown: true },
      "game",
      true
    );
    streamArticle.classList.add("stream");
    const body = document.createElement("div");
    if (event.label) {
      const label = document.createElement("span");
      label.className = "passage-label";
      label.textContent = `[${event.label}]`;
      body.append(label, document.createTextNode("\n"));
    }
    body.append(document.createTextNode(`${event.marker || "▸"} `));
    streamText = document.createElement("span");
    body.append(streamText);
    streamArticle.append(body);
    transcript.append(streamArticle);
    if (shouldFollow) transcript.scrollTop = transcript.scrollHeight;
  }

  function handleEvent(event) {
    if (event.type === "presentation") {
      renderPresentation(event.presentation, submittedMissionAction);
    } else if (event.type === "message") {
      handleMessageEvent(event);
    } else if (event.type === "stream_start") {
      startStream(event);
    } else if (event.type === "stream_delta" && streamText) {
      const shouldFollow = submittedMissionAction || isNearBottom(transcript);
      streamText.append(document.createTextNode(event.text || ""));
      if (shouldFollow) transcript.scrollTop = transcript.scrollHeight;
    } else if (event.type === "stream_reset" && streamText) {
      streamText.replaceChildren();
    } else if (event.type === "stream_end") {
      if (streamArticle && event.text) {
        const suffix = document.createElement("div");
        suffix.className = "stream-suffix";
        appendSafeFormatting(suffix, event.text, Boolean(event.markdown));
        streamArticle.append(suffix);
      }
      renderControls(event.options, "mission");
      streamArticle = null;
      streamText = null;
      followTranscript();
    } else if (event.type === "error") {
      setStatus(event.message || ui.failed, true);
    } else if (event.type === "state") {
      revision = event.revision;
      renderPresentation(event.presentation, submittedMissionAction);
      submittedMissionAction = false;
    }
  }

  async function readEvents(response) {
    if (!response.body) throw new Error("Streaming responses are not supported by this browser");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (line.trim()) handleEvent(JSON.parse(line));
      }
      if (done) break;
    }
    if (buffer.trim()) handleEvent(JSON.parse(buffer));
  }

  async function submitAction(value, source) {
    const submitted = String(value || "").trim();
    if (!submitted || busy) return;
    let waitingForResync = false;
    submittedMissionAction = source === "mission";
    if (viewMode === "mission" && !submenuPanel.hidden) {
      renderOverlay(null);
      if (presentation) presentation.overlay = null;
      if (source === "overlay") renderControls([], "overlay");
    }
    setBusy(true);
    setStatus(ui.working);
    try {
      const response = await fetch(endpoint("/api/v1/action"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ input: submitted, revision, source })
      });
      if (response.status === 409) {
        setStatus(ui.working);
        await resync();
        return;
      }
      if (response.status === 401) {
        localStorage.removeItem(tokenKey);
        token = null;
        await createSession();
        return;
      }
      if (!response.ok) {
        setStatus(await responseError(response), true);
        return;
      }
      actionInput.value = "";
      await readEvents(response);
      setStatus(ui.ready);
    } catch (error) {
      console.error(error);
      waitingForResync = true;
      setStatus(ui.reconnecting, true);
      window.setTimeout(() => resync().catch(showFatal), 1500);
    } finally {
      if (!waitingForResync) {
        setBusy(false);
        updateControls();
        submittedMissionAction = false;
      }
    }
  }

  function showFatal(error) {
    console.error(error);
    setBusy(false);
    setStatus(error && error.message ? error.message : ui.failed, true);
  }

  async function boot() {
    setStatus(ui.connecting);
    const response = await fetch(endpoint("/api/v1/config"), { cache: "no-store" });
    if (!response.ok) throw new Error(await responseError(response));
    const config = await response.json();
    language = config.language === "ru" ? "ru" : "en";
    ui = copy[language];
    document.documentElement.lang = language;
    document.querySelector("#game-title").textContent = ui.title;
    document.title = `${ui.title}`;
    renderBrowserNote(ui.browserNote);
    actionLabel.textContent = ui.inputLabel;
    sendAction.textContent = ui.send;
    actionInput.maxLength = config.maxInputChars;
    tokenKey = `gpttrpg.demo.session:${apiBase}:${language}`;
    token = localStorage.getItem(tokenKey);
    await resync();
  }

  actionForm.addEventListener("submit", event => {
    event.preventDefault();
    const source = viewMode === "mission"
      ? (overlayInputAllowed ? "overlay" : "mission")
      : "menu";
    submitAction(actionInput.value, source);
  });

  boot().catch(showFatal);
})();
