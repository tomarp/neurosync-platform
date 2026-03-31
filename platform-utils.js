(function () {
  const STORAGE_KEY = "neurosyncPlatformContext";
  const FLOW_STEPS = [
    { id: "surveyBaseline", label: "Baseline survey", short: "01" },
    { id: "acclimation", label: "Acclimation", short: "02" },
    { id: "baseline", label: "Baseline recording", short: "03" },
    { id: "task1", label: "Task block 1", short: "04" },
    { id: "surveyPostTask1", label: "Post-task survey 1", short: "05" },
    { id: "task2", label: "Task block 2", short: "06" },
    { id: "surveyPostTask2", label: "Post-task survey 2", short: "07" },
    { id: "finish", label: "Completion", short: "08" },
  ];

  function defaultContext() {
    return {
      mode: "review",
      participantId: "",
      lightCondition: "",
      timeCluster: "",
    };
  }

  function readSessionContext() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return defaultContext();
      }
      return Object.assign(defaultContext(), JSON.parse(raw));
    } catch (error) {
      return defaultContext();
    }
  }

  function saveSessionContext(patch) {
    const next = Object.assign({}, readSessionContext(), patch || {});
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  function clearSessionContext() {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  function modeLabel(mode) {
    return mode === "live" ? "Live session mode" : "Review mode";
  }

  function formatTime(seconds) {
    const safeSeconds = Math.max(0, seconds);
    if (safeSeconds < 60) {
      return `${safeSeconds}s`;
    }
    const minutes = Math.floor(safeSeconds / 60);
    const remainder = String(safeSeconds % 60).padStart(2, "0");
    return `${minutes}:${remainder}`;
  }

  function timerMarkup() {
    return `
      <div class="timer-container" aria-live="polite">
        <svg class="timer-svg" viewBox="0 0 150 150" width="150" height="150" aria-hidden="true">
          <circle class="timer-circle-bg" cx="75" cy="75" r="66"></circle>
          <circle class="timer-circle" cx="75" cy="75" r="66"></circle>
        </svg>
        <div class="timer-text" data-timer-text>0s</div>
      </div>
    `;
  }

  function optionListMarkup(name, options, noteText) {
    const items = options
      .map(
        (option, index) => `
          <label class="option-row" data-option-row>
            <input type="radio" name="${name}" value="${index + 1}" data-option-input>
            <span><strong>${index + 1}.</strong> ${option}</span>
          </label>
        `
      )
      .join("");
    const noteHtml = noteText ? `<p class="task-note">${noteText}</p>` : "";
    return `<div class="options">${items}</div>${noteHtml}`;
  }

  function infoCardsMarkup(cards) {
    return `
      <div class="info-card-grid">
        ${cards
          .map(
            (card) => `
              <article class="info-card">
                <p class="info-card__label">${card.label}</p>
                <p class="info-card__value">${card.value}</p>
              </article>
            `
          )
          .join("")}
      </div>
    `;
  }

  function instructionListMarkup(items) {
    return `
      <div class="instruction-list">
        ${items.map((item) => `<p>${item}</p>`).join("")}
      </div>
    `;
  }

  function buildFormPage(title, subtitle, iframeUrl) {
    return `
      <div class="form-embed-shell">
        <iframe
          class="form-embed"
          src="${iframeUrl}"
          title="${title}"
          loading="lazy"
          referrerpolicy="no-referrer"
        ></iframe>
      </div>
      <div class="form-actions">
        <a class="secondary-link" href="${iframeUrl}" target="_blank" rel="noopener noreferrer">Open the survey in a new tab if the embed does not load</a>
      </div>
      <p class="form-note">${subtitle}</p>
    `;
  }

  function buildTaskMediaAudio(src, label) {
    return `
      <div class="media-panel media-panel--audio" data-media-panel>
        <audio controls preload="auto" class="audio-player" data-media-audio>
          <source src="${src}" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
        <p class="media-caption">${label}</p>
        <p class="media-status" data-media-status></p>
      </div>
    `;
  }

  function buildTaskMediaImage(src, alt) {
    return `
      <div class="media-panel media-panel--image" data-media-panel>
        <img class="task-image" src="${src}" alt="${alt}" loading="eager" decoding="async" data-media-image>
        <p class="media-status" data-media-status></p>
      </div>
    `;
  }

  function setPageData(pageId) {
    document.body.dataset.page = pageId;
    document.title = `${window.ExperimentConfig.app.name} | ${pageId}`;
  }

  function startTimer(seconds, onDone) {
    const timerText = document.querySelector("[data-timer-text]");
    const timerCircle = document.querySelector(".timer-circle");
    if (!timerText || !timerCircle) {
      return null;
    }

    const circumference = 2 * Math.PI * 66;
    timerCircle.style.strokeDasharray = `${circumference}`;
    timerCircle.style.strokeDashoffset = "0";

    let remaining = seconds;
    timerText.textContent = formatTime(remaining);

    const interval = window.setInterval(function () {
      remaining -= 1;
      timerText.textContent = formatTime(remaining);
      timerCircle.style.strokeDashoffset = `${circumference * (1 - Math.max(remaining, 0) / seconds)}`;

      if (remaining <= 0) {
        window.clearInterval(interval);
        onDone();
      }
    }, 1000);

    return interval;
  }

  function updateOptionState(scope) {
    const rows = scope.querySelectorAll("[data-option-row]");
    rows.forEach(function (row) {
      const input = row.querySelector("[data-option-input]");
      row.classList.toggle("is-selected", Boolean(input && input.checked));
    });
  }

  function bindOptionInteractions(scope) {
    const inputs = scope.querySelectorAll("[data-option-input]");
    if (!inputs.length) {
      return;
    }

    updateOptionState(scope);

    scope.addEventListener("change", function (event) {
      if (event.target && event.target.matches("[data-option-input]")) {
        updateOptionState(scope);
      }
    });

    const keyHandler = function (event) {
      const activeTag = document.activeElement && document.activeElement.tagName;
      const isTypingContext = activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT";
      if (isTypingContext || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const match = event.key.match(/^[1-9]$/);
      if (!match) {
        return;
      }
      const index = Number(match[0]) - 1;
      if (!inputs[index]) {
        return;
      }
      inputs[index].checked = true;
      inputs[index].dispatchEvent(new Event("change", { bubbles: true }));
      event.preventDefault();
    };

    window.addEventListener("keydown", keyHandler);
    scope.__optionKeyHandler = keyHandler;
  }

  function clearOptionInteractions(scope) {
    if (scope && scope.__optionKeyHandler) {
      window.removeEventListener("keydown", scope.__optionKeyHandler);
      delete scope.__optionKeyHandler;
    }
  }

  function bindMediaDiagnostics(scope) {
    scope.querySelectorAll("[data-media-image]").forEach(function (image) {
      const panel = image.closest("[data-media-panel]");
      const status = panel ? panel.querySelector("[data-media-status]") : null;

      function markMissing(message) {
        if (!panel || !status) {
          return;
        }
        panel.classList.add("is-missing");
        status.textContent = message;
      }

      image.addEventListener("error", function () {
        markMissing("Image could not be loaded. Verify the deployed media path.");
      });

      if (image.complete && image.naturalWidth === 0) {
        markMissing("Image could not be loaded. Verify the deployed media path.");
      }
    });

    scope.querySelectorAll("[data-media-audio]").forEach(function (audio) {
      const panel = audio.closest("[data-media-panel]");
      const status = panel ? panel.querySelector("[data-media-status]") : null;
      audio.addEventListener("error", function () {
        if (!panel || !status) {
          return;
        }
        panel.classList.add("is-missing");
        status.textContent = "Audio could not be loaded. Verify the deployed media path.";
      });
    });
  }

  function buildContextChips() {
    const context = readSessionContext();
    const chips = [
      { label: "Mode", value: modeLabel(context.mode), modifier: context.mode === "live" ? "is-live" : "is-review" },
      { label: "Participant", value: context.participantId || "Unset" },
      { label: "Lighting", value: context.lightCondition ? context.lightCondition.toUpperCase() : "Unset" },
      { label: "Time cluster", value: context.timeCluster ? context.timeCluster.toUpperCase() : "Unset" },
    ];

    return chips
      .map(
        (chip) => `
          <div class="context-chip ${chip.modifier ? `context-chip--${chip.modifier}` : ""}">
            <span>${chip.label}</span>
            <strong>${chip.value}</strong>
          </div>
        `
      )
      .join("");
  }

  function buildFlowRail(activeStage) {
    return `
      <aside class="stage-rail">
        <p class="stage-rail__eyebrow">Session map</p>
        <div class="stage-rail__steps">
          ${FLOW_STEPS.map(function (step) {
            const activeClass = step.id === activeStage ? "is-active" : "";
            return `
              <div class="rail-step ${activeClass}">
                <span class="rail-step__index">${step.short}</span>
                <span class="rail-step__label">${step.label}</span>
              </div>
            `;
          }).join("")}
        </div>
        <p class="stage-rail__note">Review mode enables fast-forward controls on timed stages. Live mode keeps the participant view cleaner.</p>
      </aside>
    `;
  }

  function shellMarkup(page, innerHtml) {
    const context = readSessionContext();
    if (context.mode === "live") {
      return `
        <div class="participant-shell">
          <section class="participant-stage-region">
            ${innerHtml}
          </section>
        </div>
      `;
    }

    return `
      <div class="app-shell app-shell--review">
        <header class="app-topbar app-topbar--review">
          <a class="app-brand" href="${window.ExperimentConfig.routes.start}">
            <img src="visuals/logo/neurosync-logo.svg" alt="NEUROSYNC" class="app-brand__logo app-brand__logo--full">
          </a>
          <div class="app-topbar__actions">
            <a class="topbar-link" href="${window.ExperimentConfig.routes.home}">Welcome</a>
            <a class="topbar-link" href="${window.ExperimentConfig.routes.start}">About</a>
          </div>
        </header>
        <div class="app-context-row">${buildContextChips()}</div>
        <div class="app-main">
          ${buildFlowRail(page.activeStage)}
          <section class="stage-region">
            <div class="mode-banner">Review view active.</div>
            ${innerHtml}
          </section>
        </div>
      </div>
    `;
  }

  function stageCardMarkup(page, reviewMode) {
    const reviewActionHtml = reviewMode && page.allowSkip !== false
      ? `<button class="review-skip-button" type="button" data-skip>${page.skipLabel || "Skip to next step"}</button>`
      : "";
    return `
      <section class="stage-card stage-card--${page.mode}${page.cardClass ? ` ${page.cardClass}` : ""}">
        <header class="stage-header">
          ${page.progressLabel ? `<p class="progress-chip">${page.progressLabel}</p>` : ""}
          <p class="eyebrow">${page.eyebrow || ""}</p>
          <h1>${page.title || ""}</h1>
          ${page.subtitle ? `<p class="stage-subtitle">${page.subtitle}</p>` : ""}
        </header>
        ${page.mediaHtml || ""}
        ${page.bodyHtml || ""}
        ${page.supportText ? `<p class="stage-support">${page.supportText}</p>` : ""}
        ${page.timer ? timerMarkup() : ""}
        <div class="stage-actions">
          ${page.buttonLabel ? `<button class="primary-button" data-next>${page.buttonLabel}</button>` : ""}
          ${page.extraActionsHtml || ""}
          ${reviewActionHtml}
        </div>
      </section>
    `;
  }

  function renderStagePage(container, page, onAdvance) {
    clearOptionInteractions(container);
    const reviewMode = readSessionContext().mode !== "live";
    let activeTimer = null;

    function advance() {
      if (activeTimer) {
        window.clearInterval(activeTimer);
        activeTimer = null;
      }
      if (typeof onAdvance === "function") {
        onAdvance();
      }
    }

    window.scrollTo(0, 0);
    container.innerHTML = shellMarkup(page, stageCardMarkup(page, reviewMode));
    bindOptionInteractions(container);
    bindMediaDiagnostics(container);

    const nextButton = container.querySelector("[data-next]");
    if (nextButton) {
      nextButton.addEventListener("click", advance);
    }

    const skipButton = container.querySelector("[data-skip]");
    if (skipButton) {
      skipButton.addEventListener("click", advance);
    }

    if (page.mode === "timed" && page.timer && page.seconds) {
      activeTimer = startTimer(page.seconds, function () {
        activeTimer = null;
        advance();
      });
    }
  }

  function renderSequence(container, pages, onFinish, options) {
    let currentIndex = 0;
    const config = options || {};
    const backgroundAudioId = config.backgroundAudioId ? config.backgroundAudioId : null;
    let backgroundAudioStarted = false;
    let activeTimer = null;

    function maybeStartBackgroundAudio() {
      if (!backgroundAudioId || backgroundAudioStarted) {
        return;
      }
      const audio = document.getElementById(backgroundAudioId);
      if (!audio) {
        return;
      }
      audio.play().catch(function () {
        return null;
      });
      backgroundAudioStarted = true;
    }

    function advancePage() {
      if (activeTimer) {
        window.clearInterval(activeTimer);
        activeTimer = null;
      }
      currentIndex += 1;
      if (currentIndex < pages.length) {
        renderPage(pages[currentIndex]);
      } else {
        onFinish();
      }
    }

    function renderPage(page) {
      clearOptionInteractions(container);
      if (activeTimer) {
        window.clearInterval(activeTimer);
        activeTimer = null;
      }
      window.scrollTo(0, 0);
      const reviewMode = readSessionContext().mode !== "live";
      container.innerHTML = shellMarkup(page, stageCardMarkup(page, reviewMode));
      bindOptionInteractions(container);
      bindMediaDiagnostics(container);

      const skipButton = container.querySelector("[data-skip]");
      if (skipButton) {
        skipButton.addEventListener("click", advancePage);
      }

      const nextButton = container.querySelector("[data-next]");
      if (nextButton) {
        nextButton.addEventListener("click", function () {
          maybeStartBackgroundAudio();
          advancePage();
        });
      }

      if (page.mode === "timed" && page.timer && page.seconds) {
        activeTimer = startTimer(page.seconds, function () {
          activeTimer = null;
          advancePage();
        });
      }
    }

    renderPage(pages[currentIndex]);
  }

  function goToRoute(routeName) {
    window.location.href = window.ExperimentConfig.routes[routeName];
  }

  window.PlatformUtils = {
    buildFormPage: buildFormPage,
    buildTaskMediaAudio: buildTaskMediaAudio,
    buildTaskMediaImage: buildTaskMediaImage,
    clearSessionContext: clearSessionContext,
    formatTime: formatTime,
    goToRoute: goToRoute,
    infoCardsMarkup: infoCardsMarkup,
    instructionListMarkup: instructionListMarkup,
    optionListMarkup: optionListMarkup,
    readSessionContext: readSessionContext,
    renderSequence: renderSequence,
    renderStagePage: renderStagePage,
    saveSessionContext: saveSessionContext,
    setPageData: setPageData,
    startTimer: startTimer,
    timerMarkup: timerMarkup,
  };
})();
