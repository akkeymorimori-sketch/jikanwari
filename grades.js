/* 成績・単位：時間割とは別の記録。描画や同期の受信だけでは保存しない。 */
{
  const SCHEMES = {
    standard: { name: 'S/A/B/C/D（4点制）', grades: { S:4, A:3, B:2, C:1, D:0, '認':null, pass:null, fail:0, withdraw:null } },
    aue: { name: '愛教大・通常／教育実習', grades: { S:4, A:3, B:2, C:1, D:0, '認':2, '棄':0, withdraw:null } },
    practice: { name: '愛教大・実践力育成など', grades: { '良':2.5, '合':1, '否':0, '棄':0, withdraw:null } },
    custom: { name: 'GPを直接入力（他の方式）', grades: { custom:null, withdraw:null } }
  };
  const LABELS = { pass:'合格（GPA対象外）', fail:'不合格', withdraw:'履修取消', custom:'GPを直接入力' };
  const overview = $('#courseOverview');
  const attendance = [...overview.children].filter(e => !e.classList.contains('courseOverviewHead'));
  const tabs = document.createElement('div'); tabs.className = 'gradeTabs'; tabs.setAttribute('role','group'); tabs.setAttribute('aria-label','授業一覧の内容');
  tabs.innerHTML = '<button type="button" data-grade-tab="attendance" aria-pressed="true">出欠</button><button type="button" data-grade-tab="grades" aria-pressed="false">成績・単位</button>';
  $('.courseOverviewHead', overview).after(tabs);
  const panel = document.createElement('div'); panel.id = 'gradesPanel'; panel.hidden = true; overview.append(panel);
  let mode = 'attendance', scope = 'term';

  // 端末をまたいで同じ授業を入力しても、同じ記録IDになる。
  function recordId(key) {
    let a=2166136261, b=5381;
    for (const ch of key) { a=Math.imul(a^ch.charCodeAt(0),16777619); b=Math.imul(b,33)^ch.charCodeAt(0); }
    return 'gr_'+(a>>>0).toString(16)+'_'+(b>>>0).toString(16);
  }
  function sourceKey(t,c) {
    const meta=c.catalog;
    return meta?.id ? JSON.stringify([meta.school,meta.year,meta.id]) : c.id;
  }
  function rows() {
    const result=state.gradeRecords.map(r=>({...r,keys:[...r.keys]}));
    const linked=new Set(result.flatMap(r=>r.keys.map(k=>JSON.stringify([r.termId,k]))));
    for (const t of state.terms) for (const c of t.courses) {
      if (!c.name.trim()) continue;
      const key=sourceKey(t,c);
      const scoped=JSON.stringify([t.id,key]);
      if (linked.has(scoped)) continue;
      linked.add(scoped);
      result.push({ id:recordId(scoped), keys:[key], termId:t.id, termName:t.name, name:c.name,
        credits:gradeNumber(c.credits), scheme:state.gradeScheme, grade:'', gp:'', earned:false, exclude:false, omit:false });
    }
    return result;
  }
  function value(r) {
    const scheme=SCHEMES[r.scheme];
    if (!scheme || !Object.hasOwn(scheme.grades,r.grade)) return { ready:false,gp:null,earned:false };
    if (r.grade==='custom') {
      const gp=gradeNumber(r.gp,10);
      return { ready:gp!=='', gp:gp===''?null:gp, earned:r.earned };
    }
    const gp=scheme.grades[r.grade];
    return { ready:true, gp, earned:['S','A','B','C','認','良','合','pass'].includes(r.grade) };
  }
  function summary(list) {
    let points=0, units=0, earned=0, complete=0, missing=0;
    for (const r of list.filter(r=>!r.omit)) {
      const v=value(r), credits=gradeNumber(r.credits);
      if (!v.ready || credits==='') { missing++; continue; }
      complete++;
      if (v.earned) earned+=credits;
      if (!r.exclude && v.gp!=null && credits>0) { points+=v.gp*credits; units+=credits; }
    }
    return { gpa:units?points/units:null, units, earned, complete, missing };
  }
  function options(selected) {
    return Object.entries(SCHEMES).map(([k,v])=>`<option value="${k}" ${k===selected?'selected':''}>${v.name}</option>`).join('');
  }
  const num = v => Number.isInteger(v) ? String(v) : String(Math.round(v*1000)/1000);
  function persist(row) {
    let r=state.gradeRecords.find(r=>r.id===row.id);
    if (!r) { r={...row,keys:[...row.keys]}; state.gradeRecords.push(r); }
    return r;
  }
  function render() {
    const active=mode==='grades';
    attendance.forEach(e=>e.hidden=active);
    panel.hidden=!active;
    tabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.gradeTab==='grades')===active)));
    if (!active) return;
    if (!state.gradeEnabled) {
      panel.innerHTML='<p>単位数と成績を入れると、学期・通算のGPAと修得単位を確認できるよ。</p><p class="hint">出欠だけ使うなら入力しなくてOK。成績は時間割の共有コードには入らないよ。</p><button type="button" id="gradeEnable" class="primary">成績・単位を使う</button>';
      return;
    }
    const all=rows(), list=all.filter(r=>scope==='all'||r.termId===term().id), s=summary(list);
    panel.innerHTML='<div class="gradeScope" role="group" aria-label="成績の集計期間">'+
      `<button type="button" data-grade-scope="term" aria-pressed="${scope==='term'}">今の学期</button><button type="button" data-grade-scope="all" aria-pressed="${scope==='all'}">通算</button></div>`+
      `<div class="gradeStats"><div>GPA<b>${s.gpa==null?'—':s.gpa.toFixed(2)}</b></div><div>修得単位<b>${num(s.earned)}<small>単位</small></b></div></div>`+
      `<p class="hint" id="gradeSummary">入力済み ${s.complete}科目・未入力 ${s.missing}科目／GPA対象 ${num(s.units)}単位。入力済み分の参考値（小数第3位を四捨五入）だよ。</p>`+
      '<details class="sec"><summary>計算方法・設定</summary><label>新しく入力する評価方式<select id="gradeDefault">'+options(state.gradeScheme)+'</select></label>'+
      '<p class="hint">GPA＝（GP×単位数）の合計÷対象単位数。未入力は不合格にしないよ。認定・再履修の扱いは大学や入学年度の規則で確認してね。異なる満点の方式を混ぜると比較できないので、通算は同じ基準にそろえてね。</p>'+
      '<p class="hint">愛教大の通常はS=4、A=3、B=2、C=1、D・棄=0、認=2。実践力育成などは良=2.5、合=1、否・棄=0。教育実習はA〜Dで選んでね。</p>'+
      '<button type="button" id="gradeRuleSource">愛教大の公開資料を確認</button><button type="button" id="gradeDisable">成績の表示をやめる（記録は残す）</button></details>'+
      '<div class="gradeActions"><button type="button" id="gradeAdd">時間割にない科目を追加</button></div><p class="hint">同じ授業が週に何回もあるときは、科目の「詳しく」からまとめてね。単位数はコマ数から推測しないよ。</p>'+
      '<div id="gradeRows">'+list.map(r=>{
        const scheme=SCHEMES[r.scheme]||SCHEMES.standard, v=value(r);
        const grades='<option value="">未入力</option>'+Object.entries(scheme.grades).map(([g,gp])=>`<option value="${g}" ${g===r.grade?'selected':''}>${LABELS[g]||g}${gp!=null?'（GP '+gp+'）':''}</option>`).join('');
        const targets=all.filter(x=>x.termId===r.termId&&x.id!==r.id);
        return `<section class="gradeRow" data-grade-id="${esc(r.id)}"><h3>${esc(r.name)}</h3>`+
          `<p class="hint" data-keep>${esc(state.terms.find(t=>t.id===r.termId)?.name||r.termName)}${r.keys.length>1?'・複数コマを1科目で集計':''}</p>`+
          '<div class="gradeInputs"><label>単位数'+`<input data-grade-field="credits" type="number" min="0" max="100" step="any" inputmode="decimal" placeholder="未入力" value="${r.credits}"></label>`+
          `<label>成績<select data-grade-field="grade">${grades}</select></label></div>`+
          (r.scheme==='custom'?`<div class="gradeInputs"><label>GP<input data-grade-field="gp" type="number" min="0" max="10" step="any" value="${r.gp}" placeholder="未入力"></label><label class="inline"><input type="checkbox" data-grade-field="earned" ${r.earned?'checked':''}>単位を修得した</label></div>`:'')+
          `<p class="hint" data-keep>${r.omit?'この記録は集計しない':!v.ready?'成績を選んでね':r.credits===''?'単位数を入れると集計できるよ':r.exclude||v.gp==null?'GPA対象外'+(v.earned?'・修得単位に加算':''):'GP '+v.gp+' × '+r.credits+'単位'}</p>`+
          `<details class="sec"><summary>詳しく・同じ科目をまとめる</summary><label>科目名<input data-grade-field="name" value="${esc(r.name)}" maxlength="200"></label>`+
          `<label>この科目の評価方式<select data-grade-field="scheme">${options(r.scheme)}</select></label>`+
          `<label class="inline"><input data-grade-field="exclude" type="checkbox" ${r.exclude?'checked':''}>GPAだけ対象外にする</label>`+
          `<label class="inline"><input data-grade-field="omit" type="checkbox" ${r.omit?'checked':''}>再履修など：この記録を集計しない</label>`+
          '<label>同じ学期の別の科目とまとめる<select data-grade-merge><option value="">まとめる先を選ぶ</option>'+targets.map(x=>`<option value="${esc(x.id)}">${esc(x.name)}</option>`).join('')+'</select></label>'+
          '<p class="hint">まとめる先の単位・成績を使うよ。違う科目や別の再履修記録はまとめないでね。</p><button type="button" class="danger" data-grade-delete>この成績記録を削除</button></details></section>';
      }).join('')+'</div>'+(list.length?'':'<p class="muted">この期間の科目はまだないよ。</p>');
  }
  tabs.addEventListener('click',e=>{
    const b=e.target.closest('[data-grade-tab]'); if (!b) return;
    mode=b.dataset.gradeTab; render();
  });
  panel.addEventListener('change',e=>{
    if (e.target.id==='gradeDefault') { state.gradeScheme=e.target.value; save(); render(); return; }
    const id=e.target.closest('[data-grade-id]')?.dataset.gradeId;
    const row=rows().find(r=>r.id===id); if (!row) return;
    if (e.target.matches('[data-grade-merge]')) {
      const target=rows().find(r=>r.id===e.target.value&&r.termId===row.termId&&r.id!==row.id);
      if (!target) return;
      if (!confirm(`「${target.name}」の単位・成績を使って1科目にまとめる？`)) { e.target.value=''; return; }
      withUndo('同じ科目をまとめたよ',()=>{
        const r=persist(target); r.keys=[...new Set([...r.keys,...row.keys])];
        state.gradeRecords=state.gradeRecords.filter(r=>r.id!==row.id);
      }); render(); return;
    }
    const field=e.target.dataset.gradeField;
    if (!['credits','grade','gp','earned','exclude','omit','name','scheme'].includes(field)) return;
    const r=persist(row);
    if (['earned','exclude','omit'].includes(field)) r[field]=e.target.checked;
    else if (field==='credits'||field==='gp') r[field]=gradeNumber(e.target.value,field==='gp'?10:100);
    else if (field==='scheme') { r.scheme=e.target.value; r.grade=''; r.gp=''; r.earned=false; }
    else r[field]=e.target.value.trim();
    save(); render();
  });
  panel.addEventListener('click',e=>{
    const b=e.target.closest('button'); if (!b) return;
    if (b.dataset.gradeScope) { scope=b.dataset.gradeScope; render(); return; }
    if (b.id==='gradeEnable') { state.gradeEnabled=true; if(state.courseCatalog.school==='aue') state.gradeScheme='aue'; save(); render(); }
    if (b.id==='gradeDisable') { state.gradeEnabled=false; save(); render(); }
    if (b.id==='gradeRuleSource') openUrl('https://www.aichi-edu.ac.jp/intro/files/gpa_jokyo_240529.pdf');
    if (b.id==='gradeAdd') {
      const name=prompt('追加する科目名（今選んでいる学期に入るよ）'); if(!name?.trim()) return;
      state.gradeRecords.push({id:uid(),keys:[],termId:term().id,termName:term().name,name:name.trim().slice(0,200),credits:'',scheme:state.gradeScheme,grade:'',gp:'',earned:false,exclude:false,omit:false});
      scope='term'; save(); render();
    }
    if (b.matches('[data-grade-delete]')) {
      const id=b.closest('[data-grade-id]').dataset.gradeId;
      if(!confirm('この成績記録を削除する？時間割の授業は残るよ。まとめたコマは別々の未入力に戻るよ')) return;
      withUndo('成績記録を削除したよ',()=>{state.gradeRecords=state.gradeRecords.filter(r=>r.id!==id);}); render();
    }
  });
  window.renderGrades=()=>{ if(courseView==='list') render(); };
  window.openGrades=()=>{ mode='grades'; courseView='list'; showTab('grid'); };
  // 検証でも、実際の画面と同じ集計を利用する。
  window.gradebook={rows,summary,value,sourceKey};
}
