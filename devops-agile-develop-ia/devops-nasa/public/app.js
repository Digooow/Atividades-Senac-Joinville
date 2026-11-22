const FIRST_APOD_DATE = '1995-06-16';
const DIRECT_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg'];
const YOUTUBE_EMBED_BASE = 'https://www.youtube.com/embed/';

const elements = {
  dateForm: document.getElementById('date-form'),
  dateInput: document.getElementById('apod-date'),
  fetchDateBtn: document.getElementById('fetch-date-btn'),
  prevDayBtn: document.getElementById('prev-day-btn'),
  todayBtn: document.getElementById('today-btn'),
  nextDayBtn: document.getElementById('next-day-btn'),
  randomDayBtn: document.getElementById('random-day-btn'),
  loadingState: document.getElementById('loading-state'),
  errorState: document.getElementById('error-state'),
  errorMessage: document.getElementById('error-message'),
  retryBtn: document.getElementById('retry-btn'),
  errorTodayBtn: document.getElementById('error-today-btn'),
  apodContent: document.getElementById('apod-content'),
  apodDateDisplay: document.getElementById('apod-date-display'),
  apodMediaBadge: document.getElementById('apod-media-badge'),
  apodTitle: document.getElementById('apod-title'),
  apodMediaContainer: document.getElementById('apod-media-container'),
  apodMediaActions: document.getElementById('apod-media-actions'),
  apodExplanation: document.getElementById('apod-explanation'),
  apodCopyright: document.getElementById('apod-copyright'),
};

const appState = {
  currentDate: null,
  maxDate: null,
  lastRequestedDate: null,
  isLoading: false,
};

function isSafeHttpUrl(rawUrl) {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) {
    return false;
  }

  try {
    const parsed = new URL(rawUrl.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function formatDatePtBr(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr || 'Data indisponível';
  }

  const [year, month, day] = dateStr.split('-').map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'UTC',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(utcDate);
}

function shiftIsoDate(dateStr, deltaDays) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  utcDate.setUTCDate(utcDate.getUTCDate() + deltaDays);

  const nextYear = utcDate.getUTCFullYear();
  const nextMonth = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
  const nextDay = String(utcDate.getUTCDate()).padStart(2, '0');
  return `${nextYear}-${nextMonth}-${nextDay}`;
}

function getRandomApodDate(maxDateStr) {
  const [minY, minM, minD] = FIRST_APOD_DATE.split('-').map(Number);
  const [maxY, maxM, maxD] = maxDateStr.split('-').map(Number);

  const minMs = Date.UTC(minY, minM - 1, minD);
  const maxMs = Date.UTC(maxY, maxM - 1, maxD);
  const totalDays = Math.max(0, Math.floor((maxMs - minMs) / (24 * 60 * 60 * 1000)));
  const randomOffset = Math.floor(Math.random() * (totalDays + 1));

  return shiftIsoDate(FIRST_APOD_DATE, randomOffset);
}

function isDirectVideoUrl(rawUrl) {
  try {
    const pathname = new URL(rawUrl).pathname.toLowerCase();
    return DIRECT_VIDEO_EXTENSIONS.some((ext) => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

function normalizeYouTubeUrl(parsed, host) {
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (parsed.pathname.startsWith('/embed/')) {
      return parsed.toString();
    }
    const videoId = parsed.searchParams.get('v');
    return videoId ? `${YOUTUBE_EMBED_BASE}${encodeURIComponent(videoId)}` : null;
  }

  if (host === 'youtu.be') {
    const videoId = parsed.pathname.slice(1).split('/')[0];
    return videoId ? `${YOUTUBE_EMBED_BASE}${encodeURIComponent(videoId)}` : null;
  }

  return null;
}

function normalizeVimeoUrl(parsed, host) {
  if (host === 'vimeo.com') {
    const videoId = parsed.pathname.split('/').find(Boolean);
    return videoId && /^\d+$/.test(videoId) ? `https://player.vimeo.com/video/${videoId}` : null;
  }

  if (host === 'player.vimeo.com' && parsed.pathname.startsWith('/video/')) {
    return parsed.toString();
  }

  return null;
}

function normalizeEmbedVideoUrl(rawUrl) {
  if (!isSafeHttpUrl(rawUrl)) {
    return null;
  }

  const parsed = new URL(rawUrl.trim());
  const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
  return normalizeYouTubeUrl(parsed, host) ?? normalizeVimeoUrl(parsed, host);
}

function createExternalLinkButton(href, label, variantClass = 'btn-secondary') {
  const link = document.createElement('a');
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = `btn ${variantClass}`;
  link.textContent = label;
  return link;
}

function createFallbackBox(message, thumbnailUrl, externalUrl, actionLabel) {
  const box = document.createElement('div');
  box.className = 'media-fallback';

  if (isSafeHttpUrl(thumbnailUrl)) {
    const thumb = document.createElement('img');
    thumb.src = thumbnailUrl;
    thumb.alt = 'Pré-visualização da mídia astronômica';
    thumb.loading = 'lazy';
    box.appendChild(thumb);
  }

  const text = document.createElement('p');
  text.textContent = message;
  box.appendChild(text);

  if (isSafeHttpUrl(externalUrl)) {
    box.appendChild(createExternalLinkButton(externalUrl, actionLabel, 'btn-primary'));
  }

  return box;
}

function updateControlsAvailability() {
  const disabledAll = appState.isLoading;

  elements.dateInput.disabled = disabledAll;
  elements.fetchDateBtn.disabled = disabledAll;
  elements.todayBtn.disabled = disabledAll;
  elements.randomDayBtn.disabled = disabledAll;

  const canGoPrev = Boolean(appState.currentDate && appState.currentDate > FIRST_APOD_DATE);
  const canGoNext = Boolean(
    appState.currentDate && appState.maxDate && appState.currentDate < appState.maxDate
  );

  elements.prevDayBtn.disabled = disabledAll || !canGoPrev;
  elements.nextDayBtn.disabled = disabledAll || !canGoNext;
}

function setLoading(isLoading) {
  appState.isLoading = isLoading;
  updateControlsAvailability();

  if (isLoading) {
    elements.loadingState.hidden = false;
    elements.errorState.hidden = true;
    elements.apodContent.hidden = true;
  } else {
    elements.loadingState.hidden = true;
  }
}

function showError(message) {
  appState.isLoading = false;
  updateControlsAvailability();

  elements.loadingState.hidden = true;
  elements.apodContent.hidden = true;
  elements.errorState.hidden = false;
  elements.errorMessage.textContent =
    message || 'Não foi possível carregar os dados astronômicos no momento.';
}

function getMediaBadgeLabel(mediaType) {
  if (mediaType === 'image') {
    return 'Imagem';
  }
  if (mediaType === 'video') {
    return 'Vídeo';
  }
  return 'Mídia Especial';
}

function renderImageMedia(mediaUrl, hdUrl, title) {
  const img = document.createElement('img');
  img.src = mediaUrl;
  img.alt = title || 'Imagem astronômica do dia da NASA';
  img.className = 'apod-image';

  img.addEventListener('error', () => {
    elements.apodMediaContainer.replaceChildren(
      createFallbackBox(
        'Não foi possível renderizar esta imagem diretamente no navegador.',
        '',
        hdUrl || mediaUrl,
        'Abrir imagem original'
      )
    );
  });

  elements.apodMediaContainer.appendChild(img);

  const actionUrl = hdUrl || mediaUrl;
  const actionLabel = hdUrl
    ? 'Abrir imagem em Alta Definição (HD)'
    : 'Abrir imagem original';
  elements.apodMediaActions.appendChild(createExternalLinkButton(actionUrl, actionLabel));
}

function renderDirectVideo(mediaUrl, thumbnailUrl) {
  const wrapper = document.createElement('div');
  wrapper.className = 'video-wrapper';

  const video = document.createElement('video');
  video.controls = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.src = mediaUrl;
  if (thumbnailUrl) {
    video.poster = thumbnailUrl;
  }

  wrapper.appendChild(video);
  elements.apodMediaContainer.appendChild(wrapper);
  elements.apodMediaActions.appendChild(
    createExternalLinkButton(mediaUrl, 'Abrir arquivo de vídeo')
  );
}

function renderEmbedVideo(embedUrl, mediaUrl, title) {
  const wrapper = document.createElement('div');
  wrapper.className = 'video-wrapper';

  const iframe = document.createElement('iframe');
  iframe.src = embedUrl;
  iframe.title = title || 'Vídeo astronômico do dia da NASA';
  iframe.loading = 'lazy';
  iframe.allowFullscreen = true;
  iframe.setAttribute(
    'allow',
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
  );
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');

  wrapper.appendChild(iframe);
  elements.apodMediaContainer.appendChild(wrapper);
  elements.apodMediaActions.appendChild(
    createExternalLinkButton(mediaUrl, 'Assistir na fonte original')
  );
}

function renderVideoMedia(mediaUrl, thumbnailUrl, title) {
  if (isDirectVideoUrl(mediaUrl)) {
    renderDirectVideo(mediaUrl, thumbnailUrl);
    return;
  }

  const embedUrl = normalizeEmbedVideoUrl(mediaUrl);
  if (embedUrl) {
    renderEmbedVideo(embedUrl, mediaUrl, title);
    return;
  }

  elements.apodMediaContainer.appendChild(
    createFallbackBox(
      'Este vídeo é hospedado em um player externo que não permite incorporação direta.',
      thumbnailUrl,
      mediaUrl,
      'Assistir vídeo em nova aba'
    )
  );
}

function renderMedia(data) {
  elements.apodMediaContainer.replaceChildren();
  elements.apodMediaActions.replaceChildren();

  const mediaUrl = isSafeHttpUrl(data.url) ? data.url.trim() : '';
  const hdUrl = isSafeHttpUrl(data.hdurl) ? data.hdurl.trim() : '';
  const thumbnailUrl = isSafeHttpUrl(data.thumbnail_url) ? data.thumbnail_url.trim() : '';

  if (data.media_type === 'image' && mediaUrl) {
    renderImageMedia(mediaUrl, hdUrl, data.title);
    return;
  }

  if (data.media_type === 'video' && mediaUrl) {
    renderVideoMedia(mediaUrl, thumbnailUrl, data.title);
    return;
  }

  elements.apodMediaContainer.appendChild(
    createFallbackBox(
      'O conteúdo astronômico desta data possui um formato especial não incorporável.',
      thumbnailUrl,
      mediaUrl,
      'Abrir conteúdo original'
    )
  );
}

function renderApod(data) {
  if (data.date) {
    appState.currentDate = data.date;
    if (!appState.maxDate || data.date > appState.maxDate) {
      appState.maxDate = data.date;
      elements.dateInput.max = appState.maxDate;
    }
    elements.dateInput.value = data.date;
  }

  elements.apodDateDisplay.textContent = formatDatePtBr(data.date);
  elements.apodDateDisplay.setAttribute('datetime', data.date || '');
  elements.apodMediaBadge.textContent = getMediaBadgeLabel(data.media_type);
  elements.apodTitle.textContent = data.title || 'Registro Astronômico do Dia';
  elements.apodExplanation.textContent =
    data.explanation || 'Explicação não informada pela NASA para esta data.';

  if (data.copyright) {
    elements.apodCopyright.textContent = `Créditos e Direitos Autorais: ${data.copyright}`;
    elements.apodCopyright.hidden = false;
  } else {
    elements.apodCopyright.textContent = '';
    elements.apodCopyright.hidden = true;
  }

  renderMedia(data);

  elements.loadingState.hidden = true;
  elements.errorState.hidden = true;
  elements.apodContent.hidden = false;

  updateControlsAvailability();
}

async function fetchApod(dateStr = null) {
  appState.lastRequestedDate = dateStr;
  setLoading(true);

  const endpoint = dateStr
    ? `/api/apod?date=${encodeURIComponent(dateStr)}`
    : '/api/apod';

  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/json',
      },
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const serverError =
        typeof payload?.error === 'string'
          ? payload.error
          : `Erro ao consultar o servidor (HTTP ${response.status}).`;
      throw new Error(serverError);
    }

    if (!payload || typeof payload !== 'object') {
      throw new Error('Resposta inválida recebida do servidor.');
    }

    appState.isLoading = false;
    renderApod(payload);
  } catch (error) {
    const message =
      error instanceof TypeError
        ? 'Não foi possível conectar ao servidor local. Verifique se a aplicação está em execução.'
        : error.message;
    showError(message);
  }
}

function loadApod(dateStr = null) {
  fetchApod(dateStr).catch((error) => {
    showError(error?.message);
  });
}

function handleDateSelection(selectedDate) {
  if (!selectedDate) {
    showError('Por favor, selecione uma data válida.');
    return;
  }

  if (selectedDate < FIRST_APOD_DATE) {
    showError(`O arquivo APOD iniciou em 16/06/1995 (${FIRST_APOD_DATE}).`);
    return;
  }

  if (appState.maxDate && selectedDate > appState.maxDate) {
    showError('Escolha uma data igual ou anterior ao APOD mais recente.');
    return;
  }

  loadApod(selectedDate);
}

function registerEventListeners() {
  elements.dateForm.addEventListener('submit', (event) => {
    event.preventDefault();
    handleDateSelection(elements.dateInput.value);
  });

  elements.prevDayBtn.addEventListener('click', () => {
    if (!appState.currentDate) {
      return;
    }
    const previousDate = shiftIsoDate(appState.currentDate, -1);
    if (previousDate >= FIRST_APOD_DATE) {
      loadApod(previousDate);
    }
  });

  elements.nextDayBtn.addEventListener('click', () => {
    if (!appState.currentDate || !appState.maxDate) {
      return;
    }
    const nextDate = shiftIsoDate(appState.currentDate, 1);
    if (nextDate <= appState.maxDate) {
      loadApod(nextDate);
    }
  });

  elements.todayBtn.addEventListener('click', () => {
    loadApod(null);
  });

  elements.errorTodayBtn.addEventListener('click', () => {
    loadApod(null);
  });

  elements.randomDayBtn.addEventListener('click', () => {
    const limitDate = appState.maxDate ?? new Date().toISOString().slice(0, 10);
    const randomDate = getRandomApodDate(limitDate);
    loadApod(randomDate);
  });

  elements.retryBtn.addEventListener('click', () => {
    loadApod(appState.lastRequestedDate);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  registerEventListeners();
  loadApod(null);
});
