// 画像読み取りの確認表示。画像と確認状態は、この画面を閉じるまでだけ持つ。
const AI_REVIEW_LABELS = { day: '曜日', period: '時限', periodEnd: '終了の時限', name: '授業名', teacher: '教員', room: '教室',
  date: '日付', payDate: '支給日', month: '何月分', start: '開始時刻', end: '終了時刻', title: '名前',
  place: '場所', gross: '総支給', net: '手取り', amount: '金額', store: 'お店', cat: 'カテゴリ' };
const aiReviewContexts = new Map();
const aiReviewImages = new WeakMap();

function aiReviewPrompt(prompt) {
  return prompt + `\n追加の確認情報：読みづらい字、候補が複数ある値、画像にない年・日付などを補った項目があれば、各授業・勤務・予定・明細のJSONに warnings を追加してください。
warnings は {"項目名":"短い日本語の理由"} です。例：{"room":"末尾が8かBか判別しづらい"}。問題がなければ {}。確率や自信度の数字は付けないでください。元のJSONの形は変えないでください。
month と day から作る日付の注意は date に書いてください。年が画像に書いていない日付は date（給与の支給日は payDate）にその旨を書いてください。
表の blocks / cells 形式では、各セルを [開始,終了,{"start":"理由"}] のように3番目に warnings を添えてください。日付の注意はそのセルの date に書いてください。
読めない値は推測せず、元の指示どおり空欄にしてください。`;
}

function aiReviewNotes(data, extra = {}) {
  const notes = {};
  for (const src of [data?._review, data?.warnings, extra]) {
    if (!src || typeof src !== 'object' || Array.isArray(src)) continue;
    for (const [key, value] of Object.entries(src)) {
      if (Object.hasOwn(AI_REVIEW_LABELS, key) && typeof value === 'string' && value.trim())
        notes[key] = value.trim().slice(0, 140);
    }
  }
  return notes;
}

function aiReviewReset(st) {
  if (!st) return;
  const old = aiReviewContexts.get(st);
  if (old) {
    for (const el of old.marks.keys()) { el.classList.remove('aiSuspect'); el.removeAttribute('aria-describedby'); }
    old.panel.remove(); aiReviewContexts.delete(st);
  }
  aiReviewImages.delete(st);
  delete st.dataset.aiPage;
}

function aiReviewRemember(st, b64) {
  if (!st || !b64) return;
  const images = aiReviewImages.get(st) || [];
  const page = st.dataset.aiPage || String(images.length + 1);
  if (!images.some(x => x.b64 === b64 && x.page === page)) images.push({ b64, page });
  aiReviewImages.set(st, images);
  const dlg = st.closest('dialog');
  if (dlg && !dlg.dataset.aiReviewClose) {
    dlg.dataset.aiReviewClose = '1';
    dlg.addEventListener('close', () => {
      for (const status of [...aiReviewContexts.keys()]) if (dlg.contains(status)) aiReviewReset(status);
      for (const status of dlg.querySelectorAll('[data-ai-source]')) aiReviewImages.delete(status);
    });
  }
  st.dataset.aiSource = '1';
}

function aiReviewShow(st, entries, omitted = '') {
  if (!st) return;
  const images = aiReviewImages.get(st);
  aiReviewReset(st);
  if (images) aiReviewImages.set(st, images);
  if (!entries.length && !omitted) return;
  const panel = document.createElement('section'); panel.className = 'aiReview';
  st.insertAdjacentElement('afterend', panel);
  const ctx = { panel, marks: new Map() };
  aiReviewContexts.set(st, ctx);
  for (const [i, entry] of entries.entries()) {
    const notes = aiReviewNotes(entry.data, entry.extra);
    // 同じ元データを描き直すときも、確認済みの項目は復活させない
    const checked = entry.data?._reviewChecked || [];
    for (const [key, reason] of Object.entries(notes)) {
      const el = entry.fields[key];
      if (!el || checked.includes(key)) continue;
      if (!el.matches('input,select,textarea,button')) el.tabIndex = 0;
      const page = entry.data?._page;
      ctx.marks.set(el, { key, reason, data: entry.data, label: `${page ? `${page}枚目・` : ''}${entries.length > 1 ? `${i + 1}件目・` : ''}${AI_REVIEW_LABELS[key]}` });
      el.classList.add('aiSuspect');
    }
  }
  const done = el => {
    const mark = ctx.marks.get(el);
    if (!mark) return;
    if (mark.data) {
      mark.data._reviewChecked ||= [];
      if (!mark.data._reviewChecked.includes(mark.key)) mark.data._reviewChecked.push(mark.key);
    }
    el.classList.remove('aiSuspect'); el.removeAttribute('aria-describedby'); ctx.marks.delete(el);
    paint();
  };
  const paint = () => {
    const marks = [...ctx.marks.entries()];
    panel.classList.toggle('aiBrief', state.aiReviewReasons === false);
    panel.innerHTML = `<div class="aiReviewHead"><b>${marks.length ? `${entries.length}件のうち${marks.length}か所を確認してね` : '読み取り結果を確認してね'}</b>` +
      `<label class="inline"><input type="checkbox" data-ai-reasons${state.aiReviewReasons !== false ? ' checked' : ''}>理由を表示</label></div>` +
      '<p class="hint" data-keep>印のない項目にも読み違いがあるかもしれないよ。このまま登録することもできるよ</p>' +
      (omitted ? `<p class="aiOmitted">${esc(omitted)}</p>` : '') +
      (marks.length ? '<ul>' + marks.map(([el, m], i) => {
        const id = `ai-note-${st.id || 'result'}-${i}`; el.setAttribute('aria-describedby', id);
        return `<li id="${id}"><button type="button" class="aiJump" data-ai-jump="${i}">要確認：${esc(m.label)}</button>` +
          `<span class="aiReason">${esc(m.reason)}</span><button type="button" class="aiOkay" data-ai-okay="${i}">これで合ってる</button></li>`;
      }).join('') + '</ul>' : '') +
      (images?.length ? `<div class="aiSources">${images.map((x, i) => `<button type="button" data-ai-image="${i}">元画像${images.length > 1 ? ` ${esc(x.page)}枚目` : ''}を見る</button>`).join('')}</div>` : '');
  };
  panel.addEventListener('change', e => {
    if (!e.target.matches('[data-ai-reasons]')) return;
    state.aiReviewReasons = e.target.checked; save();
    for (const c of aiReviewContexts.values()) {
      c.panel.classList.toggle('aiBrief', !state.aiReviewReasons);
      c.panel.querySelector('[data-ai-reasons]').checked = state.aiReviewReasons;
    }
  });
  panel.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const marks = [...ctx.marks.keys()];
    if (b.dataset.aiJump != null) { const el = marks[+b.dataset.aiJump]; el?.focus(); el?.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    if (b.dataset.aiOkay != null) done(marks[+b.dataset.aiOkay]);
    if (b.dataset.aiImage != null) {
      const dlg = document.createElement('dialog'); dlg.className = 'aiSourceDlg';
      dlg.innerHTML = '<button type="button" class="aiSourceClose">閉じる</button><img alt="AIに送った読み取り元の画像">';
      dlg.querySelector('img').src = 'data:image/jpeg;base64,' + images[+b.dataset.aiImage].b64;
      dlg.querySelector('button').onclick = () => dlg.close();
      dlg.addEventListener('close', () => dlg.remove(), { once: true }); document.body.append(dlg); dlg.showModal();
    }
  });
  ctx.done = done;
  paint();
}

function aiReviewEdited(el) {
  for (const ctx of aiReviewContexts.values()) if (ctx.marks.has(el)) ctx.done(el);
}
document.addEventListener('input', e => aiReviewEdited(e.target));
document.addEventListener('change', e => aiReviewEdited(e.target));
