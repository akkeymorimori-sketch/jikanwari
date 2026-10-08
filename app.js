'use strict';

/* ===== 基本 ===== */
const $ = s => document.querySelector(s);
const DAYS = ['月', '火', '水', '木', '金', '土'];
const WEEK = ['日', '月', '火', '水', '木', '金', '土'];
const KEY = 'jikanwari-v2';
const OLD_KEY = 'jikanwari-v1';
const SEARCH_DAYS = 120; // 長期休みをまたいで次の授業を探す日数
const HISTORY_MAX = 60;  // 持ち物の入力候補として覚えておく数

const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseYmd = s => {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const isYmd = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
const todayStr = () => ymd(new Date());
const dayIndex = d => (d.getDay() + 6) % 7; // 月=0 … 日=6
const addDays = (d, k) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + k);
const md = d => `${d.getMonth() + 1}/${d.getDate()}(${WEEK[d.getDay()]})`;
const hm = d => `${d.getHours()}:${pad(d.getMinutes())}`;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const isHttp = s => /^https?:\/\//i.test(s || '');
// 金額を整数に（「12,345円」みたいな文字でもOK、読めなければ null）
const toYen = v => {
  if (v == null || v === '') return null;
  const n = +String(v).replace(/[,，円¥\s]/g, '');
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : null;
};

const DEFAULT_TIMES = [
  ['08:50', '10:20'], ['10:30', '12:00'], ['13:00', '14:30'], ['14:40', '16:10'],
  ['16:20', '17:50'], ['18:00', '19:30'], ['19:40', '21:10'], ['', ''], ['', ''], ['', '']
];

const PROVIDERS = {
  gemini: {
    label: 'Gemini（Google AI Studio・無料枠あり）',
    url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    model: 'gemini-3.5-flash-lite',
    models: ['gemini-3.5-flash-lite', 'gemini-3.8-flash'],
    keyUrl: 'https://aistudio.google.com/apikey',
    note: '無料枠では送った画像が Google の製品改善に使われる。'
  },
  openrouter: {
    label: 'OpenRouter（無料モデルあり）',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: '',
    models: [],
    keyUrl: 'https://openrouter.ai/collections/free-models',
    note: '画像に対応した無料モデルのIDを一覧から選んで入れてね。'
  },
  claude: {
    label: 'Claude（有料）',
    url: 'https://api.anthropic.com/v1/messages',
    model: 'claude-sonnet-5',
    models: ['claude-sonnet-5', 'claude-haiku-4-5-20251001'],
    keyUrl: 'https://platform.claude.com/',
    note: ''
  }
};

// 混雑時に切り替える予備のモデル（今はなし）
const FALLBACK_MODEL = {};

/* ===== テーマ ===== */
const COLORS = ['blue', 'green', 'pink', 'red', 'purple', 'yellow', 'gray'];
const FONTS = ['system', 'maru', 'mincho'];
function applyTheme(th) {
  const r = document.documentElement;
  if (th.color === 'blue') delete r.dataset.color; else r.dataset.color = th.color;
  if (th.font === 'system') delete r.dataset.font; else r.dataset.font = th.font;
}

/* ===== データ ===== */
let state;

let brokenSaved = false;
function readJSON(k) {
  const raw = localStorage.getItem(k);
  if (raw == null) return null;
  try { return JSON.parse(raw); }
  catch {
    // 壊れたデータは消さずに別名で残す
    try { localStorage.setItem(`${k}-broken-${Date.now()}`, raw); brokenSaved = true; } catch {}
    return null;
  }
}

function defaultTermName(d = new Date()) {
  const m = d.getMonth() + 1;
  const y = m <= 3 ? d.getFullYear() - 1 : d.getFullYear();
  return `${y}年度 ${m >= 4 && m <= 9 ? '前期' : '後期'}`;
}

function nextTermName(name) {
  const m = name.match(/(\d{4})年度\s*(前期|後期)/);
  if (!m) return defaultTermName();
  return m[2] === '前期' ? `${m[1]}年度 後期` : `${+m[1] + 1}年度 前期`;
}

const newTerm = (name, start = '', end = '', courses = []) =>
  ({ id: uid(), name, start, end, offDays: [], swaps: [], cancels: [], courses });

// day = -1 は集中講義
const newCourse = (day, period, extra = {}) => ({
  id: uid(), day, period, name: '', short: '', teacher: '', room: '', syllabus: '', from: '', to: '',
  items: [], memos: [], tasks: [], absences: [], maxAbsence: '', ...extra
});

// 旧バージョン（学期なし）のデータを変換
function fromV1(old) {
  const t = newTerm(defaultTermName());
  const s = { terms: [t], currentTermId: t.id };
  if (!old) return s;
  t.courses = (old.courses || []).map(c => ({
    ...c,
    items: (c.items || []).filter(i => !i.done)
      .map(i => ({ id: uid(), text: i.text, type: 'next', added: Date.now(), until: null }))
  }));
  s.periods = old.periods;
  s.showSat = old.showSat;
  s.provider = old.provider;
  s.keys = old.keys || {};
  s.models = old.models || {};
  if (old.apiKey) s.keys.claude = old.apiKey;
  if (old.model) s.models.claude = old.model;
  return s;
}

function normalize(s) {
  // おかしなIDや重複したIDは作り直す
  const seen = new Set();
  const fixId = v => {
    let id = typeof v === 'string' && /^[\w-]{1,40}$/.test(v) ? v : uid();
    while (seen.has(id)) id = uid();
    seen.add(id);
    return id;
  };
  s.periods ??= 7;
  s.showSat ??= false;
  if (!s.shiftDefaultOn) { s.shiftTimes = true; s.shiftDefaultOn = true; } // 時刻ずらしは最初ON
  s.syllabusSearch ??= '';
  s.lastExport ??= 0;
  s.itemHistory = Array.isArray(s.itemHistory) ? s.itemHistory.filter(x => typeof x === 'string') : [];
  s.times ??= [];
  for (let i = 0; i < 10; i++) {
    s.times[i] ??= { start: DEFAULT_TIMES[i][0], end: DEFAULT_TIMES[i][1] };
  }
  if (!PROVIDERS[s.provider]) s.provider = 'gemini';
  s.keys ??= {};
  s.models ??= {};
  s.packChecks ??= {};

  // 前に3.8を保存してたら、1回だけ3.5に戻す
  if (!s.geminiDefault35) {
    if (s.models.gemini === 'gemini-3.8-flash') delete s.models.gemini;
    s.geminiDefault35 = true;
  }

  // テーマ
  s.theme ??= {};
  if (!COLORS.includes(s.theme.color)) s.theme.color = 'blue';
  if (!FONTS.includes(s.theme.font)) s.theme.font = 'system';

  // バイトなどの予定（学期をまたいで共通）
  s.events = Array.isArray(s.events) ? s.events.filter(e => e && isYmd(e.date)) : [];
  for (const e of s.events) {
    e.id = fixId(e.id);
    e.kind = e.kind === 'other' ? 'other' : 'job';
    e.title ??= ''; e.start ??= ''; e.end ??= '';
  }
  // 予定の入力候補（名前・種類・時刻を覚える）
  const hadPresets = Array.isArray(s.evPresets);
  s.evPresets = hadPresets
    ? s.evPresets.filter(p => p && typeof p.title === 'string' && p.title).map(p => ({
        title: p.title, kind: p.kind === 'other' ? 'other' : 'job', start: p.start || '', end: p.end || ''
      }))
    : [];
  // 前から入ってる予定があれば、そこから候補を作る（初回だけ）
  if (!hadPresets) {
    for (const e of [...s.events].sort((a, b) => b.date.localeCompare(a.date))) {
      if (e.title && !s.evPresets.some(p => p.title === e.title))
        s.evPresets.push({ title: e.title, kind: e.kind, start: e.start, end: e.end });
    }
  }

  // バイトの収入（支給日で集計）
  s.incomes = Array.isArray(s.incomes) ? s.incomes.filter(x => x && isYmd(x.date)) : [];
  for (const x of s.incomes) {
    x.id = fixId(x.id);
    x.job = typeof x.job === 'string' ? x.job : '';
    x.month = typeof x.month === 'string' && /^\d{4}-\d{2}$/.test(x.month) ? x.month : '';
    x.gross = toYen(x.gross);
    x.net = toYen(x.net);
  }
  s.incomeLimit = toYen(s.incomeLimit) ?? '';

  delete s.icon;
  delete s.appName;
  if (!Array.isArray(s.terms) || !s.terms.length) s.terms = [newTerm(defaultTermName())];
  for (const t of s.terms) {
    t.id = fixId(t.id);
    t.start ??= '';
    t.end ??= '';
    t.offDays ??= [];
    t.swaps ??= [];
    t.cancels ??= [];
    t.courses ??= [];
    for (const o of t.offDays) o.id = fixId(o.id);
    for (const x of t.swaps) x.id = fixId(x.id);
    for (const c of t.courses) {
      c.id = fixId(c.id);
      c.name ??= ''; c.short ??= ''; c.teacher ??= ''; c.room ??= ''; c.syllabus ??= '';
      c.from ??= ''; c.to ??= '';
      c.items ??= []; c.memos ??= []; c.tasks ??= [];
      c.absences = Array.isArray(c.absences) ? c.absences.filter(isYmd) : [];
      c.maxAbsence ??= '';
      if (c.maxAbsence !== '' && !Number.isFinite(+c.maxAbsence)) c.maxAbsence = '';
      for (const i of c.items) {
        i.id = fixId(i.id);
        i.type ??= 'next';
        i.added ??= Date.now();
        i.until ??= null;
      }
      for (const k of c.tasks) k.id = fixId(k.id);
      for (const m of c.memos) m.id = fixId(m.id);
    }
    const ids = new Set(t.courses.map(c => c.id));
    t.cancels = t.cancels.filter(x => ids.has(x.courseId) && isYmd(x.date));
    for (const x of t.cancels) x.id = fixId(x.id);
  }
  // メモ・一言日記・消したバイト先の候補
  s.notes = Array.isArray(s.notes)
    ? s.notes.filter(n => n && typeof n.text === 'string' && n.text.trim() && isYmd(n.date)) : [];
  for (const n of s.notes) { n.id = fixId(n.id); n.pin = !!n.pin; }
  s.diary = s.diary && typeof s.diary === 'object' && !Array.isArray(s.diary) ? s.diary : {};
  for (const k of Object.keys(s.diary))
    if (!isYmd(k) || typeof s.diary[k] !== 'string' || !s.diary[k].trim()) delete s.diary[k];
  s.jobHidden = Array.isArray(s.jobHidden) ? s.jobHidden.filter(v => typeof v === 'string') : [];
  if (!s.terms.some(t => t.id === s.currentTermId)) s.currentTermId = s.terms[0].id;
  return s;
}

let saveWarned = false;
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    saveWarned = false;
  } catch {
    if (!saveWarned) alert('保存できなかった。空き容量がないか、プライベートブラウズかも。設定から書き出しておいてね');
    saveWarned = true;
  }
}
const term = () => state.terms.find(t => t.id === state.currentTermId);
const courses = () => term().courses;
const modelOf = p => state.models[p] || PROVIDERS[p].model;
// 一覧で使う名前（略名があれば略名）
const nm = c => (c.short || '').trim() || c.name;

/* ===== 日付・時刻の計算 ===== */
function toMin(v) {
  if (!v) return null;
  const [h, m] = v.split(':').map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null;
}
const fromMin = m => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;

// 学期の期間内か
function inTerm(date, t = term()) {
  const k = ymd(date);
  return (!t.start || k >= t.start) && (!t.end || k <= t.end);
}
const pastEnd = (date, t) => !!t.end && ymd(date) > t.end;

// 授業がない日の登録があればそれを返す
function offInfo(date, t = term()) {
  const k = ymd(date);
  return t.offDays.find(o => k >= o.from && k <= (o.to || o.from)) || null;
}

// その日に行う授業の曜日（振替があればそちら）
function effDay(date, t = term()) {
  const k = ymd(date);
  const s = t.swaps.find(x => x.date === k);
  return s ? s.asDay : dayIndex(date);
}

const isClassDay = (date, t = term()) => inTerm(date, t) && !offInfo(date, t);

// この授業だけ休講か
const isCancelled = (c, date, t = term()) => {
  const k = ymd(date);
  return t.cancels.some(x => x.courseId === c.id && x.date === k);
};

// その日にある授業（休講は除く）
function coursesOn(date, t = term()) {
  if (!isClassDay(date, t)) return [];
  const d = effDay(date, t);
  return t.courses.filter(c => c.day === d && !isCancelled(c, date, t)).sort((a, b) => a.period - b.period);
}

// その日に休講になった授業
function cancelledOn(date, t = term()) {
  if (!isClassDay(date, t)) return [];
  const d = effDay(date, t);
  return t.courses.filter(c => c.day === d && isCancelled(c, date, t));
}

// 探し始める日（学期開始前なら開始日から）
function searchBase(from, t = term()) {
  const s = parseYmd(t.start);
  return s && s > from ? s : from;
}

// 指定日の授業の開始・終了
function occurrence(c, date) {
  const t = state.times[c.period - 1];
  const s = toMin(t?.start), e = toMin(t?.end);
  if (s == null || e == null) return null;
  const y = date.getFullYear(), mo = date.getMonth(), d = date.getDate();
  return { start: new Date(y, mo, d, 0, s), end: new Date(y, mo, d, 0, e) };
}

const hasClass = (c, date, t) =>
  isClassDay(date, t) && effDay(date, t) === c.day && !isCancelled(c, date, t);

// from より後に始まる、いちばん近い回
function nextOccurrence(c, t = term(), from = new Date()) {
  const base = searchBase(from, t);
  for (let k = 0; k < SEARCH_DAYS; k++) {
    const date = addDays(base, k);
    if (pastEnd(date, t)) break;
    if (!hasClass(c, date, t)) continue;
    const o = occurrence(c, date);
    if (o && o.start > from) return o;
  }
  return null;
}

// この先の授業日（休講の候補用）
function occurrencesAhead(c, n, t = term(), from = new Date()) {
  const out = [], base = searchBase(from, t);
  for (let k = 0; k < SEARCH_DAYS && out.length < n; k++) {
    const date = addDays(base, k);
    if (pastEnd(date, t)) break;
    if (!hasClass(c, date, t)) continue;
    const o = occurrence(c, date);
    if (o && o.end <= from) continue;
    out.push(date);
  }
  return out;
}

// いちばん最近あった回の日付（欠席の初期値）
function lastClassDate(c, t = term(), now = new Date()) {
  for (let k = 0; k < SEARCH_DAYS; k++) {
    const date = addDays(now, -k);
    if (t.start && ymd(date) < t.start) break;
    if (!hasClass(c, date, t)) continue;
    const o = occurrence(c, date);
    if (k === 0 && o && o.start > now) continue;
    return ymd(date);
  }
  return todayStr();
}

const untilFor = (c, t = term(), from = new Date()) => nextOccurrence(c, t, from)?.end.getTime() ?? null;

// 「次回だけ」は「登録した後の最初の授業」の終了時刻で消える
function recomputeUntil() {
  for (const t of state.terms) for (const c of t.courses) for (const i of c.items) {
    if (i.type === 'next') i.until = untilFor(c, t, new Date(i.added));
  }
}

// 授業が終わった「次回だけ」と、過ぎた日のチェックを消す
function prune() {
  const now = Date.now();
  let changed = false;
  for (const t of state.terms) for (const c of t.courses) {
    const n = c.items.length;
    c.items = c.items.filter(i => i.type !== 'next' || i.until == null || i.until > now);
    if (c.items.length !== n) changed = true;
  }
  const today = todayStr();
  for (const k of Object.keys(state.packChecks)) {
    if (k < today) { delete state.packChecks[k]; changed = true; }
  }
  if (changed) save();
}

// 時刻・休み・曜日・休講などが変わったときの再計算
function scheduleChanged() {
  recomputeUntil();
  prune();
  save();
  renderAll();
}

// ある回に持っていく物
const itemsFor = (c, occStart) =>
  c.items.filter(i => i.type === 'always' || i.until == null || i.until > occStart.getTime());

function fmtLeft(ms) {
  const m = Math.max(1, Math.ceil(ms / 60000));
  if (m < 60) return `${m}分`;
  const h = Math.floor(m / 60), r = m % 60;
  return r ? `${h}時間${r}分` : `${h}時間`;
}

function dayDiff(a, b) {
  const da = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const db = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((da - db) / 86400000);
}

function dueState(due) {
  if (!due) return { cls: '', label: '期限なし' };
  const dd = parseYmd(due);
  const diff = dayDiff(dd, new Date());
  if (diff < 0) return { cls: 'over', label: `${md(dd)} 期限切れ` };
  if (diff === 0) return { cls: 'soon', label: '今日まで' };
  if (diff === 1) return { cls: 'soon', label: '明日まで' };
  if (diff <= 3) return { cls: 'soon', label: `${md(dd)}まで（あと${diff}日）` };
  return { cls: '', label: `${md(dd)}まで` };
}

function offLabel(o) {
  const f = parseYmd(o.from);
  const range = o.to && o.to !== o.from ? `${md(f)}〜${md(parseYmd(o.to))}` : md(f);
  return o.note ? `${range} ${o.note}` : range;
}

const termEnded = (t = term(), now = new Date()) => !!t.end && t.end < ymd(now);

// 今の学期が終わったときに切り替え先として出す学期
function suggestTerm(now) {
  const today = ymd(now);
  return state.terms
    .filter(x => x.id !== state.currentTermId && (!x.end || x.end >= today))
    .sort((a, b) => (a.start || '').localeCompare(b.start || ''))[0] || null;
}

// 欠席の集計
function absInfo(c) {
  const n = c.absences.length;
  const max = c.maxAbsence === '' ? null : +c.maxAbsence;
  return { n, max, left: max == null ? null : max - n };
}

/* ===== シラバス ===== */
// 開くURL（授業ごとのURL → なければ検索ページ）
function syllabusURL(c) {
  if (isHttp(c.syllabus)) return c.syllabus.trim();
  const tpl = state.syllabusSearch.trim();
  if (!isHttp(tpl)) return '';
  return tpl.replace(/\{授業名\}/g, encodeURIComponent(c.name.trim()));
}

function renderSyllabusHint() {
  const c = cur();
  if (!c) return;
  const v = c.syllabus.trim();
  let msg;
  if (v && !isHttp(v)) msg = 'URLは https:// から始まる形で入れてね';
  else if (v) msg = '登録したURLを開くよ';
  else if (isHttp(state.syllabusSearch)) msg = state.syllabusSearch.includes('{授業名}')
    ? `シラバス検索で「${c.name}」を開くよ`
    : '「開く」で授業名をコピーして検索ページを開くよ。検索欄に貼り付けてね';
  else msg = '設定の「シラバス検索」にページのURLを入れておくと、ここから開けるよ';
  $('#cSyllabusHint').textContent = msg;
}

/* ===== 画面：次の授業 ===== */
function upcoming(now) {
  const t = term(), base = searchBase(now, t), list = [];
  for (let k = 0; k < SEARCH_DAYS; k++) {
    const date = addDays(base, k);
    if (pastEnd(date, t)) break;
    for (const c of coursesOn(date, t)) {
      const o = occurrence(c, date);
      if (o && o.end > now) list.push({ c, ...o });
    }
    if (list.some(x => x.start > now)) break;
  }
  return list.sort((a, b) => a.start - b.start);
}

function courseLine(x) {
  const its = itemsFor(x.c, x.start);
  return `<div class="nc" data-id="${x.c.id}">` +
    `<b>${esc(nm(x.c))}</b> <small>${esc(x.c.room)}</small>` +
    (its.length ? `<div class="nc-items">持ち物：${its.map(i => esc(i.text)).join('、')}</div>` : '') +
    `</div>`;
}

function whenLabel(start, now) {
  const diff = dayDiff(start, now);
  if (diff === 0) return `今日 ${hm(start)}〜（あと${fmtLeft(start - now)}）`;
  if (diff === 1) return `明日 ${hm(start)}〜`;
  return `${md(start)} ${hm(start)}〜`;
}

function renderNow() {
  const el = $('#nowCard'), now = new Date(), t = term();
  if (!courses().length) {
    el.innerHTML = '<h2>はじめに</h2><p class="muted">まずは時間割を作ろう</p><div class="startBtns">' +
      '<button data-go="grid" class="primary">手入力で作る</button>' +
      (state.keys[state.provider] ? '<button data-go="import">画像から読み込む</button>' : '') +
      '<button data-go="share">共有コードから読み込む</button></div>';
    return;
  }

  if (termEnded(t, now)) {
    const nt = suggestTerm(now);
    el.innerHTML = `<h2>この学期は終わったよ</h2>` +
      `<p class="muted">${esc(t.name)}は${md(parseYmd(t.end))}で終了</p>` +
      (nt ? `<button data-switch="${nt.id}">「${esc(nt.name)}」に切り替える</button>`
          : '<p class="muted">上の学期の欄で「＋ 新しい学期を作る」を選んでね</p>');
    return;
  }

  let h = '';
  const s = parseYmd(t.start);
  if (s && dayDiff(s, now) > 0) {
    h += `<p class="start">授業開始まで <b>あと${dayDiff(s, now)}日</b>（${md(s)}から）</p>`;
  } else if (inTerm(now, t)) {
    const off = offInfo(now, t);
    if (off) {
      h += `<p class="start">今日は授業なし${off.note ? `（${esc(off.note)}）` : ''}</p>`;
    } else {
      if (effDay(now, t) !== dayIndex(now)) h += `<p class="start">今日は${DAYS[effDay(now, t)]}曜の授業をやる日</p>`;
      const cc = cancelledOn(now, t);
      if (cc.length) h += `<p class="start">今日休講：${cc.map(c => esc(nm(c))).join('、')}</p>`;
    }
  }


  const list = upcoming(now);
  const curList = list.filter(x => x.start <= now);
  const first = list.find(x => x.start > now);
  const nxt = first ? list.filter(x => +x.start === +first.start) : [];
  let body = '';
  if (curList.length) {
    const c = curList[0].c;
    body += `<h2>今の授業 <small>${DAYS[c.day]}${c.period}・あと${fmtLeft(curList[0].end - now)}で終わり</small></h2>` +
      curList.map(courseLine).join('');
  }
  if (nxt.length) {
    const c = nxt[0].c;
    body += `<h2>次の授業 <small>${DAYS[c.day]}${c.period}・${whenLabel(nxt[0].start, now)}</small></h2>` +
      nxt.map(courseLine).join('');
  }
  el.innerHTML = h + (body || '<h2>次の授業</h2><p class="muted">設定で各時限の時刻を入れると表示されるよ</p>') +
    todayFlow(now, t) + '<button type="button" class="addEv" data-addev>＋ 今日の予定を追加</button>';
}

// 今日の流れ：授業とバイト・予定を時刻順に（全部終わったら出さない）
function todayFlow(now, t = term()) {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const rows = [];
  for (const c of coursesOn(now, t)) {
    const o = occurrence(c, now);
    const a = absInfo(c);
    rows.push({
      min: o ? o.start.getHours() * 60 + o.start.getMinutes() : 2000 + c.period,
      time: o ? hm(o.start) : `${c.period}限`,
      label: `${c.period}限 ${esc(nm(c))}` + (c.room ? ` <small>${esc(c.room)}</small>` : '') +
        (a.left != null && a.left <= 1 ? ` <span class="absWarn">⚠欠席${a.n}/${a.max}</span>` : ''),
      past: !!o && o.end <= now, id: c.id, cls: 'f-cls'
    });
  }
  for (const e of eventsOn(ymd(now))) {
    const s = toMin(e.start), en = toMin(e.end);
    const end = e.end ? `〜${en != null && s != null && en <= s ? '翌' : ''}${e.end}` : '';
    rows.push({
      min: s ?? -1, time: e.start || '',
      label: esc(e.title || EV_LABEL[e.kind]) + (end ? ` <small>${esc(end)}</small>` : ''),
      past: s != null && en != null && en > s && en <= nowMin, id: '', cls: `f-${e.kind}`
    });
  }
  const left = rows.filter(r => !r.past);
  if (!left.length) return '';
  // 残りが授業1つだけなら「次の授業」と同じなので出さない
  if (left.length === 1 && rows.every(r => r.cls === 'f-cls')) return '';
  rows.sort((a, b) => a.min - b.min);
  return '<h3 class="flowH">今日の流れ</h3><ul class="flow">' + rows.map(r =>
    `<li class="${r.cls}${r.past ? ' past' : ''}"${r.id ? ` data-id="${r.id}"` : ''}>` +
    `<span class="ft">${esc(r.time)}</span><span class="fl">${r.label}</span></li>`).join('') + '</ul>';
}

/* ===== 画面：今日・明日の持ち物 ===== */
let packList = [], packKey = '';

// 今日まだ始まってない授業があれば今日、なければ次の授業日
function packTarget(now) {
  const t = term(), s = parseYmd(t.start);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const pending = coursesOn(today, t).some(c => occurrence(c, today)?.start > now);
  const base = searchBase(pending ? today : addDays(today, 1), t);
  const notes = [], seen = new Set();
  const note = (key, text) => { if (!seen.has(key)) { seen.add(key); notes.push(text); } };

  for (let k = 0; k < SEARCH_DAYS; k++) {
    const date = addDays(base, k);
    if (pastEnd(date, t)) break;
    if (!inTerm(date, t)) continue;
    const off = offInfo(date, t);
    if (off) {
      if (t.courses.some(c => c.day === effDay(date, t))) note(off.id, `休み：${offLabel(off)}`);
      continue;
    }
    const isToday = dayDiff(date, now) === 0;
    for (const c of cancelledOn(date, t)) note(`${c.id}@${ymd(date)}`, `休講：${md(date)} ${nm(c)}`);
    const cs = coursesOn(date, t).filter(c => !isToday || occurrence(c, date)?.start > now);
    if (cs.length) {
      const ed = effDay(date, t);
      return {
        date, cs, notes, isToday,
        first: !!s && dayDiff(s, now) > 0,
        swapped: ed !== dayIndex(date) ? ed : null
      };
    }
  }
  return null;
}

function renderPack() {
  const el = $('#packCard'), now = new Date(), t = packTarget(now);
  if (!t) {
    const msg = courses().length ? '近いうちに授業はないよ' : '授業がまだ登録されてないよ';
    el.innerHTML = `<h2>持ち物</h2><p class="muted">${msg}</p>`;
    packList = [];
    return;
  }
  packKey = ymd(t.date);
  const checks = state.packChecks[packKey] || {};

  // 同じ物は1つにまとめる
  const map = new Map();
  for (const c of t.cs) {
    const o = occurrence(c, t.date);
    const its = o ? itemsFor(c, o.start) : c.items;
    for (const i of its) {
      const k = i.text.trim();
      if (!map.has(k)) map.set(k, { text: k, always: false, from: [] });
      const e = map.get(k);
      if (!e.from.includes(nm(c))) e.from.push(nm(c));
      if (i.type === 'always') e.always = true;
    }
  }
  packList = [...map.values()];
  const done = packList.filter(e => checks[e.text]).length;

  const diff = dayDiff(t.date, now);
  let title = diff === 0 ? `今日 ${md(t.date)}` : diff === 1 ? `明日 ${md(t.date)}` : md(t.date);
  if (t.swapped != null) title += `（${DAYS[t.swapped]}曜授業）`;
  if (t.first) title += '（授業初日）';
  const names = t.cs.map(c => `${c.period}限 ${esc(nm(c))}`).join('／');
  const noteHint = t.notes.length ? `<p class="hint">${t.notes.map(esc).join('、')}</p>` : '';

  el.innerHTML =
    `<h2>${title}の持ち物 <small>${packList.length ? `${done}/${packList.length}` : ''}</small></h2>` +
    noteHint +
    `<p class="hint">${names}</p>` +
    (packList.length
      ? '<ul>' + packList.map((e, idx) =>
          `<li><label><input type="checkbox" data-pack="${idx}" ${checks[e.text] ? 'checked' : ''}>` +
          `<span class="${checks[e.text] ? 'done' : ''}">${esc(e.text)}</span>` +
          (e.always ? '<span class="tag">毎回</span>' : '') +
          `</label><span class="from">${e.from.map(esc).join('・')}</span></li>`).join('') + '</ul>'
      : '<p class="muted">登録された持ち物はないよ</p>') +
    (packList.length && done === packList.length ? '<p class="ok">準備OK</p>' : '');
}

/* ===== 画面：課題 ===== */
let taskAll = false; // 課題を全部表示するか

function renderTasks() {
  const el = $('#taskCard'), now = new Date();
  const all = [];
  for (const c of courses()) for (const t of c.tasks) if (!t.done) all.push({ c, t });
  all.sort((a, b) => (a.t.due || '9999').localeCompare(b.t.due || '9999'));
  if (!all.length) {
    el.innerHTML = '<h2>課題</h2><p class="muted">未完了の課題はないよ。カレンダーの日付か、時間割の授業から追加できる</p>';
    return;
  }
  // 普段は期限切れと7日以内だけ。なければ近い順に3件
  const near = all.filter(x => x.t.due && dayDiff(parseYmd(x.t.due), now) <= 7);
  const base = near.length ? near : all.slice(0, 3);
  const shown = taskAll ? all : base;
  const rest = all.length - shown.length;
  el.innerHTML = `<h2>課題 <small>${all.length}件</small></h2><ul>` + shown.map(({ c, t }) => {
    const st = dueState(t.due);
    return `<li class="${st.cls}"><label><input type="checkbox" data-task="${t.id}" data-cid="${c.id}">` +
      `<span>${esc(t.title)}</span></label>` +
      `<span class="due" data-id="${c.id}">${esc(nm(c))}・${st.label}</span></li>`;
  }).join('') + '</ul>' +
    (rest > 0 ? `<button class="more" data-tmore>ほか${rest}件を表示</button>` : '') +
    (taskAll && base.length < all.length ? '<button class="more" data-tmore>閉じる</button>' : '');
}

/* ===== 画面：時間割 ===== */
function renderGrid() {
  const days = state.showSat || courses().some(c => c.day === 5) ? 6 : 5;
  const periods = Math.max(state.periods, ...courses().filter(c => c.day >= 0).map(c => c.period));
  const today = effDay(new Date());
  const g = $('#grid');
  g.style.gridTemplateColumns = `34px repeat(${days},1fr)`;
  let h = '<div class="head"></div>';
  for (let d = 0; d < days; d++) h += `<div class="head ${d === today ? 'today' : ''}">${DAYS[d]}</div>`;
  for (let p = 1; p <= periods; p++) {
    const t = state.times[p - 1];
    h += `<div class="pnum">${p}${t?.start ? `<small>${esc(t.start)}</small>` : ''}</div>`;
    for (let d = 0; d < days; d++) {
      const cs = courses().filter(c => c.day === d && c.period === p);
      h += `<div class="cell ${d === today ? 'today' : ''}" data-d="${d}" data-p="${p}">` +
        cs.map(c => {
          const ni = c.items.filter(i => i.type === 'next').length;
          const nt = c.tasks.filter(t => !t.done).length;
          const a = absInfo(c);
          const warn = a.left != null && a.left <= 1;
          const marks = (ni ? `<span>🎒${ni}</span>` : '') + (nt ? `<span>📝${nt}</span>` : '') +
            (warn ? `<span class="absWarn">⚠${a.n}/${a.max}</span>` : '');
          return `<div class="course" data-id="${c.id}"><b>${esc(nm(c))}</b>` +
            (c.room ? `<small>${esc(c.room)}</small>` : '') +
            (marks ? `<div class="marks">${marks}</div>` : '') + `</div>`;
        }).join('') + '</div>';
    }
  }
  g.innerHTML = h;
}

function renderTermSelect() {
  $('#termSelect').innerHTML = state.terms.map(t =>
    `<option value="${t.id}" ${t.id === state.currentTermId ? 'selected' : ''}>${esc(t.name)}</option>`).join('') +
    '<option value="__new">＋ 新しい学期を作る</option>';
}

/* ===== 画面：集中講義 ===== */
function rangeLabel(c) {
  if (!c.from) return '日程未定';
  return c.to && c.to !== c.from ? `${md(parseYmd(c.from))}〜${md(parseYmd(c.to))}` : md(parseYmd(c.from));
}

function renderIntensive() {
  const list = courses().filter(c => c.day === -1)
    .sort((a, b) => (a.from || '9999').localeCompare(b.from || '9999'));
  $('#intCard').innerHTML =
    `<h2>集中講義${list.length ? ` <small>${list.length}件</small>` : ''}</h2>` +
    (list.length
      ? '<div class="intList">' + list.map(c => {
          const ni = c.items.filter(i => i.type === 'next').length;
          const nt = c.tasks.filter(t => !t.done).length;
          return `<div class="course" data-id="${c.id}"><b>${esc(nm(c))}</b>` +
            `<span class="when">${rangeLabel(c)}</span><small>${esc(c.room)}</small><div>` +
            (ni ? `<span class="badge item">持ち物${ni}</span>` : '') +
            (nt ? `<span class="badge task">課題${nt}</span>` : '') +
            `</div></div>`;
        }).join('') + '</div>'
      : '<p class="muted">曜日・時限が決まってない授業はここに追加してね</p>') +
    '<button id="intAdd">＋ 集中講義を追加</button>';
}

function renderAll() {
  $('#importBtn').hidden = !state.keys[state.provider];
  renderTermSelect();
  renderNow();
  renderPack();
  renderTasks();
  renderNotes();
  renderGrid();
  renderIntensive();
  if (curTab === 'cal' && calMonth) { renderCal(); renderDay(); }
}

/* ===== メイン画面の操作 ===== */
$('#nowCard').addEventListener('click', e => {
  const go = e.target.closest('[data-go]')?.dataset.go;
  if (go === 'grid') return showTab('grid');
  if (go === 'import') return $('#importBtn').click();
  if (go === 'share') return openTermDlg('shareSec');
  const sw = e.target.dataset.switch;
  if (sw) {
    state.currentTermId = sw;
    save(); renderAll();
    return;
  }
  const n = e.target.closest('.nc, .flow li[data-id]');
  if (n) openCourse(n.dataset.id);
});

$('#packCard').addEventListener('change', e => {
  const idx = e.target.dataset.pack;
  if (idx == null) return;
  const text = packList[idx].text;
  state.packChecks[packKey] ??= {};
  if (e.target.checked) state.packChecks[packKey][text] = true;
  else delete state.packChecks[packKey][text];
  save(); renderPack();
});

$('#taskCard').addEventListener('change', e => {
  const id = e.target.dataset.task;
  if (!id) return;
  const c = courses().find(x => x.id === e.target.dataset.cid);
  const t = c?.tasks.find(x => x.id === id);
  if (t) {
    t.done = true; save(); renderAll();
    toast(`「${t.title}」を完了にしたよ`, () => { t.done = false; save(); renderAll(); });
  }
});
$('#taskCard').addEventListener('click', e => {
  if (e.target.closest('[data-tmore]')) { taskAll = !taskAll; renderTasks(); return; }
  const id = e.target.closest('.due')?.dataset.id;
  if (id) openCourse(id);
});

$('#grid').addEventListener('click', e => {
  const co = e.target.closest('.course');
  if (co) return openCourse(co.dataset.id);
  const cell = e.target.closest('.cell');
  if (!cell) return;
  const c = newCourse(+cell.dataset.d, +cell.dataset.p);
  courses().push(c);
  renderAll(); openCourse(c.id);
});

$('#intCard').addEventListener('click', e => {
  const co = e.target.closest('.course');
  if (co) return openCourse(co.dataset.id);
  if (e.target.id !== 'intAdd') return;
  const c = newCourse(-1, 1);
  courses().push(c);
  renderAll(); openCourse(c.id);
});

$('#termSelect').onchange = e => {
  if (e.target.value === '__new') {
    e.target.value = state.currentTermId;
    openTermDlg('newTermSec');
    return;
  }
  state.currentTermId = e.target.value;
  save(); renderAll();
};

/* ===== 授業詳細 ===== */
let currentId = null;
const cur = () => courses().find(c => c.id === currentId);

// キャンセル用：開いたときの授業と休講
let courseBackup = null;
function courseSnap(c, t = term()) {
  return JSON.stringify({ c, cancels: t.cancels.filter(x => x.courseId === c.id) });
}

$('#cDay').innerHTML = DAYS.map((d, i) => `<option value="${i}">${d}曜</option>`).join('') +
  '<option value="-1">集中講義</option>';
$('#cPeriod').innerHTML = Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1}限</option>`).join('');

function renderItemSuggest() {
  const set = new Set(state.itemHistory);
  for (const t of state.terms) for (const c of t.courses) for (const i of c.items) set.add(i.text.trim());
  $('#itemSuggest').innerHTML = [...set].filter(Boolean).map(v => `<option value="${esc(v)}">`).join('');
}

// 集中講義なら時限・休講を隠して日程を出す
function syncIntUI() {
  const isInt = cur()?.day === -1;
  $('#cPeriod').hidden = isInt;
  $('#cIntRow').hidden = !isInt;
  $('#cCancelSec').hidden = isInt;
}

function openCourse(id) {
  currentId = id;
  const c = cur();
  if (!c) return;
  courseBackup = courseSnap(c);
  $('#cName').value = c.name;
  $('#cShort').value = c.short;
  $('#cTeacher').value = c.teacher;
  $('#cRoom').value = c.room;
  $('#cSyllabus').value = c.syllabus;
  $('#cDay').value = c.day;
  $('#cPeriod').value = c.period;
  $('#cFrom').value = c.from;
  $('#cTo').value = c.to;
  syncIntUI();
  $('#taskDue').value = '';
  $('#absDate').value = lastClassDate(c);
  $('#absMax').value = c.maxAbsence;
  renderItemSuggest();
  renderDetail();
  renderSyllabusHint();
  $('#cMore').open = false; // 「詳細」は毎回閉じた状態から
  $('#courseDlg').showModal();
  if (!c.name) $('#cName').focus();
}

function renderDetail() {
  const c = cur();
  if (!c) return;
  const t = term();

  // 持ち物（タグをタップで「次回だけ」⇔「毎回」）
  $('#itemList').innerHTML = c.items.map(i =>
    `<li><span>` +
    (i.type === 'always'
      ? `<button class="tag" data-toggle="${i.id}">毎回</button>`
      : `<button class="tag next" data-toggle="${i.id}">次回${i.until ? '・' + md(new Date(i.until)) : ''}</button>`) +
    `${esc(i.text)}</span><button class="x" data-del="${i.id}" aria-label="削除">×</button></li>`).join('')
    || '<li class="muted">なし</li>';

  // 「詳細」を閉じてても中身がわかるように
  const nc = t.cancels.filter(x => x.courseId === c.id).length;
  const a = absInfo(c);
  const parts = [`欠席${a.n}回`];
  if (nc) parts.push(`休講${nc}件`);
  if (c.syllabus) parts.push('シラバスあり');
  $('#cMoreSum').textContent = parts.join('・');
  $('#cMoreSum').className = a.left != null && a.left <= 1 ? 'alert' : '';

  // 課題
  const ts = c.tasks.slice().sort((a, b) =>
    (a.done - b.done) || (a.due || '9999').localeCompare(b.due || '9999'));
  $('#taskList').innerHTML = ts.map(k => {
    const st = dueState(k.due);
    return `<li class="${k.done ? '' : st.cls}"><label>` +
      `<input type="checkbox" data-tdone="${k.id}" ${k.done ? 'checked' : ''}>` +
      `<span class="${k.done ? 'done' : ''}">${esc(k.title)}</span></label>` +
      `<span class="due">${k.done ? '完了' : st.label}</span>` +
      `<button class="x" data-tdel="${k.id}" aria-label="削除">×</button></li>`;
  }).join('') || '<li class="muted">なし</li>';

  // 先生の一言
  $('#memoList').innerHTML = c.memos.slice().reverse().map(m =>
    `<li><div><span class="memo-date">${esc(m.date)}</span>${esc(m.text).replace(/\n/g, '<br>')}</div>` +
    `<button class="x" data-mdel="${m.id}" aria-label="削除">×</button></li>`).join('');

  // 休講
  $('#cancelList').innerHTML = t.cancels.filter(x => x.courseId === c.id)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(x => `<li><span>${md(parseYmd(x.date))} 休講</span>` +
      `<button class="x" data-cdel="${x.id}" aria-label="削除">×</button></li>`).join('')
    || '<li class="muted">なし</li>';
  const ahead = occurrencesAhead(c, 8);
  $('#cancelDate').innerHTML = ahead.length
    ? ahead.map((d, k) => `<option value="${ymd(d)}">${md(d)}${k === 0 ? '（次回）' : ''}</option>`).join('')
    : '<option value="">この先の授業が見つからない</option>';
  $('#cancelAdd').disabled = !ahead.length;

  // 欠席
  let sum = `${a.n}回`;
  if (a.max != null) sum += a.left < 0 ? ` / 上限${a.max}回（超えてる）` : ` / 上限${a.max}回（あと${a.left}回）`;
  $('#absSummary').textContent = sum;
  $('#absSummary').className = a.left != null && a.left <= 1 ? 'alert' : '';
  $('#absList').innerHTML = c.absences.slice().sort().map(d =>
    `<li><span>${md(parseYmd(d))}</span><button class="x" data-adel="${d}" aria-label="削除">×</button></li>`).join('')
    || '<li class="muted">なし</li>';
}

for (const [id, key] of [['cName', 'name'], ['cShort', 'short'], ['cTeacher', 'teacher'], ['cRoom', 'room']]) {
  $('#' + id).addEventListener('input', e => {
    cur()[key] = e.target.value;
    save(); renderAll();
    if (key === 'name') renderSyllabusHint();
  });
}
for (const [id, key] of [['cDay', 'day'], ['cPeriod', 'period']]) {
  $('#' + id).addEventListener('change', e => {
    cur()[key] = +e.target.value;
    scheduleChanged();
    renderDetail();
    syncIntUI();
  });
}
// 集中講義の日程
for (const [id, key] of [['cFrom', 'from'], ['cTo', 'to']]) {
  $('#' + id).addEventListener('change', e => {
    const c = cur(), before = c[key];
    c[key] = e.target.value;
    if (c.from && c.to && c.to < c.from) {
      alert('終わりの日が始まりの日より前になってるよ');
      c[key] = before;
      e.target.value = before;
      return;
    }
    save(); renderAll();
  });
}

// 持ち物
$('#itemAdd').onclick = () => {
  const v = $('#itemInput').value.trim();
  if (!v) return;
  const c = cur(), now = Date.now();
  c.items.push({ id: uid(), text: v, type: 'next', added: now, until: untilFor(c, term(), new Date(now)) });
  state.itemHistory = [v, ...state.itemHistory.filter(x => x !== v)].slice(0, HISTORY_MAX);
  $('#itemInput').value = '';
  save(); renderItemSuggest(); renderDetail(); renderAll();
};
$('#itemInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.isComposing) $('#itemAdd').click();
});
$('#itemList').addEventListener('click', e => {
  const c = cur();
  const tg = e.target.dataset.toggle;
  if (tg) {
    const i = c.items.find(x => x.id === tg);
    if (i.type === 'always') {
      const now = Date.now();
      i.type = 'next'; i.added = now; i.until = untilFor(c, term(), new Date(now));
    } else {
      i.type = 'always'; i.until = null;
    }
    save(); renderDetail(); renderAll();
    return;
  }
  const id = e.target.dataset.del;
  if (!id) return;
  c.items = c.items.filter(i => i.id !== id);
  save(); renderDetail(); renderAll();
});

// 課題
$('#taskAdd').onclick = () => {
  const v = $('#taskInput').value.trim();
  if (!v) return;
  cur().tasks.push({ id: uid(), title: v, due: $('#taskDue').value, done: false });
  $('#taskInput').value = '';
  $('#taskDue').value = '';
  save(); renderDetail(); renderAll();
};
$('#taskInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.isComposing) $('#taskAdd').click();
});
$('#taskList').addEventListener('change', e => {
  const id = e.target.dataset.tdone;
  if (!id) return;
  cur().tasks.find(t => t.id === id).done = e.target.checked;
  save(); renderDetail(); renderAll();
});
$('#taskList').addEventListener('click', e => {
  const id = e.target.dataset.tdel;
  if (!id) return;
  cur().tasks = cur().tasks.filter(t => t.id !== id);
  save(); renderDetail(); renderAll();
});

// 先生の一言
$('#memoAdd').onclick = () => {
  const v = $('#memoInput').value.trim();
  if (!v) return;
  cur().memos.push({ id: uid(), date: todayStr(), text: v });
  $('#memoInput').value = '';
  save(); renderDetail();
};
$('#memoList').addEventListener('click', e => {
  const id = e.target.dataset.mdel;
  if (!id) return;
  cur().memos = cur().memos.filter(m => m.id !== id);
  save(); renderDetail();
});

// この授業だけ休講
$('#cancelAdd').onclick = () => {
  const date = $('#cancelDate').value;
  if (!date) return;
  term().cancels.push({ id: uid(), courseId: cur().id, date });
  scheduleChanged(); renderDetail();
};
$('#cancelList').addEventListener('click', e => {
  const id = e.target.dataset.cdel;
  if (!id) return;
  term().cancels = term().cancels.filter(x => x.id !== id);
  scheduleChanged(); renderDetail();
});

// 欠席
$('#absAdd').onclick = () => {
  const d = $('#absDate').value;
  if (!d) return alert('欠席した日を選んでね');
  const c = cur();
  if (c.absences.includes(d)) return alert('その日はもう記録してあるよ');
  c.absences.push(d);
  save(); renderDetail(); renderGrid();
};
$('#absList').addEventListener('click', e => {
  const d = e.target.dataset.adel;
  if (!d) return;
  cur().absences = cur().absences.filter(x => x !== d);
  save(); renderDetail(); renderGrid();
});
$('#absMax').addEventListener('input', e => {
  const v = e.target.value;
  cur().maxAbsence = v === '' ? '' : Math.max(0, Math.floor(+v) || 0);
  save(); renderDetail(); renderGrid();
});

// シラバス
$('#cSyllabus').addEventListener('input', e => {
  cur().syllabus = e.target.value.trim();
  save(); renderSyllabusHint();
});
$('#cSyllabusOpen').onclick = () => {
  const c = cur();
  if (c.syllabus && !isHttp(c.syllabus)) return alert('URLは https:// から始まる形で入れてね');
  const url = syllabusURL(c);
  if (!url) return alert('設定の「シラバス検索」に、検索ページのURLを入れてね');
  // 授業ごとのURLがないときは授業名をコピー（開く前にやらないとiPhoneで止められる）
  if (!isHttp(c.syllabus) && c.name.trim()) navigator.clipboard?.writeText(c.name.trim()).catch(() => {});
  window.open(url, '_blank', 'noopener');
};

function removeCourse(c) {
  const t = term();
  t.courses = t.courses.filter(x => x !== c);
  t.cancels = t.cancels.filter(x => x.courseId !== c.id);
}

$('#cDelete').onclick = () => {
  if (!confirm('この授業とメモ・課題・欠席の記録を削除する？')) return;
  removeCourse(cur());
  save(); renderAll(); $('#courseDlg').close();
};

// 変更があれば確認して、開く前の状態に戻す
function closeCourse() {
  const c = cur();
  if (c && courseBackup && courseSnap(c) !== courseBackup) {
    if (!confirm('変更を保存せずに閉じる？')) return;
    const t = term(), b = JSON.parse(courseBackup);
    const idx = t.courses.indexOf(c);
    if (idx >= 0) t.courses[idx] = b.c;
    t.cancels = t.cancels.filter(x => x.courseId !== c.id).concat(b.cancels);
    scheduleChanged();
  }
  $('#courseDlg').close();
}

$('#cClose').onclick = () => $('#courseDlg').close();
$('#cX').onclick = closeCourse;
$('#cCancel').onclick = closeCourse;
$('#courseDlg').addEventListener('cancel', e => { e.preventDefault(); closeCourse(); }); // Escキー

// 何も入ってない授業は閉じたときに消す
$('#courseDlg').addEventListener('close', () => {
  const c = cur();
  if (!c) return;
  const empty = !c.name.trim() && !c.short.trim() && !c.teacher.trim() && !c.room.trim() && !c.syllabus && !c.from && !c.to &&
    !c.items.length && !c.memos.length && !c.tasks.length && !c.absences.length && c.maxAbsence === '';
  if (empty) removeCourse(c);
  save(); renderAll();
});

/* ===== カレンダー（月表示） ===== */
let calMonth = null, calSel = '';
let calMulti = false;          // 複数日選択モード
let curTab = 'today';  // 表示中のタブ
let ctEdit = null;     // 変更中の課題 { cid, id, to }
let ctLastCid = '';    // 前回選んだ授業
const calPicks = new Set();    // 選んだ日（月をまたいでも残る）
const EV_PRESET_MAX = 30;
const EV_LABEL = { job: 'バイト', other: '予定' };
let evEditId = null;           // 変更中の予定

function eventsOn(k) {
  return state.events.filter(e => e.date === k)
    .sort((a, b) => (a.start || '99').localeCompare(b.start || '99'));
}
function evTime(e) {
  if (!e.start) return '';
  const end = e.end ? `〜${toMin(e.end) <= toMin(e.start) ? '翌' : ''}${e.end}` : '〜';
  return `${e.start}${end}`;
}
function evLabel(e) {
  return esc(`${e.title || EV_LABEL[e.kind]}${e.start ? ' ' + evTime(e) : ''}`);
}
function tasksDue(k) {
  const out = [];
  for (const t of state.terms) for (const c of t.courses) for (const x of c.tasks)
    if (x.due === k) out.push({ c, x });
  return out;
}
function intensiveOn(k) {
  return courses().filter(c => c.day === -1 && c.from && k >= c.from && k <= (c.to || c.from));
}
function findCourse(id) {
  for (const t of state.terms) {
    const c = t.courses.find(x => x.id === id);
    if (c) return c;
  }
  return null;
}

function renderCal() {
  const y = calMonth.getFullYear(), m = calMonth.getMonth(), t = term(), today = todayStr();
  $('#calTitle').textContent = `${y}年${m + 1}月`;
  const first = new Date(y, m, 1);
  const start = addDays(first, -dayIndex(first)); // 月曜はじまり
  let h = ['月', '火', '水', '木', '金', '土', '日'].map((d, i) =>
    `<div class="cw ${i === 5 ? 'sat' : i === 6 ? 'sun' : ''}">${d}</div>`).join('');

  for (let n = 0; n < 42; n++) {
    const date = addDays(start, n), k = ymd(date);
    if (n === 35 && date.getMonth() !== m) break; // 5週で収まる月
    const off = inTerm(date, t) ? offInfo(date, t) : null;
    const pending = tasksDue(k).filter(({ x }) => !x.done);
    const labels = [];
    // 課題をいちばん先に並べて、「+1」に隠れないようにする
    for (const { x } of pending) labels.push(`<span class="ev task">${esc(x.title)}</span>`);
    if (off) labels.push(`<span class="ev off">${esc(off.note || '休み')}</span>`);
    for (const c of intensiveOn(k)) labels.push(`<span class="ev int">${esc(nm(c) || '集中講義')}</span>`);
    for (const e of eventsOn(k)) labels.push(`<span class="ev ${e.kind}">${esc(e.title || EV_LABEL[e.kind])}</span>`);

    const cls = ['cd', pending.length && 'due',
      date.getMonth() !== m && 'out', off && 'offday',
      (calMulti ? calPicks.has(k) && 'pick' : k === calSel && 'sel'), k === today && 'today',
      n % 7 === 5 && 'sat', n % 7 === 6 && 'sun'].filter(Boolean).join(' ');
    h += `<div class="${cls}" data-date="${k}"><span class="dn">${date.getDate()}` +
      (pending.length ? `<i class="dueMark">${pending.length}</i>` : '') +
      (state.diary[k] || state.notes.some(x => !x.pin && x.date === k) ? '<i class="noteMark">✎</i>' : '') + '</span>' +
      labels.slice(0, 3).join('') +
      (labels.length > 3 ? `<span class="more">+${labels.length - 3}</span>` : '') + '</div>';
  }
  $('#calGrid').innerHTML = h;
}

function renderDay() {
  const date = parseYmd(calSel), k = calSel, t = term(), rows = [];
  $('#dayTitle').textContent = `${md(date)}の予定`;
  const off = inTerm(date, t) ? offInfo(date, t) : null;
  if (off) rows.push(`<li><span>休み：${esc(offLabel(off))}</span></li>`);
  else {
    const cs = coursesOn(date, t);
    if (cs.length) rows.push(`<li><span class="muted">授業：${cs.map(c => `${c.period}限 ${esc(nm(c))}`).join('／')}</span></li>`);
  }
  for (const c of intensiveOn(k)) rows.push(`<li><span><span class="tag">集中</span>${esc(nm(c))}</span></li>`);
  for (const { c, x } of tasksDue(k)) rows.push(
    `<li class="ctRow ${ctEdit && ctEdit.id === x.id ? 'editing' : ''}">` +
    `<input type="checkbox" data-caltask="${x.id}" data-cid="${c.id}" ${x.done ? 'checked' : ''} aria-label="完了">` +
    `<button type="button" class="evText" data-taskedit="${x.id}" data-cid="${c.id}">` +
    `<span class="${x.done ? 'done' : ''}">${esc(x.title)}</span> <span class="from">${esc(nm(c))}・締切</span></button></li>`);
  for (const e of eventsOn(k)) rows.push(
    `<li class="${e.id === evEditId ? 'editing' : ''}">` +
    `<button type="button" class="evText" data-evedit="${e.id}"><span class="tag">${EV_LABEL[e.kind]}</span>${esc(evTime(e))} ${esc(e.title)}</button>` +
    `<button class="x" data-evdel="${e.id}" aria-label="削除">×</button></li>`);
  for (const n of state.notes) if (!n.pin && n.date === k) rows.push(
    `<li><span><span class="tag next">メモ</span>${esc(n.text)}</span>` +
    `<button class="x" data-ndel="${n.id}" aria-label="削除">×</button></li>`);
  if (state.diary[k] || k <= todayStr()) rows.push(
    `<li><button type="button" class="evText" data-diary="${k}"><span class="tag">日記</span>` +
    (state.diary[k] ? esc(state.diary[k]) : '<span class="muted">一言日記を書く</span>') + '</button></li>');
  $('#dayList').innerHTML = rows.join('') || '<li class="muted">なし</li>';
  renderTaskForm();
}

const EV_ADD_TEXT = $('#evAdd').textContent;

// 予定の候補（タップすると名前・種類・時刻が入る）
function renderEvSuggest() {
  $('#evChips').innerHTML = state.evPresets.slice(0, 10).map((p, i) =>
    `<button type="button" class="chip" data-preset="${i}">${esc(p.title)}` +
    (p.start ? ` <small>${esc(evTime(p))}</small>` : '') + '</button>').join('');
}

function renderPicks(msg = '') {
  const ds = [...calPicks].sort();
  $('#calMulti').checked = calMulti;
  $('#evWeekly').disabled = calMulti;   // 複数選択中は「4週分」は使わない
  if (calMulti) $('#evWeekly').checked = false;
  $('#evHead').textContent = calMulti ? '選んだ日に予定を追加' : 'この日に予定を追加';
  $('#evAdd').textContent = calMulti ? `${ds.length}日に追加` : EV_ADD_TEXT;
  let info = '';
  if (calMulti) info = ds.length
    ? `${ds.length}日選択中：${ds.map(k => md(parseYmd(k))).join('・')}`
    : 'カレンダーの日付をタップして選んでね';
  $('#calPickInfo').textContent = msg || info;
  syncEvForm();
}

// カレンダーのタブを開いたとき（今日に戻す）
function openCal() {
  const now = new Date();
  calMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  calSel = todayStr();
  for (const id of ['evTitle', 'evStart', 'evEnd', 'ctTitle']) $('#' + id).value = '';
  $('#evWeekly').checked = false;
  calMulti = false; calPicks.clear();
  evEditId = null; ctEdit = null;
  renderEvSuggest();
  renderCal(); renderDay(); renderPicks();
}

const moveMonth = k => {
  calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + k, 1);
  renderCal();
};
$('#calPrev').onclick = () => moveMonth(-1);
$('#calNext').onclick = () => moveMonth(1);

$('#calGrid').addEventListener('click', e => {
  const d = e.target.closest('.cd');
  if (!d) return;
  if (calMulti) {
    const k = d.dataset.date;
    if (calPicks.has(k)) calPicks.delete(k); else calPicks.add(k);
    renderCal(); renderPicks();
    return;
  }
  calSel = d.dataset.date;
    if (evEditId) endEvEdit();
  if (ctEdit) endTaskEdit();
  const sd = parseYmd(calSel);
  if (sd.getMonth() !== calMonth.getMonth()) calMonth = new Date(sd.getFullYear(), sd.getMonth(), 1);
  renderCal(); renderDay();
});

$('#calMulti').onchange = e => {
  calMulti = e.target.checked;
  if (!calMulti) calPicks.clear();
  renderCal(); renderPicks();
};

$('#dayList').addEventListener('change', e => {
  const id = e.target.dataset.caltask;
  if (!id) return;
  const x = findCourse(e.target.dataset.cid)?.tasks.find(k => k.id === id);
  if (!x) return;
  x.done = e.target.checked;
  save(); renderCal(); renderDay();
});
$('#dayList').addEventListener('click', e => {
  const te = e.target.closest('[data-taskedit]');
  if (te) return startTaskEdit(te.dataset.cid, te.dataset.taskedit);
  const ed = e.target.closest('[data-evedit]');
  if (ed) { if (ctEdit) endTaskEdit(); return startEvEdit(ed.dataset.evedit); }
  const id = e.target.dataset.evdel;
  if (!id || !confirm('この予定を消す？')) return;
  state.events = state.events.filter(x => x.id !== id);
  if (id === evEditId) endEvEdit();
  save(); renderCal(); renderDay();
});

// 候補と同じ名前を入れたら、時刻が空のときだけ前回の時刻と種類を入れる
$('#evTitle').addEventListener('input', e => {
  const p = state.evPresets.find(x => x.title === e.target.value.trim());
  if (!p || $('#evStart').value || $('#evEnd').value) return;
  $('#evKind').value = p.kind;
  $('#evStart').value = p.start;
  $('#evEnd').value = p.end;
});

function rememberPreset(p) {
  if (!p.title) return;
  state.evPresets = [p, ...state.evPresets.filter(x => x.title !== p.title)].slice(0, EV_PRESET_MAX);
}

$('#evAdd').onclick = () => {
  const kind = $('#evKind').value;
  const title = $('#evTitle').value.trim();
  const start = $('#evStart').value, end = $('#evEnd').value;
  let dates;
  if (calMulti) {
    dates = [...calPicks].sort();
    if (!dates.length) return alert('カレンダーで日付を選んでね');
  } else {
    const n = $('#evWeekly').checked ? 4 : 1;
    dates = Array.from({ length: n }, (_, k) => ymd(addDays(parseYmd(calSel), 7 * k)));
  }

  // 同じ日・同じ種類・同じ名前・同じ時刻の予定は二重に入れない
  let added = 0, skipped = 0;
  for (const date of dates) {
    const dup = state.events.some(e => e.date === date && e.kind === kind &&
      e.title === title && e.start === start && e.end === end);
    if (dup) { skipped++; continue; }
    state.events.push({ id: uid(), date, kind, title, start, end });
    added++;
  }
  rememberPreset({ title, kind, start, end });

  const msg = skipped
    ? `${added}日に追加したよ（${skipped}日はもう入ってたので飛ばした）`
    : dates.length > 1 ? `${added}日に追加したよ` : '';
  $('#evTitle').value = '';
  $('#evWeekly').checked = false;
  calMulti = false; calPicks.clear();
  save(); renderEvSuggest(); renderCal(); renderDay(); renderPicks(msg);
};

/* ===== 予定の候補・変更 ===== */
$('#evChips').addEventListener('click', e => {
  const b = e.target.closest('[data-preset]');
  const p = b && state.evPresets[+b.dataset.preset];
  if (!p) return;
  $('#evKind').value = p.kind;
  $('#evTitle').value = p.title;
  $('#evStart').value = p.start;
  $('#evEnd').value = p.end;
});

// 種類・名前・時刻が全部同じなら「同じ予定」
const sameEv = (a, b) =>
  a.kind === b.kind && a.title === b.title && a.start === b.start && a.end === b.end;

function evTargets(scope) {
  const base = state.events.find(x => x.id === evEditId);
  if (!base) return [];
  if (scope === 'one') return [base];
  return state.events.filter(e => sameEv(e, base) && (
    scope === 'all' ||
    (scope === 'after' && e.date >= base.date) ||
    (scope === 'picks' && (calPicks.has(e.date) || e.id === base.id))));
}

function renderEvScope() {
  const sel = $('#evScope'), v = sel.value;
  const opts = [['one', 'この日だけ'], ['after', 'この日以降の同じ予定'], ['all', '同じ予定ぜんぶ']];
  if (calMulti && calPicks.size) opts.push(['picks', '選んだ日の同じ予定']);
  sel.innerHTML = opts.map(([k, l]) =>
    `<option value="${k}">${l}（${evTargets(k).length}件）</option>`).join('');
  sel.value = opts.some(o => o[0] === v) ? v : 'one';
}

function syncEvForm() {
  const ed = !!evEditId;
  $('#evAdd').hidden = ed;
  $('#evWeeklyBox').hidden = ed;
  $('#evEditBox').hidden = !ed;
  if (ed) {
    $('#evHead').textContent = '予定を変更';
    renderEvScope();
  }
}

function startEvEdit(id) {
  const e = state.events.find(x => x.id === id);
  if (!e) return;
  evEditId = id;
  $('#evKind').value = e.kind;
  $('#evTitle').value = e.title;
  $('#evStart').value = e.start;
  $('#evEnd').value = e.end;
  $('#evScope').value = 'one';
  renderDay(); renderPicks();
  $('#evHead').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function endEvEdit() {
  evEditId = null;
  for (const id of ['evTitle', 'evStart', 'evEnd']) $('#' + id).value = '';
  renderDay(); renderPicks();
}

$('#evSave').onclick = () => {
  const ts = evTargets($('#evScope').value);
  if (!ts.length) return endEvEdit();
  const v = {
    kind: $('#evKind').value,
    title: $('#evTitle').value.trim(),
    start: $('#evStart').value,
    end: $('#evEnd').value
  };
  for (const e of ts) Object.assign(e, v);
  rememberPreset(v);
  save(); renderEvSuggest(); renderCal();
  endEvEdit();
  if (ts.length > 1) renderPicks(`${ts.length}件まとめて変更したよ`);
};

$('#evDel').onclick = () => {
  const ts = evTargets($('#evScope').value);
  if (!ts.length) return endEvEdit();
  if (!confirm(ts.length > 1 ? `${ts.length}件の予定をまとめて消す？` : 'この予定を消す？')) return;
  const ids = new Set(ts.map(e => e.id));
  state.events = state.events.filter(e => !ids.has(e.id));
  save(); renderCal();
  endEvEdit();
  if (ts.length > 1) renderPicks(`${ts.length}件消したよ`);
};

$('#evCancel').onclick = endEvEdit;

/* ===== カレンダーから課題 ===== */
const slotLabel = c => (Number.isInteger(c.day) && c.day >= 0 && c.period) ? `（${DAYS[c.day]}${c.period}）` : '';

function renderTaskForm() {
  const box = $('#taskBox');
  const cs = courses();
  const ed = ctEdit && findCourse(ctEdit.cid);
  box.hidden = calMulti || (!cs.length && !ed);
  if (box.hidden) return;
  const list = ed && !cs.includes(ed) ? [ed, ...cs] : cs;
  const sel = ed ? (ctEdit.to || ed.id)
    : (list.some(c => c.id === ctLastCid) ? ctLastCid : list[0].id);
  $('#ctCourse').innerHTML = list.map(c =>
    `<option value="${c.id}" ${c.id === sel ? 'selected' : ''}>${esc(nm(c) || '名前なし')}${slotLabel(c)}</option>`).join('');
  $('#ctHead').textContent = ed ? '課題を変更' : `${md(parseYmd(calSel))}締切の課題を追加`;
  $('#ctAdd').hidden = !!ed;
  for (const id of ['ctDueBox', 'ctDel', 'ctCancel', 'ctSave']) $('#' + id).hidden = !ed;
}

function startTaskEdit(cid, id) {
  const x = findCourse(cid)?.tasks.find(k => k.id === id);
  if (!x) return;
  if (evEditId) endEvEdit();
  ctEdit = { cid, id, to: '' };
  $('#ctTitle').value = x.title;
  $('#ctDue').value = x.due || calSel;
  renderDay();
  $('#ctHead').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function endTaskEdit() {
  ctEdit = null;
  $('#ctTitle').value = '';
  renderDay();
}

$('#ctCourse').onchange = e => {
  if (ctEdit) ctEdit.to = e.target.value;
  else ctLastCid = e.target.value;
};

$('#ctAdd').onclick = () => {
  const title = $('#ctTitle').value.trim();
  if (!title) return alert('課題の内容を入れてね');
  const c = findCourse($('#ctCourse').value);
  if (!c) return;
  c.tasks.push({ id: uid(), title, due: calSel, done: false });
  ctLastCid = c.id;
  $('#ctTitle').value = '';
  save(); renderAll(); renderCal(); renderDay();
};

$('#ctSave').onclick = () => {
  if (!ctEdit) return;
  const from = findCourse(ctEdit.cid);
  const x = from?.tasks.find(k => k.id === ctEdit.id);
  if (!x) return endTaskEdit();
  const title = $('#ctTitle').value.trim();
  if (!title) return alert('課題の内容を入れてね');
  x.title = title;
  x.due = $('#ctDue').value;
  const to = findCourse($('#ctCourse').value);
  if (to && to !== from) {
    from.tasks = from.tasks.filter(k => k !== x);
    to.tasks.push(x);
  }
  const moved = x.due !== calSel;
  save(); renderAll(); renderCal();
  endTaskEdit();
  if (moved) toast(x.due ? `締切を${md(parseYmd(x.due))}に移したよ` : '締切なしにしたよ');
};

$('#ctDel').onclick = () => {
  const c = ctEdit && findCourse(ctEdit.cid);
  if (!c || !confirm('この課題を消す？')) return;
  c.tasks = c.tasks.filter(k => k.id !== ctEdit.id);
  save(); renderAll(); renderCal();
  endTaskEdit();
};

$('#ctCancel').onclick = endTaskEdit;

/* ===== 画面の切り替え（下のタブ） ===== */
function showTab(name) {
  curTab = name;
  document.querySelectorAll('.view').forEach(v => { v.hidden = v.id !== `view-${name}`; });
  document.querySelectorAll('#tabbar [data-tab]').forEach(b => {
    const on = b.dataset.tab === name;
    b.classList.toggle('on', on);
    if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
  if (name === 'cal') openCal(); else renderAll();
  window.scrollTo(0, 0);
}
$('#tabbar').addEventListener('click', e => {
  const b = e.target.closest('[data-tab]');
  if (b) showTab(b.dataset.tab);
});
$('#shareBtn').onclick = () => openTermDlg('shareSec');

/* ===== ダイアログ中は後ろの画面を止める ===== */
let lockY = 0;
function syncScrollLock() {
  const open = !!document.querySelector('dialog[open]');
  const b = document.body;
  if (open && !b.classList.contains('lock')) {
    lockY = window.scrollY;
    b.style.top = `-${lockY}px`;
    b.classList.add('lock');
  } else if (!open && b.classList.contains('lock')) {
    b.classList.remove('lock');
    b.style.top = '';
    window.scrollTo(0, lockY);
  }
}
const dlgWatch = new MutationObserver(syncScrollLock);
document.querySelectorAll('dialog').forEach(d =>
  dlgWatch.observe(d, { attributes: true, attributeFilter: ['open'] }));

/* ===== 画像読み込み ===== */
const PROMPT = `これは大学の時間割表の画像です。各授業を読み取り、JSON配列だけを出力してください。説明文やコードブロック記号は書かないでください。
形式: [{"day":"月","period":1,"name":"授業名","teacher":"教員名","room":"教室"}]
ルール:
- dayは「月火水木金土」のいずれか1文字。periodは時限の数字。
- 授業名の先頭の区分記号(S, F, E, M2など)と、末尾のクラス番号((01)など)は除く。改行で途切れた授業名はつなげる。
- 教員名の先頭の「非)」と末尾の「他」は除く。
- 手書きで書き込まれた教室番号などがあれば、印字より手書きを優先する。
- 1つのコマに複数の授業があれば、それぞれ別の要素にする。
- 空のコマは出力しない。`;

const loadImg = src => new Promise((res, rej) => {
  const img = new Image();
  img.onload = () => res(img);
  img.onerror = rej;
  img.src = src;
});

async function fileToJpegBase64(file, max = 1568) {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImg(url);
    const s = Math.min(1, max / Math.max(img.width, img.height));
    const cv = document.createElement('canvas');
    cv.width = Math.round(img.width * s);
    cv.height = Math.round(img.height * s);
    const ctx = cv.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.drawImage(img, 0, 0, cv.width, cv.height);
    return cv.toDataURL('image/jpeg', 0.9).split(',')[1];
  } finally {
    URL.revokeObjectURL(url);
  }
}

// 混雑・サーバー側の一時的なエラーか
const isBusy = (status, msg) =>
  [500, 502, 503, 504, 529].includes(status) || /high demand|overloaded|unavailable/i.test(msg);

// 1回だけリクエストを送る
async function requestOnce(p, key, model, b64, prompt = PROMPT) {
  let r;
  if (p === 'claude') {
    r = await fetch(PROVIDERS.claude.url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model, max_tokens: 4096,
        messages: [{ role: 'user', content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: b64 } },
          { type: 'text', text: prompt },
        ] }]
      })
    });
  } else {
    // Gemini / OpenRouter（OpenAI互換）
    r = await fetch(PROVIDERS[p].url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${b64}` } }
        ] }]
      })
    });
  }
  const d = await r.json().catch(() => ({}));
  if (!r.ok) {
    const err = (Array.isArray(d) ? d[0] : d)?.error;
    return { ok: false, status: r.status, msg: err?.message || String(r.status) };
  }
  if (p === 'claude') return { ok: true, text: (d.content || []).map(b => b.text || '').join('') };
  const c = d.choices?.[0]?.message?.content;
  return { ok: true, text: Array.isArray(c) ? c.map(x => x.text || '').join('') : (c || '') };
}

// 混雑時は自動でやり直し、予備のモデルがあれば切り替える
async function callVision(b64, prompt = PROMPT, st = $('#ocrStatus')) {
  const p = state.provider, key = state.keys[p], main = modelOf(p);
  if (!key) throw new Error('設定でAPIキーを入れてね');
  if (!main) throw new Error('設定でモデルIDを入れてね');

  const models = [main];
  if (FALLBACK_MODEL[p] && FALLBACK_MODEL[p] !== main) models.push(FALLBACK_MODEL[p]);
  let lastMsg = '';

  for (const [mi, model] of models.entries()) {
    if (mi > 0) st.textContent = `混雑が続いてるから ${model} に切り替えるね`;
    for (let n = 0; n < 3; n++) {
      if (n > 0) {
        const w = 2 ** n * 2; // 4秒 → 8秒
        st.textContent = `混んでるみたい。${w}秒後にもう一回試すね（${model}）`;
        await sleep(w * 1000);
        st.textContent = `読み取り中…（${model}）`;
      }
      const r = await requestOnce(p, key, model, b64, prompt);
      if (r.ok) return r.text;
      if (r.status === 429) throw new Error('回数制限に達したみたい。少し待ってからもう一回試してね');
      if (!isBusy(r.status, r.msg)) throw new Error(r.msg);
      lastMsg = r.msg;
    }
  }
  throw new Error(`混雑が続いてる。数分おいて試すか、設定で別のAIに切り替えてみて（${lastMsg}）`);
}

$('#importBtn').onclick = () => {
  $('#ocrResult').innerHTML = '';
  $('#ocrStatus').textContent = '';
  $('#importTarget').textContent = `保存先：${term().name}`;
  $('#importDlg').showModal();
};
$('#importClose').onclick = () => $('#importDlg').close();
$('#imgFile').onchange = e => {
  const f = e.target.files[0];
  if (!f) return;
  const p = $('#imgPreview');
  p.src = URL.createObjectURL(f);
  p.style.display = 'block';
};

function friendlyError(err) {
  if (err instanceof TypeError && /fetch|network|load failed/i.test(err.message))
    return '通信できなかった。ネットにつながってるか確認してね';
  if (err instanceof SyntaxError) return '結果がうまく読めなかった。もう一回試すか、別のモデルで試してみて';
  return err.message;
}

let ocrRunning = false;
$('#runOcr').onclick = async () => {
  if (ocrRunning) return;
  const f = $('#imgFile').files[0];
  if (!f) return alert('画像を選んでね');
  ocrRunning = true;
  $('#runOcr').disabled = true;
  $('#ocrStatus').textContent = `読み取り中…（${PROVIDERS[state.provider].label}）`;
  try {
    const txt = await callVision(await fileToJpegBase64(f));
    const s = txt.indexOf('['), e = txt.lastIndexOf(']');
    if (s < 0 || e < s) throw new Error('結果がうまく読めなかった。別のモデルで試してみて');
    const arr = JSON.parse(txt.slice(s, e + 1));
    showRows(arr);
    $('#ocrStatus').textContent = `${arr.length}件読み取ったよ。間違いがあれば直してから保存してね。`;
  } catch (err) {
    $('#ocrStatus').textContent = 'エラー: ' + friendlyError(err);
  } finally {
    ocrRunning = false;
    $('#runOcr').disabled = false;
  }
};

function showRows(arr) {
  const dayOpts = sel => DAYS.map((d, i) => `<option value="${i}" ${i === sel ? 'selected' : ''}>${d}</option>`).join('');
  $('#ocrResult').innerHTML =
    '<table><tr><td>曜</td><td>限</td><td>授業名</td><td>教員</td><td>教室</td><td>除外</td></tr>' +
    arr.map(c => {
      const d = Math.max(0, DAYS.indexOf(c.day));
      return `<tr class="r"><td><select class="d">${dayOpts(d)}</select></td>` +
        `<td><input class="p" type="number" min="1" max="10" value="${+c.period || 1}" style="width:48px"></td>` +
        `<td><input class="n" value="${esc(c.name)}"></td>` +
        `<td><input class="t" value="${esc(c.teacher)}"></td>` +
        `<td><input class="rm" value="${esc(c.room)}"></td>` +
        `<td><input type="checkbox" class="skip"></td></tr>`;
    }).join('') + '</table>';
}

function applyImport(replace) {
  const rows = [...document.querySelectorAll('#ocrResult tr.r')]
    .filter(tr => !tr.querySelector('.skip').checked)
    .map(tr => ({
      day: +tr.querySelector('.d').value,
      period: Math.min(10, Math.max(1, +tr.querySelector('.p').value || 1)),
      name: tr.querySelector('.n').value.trim(),
      teacher: tr.querySelector('.t').value.trim(),
      room: tr.querySelector('.rm').value.trim()
    }));
  if (!rows.length) return alert('保存する授業がないよ');

  // 引き継ぐのは「授業名・曜日・時限」が全部同じ授業だけ（1対1）
  const t = term(), old = courses(), used = new Set();
  const pairs = rows.map(r => {
    const prev = replace
      ? old.find(c => !used.has(c) && c.name === r.name && c.day === r.day && c.period === r.period)
      : null;
    if (prev) used.add(prev);
    return [r, prev];
  });
  let backup = null;
  if (replace) {
    const lost = old.filter(c => c.day !== -1 && !used.has(c) &&
      (c.items.length || c.memos.length || c.tasks.length || c.syllabus || c.absences.length));
    const msg = `「${t.name}」の時間割を置き換える？` + (lost.length
      ? `\n\n次の授業のメモ・持ち物・課題・欠席は消えるよ（授業名・曜日・時限が全部同じものだけ引き継ぐ）\n` +
        lost.map(c => `・${DAYS[c.day]}${c.period} ${nm(c)}`).join('\n')
      : '');
    if (!confirm(msg)) return;
    backup = { courses: structuredClone(old), cancels: structuredClone(t.cancels) };
  }
  const added = pairs.map(([r, prev]) => prev ? Object.assign(prev, r) : newCourse(r.day, r.period, r));
  // 置き換えても集中講義は残す
  t.courses = replace ? added.concat(old.filter(c => c.day === -1)) : old.concat(added);
  if (replace) {
    const ids = new Set(t.courses.map(c => c.id));
    t.cancels = t.cancels.filter(x => ids.has(x.courseId));
  }
  state.periods = Math.max(state.periods, ...rows.map(r => r.period));
  if (rows.some(r => r.day === 5)) state.showSat = true;
  scheduleChanged();
  $('#importDlg').close();
  if (backup) toast('時間割を置き換えたよ', () => {
    t.courses = backup.courses;
    t.cancels = backup.cancels;
    scheduleChanged();
  });
}
$('#applyReplace').onclick = () => applyImport(true);
$('#applyAdd').onclick = () => applyImport(false);

/* ===== 学期・休み・振替 ===== */
$('#swapDay').innerHTML = DAYS.map((d, i) => `<option value="${i}">${d}曜</option>`).join('');

function renderTermList() {
  $('#termList').innerHTML = state.terms.map(t =>
    `<li><div class="termBox">` +
      `<div class="row"><input data-rename="${t.id}" value="${esc(t.name)}" aria-label="学期の名前">` +
        (t.id === state.currentTermId ? '<span class="tag">表示中</span>' : '') +
        `<span class="from">${t.courses.length}件</span>` +
        `<button class="x" data-termdel="${t.id}">削除</button></div>` +
      `<div class="row"><span class="hint">開始</span><input type="date" data-tstart="${t.id}" value="${esc(t.start)}">` +
        `<span class="hint">終了</span><input type="date" data-tend="${t.id}" value="${esc(t.end)}"></div>` +
    `</div></li>`).join('');
}

function renderOffList() {
  const t = term();
  $('#offTitle').textContent = `「${t.name}」の授業がない日`;
  $('#offList').innerHTML = t.offDays.slice().sort((a, b) => a.from.localeCompare(b.from)).map(o =>
    `<li><span>${esc(offLabel(o))}</span><button class="x" data-offdel="${o.id}" aria-label="削除">×</button></li>`).join('')
    || '<li class="muted">なし</li>';
  $('#swapList').innerHTML = t.swaps.slice().sort((a, b) => a.date.localeCompare(b.date)).map(x =>
    `<li><span>${md(parseYmd(x.date))} は${DAYS[x.asDay]}曜の授業</span>` +
    `<button class="x" data-swapdel="${x.id}" aria-label="削除">×</button></li>`).join('')
    || '<li class="muted">なし</li>';
}

function openTermDlg(openId = '') {
  renderTermList();
  renderOffList();
  for (const id of ['offFrom', 'offTo', 'offNote', 'swapDate', 'newTermStart', 'newTermEnd']) $('#' + id).value = '';
  $('#newTermName').value = nextTermName(term().name);
  $('#newTermCopy').checked = false;
  // 共有
  $('#shareItems').checked = false;
  $('#shareOff').checked = true;
  $('#shareIn').value = '';
  shareData = null;
  renderSharePreview();
  document.querySelectorAll('#termDlg details').forEach(d => { d.open = false; });
  $('#termDlg').showModal();
  $('#termDlg').scrollTop = 0;
  if (openId) {
    $('#' + openId).open = true;
    $('#' + openId).scrollIntoView({ block: 'nearest' });
  }
}
$('#termBtn').onclick = () => openTermDlg();
$('#termClose').onclick = () => $('#termDlg').close();

$('#termList').addEventListener('input', e => {
  const id = e.target.dataset.rename;
  if (!id) return;
  state.terms.find(t => t.id === id).name = e.target.value;
  save(); renderTermSelect(); renderOffList();
});
$('#termList').addEventListener('change', e => {
  const { tstart, tend } = e.target.dataset;
  const id = tstart || tend;
  if (!id) return;
  const t = state.terms.find(x => x.id === id);
  const k = tstart ? 'start' : 'end', before = t[k];
  t[k] = e.target.value;
  if (t.start && t.end && t.end < t.start) {
    alert('終了日が開始日より前になってるよ');
    t[k] = before;
    e.target.value = before;
    return;
  }
  scheduleChanged();
});
$('#termList').addEventListener('click', e => {
  const id = e.target.dataset.termdel;
  if (!id) return;
  if (state.terms.length === 1) return alert('学期は最低1つ必要だよ');
  const t = state.terms.find(x => x.id === id);
  if (!confirm(`「${t.name}」を削除する？授業・メモ・課題も全部消えるよ`)) return;
  state.terms = state.terms.filter(x => x.id !== id);
  if (state.currentTermId === id) state.currentTermId = state.terms[0].id;
  save(); renderTermList(); renderOffList(); renderAll();
});

// 授業がない日
$('#offAdd').onclick = () => {
  const from = $('#offFrom').value;
  let to = $('#offTo').value;
  if (!from) return alert('休みの日付を選んでね');
  if (to && to < from) return alert('終わりの日が始まりの日より前になってるよ');
  if (to === from) to = '';
  term().offDays.push({ id: uid(), from, to, note: $('#offNote').value.trim() });
  for (const id of ['offFrom', 'offTo', 'offNote']) $('#' + id).value = '';
  scheduleChanged(); renderOffList();
};
$('#offList').addEventListener('click', e => {
  const id = e.target.dataset.offdel;
  if (!id) return;
  term().offDays = term().offDays.filter(o => o.id !== id);
  scheduleChanged(); renderOffList();
});

// 曜日の振替
$('#swapAdd').onclick = () => {
  const date = $('#swapDate').value;
  if (!date) return alert('日付を選んでね');
  const t = term();
  t.swaps = t.swaps.filter(x => x.date !== date); // 同じ日は上書き
  t.swaps.push({ id: uid(), date, asDay: +$('#swapDay').value });
  $('#swapDate').value = '';
  scheduleChanged(); renderOffList();
};
$('#swapList').addEventListener('click', e => {
  const id = e.target.dataset.swapdel;
  if (!id) return;
  term().swaps = term().swaps.filter(x => x.id !== id);
  scheduleChanged(); renderOffList();
});

$('#termCreate').onclick = () => {
  const name = $('#newTermName').value.trim() || defaultTermName();
  const start = $('#newTermStart').value, end = $('#newTermEnd').value;
  if (start && end && end < start) return alert('終了日が開始日より前になってるよ');
  const copied = $('#newTermCopy').checked ? courses().filter(c => c.day !== -1).map(c => newCourse(c.day, c.period, {
    name: c.name, short: c.short, teacher: c.teacher, room: c.room, syllabus: c.syllabus, maxAbsence: c.maxAbsence,
    items: c.items.filter(i => i.type === 'always').map(i => ({ ...i, id: uid() }))
  })) : [];
  const t = newTerm(name, start, end, copied);
  state.terms.push(t);
  state.currentTermId = t.id;
  save(); renderAll(); $('#termDlg').close();
};

/* ===== 設定 ===== */
let tmp = null;      // 保存を押すまでの一時データ
let snapshot = '';   // 開いたときの状態（変更があったかの判定用）

$('#sProvider').innerHTML = Object.entries(PROVIDERS)
  .map(([k, v]) => `<option value="${k}">${esc(v.label)}</option>`).join('');

function fillProviderFields(p) {
  tmp.provider = p;
  $('#sProvider').value = p;
  $('#sKey').value = tmp.keys[p] || '';
  const list = PROVIDERS[p].models, m = tmp.models[p] || PROVIDERS[p].model;
  $('#sModelPick').innerHTML = list.map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('') +
    '<option value="">その他（直接入力）</option>';
  const preset = list.includes(m);
  $('#sModelPick').value = preset ? m : '';
  $('#sModel').value = preset ? '' : m;
  $('#sModel').hidden = preset;
  $('#sKeyLink').href = PROVIDERS[p].keyUrl;
  $('#sNote').textContent = PROVIDERS[p].note;
}
function stashProviderFields() {
  tmp.keys[tmp.provider] = $('#sKey').value.trim();
  tmp.models[tmp.provider] = $('#sModelPick').value || $('#sModel').value.trim();
}
$('#sModelPick').onchange = e => {
  $('#sModel').hidden = !!e.target.value;
  if (!e.target.value) $('#sModel').focus();
};

const clampPeriods = v => Math.min(10, Math.max(1, +v || 7));

function renderTimes() {
  $('#sTimes').innerHTML = Array.from({ length: tmp.periods }, (_, i) =>
    `<tr data-p="${i + 1}"><td>${i + 1}限</td>` +
    `<td><input type="time" class="ts" value="${esc(tmp.times[i].start)}" aria-label="${i + 1}限の開始"></td><td>〜</td>` +
    `<td><input type="time" class="te" value="${esc(tmp.times[i].end)}" aria-label="${i + 1}限の終了"></td></tr>`).join('');
}
function stashTimes() {
  document.querySelectorAll('#sTimes tr[data-p]').forEach(tr => {
    tmp.times[+tr.dataset.p - 1] = { start: tr.querySelector('.ts').value, end: tr.querySelector('.te').value };
  });
}
// 表は作り直さず、数字だけ書き換える
function syncTimeInputs() {
  document.querySelectorAll('#sTimes tr[data-p]').forEach(tr => {
    const t = tmp.times[+tr.dataset.p - 1];
    tr.querySelector('.ts').value = t.start;
    tr.querySelector('.te').value = t.end;
  });
}

// 時刻を delta 分ずらす（空欄と、日付をまたぐ値はそのまま）
function shiftTime(t, k, delta) {
  const v = toMin(t[k]);
  if (v == null) return;
  const n = v + delta;
  if (n >= 0 && n < 24 * 60) t[k] = fromMin(n);
}

// 入力を始めたときの値を覚えておく
let editBefore = null;
$('#sTimes').addEventListener('focusin', e => {
  if (e.target.matches('.ts, .te')) editBefore = e.target.value;
});

// 入力欄から離れたときにだけ、後ろの時限をずらす
$('#sTimes').addEventListener('focusout', e => {
  const el = e.target;
  if (!el.matches('.ts, .te')) return;
  const i = +el.closest('tr[data-p]').dataset.p - 1;
  const k = el.classList.contains('ts') ? 'start' : 'end';
  const before = toMin(editBefore), after = toMin(el.value);
  editBefore = null;
  tmp.times[i][k] = el.value;
  if (!$('#sShift').checked || before == null || after == null || before === after) return;

  const delta = after - before;
  if (k === 'start') shiftTime(tmp.times[i], 'end', delta); // 開始を変えたら同じ時限の終了も
  for (let j = i + 1; j < 10; j++) {                        // 後ろの時限は全部
    shiftTime(tmp.times[j], 'start', delta);
    shiftTime(tmp.times[j], 'end', delta);
  }
  syncTimeInputs();
});

// 画面の入力を一時データに集める
function collect() {
  stashProviderFields();
  stashTimes();
  tmp.periods = clampPeriods($('#sPeriods').value);
  tmp.showSat = $('#sSat').checked;
  tmp.shiftTimes = $('#sShift').checked;
  tmp.syllabusSearch = $('#sSyllabus').value.trim();
  tmp.theme = { color: $('#sColor').value, font: $('#sFont').value };
}

function renderLastExport() {
  const t = state.lastExport;
  $('#lastExport').textContent = t
    ? `最後の書き出し：${md(new Date(t))}（${dayDiff(new Date(), new Date(t))}日前）`
    : 'まだ書き出してないよ';
}

function openSettings() {
  tmp = {
    provider: state.provider,
    keys: { ...state.keys },
    models: { ...state.models },
    times: structuredClone(state.times),
    periods: state.periods,
    showSat: state.showSat,
    shiftTimes: state.shiftTimes,
    syllabusSearch: state.syllabusSearch,
    theme: { ...state.theme }
  };
  fillProviderFields(state.provider);
  $('#sPeriods').value = tmp.periods;
  $('#sSat').checked = tmp.showSat;
  $('#sShift').checked = tmp.shiftTimes;
  $('#sSyllabus').value = tmp.syllabusSearch;
  $('#sColor').value = tmp.theme.color;
  $('#sFont').value = tmp.theme.font;
  $('#restoreFile').value = '';
  renderTimes();
  collect();
  snapshot = JSON.stringify(tmp);
  renderLastExport();
  $('#aiBox').open = false;
  $('#iconBox').open = false;
  $('#settingsDlg').showModal();
  $('#settingsDlg').scrollTop = 0;
}

function closeSettings() {
  collect();
  if (JSON.stringify(tmp) !== snapshot && !confirm('変更を保存せずに閉じる？')) return;
  applyTheme(state.theme); // 試した色や文字を元に戻す
  $('#settingsDlg').close();
}

$('#settingsBtn').onclick = openSettings;
$('#sX').onclick = closeSettings;
$('#sCancel').onclick = closeSettings;
$('#settingsDlg').addEventListener('cancel', e => { e.preventDefault(); closeSettings(); }); // Escキー

// 選んだ時点で見た目を試せるように
for (const id of ['sColor', 'sFont']) {
  $('#' + id).addEventListener('change', () =>
    applyTheme({ color: $('#sColor').value, font: $('#sFont').value }));
}

$('#sProvider').onchange = e => { stashProviderFields(); fillProviderFields(e.target.value); };
$('#sPeriods').addEventListener('input', e => {
  if (!e.target.value) return;
  stashTimes();
  tmp.periods = clampPeriods(e.target.value);
  renderTimes();
});

$('#sSave').onclick = () => {
  collect();
  for (let i = 0; i < tmp.periods; i++) {
    const s = toMin(tmp.times[i].start), en = toMin(tmp.times[i].end);
    if (s != null && en != null && s >= en) return alert(`${i + 1}限の終了が開始より前になってるよ`);
  }
  if (tmp.syllabusSearch && !isHttp(tmp.syllabusSearch)) return alert('シラバス検索のURLは https:// から始まる形で入れてね');
  state.provider = tmp.provider;
  state.keys = tmp.keys;
  state.models = tmp.models;
  state.times = tmp.times;
  state.periods = tmp.periods;
  state.showSat = tmp.showSat;
  state.shiftTimes = tmp.shiftTimes;
  state.syllabusSearch = tmp.syllabusSearch;
  state.theme = tmp.theme;
  applyTheme(state.theme);
  scheduleChanged();
  $('#settingsDlg').close();
};

/* ===== バックアップ ===== */
$('#exportBtn').onclick = async () => {
  const { keys, ...rest } = state; // キーは書き出さない
  const name = `jikanwari-${todayStr()}.json`;
  const blob = new Blob([JSON.stringify(rest, null, 2)], { type: 'application/json' });
  const file = new File([blob], name, { type: 'application/json' });
  let shared = false;
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file] }); shared = true; }
    catch (e) { if (e.name === 'AbortError') return; }
  }
  if (!shared) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 10000);
  }
  state.lastExport = Date.now();
  save(); renderLastExport();
};

$('#restoreFile').onchange = async e => {
  const f = e.target.files[0];
  if (!f) return;
  try {
    const d = JSON.parse(await f.text());
    let s;
    if (Array.isArray(d.terms)) s = d;
    else if (Array.isArray(d.courses)) s = fromV1(d);
    else throw 0;
    if (!confirm('今のデータを置き換えて復元する？')) return;
    state = normalize({ ...s, keys: state.keys, models: state.models, provider: state.provider });
    applyTheme(state.theme);
    scheduleChanged();
    $('#settingsDlg').close();
    alert('復元したよ');
  } catch {
    alert('ファイルが読めなかった');
  } finally {
    e.target.value = '';
  }
};

/* ===== 時間割の共有 ===== */
const SHARE_TAG = 'JKWR1';
let shareCode = '';   // 送る用のコード（先に作っておく）
let shareData = null; // 受け取って読み込んだ中身
let shareSeq = 0;

const b64u = bytes => {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const unb64u = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), ch => ch.charCodeAt(0));

// 圧縮できれば z、できなければそのまま p
async function packText(str) {
  const bytes = new TextEncoder().encode(str);
  if (typeof CompressionStream === 'function') {
    try {
      const st = new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'));
      return 'z.' + b64u(new Uint8Array(await new Response(st).arrayBuffer()));
    } catch {}
  }
  return 'p.' + b64u(bytes);
}
async function unpackText(mode, body) {
  const bytes = unb64u(body);
  if (mode === 'p') return new TextDecoder().decode(bytes);
  if (typeof DecompressionStream !== 'function') throw new Error('old');
  const st = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return await new Response(st).text();
}

// 送る中身（メモ・課題・欠席・予定は入れない）
function shareJSON() {
  const t = term(), withItems = $('#shareItems').checked;
  const d = {
    v: 1, name: t.name, start: t.start, end: t.end, p: state.periods,
    times: state.times.map(x => [x.start, x.end]),
    c: t.courses.filter(c => c.name.trim()).map(c => [
      c.day, c.period, c.name, c.short, c.teacher, c.room, c.syllabus, c.from, c.to,
      withItems ? c.items.filter(i => i.type === 'always').map(i => i.text) : []
    ])
  };
  if ($('#shareOff').checked) {
    d.off = t.offDays.map(o => [o.from, o.to, o.note]);
    d.sw = t.swaps.map(x => [x.date, x.asDay]);
  }
  return JSON.stringify(d);
}

// iPhoneは押した瞬間に共有シートを出さないと止められるので、コードは先に作っておく
async function renderShareCode() {
  const n = courses().filter(c => c.name.trim()).length;
  const seq = ++shareSeq;
  $('#shareSend').disabled = true;
  shareCode = '';
  $('#shareInfo').textContent = n ? `「${term().name}」の授業${n}件を送るよ` : '送れる授業がまだないよ';
  if (!n) return;
  const code = await packText(shareJSON());
  if (seq !== shareSeq) return;
  shareCode = code;
  $('#shareSend').disabled = false;
}

function shareText() {
  const url = location.origin + location.pathname;
  return `時間割メモの共有コード（${term().name}）\n` +
    `アプリの「学期」→「時間割を共有」に、このメッセージを丸ごと貼り付けてね\n${url}\n\n` +
    `${SHARE_TAG}.${shareCode}`;
}

function copyShare(text) {
  const manual = () => prompt('これをコピーして送ってね', text);
  if (!navigator.clipboard) return manual();
  navigator.clipboard.writeText(text).then(
    () => { $('#shareInfo').textContent = 'コピーしたよ。LINEなどに貼り付けて送ってね'; },
    manual);
}

$('#shareSec').addEventListener('toggle', e => { if (e.target.open) renderShareCode(); });
$('#shareItems').onchange = renderShareCode;
$('#shareOff').onchange = renderShareCode;

$('#shareSend').onclick = () => {
  if (!shareCode) return;
  const text = shareText();
  if (navigator.share) {
    navigator.share({ text }).catch(e => { if (e.name !== 'AbortError') copyShare(text); });
  } else {
    copyShare(text);
  }
};

// 受け取ったデータの中身を確かめる
function parseShare(d) {
  if (!d || d.v !== 1 || !Array.isArray(d.c)) throw new Error('bad');
  const str = v => typeof v === 'string' ? v.slice(0, 300) : '';
  const hhmm = v => typeof v === 'string' && /^\d{2}:\d{2}$/.test(v) ? v : '';
  const okDay = v => Number.isInteger(v) && v >= -1 && v <= 5;
  const okPeriod = v => Number.isInteger(v) && v >= 1 && v <= 10;

  const cs = d.c.slice(0, 200).filter(Array.isArray).map(
    ([day, period, name, short, teacher, room, syllabus, from, to, items]) => ({
      day: okDay(day) ? day : 0,
      period: okPeriod(period) ? period : 1,
      name: str(name).trim(), short: str(short), teacher: str(teacher), room: str(room),
      syllabus: isHttp(syllabus) ? str(syllabus) : '',
      from: isYmd(from) ? from : '', to: isYmd(to) ? to : '',
      items: Array.isArray(items) ? items.map(str).map(s => s.trim()).filter(Boolean).slice(0, 30) : []
    })).filter(c => c.name);
  if (!cs.length) throw new Error('bad');

  return {
    name: str(d.name).trim() || defaultTermName(),
    start: isYmd(d.start) ? d.start : '',
    end: isYmd(d.end) ? d.end : '',
    periods: clampPeriods(d.p),
    times: Array.isArray(d.times) && d.times.length === 10
      ? d.times.map(x => ({ start: hhmm(x?.[0]), end: hhmm(x?.[1]) })) : null,
    courses: cs,
    off: Array.isArray(d.off)
      ? d.off.filter(o => Array.isArray(o) && isYmd(o[0]))
          .map(([from, to, note]) => ({ from, to: isYmd(to) && to > from ? to : '', note: str(note) }))
      : [],
    swaps: Array.isArray(d.sw)
      ? d.sw.filter(x => Array.isArray(x) && isYmd(x[0]) && Number.isInteger(x[1]) && x[1] >= 0 && x[1] <= 5)
          .map(([date, asDay]) => ({ date, asDay }))
      : []
  };
}

$('#shareRead').onclick = async () => {
  const raw = $('#shareIn').value.replace(/\s+/g, '');
  const m = raw.match(new RegExp(`${SHARE_TAG}\\.([zp])\\.([A-Za-z0-9_-]+)`));
  if (!m) return alert('共有コードが見つからなかった。もらったメッセージを丸ごと貼り付けてね');
  try {
    shareData = parseShare(JSON.parse(await unpackText(m[1], m[2])));
  } catch (e) {
    shareData = null;
    alert(e.message === 'old'
      ? 'このブラウザだと読めなかった。iOSを新しくしてみて'
      : 'コードが途中で切れてるか、壊れてるみたい。もう一回送ってもらってね');
  }
  renderSharePreview();
};

function renderSharePreview() {
  const d = shareData;
  $('#sharePreview').hidden = !d;
  if (!d) return;
  const list = d.courses.slice().sort((a, b) =>
    (a.day < 0) - (b.day < 0) || a.day - b.day || a.period - b.period);
  const nItems = d.courses.reduce((n, c) => n + c.items.length, 0);
  $('#shareSum').textContent = `「${d.name}」の授業${d.courses.length}件` +
    (d.off.length ? `・休み${d.off.length}件` : '') +
    (d.swaps.length ? `・振替${d.swaps.length}件` : '') +
    (nItems ? `・持ち物${nItems}件` : '');
  $('#shareList').innerHTML = list.map(c =>
    `<li><span><span class="tag">${c.day < 0 ? '集中' : DAYS[c.day] + c.period}</span>${esc(c.short.trim() || c.name)}</span>` +
    `<span class="from">${esc([c.teacher, c.room].filter(Boolean).join('・'))}</span></li>`).join('');
  const diff = !!d.times && d.times.some((x, i) =>
    x.start !== state.times[i].start || x.end !== state.times[i].end);
  $('#shareTimesBox').hidden = !diff;
  $('#shareTimes').checked = false;
}

const fromShare = c => newCourse(c.day, c.period, {
  name: c.name, short: c.short, teacher: c.teacher, room: c.room,
  syllabus: c.syllabus, from: c.from, to: c.to,
  items: c.items.map(text => ({ id: uid(), text, type: 'always', added: Date.now(), until: null }))
});

function applyShareCommon(d) {
  if (!$('#shareTimesBox').hidden && $('#shareTimes').checked) state.times = structuredClone(d.times);
  state.periods = Math.max(state.periods, d.periods, ...d.courses.filter(c => c.day >= 0).map(c => c.period));
  if (d.courses.some(c => c.day === 5)) state.showSat = true;
}

function finishShare(msg) {
  shareData = null;
  $('#shareIn').value = '';
  scheduleChanged();
  $('#termDlg').close();
  toast(msg);
}

$('#shareNew').onclick = () => {
  const d = shareData;
  if (!d) return;
  if (!confirm(`「${d.name}」を新しい学期として追加して、切り替える？`)) return;
  const t = newTerm(d.name, d.start, d.end, d.courses.map(fromShare));
  t.offDays = d.off.map(o => ({ id: uid(), ...o }));
  t.swaps = d.swaps.map(x => ({ id: uid(), ...x }));
  state.terms.push(t);
  state.currentTermId = t.id;
  applyShareCommon(d);
  finishShare(`「${d.name}」を追加したよ`);
};

$('#shareAdd').onclick = () => {
  const d = shareData;
  if (!d) return;
  const t = term();
  // 授業名・曜日・時限が同じ授業は飛ばす
  const fresh = d.courses.filter(c =>
    !t.courses.some(x => x.name === c.name && x.day === c.day && x.period === c.period));
  const offs = d.off.filter(o => !t.offDays.some(x => x.from === o.from && (x.to || '') === o.to));
  const sws = d.swaps.filter(x => !t.swaps.some(y => y.date === x.date));
  if (!fresh.length && !offs.length && !sws.length) return alert('全部もう入ってたよ');
  const skip = d.courses.length - fresh.length;
  if (!confirm(`「${t.name}」に授業${fresh.length}件を追加する？` +
    (skip ? `\n（同じ授業${skip}件は飛ばすよ）` : ''))) return;
  t.courses.push(...fresh.map(fromShare));
  t.offDays.push(...offs.map(o => ({ id: uid(), ...o })));
  t.swaps.push(...sws.map(x => ({ id: uid(), ...x })));
  applyShareCommon(d);
  finishShare(`授業${fresh.length}件を追加したよ`);
};

/* ===== 収入 ===== */
let inYear = new Date().getFullYear();
let inEditId = null;
const yen = n => `${Math.round(n).toLocaleString('ja-JP')}円`;
const sumOf = (xs, k) => xs.reduce((a, x) => a + (x[k] || 0), 0);
// 総支給がない記録は手取りで代わりに数える（手取り≦総支給なので少なめになる）
const grossOf = x => x.gross ?? x.net ?? 0;
const sumGross = xs => xs.reduce((a, x) => a + grossOf(x), 0);
const netOnly = xs => xs.filter(x => x.gross == null && x.net != null).length;
const incomesOf = y => state.incomes.filter(x => x.date.startsWith(`${y}-`))
  .sort((a, b) => a.date.localeCompare(b.date));

function renderIncome() {
  const xs = incomesOf(inYear);
  const g = sumGross(xs), n = sumOf(xs, 'net'), est = netOnly(xs);
  $('#inYear').textContent = `${inYear}年`;

  // 上限ライン
  let lim = '';
  if (state.incomeLimit !== '') {
    const L = state.incomeLimit, left = L - g;
    const pct = L > 0 ? Math.min(100, g / L * 100) : (g > 0 ? 100 : 0);
    const cls = left < 0 ? 'over' : pct >= 90 ? 'warn' : '';
    lim = `<div class="bar ${cls}"><i style="width:${pct}%"></i></div>` + (left >= 0
      ? `<p class="inLeft">上限まであと <b>${yen(left)}</b></p>`
      : `<p class="inLeft over">上限を ${yen(-left)} こえてる</p>`);
  }
  // バイト先ごと
  const jobs = new Map();
  for (const x of xs) jobs.set(x.job || '未設定', (jobs.get(x.job || '未設定') || 0) + grossOf(x));
  $('#inSummary').innerHTML =
    `<p class="inTotal">総支給<b>${yen(g)}</b><small>手取り ${yen(n)}</small></p>` +
    (est ? `<p class="hint">総支給がわからない${est}件は手取りで数えてるよ（*の月）。本当の総支給はこれより少し多いはず</p>` : '') +
    lim +
    (jobs.size > 1 ? `<p class="hint">${[...jobs].map(([j, v]) => `${esc(j)} ${yen(v)}`).join('・')}</p>` : '');

  // 月ごと（支給日の月）
  $('#inMonths').innerHTML = '<tr><th>月</th><th>総支給</th><th>手取り</th></tr>' +
    Array.from({ length: 12 }, (_, i) => {
      const ms = xs.filter(x => +x.date.slice(5, 7) === i + 1);
      const has = ms.length > 0;
      return `<tr class="${has ? '' : 'empty'}"><td>${i + 1}月</td>` +
      `<td>${has ? yen(sumGross(ms)) + (netOnly(ms) ? '*' : '') : '-'}</td><td>${has ? yen(sumOf(ms, 'net')) : '-'}</td></tr>`;
    }).join('');

  // 記録（新しい順）
  $('#inList').innerHTML = xs.slice().reverse().map(x =>
    `<li class="${x.id === inEditId ? 'editing' : ''}">` +
    `<button type="button" class="evText inRow" data-inedit="${x.id}">` +
    `<span class="tag">${md(parseYmd(x.date))}</span>${esc(x.job || 'バイト')}` +
    (x.month ? `<span class="from">${+x.month.slice(5)}月分</span>` : '') +
    `<span class="inAmt">` + (x.gross != null
      ? yen(x.gross) + (x.net != null ? ` <small>手取り${yen(x.net)}</small>` : '')
      : `<small>手取り</small> ${yen(x.net)}`) + '</span></button>' +
    `<button class="x" data-indel="${x.id}" aria-label="削除">×</button></li>`).join('')
    || '<li class="muted">この年の記録はまだないよ</li>';
}

// バイト先の候補（過去の記録 → カレンダーのバイト予定）
function renderJobChips() {
  const names = [];
  const add = v => { v = (v || '').trim(); if (v && !names.includes(v) && !state.jobHidden.includes(v)) names.push(v); };
  [...state.incomes].sort((a, b) => b.date.localeCompare(a.date)).forEach(x => add(x.job));
  state.evPresets.filter(p => p.kind === 'job').forEach(p => add(p.title));
  $('#inJobChips').innerHTML = names.slice(0, 8).map(v =>
    `<button type="button" class="chip" data-job="${esc(v)}">${esc(v)}</button>`).join('');
}
$('#inJobChips').addEventListener('click', e => {
  const b = e.target.closest('[data-job]');
  if (b) $('#inJob').value = b.dataset.job;
});

/* ===== 候補の長押しで削除 ===== */
function longPress(box, sel, fn) {
  let timer = null, fired = false, sx = 0, sy = 0;
  const clear = () => { clearTimeout(timer); timer = null; };
  box.addEventListener('pointerdown', e => {
    const b = e.target.closest(sel);
    fired = false;
    if (!b) return;
    sx = e.clientX; sy = e.clientY;
    clear();
    timer = setTimeout(() => { timer = null; fired = true; fn(b); }, 550);
  });
  box.addEventListener('pointermove', e => {
    if (timer && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) clear(); // 指が動いたらスクロール扱い
  });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) box.addEventListener(ev, clear);
  // 長押しのあとのタップで候補が入力されないように
  box.addEventListener('click', e => {
    if (fired) { fired = false; e.preventDefault(); e.stopPropagation(); }
  }, true);
  box.addEventListener('contextmenu', e => { if (e.target.closest(sel)) e.preventDefault(); });
}

longPress($('#evChips'), '[data-preset]', b => {
  const i = +b.dataset.preset, p = state.evPresets[i];
  if (!p || !confirm(`「${p.title}」を候補から消す？\n入ってる予定は消えないよ`)) return;
  state.evPresets.splice(i, 1);
  save(); renderEvSuggest(); renderJobChips();
});
longPress($('#inJobChips'), '[data-job]', b => {
  const v = b.dataset.job;
  if (!confirm(`「${v}」を候補から消す？\n収入の記録は消えないよ`)) return;
  if (!state.jobHidden.includes(v)) state.jobHidden.push(v);
  save(); renderJobChips();
});

/* ===== メモ・一言日記・意見箱 ===== */
const FEEDBACK_URL = 'https://forms.gle/MxiKc1onLaKgThGGA'; // GoogleフォームのURLを入れるとボタンが出る

function renderNotes() {
  const today = todayStr();
  const pin = state.notes.filter(n => n.pin);
  const day = state.notes.filter(n => !n.pin && n.date === today);
  $('#noteList').innerHTML = [...pin, ...day].map(n =>
    `<li><span><button class="tag ${n.pin ? '' : 'next'}" data-ntoggle="${n.id}">${n.pin ? '残す' : '今日だけ'}</button>` +
    `${esc(n.text)}</span><button class="x" data-ndel="${n.id}" aria-label="削除">×</button></li>`).join('')
    || '<li class="muted">なし</li>';
  const d = $('#diaryInput');
  if (document.activeElement !== d) d.value = state.diary[today] || ''; // 書いてる途中は上書きしない
}

function addNote() {
  const text = $('#noteInput').value.trim();
  if (!text) return;
  state.notes.push({ id: uid(), date: todayStr(), text, pin: false });
  $('#noteInput').value = '';
  save(); renderNotes();
}
$('#noteAdd').onclick = addNote;
$('#noteInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); addNote(); }
});

function delNote(id) {
  state.notes = state.notes.filter(x => String(x.id) !== id);
  save(); renderNotes();
  if (curTab === 'cal') { renderCal(); renderDay(); }
}

$('#noteList').addEventListener('click', e => {
  const tg = e.target.closest('[data-ntoggle]');
  if (tg) {
    const n = state.notes.find(x => String(x.id) === tg.dataset.ntoggle);
    if (!n) return;
    n.pin = !n.pin;
    if (!n.pin) n.date = todayStr(); // 「今日だけ」に戻したら今日のメモにする
    save(); renderNotes();
    return;
  }
  const dl = e.target.closest('[data-ndel]');
  if (dl) delNote(dl.dataset.ndel);
});

$('#diaryInput').addEventListener('input', e => {
  const v = e.target.value.trim(), k = todayStr();
  if (v) state.diary[k] = v; else delete state.diary[k];
  save();
});

// カレンダーで見返す・書き直す
$('#dayList').addEventListener('click', e => {
  const dl = e.target.closest('[data-ndel]');
  if (dl) return delNote(dl.dataset.ndel);
  const dy = e.target.closest('[data-diary]');
  if (!dy) return;
  const k = dy.dataset.diary;
  const v = prompt(`${md(parseYmd(k))}の一言日記`, state.diary[k] || '');
  if (v == null) return;
  if (v.trim()) state.diary[k] = v.trim(); else delete state.diary[k];
  save(); renderCal(); renderDay();
  if (k === todayStr()) renderNotes();
});

// ホームから今日の予定を追加
$('#nowCard').addEventListener('click', e => {
  if (!e.target.closest('[data-addev]')) return;
  showTab('cal');
  setTimeout(() => $('#evHead').scrollIntoView({ block: 'center', behavior: 'smooth' }), 60);
});

$('#feedbackBtn').hidden = !FEEDBACK_URL;
$('#feedbackBtn').onclick = () => window.open(FEEDBACK_URL, '_blank', 'noopener');

function syncInForm() {
  $('#inHead').textContent = inEditId ? '記録を変更' : '収入を追加';
  $('#inSave').textContent = inEditId ? '変更を保存' : '追加';
  $('#inCancel').hidden = !inEditId;
}
function resetInForm() {
  inEditId = null;
  $('#inDate').value = todayStr();
  for (const id of ['inMonth', 'inJob', 'inGross', 'inNet']) $('#' + id).value = '';
  syncInForm();
}

$('#incomeBtn').onclick = () => {
  inYear = new Date().getFullYear();
  $('#inLimit').value = state.incomeLimit;
  resetInForm(); resetScan(); renderJobChips(); renderIncome();
  $('#inScan').open = false;
  $('#incomeDlg').showModal();
  $('#incomeDlg').scrollTop = 0;
};
$('#inX').onclick = () => $('#incomeDlg').close();
$('#inPrev').onclick = () => { inYear--; renderIncome(); };
$('#inNext').onclick = () => { inYear++; renderIncome(); };

$('#inLimit').addEventListener('input', e => {
  state.incomeLimit = toYen(e.target.value) ?? '';
  save(); renderIncome();
});

$('#inSave').onclick = () => {
  const date = $('#inDate').value;
  if (!date) return alert('支給日を入れてね');
  const gross = toYen($('#inGross').value), net = toYen($('#inNet').value);
  if (gross == null && net == null) return alert('総支給か手取りのどっちかは入れてね');
  if (gross != null && net != null && net > gross &&
    !confirm('手取りが総支給より多くなってるけど、このまま保存する？')) return;
  const m = $('#inMonth').value;
  const v = { date, month: /^\d{4}-\d{2}$/.test(m) ? m : '', job: $('#inJob').value.trim(), gross, net };
  if (v.job) state.jobHidden = state.jobHidden.filter(j => j !== v.job); // 消した候補でも、また使ったら戻す
  const x = inEditId && state.incomes.find(k => k.id === inEditId);
  if (x) Object.assign(x, v);
  else state.incomes.push({ id: uid(), ...v });
  inYear = +date.slice(0, 4);
  save(); resetInForm(); renderJobChips(); renderIncome();
  $('#scanStatus').textContent = '';
  toast(x ? '変更したよ' : '追加したよ');
};
$('#inCancel').onclick = () => { resetInForm(); renderIncome(); };

$('#inList').addEventListener('click', e => {
  const ed = e.target.closest('[data-inedit]');
  if (ed) {
    const x = state.incomes.find(k => k.id === ed.dataset.inedit);
    if (!x) return;
    inEditId = x.id;
    $('#inDate').value = x.date;
    $('#inMonth').value = x.month;
    $('#inJob').value = x.job;
    $('#inGross').value = x.gross ?? '';
    $('#inNet').value = x.net ?? '';
    syncInForm(); renderIncome();
    $('#inHead').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  const id = e.target.dataset.indel;
  if (!id || !confirm('この記録を消す？')) return;
  state.incomes = state.incomes.filter(k => k.id !== id);
  if (id === inEditId) resetInForm();
  save(); renderIncome();
});

/* ===== 給与明細の読み取り（範囲選択・塗りつぶし） ===== */
const PAY_PROMPT = `これは給与明細の画像です（一部だけ切り取っていたり、黒く塗りつぶした部分があったりします）。読み取って、JSONオブジェクトだけを出力してください。説明文やコードブロック記号は書かないでください。
形式: {"payDate":"2026-05-25","month":"2026-04","gross":123456,"net":110000}
ルール:
- payDateは支給日（YYYY-MM-DD）。monthは何月分の給与か（YYYY-MM）。
- grossは総支給額（支給合計）。netは差引支給額（手取り・振込額）。どちらも円単位の整数で、カンマや「円」は付けない。
- 和暦（令和8年など）は西暦に直す。
- 書かれていない・読み取れない項目は、日付なら ""、金額なら null にする。推測で埋めない。
- 名前・会社名など、上の4つ以外は出力しない。`;

let scanImg = null, scanUrl = '', scanCrop = null, scanMasks = [], scanHist = [];
let scanMode = 'crop', scanDrag = null, scanRunning = false;
const scanCv = $('#scanCv');

function setScanMode(m) {
  scanMode = m;
  $('#modeCrop').classList.toggle('on', m === 'crop');
  $('#modeMask').classList.toggle('on', m === 'mask');
  $('#scanHint').textContent = m === 'crop'
    ? '送りたいところ（金額と日付）を指でなぞって四角で囲んでね。囲まなければ写真全体を送るよ'
    : '隠したいところをなぞると黒く塗りつぶすよ。何か所でもOK';
}
$('#modeCrop').onclick = () => setScanMode('crop');
$('#modeMask').onclick = () => setScanMode('mask');

function resetScan() {
  if (scanUrl) URL.revokeObjectURL(scanUrl);
  scanImg = null; scanUrl = ''; scanCrop = null; scanMasks = []; scanHist = []; scanDrag = null;
  $('#scanFile').value = '';
  $('#scanBox').hidden = true;
  $('#scanStatus').textContent = '';
  const hasKey = !!state.keys[state.provider];
  $('#scanFile').hidden = !hasKey;
  $('#scanNote').textContent = hasKey
    ? '名前・会社名・口座は、範囲の外に出すか塗りつぶしてから送るのがおすすめ。' +
      (state.provider === 'gemini' ? 'Geminiの無料枠だと、送った画像がGoogleの製品改善に使われるよ' : '')
    : '設定の「画像読み取り（AI）の設定」でAPIキーを入れると使えるよ。キーがなくても下の欄から手入力できる';
  setScanMode('crop');
}

$('#scanFile').onchange = async e => {
  const f = e.target.files[0];
  if (!f) return;
  if (scanUrl) URL.revokeObjectURL(scanUrl);
  scanUrl = URL.createObjectURL(f);
  try {
    scanImg = await loadImg(scanUrl);
  } catch {
    scanImg = null;
    return alert('画像が読めなかった');
  }
  scanCrop = null; scanMasks = []; scanHist = [];
  const s = Math.min(1, 1200 / Math.max(scanImg.width, scanImg.height));
  scanCv.width = Math.round(scanImg.width * s);
  scanCv.height = Math.round(scanImg.height * s);
  $('#scanBox').hidden = false;
  $('#scanStatus').textContent = '';
  drawScan();
};

const rectOf = (a, b) =>
  ({ x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y) });

// 画面上の位置 → 元の写真の位置
function scanPt(e) {
  const r = scanCv.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width * scanImg.width;
  const y = (e.clientY - r.top) / r.height * scanImg.height;
  return { x: Math.max(0, Math.min(scanImg.width, x)), y: Math.max(0, Math.min(scanImg.height, y)) };
}

function drawScan() {
  if (!scanImg) return;
  const ctx = scanCv.getContext('2d'), k = scanCv.width / scanImg.width;
  const R = r => [r.x * k, r.y * k, r.w * k, r.h * k];
  ctx.drawImage(scanImg, 0, 0, scanCv.width, scanCv.height);
  ctx.fillStyle = '#000';
  for (const m of scanMasks) ctx.fillRect(...R(m));
  const live = scanDrag && rectOf(scanDrag.a, scanDrag.b);
  if (live && scanMode === 'mask') {
    ctx.fillStyle = 'rgba(0,0,0,.6)';
    ctx.fillRect(...R(live));
  }
  const c = live && scanMode === 'crop' ? live : scanCrop;
  if (c) {
    const [x, y, w, h] = R(c), W = scanCv.width, H = scanCv.height;
    ctx.fillStyle = 'rgba(0,0,0,.45)'; // 範囲の外を暗くする
    ctx.fillRect(0, 0, W, y);
    ctx.fillRect(0, y + h, W, H - y - h);
    ctx.fillRect(0, y, x, h);
    ctx.fillRect(x + w, y, W - x - w, h);
    ctx.strokeStyle = '#ffd43b';
    ctx.lineWidth = Math.max(2, W / 250);
    ctx.strokeRect(x, y, w, h);
  }
}

scanCv.addEventListener('pointerdown', e => {
  if (!scanImg) return;
  e.preventDefault();
  scanCv.setPointerCapture(e.pointerId);
  const p = scanPt(e);
  scanDrag = { a: p, b: p };
});
scanCv.addEventListener('pointermove', e => {
  if (!scanDrag) return;
  scanDrag.b = scanPt(e);
  drawScan();
});
scanCv.addEventListener('pointerup', () => {
  if (!scanDrag) return;
  const r = rectOf(scanDrag.a, scanDrag.b);
  scanDrag = null;
  const min = Math.max(scanImg.width, scanImg.height) / 40; // 小さすぎるのはタップの誤爆として無視
  if (r.w >= min && r.h >= min) {
    scanHist.push({ crop: scanCrop, masks: scanMasks.slice() });
    if (scanMode === 'crop') scanCrop = r; else scanMasks.push(r);
  }
  drawScan();
});
scanCv.addEventListener('pointercancel', () => { scanDrag = null; drawScan(); });

$('#scanUndo').onclick = () => {
  const h = scanHist.pop();
  if (!h) return;
  scanCrop = h.crop; scanMasks = h.masks;
  drawScan();
};
$('#scanReset').onclick = () => {
  if (!scanCrop && !scanMasks.length) return;
  scanHist.push({ crop: scanCrop, masks: scanMasks.slice() });
  scanCrop = null; scanMasks = [];
  drawScan();
};

// 選んだ範囲だけ切り出して、塗りつぶしを焼き込んだ画像にする
function scanToBase64(max = 1568) {
  const r = scanCrop || { x: 0, y: 0, w: scanImg.width, h: scanImg.height };
  const s = Math.min(1, max / Math.max(r.w, r.h));
  const cv = document.createElement('canvas');
  cv.width = Math.max(1, Math.round(r.w * s));
  cv.height = Math.max(1, Math.round(r.h * s));
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.drawImage(scanImg, r.x, r.y, r.w, r.h, 0, 0, cv.width, cv.height);
  ctx.fillStyle = '#000';
  for (const m of scanMasks) ctx.fillRect((m.x - r.x) * s, (m.y - r.y) * s, m.w * s, m.h * s);
  return cv.toDataURL('image/jpeg', 0.9).split(',')[1];
}

$('#scanRun').onclick = async () => {
  if (scanRunning || !scanImg) return;
  const st = $('#scanStatus');
  scanRunning = true;
  $('#scanRun').disabled = true;
  st.textContent = `読み取り中…（${PROVIDERS[state.provider].label}）`;
  try {
    const txt = await callVision(scanToBase64(), PAY_PROMPT, st);
    const s = txt.indexOf('{'), e = txt.lastIndexOf('}');
    if (s < 0 || e < s) throw new Error('結果がうまく読めなかった。範囲を広げるか、別のモデルで試してみて');
    const d = JSON.parse(txt.slice(s, e + 1));
    const got = [];
    if (isYmd(d.payDate)) { $('#inDate').value = d.payDate; got.push('支給日'); }
    if (typeof d.month === 'string' && /^\d{4}-\d{2}$/.test(d.month)) { $('#inMonth').value = d.month; got.push('何月分'); }
    const g = toYen(d.gross), n = toYen(d.net);
    if (g != null) { $('#inGross').value = g; got.push('総支給'); }
    if (n != null) { $('#inNet').value = n; got.push('手取り'); }
    st.textContent = got.length
      ? `${got.join('・')}を読み取ったよ。下の欄を確認して「${$('#inSave').textContent}」を押してね`
      : '金額が見つからなかった。範囲を変えてもう一回試してみて';
  } catch (err) {
    st.textContent = 'エラー: ' + friendlyError(err);
  } finally {
    scanRunning = false;
    $('#scanRun').disabled = false;
  }
};

/* ===== 「元に戻す」表示 ===== */
let toastTimer = null, toastUndo = null;
function toast(msg, undo) {
  $('#toastMsg').textContent = msg;
  toastUndo = undo || null;
  $('#toastUndo').hidden = !undo;
  $('#toast').hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $('#toast').hidden = true; toastUndo = null; }, 6000);
}
$('#toastUndo').onclick = () => {
  toastUndo?.();
  toastUndo = null;
  $('#toast').hidden = true;
};

/* ===== 起動 ===== */
state = normalize(readJSON(KEY) || fromV1(readJSON(OLD_KEY)));
applyTheme(state.theme);
recomputeUntil();
prune();
save();
renderAll();
if (brokenSaved) alert('保存データが壊れてて読めなかった。中身は消さずに別名で残してあるよ');
navigator.storage?.persist?.().catch(() => {});

// ダイアログが開いてるときと、タップした直後は自動更新しない
let lastTouch = 0;
document.addEventListener('pointerdown', () => { lastTouch = Date.now(); }, true);
function tick() {
  if (document.querySelector('dialog[open]')) return;
  if (Date.now() - lastTouch < 3000) return;
  prune();
  renderAll();
}
setInterval(tick, 30000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
