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

const DEFAULT_TIMES = [
  ['08:50', '10:20'], ['10:30', '12:00'], ['13:00', '14:30'], ['14:40', '16:10'],
  ['16:20', '17:50'], ['18:00', '19:30'], ['19:40', '21:10'], ['', ''], ['', ''], ['', '']
];

const PROVIDERS = {
  gemini: {
    label: 'Gemini（Google AI Studio・無料枠あり）',
    url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    model: 'gemini-3.8-flash',
    models: ['gemini-3.8-flash', 'gemini-3.5-flash-lite'],
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

// 混雑時に切り替える予備のモデル
const FALLBACK_MODEL = { gemini: 'gemini-3.5-flash-lite' };

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

const newCourse = (day, period, extra = {}) => ({
  id: uid(), day, period, name: '', teacher: '', room: '', syllabus: '',
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
      c.name ??= ''; c.teacher ??= ''; c.room ??= ''; c.syllabus ??= '';
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
// 開くURL（授業ごとのURL → なければ検索URL）
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
  else if (isHttp(state.syllabusSearch)) msg = `URLがないから、シラバス検索で「${c.name}」を開くよ`;
  else msg = '設定でシラバス検索のURLを入れておくと、URLを貼らなくても開けるよ';
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
    `<b>${esc(x.c.name)}</b> <small>${esc(x.c.room)}</small>` +
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
    const ocr = state.keys[state.provider] ? '上の「画像読込」から時間割の画像を読み込むこともできるよ。' : '';
    el.innerHTML = '<h2>はじめに</h2><p class="muted">下の時間割の空いてるマスをタップすると、授業を追加できるよ。' + ocr + '</p>';
    return;
  }

  if (termEnded(t, now)) {
    const nt = suggestTerm(now);
    el.innerHTML = `<h2>この学期は終わったよ</h2>` +
      `<p class="muted">${esc(t.name)}は${md(parseYmd(t.end))}で終了</p>` +
      (nt ? `<button data-switch="${nt.id}">「${esc(nt.name)}」に切り替える</button>`
          : '<p class="muted">「カレンダー」から次の学期を作ってね</p>');
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
      if (cc.length) h += `<p class="start">今日休講：${cc.map(c => esc(c.name)).join('、')}</p>`;
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
  el.innerHTML = h + (body || '<h2>次の授業</h2><p class="muted">設定で各時限の時刻を入れると表示されるよ</p>');
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
    for (const c of cancelledOn(date, t)) note(`${c.id}@${ymd(date)}`, `休講：${md(date)} ${c.name}`);
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
      if (!e.from.includes(c.name)) e.from.push(c.name);
      if (i.type === 'always') e.always = true;
    }
  }
  packList = [...map.values()];
  const done = packList.filter(e => checks[e.text]).length;

  const diff = dayDiff(t.date, now);
  let title = diff === 0 ? `今日 ${md(t.date)}` : diff === 1 ? `明日 ${md(t.date)}` : md(t.date);
  if (t.swapped != null) title += `（${DAYS[t.swapped]}曜授業）`;
  if (t.first) title += '（授業初日）';
  const names = t.cs.map(c => `${c.period}限 ${esc(c.name)}`).join('／');
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
function renderTasks() {
  const el = $('#taskCard');
  const all = [];
  for (const c of courses()) for (const t of c.tasks) if (!t.done) all.push({ c, t });
  all.sort((a, b) => (a.t.due || '9999').localeCompare(b.t.due || '9999'));
  if (!all.length) {
    el.innerHTML = '<h2>課題</h2><p class="muted">未完了の課題はないよ。授業をタップすると追加できる</p>';
    return;
  }
  el.innerHTML = `<h2>課題 <small>${all.length}件</small></h2><ul>` + all.map(({ c, t }) => {
    const st = dueState(t.due);
    return `<li class="${st.cls}"><label><input type="checkbox" data-task="${t.id}" data-cid="${c.id}">` +
      `<span>${esc(t.title)}</span></label>` +
      `<span class="due" data-id="${c.id}">${esc(c.name)}・${st.label}</span></li>`;
  }).join('') + '</ul>';
}

/* ===== 画面：時間割 ===== */
function renderGrid() {
  const days = state.showSat || courses().some(c => c.day === 5) ? 6 : 5;
  const periods = Math.max(state.periods, ...courses().map(c => c.period));
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
          return `<div class="course" data-id="${c.id}"><b>${esc(c.name)}</b><small>${esc(c.room)}</small><div>` +
            (ni ? `<span class="badge item">持ち物${ni}</span>` : '') +
            (nt ? `<span class="badge task">課題${nt}</span>` : '') +
            (a.left != null && a.left <= 1 ? `<span class="badge abs">欠席${a.n}/${a.max}</span>` : '') +
            `</div></div>`;
        }).join('') + '</div>';
    }
  }
  g.innerHTML = h;
}

function renderTermSelect() {
  $('#termSelect').innerHTML = state.terms.map(t =>
    `<option value="${t.id}" ${t.id === state.currentTermId ? 'selected' : ''}>${esc(t.name)}</option>`).join('');
}

function renderBackupWarn() {
  const el = $('#backupWarn');
  const has = state.terms.some(t => t.courses.length);
  const days = state.lastExport ? dayDiff(new Date(), new Date(state.lastExport)) : null;
  if (!has || (days != null && days < 14)) { el.hidden = true; return; }
  el.hidden = false;
  el.textContent = days == null
    ? 'まだ一度もバックアップしてないよ。ここを押して設定の「書き出し」へ'
    : `最後のバックアップから${days}日たったよ。ここを押して書き出しておこう`;
}

function renderAll() {
  $('#importBtn').hidden = !state.keys[state.provider];
  renderBackupWarn();
  renderTermSelect();
  renderNow();
  renderPack();
  renderTasks();
  renderGrid();
}

/* ===== メイン画面の操作 ===== */
$('#nowCard').addEventListener('click', e => {
  const sw = e.target.dataset.switch;
  if (sw) {
    state.currentTermId = sw;
    save(); renderAll();
    return;
  }
  const n = e.target.closest('.nc');
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

$('#termSelect').onchange = e => {
  state.currentTermId = e.target.value;
  save(); renderAll();
};

/* ===== 授業詳細 ===== */
let currentId = null;
const cur = () => courses().find(c => c.id === currentId);

$('#cDay').innerHTML = DAYS.map((d, i) => `<option value="${i}">${d}曜</option>`).join('');
$('#cPeriod').innerHTML = Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1}限</option>`).join('');

function renderItemSuggest() {
  const set = new Set(state.itemHistory);
  for (const t of state.terms) for (const c of t.courses) for (const i of c.items) set.add(i.text.trim());
  $('#itemSuggest').innerHTML = [...set].filter(Boolean).map(v => `<option value="${esc(v)}">`).join('');
}

function openCourse(id) {
  currentId = id;
  const c = cur();
  if (!c) return;
  $('#cName').value = c.name;
  $('#cTeacher').value = c.teacher;
  $('#cRoom').value = c.room;
  $('#cSyllabus').value = c.syllabus;
  $('#cDay').value = c.day;
  $('#cPeriod').value = c.period;
  $('#taskDue').value = '';
  $('#absDate').value = lastClassDate(c);
  $('#absMax').value = c.maxAbsence;
  renderItemSuggest();
  renderDetail();
  renderSyllabusHint();
  $('#courseDlg').showModal();
  if (!c.name) $('#cName').focus(); // 新しい授業のときだけ授業名にカーソル
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
  const a = absInfo(c);
  let sum = `${a.n}回`;
  if (a.max != null) sum += a.left < 0 ? ` / 上限${a.max}回（超えてる）` : ` / 上限${a.max}回（あと${a.left}回）`;
  $('#absSummary').textContent = sum;
  $('#absSummary').className = a.left != null && a.left <= 1 ? 'alert' : '';
  $('#absList').innerHTML = c.absences.slice().sort().map(d =>
    `<li><span>${md(parseYmd(d))}</span><button class="x" data-adel="${d}" aria-label="削除">×</button></li>`).join('')
    || '<li class="muted">なし</li>';
}

for (const [id, key] of [['cName', 'name'], ['cTeacher', 'teacher'], ['cRoom', 'room']]) {
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
  if (!url) return alert('シラバスのURLを貼るか、設定でシラバス検索のURLを入れてね');
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
$('#cClose').onclick = () => $('#courseDlg').close();
$('#cX').onclick = () => $('#courseDlg').close();

// 何も入ってない授業は閉じたときに消す
$('#courseDlg').addEventListener('close', () => {
  const c = cur();
  if (!c) return;
  const empty = !c.name.trim() && !c.teacher.trim() && !c.room.trim() && !c.syllabus &&
    !c.items.length && !c.memos.length && !c.tasks.length && !c.absences.length && c.maxAbsence === '';
  if (empty) removeCourse(c);
  save(); renderAll();
});

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
async function requestOnce(p, key, model, b64) {
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
          { type: 'text', text: PROMPT }
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
          { type: 'text', text: PROMPT },
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

// 混雑時は自動でやり直し、それでもダメなら予備のモデルに切り替える
async function callVision(b64) {
  const p = state.provider, key = state.keys[p], main = modelOf(p);
  if (!key) throw new Error('設定でAPIキーを入れてね');
  if (!main) throw new Error('設定でモデルIDを入れてね');

  const models = [main];
  if (FALLBACK_MODEL[p] && FALLBACK_MODEL[p] !== main) models.push(FALLBACK_MODEL[p]);
  const st = $('#ocrStatus');
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
      const r = await requestOnce(p, key, model, b64);
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
    const lost = old.filter(c => !used.has(c) &&
      (c.items.length || c.memos.length || c.tasks.length || c.syllabus || c.absences.length));
    const msg = `「${t.name}」の時間割を置き換える？` + (lost.length
      ? `\n\n次の授業のメモ・持ち物・課題・欠席は消えるよ（授業名・曜日・時限が全部同じものだけ引き継ぐ）\n` +
        lost.map(c => `・${DAYS[c.day]}${c.period} ${c.name}`).join('\n')
      : '');
    if (!confirm(msg)) return;
    backup = { courses: structuredClone(old), cancels: structuredClone(t.cancels) };
  }
  const added = pairs.map(([r, prev]) => prev ? Object.assign(prev, r) : newCourse(r.day, r.period, r));
  t.courses = replace ? added : old.concat(added);
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

/* ===== カレンダー（学期・休み・振替） ===== */
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

$('#termBtn').onclick = () => {
  renderTermList();
  renderOffList();
  for (const id of ['offFrom', 'offTo', 'offNote', 'swapDate', 'newTermStart', 'newTermEnd']) $('#' + id).value = '';
  $('#newTermName').value = nextTermName(term().name);
  $('#newTermCopy').checked = false;
  $('#termDlg').showModal();
};
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
  const copied = $('#newTermCopy').checked ? courses().map(c => newCourse(c.day, c.period, {
    name: c.name, teacher: c.teacher, room: c.room, syllabus: c.syllabus, maxAbsence: c.maxAbsence,
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
    syllabusSearch: state.syllabusSearch
  };
  fillProviderFields(state.provider);
  $('#sPeriods').value = tmp.periods;
  $('#sSat').checked = tmp.showSat;
  $('#sShift').checked = tmp.shiftTimes;
  $('#sSyllabus').value = tmp.syllabusSearch;
  $('#restoreFile').value = '';
  renderTimes();
  collect();
  snapshot = JSON.stringify(tmp);
  renderLastExport();
  $('#aiBox').open = false;
  $('#settingsDlg').showModal();
  $('#settingsDlg').scrollTop = 0;
}

function closeSettings() {
  collect();
  if (JSON.stringify(tmp) !== snapshot && !confirm('変更を保存せずに閉じる？')) return;
  $('#settingsDlg').close();
}

$('#settingsBtn').onclick = openSettings;
$('#backupWarn').onclick = openSettings;
$('#sX').onclick = closeSettings;
$('#sCancel').onclick = closeSettings;
$('#settingsDlg').addEventListener('cancel', e => { e.preventDefault(); closeSettings(); }); // Escキー

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
  save(); renderLastExport(); renderBackupWarn();
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
    scheduleChanged();
    $('#settingsDlg').close();
    alert('復元したよ');
  } catch {
    alert('ファイルが読めなかった');
  } finally {
    e.target.value = '';
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
  prune(); renderAll();
}
setInterval(tick, 30000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
