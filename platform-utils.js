(function () {
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

  function optionListMarkup(name, options) {
    const items = options
      .map(
        (option, index) => `
          <label class="option-row">
            <input type="checkbox" name="${name}" value="${index + 1}">
            <span>${option}</span>
          </label>
        `
      )
      .join("");
    return `<div class="options">${items}</div>`;
  }

  function setPageData(pageId) {
    document.body.dataset.page = pageId;
    document.title = `${window.ExperimentConfig.app.name} | ${pageId}`;
  }

  function startTimer(seconds, onDone) {
    const timerText = document.querySelector("[data-timer-text]");
    const timerCircle = document.querySelector(".timer-circle");
    if (!timerText || !timerCircle) {
      return;
    }

    const circumference = 2 * Math.PI * 66;
    timerCircle.style.strokeDasharray = `${circumference}`;
    timerCircle.style.strokeDashoffset = "0";

    let remaining = seconds;
    timerText.textContent = `${remaining}s`;

    const interval = window.setInterval(function () {
      remaining -= 1;
      timerText.textContent = `${Math.max(remaining, 0)}s`;
      timerCircle.style.strokeDashoffset = `${circumference * (1 - Math.max(remaining, 0) / seconds)}`;

      if (remaining <= 0) {
        window.clearInterval(interval);
        onDone();
      }
    }, 1000);

    return interval;
  }

  function renderSequence(container, pages, onFinish, options) {
    let currentIndex = 0;
    const backgroundAudioId = options && options.backgroundAudioId ? options.backgroundAudioId : null;
    let backgroundAudioStarted = false;

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

    function renderPage(page) {
      container.innerHTML = `
        <section class="stage-card stage-card--${page.mode}">
          <header class="stage-header">
            <p class="eyebrow">${page.eyebrow || ""}</p>
            <h1>${page.title || ""}</h1>
            ${page.subtitle ? `<p class="stage-subtitle">${page.subtitle}</p>` : ""}
          </header>
          ${page.mediaHtml || ""}
          ${page.bodyHtml || ""}
          ${page.timer ? timerMarkup() : ""}
          ${page.buttonLabel ? `<button class="primary-button" data-next>${page.buttonLabel}</button>` : ""}
        </section>
      `;

      if (page.mode === "manual") {
        const nextButton = container.querySelector("[data-next]");
        nextButton.addEventListener("click", function () {
          maybeStartBackgroundAudio();
          currentIndex += 1;
          if (currentIndex < pages.length) {
            renderPage(pages[currentIndex]);
          } else {
            onFinish();
          }
        });
        return;
      }

      if (page.timer && page.seconds) {
        startTimer(page.seconds, function () {
          currentIndex += 1;
          if (currentIndex < pages.length) {
            renderPage(pages[currentIndex]);
          } else {
            onFinish();
          }
        });
      }
    }

    renderPage(pages[currentIndex]);
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
      <p class="form-note">${subtitle}</p>
    `;
  }

  function buildTaskMediaAudio(src, label) {
    return `
      <div class="media-panel">
        <audio controls preload="metadata" class="audio-player">
          <source src="${src}" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
        <p class="media-caption">${label}</p>
      </div>
    `;
  }

  function buildTaskMediaImage(src, alt) {
    return `
      <div class="media-panel">
        <img class="task-image" src="${src}" alt="${alt}">
      </div>
    `;
  }

  window.PlatformUtils = {
    buildFormPage: buildFormPage,
    buildTaskMediaAudio: buildTaskMediaAudio,
    buildTaskMediaImage: buildTaskMediaImage,
    optionListMarkup: optionListMarkup,
    renderSequence: renderSequence,
    setPageData: setPageData,
    timerMarkup: timerMarkup,
  };
})();
