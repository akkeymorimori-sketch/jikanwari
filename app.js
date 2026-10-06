'use strict';

/* ===== 基本 ===== */
const $ = s => document.querySelector(s);
const DAYS = ['月', '火', '水', '木', '金', '土'];
const WEEK = ['日', '月', '火', '水', '木', '金', '土'];
const KEY = 'jikanwari-v2';
const OLD_KEY = 'jikanwari-v1';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
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

// 旧バージョン（学期なし）のデータを変換
function fromV1(old) {
  const t = { id: uid(), name: defaultTermName(), courses: [] };
  const s = { terms: [t], currentTermId: t.id };
  if (!old) return s;
  t.courses = (old.courses || []).map(c => ({
    ...c,
    items: (c.items || []).filter(i => !i.done)
      .map(i => ({ id: uid(), text: i.text, type: 'next', until: null }))
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
  if (!Array.isArray(s.terms) || !s.terms.length) {
    s.terms = [{ id: uid(), name: defaultTermName(), courses: [] }];
  }
  if (!s.terms.some(t => t.id === s.currentTermId)) s.currentTermId = s.terms[0].id;
  for (const t of s.terms) {
    t.courses ??= [];
    for (const c of t.courses) {
      c.id ??= uid();
      c.name ??= ''; c.teacher ??= ''; c.room ??= '';
      c.items ??= []; c.memos ??= []; c.tasks ??= [];
      for (const i of c.items) { i.id ??= uid(); i.type ??= 'next'; i.until ??= null; }
    }
  }
  return s;
}

const save = () => localStorage.setItem(KEY, JSON.stringify(state));
const term = () => state.terms.find(t => t.id === state.currentTermId);
const courses = () => term().courses;
const modelOf = p => state.models[p] || PROVIDERS[p].model;

/* ===== 時刻の計算 ===== */
function toMin(v) {
  if (!v) return null;
  const [h, m] = v.split(':').map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null;
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
function nextOccurrence(c, from = new Date()) {
  for (let k = 0; k <= 7; k++) {
    const date = addDays(from, k);
    if (dayIndex(date) !== c.day) continue;
    const o = occurrence(c, date);
    if (o && o.start > from) return o;
  }
  return null;
}

const untilFor = c => nextOccurrence(c)?.end.getTime() ?? null;

// 「次回だけ」の消える時刻が未設定のものを埋める
function fillMissingUntil() {
  for (const t of state.terms) for (const c of t.courses) {
    for (const i of c.items) if (i.type === 'next' && i.until == null) i.until = untilFor(c);
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
  const [y, m, d] = due.split('-').map(Number);
  const dd = new Date(y, m - 1, d);
  const diff = dayDiff(dd, new Date());
  if (diff < 0) return { cls: 'over', label: `${md(dd)} 期限切れ` };
  if (diff === 0) return { cls: 'soon', label: '今日まで' };
  if (diff === 1) return { cls: 'soon', label: '明日まで' };
  if (diff <= 3) return { cls: 'soon', label: `${md(dd)}まで（あと${diff}日）` };
  return { cls: '', label: `${md(dd)}まで` };
}

/* ===== 画面：次の授業 ===== */
function upcoming(now) {
  const list = [];
  for (let k = 0; k < 8; k++) {
    const date = addDays(now, k), di = dayIndex(date);
    for (const c of courses()) {
      if (c.day !== di) continue;
      const o = occurrence(c, date);
      if (o && o.end > now) list.push({ c, ...o });
    }
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
  const el = $('#nowCard'), now = new Date();
  if (!courses().length) {
    el.innerHTML = '<h2>次の授業</h2><p class="muted">時間割を登録するとここに出るよ</p>';
    return;
  }
  const list = upcoming(now);
  const cur = list.filter(x => x.start <= now);
  const first = list.find(x => x.start > now);
  const nxt = first ? list.filter(x => +x.start === +first.start) : [];
  let h = '';
  if (cur.length) {
    const c = cur[0].c;
    h += `<h2>今の授業 <small>${DAYS[c.day]}${c.period}・あと${fmtLeft(cur[0].end - now)}で終わり</small></h2>` +
      cur.map(courseLine).join('');
  }
  if (nxt.length) {
    const c = nxt[0].c;
    h += `<h2>次の授業 <small>${DAYS[c.day]}${c.period}・${whenLabel(nxt[0].start, now)}</small></h2>` +
      nxt.map(courseLine).join('');
  }
  el.innerHTML = h || '<h2>次の授業</h2><p class="muted">設定で各時限の時刻を入れると表示されるよ</p>';
}

/* ===== 画面：明日の持ち物 ===== */
let packList = [], packKey = '';

function packTarget(now) {
  for (let k = 1; k <= 7; k++) {
    const date = addDays(now, k);
    const cs = courses().filter(c => c.day === dayIndex(date)).sort((a, b) => a.period - b.period);
    if (cs.length) return { date, k, cs };
  }
  return null;
}

function renderPack() {
  const el = $('#packCard'), t = packTarget(new Date());
  if (!t) {
    el.innerHTML = '<h2>明日の持ち物</h2><p class="muted">授業がまだ登録されてないよ</p>';
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
  const title = t.k === 1 ? `明日 ${md(t.date)}` : md(t.date);
  const names = t.cs.map(c => `${c.period}限 ${esc(c.name)}`).join('／');

  el.innerHTML =
    `<h2>${title}の持ち物 <small>${packList.length ? `${done}/${packList.length}` : ''}</small></h2>` +
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
  const today = dayIndex(new Date());
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
    const c = cur();
    c[key] = +e.target.value;
    for (const i of c.items) if (i.type === 'next') i.until = untilFor(c);
    save(); renderDetail(); renderAll();
  });
}

// 持ち物
$('#itemAdd').onclick = () => {
  const v = $('#itemInput').value.trim();
  if (!v) return;
  const c = cur(), type = $('#itemType').value;
  c.items.push({ id: uid(), text: v, type, until: type === 'next' ? untilFor(c) : null });
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

function fileToJpegBase64(file, max = 1568) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const cv = document.createElement('canvas');
      cv.width = Math.round(img.width * s);
      cv.height = Math.round(img.height * s);
      const ctx = cv.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.drawImage(img, 0, 0, cv.width, cv.height);
      URL.revokeObjectURL(img.src);
      res(cv.toDataURL('image/jpeg', 0.9).split(',')[1]);
    };
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
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
    const c = {
      id: uid(), ...r,
      items: prev ? structuredClone(prev.items) : [],
      memos: prev ? structuredClone(prev.memos) : [],
      tasks: prev ? structuredClone(prev.tasks) : []
    };
    for (const i of c.items) if (i.type === 'next') i.until = untilFor(c);
    return c;
  });
  term().courses = replace ? added : old.concat(added);
  state.periods = Math.max(state.periods, ...rows.map(r => r.period));
  if (rows.some(r => r.day === 5)) state.showSat = true;
  save(); renderAll(); $('#importDlg').close();
}
$('#applyReplace').onclick = () => applyImport(true);
$('#applyAdd').onclick = () => applyImport(false);

/* ===== 学期の管理 ===== */
function renderTermList() {
  $('#termList').innerHTML = state.terms.map(t =>
    `<li><input data-rename="${t.id}" value="${esc(t.name)}">` +
    (t.id === state.currentTermId ? '<span class="tag">表示中</span>' : '') +
    `<span class="from">${t.courses.length}件</span>` +
    `<button class="x" data-termdel="${t.id}">削除</button></li>`).join('');
}

$('#termBtn').onclick = () => {
  renderTermList();
  $('#newTermName').value = nextTermName(term().name);
  $('#newTermCopy').checked = false;
  $('#termDlg').showModal();
};
$('#termClose').onclick = () => $('#termDlg').close();

$('#termList').addEventListener('input', e => {
  const id = e.target.dataset.rename;
  if (!id) return;
  state.terms.find(t => t.id === id).name = e.target.value;
  save(); renderTermSelect();
});
$('#termList').addEventListener('click', e => {
  const id = e.target.dataset.termdel;
  if (!id) return;
  if (state.terms.length === 1) return alert('学期は最低1つ必要だよ');
  const t = state.terms.find(x => x.id === id);
  if (!confirm(`「${t.name}」を削除する？授業・メモ・課題も全部消えるよ`)) return;
  state.terms = state.terms.filter(x => x.id !== id);
  if (state.currentTermId === id) state.currentTermId = state.terms[0].id;
  save(); renderTermList(); renderAll();
});

$('#termCreate').onclick = () => {
  const name = $('#newTermName').value.trim() || defaultTermName();
  const copy = $('#newTermCopy').checked;
  const t = {
    id: uid(), name,
    courses: copy ? courses().map(c => ({
      id: uid(), day: c.day, period: c.period, name: c.name, teacher: c.teacher, room: c.room,
      items: c.items.filter(i => i.type === 'always').map(i => ({ ...i, id: uid() })),
      memos: [], tasks: []
    })) : []
  };
  state.terms.push(t);
  state.currentTermId = t.id;
  save(); renderAll(); $('#termDlg').close();
};

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

$('#settingsBtn').onclick = () => {
  tmp = {
    provider: state.provider,
    keys: { ...state.keys },
    models: { ...state.models },
    times: structuredClone(state.times)
  };
  fillProviderFields(state.provider);
  $('#sPeriods').value = state.periods;
  $('#sSat').checked = state.showSat;
  renderTimes(state.periods);
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
  state.periods = clampPeriods($('#sPeriods').value);
  state.showSat = $('#sSat').checked;
  fillMissingUntil();
  save(); renderAll(); $('#settingsDlg').close();
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
    fillMissingUntil(); prune(); save(); renderAll();
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
fillMissingUntil();
prune();
save();
renderAll();

function tick() { prune(); renderAll(); }
setInterval(tick, 30000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
