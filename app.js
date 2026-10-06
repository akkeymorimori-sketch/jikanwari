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
const DEFAULT_APP_NAME = '時間割メモ';

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
  s.appName = (s.appName || '').trim() || DEFAULT_APP_NAME;
  if (!Array.isArray(s.terms) || !s.terms.length) s.terms = [newTerm(defaultTermName())];
  if (!s.terms.some(t => t.id === s.currentTermId)) s.currentTermId = s.terms[0].id;
  for (const t of s.terms) {
    t.start ??= '';
    t.end ??= '';
    t.offDays ??= [];
    t.swaps ??= [];
    t.courses ??= [];
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

function showRows(arr) {
  const dayOpts = sel => DAYS.map((d, i) => `<option value="${i}" ${i === sel ? 'selected' : ''}>${d}</option>`).join('');
  $('#ocrResult').innerHTML =
    '<table><tr><td>曜</td><td>限</td><td>授業名</td><td>教員</td><td>教室</td><td>除外</td></tr>' +
    arr.map(c => {
      const d = Math.max(0, DAYS.indexOf(c.day));
      return `<tr class="r"><td><select class="d">${dayOpts(d)}</select></td>` +
        `<td><input class="p" type="number" min="1" max="10" value="${+c.period || 1}" style="width:42px"></td>` +
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
  if (replace && !confirm(`「${term().name}」の時間割を置き換える？（同じ名前の授業のメモ・持ち物・課題は引き継ぐ）`)) return;

  const old = courses();
  const added = rows.map(r => {
    const prev = old.find(c => c.name === r.name);
    return {
      id: uid(), ...r,
      items: prev ? structuredClone(prev.items) : [],
      memos: prev ? structuredClone(prev.memos) : [],
      tasks: prev ? structuredClone(prev.tasks) : []
    };
  });
  term().courses = replace ? added : old.concat(added);
  state.periods = Math.max(state.periods, ...rows.map(r => r.period));
  if (rows.some(r => r.day === 5)) state.showSat = true;
  scheduleChanged();
  $('#importDlg').close();
}
$('#applyReplace').onclick = () => applyImport(true);
$('#applyAdd').onclick = () => applyImport(false);

/* ===== 学期・休み ===== */
$('#swapDay').innerHTML = DAYS.map((d, i) => `<option value="${i}">${d}曜</option>`).join('');

function renderTermList() {
  $('#termList').innerHTML = state.terms.map(t =>
    `<li><div class="termBox">` +
      `<div class="row"><input data-rename="${t.id}" value="${esc(t.name)}">` +
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
    `<li><span>${esc(offLabel(o))}</span><button class="x" data-offdel="${o.id}">×</button></li>`).join('')
    || '<li class="muted">なし</li>';
  $('#swapList').innerHTML = t.swaps.slice().sort((a, b) => a.date.localeCompare(b.date)).map(x =>
    `<li><span>${md(parseYmd(x.date))} は${DAYS[x.asDay]}曜の授業</span>` +
    `<button class="x" data-swapdel="${x.id}">×</button></li>`).join('')
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
  if (tstart) t.start = e.target.value;
  else t.end = e.target.value;
  if (t.start && t.end && t.end < t.start) alert('終了日が開始日より前になってるよ');
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
  const copied = $('#newTermCopy').checked ? courses().map(c => ({
    id: uid(), day: c.day, period: c.period, name: c.name, teacher: c.teacher, room: c.room,
    items: c.items.filter(i => i.type === 'always').map(i => ({ ...i, id: uid() })),
    memos: [], tasks: []
  })) : [];
  const t = newTerm(name, start, end, copied);
  state.terms.push(t);
  state.currentTermId = t.id;
  save(); renderAll(); $('#termDlg').close();
};

/* ===== アイコン ===== */
function fillRound(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}

function drawPreset(ctx, p, s) {
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, s, s);
  if (p.kind === 'grid') {
    const m = s * 0.18, w = s - m * 2, gap = w * 0.06, headH = w * 0.16, r = s * 0.03;
    const cw = (w - gap * 2) / 3, ch = (w - headH - gap * 3) / 3;
    ctx.fillStyle = '#fff';
    fillRound(ctx, m, m, w, headH, r);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      ctx.fillStyle = i === 1 && j === 2 ? p.accent : 'rgba(255,255,255,0.82)';
      fillRound(ctx, m + j * (cw + gap), m + headH + gap + i * (ch + gap), cw, ch, r);
    }
  } else {
    const fs = s * (p.text.length === 1 ? 0.56 : 0.34);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${fs}px "Hiragino Sans", "Noto Sans JP", system-ui, sans-serif`;
    ctx.fillText(p.text, s / 2, s / 2 + fs * 0.04);
  }
}

const presetById = id => ICON_PRESETS.find(p => p.id === id) || ICON_PRESETS[0];

function presetURL(p, size) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  drawPreset(cv.getContext('2d'), p, size);
  return cv.toDataURL('image/png');
}

async function iconURL(icon, size) {
  if (!icon.useCustom || !icon.custom) return presetURL(presetById(icon.preset), size);
  const img = await loadImg(icon.custom);
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  cv.getContext('2d').drawImage(img, 0, 0, size, size);
  return cv.toDataURL('image/png');
}

// 自分の画像を正方形に切り抜いて512pxにする
async function cropToSquare(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImg(url);
    const side = Math.min(img.width, img.height);
    const sx = (img.width - side) / 2, sy = (img.height - side) / 2;
    const cv = document.createElement('canvas');
    cv.width = cv.height = 512;
    const ctx = cv.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 512, 512);
    ctx.drawImage(img, sx, sy, side, side, 0, 0, 512, 512);
    return cv.toDataURL('image/jpeg', 0.9);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function ensureLink(rel) {
  let l = document.head.querySelector(`link[rel="${rel}"]`);
  if (!l) {
    l = document.createElement('link');
    l.rel = rel;
    document.head.appendChild(l);
  }
  return l;
}
function ensureMeta(name) {
  let m = document.head.querySelector(`meta[name="${name}"]`);
  if (!m) {
    m = document.createElement('meta');
    m.name = name;
    document.head.appendChild(m);
  }
  return m;
}

// ホーム画面用のアイコン・名前をページに反映
async function applyIcon() {
  try {
    const [i180, i192, i512] = await Promise.all([180, 192, 512].map(s => iconURL(state.icon, s)));
    ensureLink('apple-touch-icon').href = i180;
    ensureLink('icon').href = i192;
    ensureMeta('apple-mobile-web-app-title').content = state.appName;
    document.title = state.appName;
    $('#appTitle').textContent = state.appName;

    const base = location.href.split(/[?#]/)[0];
    const manifest = {
      name: state.appName,
      short_name: state.appName,
      start_url: base,
      scope: base.replace(/[^/]*$/, ''),
      display: 'standalone',
      background_color: '#f4f5f7',
      theme_color: '#2f6fde',
      icons: [
        { src: i192, sizes: '192x192', type: 'image/png' },
        { src: i512, sizes: '512x512', type: 'image/png' }
      ]
    };
    ensureLink('manifest').href = 'data:application/manifest+json,' + encodeURIComponent(JSON.stringify(manifest));
  } catch (err) {
    console.warn('アイコンの反映に失敗', err);
  }
}

/* ===== 設定 ===== */
let tmp = null; // 保存を押すまでの一時データ

$('#sProvider').innerHTML = Object.entries(PROVIDERS)
  .map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('');

function fillProviderFields(p) {
  tmp.provider = p;
  $('#sProvider').value = p;
  $('#sKey').value = tmp.keys[p] || '';
  $('#sModel').value = tmp.models[p] || PROVIDERS[p].model;
  $('#sKeyLink').href = PROVIDERS[p].keyUrl;
  $('#sNote').textContent = PROVIDERS[p].note;
}
function stashProviderFields() {
  tmp.keys[tmp.provider] = $('#sKey').value.trim();
  tmp.models[tmp.provider] = $('#sModel').value.trim();
}
function renderTimes(n) {
  $('#sTimes').innerHTML = Array.from({ length: n }, (_, i) =>
    `<tr data-p="${i + 1}"><td>${i + 1}限</td>` +
    `<td><input type="time" class="ts" value="${esc(tmp.times[i].start)}"></td><td>〜</td>` +
    `<td><input type="time" class="te" value="${esc(tmp.times[i].end)}"></td></tr>`).join('');
}
function stashTimes() {
  document.querySelectorAll('#sTimes tr[data-p]').forEach(tr => {
    tmp.times[+tr.dataset.p - 1] = { start: tr.querySelector('.ts').value, end: tr.querySelector('.te').value };
  });
}
const clampPeriods = v => Math.min(10, Math.max(1, +v || 7));

function renderIconPicker() {
  const sel = tmp.icon.useCustom && tmp.icon.custom ? 'custom' : 'p:' + tmp.icon.preset;
  const opts = ICON_PRESETS.map(p => ({ key: 'p:' + p.id, src: presetURL(p, 96) }));
  if (tmp.icon.custom) opts.push({ key: 'custom', src: tmp.icon.custom });
  $('#iconPicker').innerHTML = opts.map(o =>
    `<button type="button" class="iconOpt ${o.key === sel ? 'sel' : ''}" data-icon="${o.key}">` +
    `<img src="${o.src}" alt=""></button>`).join('');
}

$('#iconPicker').addEventListener('click', e => {
  const key = e.target.closest('[data-icon]')?.dataset.icon;
  if (!key) return;
  if (key === 'custom') tmp.icon.useCustom = true;
  else { tmp.icon.useCustom = false; tmp.icon.preset = key.slice(2); }
  renderIconPicker();
});

$('#iconFile').onchange = async e => {
  const f = e.target.files[0];
  if (!f) return;
  try {
    tmp.icon.custom = await cropToSquare(f);
    tmp.icon.useCustom = true;
    renderIconPicker();
  } catch {
    alert('画像が読めなかった');
  } finally {
    e.target.value = '';
  }
};

$('#settingsBtn').onclick = () => {
  tmp = {
    provider: state.provider,
    keys: { ...state.keys },
    models: { ...state.models },
    times: structuredClone(state.times),
    icon: { ...state.icon }
  };
  fillProviderFields(state.provider);
  $('#sPeriods').value = state.periods;
  $('#sSat').checked = state.showSat;
  $('#sAppName').value = state.appName;
  renderTimes(state.periods);
  renderIconPicker();
  $('#settingsDlg').showModal();
};
$('#sProvider').onchange = e => { stashProviderFields(); fillProviderFields(e.target.value); };
$('#sPeriods').addEventListener('input', e => { stashTimes(); renderTimes(clampPeriods(e.target.value)); });

$('#sSave').onclick = () => {
  stashProviderFields();
  stashTimes();
  state.provider = tmp.provider;
  state.keys = tmp.keys;
  state.models = tmp.models;
  state.times = tmp.times;
  state.icon = tmp.icon;
  state.appName = $('#sAppName').value.trim() || DEFAULT_APP_NAME;
  state.periods = clampPeriods($('#sPeriods').value);
  state.showSat = $('#sSat').checked;
  scheduleChanged();
  applyIcon();
  $('#settingsDlg').close();
};

$('#exportBtn').onclick = () => {
  const { keys, ...rest } = state; // キーは書き出さない
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(rest, null, 2)], { type: 'application/json' }));
  a.download = `jikanwari-${todayStr()}.json`;
  a.click();
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
    applyIcon();
    $('#settingsDlg').close();
    alert('復元したよ');
  } catch {
    alert('ファイルが読めなかった');
  } finally {
    e.target.value = '';
  }
};

/* ===== 起動 ===== */
state = normalize(readJSON(KEY) || fromV1(readJSON(OLD_KEY)));
recomputeUntil();
prune();
save();
renderAll();
applyIcon();

function tick() { prune(); renderAll(); }
setInterval(tick, 30000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
