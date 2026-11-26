/* 大学の公開授業一覧から選ぶ。アカウントやパスワードは使わない。 */
{
  // 2026-11-16 本人承認：9校は保留、3校は削除。再開は条件確認・承認後。
  const AVAILABILITY = { aue:'hold', isct:'hold', nitech:'hold', uec:'hold', utokyo:'hold', hiroshima:'hold', kyoto:'hold', kyushu:'hold', yamanashi:'hold', tsukuba:'removed', nagasaki:'removed', niigata:'removed' };
  const available = school => AVAILABILITY[school] === 'approved';
  const PAUSED = '大学別の授業候補は、公開情報の利用条件を確認しているため停止中だよ。手入力や写真から、自分の時間割には登録できるよ';
  const YEARS = [2026];
  const SOURCE = 'https://lcu.iris-info.aichi-edu.ac.jp/lcu-web/SC_06001B00_21/init';
  const PHASE = { '3': '前期前半', '4': '前期後半', '5': '後期前半', '6': '後期後半' };
  const QUARTERS = { q1: '1Q', q2: '2Q', q3: '3Q', q4: '4Q' };
  const MODULES = { sa: '春A', sb: '春B', sc: '春C', fa: '秋A', fb: '秋B', fc: '秋C' };
  const SCHOOLS = {
    aue: { name: '愛知教育大学', scope: '教育学部', source: SOURCE, phases: PHASE },
    kyoto: { name: '京都大学', scope: '全学共通科目', source: 'https://www.z.k.kyoto-u.ac.jp/zenkyo/syllabus?locale=ja', phases: {} },
    kyushu: { name: '九州大学', scope: '基幹教育', source: 'https://syllabus.kyushu-u.ac.jp/', phases: {q1:'春学期', q2:'夏学期', q3:'秋学期', q4:'冬学期'} },
    yamanashi: { name: '山梨大学', scope: '全学共通教育・2025年度以降入学生向け', source: 'https://syllabus.yamanashi.ac.jp/2026/', phases: QUARTERS },
    nagasaki: { name: '長崎大学', scope: '教養教育', source: 'https://nuweb.nagasaki-u.ac.jp/campusweb/campussquare.do?_flowId=SYW3201400-flow', phases: QUARTERS },
    niigata: { name: '新潟大学', scope: '教育学部', source: 'https://syllabus.niigata-u.ac.jp/campus-sy/', phases: {q1:'第1ターム',q2:'第2ターム',q3:'第3ターム',q4:'第4ターム'} },
    isct: { name: '東京科学大学', scope: '理工学系・学士課程', source: 'https://syllabus.s.isct.ac.jp/', phases: QUARTERS },
    tsukuba: { name: '筑波大学', scope: '学群・共通科目', source: 'https://kdb.tsukuba.ac.jp/', phases: MODULES },
    nitech: { name: '名古屋工業大学', scope: '工学部・昼間課程', source: 'https://syllabus.ict.nitech.ac.jp/search2.php', phases: QUARTERS },
    uec: { name: '電気通信大学', scope: '情報理工学域・昼間コース', source: 'https://kyoumu.office.uec.ac.jp/syllabus/2026/JigenIchiran_31_0.html', phases: {q1: '春ターム', q2: '夏ターム', q3: '秋ターム', q4: '冬ターム'} },
    utokyo: { name: '東京大学', scope: '教育学部・学部後期課程', source: 'https://catalog.he.u-tokyo.ac.jp/result?type=ug&faculty_id=9', phases: {q1:'S1', q2:'S2', q3:'A1', q4:'A2'} },
    hiroshima: { name: '広島大学', scope: '総合科学部', source: 'https://momiji.hiroshima-u.ac.jp/syllabusHtml/', phases: {q1:'1ターム', q2:'2ターム', q3:'3ターム', q4:'4ターム'} }
  };
  const phaseLabel = (phase, school) => SCHOOLS[school]?.phases[phase] ||
    (school === 'tsukuba' && /^[sf](?:a|b|c|ab|bc|abc)$/.test(phase) ? `${phase[0] === 's' ? '春' : '秋'}${phase.slice(1).toUpperCase()}` :
      /^q[1-4]{1,4}$/.test(phase) ? [...phase.slice(1)].map(q => SCHOOLS[school]?.phases['q'+q] || `${q}Q`).join('・') : '');
  const validPhase = (phase, school) => school === 'kyoto' ? false : school === 'aue' ? Object.hasOwn(PHASE, phase) : ['isct', 'nitech', 'uec', 'utokyo', 'hiroshima', 'kyushu', 'yamanashi', 'nagasaki', 'niigata'].includes(school) ? /^q[1-4]{1,4}$/.test(phase) : /^[sf](?:a|b|c|ab|bc|abc)$/.test(phase);
  const includesPhase = (c, selected, school) => !selected || c.phase === selected ||
    (['isct', 'nitech', 'uec', 'utokyo', 'hiroshima', 'kyushu', 'yamanashi', 'nagasaki', 'niigata'].includes(school) && c.phase.slice(1).includes(selected.slice(1))) ||
    (school === 'tsukuba' && c.phase[0] === selected[0] && c.phase.slice(1).includes(selected.slice(1))) ||
    (['nitech', 'uec', 'kyushu', 'yamanashi', 'nagasaki', 'niigata'].includes(school) && !c.phase && (c.semester === '通年' || (c.semester === '前期' && ['q1', 'q2'].includes(selected)) || (c.semester === '後期' && ['q3', 'q4'].includes(selected))));
  const rangeKey = (school, year, phase) => school === 'aue' ? `${year}-${phase}` : `${school}-${year}-${phase}`;
  function setPhases() {
    const phases = SCHOOLS[$('#ccSchool').value]?.phases || PHASE;
    $('#ccPhase').innerHTML = '<option value="">すべて</option>' + Object.entries(phases).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
    $('#ccPhase').disabled = !Object.keys(phases).length;
    const tsukuba = $('#ccSchool').value === 'tsukuba', utokyo = $('#ccSchool').value === 'utokyo';
    $('#ccSemester option[value="前期"]').textContent = tsukuba ? '春学期' : utokyo ? 'Sセメスター' : '前期';
    $('#ccSemester option[value="後期"]').textContent = tsukuba ? '秋学期' : utokyo ? 'Aセメスター' : '後期';
    $('#ccQuery').placeholder = tsukuba ? '例：情報リテラシー、先生の名前、1101102' : '例：英語、先生の名前、科目コード';
  }
  const cache = new Map();
  let data = null, visible = [], chosen = null, targetTermId = '', requestId = 0;
  const dlg = document.createElement('dialog'); dlg.id = 'courseCatalogDlg';
  dlg.innerHTML = '<div class="dlgHead"><h2>授業を選んで追加</h2><button type="button" class="x big" id="ccClose" aria-label="閉じる">×</button></div>' +
    '<p class="hint" id="ccTarget"></p>' +
    '<div class="ccFilters"><label>大学<select id="ccSchool"><option value="">大学を選ぶ</option><option value="aue">愛知教育大学・教育学部</option><option value="isct">東京科学大学・理工学系（学士）</option><option value="tsukuba">筑波大学・学群共通科目</option><option value="nitech">名古屋工業大学・工学部（昼間）</option><option value="uec">電気通信大学・情報理工学域（昼間）</option><option value="utokyo">東京大学・教育学部（学部後期課程）</option><option value="hiroshima">広島大学・総合科学部</option></select></label>' +
    `<label>年度<select id="ccYear">${YEARS.map(y => `<option value="${y}">${y}年度</option>`).join('')}</select></label>` +
    '<label>学期<select id="ccSemester"><option value="前期">前期</option><option value="後期">後期</option><option value="all">すべて</option></select></label>' +
    '<label>開講時期<select id="ccPhase"><option value="">すべて</option>' + Object.entries(PHASE).map(([k, v]) => `<option value="${k}">${v}</option>`).join('') + '</select></label>' +
    '<label>曜日<select id="ccDay"><option value="">すべて</option>' + DAYS.map((d, i) => `<option value="${i}">${d}曜</option>`).join('') + '</select></label>' +
    '<label>時限<select id="ccPeriod"><option value="">すべて</option>' + Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1}限</option>`).join('') + '</select></label></div>' +
    '<label class="ccQuery">授業名・先生・科目コード・クラスで絞る<input id="ccQuery" type="search" placeholder="例：英語、二村、205001" autocomplete="off"></label>' +
    '<p id="ccStatus" class="hint" role="status"></p><button type="button" id="ccRetry" hidden>もう一回読み込む</button>' +
    '<div id="ccResults"></div><section id="ccPreview" hidden></section>' +
    '<div class="ccBottom"><button type="button" id="ccManual">手入力で追加</button><button type="button" id="ccSource" data-ico="link">大学のシラバス検索</button></div>';
  document.body.append(dlg);
  $('#ccSchool').insertAdjacentHTML('beforeend', '<option value="kyoto">京都大学・全学共通科目</option>');
  $('#ccSchool').insertAdjacentHTML('beforeend', '<option value="kyushu">九州大学・基幹教育</option>');
  $('#ccSchool').insertAdjacentHTML('beforeend', '<option value="yamanashi">山梨大学・全学共通教育（2025年度以降入学）</option><option value="nagasaki">長崎大学・教養教育</option><option value="niigata">新潟大学・教育学部</option>');
  for (const option of [...$('#ccSchool').options]) if (option.value && !available(option.value)) option.remove();
  const suspended = !Object.keys(AVAILABILITY).some(available);
  if (suspended) {
    $('#ccSchool option').textContent = '授業候補の検索は停止中';
    for (const control of dlg.querySelectorAll('.ccFilters select, #ccQuery')) control.disabled = true;
    $('#ccSource').hidden = true;
  }
  // 全部の大学が停止中のあいだは、入口（時間割の上のボタン・空きコマのタップ・機能をさがす）を出さない。
  // 画面のしくみは残すので、保存済みの授業の候補情報（c.catalog）はそのまま表示できる
  window.courseCatalogPaused = suspended;
  if (!suspended) {
    const entry = document.createElement('div'); entry.className = 'ccEntry';
    entry.innerHTML = '<button type="button" id="courseCatalogBtn" data-ico="search">授業を選んで追加</button><small>大学を選ぶと、空きコマからも候補が出るよ</small>';
    $('#grid').before(entry);
  }

  const prefs = () => state.courseCatalog;
  const target = () => state.terms.find(t => t.id === targetTermId);
  const norm = s => String(s || '').normalize('NFKC').toLowerCase().replace(/\s+/g, '');
  const text = (s, n = 150) => typeof s === 'string' ? s.slice(0, n) : '';
  const slotText = s => `${DAYS[s.day]}${s.period}${s.periodEnd > s.period ? `〜${s.periodEnd}` : ''}限`;
  const rowSlots = c => c.slots.map(slotText).join('・');
  const registered = (c, s) => (target()?.courses || []).some(x => x.day === s.day && x.period === s.period && endPeriod(x) === s.periodEnd &&
    (x.catalog?.id ? x.catalog.school === data?.school && x.catalog.id === c.id : !c.className && norm(x.name) === norm(c.name) && (!x.teacher || norm(x.teacher) === norm(c.teacher))));

  // 公開ファイルも入力として検証する。大学から返るHTMLをアプリ内で実行しない。
  function cleanCatalog(raw, year, school) {
    if (!available(school)) throw new Error('この大学の授業候補は停止中');
    if (raw?.school !== school || raw.year !== year || !Array.isArray(raw.courses) || !isYmd(raw.updated)) throw new Error('授業一覧の形式を確認できなかった');
    const courses = raw.courses.slice(0, 6000).flatMap(c => {
      if (!c || !c.id || !c.name || !Array.isArray(c.slots)) return [];
      const rawSlots = c.slots.filter(s => Number.isInteger(s.day) && s.day >= 0 && s.day <= 5 && Number.isInteger(s.period) && s.period >= 1 && s.period <= 10 && Number.isInteger(s.periodEnd) && s.periodEnd >= s.period && s.periodEnd <= 10)
        .map(s => ({ day: s.day, period: s.period, periodEnd: s.periodEnd, room: text(s.room) })).sort((a, b) => a.day - b.day || a.period - b.period);
      const slots = [];
      for (const s of rawSlots) {
        const last = slots[slots.length - 1];
        if (last && last.day === s.day && last.room === s.room && s.period <= last.periodEnd + 1) last.periodEnd = Math.max(last.periodEnd, s.periodEnd);
        else slots.push(s);
      }
      return slots.length ? [{ id: text(c.id, 200), code: text(c.code, 30), name: text(c.name), teacher: text(c.teacher), className: text(c.className, 30),
        grade: text(c.grade, 30), credits: gradeNumber(c.credits), semester: text(c.semester, 30), phase: validPhase(c.phase, school) ? c.phase : '',
        syllabus: (school === 'isct' && /^https:\/\/syllabus\.s\.isct\.ac\.jp\/courses\/[\d/-]+$/.test(c.syllabus)) ||
          (school === 'nitech' && /^https:\/\/syllabus\.ict\.nitech\.ac\.jp\/view\.php\?id=\d+$/.test(c.syllabus)) ||
          (school === 'uec' && /^https:\/\/kyoumu\.office\.uec\.ac\.jp\/syllabus\/\d{4}\/31\/31_\d{8}\.html$/.test(c.syllabus)) ||
          (school === 'utokyo' && /^https:\/\/catalog\.he\.u-tokyo\.ac\.jp\/detail\?code=[\d-]{8,17}&year=\d{4}$/.test(c.syllabus)) ||
          (school === 'hiroshima' && /^https:\/\/momiji\.hiroshima-u\.ac\.jp\/syllabusHtml\/\d{4}_01(?:01|02)?_[A-Z0-9]{8}\.html$/.test(c.syllabus)) ||
          (school === 'kyoto' && /^https:\/\/www\.z\.k\.kyoto-u\.ac\.jp\/zenkyo\/syllabus\/syllabus-pdf\/\d+\?lang=jp$/.test(c.syllabus)) ||
          (school === 'kyushu' && /^https:\/\/ku-portal\.kyushu-u\.ac\.jp\/campusweb\/slbssbdr\.do\?value\(risyunen\)=\d{4}&value\(semekikn\)=[012]&value\(kougicd\)=\d{8}&value\(crclumcd\)=(?:ZZ)?$/.test(c.syllabus)) ||
          (school === 'yamanashi' && /^https:\/\/syllabus\.yamanashi\.ac\.jp\/\d{4}\/syllabus\/[A-Z0-9+]+$/.test(c.syllabus)) ? c.syllabus : '', slots }] : [];
    });
    if (!courses.length) throw new Error('授業一覧が空だった');
    return { school, year, updated: raw.updated, courses };
  }

  function loadFileCatalog(year, school) {
    if (!available(school)) return Promise.reject(new Error('この大学の授業候補は停止中'));
    const key = school === 'aue' ? year : `${school}-${year}`;
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const cleanup = () => { clearTimeout(timer); script.remove(); if (globalThis.GakulogCourseCatalogData) delete globalThis.GakulogCourseCatalogData[key]; };
      const timer = setTimeout(() => { cleanup(); reject(new Error('授業一覧の読み込みが時間切れになった')); }, 8000);
      script.onload = () => {
        try { resolve(cleanCatalog(globalThis.GakulogCourseCatalogData?.[key], year, school)); }
        catch (e) { reject(e); }
        finally { cleanup(); }
      };
      script.onerror = () => { cleanup(); reject(new Error('授業一覧のファイルが見つからなかった')); };
      // file: では fetch(JSON) が禁止される。自分のアプリに同梱したデータを通常のスクリプトとして読む。
      script.src = `data/${school}-${year}.js`;
      document.head.append(script);
    });
  }

  async function loadCatalog(year, school) {
    if (!available(school)) throw new Error('この大学の授業候補は停止中');
    const key = `${school}-${year}`;
    if (cache.has(key)) return cache.get(key);
    const pending = (async () => {
      if (location.protocol === 'file:') return loadFileCatalog(year, school);
      const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 8000);
      try {
        const response = await fetch(`data/${school}-${year}.json`, { signal: ctl.signal });
        if (!response.ok) throw new Error('この年度の授業一覧が見つからなかった');
        return cleanCatalog(await response.json(), year, school);
      } finally { clearTimeout(timer); }
    })();
    cache.set(key, pending);
    try { return await pending; } catch (e) { cache.delete(key); throw e; }
  }

  function selection() {
    return { school: $('#ccSchool').value, year: +$('#ccYear').value, semester: $('#ccSemester').value,
      day: $('#ccDay').value, period: +$('#ccPeriod').value, phase: $('#ccPhase').value, query: $('#ccQuery').value.trim().split(/\s+/).map(norm).filter(Boolean) };
  }

  function render() {
    chosen = null; $('#ccPreview').hidden = true; $('#ccResults').hidden = false;
    const s = selection();
    if (!available(s.school)) { $('#ccResults').innerHTML = ''; $('#ccStatus').textContent = PAUSED; return; }
    if (!s.school || !data) { $('#ccResults').innerHTML = ''; return; }
    visible = data.courses.filter(c =>
      (s.semester === 'all' || c.semester === '通年' || c.semester.includes(s.semester)) && includesPhase(c, s.phase, s.school) &&
      c.slots.some(x => (s.day === '' || x.day === +s.day) && (!s.period || (x.period <= s.period && x.periodEnd >= s.period))) &&
      s.query.every(q => norm([c.name, c.teacher, c.code, c.className].join(' ')).includes(q)));
    visible.sort((a, b) => a.name.localeCompare(b.name, 'ja') || a.className.localeCompare(b.className));
    $('#ccStatus').textContent = `${visible.length}件の候補・${data.year}年度 ${SCHOOLS[data.school].scope}・${data.updated}取得。${data.school === 'tsukuba' ? '共通科目の総合科目・体育・外国語・芸術・国語・情報が対象。専門科目や複雑な開講期間の授業は手入力で追加してね。' : ['kyoto', 'kyushu'].includes(data.school) ? '専門科目・大学院科目は対象外。教室・単位数は公式シラバスで確認して入力してね。' : ''}集中講義など曜日・時限が未確定の授業は手入力で追加してね。変更がないか大学の最新情報も確認してね`;
    if (['nagasaki', 'niigata'].includes(data.school)) $('#ccStatus').textContent += '教室・単位数は未取得。大学の公開検索で科目コードを検索して確認してね。';
    $('#ccResults').innerHTML = visible.length ? '<ul class="ccList">' + visible.slice(0, 100).map((c, i) => {
      const done = c.slots.every(s => registered(c, s));
      return `<li><button type="button" data-ccpick="${i}"${done ? ' disabled' : ''}><b>${esc(c.name)}</b>` +
        `<span>${esc([c.teacher, c.className ? `クラス${c.className}` : '', c.grade].filter(Boolean).join('／'))}</span>` +
        `<small>${esc([rowSlots(c), phaseLabel(c.phase, data.school) || c.semester, c.credits !== '' ? `${c.credits}単位` : '', `科目コード ${c.code}`, done ? '登録済み' : ''].filter(Boolean).join('／'))}</small></button></li>`;
    }).join('') + '</ul>' + (visible.length > 100 ? '<p class="hint" data-keep>候補が多いので100件まで表示しているよ。曜日や授業名で絞ってね</p>' : '')
      : '<p class="muted">この条件の候補はなかったよ。学期や絞り込みを変えるか、手入力で追加してね</p>';
  }

  async function refresh() {
    const id = ++requestId, s = selection();
    chosen = null; data = null; $('#ccResults').innerHTML = ''; $('#ccResults').hidden = false; $('#ccPreview').hidden = true; $('#ccRetry').hidden = true;
    if (suspended || (s.school && !available(s.school))) { $('#ccStatus').textContent = PAUSED; return; }
    prefs().school = s.school; prefs().year = s.year; prefs().semester = s.semester; save();
    if (!s.school) { $('#ccStatus').textContent = '大学を選ぶと候補が出るよ。対応していない大学は手入力で追加してね'; return; }
    $('#ccStatus').textContent = '授業一覧を読み込んでいるよ…';
    try {
      const result = await loadCatalog(s.year, s.school);
      if (id !== requestId || !dlg.open) return;
      data = result; render();
    } catch (e) {
      if (id !== requestId || !dlg.open) return;
      $('#ccStatus').textContent = '授業一覧を読み込めなかった。もう一回試すか、手入力で追加してね';
      $('#ccRetry').hidden = false;
    }
  }

  function preview(index) {
    if (!available(data?.school)) return;
    chosen = visible[index]; if (!chosen) return;
    const c = chosen, half = !!c.phase, label = phaseLabel(c.phase, data.school), range = prefs().ranges[rangeKey(data.school, data.year, c.phase)] || {};
    $('#ccResults').hidden = true; $('#ccPreview').hidden = false;
    $('#ccPreview').innerHTML = `<h3>${esc(c.name)}</h3><p>${esc([c.teacher, c.className ? `クラス${c.className}` : '', label || c.semester, c.credits !== '' ? `${c.credits}単位` : '単位数は未取得'].filter(Boolean).join('／'))}</p>` +
    `<p class="hint" data-keep>追加するコマを選んでね。${c.slots.some(s => s.room) ? '教室は登録後にも変更できるよ' : '教室は大学の最新情報を確認して、登録後に入れてね'}</p>` +
      '<div class="ccSlots">' + c.slots.map((s, i) => `<label class="inline"><input type="checkbox" data-ccslot="${i}"${registered(c, s) ? ' disabled' : ' checked'}>${slotText(s)}${s.room ? `／${esc(s.room)}` : ''}${registered(c, s) ? '（登録済み）' : ''}</label>`).join('') + '</div>' +
      `<p class="hint" data-keep>${half ? `${label}の開始日・終了日を入れてね。この大学・開講時期の次の授業にも使うよ` : '期間は空なら今の学期全体。必要なら変えられるよ'}</p>` +
      `<div class="row ccDates"><label>開始日<input id="ccFrom" type="date" value="${range.from || ''}"></label><label>終了日<input id="ccTo" type="date" value="${range.to || ''}"></label></div>` +
      '<p id="ccError" class="alert" role="status"></p><div class="row"><button type="button" id="ccBack">候補に戻る</button><button type="button" class="primary" id="ccAdd">時間割に追加</button></div>';
    $('#ccPreview').scrollIntoView({ block: 'nearest' });
  }

  function add() {
    const c = chosen, t = target(); if (!c || !t || !data) return;
    if (!available(data.school)) return;
    const slots = [...dlg.querySelectorAll('[data-ccslot]:checked')].map(e => c.slots[+e.dataset.ccslot]).filter(s => !registered(c, s));
    const from = $('#ccFrom').value, to = $('#ccTo').value;
    const fail = msg => { $('#ccError').textContent = msg; };
    if (!slots.length) return fail('追加するコマを選んでね');
    if (c.phase && (!isYmd(from) || !isYmd(to))) return fail('開講時期が決まっている授業なので、開始日と終了日を入れてね');
    if (from && to && from > to) return fail('終了日が開始日より前になっているよ');
    if ((from && t.end && from > t.end) || (to && t.start && to < t.start)) return fail('授業の期間が今の学期から外れているよ。学期の期間も確認してね');
    const overlaps = slots.some(s => t.courses.some(x => x.day === s.day && x.period <= s.periodEnd && endPeriod(x) >= s.period &&
      (!to || !x.from || to >= x.from) && (!from || !x.to || from <= x.to)));
    if (overlaps && !confirm('同じコマに別の授業があるよ。今ある授業を残して追加する？')) return;
    const year = data.year, updated = data.updated, school = data.school;
    withUndo('候補から授業を追加したよ', () => {
      if (c.phase) prefs().ranges[rangeKey(school, year, c.phase)] = { from, to };
      for (const s of slots) t.courses.push(newCourse(s.day, s.period, { periodEnd: s.periodEnd, name: c.name, teacher: c.teacher, room: s.room, from, to, syllabus: c.syllabus || SCHOOLS[school].source,
        credits: c.credits, catalog: { school, year, id: c.id, code: c.code, className: c.className, semester: c.semester, phase: c.phase, updated } }));
      state.periods = Math.max(state.periods, ...slots.map(s => s.periodEnd));
      if (slots.some(s => s.day === 5)) state.showSat = true;
    });
    const added = t.courses[t.courses.length - 1]; dlg.close(); renderAll(); openCourse(added.id);
  }

  window.openCourseCatalog = (day = null, period = null) => {
    if (!featOn('grid')) return;
    targetTermId = state.currentTermId;
    $('#ccSchool').value = prefs().school;
    setPhases();
    if (suspended) $('#ccPhase').disabled = true;
    $('#ccYear').value = YEARS.includes(prefs().year) ? prefs().year : YEARS[0];
    const guess = /前期|春/.test(term().name) ? '前期' : /後期|秋/.test(term().name) ? '後期' : new Date().getMonth() >= 8 || new Date().getMonth() < 3 ? '後期' : '前期';
    $('#ccSemester').value = prefs().semester || guess;
    $('#ccDay').value = day == null ? '' : day; $('#ccPeriod').value = period == null ? '' : period;
    $('#ccPhase').value = ''; $('#ccQuery').value = '';
    $('#ccTarget').textContent = `保存先：${term().name}${day == null ? '' : `／${DAYS[day]}${period}限の候補`}`;
    if (!dlg.open) dlg.showModal(); dlg.scrollTop = 0; return refresh();
  };
  if ($('#courseCatalogBtn')) $('#courseCatalogBtn').onclick = () => window.openCourseCatalog();
  $('#ccClose').onclick = () => dlg.close();
  // close は後から届く。すでに開き直した画面の読み込みは取り消さない。
  dlg.addEventListener('close', () => { if (!dlg.open) requestId++; });
  $('#ccYear').onchange = refresh;
  $('#ccSchool').onchange = () => { setPhases(); return refresh(); };
  $('#ccSemester').onchange = () => { prefs().semester = $('#ccSemester').value; save(); render(); };
  for (const id of ['ccDay', 'ccPeriod', 'ccPhase']) $('#' + id).onchange = render;
  $('#ccQuery').oninput = render;
  $('#ccRetry').onclick = () => { cache.delete(`${$('#ccSchool').value}-${$('#ccYear').value}`); refresh(); };
  $('#ccSource').onclick = () => openUrl(SCHOOLS[$('#ccSchool').value]?.source || SOURCE);
  $('#ccManual').onclick = () => {
    const s = selection(), t = target(); if (!t) return;
    const c = newCourse(s.day === '' ? 0 : +s.day, s.period || 1); t.courses.push(c); dlg.close(); renderAll(); openCourse(c.id);
  };
  $('#ccResults').onclick = e => { const b = e.target.closest('[data-ccpick]'); if (b) preview(+b.dataset.ccpick); };
  $('#ccPreview').onclick = e => { if (e.target.id === 'ccBack') render(); if (e.target.id === 'ccAdd') add(); };

  const info = document.createElement('p'); info.id = 'cCatalogInfo'; info.className = 'hint'; info.hidden = true; $('#cIntRow').before(info);
  window.renderCatalogDetail = c => {
    const meta = c.catalog; info.hidden = !SCHOOLS[meta?.school];
    info.textContent = info.hidden ? '' : `${SCHOOLS[meta.school].name} ${meta.year}年度／科目コード ${meta.code}／クラス${meta.className || '指定なし'}／${phaseLabel(meta.phase, meta.school) || meta.semester}。${meta.school === 'tsukuba' ? '大学のKdBで科目コードを検索して、履修条件や教室を確認してね' : 'シラバスのリンクから大学の情報を確認できるよ'}`;
    if (!info.hidden && ['nagasaki', 'niigata'].includes(meta.school)) info.textContent += '大学の公開検索が開くので、科目コードで授業を探してね。';
  };
  if (!suspended) FEATURES.push({ id: 'courseCatalog', name: '大学の授業候補（停止中）', where: '時間割 → 授業を選んで追加', desc: PAUSED, kw: '大学 シラバス 検索 候補 履修 授業 時限 手入力', grid: 1, go: () => window.openCourseCatalog() });
}
