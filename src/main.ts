import './styles.css';
import { DEFAULT_LIBRARY, VOCAB_LIBRARIES } from './data/cards';
import { loadAudioManifest, resolveAudioSource } from './audio/audio';

// Block browser shortcuts to prevent baby from closing the page
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) {
    e.preventDefault();
    return;
  }
}, { capture: true });

// —— 多词汇库架构 ——
let currentLibrary = DEFAULT_LIBRARY;

// 返回当前库某字母的卡片数组（统一加 sentence/image 字段，兼容旧 emoji 库）
function vocabCards(key) {
  const cards = VOCAB_LIBRARIES[currentLibrary].cards[key];
  if (!cards) return null;
  return cards.map(c => ({
    word: c.word,
    sentence: c.sentence || '',
    image: c.image || null,
    emoji: c.emoji,
    color: c.color,
  }));
}

function vocabKeys() {
  return Object.keys(VOCAB_LIBRARIES[currentLibrary].cards);
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// —— 每个字母维护一个洗牌轮换池：连按时单词随机，但一轮内不重复 ——
// 池子用完自动开启下一轮（重新洗牌），并尽量避免与上一轮最后一个相同。
const roundState = {}; // key -> { order: number[], pos: number, last: number }
function pickCard(key) {
  const cards = vocabCards(key);
  if (!cards) return null;
  let st = roundState[key];
  if (!st || st.pos >= st.order.length) {
    const order = cards.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    // 新一轮的首个尽量不等于上一轮最后一个，避免连续重复
    if (st && st.last !== undefined && order[0] === st.last && order.length > 1) {
      [order[0], order[1]] = [order[1], order[0]];
    }
    st = { order, pos: 0, last: st ? st.last : undefined };
    roundState[key] = st;
  }
  const idx = st.order[st.pos++];
  st.last = idx;
  return cards[idx];
}

const NUMBER_MAP = {
  0: { emoji: '🌟', word: 'Zero', zh: '零' },
  1: { emoji: '🌈', word: 'One', zh: '一' },
  2: { emoji: '🦋', word: 'Two', zh: '二' },
  3: { emoji: '⭐', word: 'Three', zh: '三' },
  4: { emoji: '🌸', word: 'Four', zh: '四' },
  5: { emoji: '🐠', word: 'Five', zh: '五' },
  6: { emoji: '🍬', word: 'Six', zh: '六' },
  7: { emoji: '🎈', word: 'Seven', zh: '七' },
  8: { emoji: '🐙', word: 'Eight', zh: '八' },
  9: { emoji: '🚀', word: 'Nine', zh: '九' }
};
const SURPRISE_EMOJIS = ['🎈', '⭐', '🎉', '✨', '🦋', '🌸', '💫', '🎵', '🫧', '🌟'];

let audioCtx = null;
let isMuted = false;

let lastKeyTime = 0;
const THROTTLE_MS = 200;

let keyPressCount = 0;
let challengeActive = false;
let challengeTarget = null;
let challengeTimer = null;
let challengeData = null; // { key, data } — 提示图片对应的单词，命中后用于展示
let recentKeys = [];
let challengeEnabled = true;
const CHALLENGE_TRIGGER = 15 + Math.floor(Math.random() * 6); // 15-20

document.addEventListener('keydown', (e) => {
  if (e.target.closest && e.target.closest('#parent-panel input, #parent-panel button, #parent-panel select')) {
    return;
  }
  e.preventDefault();
  const isRepeat = e.repeat;
  const now = Date.now();
  if (now - lastKeyTime < THROTTLE_MS) return;
  lastKeyTime = now;

  const key = e.key.toLowerCase();

  // Shift 键手动进入找字母挑战模式
  if (key === 'shift') {
    if (!isRepeat && challengeEnabled && !challengeActive) {
      startChallenge(true);
    }
    return;
  }

  if (!isRepeat) {
    trackKeyPress(key);
  }

  // 挑战命中检测（字母或数字），命中时展示提示图片对应的单词
  let forcedData = null;
  if (!isRepeat && challengeActive && key === challengeTarget) {
    forcedData = challengeData ? challengeData.data : null;
    clearTimeout(challengeTimer);
    endChallenge(true);
  }

  if (vocabCards(key)) {
    showLetterCard(key, isRepeat, forcedData);
  } else if (key >= '0' && key <= '9') {
    showNumberCard(key, isRepeat, forcedData);
  } else {
    showSurprise(isRepeat);
  }
});

const letterEl = document.getElementById('letter');
const emojiWordEl = document.getElementById('emoji-word');
const cardImageEl = document.getElementById('card-image');
const cardSentenceEl = document.getElementById('card-sentence');
const letterCard = document.getElementById('letter-card');
const promptEl = document.getElementById('prompt');
const particlesEl = document.getElementById('particles');

function spawnParticles(count, x, y) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 12 + 6;
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const dist = Math.random() * 120 + 60;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const hue = Math.random() * 360;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${x}px; top: ${y}px;
      background: hsl(${hue}, 70%, 70%);
      --dx: ${dx}px; --dy: ${dy}px;
    `;
    particlesEl.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
}

function emitCardParticles(count = 12) {
  requestAnimationFrame(() => {
    const rect = letterCard.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    spawnParticles(count, cx, cy);
  });
}

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playDing(freq = 800) {
  if (isMuted) return;
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) { /* silent fail */ }
}

function playRisingScale() {
  if (isMuted) return;
  try {
    const ctx = getAudioCtx();
    const notes = [523, 659, 784];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.3);
    });
  } catch (e) { /* silent fail */ }
}

function playFanfare() {
  if (isMuted) return;
  try {
    const ctx = getAudioCtx();
    // 上行琶音
    const seq = [523, 659, 784, 1047, 1319];
    seq.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    });
    // 收尾持续和弦
    const chord = [523, 659, 784, 1047, 1319];
    const t0 = ctx.currentTime + 0.55;
    chord.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.09, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 1.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 1.1);
    });
  } catch (e) { /* silent fail */ }
}

let preferredVoiceEn = null;
let preferredVoiceZh = null;

function loadVoice() {
  const voices = speechSynthesis.getVoices();
  if (!voices.length) return;
  // 布鲁伊是澳洲动画，优先用澳大利亚英语口音，更贴合主题也更自然
  preferredVoiceEn =
    voices.find(v => v.lang === 'en-AU' && v.localService) ||
    voices.find(v => v.lang === 'en-AU') ||
    voices.find(v => v.lang === 'en-US' && v.name.includes('Samantha')) ||
    voices.find(v => v.lang === 'en-US' && v.localService) ||
    voices.find(v => v.lang.startsWith('en-') && v.localService) ||
    voices.find(v => v.lang.startsWith('en-')) ||
    null;
  preferredVoiceZh =
    voices.find(v => v.lang === 'zh-CN' && v.localService) ||
    voices.find(v => v.lang.startsWith('zh-') && v.localService) ||
    voices.find(v => v.lang.startsWith('zh-')) ||
    null;
}

speechSynthesis.addEventListener('voiceschanged', loadVoice);
loadVoice();

let isSpeaking = false;

// —— 预生成音频：命中 manifest 则播放 mp3，否则回退 Web Speech ——
let audioManifest = null;
let currentAudio = null;
loadAudioManifest('assets/audio/manifest.json')
  .then(m => { audioManifest = m; })
  .catch(() => { audioManifest = null; });

function speak(text) {
  const source = resolveAudioSource(audioManifest, text);
  if (source.kind === 'audio') {
    speakAudio(source.src);
  } else {
    speakSequence([{ text: source.text, lang: source.lang }]);
  }
}

function speakBilingual(zhText, enText) {
  speakSequence([
    { text: zhText, lang: 'zh-CN' },
    { text: enText, lang: 'en-US' }
  ]);
}

function speakSequence(items) {
  if (isMuted || !items.length) return;
  runSpeech(items);
}

function speakAudio(src) {
  if (isMuted) return;
  runAudio(src);
}

// 立即打断当前朗读（音频或语音），交给新的请求接管。
function stopSpeech() {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  speechSynthesis.cancel();
}

function runAudio(src) {
  try {
    stopSpeech(); // 连按时直接打断上一句，只播最新一次
    isSpeaking = true;
    const a = new Audio(src);
    currentAudio = a;
    a.onended = () => { isSpeaking = false; currentAudio = null; };
    a.onerror = () => { isSpeaking = false; currentAudio = null; };
    a.play().catch(() => { isSpeaking = false; currentAudio = null; });
  } catch (e) { isSpeaking = false; currentAudio = null; }
}

function runSpeech(items) {
  try {
    stopSpeech(); // 连按时直接打断上一句，只读最新一次
    isSpeaking = true;
    const queue = [...items];

    function next() {
      if (!queue.length) { isSpeaking = false; return; }
      const item = queue.shift();
      const u = new SpeechSynthesisUtterance(item.text);
      u.lang = item.lang;
      u.rate = 0.85;
      u.pitch = 1.15;
      u.volume = 0.8;
      if (item.lang.startsWith('zh') && preferredVoiceZh) u.voice = preferredVoiceZh;
      if (item.lang.startsWith('en') && preferredVoiceEn) u.voice = preferredVoiceEn;
      u.onend = next;
      u.onerror = () => { isSpeaking = false; };
      speechSynthesis.speak(u);
    }

    next();
  } catch (e) { isSpeaking = false; }
}

const challengeOverlay = document.getElementById('challenge-overlay');

// —— 小红花收集区 ——
const FLOWER_CAP = 30; // 花堆视觉上限，超出后循环替换；总数始终在徽标显示
const flowerRow = document.getElementById('flower-row');
const flowerCounter = document.getElementById('flower-counter');
let flowerCount = (function () {
  try { return parseInt(localStorage.getItem('flowerCount') || '0', 10); }
  catch (e) { return 0; }
})();

function updateFlowerCounter(bump) {
  flowerCounter.textContent = '🌸 ×' + flowerCount;
  if (bump) {
    flowerCounter.classList.remove('bump');
    void flowerCounter.offsetWidth; // 强制重排以重启动画
    flowerCounter.classList.add('bump');
  }
}

function addFlowerEl(animate) {
  const f = document.createElement('div');
  f.className = 'flower-item' + (animate ? ' flower-new' : '');
  f.textContent = '🌸';
  flowerRow.appendChild(f);
  while (flowerRow.children.length > FLOWER_CAP) {
    flowerRow.removeChild(flowerRow.firstChild);
  }
}

function renderFlowers() {
  flowerRow.innerHTML = '';
  const shown = Math.min(flowerCount, FLOWER_CAP);
  for (let i = 0; i < shown; i++) addFlowerEl(false);
  updateFlowerCounter(false);
}

function addFlower() {
  flowerCount++;
  try { localStorage.setItem('flowerCount', flowerCount); } catch (e) { /* ignore */ }
  addFlowerEl(true);
  updateFlowerCounter(true);
}

renderFlowers();

// —— 挑战成功庆祝：增强音效 + 动效 + 收集小花 ——
function celebrate() {
  playFanfare();
  requestAnimationFrame(() => {
    const rect = letterCard.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    spawnParticles(50, cx, cy);
    const emojis = ['🎉', '🌸', '⭐', '✨', '🎈', '🌟', '💐'];
    for (let i = 0; i < 10; i++) {
      const b = document.createElement('div');
      b.className = 'surprise-bubble';
      b.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      b.style.left = (cx + (Math.random() - 0.5) * 240) + 'px';
      b.style.top = cy + 'px';
      b.style.fontSize = (2 + Math.random() * 1.5) + 'rem';
      particlesEl.appendChild(b);
      b.addEventListener('animationend', () => b.remove());
    }
  });
  addFlower();
}

function trackKeyPress(key) {
  if (/^[a-z0-9]$/.test(key) && !recentKeys.includes(key)) {
    recentKeys.push(key);
    if (recentKeys.length > 8) recentKeys.shift();
  }
  keyPressCount++;

  if (challengeEnabled && !challengeActive && keyPressCount >= CHALLENGE_TRIGGER && recentKeys.length >= 3) {
    startChallenge(false);
    keyPressCount = 0;
  }
}

let challengeInterval = null;
let recentChallengeTargets = []; // 最近 3 次挑战出现过的目标，用于避免重复
const CHALLENGE_DURATION = 60000; // 随机触发：60 秒倒计时

function startChallenge(isManual = false) {
  // 候选池：所有字母 + 所有数字，确保每个按键都可被挑战
  const allTargets = vocabKeys().concat(Object.keys(NUMBER_MAP));
  let pool = allTargets.filter(k => !recentChallengeTargets.includes(k));
  if (!pool.length) pool = allTargets;

  challengeTarget = pool[Math.floor(Math.random() * pool.length)];
  challengeActive = true;

  const isNumber = /^\d$/.test(challengeTarget);
  let mediaHtml, color, displayChar;
  if (isNumber) {
    const num = parseInt(challengeTarget);
    const nd = NUMBER_MAP[num];
    color = '#E0C040';
    displayChar = challengeTarget;
    mediaHtml = `<div class="challenge-emoji">${nd.emoji}</div>`;
    challengeData = { type: 'number', key: challengeTarget, data: nd };
  } else {
    const data = randomPick(vocabCards(challengeTarget));
    color = data.color;
    displayChar = challengeTarget.toUpperCase();
    mediaHtml = data.image
      ? `<img class="challenge-media" src="${data.image}" alt="${data.word}">`
      : `<div class="challenge-emoji">${data.emoji}</div>`;
    challengeData = { type: 'letter', key: challengeTarget, data };
  }

  // 记入最近挑战历史，保留最近 3 个
  recentChallengeTargets.push(challengeTarget);
  if (recentChallengeTargets.length > 3) recentChallengeTargets.shift();

  // 手动触发不设时限，隐藏倒计时进度条
  const progressBar = isManual ? '' : `
      <div class="progress-bar"><div class="progress-fill" id="challenge-progress"></div></div>`;
  challengeOverlay.innerHTML = `
    <div class="target-letter" style="color: ${color}">${displayChar}</div>
    ${mediaHtml}
    <div class="challenge-info">
      <div class="challenge-label">Find this!</div>
      ${progressBar}
    </div>
  `;
  challengeOverlay.classList.add('active');

  clearInterval(challengeInterval);
  clearTimeout(challengeTimer);

  if (!isManual) {
    const startTime = Date.now();
    const progressEl = document.getElementById('challenge-progress');
    if (progressEl) progressEl.style.width = '100%';
    challengeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.max(0, 100 - (elapsed / CHALLENGE_DURATION) * 100);
      if (progressEl) progressEl.style.width = pct + '%';
    }, 50);

    challengeTimer = setTimeout(() => {
      endChallenge(false);
    }, CHALLENGE_DURATION);
  }
}

function endChallenge(success) {
  challengeActive = false;
  challengeTarget = null;
  challengeData = null;
  clearInterval(challengeInterval);
  clearTimeout(challengeTimer);
  challengeOverlay.classList.remove('active');

  if (success) {
    celebrate();
  }
}

function showLetterCard(key, isRepeat = false, forcedData = null) {
  const data = forcedData || pickCard(key);
  letterEl.textContent = key.toUpperCase();
  letterEl.style.color = data.color;
  // 配图：有 image 显示图片，否则回退 emoji
  if (data.image) {
    cardImageEl.src = data.image;
    cardImageEl.classList.remove('hidden');
    emojiWordEl.textContent = data.word;
  } else {
    cardImageEl.classList.add('hidden');
    emojiWordEl.textContent = `${data.emoji} ${data.word}`;
  }
  cardSentenceEl.textContent = data.sentence || '';
  triggerCardAnimation();
  emitCardParticles();
  if (!forcedData) playDing(600 + Math.random() * 400);
  if (!isRepeat) {
    const spoken = data.sentence
      ? key.toUpperCase() + ' ... ' + data.word + '. ' + data.sentence
      : key.toUpperCase() + ' ... ' + data.word;
    speak(spoken);
  }
  promptEl.style.display = 'none';
}

function showNumberCard(key, isRepeat = false, forcedData = null) {
  const num = parseInt(key);
  const data = forcedData || NUMBER_MAP[num];
  letterEl.textContent = key;
  letterEl.style.color = '#E0C040';
  cardImageEl.classList.add('hidden'); // 数字卡不使用配图
  emojiWordEl.textContent = num === 0 ? data.emoji : data.emoji.repeat(num);
  cardSentenceEl.textContent = '';
  triggerCardAnimation();
  emitCardParticles();
  playDing(700);
  if (!isRepeat) speakBilingual(data.zh, data.word);
  promptEl.style.display = 'none';
}

function showSurprise(isRepeat = false) {
  // Hide the letter card
  letterCard.classList.remove('show');
  letterEl.textContent = '';
  emojiWordEl.textContent = '';
  cardImageEl.classList.add('hidden');
  cardSentenceEl.textContent = '';

  // Spawn 5-8 random emoji bubbles at random positions
  const count = Math.floor(Math.random() * 4) + 5;
  for (let i = 0; i < count; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'surprise-bubble';
    bubble.textContent = SURPRISE_EMOJIS[Math.floor(Math.random() * SURPRISE_EMOJIS.length)];
    bubble.style.left = Math.random() * 80 + 10 + 'vw';
    bubble.style.top = Math.random() * 60 + 20 + 'vh';
    particlesEl.appendChild(bubble);
    bubble.addEventListener('animationend', () => bubble.remove());
  }

  if (!isRepeat) playRisingScale();

  promptEl.style.display = 'none';
}

function triggerCardAnimation() {
  letterCard.classList.remove('show');
  void letterCard.offsetWidth; // Force reflow
  letterCard.classList.add('show');
}

const parentBtn = document.getElementById('parent-btn');
const parentPanel = document.getElementById('parent-panel');
const muteToggle = document.getElementById('mute-toggle');
const challengeToggle = document.getElementById('challenge-toggle');

// 单击齿轮切换设置面板
parentBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  parentPanel.classList.toggle('open');
});

// Close panel when clicking outside
document.addEventListener('click', (e) => {
  if (!parentPanel.contains(e.target) && e.target !== parentBtn) {
    parentPanel.classList.remove('open');
  }
});

// Toggle handlers
muteToggle.addEventListener('change', () => {
  isMuted = muteToggle.checked;
  if (isMuted) {
    stopSpeech();
    isSpeaking = false;
  }
});

challengeToggle.addEventListener('change', () => {
  challengeEnabled = challengeToggle.checked;
  if (!challengeEnabled && challengeActive) {
    clearTimeout(challengeTimer);
    endChallenge(false);
  }
});

// 词汇库切换
const librarySelect = document.getElementById('library-select');
librarySelect.value = currentLibrary;
librarySelect.addEventListener('change', (e) => {
  currentLibrary = librarySelect.value;
  // 切换库时清空各字母的轮换池，并结束当前挑战以避免数据不一致
  for (const k in roundState) delete roundState[k];
  if (challengeActive) {
    clearTimeout(challengeTimer);
    endChallenge(false);
  }
});

// 开发模式：把家长新增的单词提交给本地服务，供后续资源生成流程读取。
const customWordInput = document.getElementById('custom-word-input');
const customWordAdd = document.getElementById('custom-word-add');
const customWordStatus = document.getElementById('custom-word-status');

function setCustomWordStatus(message, kind) {
  customWordStatus.textContent = message;
  customWordStatus.classList.toggle('success', kind === 'success');
  customWordStatus.classList.toggle('error', kind === 'error');
}

async function submitCustomWord() {
  const word = customWordInput.value.trim().replace(/\s+/g, ' ');
  if (!word) {
    setCustomWordStatus('Enter a word first.', 'error');
    return;
  }

  customWordAdd.disabled = true;
  setCustomWordStatus('Saving...', '');
  try {
    const response = await fetch('/api/pending-words', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word, library: currentLibrary }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Unable to save word.');
    if (result.status === 'duplicate') {
      setCustomWordStatus(`${word} is already waiting.`, 'success');
      return;
    }
    customWordInput.value = '';
    setCustomWordStatus(`${word} saved for Codex.`, 'success');
  } catch (error) {
    setCustomWordStatus('Start with: node scripts/dev_server.mjs', 'error');
  } finally {
    customWordAdd.disabled = false;
  }
}

customWordAdd.addEventListener('click', (e) => {
  e.stopPropagation();
  submitCustomWord();
});

customWordInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    submitCustomWord();
  }
});

// 重置花朵收集
const flowerReset = document.getElementById('flower-reset');
flowerReset.addEventListener('click', (e) => {
  e.stopPropagation();
  flowerCount = 0;
  try { localStorage.removeItem('flowerCount'); } catch (e2) { /* ignore */ }
  flowerRow.innerHTML = '';
  updateFlowerCounter(true);
});

// Touch support - tapping screen creates emoji bubbles at touch point
document.getElementById('game').addEventListener('touchstart', (e) => {
  if (e.target.closest('#parent-btn') || e.target.closest('#parent-panel')) return;
  e.preventDefault();

  for (const touch of e.changedTouches) {
    const bubble = document.createElement('div');
    bubble.className = 'surprise-bubble';
    bubble.textContent = SURPRISE_EMOJIS[Math.floor(Math.random() * SURPRISE_EMOJIS.length)];
    bubble.style.left = touch.clientX + 'px';
    bubble.style.top = touch.clientY + 'px';
    particlesEl.appendChild(bubble);
    bubble.addEventListener('animationend', () => bubble.remove());
  }
  playDing(500 + Math.random() * 300);
});
