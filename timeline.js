/* カレンダーの「時間軸」：3・5・7日ずつ（選べる）、縦に時間・横に日付。アラーム（鳴らせる端末でオンのとき）も時刻の位置に線で出す。上下はスクロール、左右は日数ずつめくる。日付と終日の帯（上）と時刻（左）は動かない。
   表示だけで保存しない（授業を出すかどうかはこの端末にだけ覚える）。 */
(() => {
  const H = 48;            // 1時間の高さ（px）
  const AXIS = 40;         // 左の時刻の列の幅
  const DAY_CHOICES = [3, 5, 7];   // 一度に見る日数
  const PREF = 'gakulog-timeline-v1';
  let pref = { classes: true, days: 3 };
  try { pref = { ...pref, ...JSON.parse(localStorage.getItem(PREF) || '{}') }; } catch { }
  const days = () => DAY_CHOICES.includes(+pref.days) ? +pref.days : 3;
  const savePref = () => { try { localStorage.setItem(PREF, JSON.stringify(pref)); } catch { } };

  const panel = document.createElement('section');
  panel.id = 'tlPanel'; panel.hidden = true; panel.setAttribute('aria-label', '時間軸');
  panel.innerHTML =
    '<div class="tlTools"><button type="button" id="tlToday">今日</button>' +
    '<button type="button" id="tlPrev" class="tlNav" aria-label="前の日へ">‹</button><b id="tlTitle"></b><button type="button" id="tlNext" class="tlNav" aria-label="次の日へ">›</button>' +
    `<select id="tlDays" aria-label="一度に見る日数">${DAY_CHOICES.map(n => `<option value="${n}">${n}日</option>`).join('')}</select>` +
    '<label class="inline"><input type="checkbox" id="tlClasses" aria-label="授業も表示">授業</label>' +
    '<button type="button" id="tlFull" class="tlNav" data-ico="expand" aria-label="全画面で見る"></button></div>' +
    '<div id="tlScroll"><div id="tlGrid"></div></div>';
  $('#view-cal').append(panel);
  const box = $('#tlScroll'), grid = $('#tlGrid');

  // first = 今見ている左端の日。横の位置はスクロール（scrollLeft）に持たせない：iPhone は縦にスクロールしている間に
  // 横の位置を0に戻すことがあって、そのせいで日付が1年前まで飛んでいた。前・今・次の3ページ分だけ描いて、横は列をずらしてめくる
  let first = '', on = false, allOpen = false, items = [];
  const dayKey = i => ymd(addDays(parseYmd(first), i));          // 0 = 左端の日
  const colKey = i => dayKey(i - days());                         // 描く列（前のページから）
  // 左端にする日：7日のときは週のはじまり（カレンダーの設定の月曜／日曜）にそろえて「今週→来週」とめくれるように。3・5日はその日から
  const anchor = k => {
    if (days() !== 7) return k;
    const d = parseYmd(k), back = state.weekStart === 'sun' ? d.getDay() : (d.getDay() + 6) % 7;
    return ymd(addDays(d, -back));
  };
  const colW = () => Math.max(30, (box.clientWidth - AXIS) / days());
  const md = k => `${+k.slice(5, 7)}/${+k.slice(8, 10)}`;
  const toM = v => { const m = toMin(v); return m == null ? null : m; };
  const clock2 = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;

  // その日の中身：時刻のある予定・授業（ブロック）と、時刻のないもの（終日の帯）
  function dayData(k) {
    const date = parseYmd(k), t = term(), blocks = [], chips = [];
    const add = (o, list) => { o.i = items.length; o.col = k; items.push(o); list.push(o); };
    for (const e of calEvents(k)) {
      const s = toM(e.start);
      if (s == null) { add({ type: 'event', k, e, label: e.title || EV_LABEL[e.kind] || '予定', cls: `ev ${e.kind}${e.gid ? ' shared' : ''}` }, chips); continue; }
      let end = toM(e.end);
      if (end == null) end = Math.min(24 * 60, s + 60);
      else if (end <= s) end = 24 * 60; // 日をまたぐ予定は、その日の終わりまで（続きは次の日）
      add({ type: 'event', k, e, s, end, label: e.title || EV_LABEL[e.kind] || '予定', time: evTime(e), place: placeOf(e.memo), cls: `ev ${e.kind}${e.gid ? ' shared' : ''}` }, blocks);
    }
    // 前の日から続いている予定（例：22:00〜翌2:00）
    const prev = ymd(addDays(date, -1));
    for (const e of calEvents(prev)) {
      const s = toM(e.start), end = toM(e.end);
      if (s == null || end == null || end > s || end === 0) continue;
      add({ type: 'event', k: prev, e, s: 0, end, label: e.title || EV_LABEL[e.kind] || '予定', time: `（前の日から）〜${e.end}`, cls: `ev ${e.kind}${e.gid ? ' shared' : ''}` }, blocks);
    }
    for (const { c, x } of calTasks(k)) if (!x.done) add({ type: 'task', k, c, x, label: `締切 ${x.title}`, cls: 'ev task' }, chips);
    if (state.useGrid && featOn('grid')) {
      const off = inTerm(date, t) ? offInfo(date, t) : null;
      if (off) add({ type: 'off', k, label: off.note || '休み', cls: 'ev off' }, chips);
      for (const c of intensiveOn(k)) add({ type: 'class', k, c, label: nm(c) || '集中講義', cls: 'ev int' }, chips);
      if (pref.classes) {
        const at = new Set(attendOn(date));
        for (const c of coursesOn(date)) {
          const o = at.has(c) && occurrence(c, date);
          // 上の帯は1行に収めるので名前だけ。オンデマ・時刻なしは点線の枠で見分ける（読み上げには付ける）
          if (!o) { add({ type: 'class', k, c, label: nm(c), aria: `${nm(c)}（${at.has(c) ? '時刻なし' : 'オンデマンド'}）`, cls: 'tlClassChip' }, chips); continue; }
          const s = o.start.getHours() * 60 + o.start.getMinutes(), end = o.end.getHours() * 60 + o.end.getMinutes();
          add({ type: 'class', k, c, s, end: Math.max(end, s + 15), label: nm(c), time: `${periodLabel(c)}限`, place: c.room, cls: 'tlClass' }, blocks);
        }
      }
    }
    return { blocks: lanes(blocks), chips };
  }

  // 重なったブロックは横に並べる（重なりのかたまりごとに、列の数で幅を割る）
  function lanes(list) {
    list.sort((a, b) => a.s - b.s || b.end - a.end);
    let group = [], ends = [], groupEnd = -1;
    const close = () => { for (const o of group) o.n = ends.length; group = []; ends = []; };
    for (const o of list) {
      if (o.s >= groupEnd) { close(); groupEnd = -1; }
      let lane = ends.findIndex(x => x <= o.s);
      if (lane < 0) { lane = ends.length; ends.push(0); }
      ends[lane] = o.end; o.lane = lane; group.push(o);
      groupEnd = Math.max(groupEnd, o.end);
    }
    close();
    return list;
  }

  function render() {
    if (!on) return;
    if (!first) first = anchor(todayStr());
    fit();
    items = [];
    const today = todayStr(), now = new Date(), nowM = now.getHours() * 60 + now.getMinutes();
    const W = colW(), n = days();
    // アラーム（日付ごと）
    const alarms = new Map();
    for (const x of window.alTimeline?.() || []) {
      const d = new Date(x.at), k = ymd(d);
      if (!alarms.has(k)) alarms.set(k, []);
      alarms.get(k).push({ m: d.getHours() * 60 + d.getMinutes(), title: x.title });
    }
    grid.style.setProperty('--tl-w', `${W}px`);
    let head = '', body = '';
    let axis = '<div class="tlAxis">';
    for (let h = 1; h < 24; h++) axis += `<span style="top:${h * H}px">${h}:00</span>`;
    axis += '</div>';
    for (let i = 0; i < n * 3; i++) {
      const k = colKey(i), date = parseYmd(k), wd = date.getDay(), d = dayData(k);
      const max = allOpen ? Infinity : 2;
      const chips = d.chips.slice(0, max).map(o => `<button type="button" class="tlChip ${o.cls}" data-tl="${o.i}"${o.aria ? ` aria-label="${esc(o.aria)}"` : ''}>${esc(o.label)}</button>`).join('') +
        (d.chips.length > max ? `<button type="button" class="tlMore" data-tlmore>+${d.chips.length - max}</button>` : '');
      head += `<div class="tlHead${k === today ? ' today' : ''}${wd === 0 ? ' sun' : wd === 6 ? ' sat' : ''}" data-k="${k}">` +
        `<div class="tlDate"><b>${+k.slice(8, 10)}</b><small>${'日月火水木金土'[wd]}${k.slice(8, 10) === '01' ? ` ${+k.slice(5, 7)}月` : ''}</small></div>` +
        `<div class="tlChips">${chips}</div></div>`;
      body += `<div class="tlDay${k === today ? ' today' : ''}" data-k="${k}">` +
        d.blocks.map(o => {
          const top = o.s / 60 * H, h = Math.max(18, (o.end - o.s) / 60 * H), w = 100 / o.n;
          return `<button type="button" class="tlBlock ${o.cls}" data-tl="${o.i}" style="top:${top}px;height:${h}px;left:${o.lane * w}%;width:calc(${w}% - 2px)">` +
            `<b>${esc(o.label)}</b>${o.time ? `<small>${esc(o.time)}</small>` : ''}${o.place ? `<small>${esc(o.place)}</small>` : ''}</button>`;
        }).join('') +
        (alarms.get(k) || []).map(x => {
          const o = { type: 'alarm', k, col: k, s: x.m, i: items.length }; items.push(o);
          return `<i class="tlAlarmLine" style="top:${x.m / 60 * H}px"></i>` +
            `<button type="button" class="tlAlarm" data-ico="alarm" data-tl="${o.i}" style="top:${x.m / 60 * H}px" aria-label="アラーム ${clock2(x.m)} ${esc(x.title)}">${clock2(x.m)} ${esc(x.title)}</button>`;
        }).join('') +
        (k === today ? `<i class="tlNow" style="top:${nowM / 60 * H}px"></i>` : '') + '</div>';
    }
    // 上の行（日付と終日の帯）は上に固定、時刻の列は左に固定。日の列は帯（tlStrip）にまとめて、横にずらしてめくる
    grid.innerHTML = `<div class="tlTop"><div class="tlCorner">終日</div><div class="tlClip"><div class="tlStrip">${head}</div></div></div>` +
      `<div class="tlBody">${axis}<div class="tlClip"><div class="tlStrip">${body}</div></div></div>`;
    box.scrollLeft = 0;
    shift(0, false);
    $('#tlClasses').checked = pref.classes;
    $('#tlDays').value = String(n);
    grid.dataset.days = n;
    $('#tlClasses').closest('label').hidden = !(state.useGrid && featOn('grid'));
    title();
  }

  // 画面の下（タブバー・広告）までを、時間軸の高さにする（全画面のときは CSS で画面いっぱい）
  function fit() {
    if (full) { box.style.height = ''; return; }
    const top = box.getBoundingClientRect().top + window.scrollY;
    const bar = $('#tabbar')?.getBoundingClientRect().top ?? innerHeight;
    const ad = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ad-h')) || 0;
    box.style.height = Math.max(280, bar - ad - top - 8) + 'px';
  }
  function title() {
    const k = first || todayStr();
    // 1段に収めるため、今年なら月だけ（ほかの年は年も）
    $('#tlTitle').textContent = k.slice(0, 4) === todayStr().slice(0, 4) ? `${+k.slice(5, 7)}月` : `${k.slice(0, 4)}年${+k.slice(5, 7)}月`;
  }

  // 日の列を横にずらす（0 = 今のページ。指についてくるときは dx だけ）
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  function shift(dx, anim) {
    for (const st of grid.querySelectorAll('.tlStrip')) {
      st.style.transition = anim && !reduce() ? 'transform .25s ease' : 'none';
      st.style.transform = `translateX(${-days() * colW() + dx}px)`;
    }
  }
  // 横は「めくる」：3・5・7日ずつ前後へ（縦のスクロールと同時には動かない）
  let busy = false;
  function flip(dir) {
    if (busy) return;
    busy = true;
    shift(-dir * days() * colW(), true);
    setTimeout(() => {
      first = dayKey(dir * days());
      busy = false;
      render();
    }, reduce() ? 0 : 260);
  }
  // 指：なぞり始めの向きで決める。縦寄りならふつうのスクロール（何もしない）、横寄りなら指についてきて、離したらめくる
  let tx = 0, ty = 0, tTime = 0, axis = '';
  box.addEventListener('touchstart', e => {
    if (e.touches.length !== 1 || busy) { axis = 'none'; return; }
    tx = e.touches[0].clientX; ty = e.touches[0].clientY; tTime = Date.now(); axis = '';
  }, { passive: true });
  box.addEventListener('touchmove', e => {
    if (mv?.on || mv?.armed) { e.preventDefault(); return; } // 長押しした予定をつかんでる間はスクロールもめくりもしない
    if (axis === 'none' || axis === 'y') return;
    const dx = e.touches[0].clientX - tx, dy = e.touches[0].clientY - ty;
    if (!axis) {
      if (Math.abs(dx) + Math.abs(dy) < 2) return;
      axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (axis === 'y') return;
    }
    e.preventDefault();   // 横に決まったら、縦は動かさない
    shift(dx, false);
  }, { passive: false });
  box.addEventListener('touchend', e => {
    if (axis !== 'x' || mv) { axis = ''; return; }
    axis = '';
    const dx = (e.changedTouches[0]?.clientX ?? tx) - tx, fast = Math.abs(dx) / Math.max(1, Date.now() - tTime) > 0.3;
    if (Math.abs(dx) > colW() * 0.4 || (fast && Math.abs(dx) > 20)) flip(dx < 0 ? 1 : -1); else shift(0, true);
  });
  box.addEventListener('touchcancel', () => { if (axis === 'x') shift(0, true); axis = ''; });
  // トラックパッドの横スクロール：ひとかたまりで1回めくる
  let wheelX = 0, wheelT = 0;
  box.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    if (Date.now() - wheelT < 450) return;
    wheelX += e.deltaX;
    if (Math.abs(wheelX) > 30) { flip(wheelX > 0 ? 1 : -1); wheelX = 0; wheelT = Date.now(); }
  }, { passive: false });
  // 万一ブラウザが横にスクロールさせても、見ている日は変えない
  box.addEventListener('scroll', () => { if (box.scrollLeft) box.scrollLeft = 0; }, { passive: true });

  function goToday() {
    const today = todayStr();
    first = anchor(today);
    render();
    // 縦は、見えている日でいちばん早い予定（なければ8時、今日の今の時刻が早ければそこ）から
    const starts = items.filter(o => o.s != null && o.k === o.col && o.col >= today && o.col <= dayKey(days() - 1)).map(o => o.s);
    const now = new Date(), nowM = now.getHours() * 60 + now.getMinutes();
    let from = Math.min(starts.length ? Math.min(...starts) : 8 * 60, 8 * 60);
    if (nowM >= 6 * 60 && nowM < 23 * 60) from = Math.min(from, nowM - 60);
    box.scrollTop = Math.max(0, from / 60 * H - 20);
  }

  panel.addEventListener('change', e => {
    if (e.target.id === 'tlClasses') { pref.classes = e.target.checked; savePref(); render(); }
    // 日数を変えても、左端の日はそのまま（7日は週のはじまりにそろえる）
    if (e.target.id === 'tlDays') {
      pref.days = +e.target.value; savePref();
      first = anchor(first || todayStr());
      render();
    }
  });
  panel.addEventListener('click', e => {
    if (Date.now() - dropAt < 500) return; // 予定を動かして離した直後のタップは開かない
    if (e.target.closest('#tlToday')) return goToday();
    if (e.target.closest('#tlPrev')) return flip(-1);
    if (e.target.closest('#tlNext')) return flip(1);
    if (e.target.closest('[data-tlmore]')) { allOpen = !allOpen; return render(); }
    const b = e.target.closest('[data-tl]'); if (!b) return;
    const o = items[+b.dataset.tl]; if (!o) return;
    if (o.type === 'class') return openCourse(o.c.id);
    if (o.type === 'alarm') return window.openAlarm?.();
    if (o.type === 'task') { calSel = o.k; return startTaskEdit(o.c.id, o.x.id); }
    if (o.type === 'event') { calSel = o.e.date || o.k; return startEvEdit(o.e.id); }
    if (o.type === 'off') return window.openAgendaItem?.({ type: 'day', date: o.k });
  });
  addEventListener('resize', () => { if (on) render(); });

  // ===== 予定を長押しで動かす =====
  // 長押しして離すと「変更・移動・複製」のメニュー（app.js）。長押ししたまま動かすと、つかんで移動（15分きざみ、長さはそのまま）。上の帯に落とすと日付だけ変える。
  // 時刻のない予定を下に落とすと、その時刻から1時間の予定になる。月のカレンダーと同じく、下のゴミ箱に落とすと消す
  let mv = null, dropAt = 0;
  const SNAP = 15;
  const hm = m => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  function mvEnd() {
    if (!mv) return;
    clearTimeout(mv.timer); cancelAnimationFrame(mv.raf);
    mv.ghost?.remove(); mv.box?.remove(); mv.head?.classList.remove('dropTo'); mv.src?.classList.remove('tlMoving');
    dragTrash.classList.remove('on', 'hot');
    mv = null;
  }
  // 指の位置から、落とす先（日・時刻／上の帯／ゴミ箱）を決めて、行き先を点線の枠で見せる
  function mvAim() {
    const { x, y } = mv;
    const r = dragTrash.getBoundingClientRect();
    const trash = x >= r.left - 12 && x <= r.right + 12 && y >= r.top - 12 && y <= r.bottom + 12;
    dragTrash.classList.toggle('hot', trash);
    const el = trash ? null : document.elementFromPoint(x, y);
    const day = el?.closest('#tlGrid .tlDay'), head = el?.closest('#tlGrid .tlHead');
    mv.head?.classList.remove('dropTo'); mv.head = null;
    let to = null;
    if (day) {
      const top = day.getBoundingClientRect().top;
      const s = Math.min(24 * 60 - SNAP, Math.max(0, Math.round((y - mv.grab - top) / H * 60 / SNAP) * SNAP));
      to = { k: day.dataset.k, s };
      if (mv.box.parentElement !== day) day.append(mv.box);
      mv.box.hidden = false;
      mv.box.style.top = s / 60 * H + 'px';
      mv.box.style.height = Math.max(18, Math.min(mv.dur, 24 * 60 - s) / 60 * H) + 'px';
      mv.box.textContent = `${hm(s)}〜`;
      mv.ghost.textContent = `${mv.label} ${md(day.dataset.k)} ${hm(s)}〜`;
    } else {
      mv.box.hidden = true;
      if (head) { to = { k: head.dataset.k, s: null }; head.classList.add('dropTo'); mv.head = head; mv.ghost.textContent = `${mv.label} ${md(head.dataset.k)}`; }
      else mv.ghost.textContent = mv.label;
    }
    mv.to = to; mv.trash = trash;
    mv.ghost.style.left = x + 'px'; mv.ghost.style.top = y + 'px';
  }
  // 上下の端に近づけたらスクロール（つかんだまま朝や夜へ動かせるように）
  function mvScroll() {
    if (!mv?.on) return;
    const r = box.getBoundingClientRect(), topEdge = grid.querySelector('.tlTop')?.getBoundingClientRect().bottom ?? r.top;
    const d = mv.y < topEdge + 36 && mv.y > topEdge ? -8 : mv.y > r.bottom - 36 && mv.y < r.bottom + 20 ? 8 : 0;
    if (d) { const t = box.scrollTop; box.scrollTop += d; if (box.scrollTop !== t) mvAim(); }
    mv.raf = requestAnimationFrame(mvScroll);
  }
  grid.addEventListener('pointerdown', e => {
    const b = e.target.closest('[data-tl]');
    const o = b && items[+b.dataset.tl];
    // 動かせるのは予定だけ（授業・締切・アラームは元の画面で）。前の日から続いている分は、始まる日でつかむ
    if (!o || o.type !== 'event' || o.k !== o.col || busy) return;
    const ev = findAnyEv(o.e.id) || o.e;
    mvEnd();
    const s = toM(ev.start), end = toM(ev.end);
    const dur = s == null || end == null ? 60 : end > s ? end - s : end + 24 * 60 - s;
    mv = { ev, src: b, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, on: false, label: ev.title || EV_LABEL[ev.kind] || '予定',
      dur, grab: b.classList.contains('tlBlock') ? e.clientY - b.getBoundingClientRect().top : 0 };
    // 長押しになったら「変更・移動・複製」のメニュー。押したまま動かし始めたら、メニューは閉じてそのまま移動
    mv.timer = setTimeout(() => {
      if (!mv) return;
      mv.armed = true;
      navigator.vibrate?.(15);
      shift(0, false); // 長押しの間に少し横にずれた分は戻す
      evActOpen(ev, mv.x0, mv.y0, {
        ev,
        edit: () => { calSel = ev.date; startEvEdit(ev.id); },
        place: {
          where: '行き先の日・時刻（上の日付なら日付だけ）',
          pick: (t, e) => {
            const day = t.closest('#tlGrid .tlDay'), head = t.closest('#tlGrid .tlHead');
            // 押した所の15分のマスの始まりを、行き先の時刻にする
            if (day) return { k: day.dataset.k, s: Math.min(24 * 60 - SNAP, Math.max(0, Math.floor((e.clientY - day.getBoundingClientRect().top) / H * 60 / SNAP) * SNAP)) };
            return head && { k: head.dataset.k, s: null };
          },
          apply: (to, mode) => mode === 'copy' ? copyEv(ev, patchTo(ev, to.k, to.s)) : moveTo(ev, to.k, to.s)
        }
      });
    }, 400);
  });
  function mvBegin() {
    const ev = mv.ev, b = mv.src;
    mv.on = true;
    evActClose();
    mv.ghost = document.createElement('div');
    mv.ghost.className = 'dragGhost ev ' + ev.kind;
    document.body.append(mv.ghost);
    mv.box = document.createElement('i');
    mv.box.className = 'tlDropBox';
    b.classList.add('tlMoving');
    dragTrash.classList.add('on');
    mv.raf = requestAnimationFrame(mvScroll);
  }
  document.addEventListener('pointermove', e => {
    if (!mv) return;
    if (!mv.on) {
      if (Math.hypot(e.clientX - mv.x0, e.clientY - mv.y0) <= 10) return;
      // 長押しの前に指が動いたら、ふつうのスクロール。長押しのあとなら、つかんで移動
      if (!mv.armed) return mvEnd();
      mvBegin();
    }
    mv.x = e.clientX; mv.y = e.clientY;
    mvAim();
  });
  document.addEventListener('pointerup', () => {
    if (!mv) return;
    const { on, armed, ev, to, trash } = mv;
    mvEnd();
    if (armed) dropAt = evActUp = Date.now(); // 長押しで指を離したらメニューが残る（あとの「タップ」では何もしない）
    if (!on) return;
    if (trash) { dropTrash(ev); return render(); }
    if (to) moveTo(ev, to.k, to.s);
  });
  document.addEventListener('pointercancel', mvEnd);
  grid.addEventListener('contextmenu', e => { if (e.target.closest('[data-tl]')) e.preventDefault(); });

  // 行き先の日・時刻にしたときの日付と時刻（s が null なら日付だけ）
  function patchTo(ev, k, s) {
    const os = toM(ev.start), oe = toM(ev.end);
    const patch = { date: k };
    if (s != null) {
      // 長さはそのまま。終わりがない予定は始まりだけ、時刻のない予定は1時間に
      patch.start = hm(s);
      if (os == null) patch.end = hm(Math.min(24 * 60 - 1, s + 60));
      else if (oe != null) patch.end = hm(s + (oe > os ? oe - os : oe + 24 * 60 - os));
    }
    return patch;
  }
  function moveTo(ev, k, s) {
    const patch = patchTo(ev, k, s);
    if (patch.date === ev.date && (patch.start ?? ev.start) === ev.start && (patch.end ?? ev.end) === ev.end) return;
    const back = { date: ev.date, start: ev.start || '', end: ev.end || '' };
    const msg = `${md(k)}${s != null ? ' ' + patch.start : ''}に移動したよ`;
    if (ev.gid) {
      if (grLocked(ev)) return alert(grLockMsg(ev));
      grPatch(ev, patch).catch(grFail);
      return toast(msg, () => grPatch(ev, back).catch(grFail));
    }
    if (ev.src === 'cal') return alert(CAL_SRC_MSG);
    const e = state.events.find(x => x.id === ev.id);
    if (!e) return;
    Object.assign(e, patch);
    save(); renderAll(); renderCal(); renderDay(); render();
    toast(msg, () => {
      const x = state.events.find(y => y.id === ev.id);
      if (x) Object.assign(x, back);
      save(); renderAll(); renderCal(); renderDay(); render();
    });
  }

  // 予定・締切を押したら、時間軸のまま上に変更のダイアログ（app.js の「予定・課題の変更はダイアログで」）。閉じたら描き直す
  document.addEventListener('evEditDone', () => { if (on) render(); });

  // ===== 全画面 =====
  // ボタンで縦のまま全画面。スマホを横向きにしたら自動で全画面（縦に戻したら元に戻る。ボタンで入っていたらそのまま）
  const LAND = matchMedia('(orientation: landscape) and (max-height: 500px)');
  let full = false, autoFull = false;
  function setFull(v, auto = false) {
    if (full === v) { autoFull = v && autoFull && auto; return; }
    const top = box.scrollTop;
    full = v; autoFull = v && auto;
    document.documentElement.classList.toggle('tlFull', v);
    const b = $('#tlFull');
    if (v) { delete b.dataset.ico; b.textContent = '×'; b.setAttribute('aria-label', '全画面をやめる'); }
    else { b.dataset.ico = 'expand'; b.textContent = ''; b.setAttribute('aria-label', '全画面で見る'); }
    if (on) { render(); box.scrollTop = top; }
  }
  $('#tlFull').addEventListener('click', () => setFull(!full));
  LAND.addEventListener('change', e => {
    if (!on) return;
    if (e.matches) setFull(true, true);
    else if (autoFull) setFull(false);
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && full && !document.querySelector('dialog[open]')) setFull(false); });
  // ほかのタブに移った（カレンダーの画面が隠れた）ら全画面は終わる。残るとほかの画面がスクロールできなくなる
  new MutationObserver(() => { if (full && $('#view-cal').hidden) setFull(false); }).observe($('#view-cal'), { attributes: true, attributeFilter: ['hidden'] });

  // agenda.js の切り替えから呼ばれる（show = 時間軸を出すとき）
  let shown = false;
  window.renderTimeline = show => {
    on = !!show; panel.hidden = !on;
    if (!on) { shown = false; setFull(false); return; }
    if (LAND.matches && !full) setFull(true, true);
    if (!shown) { shown = true; requestAnimationFrame(goToday); return; }
    render();
  };
  FEATURES.push({ id: 'timeline', name: 'カレンダーの時間軸（3・5・7日）', where: 'カレンダー → 上の「時間」', desc: '3・5・7日ずつ（選べる）、時間の流れで予定と授業を見る。上下で時間が動き、左右に払うと次の日へめくれる（7日は1週間ずつ）。右上のボタンで全画面、スマホを横向きにしても全画面になる。時刻のない予定や締切は上の帯、アラームは鳴る時刻に線で出るよ',
    kw: '全画面 横向き 大きく 週 3日 5日 7日 1週間 時間 タイムライン 縦 スケジュール 予定 一日 アラーム', go: () => window.openTimeline?.() });
})();
