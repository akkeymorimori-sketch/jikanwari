/* 授業候補共有の最小版。朝のローカル確認専用。本番では入口も通信も無効。 */
(() => {
  // アプリ（iOS・Android）の中は hostname が localhost なので、ネイティブでは必ず止める
  if (window.Capacitor?.isNativePlatform?.() || !['localhost','127.0.0.1','[::1]'].includes(location.hostname) || window.COMMUNITY_LOCAL_TEST !== true) return;
  const stylesheet=document.createElement('link');stylesheet.rel='stylesheet';stylesheet.href='community-courses.css?v=1';document.head.append(stylesheet);
  const fields = ['name','day','period','periodEnd','room','teacher','credits','code'];
  const labels = {name:'科目名',day:'曜日（0＝月〜5＝土）',period:'開始時限',periodEnd:'終了時限',room:'通常の教室',teacher:'担当教員名',credits:'単位数（不明なら空欄）',code:'科目コード'};
  let config, rows=[], results=[], busy=false, targetId='';
  const call = async data => {
    if (typeof window.communityTransport !== 'function') throw new Error('ローカルの接続が未設定だよ');
    return window.communityTransport(data);
  };
  const el = (tag, text, attrs={}) => Object.assign(document.createElement(tag),{textContent:text,...attrs});
  const dlg=el('dialog','',{id:'communityDlg'});
  const title=el('h2','授業候補を共有');
  const close=el('button','閉じる',{type:'button'}); close.onclick=()=>dlg.close();
  const notice=el('p','選んで確認した授業だけを共有するよ。教員名も公開される情報だよ。学生名、連絡先、研究室、メモや写真は送らないでね。');
  const status=el('p','',{role:'status',id:'communityStatus'});
  const body=el('div','',{id:'communityBody'}), context=el('div','');
  const university=el('select','',{id:'communityUniversity'}), year=el('input','',{id:'communityYear',type:'number',min:'2000',max:'2100',value:'2026'}), semester=el('select','',{id:'communitySemester'});
  function label(text,input) { const l=el('label',text); l.append(input); return l; }
  context.append(label('大学',university),label('年度',year),label('大学共通の学期',semester));
  const nav=el('div','',{className:'ccBottom'});
  function button(name,fn,parent=nav) { const b=el('button',name,{type:'button'}); b.onclick=()=>run(fn); parent.append(b); return b; }
  async function run(fn) {
    if (busy) return;
    busy=true; status.textContent='確認中…';
    try { await fn(); if(status.textContent==='確認中…') status.textContent=''; }
    catch(e) { status.textContent=e.message || '処理できなかったよ'; }
    finally {busy=false;}
  }
  dlg.append(title,close,notice,context,nav,status,body); document.body.append(dlg);
  const eligible = c => c.name && c.day>=0 && !c.catalog;
  function preview(all=false) {
    const t=state.terms.find(t=>t.id===targetId);
    rows=(t?.courses || []).filter(eligible).map(c=>({
      selected:all, source:c.shareOrigin==='photo'?'photo':'manual', imported:!!c.community,
      course:{name:c.name,day:c.day,period:c.period,periodEnd:endPeriod(c),room:c.room || '',teacher:c.teacher || '',credits:c.credits===''||c.credits==null?'':Number(c.credits),code:''}
    }));
    body.replaceChildren(el('p',`${rows.length}件。大学・年度・共通学期と、分割後の各コマを確認してね。保留・削除した大学カタログ由来の授業は対象にしないよ。`));
    rows.forEach(row=>{
      const box=el('fieldset','');
      const selected=el('input','',{type:'checkbox',checked:row.selected});
      selected.onchange=()=>row.selected=selected.checked;
      box.append(label('この授業を共有する',selected));
      for (const k of fields) {
        const numeric=['day','period','periodEnd','credits'].includes(k);
        const input=el('input','',{type:numeric?'number':'text',value:String(row.course[k]),maxLength:100});
        input.dataset.field=k;
        input.oninput=()=>row.course[k]=numeric && input.value!==''?Number(input.value):input.value;
        box.append(label(labels[k],input));
      }
      box.append(el('p',row.imported?'共有候補からの取り込み：独立した一致には数えないよ':row.source==='photo'?'写真読み取りから確認した項目（画像は送らない）':'本人が確認した手入力の項目'));
      body.append(box);
    });
    const consent=el('input','',{type:'checkbox',id:'communityConsent'});
    body.append(label('大学・年度・学期と公開内容を確認し、選択した項目の共有に同意する',consent));
    button('この内容で共有',async()=>{
      if(!consent.checked) throw new Error('公開内容を確認して同意してね');
      const selected=rows.filter(r=>r.selected);
      if(!selected.length) throw new Error('共有する授業を選んでね');
      if(!university.value || !semester.value) throw new Error('大学と共通学期を選んでね');
      let sent=0;
      // 各投稿の成否を保持し、途中失敗でも送信済み授業の再送を避ける。
      for(const row of selected) {
        await call({op:'submit',consent:true,source:row.source,imported:row.imported,course:{university:university.value,year:Number(year.value),semester:semester.value,...row.course}});
        row.selected=false; sent++;
      }
      body.replaceChildren(el('p',`${sent}件を提供したよ。開始時は運営の確認待ちになるよ。`));
    },body);
  }
  function filters() {
    const day=el('select','',{id:'communityDay'}),period=el('input','',{id:'communityPeriod',type:'number',min:'1',max:'10',value:'1'});
    ['月','火','水','木','金','土'].forEach((d,i)=>day.append(el('option',d,{value:String(i)})));
    body.replaceChildren(label('曜日',day),label('時限',period));
    const list=el('div','',{id:'communityResults'}); body.append(list);
    button('候補を検索',async()=>{
      results=await call({op:'search',filter:{university:university.value,year:Number(year.value),semester:semester.value,day:Number(day.value),period:Number(period.value)}});
      list.replaceChildren(el('p',`${results.length}件（最大50件）。投稿一致は大学の公式確認ではないよ。`));
      for (const row of results) {
        const card=el('section','');
        card.append(el('h3',row.name),el('p',row.verification==='matched'?'確認済み（投稿一致）：基本6項目のみ':'ユーザー提供・未確認'));
        if(Number.isFinite(row.providedAt)) card.append(el('p',`提供元：利用者の${row.source==='photo'?'写真読み取りから確認した項目':'手入力'}／提供日：${new Date(row.providedAt).toLocaleDateString('ja-JP',{timeZone:'Asia/Tokyo'})}（大学からの取得・公式確認ではないよ）`));
        for(const k of ['room','teacher','credits','code']) card.append(el('p',`${labels[k]}：${row[k] === ''?'不明':row[k]}（${row.auxiliary[k]==='matched'?'投稿一致':'未確認'}）`));
        button('自分の時間割に追加',async()=>{
          const fresh=await call({op:'get',id:row.id,version:row.version});
          const t=state.terms.find(t=>t.id===targetId);
          if(!t) throw new Error('追加先の学期が見つからないよ');
          if(t.courses.some(c=>c.community?.id===fresh.id && c.community.version===fresh.version)) throw new Error('この候補は登録済みだよ');
          t.courses.push(newCourse(fresh.day,fresh.period,{name:fresh.name,periodEnd:fresh.periodEnd,room:fresh.room,teacher:fresh.teacher,credits:fresh.credits,community:{id:fresh.id,version:fresh.version}}));
          scheduleChanged(); status.textContent='自分の時間割に追加したよ。後から候補が変わっても自動で書き換わらないよ';
        },card);
        button('情報が違う',async()=>{
          const form=el('fieldset','');
          const kind=el('select',''),correction=el('input','',{type:'text',maxLength:200});
          Object.entries({name:'科目名',day:'曜日',period:'時限',room:'教室',teacher:'担当',duplicate:'重複',privacy:'個人情報',other:'その他'}).forEach(([value,name])=>kind.append(el('option',name,{value})));
          form.append(label('誤りの種類',kind),label('訂正案（連絡先は書かないでね）',correction));
          button('この内容で報告',async()=>{ await call({op:'report',id:row.id,version:row.version,kind:kind.value,correction:correction.value}); card.replaceChildren(el('p','報告を受け付けたよ。この候補は運営の確認まで非表示になるよ')); },form);
          card.append(form);
        },card);
        list.append(card);
      }
    },body);
  }
  async function mine() {
    const list=await call({op:'mine'}); body.replaceChildren(el('h3','自分の提供'));
    for(const row of list) {
      const card=el('section',`${row.course.name}：${row.active?'提供中':'取り下げ済み'}`);
      if(row.active) button('提供を取り下げる',async()=>{await call({op:'withdraw',id:row.candidate}); await mine();},card);
      body.append(card);
    }
  }
  async function admin() {
    const data=await call({op:'admin'}); body.replaceChildren(el('h3','運営確認'),el('p',`未処理の報告：${data.reports.length}件。投稿者の情報はこの運営画面だけに表示するよ。`));
    button('手動モードにする',async()=>{await call({op:'mode',automatic:false});status.textContent='手動モードにしたよ';},body);
    const autoConsent=el('input','',{type:'checkbox'});body.append(label('通報対応・禁止情報・同時投稿の確認が済み、自動掲載への切替えを認める',autoConsent));
    button('自動モードにする',async()=>{if(!autoConsent.checked)throw new Error('切替条件を確認してね');await call({op:'mode',automatic:true});status.textContent='自動モードにしたよ';},body);
    for(const row of data.candidates) {
      const card=el('fieldset',''), entries=Object.values(row.entries), c=row.override||entries[0]?.course;
      card.append(el('h3',c?.name || '授業'),el('p',`版${row.version}／${row.blocked?'掲載停止':'停止なし'}／有効な投稿${entries.filter(e=>e.active).length}件`));
      const details=el('pre',JSON.stringify({entries:row.entries,reports:data.reports.filter(r=>r.candidate===row.id)},null,2));card.append(details);
      const reason=el('input','',{maxLength:200});card.append(label('判断した理由',reason));
      for(const [decision,name] of [['publish','掲載・再掲載'],['stop','掲載停止'],['delete','掲載終了（削除判断）']]) button(name,async()=>{await call({op:'moderate',id:row.id,decision,reason:reason.value});await admin();},card);
      const edit=el('textarea','',{value:JSON.stringify(c,null,2),rows:8});card.append(label('事実項目の訂正',edit));
      button('訂正して新しい版を掲載',async()=>{await call({op:'moderate',id:row.id,decision:'correct',reason:reason.value,course:JSON.parse(edit.value)});await admin();},card);
      body.append(card);
    }
  }
  university.onchange=()=>{
    semester.replaceChildren(el('option','学期を選ぶ',{value:''}));
    for(const s of config?.universities[university.value]?.semesters || []) semester.append(el('option',s,{value:s}));
  };
  button('まとめて共有',()=>preview(true));button('授業を選ぶ',()=>preview(false));button('候補を探す',filters);button('自分の提供・取り下げ',mine);button('運営確認',admin);
  async function open() {
    targetId=term().id;
    if(!dlg.open)dlg.showModal();
    await run(async()=>{
      config=await call({op:'config'});
      university.replaceChildren(el('option','大学を選ぶ',{value:''}));
      Object.entries(config.universities).forEach(([value,c])=>university.append(el('option',c.name,{value})));
      university.onchange();
      body.replaceChildren(el('p','共有方法か候補検索を選んでね。表示しただけでは授業を送らないよ。'));
    });
  }
  window.communityRegistrationFinished=async()=>{
    // このフラグは共有同意とは別。案内の表示だけでは授業を送らない。
    if(state.communityPromptSeen || localStorage.getItem('community-prompt-seen')) {
      state.communityPromptSeen=true;
      try { await call({op:'prompt',seen:true}); } catch { /* ログイン後の次回に統合 */ }
      return;
    }
    if(typeof window.communityTransport==='function') {
      try { const remote=await call({op:'prompt'}); if(remote.seen){state.communityPromptSeen=true;save();return;} } catch { return; }
    }
    state.communityPromptSeen=true;localStorage.setItem('community-prompt-seen','1');save();
    try { await call({op:'prompt',seen:true}); } catch { /* 端末内の案内済み状態を保持 */ }
    targetId=term().id; if(!dlg.open)dlg.showModal();
    body.replaceChildren(el('p','同じ大学の人のために候補として共有しますか？ 投稿者の名前などは公開されません。'));
    // 案内だけでは選択・送信しない。先に大学設定を読み込む。
    await run(async()=>{config=await call({op:'config'});university.replaceChildren(el('option','大学を選ぶ',{value:''}));Object.entries(config.universities).forEach(([value,c])=>university.append(el('option',c.name,{value})));university.onchange();});
  };
  button('今はしない',()=>dlg.close());
  const entry=el('div','',{className:'ccEntry',id:'communityEntry'});
  button('時間割の登録を終える',()=>window.communityRegistrationFinished(),entry);
  button('利用者の授業候補・共有',open,entry);$('#grid').before(entry);
  window.openCommunityCourses=open;
})();
