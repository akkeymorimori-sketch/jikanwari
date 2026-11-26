/* カレンダーと同じ記録を、今日からの日付順に表示する。表示だけでは保存しない。 */
(() => {
  const view=$('#view-cal'), month=document.createElement('div'); month.id='agendaMonth';
  month.append(...view.childNodes);
  const switcher=document.createElement('div'); switcher.className='courseViewSwitch'; switcher.id='agendaSwitch';
  switcher.setAttribute('role','group'); switcher.setAttribute('aria-label','カレンダーの表示');
  switcher.innerHTML='<button type="button" data-agenda-view="month" aria-pressed="true">カレンダー</button><button type="button" data-agenda-view="list" aria-pressed="false">予定一覧</button><button type="button" data-agenda-view="time" aria-pressed="false">時間軸</button>';
  const panel=document.createElement('section');panel.id='agendaPanel';panel.hidden=true;panel.setAttribute('aria-label','予定一覧');
  panel.innerHTML='<div class="card agendaControls"><div class="row split"><h2>これからの予定</h2><button type="button" id="agendaToday">今日に戻る</button></div>'+
    '<div class="agendaFilters" role="group" aria-label="予定一覧の絞り込み"><button type="button" data-agenda-filter="all" aria-pressed="true">すべて</button><button type="button" data-agenda-filter="events" aria-pressed="false">予定・バイト</button><button type="button" data-agenda-filter="tasks" aria-pressed="false">課題・試験</button></div>'+
    '<div class="agendaOptions"><label class="inline"><input type="checkbox" id="agendaClasses">授業も表示</label><label class="inline"><input type="checkbox" id="agendaDone">完了済みも表示</label></div>'+
    '<p class="hint" id="agendaRange" role="status"></p><p class="hint" id="agendaSourceHint" hidden>カレンダーの表示元の絞り込みを引き継いでいるよ。</p></div>'+
    '<div id="agendaRows"></div><button type="button" id="agendaMore">さらに30日分を表示</button>';
  view.append(switcher,month,panel);
  const home=document.createElement('button');home.id='agendaHome';home.type='button';home.className='agendaHome';home.textContent='この先の予定を見る ›';$('#view-today').append(home);
  let mode='month', filter='all', span=30, base='', current=[];
  function top(){
    window.scrollTo({top:0,behavior:'instant'});
    requestAnimationFrame(()=>{if(mode!=='month'&&curTab==='cal')window.scrollTo({top:0,behavior:'instant'});});
  }
  const labelDate=k=>{
    const today=todayStr(), prefix=k===today?'今日 ':k===ymd(addDays(parseYmd(today),1))?'明日 ':'';
    return prefix+`${+k.slice(5,7)}/${+k.slice(8,10)}（${'日月火水木金土'[parseYmd(k).getDay()]}）`;
  };
  function collect() {
    const today=todayStr(), last=ymd(addDays(parseYmd(today),span-1));
    const out=[], ownHidden=(state.calHide||[]).includes('me'), done=$('#agendaDone').checked;
    if(filter!=='events'&&!ownHidden){
      const groups=state.terms.flatMap(t=>t.courses).concat(taskGroups());
      for(const c of groups) for(const task of c.tasks){
        if(task.done&&!done) continue;
        const due=dueOf(task);
        if(due&&(!isYmd(due)||due>last)) continue;
        out.push({type:'task',date:due||'',time:'',sort:'25:00',title:task.title,label:'課題',sub:nm(c),c,task});
      }
    }
    for(let n=0;n<span;n++){
      const date=addDays(parseYmd(today),n), k=ymd(date);
      for(const e of calEvents(k)){
        if(filter==='events'&&e.kind==='exam'||filter==='tasks'&&e.kind!=='exam') continue;
        out.push({type:'event',date:k,time:e.start?evTime(e):'時刻なし',sort:e.start||'24:00',title:e.title||EV_LABEL[e.kind]||'予定',label:EV_LABEL[e.kind]||'予定',sub:[e.gid?'共有予定':'',placeOf(e.memo)].filter(Boolean).join('・'),event:e});
      }
      if(filter==='all'&&$('#agendaClasses').checked&&state.useGrid){
        const at=new Set(attendOn(date));
        for(const c of coursesOn(date)){
          const occurrenceAt=occurrence(c,date), fixed=at.has(c)&&occurrenceAt;
          out.push({type:'class',date:k,time:fixed?`${hm(occurrenceAt.start)}〜${hm(occurrenceAt.end)}`:at.has(c)?'時刻未設定':'オンデマンド',sort:fixed?hm(occurrenceAt.start):'24:00',title:nm(c),label:'授業',sub:[`${periodLabel(c)}限`,c.room].filter(Boolean).join('・'),c});
        }
        for(const c of intensiveOn(k)) out.push({type:'class',date:k,time:'日程内',sort:'24:00',title:nm(c),label:'集中講義',sub:c.room,c});
      }
    }
    return out.sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999')||a.sort.localeCompare(b.sort)||a.title.localeCompare(b.title,'ja'));
  }
  function render(){
    month.hidden=mode!=='month';panel.hidden=mode!=='list';
    switcher.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.agendaView===mode)));
    window.renderTimeline?.(mode==='time'&&curTab==='cal');
    if(mode!=='list'||curTab!=='cal') return;
    const today=todayStr();if(base!==today){base=today;span=30;}
    current=collect();
    const overdueOpen=$('#agendaOverdue')?.open, undatedOpen=$('#agendaUndated')?.open;
    const row=(r,i)=>{
      const when=r.type==='task'?(r.date?(r.date===today?'今日締切':r.date<today?`${labelDate(r.date)} 締切`:'締切'):'締切未設定'):r.time;
      return `<li class="agendaItem${r.task?.done?' agendaCompleted':''}">`+
        (r.type==='task'?`<input type="checkbox" data-agenda-done="${i}" ${r.task.done?'checked':''} aria-label="${esc(r.title)}を完了">`:'')+
        `<button type="button" class="agendaEntry" data-agenda-open="${i}"><span class="agendaWhen${r.type==='task'&&r.date&&r.date<=today&&!r.task.done?' agendaDue':''}">${esc(when)}</span>`+
        `<span class="agendaBody"><b>${esc(r.title)}</b><small>${esc([r.label,r.sub,r.task?.done?'完了':''].filter(Boolean).join('・'))}</small></span><span aria-hidden="true">›</span></button></li>`;
    };
    const past=[], unset=[], dates=new Map();
    current.forEach((r,i)=>{
      const html=row(r,i);
      if(!r.date) unset.push(html);
      else if(r.date<today) past.push(html);
      else {if(!dates.has(r.date)) dates.set(r.date,[]);dates.get(r.date).push(html);}
    });
    $('#agendaRows').innerHTML=(past.length?`<details class="card agendaFold" id="agendaOverdue" ${overdueOpen?'open':''}><summary>期限切れの課題 ${past.length}件</summary><ul>${past.join('')}</ul></details>`:'')+
      [...dates].map(([k,rs])=>`<section class="card agendaDay" data-agenda-date="${k}"><h3>${esc(labelDate(k))}</h3><ul>${rs.join('')}</ul></section>`).join('')+
      (unset.length?`<details class="card agendaFold" id="agendaUndated" ${undatedOpen?'open':''}><summary>締切未設定の課題 ${unset.length}件</summary><ul>${unset.join('')}</ul></details>`:'')+
      (!dates.size?'<p class="card muted">この期間に表示する予定はないよ。</p>':'');
    $('#agendaRange').textContent=`${labelDate(today)}〜${labelDate(ymd(addDays(parseYmd(today),span-1)))}・${[...dates.values()].reduce((n,rs)=>n+rs.length,0)}件`;
    $('#agendaSourceHint').hidden=!(state.calHide||[]).length;
    $('#agendaClasses').closest('label').hidden=!state.useGrid;
    $('#agendaMore').disabled=span>=366;
    $('#agendaMore').textContent=span>=366?'1年より先はカレンダーで確認してね':'さらに30日分を表示';
    panel.querySelectorAll('[data-agenda-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.agendaFilter===filter)));
  }
  function monthAt(k){
    mode='month';calSel=k;const date=parseYmd(k);calMonth=new Date(date.getFullYear(),date.getMonth(),1);
    renderCal();renderDay();render();
  }
  switcher.addEventListener('click',e=>{
    const b=e.target.closest('[data-agenda-view]');if(!b)return;
    mode=b.dataset.agendaView;if(mode==='list'){span=30;base=todayStr();}render();if(mode!=='month')top();
  });
  panel.addEventListener('change',e=>{
    if(e.target.id==='agendaClasses'||e.target.id==='agendaDone')return render();
    if(e.target.dataset.agendaDone==null)return;
    const r=current[+e.target.dataset.agendaDone];
    const task=r?.type==='task'&&findCourse(r.c.id)?.tasks.find(t=>t.id===r.task.id);if(!task)return;
    withUndo(e.target.checked?'課題を完了にしたよ':'課題を未完了に戻したよ',()=>{task.done=e.target.checked;});
    renderAll();render();
  });
  panel.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.agendaFilter){filter=b.dataset.agendaFilter;return render();}
    if(b.id==='agendaMore'){span=Math.min(366,span+30);return render();}
    if(b.id==='agendaToday'){base=todayStr();span=30;render();top();return;}
    if(b.dataset.agendaOpen==null)return;
    openItem(current[+b.dataset.agendaOpen]);
  });
  // 一覧から、予定や課題の変更フォームを開く（一覧のまま、上にダイアログで）。日の行はカレンダーのその日へ
  function openItem(r){
    if(!r)return;
    if(r.type==='class')return openCourse(r.c.id);
    if(r.type==='day')return monthAt(r.date||todayStr());
    calSel=r.date||todayStr();renderDay();
    if(r.type==='task')return startTaskEdit(r.c.id,r.task.id);
    if(findAnyEv(r.event.id))return startEvEdit(r.event.id);
    toast('この予定は変更されたか、削除されたみたい');
  }
  window.openAgendaItem=openItem;
  window.renderAgenda=render;
  // 変更のフォームはダイアログで開く（app.js の「予定・課題の変更はダイアログで」）ので、月の表示に切り替えなくていい
  window.openAgenda=()=>{mode='list';span=30;base=todayStr();showTab('cal');render();top();};
  window.openTimeline=()=>{mode='time';showTab('cal');render();top();};
  // 下のタブの「カレンダー」を押したら、予定一覧・時間軸を開いていても月のカレンダーに戻す
  window.agendaReset=()=>{if(mode==='month')return;mode='month';render();};
  home.onclick=window.openAgenda;
  FEATURES.push({id:'agenda',name:'予定一覧',where:'カレンダー → 上の「一覧」／今日の画面の下',desc:'今日から先の予定・バイト・課題・試験を日付順で確認。課題を完了にしたり、授業も表示できる',kw:'一覧 スケジュール 予定 課題 締切 これから 先',go:window.openAgenda});
})();

/* 表示の切り替えとボタンを1段にまとめる（カレンダー：月・一覧・時間＋画像・表示／時間割：時間割・一覧＋画像・学期・共有）。
   上の2段がカレンダーの枠を押しつぶしていたので、アイコンの下に短い名前を書いた小さいボタンにして横1列に並べる。読み上げには長い名前 */
(() => {
  const short = (b, txt, ico, label) => {
    if (!b) return;
    b.setAttribute('aria-label', label || b.getAttribute('aria-label') || b.textContent.trim());
    if (ico) b.dataset.ico = ico;
    if (txt != null) b.textContent = txt;
  };
  const row = (sw, bar, cls) => {
    if (!sw || !bar) return;
    const r = document.createElement('div');
    r.className = 'viewRow ' + cls;
    sw.before(r); r.append(sw, bar);
  };
  const cal = $('#agendaSwitch');
  if (cal) {
    const [m, l, t] = cal.querySelectorAll('button');
    short(m, '月', 'grid', 'カレンダー'); short(l, '一覧', 'list', '予定一覧'); short(t, '時間', 'clock', '時間軸');
    short($('#evPhoto'), '画像', null, '画像から予定を追加');
    row(cal, $('#calBar'), 'calViewRow');
  }
  const grid = $('#courseViewSwitch');
  if (grid) {
    const [g, l] = grid.querySelectorAll('button');
    short(g, '時間割', 'grid', '時間割'); short(l, '一覧', 'list', '授業一覧');
    short($('#gridImport'), '画像'); short($('#gridTerm'), '学期'); short($('#gridShare'), '共有');
    row(grid, $('#gridBar'), 'gridViewRow');
  }
  // 授業一覧の「出欠／成績・単位」「すべて／要注意」も同じ段の右へ（一覧では「画像」「学期」「共有」が消えて空くので）。
  // それぞれ1つのかたまりにして、押した方に切り替わる。選んでる方をもう一度押しても、もう片方に切り替わる
  const gRow = $('.gridViewRow'), gTabs = $('.gradeTabs'), filt = $('.courseOverviewTools > [role=group]');
  if (gRow && gTabs && filt) {
    const box = document.createElement('div'); box.className = 'listToggles';
    filt.classList.add('listFilter');
    short(gTabs.querySelector('[data-grade-tab="grades"]'), '成績', null, '成績・単位');
    box.append(gTabs, filt); gRow.append(box);
    box.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (b?.getAttribute('aria-pressed') !== 'true') return;
      const other = [...b.parentElement.querySelectorAll('button')].find(x => x !== b);
      if (other) { e.stopPropagation(); other.click(); }
    }, true);
    filt.addEventListener('click', e => {
      const b = e.target.closest('[data-course-filter]'); if (!b) return;
      courseOverviewFilter = b.dataset.courseFilter; renderCourseOverview();
    });
  }
})();
