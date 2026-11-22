const path = require('path');
const express = require('express');
require('dotenv').config();

const app = express();
app.disable('x-powered-by');

const parsedPort = Number.parseInt(process.env.PORT ?? '', 10);
const PORT = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 3000;
const NASA_API_BASE_URL = 'https://api.nasa.gov/planetary/apod';
const NASA_APOD_PORTAL_URL = 'https://science.nasa.gov/apod/';
const FIRST_APOD_DATE = '1995-06-16';
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const REQUEST_TIMEOUT_MS = 6000;
const TODAY_CACHE_TTL_MS = 15 * 60 * 1000;
const IMAGE_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

const FALLBACK_APOD_CATALOG = {
  '2026-11-13': {
    title: 'NGC 206 and the Star Clouds of Andromeda',
    date: '2026-11-13',
    explanation:
      'The large stellar association cataloged as NGC 206 is nestled within the dusty arms of the neighboring Andromeda galaxy along with the galaxy\'s pinkish star-forming regions. Also known as M31, the spiral galaxy is a mere 2.5 million light-years away. NGC 206 is found at the center of this sharp and detailed close-up of the southwestern extent of Andromeda\'s disk. The bright, blue stars of NGC 206 indicate its youth. In fact, its youngest massive stars are less than 10 million years old. Much larger than the open or galactic clusters of young stars in the disk of our Milky Way galaxy, NGC 206 spans about 4,000 light-years.',
    media_type: 'image',
    url: 'https://assets.science.nasa.gov/dynamicimage/assets/science/cds/apod/apod/2026/november/Andromeda_closeupCruz4096.jpg?w=2048&h=1451&fit=clip&crop=faces%2Cfocalpoint',
    hdurl:
      'https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2026/november/Andromeda_closeupCruz4096.jpg',
    thumbnail_url: '',
    copyright: 'David Cruz',
  },
  '2024-05-01': {
    title: 'The Fishhead Nebula',
    date: '2024-05-01',
    explanation:
      'A colorful star forming region known as IC 1795 resembles a fish swimming across the cosmic ocean. Located in the northern constellation Cassiopeia, glowing hydrogen, oxygen, and sulfur gas is sculpted by winds and radiation from massive young stars.',
    media_type: 'image',
    url: 'https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2024/may/FishheadB_Colombari_2704.jpg?w=1538&h=2048&fit=clip&crop=faces%2Cfocalpoint',
    hdurl:
      'https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2024/may/FishheadB_Colombari_2704.jpg',
    thumbnail_url: '',
    copyright: 'Roberto Colombari',
  },
  '2024-04-14': {
    title: 'How a Total Solar Eclipse Ended',
    date: '2024-04-14',
    explanation:
      'How does a total solar eclipse end? In the first few seconds of transition as the Moon moves away from covering the Sun, light streams between lunar mountains to create the iconic diamond ring and Bailey\'s beads.',
    media_type: 'video',
    url: 'https://www.youtube.com/embed/w5uUcq__vMo',
    hdurl: '',
    thumbnail_url: 'https://img.youtube.com/vi/w5uUcq__vMo/hqdefault.jpg',
    copyright: 'David Duarte',
  },
  '2005-05-31': {
    title: 'The Trifid Nebula from CFHT',
    date: '2005-05-31',
    explanation:
      'Unspeakable beauty and unimaginable bedlam can be found together in the Trifid Nebula (M20), a dramatic star-forming region of glowing red hydrogen, dusty dark lanes, and blue reflection nebulae imaged by the Canada-France-Hawaii Telescope.',
    media_type: 'image',
    url: 'https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2005/may/m20_cfht_big.jpg',
    hdurl: 'https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2005/may/m20_cfht_big.jpg',
    thumbnail_url: '',
    copyright: 'Jean-Charles Cuillandre (CFHT)',
  },
};

const FALLBACK_APOD_LIST = Object.values(FALLBACK_APOD_CATALOG);

const apodCache = new Map();
let latestTodayCache = {
  fetchedAt: 0,
  data: null,
};

function getNasaApiKey() {
  const configuredKey = process.env.NASA_API_KEY?.trim();
  return configuredKey || 'DEMO_KEY';
}

function getCurrentEasternDate() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function validateDateParam(rawDate) {
  if (rawDate === undefined) {
    return { valid: true, value: null };
  }

  if (typeof rawDate !== 'string' || !DATE_PATTERN.test(rawDate.trim())) {
    return {
      valid: false,
      message: 'Formato de data inválido. Utilize o padrão YYYY-MM-DD.',
    };
  }

  const normalizedDate = rawDate.trim();
  const [year, month, day] = normalizedDate.split('-').map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));

  const isRealCalendarDate =
    utcDate.getUTCFullYear() === year &&
    utcDate.getUTCMonth() + 1 === month &&
    utcDate.getUTCDate() === day;

  if (!isRealCalendarDate) {
    return {
      valid: false,
      message: 'A data informada não existe no calendário.',
    };
  }

  if (normalizedDate < FIRST_APOD_DATE) {
    return {
      valid: false,
      message: `O arquivo APOD iniciou em ${FIRST_APOD_DATE}. Escolha uma data igual ou posterior.`,
    };
  }

  const currentEasternDate = getCurrentEasternDate();
  const cachedTodayDate = latestTodayCache.data?.date;
  const maxAllowedDate =
    cachedTodayDate && cachedTodayDate > currentEasternDate
      ? cachedTodayDate
      : currentEasternDate;

  if (normalizedDate > maxAllowedDate) {
    return {
      valid: false,
      message: 'Não é possível consultar uma data futura no APOD.',
    };
  }

  return { valid: true, value: normalizedDate };
}

function sanitizeApodPayload(rawData) {
  return {
    title: typeof rawData.title === 'string' ? rawData.title : 'Sem título',
    date: typeof rawData.date === 'string' ? rawData.date : '',
    explanation:
      typeof rawData.explanation === 'string'
        ? rawData.explanation.trim()
        : 'Explicação não fornecida pela NASA.',
    media_type: typeof rawData.media_type === 'string' ? rawData.media_type : 'other',
    url: typeof rawData.url === 'string' ? rawData.url : '',
    hdurl: typeof rawData.hdurl === 'string' ? rawData.hdurl : '',
    thumbnail_url: typeof rawData.thumbnail_url === 'string' ? rawData.thumbnail_url : '',
    copyright: typeof rawData.copyright === 'string' ? rawData.copyright.trim() : '',
  };
}

function mapUpstreamError(statusCode) {
  if (statusCode === 400 || statusCode === 404) {
    return {
      status: 404,
      message: 'Não há registro APOD disponível para a data solicitada.',
    };
  }

  if (statusCode === 403) {
    return {
      status: 502,
      message: 'Chave da API da NASA inválida ou sem permissão. Verifique o arquivo .env.',
    };
  }

  if (statusCode === 429) {
    return {
      status: 429,
      message:
        'Limite de requisições da API da NASA atingido no momento. Configure uma chave gratuita própria no .env ou aguarde alguns instantes.',
    };
  }

  return {
    status: 502,
    message: 'Não foi possível obter os dados da NASA no momento. Tente novamente em instantes.',
  };
}

function getFallbackApod(dateValue) {
  const targetDate = dateValue || getCurrentEasternDate();

  if (Object.hasOwn(FALLBACK_APOD_CATALOG, targetDate)) {
    return {
      ...FALLBACK_APOD_CATALOG[targetDate],
      date: targetDate,
    };
  }

  let charSum = 0;
  for (const ch of targetDate) {
    charSum += ch.codePointAt(0) ?? 0;
  }

  const chosen = FALLBACK_APOD_LIST[charSum % FALLBACK_APOD_LIST.length];
  return {
    ...chosen,
    date: targetDate,
  };
}

function cacheApodResult(dateValue, sanitized) {
  if (sanitized.date) {
    apodCache.set(sanitized.date, sanitized);
  }

  if (!dateValue) {
    latestTodayCache = {
      fetchedAt: Date.now(),
      data: sanitized,
    };
  }
}

function activateFallback(dateValue) {
  const targetDate = dateValue || getCurrentEasternDate();
  const keyNote = getNasaApiKey() === 'DEMO_KEY' ? ' (DEMO_KEY)' : '';
  console.warn(
    `[APOD] Servidores externos da NASA indisponíveis${keyNote}; utilizando registro de contingência para ${targetDate}`
  );
  const fallback = getFallbackApod(dateValue);
  cacheApodResult(dateValue, fallback);
  return fallback;
}

function safeFromCodePoint(codePoint, fallback) {
  if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff) {
    return fallback;
  }
  return String.fromCodePoint(codePoint);
}

function decodeHtmlEntities(input) {
  if (typeof input !== 'string' || !input) {
    return '';
  }

  const namedEntities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#039;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
  };

  let decoded = input;
  for (const [entity, replacement] of Object.entries(namedEntities)) {
    decoded = decoded.replaceAll(entity, replacement);
  }

  return decoded
    .replace(/&#(\d{1,7});/g, (match, dec) => safeFromCodePoint(Number(dec), match))
    .replace(/&#x([0-9a-fA-F]{1,6});/g, (match, hex) =>
      safeFromCodePoint(Number.parseInt(hex, 16), match)
    );
}

function stripHtmlTags(htmlFragment) {
  if (typeof htmlFragment !== 'string' || !htmlFragment) {
    return '';
  }

  const parts = [];
  let cursor = 0;

  while (cursor < htmlFragment.length) {
    const openIdx = htmlFragment.indexOf('<', cursor);
    if (openIdx === -1) {
      parts.push(htmlFragment.slice(cursor));
      break;
    }

    if (openIdx > cursor) {
      parts.push(htmlFragment.slice(cursor, openIdx));
    }

    const closeIdx = htmlFragment.indexOf('>', openIdx + 1);
    if (closeIdx === -1) {
      parts.push(htmlFragment.slice(openIdx));
      break;
    }

    parts.push(' ');
    cursor = closeIdx + 1;
  }

  return decodeHtmlEntities(parts.join('')).replace(/\s+/g, ' ').trim();
}

function toShortApodDate(isoDate) {
  return isoDate.slice(2, 4) + isoDate.slice(5, 7) + isoDate.slice(8, 10);
}

function isTagNameBoundary(ch) {
  return ch === '>' || ch === '/' || ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r';
}

function findTagEnd(html, openTagStart) {
  let activeQuote = '';

  for (let i = openTagStart + 1; i < html.length; i += 1) {
    const ch = html[i];
    if (activeQuote) {
      if (ch === activeQuote) {
        activeQuote = '';
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      activeQuote = ch;
    } else if (ch === '>') {
      return i;
    }
  }

  return -1;
}

function findNextTag(html, lowerHtml, tagName, fromIndex = 0) {
  const needle = `<${tagName.toLowerCase()}`;
  let searchPos = fromIndex;

  while (searchPos < lowerHtml.length) {
    const idx = lowerHtml.indexOf(needle, searchPos);
    if (idx === -1) {
      return null;
    }

    const boundaryChar = lowerHtml[idx + needle.length] ?? '';
    if (!isTagNameBoundary(boundaryChar)) {
      searchPos = idx + needle.length;
      continue;
    }

    const endIdx = findTagEnd(html, idx);
    if (endIdx === -1) {
      return null;
    }

    return {
      start: idx,
      end: endIdx + 1,
      tagText: html.slice(idx, endIdx + 1),
    };
  }

  return null;
}

function extractAttribute(tagText, attrName) {
  const lowerTag = tagText.toLowerCase();
  const attrNeedle = `${attrName.toLowerCase()}=`;
  let searchPos = 0;

  while (searchPos < lowerTag.length) {
    const idx = lowerTag.indexOf(attrNeedle, searchPos);
    if (idx === -1) {
      return '';
    }

    const prevChar = lowerTag[idx - 1] ?? '';
    if (!/[\s"']/.test(prevChar)) {
      searchPos = idx + attrNeedle.length;
      continue;
    }

    const valueStart = idx + attrNeedle.length;
    const quote = tagText[valueStart];
    if (quote !== '"' && quote !== "'") {
      searchPos = valueStart;
      continue;
    }

    const valueEnd = tagText.indexOf(quote, valueStart + 1);
    if (valueEnd === -1) {
      return '';
    }

    return decodeHtmlEntities(tagText.slice(valueStart + 1, valueEnd)).trim();
  }

  return '';
}

function extractElementByClass(html, lowerHtml, tagNames, classNeedle) {
  for (const tagName of tagNames) {
    let cursor = 0;

    while (cursor < lowerHtml.length) {
      const tag = findNextTag(html, lowerHtml, tagName, cursor);
      if (!tag) {
        break;
      }

      const classAttr = extractAttribute(tag.tagText, 'class');
      if (classAttr.includes(classNeedle)) {
        const closeTag = `</${tagName}>`;
        const closeIdx = lowerHtml.indexOf(closeTag, tag.end);
        if (closeIdx === -1) {
          break;
        }
        return {
          index: tag.start,
          innerHtml: html.slice(tag.end, closeIdx),
        };
      }

      cursor = tag.end;
    }
  }

  return null;
}

function isImageFileUrl(candidate) {
  const pathOnly = candidate.split('?')[0].toLowerCase();
  return IMAGE_FILE_EXTENSIONS.some((ext) => pathOnly.endsWith(ext));
}

function extractYouTubeEmbedId(embedUrl) {
  try {
    const parsed = new URL(embedUrl);
    if (parsed.pathname.startsWith('/embed/')) {
      return parsed.pathname.split('/')[2] ?? '';
    }
  } catch {
    return '';
  }
  return '';
}

function extractHeroMedia(mediaBlock) {
  const lowerMedia = mediaBlock.toLowerCase();
  const iframeTag = findNextTag(mediaBlock, lowerMedia, 'iframe');

  if (iframeTag) {
    const url = extractAttribute(iframeTag.tagText, 'src');
    if (!url) {
      return null;
    }
    const ytId = extractYouTubeEmbedId(url);
    return {
      mediaType: 'video',
      url,
      hdurl: '',
      thumbnailUrl: ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '',
    };
  }

  const videoTag = findNextTag(mediaBlock, lowerMedia, 'video');
  if (videoTag) {
    const sourceTag = findNextTag(mediaBlock, lowerMedia, 'source', videoTag.end);
    const url =
      extractAttribute(sourceTag?.tagText ?? '', 'src') || extractAttribute(videoTag.tagText, 'src');
    if (!url) {
      return null;
    }
    return { mediaType: 'video', url, hdurl: '', thumbnailUrl: '' };
  }

  const imgTag = findNextTag(mediaBlock, lowerMedia, 'img');
  if (!imgTag) {
    return null;
  }

  const url = extractAttribute(imgTag.tagText, 'src');
  if (!url) {
    return null;
  }

  const anchorTag = findNextTag(mediaBlock, lowerMedia, 'a');
  const candidateHd = anchorTag ? extractAttribute(anchorTag.tagText, 'href') : '';
  const hasValidHdLink =
    Boolean(candidateHd) &&
    (isImageFileUrl(candidateHd) || candidateHd.includes('assets.science.nasa.gov'));

  return {
    mediaType: 'image',
    url,
    hdurl: hasValidHdLink ? candidateHd : url.split('?')[0],
    thumbnailUrl: '',
  };
}

function extractHeroExplanation(sectionSlice, lowerSlice) {
  const element = extractElementByClass(
    sectionSlice,
    lowerSlice,
    ['p'],
    'media-detail-hero__description'
  );
  if (!element) {
    return '';
  }

  let text = stripHtmlTags(element.innerHtml);
  if (text.toLowerCase().startsWith('explanation:')) {
    text = text.slice('explanation:'.length).trim();
  }

  const nextMarker = text.toLowerCase().indexOf("tomorrow's picture:");
  if (nextMarker !== -1) {
    text = text.slice(0, nextMarker).trim();
  }

  return text;
}

function extractHeroCredit(sectionSlice, lowerSlice) {
  let cursor = 0;

  while (cursor < lowerSlice.length) {
    const thTag = findNextTag(sectionSlice, lowerSlice, 'th', cursor);
    if (!thTag) {
      return '';
    }

    const thClose = lowerSlice.indexOf('</th>', thTag.end);
    if (thClose === -1) {
      return '';
    }

    const headerLabel = stripHtmlTags(sectionSlice.slice(thTag.end, thClose)).toLowerCase();
    if (headerLabel.startsWith('credit')) {
      const tdTag = findNextTag(sectionSlice, lowerSlice, 'td', thClose);
      const tdClose = tdTag ? lowerSlice.indexOf('</td>', tdTag.end) : -1;
      if (tdTag && tdClose !== -1) {
        return stripHtmlTags(sectionSlice.slice(tdTag.end, tdClose));
      }
      return '';
    }

    cursor = thClose + '</th>'.length;
  }

  return '';
}

function extractApodFromScienceHtml(html, targetDate) {
  if (typeof html !== 'string' || !html) {
    return null;
  }

  const lastHeroIdx = html.lastIndexOf('media-detail-hero__media');
  if (lastHeroIdx === -1) {
    return null;
  }

  const sectionSlice = html.slice(lastHeroIdx, lastHeroIdx + 20000);
  const lowerSlice = sectionSlice.toLowerCase();
  const titleElement = extractElementByClass(sectionSlice, lowerSlice, ['h1', 'h2'], 'display-48');

  if (!titleElement) {
    return null;
  }

  const title = stripHtmlTags(titleElement.innerHtml);
  if (!title) {
    return null;
  }

  const media = extractHeroMedia(sectionSlice.slice(0, titleElement.index));
  if (!media) {
    return null;
  }

  const explanation = extractHeroExplanation(sectionSlice, lowerSlice);
  const copyright = extractHeroCredit(sectionSlice, lowerSlice);

  return sanitizeApodPayload({
    title,
    date: targetDate,
    explanation: explanation || 'Explicação não fornecida pela NASA para esta data.',
    media_type: media.mediaType,
    url: media.url,
    hdurl: media.hdurl,
    thumbnail_url: media.thumbnailUrl,
    copyright,
  });
}

async function fetchWithTimeout(targetUrl, acceptHeader) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        Accept: acceptHeader,
        'User-Agent': 'DiarioDoCosmos/1.0 (+https://api.nasa.gov/)',
      },
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchApodFromScienceNasaPage(dateValue) {
  const targetDate = dateValue || getCurrentEasternDate();
  const portalUrl = dateValue
    ? `${NASA_APOD_PORTAL_URL}?date=${toShortApodDate(targetDate)}`
    : NASA_APOD_PORTAL_URL;

  const response = await fetchWithTimeout(portalUrl, 'text/html,application/xhtml+xml');
  if (!response.ok) {
    return null;
  }

  const html = await response.text();
  return extractApodFromScienceHtml(html, targetDate);
}

async function fetchOfficialNasaApi(dateValue) {
  const apiKey = getNasaApiKey();
  const params = new URLSearchParams({
    api_key: apiKey,
    thumbs: 'true',
  });

  if (dateValue) {
    params.set('date', dateValue);
  }

  let response = await fetchWithTimeout(
    `${NASA_API_BASE_URL}?${params.toString()}`,
    'application/json'
  );

  if (response.status >= 500) {
    const retryParams = new URLSearchParams({ api_key: apiKey });
    if (dateValue) {
      retryParams.set('date', dateValue);
    }
    response = await fetchWithTimeout(
      `${NASA_API_BASE_URL}?${retryParams.toString()}`,
      'application/json'
    );
  }

  if (!response.ok) {
    if (response.status === 403) {
      const mapped = mapUpstreamError(403);
      const authError = new Error(mapped.message);
      authError.statusCode = mapped.status;
      throw authError;
    }

    return { ok: false, status: response.status, data: null };
  }

  const rawData = await response.json();
  return { ok: true, status: response.status, data: sanitizeApodPayload(rawData) };
}

function isBrokenApiPlaceholder(payload) {
  if (!payload) {
    return true;
  }

  const hasBrokenLogo = Boolean(payload.url?.includes('nasa-logo@2x.png'));
  const hasGenericTitle = payload.title === 'NASA Science';
  return hasBrokenLogo || hasGenericTitle || !payload.url;
}

async function fetchApodFromNasa(dateValue) {
  const [officialOutcome, portalOutcome] = await Promise.allSettled([
    fetchOfficialNasaApi(dateValue),
    fetchApodFromScienceNasaPage(dateValue),
  ]);

  if (officialOutcome.status === 'rejected' && officialOutcome.reason?.statusCode === 502) {
    throw officialOutcome.reason;
  }

  const officialResult = officialOutcome.status === 'fulfilled' ? officialOutcome.value : null;
  const portalData = portalOutcome.status === 'fulfilled' ? portalOutcome.value : null;

  if (officialResult?.ok && !isBrokenApiPlaceholder(officialResult.data)) {
    cacheApodResult(dateValue, officialResult.data);
    return officialResult.data;
  }

  if (portalData?.url) {
    cacheApodResult(dateValue, portalData);
    return portalData;
  }

  if (
    officialResult?.ok === false &&
    (officialResult.status === 400 || officialResult.status === 404)
  ) {
    const mapped = mapUpstreamError(officialResult.status);
    const notFoundError = new Error(mapped.message);
    notFoundError.statusCode = mapped.status;
    throw notFoundError;
  }

  return activateFallback(dateValue);
}

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/apod', async (req, res) => {
  const validation = validateDateParam(req.query.date);

  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  const requestedDate = validation.value;

  if (requestedDate && apodCache.has(requestedDate)) {
    return res.json(apodCache.get(requestedDate));
  }

  if (
    !requestedDate &&
    latestTodayCache.data &&
    Date.now() - latestTodayCache.fetchedAt < TODAY_CACHE_TTL_MS
  ) {
    return res.json(latestTodayCache.data);
  }

  try {
    const apodData = await fetchApodFromNasa(requestedDate);
    return res.json(apodData);
  } catch (error) {
    const statusCode = error.statusCode ?? 500;
    const message =
      error.statusCode && error.message
        ? error.message
        : 'Erro interno inesperado ao buscar o APOD.';

    console.error(`[APOD] Erro ${statusCode} ao consultar data "${requestedDate || 'hoje'}".`);
    return res.status(statusCode).json({ error: message });
  }
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Rota de API não encontrada.' });
});

if (require.main === module) {
  const activeKey = getNasaApiKey();
  if (activeKey === 'DEMO_KEY') {
    console.warn(
      '[Aviso] Usando NASA_API_KEY=DEMO_KEY (limite reduzido de requisições). Para uso contínuo, gere sua chave gratuita em https://api.nasa.gov/ e configure no arquivo .env.'
    );
  }

  app.listen(PORT, () => {
    console.log(`Diário do Cosmos rodando em http://localhost:${PORT}`);
  });
}

module.exports = {
  app,
  validateDateParam,
  sanitizeApodPayload,
};
