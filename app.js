'use strict';

/* ===== 基本 ===== */
const $ = s => document.querySelector(s);
const DAYS = ['月', '火', '水', '木', '金', '土'];
const WEEK = ['日', '月', '火', '水', '木', '金', '土'];
const KEY = 'jikanwari-v2';
const OLD_KEY = 'jikanwari-v1';
const SEARCH_DAYS = 120; // 長期休みをまたいで次の授業を探す日数

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
const todayStr = () => ymd(new Date());
const dayIndex = d => (d.getDay() + 6) % 7; // 月=0 … 日=6
const addDays = (d, k) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + k);
const md = d => `${d.getMonth() + 1}/${d.getDate()}(${WEEK[d.getDay()]})`;
const hm = d => `${d.getHours()}:${pad(d.getMinutes())}`;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const DEFAULT_TIMES = [
  ['08:50', '10:20'], ['10:30', '12:00'], ['13:00', '14:30'], ['14:40', '16:10'],
  ['16:20', '17:50'], ['18:00', '19:30'], ['19:40', '21:10'], ['', ''], ['', ''], ['', '']
];

const PROVIDERS = {
  gemini: {
    label: 'Gemini（Google AI Studio・無料枠あり）',
    url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    model: 'gemini-3.8-flash',
    keyUrl: 'https://aistudio.google.com/apikey',
    note: '無料枠では送った画像が Google の製品改善に使われる。'
  },
  openrouter: {
    label: 'OpenRouter（無料モデルあり）',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: '',
    keyUrl: 'https://openrouter.ai/collections/free-models',
    note: '画像に対応した無料モデルのIDを一覧から選んで入れてね。'
  },
  claude: {
    label: 'Claude（有料）',
    url: 'https://api.anthropic.com/v1/messages',
    model: 'claude-sonnet-5',
    keyUrl: 'https://docs.claude.com',
    note: ''
  }
};

// 混雑時に切り替える予備のモデル
const FALLBACK_MODEL = { gemini: 'gemini-3.5-flash-lite' };

const ICON_PRESETS = [
  { id: 'grid-blue', kind: 'grid', bg: '#2f6fde', accent: '#ffd43b' },
  { id: 'grid-green', kind: 'grid', bg: '#2b8a3e', accent: '#ffd43b' },
  { id: 'grid-orange', kind: 'grid', bg: '#e8590c', accent: '#fff3bf' },
  { id: 'grid-dark', kind: 'grid', bg: '#343a40', accent: '#4dabf7' },
  { id: 'char-ji', kind: 'char', bg: '#2f6fde', text: '時' },
  { id: 'char-wari', kind: 'char', bg: '#7048e8', text: '割' },
  { id: 'char-ju', kind: 'char', bg: '#d6336c', text: '授' },
  { id: 'char-memo', kind: 'char', bg: '#f08c00', text: 'メモ' }
];
const DEFAULT_ICON = { preset: 'grid-blue', custom: null, useCustom: false };

/* ===== データ ===== */
let state;

function readJSON(k) {
  try { return JSON.parse(localStorage.getItem(k)); } catch { return null; }
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
  ({ id: uid(), name, start, end, offDays: [], swaps: [], courses });

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
  s.periods ??= 7;
  s.showSat ??= false;
  s.shiftTimes ??= true;
  s.times ??= [];
  for (let i = 0; i < 10; i++) {
    s.times[i] ??= { start: DEFAULT_TIMES[i][0], end: DEFAULT_TIMES[i][1] };
  }
  if (!PROVIDERS[s.provider]) s.provider = 'gemini';
  s.keys ??= {};
  s.models ??= {};
  s.packChecks ??= {};
  s.icon = { ...DEFAULT_ICON, ...(s.icon || {}) };
  if (!ICON_PRESETS.some(p => p.id === s.icon.preset)) s.icon.preset = DEFAULT_ICON.preset;
  if (!s.icon.custom) s.icon.useCustom = false;
  delete s.appName;
  if (!Array.isArray(s.terms) || !s.terms.length) s.terms = [newTerm(defaultTermName())];
  if (!s.terms.some(t => t.id === s.currentTermId)) s.currentTermId = s.terms[0].id;
  for (const t of s.terms) {
    t.start ??= '';
    t.end ??= '';
    t.offDays ??= [];
    t.swaps ??= [];
    t.courses ??= [];
    for (const o of t.offDays) o.id ??= uid();
    for (const w of t.swaps) w.id ??= uid();
    for (const c of t.courses) {
      c.id ??= uid();
      c.name ??= ''; c.teacher ??= ''; c.room ??= '';
      c.items ??= []; c.memos ??= []; c.tasks ??= [];
      for (const i of c.items) {
        i.id ??= uid();
        i.type ??= 'next';
        i.added ??= Date.now();
        i.until ??= null;
      }
    }
  }
  return s;
}

const save = () => localStorage.setItem(KEY, JSON.stringify(state));
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

// その日にある授業
function coursesOn(date, t = term()) {
  if (!isClassDay(date, t)) return [];
  const d = effDay(date, t);
  return t.courses.filter(c => c.day === d).sort((a, b) => a.period - b.period);
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

// from より後に始まる、いちばん近い回
function nextOccurrence(c, t = term(), from = new Date()) {
  const base = searchBase(from, t);
  for (let k = 0; k < SEARCH_DAYS; k++) {
    const date = addDays(base, k);
    if (pastEnd(date, t)) break;
    if (!isClassDay(date, t) || effDay(date, t) !== c.day) continue;
    const o = occurrence(c, date);
    if (o && o.start > from) return o;
  }
  return null;
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

// 時刻・休み・曜日などが変わったときの再計算
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
    el.innerHTML = '<h2>次の授業</h2><p class="muted">時間割を登録するとここに出るよ</p>';
    return;
  }

  if (termEnded(t, now)) {
    const nt = suggestTerm(now);
    el.innerHTML = `<h2>この学期は終わったよ</h2>` +
      `<p class="muted">${esc(t.name)}は${md(parseYmd(t.end))}で終了</p>` +
      (nt ? `<button data-switch="${nt.id}">「${esc(nt.name)}」に切り替える</button>`
          : '<p class="muted">「学期・休み」から次の学期を作ってね</p>');
    return;
  }

  let h = '';
  const s = parseYmd(t.start);
  if (s && dayDiff(s, now) > 0) {
    h += `<p class="start">授業開始まで <b>あと${dayDiff(s, now)}日</b>（${md(s)}から）</p>`;
  } else if (inTerm(now, t)) {
    const off = offInfo(now, t);
    if (off) h += `<p class="start">今日は授業なし${off.note ? `（${esc(off.note)}）` : ''}</p>`;
    else if (effDay(now, t) !== dayIndex(now)) h += `<p class="start">今日は${DAYS[effDay(now, t)]}曜の授業をやる日</p>`;
  }

  const list = upcoming(now);
  const cur = list.filter(x => x.start <= now);
  const first = list.find(x => x.start > now);
  const nxt = first ? list.filter(x => +x.start === +first.start) : [];
  let body = '';
  if (cur.length) {
    const c = cur[0].c;
    body += `<h2>今の授業 <small>${DAYS[c.day]}${c.period}・あと${fmtLeft(cur[0].end - now)}で終わり</small></h2>` +
      cur.map(courseLine).join('');
  }
  if (nxt.length) {
    const c = nxt[0].c;
    body += `<h2>次の授業 <small>${DAYS[c.day]}${c.period}・${whenLabel(nxt[0].start, now)}</small></h2>` +
      nxt.map(courseLine).join('');
  }
  el.innerHTML = h + (body || '<h2>次の授業</h2><p class="muted">設定で各時限の時刻を入れると表示されるよ</p>');
}

/* ===== 画面：明日の持ち物 ===== */
let packList = [], packKey = '';

function packTarget(now) {
  const t = term(), s = parseYmd(t.start);
  const base = searchBase(addDays(now, 1), t);
  const offs = [];
  for (let k = 0; k < SEARCH_DAYS; k++) {
    const date = addDays(base, k);
    if (pastEnd(date, t)) break;
    if (!inTerm(date, t)) continue;
    const off = offInfo(date, t);
    if (off) {
      const hadClass = t.courses.some(c => c.day === effDay(date, t));
      if (hadClass && !offs.includes(off)) offs.push(off);
      continue;
    }
    const cs = coursesOn(date, t);
    if (cs.length) {
      const ed = effDay(date, t);
      return {
        date, cs, offs,
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
    el.innerHTML = `<h2>明日の持ち物</h2><p class="muted">${msg}</p>`;
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

  let title = dayDiff(t.date, now) === 1 ? `明日 ${md(t.date)}` : md(t.date);
  if (t.swapped != null) title += `（${DAYS[t.swapped]}曜授業）`;
  if (t.first) title += '（授業初日）';
  const names = t.cs.map(c => `${c.period}限 ${esc(c.name)}`).join('／');
  const offHint = t.offs.length ? `<p class="hint">休み：${t.offs.map(o => esc(offLabel(o))).join('、')}</p>` : '';

  el.innerHTML =
    `<h2>${title}の持ち物 <small>${packList.length ? `${done}/${packList.length}` : ''}</small></h2>` +
    offHint +
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
          return `<div class="course" data-id="${c.id}"><b>${esc(c.name)}</b><small>${esc(c.room)}</small><div>` +
            (ni ? `<span class="badge item">持ち物${ni}</span>` : '') +
            (nt ? `<span class="badge task">課題${nt}</span>` : '') +
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

function renderAll() {
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
  if (t) { t.done = true; save(); renderAll(); }
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
  const d = +cell.dataset.d, p = +cell.dataset.p;
  if (!confirm(`${DAYS[d]}曜${p}限に授業を追加する？`)) return;
  const c = { id: uid(), day: d, period: p, name: '新しい授業', teacher: '', room: '', items: [], memos: [], tasks: [] };
  courses().push(c);
  save(); renderAll(); openCourse(c.id);
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

function openCourse(id) {
  currentId = id;
  const c = cur();
  if (!c) return;
  $('#cName').value = c.name;
  $('#cTeacher').value = c.teacher;
  $('#cRoom').value = c.room;
  $('#cDay').value = c.day;
  $('#cPeriod').value = c.period;
  $('#taskDue').value = '';
  renderDetail();
  $('#courseDlg').showModal();
}

function renderDetail() {
  const c = cur();
  if (!c) return;

  $('#itemList').innerHTML = c.items.map(i =>
    `<li><span>` +
    (i.type === 'always'
      ? '<span class="tag">毎回</span>'
      : `<span class="tag next">次回${i.until ? '・' + md(new Date(i.until)) : ''}</span>`) +
    `${esc(i.text)}</span><button class="x" data-del="${i.id}">×</button></li>`).join('')
    || '<li class="muted">なし</li>';

  const ts = c.tasks.slice().sort((a, b) =>
    (a.done - b.done) || (a.due || '9999').localeCompare(b.due || '9999'));
  $('#taskList').innerHTML = ts.map(t => {
    const st = dueState(t.due);
    return `<li class="${t.done ? '' : st.cls}"><label>` +
      `<input type="checkbox" data-tdone="${t.id}" ${t.done ? 'checked' : ''}>` +
      `<span class="${t.done ? 'done' : ''}">${esc(t.title)}</span></label>` +
      `<span class="due">${t.done ? '完了' : st.label}</span>` +
      `<button class="x" data-tdel="${t.id}">×</button></li>`;
  }).join('') || '<li class="muted">なし</li>';

  $('#memoList').innerHTML = c.memos.slice().reverse().map(m =>
    `<li><div><span class="memo-date">${esc(m.date)}</span>${esc(m.text).replace(/\n/g, '<br>')}</div>` +
    `<button class="x" data-mdel="${m.id}">×</button></li>`).join('');
}

for (const [id, key] of [['cName', 'name'], ['cTeacher', 'teacher'], ['cRoom', 'room']]) {
  $('#' + id).addEventListener('input', e => { cur()[key] = e.target.value; save(); renderAll(); });
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
  const c = cur(), type = $('#itemType').value, now = Date.now();
  c.items.push({ id: uid(), text: v, type, added: now, until: type === 'next' ? untilFor(c, term(), new Date(now)) : null });
  $('#itemInput').value = '';
  save(); renderDetail(); renderAll();
};
$('#itemInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.isComposing) $('#itemAdd').click();
});
$('#itemList').addEventListener('click', e => {
  const id = e.target.dataset.del;
  if (!id) return;
  cur().items = cur().items.filter(i => i.id !== id);
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

$('#cDelete').onclick = () => {
  if (!confirm('この授業とメモ・課題を削除する？')) return;
  term().courses = courses().filter(c => c.id !== currentId);
  save(); renderAll(); $('#courseDlg').close();
};
$('#cClose').onclick = () => $('#courseDlg').close();

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
    $('#ocrStatus').textContent = 'エラー: ' + err.message;
  } finally {
    ocrRunning = false;
    $('#runOcr').disabled = false;
  }
};

// 読み取り結果を編集できる表にする
function showRows(arr) {
  const rows = (Array.isArray(arr) ? arr : []).map(r => ({
    day: DAYS.indexOf(String(r.day ?? '').trim().charAt(0)),
    period: Math.min(10, Math.max(1, parseInt(r.period, 10) || 1)),
    name: String(r.name ?? '').trim(),
    teacher: String(r.teacher ?? '').trim(),
    room: String(r.room ?? '').trim()
  }));
  if (!rows.length) { $('#ocrResult').innerHTML = ''; return; }
  $('#ocrResult').innerHTML =
    '<table class="ocr"><tr><th>除外</th><th>曜</th><th>限</th><th>授業名</th><th>教員</th><th>教室</th></tr>' +
    rows.map(r =>
      `<tr><td><input type="checkbox" class="skip"></td>` +
      `<td><select class="d">${DAYS.map((d, i) => `<option value="${i}" ${i === r.day ? 'selected' : ''}>${d}</option>`).join('')}</select></td>` +
      `<td><input type="number" class="p" min="1" max="10" value="${r.period}"></td>` +
      `<td><input class="n" value="${esc(r.name)}"></td>` +
      `<td><input class="t" value="${esc(r.teacher)}"></td>` +
      `<td><input class="r" value="${esc(r.room)}"></td></tr>`).join('') +
    '</table>';
}

function readRows() {
  return [...document.querySelectorAll('#ocrResult tr')].slice(1)
    .filter(tr => !tr.querySelector('.skip').checked)
    .map(tr => ({
      day: +tr.querySelector('.d').value,
      period: Math.min(10, Math.max(1, parseInt(tr.querySelector('.p').value, 10) || 1)),
      name: tr.querySelector('.n').value.trim(),
      teacher: tr.querySelector('.t').value.trim(),
      room: tr.querySelector('.r').value.trim()
    }))
    .filter(r => r.name);
}

function applyImport(replace) {
  const rows = readRows();
  if (!rows.length) return alert('保存する授業がないよ');
  if (replace && !confirm('今の学期の時間割を置き換える？\n同じ名前の授業のメモ・持ち物・課題は引き継ぐよ')) return;
  const t = term();
  const make = r => ({ id: uid(), ...r, items: [], memos: [], tasks: [] });
  if (replace) {
    const old = new Map(t.courses.map(c => [c.name, c]));
    t.courses = rows.map(r => {
      const c = make(r), o = old.get(r.name);
      if (o) {
        c.items = o.items; c.memos = o.memos; c.tasks = o.tasks;
        old.delete(r.name);
      }
      return c;
    });
  } else {
    t.courses.push(...rows.map(make));
  }
  if (rows.some(r => r.day === 5)) state.showSat = true;
  scheduleChanged();
  $('#importDlg').close();
}
$('#applyReplace').onclick = () => applyImport(true);
$('#applyAdd').onclick = () => applyImport(false);

/* ===== 学期・休み ===== */
$('#swapDay').innerHTML = DAYS.map((d, i) => `<option value="${i}">${d}曜</option>`).join('');

function renderTermDlg() {
  const t = term();
  $('#termList').innerHTML = state.terms.map(x =>
    `<li class="termBox"><div class="row">` +
    `<input data-tname="${x.id}" value="${esc(x.name)}">` +
    (x.id === state.currentTermId ? '<span class="tag">表示中</span>' : `<button data-tuse="${x.id}">表示</button>`) +
    `<button class="x" data-tdel="${x.id}">×</button></div>` +
    `<div class="row"><span class="hint">開始</span><input type="date" data-tstart="${x.id}" value="${x.start}">` +
    `<span class="hint">終了</span><input type="date" data-tend="${x.id}" value="${x.end}"></div></li>`).join('');

  $('#offTitle').textContent = `授業がない日（${t.name}）`;
  $('#offList').innerHTML = t.offDays.slice().sort((a, b) => a.from.localeCompare(b.from)).map(o =>
    `<li><span>${esc(offLabel(o))}</span><button class="x" data-odel="${o.id}">×</button></li>`).join('')
    || '<li class="muted">なし</li>';
  $('#swapList').innerHTML = t.swaps.slice().sort((a, b) => a.date.localeCompare(b.date)).map(w =>
    `<li><span>${md(parseYmd(w.date))} は${DAYS[w.asDay]}曜の授業</span><button class="x" data-sdel="${w.id}">×</button></li>`).join('')
    || '<li class="muted">なし</li>';
}

$('#termBtn').onclick = () => {
  $('#newTermName').value = nextTermName(term().name);
  $('#newTermStart').value = '';
  $('#newTermEnd').value = '';
  $('#newTermCopy').checked = false;
  renderTermDlg();
  $('#termDlg').showModal();
};
$('#termClose').onclick = () => $('#termDlg').close();

$('#termList').addEventListener('change', e => {
  const d = e.target.dataset;
  const id = d.tname || d.tstart || d.tend;
  const t = state.terms.find(x => x.id === id);
  if (!t) return;
  if (d.tname) {
    t.name = e.target.value.trim() || t.name;
    save(); renderTermSelect();
    return;
  }
  const start = d.tstart ? e.target.value : t.start;
  const end = d.tend ? e.target.value : t.end;
  if (start && end && start > end) {
    alert('開始日が終了日より後になってるよ');
    e.target.value = d.tstart ? t.start : t.end;
    return;
  }
  t.start = start; t.end = end;
  scheduleChanged();
});

$('#termList').addEventListener('click', e => {
  const { tuse, tdel } = e.target.dataset;
  if (tuse) {
    state.currentTermId = tuse;
    save(); renderAll(); renderTermDlg();
  } else if (tdel) {
    if (state.terms.length <= 1) return alert('学期は最低1つ必要だよ');
    const t = state.terms.find(x => x.id === tdel);
    if (!confirm(`「${t.name}」を削除する？授業やメモも全部消えるよ`)) return;
    state.terms = state.terms.filter(x => x.id !== tdel);
    if (state.currentTermId === tdel) state.currentTermId = state.terms[0].id;
    scheduleChanged(); renderTermDlg();
  }
});

$('#offAdd').onclick = () => {
  const from = $('#offFrom').value, to = $('#offTo').value;
  if (!from) return alert('休みの日付を選んでね');
  if (to && to < from) return alert('終わりの日付が始まりより前になってるよ');
  term().offDays.push({ id: uid(), from, to: to && to !== from ? to : '', note: $('#offNote').value.trim() });
  $('#offFrom').value = ''; $('#offTo').value = ''; $('#offNote').value = '';
  scheduleChanged(); renderTermDlg();
};
$('#offList').addEventListener('click', e => {
  const id = e.target.dataset.odel;
  if (!id) return;
  term().offDays = term().offDays.filter(o => o.id !== id);
  scheduleChanged(); renderTermDlg();
});

$('#swapAdd').onclick = () => {
  const date = $('#swapDate').value;
  if (!date) return alert('振替する日を選んでね');
  const t = term();
  t.swaps = t.swaps.filter(w => w.date !== date);
  t.swaps.push({ id: uid(), date, asDay: +$('#swapDay').value });
  $('#swapDate').value = '';
  scheduleChanged(); renderTermDlg();
};
$('#swapList').addEventListener('click', e => {
  const id = e.target.dataset.sdel;
  if (!id) return;
  term().swaps = term().swaps.filter(w => w.id !== id);
  scheduleChanged(); renderTermDlg();
});

$('#termCreate').onclick = () => {
  const name = $('#newTermName').value.trim();
  const start = $('#newTermStart').value, end = $('#newTermEnd').value;
  if (!name) return alert('学期の名前を入れてね');
  if (start && end && start > end) return alert('開始日が終了日より後になってるよ');
  const copied = $('#newTermCopy').checked
    ? courses().map(c => ({
        id: uid(), day: c.day, period: c.period, name: c.name, teacher: c.teacher, room: c.room,
        items: c.items.filter(i => i.type === 'always').map(i => ({ ...i, id: uid() })),
        memos: [], tasks: []
      }))
    : [];
  const t = newTerm(name, start, end, copied);
  state.terms.push(t);
  state.currentTermId = t.id;
  scheduleChanged();
  $('#termDlg').close();
};

/* ===== アイコン ===== */
const presetOf = id => ICON_PRESETS.find(p => p.id === id) || ICON_PRESETS[0];

function presetURL(id, size) {
  const p = presetOf(id);
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const x = cv.getContext('2d');
  x.fillStyle = p.bg;
  x.fillRect(0, 0, size, size);
  if (p.kind === 'grid') {
    const m = size * 0.2, gap = size * 0.045;
    const cell = (size - m * 2 - gap * 2) / 3;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      x.fillStyle = r === 1 && c === 1 ? p.accent : 'rgba(255,255,255,0.92)';
      x.fillRect(m + c * (cell + gap), m + r * (cell + gap), cell, cell);
    }
  } else {
    x.fillStyle = '#fff';
    x.font = `bold ${size * (p.text.length > 1 ? 0.36 : 0.56)}px sans-serif`;
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.fillText(p.text, size / 2, size * 0.53);
  }
  return cv.toDataURL('image/png');
}

const iconURL = (icon, size = 512) =>
  icon.useCustom && icon.custom ? icon.custom : presetURL(icon.preset, size);

async function cropToSquare(file, size = 512) {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImg(url);
    const s = Math.min(img.width, img.height);
    const cv = document.createElement('canvas');
    cv.width = cv.height = size;
    const x = cv.getContext('2d');
    x.fillStyle = '#fff';
    x.fillRect(0, 0, size, size);
    x.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
    return cv.toDataURL('image/jpeg', 0.9);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/* ===== 設定 ===== */
let draft = null, snapshot = '', shownProvider = '';

function openSettings() {
  draft = {
    provider: state.provider,
    keys: { ...state.keys },
    models: { ...state.models },
    periods: state.periods,
    showSat: state.showSat,
    shiftTimes: state.shiftTimes,
    times: state.times.map(t => ({ ...t })),
    icon: { ...state.icon }
  };
  snapshot = JSON.stringify(draft);

  $('#sProvider').innerHTML = Object.entries(PROVIDERS).map(([k, v]) =>
    `<option value="${k}">${esc(v.label)}</option>`).join('');
  $('#sProvider').value = draft.provider;
  fillProvider();
  $('#sPeriods').value = draft.periods;
  $('#sSat').checked = draft.showSat;
  $('#sShift').checked = draft.shiftTimes;
  $('#iconFile').value = '';
  $('#restoreFile').value = '';
  renderTimes();
  renderIconPicker();
  $('#settingsDlg').showModal();
}

function fillProvider() {
  const p = draft.provider, info = PROVIDERS[p];
  shownProvider = p;
  $('#sKey').value = draft.keys[p] || '';
  $('#sModel').value = draft.models[p] || '';
  $('#sModel').placeholder = info.model || 'モデルIDを入力';
  $('#sKeyLink').href = info.keyUrl;
  $('#sNote').textContent = info.note;
}

// 画面の入力内容を下書きに移す
function stash() {
  const k = $('#sKey').value.trim(), m = $('#sModel').value.trim();
  if (k) draft.keys[shownProvider] = k; else delete draft.keys[shownProvider];
  if (m) draft.models[shownProvider] = m; else delete draft.models[shownProvider];
}

$('#sProvider').onchange = e => {
  stash();
  draft.provider = e.target.value;
  fillProvider();
};
$('#sPeriods').oninput = e => {
  const n = parseInt(e.target.value, 10);
  if (!n) return;
  draft.periods = Math.min(10, Math.max(1, n));
  renderTimes();
};
$('#sSat').onchange = e => { draft.showSat = e.target.checked; };
$('#sShift').onchange = e => { draft.shiftTimes = e.target.checked; };

function renderTimes() {
  let h = '';
  for (let i = 0; i < draft.periods; i++) {
    const t = draft.times[i];
    h += `<tr><th>${i + 1}限</th>` +
      `<td><input type="time" data-ti="${i}" data-k="start" value="${t.start}"></td><td>〜</td>` +
      `<td><input type="time" data-ti="${i}" data-k="end" value="${t.end}"></td></tr>`;
  }
  $('#sTimes').innerHTML = h;
}

// 時刻を delta 分ずらす（空欄や日付をまたぐ値はそのまま）
function shiftTime(t, k, delta) {
  const v = toMin(t[k]);
  if (v == null) return;
  const n = v + delta;
  if (n >= 0 && n < 24 * 60) t[k] = fromMin(n);
}

$('#sTimes').addEventListener('change', e => {
  const i = e.target.dataset.ti, k = e.target.dataset.k;
  if (i == null) return;
  const t = draft.times[+i];
  const before = toMin(t[k]), after = toMin(e.target.value);
  t[k] = e.target.value;
  if (draft.shiftTimes && before != null && after != null && after !== before) {
    const delta = after - before;
    // 開始を変えたら同じ時限の終了も、さらに後ろの時限も全部ずらす
    if (k === 'start') shiftTime(t, 'end', delta);
    for (let j = +i + 1; j < 10; j++) {
      shiftTime(draft.times[j], 'start', delta);
      shiftTime(draft.times[j], 'end', delta);
    }
    renderTimes();
  }
});

function renderIconPicker() {
  const ic = draft.icon;
  let h = ICON_PRESETS.map(p =>
    `<button class="iconTile ${!ic.useCustom && ic.preset === p.id ? 'sel' : ''}" data-icon="${p.id}">` +
    `<img src="${presetURL(p.id, 112)}" alt=""></button>`).join('');
  if (ic.custom) {
    h += `<button class="iconTile ${ic.useCustom ? 'sel' : ''}" data-icon="custom"><img src="${ic.custom}" alt="自分の画像"></button>`;
  }
  $('#iconPicker').innerHTML = h;
  const url = iconURL(ic);
  $('#iconPreview').src = url;
  $('#iconDl').href = url;
}

$('#iconPicker').addEventListener('click', e => {
  const id = e.target.closest('[data-icon]')?.dataset.icon;
  if (!id) return;
  if (id === 'custom') draft.icon.useCustom = true;
  else { draft.icon.preset = id; draft.icon.useCustom = false; }
  renderIconPicker();
});

$('#iconFile').onchange = async e => {
  const f = e.target.files[0];
  if (!f) return;
  try {
    draft.icon.custom = await cropToSquare(f);
    draft.icon.useCustom = true;
    renderIconPicker();
  } catch {
    alert('画像を読み込めなかった。別の画像で試してみて');
  }
};

function closeSettings() {
  stash();
  if (JSON.stringify(draft) !== snapshot && !confirm('変更を保存せずに閉じる？')) return;
  $('#settingsDlg').close();
}
$('#sX').onclick = closeSettings;
$('#sCancel').onclick = closeSettings;
$('#settingsDlg').addEventListener('cancel', e => { e.preventDefault(); closeSettings(); });

$('#sSave').onclick = () => {
  stash();
  for (let i = 0; i < draft.periods; i++) {
    const s = toMin(draft.times[i].start), en = toMin(draft.times[i].end);
    if (s != null && en != null && s >= en) return alert(`${i + 1}限の終了が開始より前になってるよ`);
  }
  Object.assign(state, draft);
  scheduleChanged();
  $('#settingsDlg').close();
};

/* ===== バックアップ ===== */
$('#exportBtn').onclick = () => {
  const data = { ...state };
  delete data.keys; // APIキーは書き出さない
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `jikanwari-${todayStr()}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};

$('#restoreFile').onchange = async e => {
  const f = e.target.files[0];
  if (!f) return;
  try {
    const obj = JSON.parse(await f.text());
    if (!confirm('今のデータをこのファイルの内容で上書きする？（APIキーはそのまま）')) return;
    const keys = state.keys;
    state = normalize(Array.isArray(obj.terms) ? obj : fromV1(obj));
    state.keys = keys;
    scheduleChanged();
    $('#settingsDlg').close();
    alert('復元したよ');
  } catch {
    alert('ファイルを読み込めなかった');
  } finally {
    e.target.value = '';
  }
};

/* ===== 起動 ===== */
$('#settingsBtn').onclick = openSettings;

state = normalize(readJSON(KEY) || fromV1(readJSON(OLD_KEY)));
scheduleChanged();

setInterval(() => { prune(); renderNow(); renderPack(); }, 30000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) { prune(); renderAll(); }
});
