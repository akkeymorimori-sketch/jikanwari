// 時間割の共有リンク（s.html?c=GK-XXXXXXXX）：アプリがなくても、届いた時間割を見て、自分と空きコマを比べる。
// 中身はアプリと同じ Firestore の shares/{8文字}（30日で消える）を匿名ログインで1件だけ読む。
// 自分のコマはこのブラウザの中だけ（localStorage）。サーバーには何も書かない。
// テストでは window.svFirebase(code) を先に置いておくと、Firebase の代わりにそれを使う（z の文字列を返す）
(() => {
  const FB_VER = '13.0.0';
  const FB_CONFIG = {
    apiKey: 'AIzaSyC_6pfg-scXIoqwJ5g-RdCuohEzudiLitM',
    authDomain: 'gakulog-39fb5.firebaseapp.com',
    projectId: 'gakulog-39fb5',
    storageBucket: 'gakulog-39fb5.firebasestorage.app',
    messagingSenderId: '543768102440',
    appId: '1:543768102440:web:f968e065445a54de1a571d'
  };
  const DAYS = ['月', '火', '水', '木', '金', '土'];
  const MINE_KEY = 'gakulog-sv-mine'; // 手で入れた自分のコマ ["0-1", "2-3", …]
  const APP_KEY = 'jikanwari-v2'; // Web 版のデータ（同じ場所に置いてあるので読める）
  const $ = s => document.querySelector(s);

  const raw = new URLSearchParams(location.search).get('c') || '';
  const m = raw.replace(/\s+/g, '').match(/^(?:GK-?)?([A-HJ-NP-Z2-9]{8})$/i);
  const code = m ? m[1].toUpperCase() : '';
  if (code) {
    $('#svWebLink').href = './?c=GK-' + code;
    $('#svAppLink').href = 'gakulog://share?c=GK-' + code;
  }

  // ---- 読む ----
  const unb64u = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), ch => ch.charCodeAt(0));
  async function unpack(z) {
    const mm = String(z || '').match(/^([zp])\.([A-Za-z0-9_-]+)$/);
    if (!mm) throw new Error('bad');
    const bytes = unb64u(mm[2]);
    if (mm[1] === 'p') return new TextDecoder().decode(bytes);
    if (typeof DecompressionStream !== 'function') throw new Error('old');
    const st = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return await new Response(st).text();
  }
  async function fbGet(c) {
    if (typeof window.svFirebase === 'function') return window.svFirebase(c);
    const base = `https://www.gstatic.com/firebasejs/${FB_VER}/`;
    const [{ initializeApp }, A, F] = await Promise.all([
      import(base + 'firebase-app.js'), import(base + 'firebase-auth.js'), import(base + 'firebase-firestore.js')
    ]);
    const app = initializeApp(FB_CONFIG);
    // Web 版と同じ保存先なので、Web 版を使ってる人は同じ匿名アカウントのまま（新しく増えない）
    const auth = A.initializeAuth(app, { persistence: A.indexedDBLocalPersistence });
    await auth.authStateReady();
    if (!auth.currentUser) await A.signInAnonymously(auth);
    let snap;
    try { snap = await F.getDoc(F.doc(F.getFirestore(app), 'shares', c)); }
    catch (err) { if (String(err?.code).includes('permission-denied')) throw new Error('gone'); throw err; }
    if (!snap.exists()) throw new Error('gone');
    return snap.data().z;
  }
  // アプリの parseShare と同じ範囲だけ受け取る（ここで使うものだけ）
  function parse(d) {
    if (!d || d.v !== 1 || !Array.isArray(d.c)) throw new Error('bad');
    const str = (v, n = 300) => typeof v === 'string' ? v.slice(0, n) : '';
    const okP = v => Number.isInteger(v) && v >= 1 && v <= 10;
    const courses = d.c.slice(0, 200).filter(Array.isArray).map(([day, period, name, short, teacher, room, , , , , , periodEnd]) => {
      const p = okP(period) ? period : 1;
      return {
        day: Number.isInteger(day) && day >= -1 && day <= 5 ? day : 0, period: p,
        end: okP(periodEnd) && periodEnd >= p ? periodEnd : p,
        name: str(name).trim(), short: str(short).trim(), teacher: str(teacher, 60).trim(), room: str(room, 60).trim()
      };
    }).filter(c => c.name);
    if (!courses.length) throw new Error('bad');
    const hhmm = v => typeof v === 'string' && /^\d{2}:\d{2}$/.test(v) ? v : '';
    return {
      name: str(d.name, 40).trim(),
      periods: Number.isInteger(d.p) && d.p >= 1 && d.p <= 10 ? d.p : 5,
      times: Array.isArray(d.times) ? d.times.slice(0, 10).map(x => hhmm(x?.[0])) : [],
      courses
    };
  }
  const busyOf = cs => {
    const s = new Map();
    for (const c of cs) if (c.day >= 0) for (let p = c.period; p <= c.end; p++) if (!s.has(c.day + '-' + p)) s.set(c.day + '-' + p, c);
    return s;
  };

  // ---- 自分の時間割 ----
  function appCourses() {
    try {
      const st = JSON.parse(localStorage.getItem(APP_KEY));
      const t = st?.terms?.find(x => x.id === st.currentTermId) || st?.terms?.[0];
      return (t?.courses || []).filter(c => typeof c?.name === 'string' && c.name.trim() && Number.isInteger(c.day) && c.day >= 0 && c.day <= 5
        && Number.isInteger(c.period) && c.period >= 1 && c.period <= 10)
        .map(c => ({ day: c.day, period: c.period, end: Number.isInteger(c.periodEnd) && c.periodEnd >= c.period && c.periodEnd <= 10 ? c.periodEnd : c.period }));
    } catch { return []; }
  }
  const okKey = k => typeof k === 'string' && /^[0-5]-([1-9]|10)$/.test(k);
  let mine = new Set();
  try { mine = new Set((JSON.parse(localStorage.getItem(MINE_KEY)) || []).filter(okKey)); } catch {}
  const saveMine = () => { try { localStorage.setItem(MINE_KEY, JSON.stringify([...mine])); } catch {} };

  // ---- 表示 ----
  let data = null, theirs = new Map(), comparing = false;
  const msg = (t, retry = false) => { $('#svMsg').textContent = t; $('#svRetry').hidden = !retry; };

  function render() {
    const sat = data.courses.some(c => c.day === 5) || [...mine].some(k => k.startsWith('5-'));
    const days = sat ? 6 : 5;
    const maxP = Math.max(data.periods, ...data.courses.filter(c => c.day >= 0).map(c => c.end), ...[...mine].map(k => +k.split('-')[1]));
    const tbl = $('#svGrid');
    tbl.textContent = '';
    tbl.classList.toggle('cmp', comparing);
    const head = tbl.insertRow();
    head.append(document.createElement('th'));
    for (let d = 0; d < days; d++) { const th = document.createElement('th'); th.textContent = DAYS[d]; head.append(th); }
    const free = [];
    for (let p = 1; p <= maxP; p++) {
      const tr = tbl.insertRow();
      const th = document.createElement('th');
      th.className = 'svP';
      th.textContent = p;
      if (data.times[p - 1]) { const sm = document.createElement('small'); sm.textContent = data.times[p - 1]; th.append(sm); }
      tr.append(th);
      for (let d = 0; d < days; d++) {
        const k = d + '-' + p, c = theirs.get(k), me = mine.has(k);
        const td = tr.insertCell();
        const label = c ? (c.short || c.name) : '';
        if (!comparing) {
          td.className = c ? 'busy' : 'free';
          td.textContent = label;
          if (c) td.title = c.name;
          continue;
        }
        const both = !c && !me;
        if (both) free.push(k);
        td.className = both ? 'both' : [c && 'busy', me && 'mine'].filter(Boolean).join(' '); // 両方授業なら斜めに2色
        const b = document.createElement('button');
        b.type = 'button'; b.dataset.k = k;
        b.setAttribute('aria-pressed', String(me));
        b.setAttribute('aria-label', `${DAYS[d]}曜${p}限：${c ? '友だちは' + c.name : '友だちは空き'}、自分は${me ? '授業あり' : '空き'}`);
        if (label) { const s = document.createElement('span'); s.className = 'them'; s.textContent = label; b.append(s); }
        if (me) { const s = document.createElement('span'); s.className = 'me'; s.textContent = '自分'; b.append(s); }
        if (both) { const s = document.createElement('span'); s.className = 'ok'; s.textContent = '空き'; b.append(s); }
        td.append(b);
      }
    }
    $('#svLegend').hidden = false;
    $('#svLegend').textContent = comparing
      ? '緑の点線のコマが、2人とも空き。タップすると「自分の授業あり／なし」が切り替わるよ'
      : '色のついたコマが友だちの授業。授業名は略称で出しているよ';
    // 一覧は出さない（表で見ればわかる）。読み上げ用に、表の名前で数だけ伝える
    tbl.setAttribute('aria-label', comparing ? `2人とも空いてるコマは${free.length}コマ` : '友だちの時間割');
  }

  function renderExtra() {
    const box = $('#svExtra');
    box.textContent = '';
    const intensive = data.courses.filter(c => c.day < 0);
    if (intensive.length) {
      const p = document.createElement('p');
      p.className = 'svNote';
      p.textContent = '集中講義：' + intensive.map(c => c.name).join('、');
      box.append(p);
    }
    // 先生・教室は、送った人が「入れる」を選んだときだけ届く
    const withInfo = data.courses.filter(c => c.teacher || c.room);
    if (withInfo.length) {
      const det = document.createElement('details');
      det.className = 'svList';
      const sum = document.createElement('summary');
      sum.textContent = '授業の一覧（先生・教室）';
      const ul = document.createElement('ul');
      for (const c of data.courses.filter(c => c.day >= 0).sort((a, b) => a.day - b.day || a.period - b.period)) {
        const li = document.createElement('li');
        const b = document.createElement('b'); b.textContent = `${DAYS[c.day]}${c.period}${c.end > c.period ? '〜' + c.end : ''}　${c.name}`;
        li.append(b);
        if (c.teacher || c.room) { const s = document.createElement('span'); s.textContent = [c.teacher, c.room].filter(Boolean).join('・'); li.append(s); }
        ul.append(li);
      }
      det.append(sum, ul);
      box.append(det);
    }
    const go = document.createElement('button');
    go.type = 'button'; go.className = 'svBtn svMain'; go.id = 'svStart';
    go.textContent = '自分と空きコマを比べる';
    go.onclick = startCompare;
    box.append(go);
  }

  function startCompare() {
    comparing = true;
    $('#svStart')?.remove();
    $('#svCompare').hidden = false;
    // Web 版のデータがあって、まだ自分のコマを入れてなければ、それを使う
    if (!mine.size && appCourses().length) useApp(false);
    render();
    $('#svGridWrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function useApp(draw = true) {
    mine = new Set([...busyOf(appCourses()).keys()]);
    saveMine();
    if (draw) render();
  }

  $('#svGrid').addEventListener('click', e => {
    const b = e.target.closest('button[data-k]');
    if (!b || !comparing) return;
    const k = b.dataset.k;
    if (mine.has(k)) mine.delete(k); else mine.add(k);
    saveMine(); render();
    $(`#svGrid button[data-k="${k}"]`)?.focus();
  });
  $('#svUseMine').onclick = () => useApp();
  $('#svUseMine').hidden = !appCourses().length;
  $('#svClear').onclick = () => { mine.clear(); saveMine(); render(); };
  $('#svRetry').onclick = () => load();

  async function load() {
    if (!code) {
      $('#svTitle').textContent = 'リンクが途中で切れてるみたい';
      return msg('送ってもらったメッセージのリンクを、最後まで丸ごと開いてね。');
    }
    msg('');
    $('#svTitle').textContent = '時間割を読んでるよ…';
    try {
      data = parse(JSON.parse(await unpack(await fbGet(code))));
    } catch (err) {
      const e = err?.message;
      const c = String(err?.code || '');
      $('#svTitle').textContent = '時間割を開けなかった';
      if (e === 'gone') return msg('このリンクは期限（30日）が切れてるか、見つからなかったよ。送ってくれた人に、もう一回送ってもらってね。');
      if (e === 'old') return msg('このブラウザだと読めなかった。iPhone なら iOS を新しくするか、ほかのブラウザで開いてみてね。');
      if (e === 'bad' || err instanceof SyntaxError) return msg('時間割のデータが壊れてるみたい。もう一回送ってもらってね。');
      if (c.includes('too-many-requests')) return msg('いま混んでるみたい。少し時間をおいて、もう一度開いてね。', true);
      return msg('読めなかった。電波のいいところで、もう一度試してね。', true);
    }
    theirs = busyOf(data.courses);
    $('#svTitle').textContent = '友だちの時間割が届いたよ';
    $('#svSub').textContent = `${data.name || '時間割'}・授業${data.courses.length}件`;
    $('#svGridWrap').hidden = false;
    renderExtra();
    render();
  }
  window.svState = () => ({ code, data, mine: [...mine], comparing }); // テスト用
  load();
})();
