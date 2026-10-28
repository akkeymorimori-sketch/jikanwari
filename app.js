// 今日は何の日（1日1つ）
// 記念日の一部はWikipedia「日本の記念日一覧」を参考にしています
const FUN_DAYS = {
  '01-01': '鉄腕アトムの日',
  '01-02': '初夢の日',
  '01-03': '駆け落ちの日',
  '01-04': '石の日',
  '01-05': 'いちごの日',
  '01-06': 'ショートケーキの日',
  '01-07': '爪切りの日',
  '01-08': '勝負事の日',
  '01-09': 'とんちの日',
  '01-10': '明太子の日',
  '01-11': '塩の日',
  '01-12': '桜島の日',
  '01-13': 'たばこの日',
  '01-14': 'タロとジロの日',
  '01-15': 'フードドライブの日',
  '01-16': '禁酒の日',
  '01-17': 'おむすびの日',
  '01-18': '振袖火事の日',
  '01-19': 'カラオケの日',
  '01-20': '玉の輿の日',
  '01-21': '料理番組の日',
  '01-22': '飛行船の日',
  '01-23': 'アーモンドの日',
  '01-24': 'すき焼きの日',
  '01-25': '左遷の日',
  '01-26': 'パーキングメーターの日',
  '01-27': '求婚の日',
  '01-28': '衣類乾燥機の日',
  '01-29': 'タウン情報の日',
  '01-30': '3分間電話の日',
  '01-31': '愛妻家の日',
  '02-01': 'ニオイの日',
  '02-02': 'ツインテールの日',
  '02-03': '大岡越前の日',
  '02-04': '西の日',
  '02-05': 'ピカチュウの日',
  '02-06': 'ブログの日',
  '02-07': '北方領土の日',
  '02-08': 'ロカビリーの日',
  '02-09': '服の日',
  '02-10': '太物の日',
  '02-11': 'わんこそば記念日',
  '02-12': 'ブラジャーの日',
  '02-13': '銀行強盗の日',
  '02-14': 'ふんどしの日',
  '02-15': '春一番名づけの日',
  '02-16': '寒天の日',
  '02-17': '天使のささやきの日',
  '02-18': 'エアメールの日',
  '02-19': 'プロレスの日',
  '02-20': '旅券の日',
  '02-21': '漱石の日',
  '02-22': '食器洗い乾燥機の日',
  '02-23': 'ふろしきの日',
  '02-24': '月光仮面登場の日',
  '02-25': '夕刊紙の日',
  '02-26': 'シティーハンターの日',
  '02-27': '新選組の日',
  '02-28': 'バカヤローの日',
  '02-29': '閏肉の日',
  '03-01': '労働法施行記念日',
  '03-02': 'ミニチュアの日',
  '03-03': '金魚の日',
  '03-04': '三線の日',
  '03-05': 'スチュワーデスの日',
  '03-06': '弟の日',
  '03-07': '消防記念日',
  '03-08': 'エスカレーターの日',
  '03-09': '記念切手記念日',
  '03-10': 'サボテンの日',
  '03-11': 'コラムの日',
  '03-12': 'サイフの日',
  '03-13': '青函トンネル開業記念日',
  '03-14': 'πの日',
  '03-15': '靴の記念日',
  '03-16': '国立公園指定記念日',
  '03-17': '漫画週刊誌の日',
  '03-18': '精霊の日',
  '03-19': 'ミュージックの日',
  '03-20': '電卓の日',
  '03-21': 'ランドセルの日',
  '03-22': '放送記念日',
  '03-23': 'スジャータの日',
  '03-24': 'マネキン記念日',
  '03-25': '電気記念日',
  '03-26': 'カチューシャの歌の日',
  '03-27': 'さくらの日',
  '03-28': '三つ葉の日',
  '03-29': 'マリモの日',
  '03-30': '信長の野望の日',
  '03-31': '経理の日',
  '04-01': '建設業DX推進の日',
  '04-02': '歯列矯正の日',
  '04-03': 'シーサーの日',
  '04-04': '脂肪0％ヨーグルトの日',
  '04-05': '横町の日',
  '04-06': 'パネルクイズ アタック25の日',
  '04-07': 'スーチーパイの日',
  '04-08': '折り紙供養の日',
  '04-09': '左官の日',
  '04-10': '良い戸の日',
  '04-11': 'ガッツポーズの日',
  '04-12': 'タイルの日',
  '04-13': '決闘の日',
  '04-14': 'オレンジデー',
  '04-15': 'ヘリコプターの日',
  '04-16': '女子マラソンの日',
  '04-17': '恐竜の日',
  '04-18': 'お香の日',
  '04-19': '地図の日',
  '04-20': '女子大の日',
  '04-21': 'オーベルジュの日',
  '04-22': '道の駅の日',
  '04-23': '地ビールの日',
  '04-24': '植物学の日',
  '04-25': '拾得物の日',
  '04-26': 'よい風呂の日',
  '04-27': '悪妻の日',
  '04-28': '象の日',
  '04-29': '羊肉の日',
  '04-30': '図書館記念日',
  '05-01': '語彙の日',
  '05-02': 'エンピツ記念日',
  '05-03': 'ゴミの日',
  '05-04': 'ラムネの日',
  '05-05': 'ジャグラーの日',
  '05-06': 'コロコロの日',
  '05-07': '粉の日',
  '05-08': '御用の日',
  '05-09': '悟空の日',
  '05-10': 'メイドの日',
  '05-11': '長良川鵜飼開きの日',
  '05-12': 'アセロラの日',
  '05-13': '2文字スピーチの日',
  '05-14': 'けん玉の日',
  '05-15': 'ストッキングの日',
  '05-16': '旅の日',
  '05-17': 'パック旅行の日',
  '05-18': 'ことばの日',
  '05-19': 'チャンピオンの日',
  '05-20': 'ローマ字の日',
  '05-21': '小学校開校の日',
  '05-22': 'ガールスカウトの日',
  '05-23': 'ラブレターの日',
  '05-24': '伊達巻の日',
  '05-25': '広辞苑記念日',
  '05-26': 'ラッキーゾーンの日',
  '05-27': 'ドラゴンクエストの日',
  '05-28': 'ゴルフ記念日',
  '05-29': 'こんにゃくの日',
  '05-30': '掃除機の日',
  '05-31': '古材の日',
  '06-01': 'TUBEの日',
  '06-02': '裏切りの日',
  '06-03': 'ケロミンの日',
  '06-04': '佐土原なすの日',
  '06-05': '環境の日',
  '06-06': 'ケロケロの日',
  '06-07': 'むち打ち治療の日',
  '06-08': 'ガパオの日',
  '06-09': 'ロックの日',
  '06-10': '歩行者天国の日',
  '06-11': '雨漏り点検の日',
  '06-12': 'バザー記念日',
  '06-13': 'いいみょうがの日',
  '06-14': '手羽先記念日',
  '06-15': 'オウムとインコの日',
  '06-16': '無重力の日',
  '06-17': 'おまわりさんの日',
  '06-18': '海外移住の日',
  '06-19': 'ロマンスの日',
  '06-20': 'ペパーミントデー',
  '06-21': 'スナックの日',
  '06-22': 'かにの日',
  '06-23': '沖縄慰霊の日',
  '06-24': 'UFO記念日',
  '06-25': '百合の日',
  '06-26': '世界格闘技の日',
  '06-27': 'ハピカジの日',
  '06-28': 'パフェの日',
  '06-29': '佃煮の日',
  '06-30': '集団疎開の日',
  '07-01': 'ナビの日',
  '07-02': 'たわしの日',
  '07-03': '通天閣の日',
  '07-04': 'メタルなかよしの日',
  '07-05': '穴子の日',
  '07-06': 'ゼロ戦の日',
  '07-07': 'リアル脱出ゲームの日',
  '07-08': 'ナンパの日',
  '07-09': 'ジェットコースターの日',
  '07-10': 'ブナピーの日',
  '07-11': 'ラーメンの日',
  '07-12': '人間ドックの日',
  '07-13': 'オカルト記念日',
  '07-14': '求人広告の日',
  '07-15': 'ファミコンの日',
  '07-16': '国土交通Day',
  '07-17': '東京の日',
  '07-18': '光化学スモッグの日',
  '07-19': 'カープ黄金時代幕開けの日',
  '07-20': 'Tシャツの日',
  '07-21': '自然公園の日',
  '07-22': 'ONE PIECEの日',
  '07-23': '米騒動の日',
  '07-24': '卒業アルバムの日',
  '07-25': 'うま味調味料の日',
  '07-26': '幽霊の日',
  '07-27': 'スイカの日',
  '07-28': '菜っ葉の日',
  '07-29': '白だしの日',
  '07-30': '梅干の日',
  '07-31': 'パラグライダー記念日',
  '08-01': '麻雀の日',
  '08-02': 'パンツの日',
  '08-03': '「共創する未来」の日',
  '08-04': '箸の日',
  '08-05': 'ハードコアテクノの日',
  '08-06': 'ハムスターの日',
  '08-07': 'バナナの日',
  '08-08': 'プチプチの日',
  '08-09': 'パソコン救急の日',
  '08-10': 'シャウエッセンの日',
  '08-11': 'オフ会記念日',
  '08-12': '君が代記念日',
  '08-13': '深読みの日',
  '08-14': 'ハッピーサマーバレンタインデー',
  '08-15': '終戦の日',
  '08-16': '電子コミックの日',
  '08-17': 'プロ野球ナイター記念日',
  '08-18': '高校野球記念日',
  '08-19': 'ハイキューの日',
  '08-20': '蚊の日',
  '08-21': '女子大生の日',
  '08-22': '居心地の日',
  '08-23': '白虎隊の日',
  '08-24': '大噴火の日',
  '08-25': '即席ラーメン記念日',
  '08-26': 'パワプロの日',
  '08-27': '寅さんの日',
  '08-28': 'バイオリンの日',
  '08-29': 'ケーブルカーの日',
  '08-30': '冒険家の日',
  '08-31': '野菜の日',
  '09-01': 'だじゃれの日',
  '09-02': '宝くじの日',
  '09-03': '草野球の日',
  '09-04': 'くしの日',
  '09-05': '国民栄誉賞の日',
  '09-06': '黒豆の日',
  '09-07': 'CMソングの日',
  '09-08': 'クーパー靱帯の日',
  '09-09': 'チョロQの日',
  '09-10': '屋外広告の日',
  '09-11': '公衆電話の日',
  '09-12': '宇宙の日',
  '09-13': '司法保護記念日',
  '09-14': 'メンズバレンタインデー',
  '09-15': 'ひじきの日',
  '09-16': '競馬の日',
  '09-17': 'モノレール開業記念日',
  '09-18': 'かいわれ大根の日',
  '09-19': '苗字の日',
  '09-20': 'お手玉の日',
  '09-21': 'ガトーショコラの日',
  '09-22': '孤児院の日',
  '09-23': '万年筆の日',
  '09-24': '清掃の日',
  '09-25': '10円カレーの日',
  '09-26': 'ワープロの日',
  '09-27': 'きぶなの日',
  '09-28': 'パソコン記念日',
  '09-29': '招き猫の日',
  '09-30': 'クレーンの日',
  '10-01': '浄化槽の日',
  '10-02': '望遠鏡の日',
  '10-03': 'アンパンマンの日',
  '10-04': '探し物の日',
  '10-05': '時刻表記念日',
  '10-06': '国際協力の日',
  '10-07': 'ミステリー記念日',
  '10-08': '入れ歯の日',
  '10-09': '土偶の日',
  '10-10': '冷凍めんの日',
  '10-11': '先住犬の日',
  '10-12': '石油機器点検の日',
  '10-13': '麻酔の日',
  '10-14': '鉄道の日',
  '10-15': 'ぞうりの日',
  '10-16': 'ボスの日',
  '10-17': '沖縄そばの日',
  '10-18': 'フラフープ記念日',
  '10-19': '相続税を考える日',
  '10-20': '頭髪の日',
  '10-21': 'あかりの日',
  '10-22': '絹婚記念日',
  '10-23': '津軽弁の日',
  '10-24': '文鳥の日',
  '10-25': 'リクエストの日',
  '10-26': 'サーカスの日',
  '10-27': '世界新記録の日',
  '10-28': '速記記念日',
  '10-29': 'ホームビデオ記念日',
  '10-30': '初恋の日',
  '10-31': '陶彩の日',
  '11-01': 'カーペットの日',
  '11-02': 'タイツの日',
  '11-03': '赤べこの日',
  '11-04': 'かき揚げの日',
  '11-05': '電報の日',
  '11-06': 'お見合い記念日',
  '11-07': '国有財産の日',
  '11-08': '梱包の日',
  '11-09': '歯ぐきの日',
  '11-10': '無電柱化の日',
  '11-11': 'チンアナゴの日',
  '11-12': '皮膚の日',
  '11-13': 'うるしの日',
  '11-14': 'パチンコの日',
  '11-15': 'こんぶの日',
  '11-16': '幼稚園記念日',
  '11-17': '蓮根の日',
  '11-18': '音楽著作権の日',
  '11-19': '緑のおばさんの日',
  '11-20': '毛皮の日',
  '11-21': 'イーブイの日',
  '11-22': '回転寿司記念日',
  '11-23': 'カキの日',
  '11-24': '鰹節の日',
  '11-25': 'ハイビジョンの日',
  '11-26': 'ビン牛乳の日',
  '11-27': 'いい鮒の日',
  '11-28': '税関記念日',
  '11-29': 'いい服の日',
  '11-30': '本みりんの日',
  '12-01': 'カイロの日',
  '12-02': 'ビフィズス菌の日',
  '12-03': 'ひっつみの日',
  '12-04': 'E.T.の日',
  '12-05': 'アルバムの日',
  '12-06': '姉の日',
  '12-07': 'クリスマスツリーの日',
  '12-08': '有機農業の日',
  '12-09': '障害者の日',
  '12-10': 'ごめんねの日',
  '12-11': 'タンゴの日',
  '12-12': 'バッテリーの日',
  '12-13': '双子の日',
  '12-14': '討ち入りの日',
  '12-15': '観光バス記念日',
  '12-16': '紙の記念日',
  '12-17': '飛行機の日',
  '12-18': '東京駅の日',
  '12-19': '日本初飛行の日',
  '12-20': 'シーラカンスの日',
  '12-21': '遠距離恋愛の日',
  '12-22': '労働組合法制定記念日',
  '12-23': 'テレホンカードの日',
  '12-24': '学校給食記念日',
  '12-25': 'スケートの日',
  '12-26': '雪印の日',
  '12-27': '浅草仲見世記念日',
  '12-28': 'シネマトグラフの日',
  '12-29': 'シャンソンの日',
  '12-30': '地下鉄記念日',
  '12-31': 'ベルボトム・ジーンズの日',
};

'use strict';

window.addEventListener('error', e => alert(`エラー：${e.message}\n${e.lineno}行目`));

/* ===== 基本 ===== */
const $ = s => document.querySelector(s);
const DAYS = ['月', '火', '水', '木', '金', '土'];
const WEEK = ['日', '月', '火', '水', '木', '金', '土'];
const KEY = 'jikanwari-v2';
const OLD_KEY = 'jikanwari-v1';
// 設定でオン/オフできる機能（時間割は前からある state.useGrid）。オフでもデータは消さない
const FEAT_KEYS = ['job', 'group', 'share', 'diary', 'todo', 'memo', 'habit', 'points', 'alarm', 'ai', 'exam'];
const featOn = k => k === 'grid' ? state.useGrid !== false : state?.features?.[k] !== false;
const SEARCH_DAYS = 120; // 長期休みをまたいで次の授業を探す日数
const HISTORY_MAX = 60;  // 持ち物の入力候補として覚えておく数

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
const isYmd = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
const todayStr = () => ymd(new Date());
const dayIndex = d => (d.getDay() + 6) % 7; // 月=0 … 日=6
const addDays = (d, k) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + k);
const md = d => `${d.getMonth() + 1}/${d.getDate()}(${WEEK[d.getDay()]})`;
const hm = d => `${d.getHours()}:${pad(d.getMinutes())}`;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const isHttp = s => /^https?:\/\//i.test(s || '');
// 金額を整数に（「12,345円」みたいな文字でもOK、読めなければ null）
const toYen = v => {
  if (v == null || v === '') return null;
  const n = +String(v).replace(/[,，円¥\s]/g, '');
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : null;
};

const DEFAULT_TIMES = [
  ['09:10', '10:40'], ['10:50', '12:20'], ['13:20', '14:50'], ['15:00', '16:30'],
  ['16:40', '18:10'], ['18:20', '19:50'], ['20:00', '21:30'], ['', ''], ['', ''], ['', '']
];

const PROVIDERS = {
  gemini: {
    label: 'Gemini（Google AI Studio・無料枠あり）',
    url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    model: 'gemini-3.5-flash-lite',
    models: ['gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-3.8-flash'],
    keyUrl: 'https://aistudio.google.com/apikey',
    note: '無料枠では送った画像が Google の製品改善に使われる。'
  },
  openrouter: {
    label: 'OpenRouter（無料モデルあり）',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: '',
    models: [],
    keyUrl: 'https://openrouter.ai/collections/free-models',
    note: '画像に対応した無料モデルのIDを一覧から選んで入れてね。'
  },
  claude: {
    label: 'Claude（有料）',
    url: 'https://api.anthropic.com/v1/messages',
    model: 'claude-sonnet-5-5',
    models: ['claude-sonnet-5-5', 'claude-opus-5-5', 'claude-haiku-5-5'],
    keyUrl: 'https://platform.claude.com/',
    note: ''
  }
};

// 混雑時に切り替える予備のモデル（今はなし）
const FALLBACK_MODEL = {};

/* ===== テーマ ===== */
const COLORS = ['blue', 'green', 'pink', 'red', 'purple', 'yellow', 'gray'];
const FONTS = ['system', 'maru', 'mincho'];
function applyTheme(th) {
  const r = document.documentElement;
  if (th.color === 'blue') delete r.dataset.color; else r.dataset.color = th.color;
  if (th.font === 'system') delete r.dataset.font; else r.dataset.font = th.font;
}

/* ===== データ ===== */
let state;

let brokenSaved = false;
function readJSON(k) {
  const raw = localStorage.getItem(k);
  if (raw == null) return null;
  try { return JSON.parse(raw); }
  catch {
    // 壊れたデータは消さずに別名で残す
    try { localStorage.setItem(`${k}-broken-${Date.now()}`, raw); brokenSaved = true; } catch {}
    return null;
  }
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
  ({ id: uid(), name, start, end, offDays: [], swaps: [], cancels: [], courses });

// day = -1 は集中講義
const newCourse = (day, period, extra = {}) => ({
  id: uid(), day, period, name: '', short: '', teacher: '', room: '', syllabus: '', from: '', to: '',
  items: [], memos: [], tasks: [], absences: [], maxAbsence: '', tag: '', notes: [], ...extra
});

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
  // おかしなIDや重複したIDは作り直す
  const seen = new Set();
  const fixId = v => {
    let id = typeof v === 'string' && /^[\w-]{1,40}$/.test(v) ? v : uid();
    while (seen.has(id)) id = uid();
    seen.add(id);
    return id;
  };
  s.periods ??= 7;
  s.showSat ??= false;
  s.weekStart = s.weekStart === 'sun' ? 'sun' : 'mon'; // カレンダーの週のはじまり（最初は月曜）
  // カレンダーに出さない予定の出どころ（'me' = 自分の予定、ほかはグループID）。新しいグループは出す
  s.shiftJoin = s.shiftJoin !== false; // シフト表：続いてるコマを1つにまとめる（最初はまとめる）
  // 予定の名前ごとの「いつもの場所」（画像から読んだ予定に場所が書いてないときに使う）
  s.evPlaces = s.evPlaces && typeof s.evPlaces === 'object' && !Array.isArray(s.evPlaces)
    ? Object.fromEntries(Object.entries(s.evPlaces).filter(([k, v]) => k.trim() && typeof v === 'string' && v.trim())
        .slice(0, 100).map(([k, v]) => [k.trim().slice(0, 60), v.trim().slice(0, 60)]))
    : {};
  s.evTapSeen = s.evTapSeen === true; // 「予定をタップすると変更できる」のヒントを見終わった（一度変更した）
  s.calHide = Array.isArray(s.calHide) ? [...new Set(s.calHide.filter(x => typeof x === 'string' && x))].slice(0, 50) : [];
  if (!s.shiftDefaultOn) { s.shiftTimes = true; s.shiftDefaultOn = true; } // 時刻ずらしは最初ON
  s.syllabusSearch ??= '';
  s.lastExport ??= 0;
  s.itemHistory = Array.isArray(s.itemHistory) ? s.itemHistory.filter(x => typeof x === 'string') : [];
  s.times ??= [];
  for (let i = 0; i < 10; i++) {
    s.times[i] ??= { start: DEFAULT_TIMES[i][0], end: DEFAULT_TIMES[i][1] };
  }
  if (!PROVIDERS[s.provider]) s.provider = 'gemini';
  s.keys ??= {};
  s.models ??= {};
  s.packChecks ??= {};

  // 前に3.8を保存してたら、1回だけ3.5に戻す
  if (!s.geminiDefault35) {
    if (s.models.gemini === 'gemini-3.8-flash') delete s.models.gemini;
    s.geminiDefault35 = true;
  }
  // 3.5 Flash は廃止されて 3.6 Flash に転送されるようになったので、直接 3.6 を呼ぶ
  if (s.models.gemini === 'gemini-3.5-flash') s.models.gemini = 'gemini-3.6-flash';

  // テーマ
  s.theme ??= {};
  if (!COLORS.includes(s.theme.color)) s.theme.color = 'blue';
  if (!FONTS.includes(s.theme.font)) s.theme.font = 'system';

  // 授業のタグ（学期をまたいで共通）
  s.tags = Array.isArray(s.tags) ? s.tags.filter(t => t && typeof t.name === 'string' && t.name.trim()) : [];
  for (const t of s.tags) {
    t.id = fixId(t.id);
    t.name = t.name.trim().slice(0, 10);
    if (!TAG_COLORS.includes(t.color)) t.color = TAG_COLORS[0];
  }

  // バイトなどの予定（学期をまたいで共通）
  s.events = Array.isArray(s.events) ? s.events.filter(e => e && isYmd(e.date)) : [];
  for (const e of s.events) {
    e.id = fixId(e.id);
    e.kind = ['job', 'exam', 'other'].includes(e.kind) || /^k-[\w-]{1,40}$/.test(e.kind) ? e.kind : 'job';
    e.title ??= ''; e.start ??= ''; e.end ??= '';
    if (e.src !== 'cal') { delete e.src; delete e.ext; }
    if (typeof e.img !== 'string' || !/^sh-[\w-]+$/.test(e.img)) delete e.img;
    if (typeof e.memo !== 'string' || !e.memo.trim()) delete e.memo; else e.memo = e.memo.slice(0, 2000);
    // 試験と授業の結びつけ（授業のID、または 'none'＝つながない）。なければ名前から当てる
    if (e.kind !== 'exam' || typeof e.cid !== 'string' || !e.cid) delete e.cid;
  }
  // 予定の入力候補（名前・種類・時刻を覚える）
  const hadPresets = Array.isArray(s.evPresets);
  s.evPresets = hadPresets
    ? s.evPresets.filter(p => p && typeof p.title === 'string' && p.title).map(p => ({
        title: p.title, kind: ['other', 'exam'].includes(p.kind) || /^k-[\w-]{1,40}$/.test(p.kind) ? p.kind : 'job', start: p.start || '', end: p.end || ''
      }))
    : [];
  // 前から入ってる予定があれば、そこから候補を作る（初回だけ）
  if (!hadPresets) {
    for (const e of [...s.events].sort((a, b) => b.date.localeCompare(a.date))) {
      if (e.title && !s.evPresets.some(p => p.title === e.title))
        s.evPresets.push({ title: e.title, kind: e.kind, start: e.start, end: e.end });
    }
  }

  // 自分で作った予定の名目
  s.evKinds = Array.isArray(s.evKinds)
    ? s.evKinds.filter(k => k && /^k-[\w-]{1,40}$/.test(k.id) && typeof k.name === 'string' && k.name.trim()) : [];
  for (const k of s.evKinds) {
    k.name = k.name.trim().slice(0, 10);
    if (!/^#[0-9a-f]{6}$/i.test(k.color)) k.color = '#8b5cf6';
  }
  // 消えた名目の予定は「その他」に
  const kindIds = new Set(s.evKinds.map(k => k.id));
  for (const e of s.events) if (e.kind.startsWith('k-') && !kindIds.has(e.kind)) e.kind = 'other';
  for (const p of s.evPresets) if (p.kind.startsWith('k-') && !kindIds.has(p.kind)) p.kind = 'other';

  // バイトの収入（支給日で集計）
  s.incomes = Array.isArray(s.incomes) ? s.incomes.filter(x => x && isYmd(x.date)) : [];
  for (const x of s.incomes) {
    x.id = fixId(x.id);
    x.job = typeof x.job === 'string' ? x.job : '';
    x.month = typeof x.month === 'string' && /^\d{4}-\d{2}$/.test(x.month) ? x.month : '';
    x.gross = toYen(x.gross);
    x.net = toYen(x.net);
  }
  s.incomeLimit = toYen(s.incomeLimit) ?? '';
  // バイト先ごとの時給・休憩（収入の見込み用）
  s.wages = s.wages && typeof s.wages === 'object' && !Array.isArray(s.wages) ? s.wages : {};
  for (const [k, v] of Object.entries(s.wages)) {
    const w = toYen(v && v.w) ?? null, b = Number(v && v.brk);
    const brk = Number.isFinite(b) && b > 0 ? Math.min(Math.round(b), 180) : 0;
    if (w == null && !brk) delete s.wages[k];
    else s.wages[k] = { w, brk };
  }

  delete s.icon;
  delete s.appName;
  if (!Array.isArray(s.terms) || !s.terms.length) s.terms = [newTerm(defaultTermName())];
  for (const t of s.terms) {
    t.id = fixId(t.id);
    t.start ??= '';
    t.end ??= '';
    t.offDays ??= [];
    t.swaps ??= [];
    t.cancels ??= [];
    t.courses ??= [];
    for (const o of t.offDays) o.id = fixId(o.id);
    for (const x of t.swaps) x.id = fixId(x.id);
    for (const c of t.courses) {
      c.id = fixId(c.id);
      c.name ??= ''; c.short ??= ''; c.teacher ??= ''; c.room ??= ''; c.syllabus ??= '';
      c.from ??= ''; c.to ??= '';
      c.tag = typeof c.tag === 'string' ? c.tag : '';
      c.items ??= []; c.memos ??= []; c.tasks ??= []; c.notes = Array.isArray(c.notes) ? c.notes : [];
      c.absences = Array.isArray(c.absences) ? c.absences.filter(isYmd) : [];
      c.lates = Array.isArray(c.lates) ? c.lates.filter(isYmd) : [];
      c.maxAbsence ??= '';
      if (c.maxAbsence !== '' && !Number.isFinite(+c.maxAbsence)) c.maxAbsence = '';
      for (const i of c.items) {
        i.id = fixId(i.id);
        i.type ??= 'next';
        i.added ??= Date.now();
        i.until ??= null;
      }
      for (const k of c.tasks) k.id = fixId(k.id);
      for (const m of c.memos) m.id = fixId(m.id);
    }
    const ids = new Set(t.courses.map(c => c.id));
  t.ondemands = (Array.isArray(t.ondemands) ? t.ondemands : [])
    .filter(x => ids.has(x.courseId) && isYmd(x.date));
  for (const x of t.ondemands) x.id = fixId(x.id);
  }
  // メモ・一言日記・消したバイト先の候補
  s.notes = Array.isArray(s.notes)
    ? s.notes.filter(n => n && typeof n.text === 'string' && n.text.trim() && isYmd(n.date)) : [];
  for (const n of s.notes) { n.id = fixId(n.id); n.pin = !!n.pin; }
  s.diary = s.diary && typeof s.diary === 'object' && !Array.isArray(s.diary) ? s.diary : {};
  for (const k of Object.keys(s.diary))
    if (!isYmd(k) || typeof s.diary[k] !== 'string' || !s.diary[k].trim()) delete s.diary[k];
  s.jobHidden = Array.isArray(s.jobHidden) ? s.jobHidden.filter(v => typeof v === 'string') : [];
  // 授業なしの課題
  s.myTasks = Array.isArray(s.myTasks) ? s.myTasks.filter(k => k && typeof k.title === 'string') : [];
  for (const k of s.myTasks) { k.id = fixId(k.id); k.done = !!k.done; k.due = isYmd(k.due) ? k.due : ''; }
  // 自分で作った名目
  s.cats = Array.isArray(s.cats) ? s.cats.filter(g => g && typeof g.name === 'string') : [];
  for (const g of s.cats) {
    g.id = /^cat-[\w-]+$/.test(g.id) ? g.id : 'cat-' + uid();
    g.name = g.name.trim().slice(0, 20) || '名目';
    g.short = ''; g.day = null; g.period = null;
    g.tasks = Array.isArray(g.tasks) ? g.tasks.filter(k => k && typeof k.title === 'string') : [];
    for (const k of g.tasks) { k.id = fixId(k.id); k.done = !!k.done; k.due = isYmd(k.due) ? k.due : ''; }
  }
  // ホームに出すタイミング
  const okLead = v => v === 'all' || /^\d{1,2}[dwm]$/.test(v);
  s.taskLead = okLead(s.taskLead) ? s.taskLead : '2w';
  s.useGrid = s.useGrid !== false; // 時間割を使うか（最初はON）
  // 機能ごとのオン/オフ（なければオン＝前から使ってる人は全部オンのまま）。時間割は useGrid
  const fs = s.features && typeof s.features === 'object' ? s.features : {};
  s.features = Object.fromEntries(FEAT_KEYS.map(k => [k, fs[k] !== false]));
  s.onboarded = s.onboarded !== false;
  s.lateRule = [0, 2, 3, 4].includes(s.lateRule) ? s.lateRule : 0; // 遅刻何回で欠席1回か（0は数えない）

  // 通知（アプリ版だけ）
  const nf = s.notify && typeof s.notify === 'object' ? s.notify : {};
  s.notify = {
    on: !!nf.on,
    time: /^([01]\d|2[0-3]):[0-5]\d$/.test(nf.time) ? nf.time : '21:00',
    job: [0, 30, 60, 90, 120].includes(nf.job) ? nf.job : 60,
    exam: nf.exam !== false,
    items: nf.items !== false,
    tasks: nf.tasks !== false,
    events: nf.events !== false,
    tDays: [1, 3, 7].includes(nf.tDays) ? nf.tDays : 3,
    mTime: /^([01]\d|2[0-3]):[0-5]\d$/.test(nf.mTime) ? nf.mTime : '07:30',
    habit: nf.habit !== false,
    fortune: nf.fortune !== false,
      sign: /^(\d|1[01])$/.test(nf.sign) ? nf.sign : '',
    anniv: nf.anniv !== false,
    fun: nf.fun !== false
  };
  // ○○の日（毎年くり返す）
  s.annivs = Array.isArray(s.annivs)
    ? s.annivs.filter(a => a && typeof a.name === 'string' && a.name.trim() && /^\d{2}-\d{2}$/.test(a.md)) : [];
  for (const a of s.annivs) {
    a.id = fixId(a.id);
    a.name = a.name.trim().slice(0, 20);
    a.pre = [0, 1, 3, 7].includes(a.pre) ? a.pre : 0;
  }

  // カレンダーから取り込むシフト（アプリ版だけ）
  const cs = s.calSync && typeof s.calSync === 'object' ? s.calSync : {};
  s.calSync = {
    cals: Array.isArray(cs.cals) ? cs.cals.filter(x => x && typeof x.id === 'string').map(x => ({
      id: x.id, title: String(x.title || '').slice(0, 40), job: String(x.job || '').trim().slice(0, 20)
    })) : [],
    last: typeof cs.last === 'number' ? cs.last : 0
  };
  for (const t of s.terms) for (const c of t.courses) for (const k of c.tasks) k.lead = okLead(k.lead) ? k.lead : '';
  for (const k of s.myTasks) k.lead = okLead(k.lead) ? k.lead : '';
  for (const g of s.cats) for (const k of g.tasks) k.lead = okLead(k.lead) ? k.lead : '';
  if (!s.terms.some(t => t.id === s.currentTermId)) s.currentTermId = s.terms[0].id;
  return s;
}

let saveWarned = false;
function save() {
  try {
    const json = JSON.stringify(state);
    try { localStorage.setItem(KEY, json); }
    catch (err) {
      // 「元に戻す」用のコピーが場所を取ってたら、それを捨ててでも本体を保存する
      if (localStorage.getItem('undoSnap') == null) throw err;
      localStorage.removeItem('undoSnap');
      localStorage.setItem(KEY, json);
    }
    saveWarned = false;
    scheduleNotify();
    wgPush();
    window.alPush?.();
  } catch {
    if (!saveWarned) alert('保存できなかった。空き容量がないか、プライベートブラウズかも。設定から書き出しておいてね');
    saveWarned = true;
  }
}
const term = () => state.terms.find(t => t.id === state.currentTermId);
const courses = () => term().courses;
const modelOf = p => state.models[p] || PROVIDERS[p].model;
// 一覧で使う名前（略名があれば略名）
const nm = c => (c.short || '').trim() || c.name;
// 授業なしの課題（「その他」）は、授業のふりをした入れ物で扱う
const SELF_ID = '__self';
const selfCourse = {
  id: SELF_ID, name: 'その他', short: '', day: null, period: null,
  get tasks() { return state.myTasks; },
  set tasks(v) { state.myTasks = v; }
};

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

// この授業だけ休講か
const isCancelled = (c, date, t = term()) => {
  const k = ymd(date);
  return t.cancels.some(x => x.courseId === c.id && x.date === k);
};

// この授業のこの日はオンデマンドか
const isOnDemand = (c, date, t = term()) => {
  if (c.onDemand) return true;
  const k = ymd(date);
  return (t.ondemands || []).some(x => x.courseId === c.id && x.date === k);
};

// その日にある授業（休講は除く）
function coursesOn(date, t = term()) {
  if (!isClassDay(date, t)) return [];
  const d = effDay(date, t);
  return t.courses.filter(c => c.day === d && !isCancelled(c, date, t)).sort((a, b) => a.period - b.period);
}

// その日に教室へ行く授業（オンデマンドの回は除く）
function attendOn(date, t = term()) {
  const k = ymd(date);
  return coursesOn(date, t).filter(c => !c.onDemand &&
    !(t.ondemands || []).some(x => x.courseId === c.id && x.date === k));
}

// その日に休講になった授業
function cancelledOn(date, t = term()) {
  if (!isClassDay(date, t)) return [];
  const d = effDay(date, t);
  return t.courses.filter(c => c.day === d && isCancelled(c, date, t));
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

const hasClass = (c, date, t) =>
  isClassDay(date, t) && effDay(date, t) === c.day && !isCancelled(c, date, t);

// from より後に始まる、いちばん近い回
function nextOccurrence(c, t = term(), from = new Date()) {
  const base = searchBase(from, t);
  for (let k = 0; k < SEARCH_DAYS; k++) {
    const date = addDays(base, k);
    if (pastEnd(date, t)) break;
    if (!hasClass(c, date, t)) continue;
    const o = occurrence(c, date);
    if (o && o.start > from) return o;
  }
  return null;
}

// この先の授業日（休講の候補用）
function occurrencesAhead(c, n, t = term(), from = new Date()) {
  const out = [], base = searchBase(from, t);
  for (let k = 0; k < SEARCH_DAYS && out.length < n; k++) {
    const date = addDays(base, k);
    if (pastEnd(date, t)) break;
    if (!hasClass(c, date, t)) continue;
    const o = occurrence(c, date);
    if (o && o.end <= from) continue;
    out.push(date);
  }
  return out;
}

// いちばん最近あった回の日付（欠席の初期値）
function lastClassDate(c, t = term(), now = new Date()) {
  for (let k = 0; k < SEARCH_DAYS; k++) {
    const date = addDays(now, -k);
    if (t.start && ymd(date) < t.start) break;
    if (!hasClass(c, date, t)) continue;
    const o = occurrence(c, date);
    if (k === 0 && o && o.start > now) continue;
    return ymd(date);
  }
  return todayStr();
}

// 集中講義：from〜to の日が授業日
function intOn(c, date) {
  if (c.day !== -1 || !c.from) return false;
  const k = ymd(date);
  return k >= c.from && k <= (c.to || c.from);
}
const intsOn = (date, t = term()) => t.courses.filter(c => intOn(c, date));

// 集中講義の「次回だけ」は最終日の終わりで消える
const untilFor = (c, t = term(), from = new Date()) => {
  if (c.day === -1) {
    const last = parseYmd(c.to || c.from);
    if (!last) return null;
    last.setHours(23, 59, 59, 999);
    return last > from ? last.getTime() : null;
  }
  return nextOccurrence(c, t, from)?.end.getTime() ?? null;
};

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

// 時刻・休み・曜日・休講などが変わったときの再計算
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

// 欠席の集計
function absInfo(c) {
  const late = (c.lates || []).length;
  const r = state.lateRule;
  const n = c.absences.length + (r ? Math.floor(late / r) : 0);
  const max = c.maxAbsence === '' ? null : +c.maxAbsence;
  return { n, max, left: max == null ? null : max - n, late };
}

/* ===== シラバス ===== */
// 開くURL（授業ごとのURL → なければ検索ページ）
function syllabusURL(c) {
  if (isHttp(c.syllabus)) return c.syllabus.trim();
  const tpl = state.syllabusSearch.trim();
  if (!isHttp(tpl)) return '';
  return tpl.replace(/\{授業名\}/g, encodeURIComponent(c.name.trim()));
}

function renderSyllabusHint() {
  const c = cur();
  if (!c) return;
  const v = c.syllabus.trim();
  let msg;
  if (v && !isHttp(v)) msg = 'URLは https:// から始まる形で入れてね';
  else if (v) msg = '登録したURLを開くよ';
  else if (isHttp(state.syllabusSearch)) msg = state.syllabusSearch.includes('{授業名}')
    ? `シラバス検索で「${c.name}」を開くよ`
    : '「開く」で授業名をコピーして検索ページを開くよ。検索欄に貼り付けてね';
  else msg = '設定の「シラバス検索」にページのURLを入れておくと、ここから開けるよ';
  $('#cSyllabusHint').textContent = msg;
}

/* ===== 画面：次の授業 ===== */
function upcoming(now) {
  const t = term(), base = searchBase(now, t), list = [];
  for (let k = 0; k < SEARCH_DAYS; k++) {
    const date = addDays(base, k);
    if (pastEnd(date, t)) break;
    for (const c of attendOn(date, t)) {
      const o = occurrence(c, date);
      if (o && o.end > now) list.push({ c, ...o });
    }
    if (list.some(x => x.start > now)) break;
  }
  return list.sort((a, b) => a.start - b.start);
}

function courseLine(x) {
  const its = itemsFor(x.c, x.start);
  const today = ymd(new Date());
  const on = x.c.absences.includes(today);
  const abs = ymd(x.start) === today
    ? ` <button type="button" class="flowAbs${on ? ' on' : ''}" data-abs="${x.c.id}">${on ? '欠席済' : '欠席'}</button>`
    : '';
  return `<div class="nc" data-id="${x.c.id}">` +
    `<b>${esc(nm(x.c))}</b> <small>${esc(x.c.room)}</small>` + abs +
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
  // 時間割を使わないときは、予定とバイトだけ
  if (!state.useGrid) {
    const f = todayFlow(now, { ...t, courses: [] });
    el.innerHTML = `<h2>今日 ${md(now)}</h2>` + examLine(now) + (f || '<p class="muted">これからの予定はないよ</p>') +
      '<button type="button" class="addEv" data-addev>＋ 今日の予定を追加</button>';
    return;
  }
  if (!courses().length) {
    el.innerHTML = '<h2>はじめに</h2><p class="muted">まずは時間割を作ろう</p><div class="startBtns">' +
      '<button data-go="grid" class="primary">手入力で作る</button>' +
      '<button data-go="import">📷 写真から読み込む</button>' +
      '<button data-go="share">共有コードから読み込む</button></div>' +
      '<p class="hint startAlt">時間割はいらない？</p>' +
      '<button data-go="nogrid" class="addEv">予定管理だけで使う</button>';
    return;
  }

  if (termEnded(t, now)) {
    const nt = suggestTerm(now);
    el.innerHTML = `<h2>この学期は終わったよ</h2>` +
      `<p class="muted">${esc(t.name)}は${md(parseYmd(t.end))}で終了</p>` +
      (nt ? `<button data-switch="${nt.id}">「${esc(nt.name)}」に切り替える</button>`
          : '<p class="muted">上の学期の欄で「＋ 新しい学期を作る」を選んでね</p>');
    return;
  }

  let h = '';
  const s = parseYmd(t.start);
  if (s && dayDiff(s, now) > 0) {
    h += `<p class="start">授業開始まで <b>あと${dayDiff(s, now)}日</b>（${md(s)}から）</p>`;
  } else if (inTerm(now, t)) {
    const off = offInfo(now, t);
    if (off) {
      h += `<p class="start">今日は授業なし${off.note ? `（${esc(off.note)}）` : ''}</p>`;
    } else {
      if (effDay(now, t) !== dayIndex(now)) h += `<p class="start">今日は${DAYS[effDay(now, t)]}曜の授業をやる日</p>`;
      const cc = cancelledOn(now, t);
      if (cc.length) h += `<p class="start">今日休講：${cc.map(c => esc(nm(c))).join('、')}</p>`;
    }
  }


  const list = upcoming(now);
  const curList = list.filter(x => x.start <= now);
  const first = list.find(x => x.start > now);
  const nxt = first ? list.filter(x => +x.start === +first.start) : [];
  let body = '';
  if (curList.length) {
    const c = curList[0].c;
    body += `<h2>今の授業 <small>${DAYS[c.day]}${c.period}・あと${fmtLeft(curList[0].end - now)}で終わり</small></h2>` +
      curList.map(courseLine).join('');
  }
  if (nxt.length) {
    const c = nxt[0].c;
    body += `<h2>次の授業 <small>${DAYS[c.day]}${c.period}・${whenLabel(nxt[0].start, now)}</small></h2>` +
      nxt.map(courseLine).join('');
  }
  el.innerHTML = h + examLine(now) + camLine(now, t) + (body || '<h2>次の授業</h2><p class="muted">設定で各時限の時刻を入れると表示されるよ</p>') +
    todayFlow(now, t) + '<button type="button" class="addEv" data-addev>＋ 今日の予定を追加</button>';
}

// 授業の10分前〜終わって15分後は「📷 板書を撮る」を出す（押すとカメラ→その授業の今日のミニノートへ）
const CAM_BEFORE = 10, CAM_AFTER = 15; // 分
function camLine(now, t = term()) {
  const today = ymd(now);
  return attendOn(now, t).filter(c => {
    const o = occurrence(c, now);
    return o && !c.absences.includes(today) &&
      now >= addMin(o.start, -CAM_BEFORE) && now <= addMin(o.end, CAM_AFTER);
  }).map(c => `<button type="button" class="camNow" data-cam="${c.id}">📷 ${esc(nm(c))}の板書を撮る</button>`).join('');
}
const addMin = (d, m) => new Date(d.getTime() + m * 60000);

// 今日の流れ：授業とバイト・予定を時刻順に（全部終わったら出さない）
function todayFlow(now, t = term()) {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const rows = [];
  const today = ymd(now);
  const absBtn = c => {
    const on = c.absences.includes(today);
    return ` <button type="button" class="flowAbs${on ? ' on' : ''}" data-abs="${c.id}">${on ? '欠席済' : '欠席'}</button>`;
  };
  const odBtn = (c, at) => {
    const on = !at.has(c);
    return ` <button type="button" class="flowOd${on ? ' on' : ''}" data-odt="${c.id}">${on ? 'オンデマ' : '対面'}</button>`;
  };
  const at = new Set(attendOn(now, t));
  for (const c of coursesOn(now, t)) {
    const o = occurrence(c, now);
    const a = absInfo(c);
    rows.push({
      min: o ? o.start.getHours() * 60 + o.start.getMinutes() : 2000 + c.period,
      time: o ? hm(o.start) : `${c.period}限`,
      label: `${c.period}限 ${esc(nm(c))}` + odBtn(c, at) +
        (c.room ? ` <small>${esc(c.room)}</small>` : '') +
        (a.left != null && a.left <= 1 ? ` <span class="absWarn">⚠欠席${a.n}/${a.max}</span>` : '') + absBtn(c),
      past: !!o && o.end <= now, id: c.id, cls: 'f-cls'
    });
  }
  for (const c of intsOn(now, t)) {
    rows.push({
      min: -2, time: '集中',
      label: esc(nm(c)) + (c.room ? ` <small>${esc(c.room)}</small>` : '') + absBtn(c),
      past: false, id: c.id, cls: 'f-cls f-int'
    });
  }
  for (const e of eventsOn(ymd(now))) {
    const s = toMin(e.start), en = toMin(e.end);
    const end = e.end ? `〜${en != null && s != null && en <= s ? '翌' : ''}${e.end}` : '';
    rows.push({
      min: s ?? -1, time: e.start || '',
      label: esc(e.title || EV_LABEL[e.kind]) + (end ? ` <small>${esc(end)}</small>` : '') +
        (e.img ? ` <button type="button" class="evImg" data-evimg="${esc(e.img)}" data-label="${esc(md(now) + ' ' + (e.title || 'バイト'))}">📄</button>` : ''),
      past: s != null && en != null && en > s && en <= nowMin, id: '', cls: `f-${e.kind}`
    });
  }
  const left = rows.filter(r => !r.past);
  if (!left.length) return '';
  // 残りが授業1つだけなら「次の授業」と同じなので出さない
  if (left.length === 1 && rows.every(r => r.cls === 'f-cls')) return '';
  rows.sort((a, b) => a.min - b.min);
  return '<h3 class="flowH">今日の流れ</h3><ul class="flow">' + rows.map(r =>
    `<li class="${r.cls}${r.past ? ' past' : ''}"${r.id ? ` data-id="${r.id}"` : ''}>` +
    `<span class="ft">${esc(r.time)}</span><span class="fl">${r.label}</span></li>`).join('') + '</ul>';
}

/* ===== 画面：今日・明日の持ち物 ===== */
let packList = [], packKey = '';

// 今日まだ始まってない授業があれば今日、なければ次の授業日（集中講義も含む）
function packTarget(now) {
  const t = term(), s = parseYmd(t.start);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const later = (c, date) => occurrence(c, date)?.start > now;
  const pending = attendOn(today, t).concat(intsOn(today, t)).some(c => later(c, today));
  const from = pending ? today : addDays(today, 1);
  const span = SEARCH_DAYS + Math.max(0, dayDiff(searchBase(from, t), from));
  const notes = [], seen = new Set();
  const note = (key, text) => { if (!seen.has(key)) { seen.add(key); notes.push(text); } };

  for (let k = 0; k < span; k++) {
    const date = addDays(from, k);
    const isToday = dayDiff(date, now) === 0;
    let cs = [];
    if (inTerm(date, t)) {
      const off = offInfo(date, t);
      if (off) {
        if (t.courses.some(c => c.day === effDay(date, t))) note(off.id, `休み：${offLabel(off)}`);
      } else {
        for (const c of cancelledOn(date, t)) note(`${c.id}@${ymd(date)}`, `休講：${md(date)} ${nm(c)}`);
        cs = attendOn(date, t).filter(c => !isToday || later(c, date));
      }
    }
    cs = cs.concat(intsOn(date, t).filter(c => !isToday || later(c, date)));
    if (cs.length) {
      const ed = effDay(date, t);
      return {
        date, cs, notes, isToday,
        first: !!s && dayDiff(s, now) > 0 && inTerm(date, t),
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
    el.innerHTML = `<h2>持ち物</h2><p class="muted">${msg}</p>`;
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
      if (!e.from.includes(nm(c))) e.from.push(nm(c));
      if (i.type === 'always') e.always = true;
    }
  }
  packList = [...map.values()];
  const done = packList.filter(e => checks[e.text]).length;

  const diff = dayDiff(t.date, now);
  let title = diff === 0 ? `今日 ${md(t.date)}` : diff === 1 ? `明日 ${md(t.date)}` : md(t.date);
  if (t.swapped != null) title += `（${DAYS[t.swapped]}曜授業）`;
  if (t.first) title += '（授業初日）';
  const names = t.cs.map(c => `${c.day === -1 ? '集中' : c.period + '限'} ${esc(nm(c))}`).join('／');
  const noteHint = t.notes.length ? `<p class="hint">${t.notes.map(esc).join('、')}</p>` : '';

  el.innerHTML =
    `<h2>${title}の持ち物 <small>${packList.length ? `${done}/${packList.length}` : ''}</small></h2>` +
    noteHint +
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
let taskAll = false; // 課題を全部表示するか

function renderTasks() {
  const el = $('#taskCard');
  const all = [];
  for (const c of [...courses(), ...taskGroups()]) for (const t of c.tasks) if (!t.done) all.push({ c, t });
  all.sort((a, b) => (a.t.due || '9999').localeCompare(b.t.due || '9999'));
  if (!all.length) {
    el.innerHTML = '<h2>課題</h2><p class="muted">未完了の課題はないよ。カレンダーの日付か、時間割の授業から追加できる</p>';
    return;
  }
  // 普段は「ホームに出す」時期に入った課題だけ
  const vis = all.filter(x => showable(x.t));
  const shown = taskAll ? all : vis;
  const rest = all.length - shown.length;
  el.innerHTML = `<h2>課題 <small>${vis.length}件</small></h2><ul>` + (shown.map(({ c, t }) => {
    const st = dueState(t.due);
    return `<li class="${st.cls}"><label><input type="checkbox" data-task="${t.id}" data-cid="${c.id}">` +
      `<span>${esc(t.title)}</span></label>` +
      `<span class="due" data-id="${c.id}">${esc(nm(c))}・${st.label}</span></li>`;
  }).join('') || '<li class="muted">今やる課題はないよ</li>') + '</ul>' +
    (rest > 0 ? `<button class="more" data-tmore>まだ先の課題${rest}件を表示</button>` : '') +
    (taskAll && vis.length < all.length ? '<button class="more" data-tmore>閉じる</button>' : '');
}


/* ===== 画面：時間割 ===== */
function renderGrid() {
  const days = state.showSat || courses().some(c => c.day === 5) ? 6 : 5;
  const periods = Math.max(state.periods, ...courses().filter(c => c.day >= 0).map(c => c.period));
  // 授業がある一番遅い時限より後は、行を低くする（授業が1つもなければ全部ふつう）
  const lastUsed = Math.max(0, ...courses().filter(c => c.day >= 0).map(c => c.period));
  const idle = p => lastUsed && p > lastUsed ? ' idle' : '';
  const today = effDay(new Date());
  const g = $('#grid');
  g.style.gridTemplateColumns = `34px repeat(${days},1fr)`;
  let h = '<div class="head"></div>';
  for (let d = 0; d < days; d++) h += `<div class="head ${d === today ? 'today' : ''}">${DAYS[d]}</div>`;
  for (let p = 1; p <= periods; p++) {
    const t = state.times[p - 1];
    h += `<div class="pnum${idle(p)}">${p}${t?.start ? `<small>${esc(t.start)}</small>` : ''}</div>`;
    for (let d = 0; d < days; d++) {
      const cs = courses().filter(c => c.day === d && c.period === p);
      h += `<div class="cell ${d === today ? 'today' : ''}${idle(p)}" data-d="${d}" data-p="${p}">` +
        cs.map(c => {
          const ni = c.items.filter(i => i.type === 'next').length;
          const nt = c.tasks.filter(t => !t.done).length;
          const a = absInfo(c);
          const warn = a.left != null && a.left <= 1;
          const marks = (ni ? `<span>🎒${ni}</span>` : '') + (nt ? `<span>📝${nt}</span>` : '') +
            (warn ? `<span class="absWarn">⚠${a.n}/${a.max}</span>` : '');
          const tg = tagOf(c);
          return `<div class="course${tg ? ' tagged' : ''}" data-id="${c.id}"${tg ? ` style="--tag:${tg.color}"` : ''}><b>${esc(nm(c))}</b>` +
            (c.room ? `<small>${esc(c.room)}</small>` : '') +
            (marks ? `<div class="marks">${marks}</div>` : '') + `</div>`;
        }).join('') + '</div>';
    }
  }
  g.innerHTML = h;
  syncGridBar();
  renderTagLegend();
}

function renderTermSelect() {
  $('#termSelect').innerHTML = state.terms.map(t =>
    `<option value="${t.id}" ${t.id === state.currentTermId ? 'selected' : ''}>${esc(t.name)}</option>`).join('') +
    '<option value="__new">＋ 新しい学期を作る</option>' +
    '<option value="__edit">⚙ 学期の設定</option>';
}

/* ===== 画面：集中講義 ===== */
function rangeLabel(c) {
  if (!c.from) return '日程未定';
  return c.to && c.to !== c.from ? `${md(parseYmd(c.from))}〜${md(parseYmd(c.to))}` : md(parseYmd(c.from));
}

function renderIntensive() {
  const list = courses().filter(c => c.day === -1)
    .sort((a, b) => (a.from || '9999').localeCompare(b.from || '9999'));
  $('#intCard').innerHTML =
    `<h2>集中講義${list.length ? ` <small>${list.length}件</small>` : ''}</h2>` +
    (list.length
      ? '<div class="intList">' + list.map(c => {
          const ni = c.items.filter(i => i.type === 'next').length;
          const nt = c.tasks.filter(t => !t.done).length;
          const tg = tagOf(c);
          return `<div class="course${tg ? ' tagged' : ''}" data-id="${c.id}"${tg ? ` style="--tag:${tg.color}"` : ''}><b>${esc(nm(c))}</b>` +
            `<span class="when">${rangeLabel(c)}</span><small>${esc(c.room)}</small><div>` +
            (ni ? `<span class="badge item">持ち物${ni}</span>` : '') +
            (nt ? `<span class="badge task">課題${nt}</span>` : '') +
            `</div></div>`;
        }).join('') + '</div>'
      : '<p class="muted">曜日・時限が決まってない授業はここに追加してね</p>') +
    '<button id="intAdd">＋ 集中講義を追加</button>';
}

function renderAll() {
  $('#importBtn').hidden = false;
  applyMode();
  renderTermSelect();
  renderNow();
  renderPack();
  renderTasks();
  renderNotes();
  renderTomorrow();
  renderGrid();
  renderIntensive();
  if (curTab === 'cal' && calMonth) { renderCal(); renderDay(); }
}

/* ===== メイン画面の操作 ===== */
$('#nowCard').addEventListener('click', e => {
  const go = e.target.closest('[data-go]')?.dataset.go;
  if (go === 'grid') return showTab('grid');
  if (go === 'import') return $('#importBtn').click();
  if (go === 'share') return openTermDlg('shareSec');
  if (go === 'nogrid') {
    state.useGrid = false; save(); renderAll();
    toast('予定管理だけのモードにしたよ。設定からいつでも戻せる', () => { state.useGrid = true; save(); renderAll(); });
    return;
  }
  const im = e.target.closest('[data-evimg]');
  if (im) return openShiftImg(im.dataset.evimg, im.dataset.label);
  const sw = e.target.dataset.switch;
  if (sw) {
    state.currentTermId = sw;
    save(); renderAll();
    return;
  }
  const ab = e.target.closest('[data-abs]');
  if (ab) {
    const c = findCourse(ab.dataset.abs);
    if (!c) return;
    const d = ymd(new Date());
    const on = c.absences.includes(d);
    withUndo(on ? `「${nm(c)}」の欠席を取り消したよ` : `「${nm(c)}」を欠席にしたよ`, () => {
      c.absences = on ? c.absences.filter(x => x !== d) : c.absences.concat(d);
    });
    return;
  }
  const n = e.target.closest('.nc, .flow li[data-id]');
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
  const c = findCourse(e.target.dataset.cid);
  const t = c?.tasks.find(x => x.id === id);
  if (t) {
    t.done = true; save(); renderAll();
    toast(`「${t.title}」を完了にしたよ`, () => { t.done = false; save(); renderAll(); });
  }
});
$('#taskCard').addEventListener('click', e => {
  if (e.target.closest('[data-tmore]')) { taskAll = !taskAll; renderTasks(); return; }
  const id = e.target.closest('.due')?.dataset.id;
if (id && !isGroup(id)) openCourse(id);
});

$('#grid').addEventListener('click', e => {
  const co = e.target.closest('.course');
  if (co) return openCourse(co.dataset.id);
  const cell = e.target.closest('.cell');
  if (!cell) return;
  const c = newCourse(+cell.dataset.d, +cell.dataset.p);
  courses().push(c);
  renderAll(); openCourse(c.id);
});

$('#intCard').addEventListener('click', e => {
  const co = e.target.closest('.course');
  if (co) return openCourse(co.dataset.id);
  if (e.target.id !== 'intAdd') return;
  const c = newCourse(-1, 1);
  courses().push(c);
  renderAll(); openCourse(c.id);
});

$('#termSelect').onchange = e => {
  const v = e.target.value;
  if (v === '__new' || v === '__edit') {
    e.target.value = state.currentTermId;
    e.target.blur();
    setTimeout(() => {
      if (v === '__new') return openTermDlg('newTermSec');
      openTermDlg();
      const d = $('#termList').closest('details');
      if (d) d.open = true;
    }, 50);
    return;
  }
  state.currentTermId = v;
  save(); renderAll();
};

/* ===== 授業詳細 ===== */
let currentId = null;
const cur = () => courses().find(c => c.id === currentId);

// キャンセル用：開いたときの授業と休講
let courseBackup = null;
function courseSnap(c, t = term()) {
  return JSON.stringify({ c, cancels: t.cancels.filter(x => x.courseId === c.id),
    ondemands: (t.ondemands || []).filter(x => x.courseId === c.id) });
}

$('#cDay').innerHTML = DAYS.map((d, i) => `<option value="${i}">${d}曜</option>`).join('') +
  '<option value="-1">集中講義</option>';
$('#cPeriod').innerHTML = Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1}限</option>`).join('');

function renderItemSuggest() {
  const set = new Set(state.itemHistory);
  for (const t of state.terms) for (const c of t.courses) for (const i of c.items) set.add(i.text.trim());
  $('#itemSuggest').innerHTML = [...set].filter(Boolean).map(v => `<option value="${esc(v)}">`).join('');
}

// 集中講義なら時限・休講を隠して日程を出す
function syncIntUI() {
  const isInt = cur()?.day === -1;
  $('#cPeriod').hidden = isInt;
  $('#cIntRow').hidden = !isInt;
  $('#cCancelSec').hidden = isInt;
}

function openCourse(id) {
  currentId = id;
  const c = cur();
  if (!c) return;
  courseBackup = courseSnap(c);
  $('#cName').value = c.name;
  $('#cShort').value = c.short;
  $('#cTeacher').value = c.teacher;
  $('#cRoom').value = c.room;
  $('#cSyllabus').value = c.syllabus;
  $('#cDay').value = c.day;
  $('#cPeriod').value = c.period;
  $('#cFrom').value = c.from;
  $('#cTo').value = c.to;
  syncIntUI();
  $('#taskDue').value = '';
  $('#absDate').value = lastClassDate(c);
  $('#absMax').value = c.maxAbsence;
  renderItemSuggest();
  renderDetail();
  renderCTags();
  $('#tagNew').hidden = true;
  renderSyllabusHint();
  $('#cMore').open = false; // 「詳細」は毎回閉じた状態から
  $('#courseDlg').showModal();
  if (!c.name) $('#cName').focus();
}

function renderDetail() {
  const c = cur();
  if (!c) return;
  const t = term();

  // 持ち物（タグをタップで「次回だけ」⇔「毎回」）
  $('#itemList').innerHTML = c.items.map(i =>
    `<li><span>` +
    (i.type === 'always'
      ? `<button class="tag" data-toggle="${i.id}">毎回</button>`
      : `<button class="tag next" data-toggle="${i.id}">${c.day === -1 ? '期間中' : '次回'}${i.until ? '・' + md(new Date(i.until)) : ''}</button>`) +
    `${esc(i.text)}</span><button class="x" data-del="${i.id}" aria-label="削除">×</button></li>`).join('')
    || '<li class="muted">なし</li>';

  // 「詳細」を閉じてても中身がわかるように
  const nc = t.cancels.filter(x => x.courseId === c.id).length;
  const a = absInfo(c);
  const parts = [`欠席${a.n}回`];
  if (nc) parts.push(`休講${nc}件`);
  const od = window.odCount?.(c);
  if (od) parts.push(!od.all ? 'オンデマ0回' : od.n === od.all ? 'オンデマ毎回' : `オンデマ${od.n}/${od.all}回`);

  if (c.syllabus) parts.push('シラバスあり');
  $('#cMoreSum').textContent = parts.join('・');
  $('#cMoreSum').className = a.left != null && a.left <= 1 ? 'alert' : '';

  // 課題
  const ts = c.tasks.slice().sort((a, b) =>
    (a.done - b.done) || (a.due || '9999').localeCompare(b.due || '9999'));
  $('#taskList').innerHTML = ts.map(k => {
    const st = dueState(k.due);
    return `<li class="${k.done ? '' : st.cls}"><label>` +
      `<input type="checkbox" data-tdone="${k.id}" ${k.done ? 'checked' : ''}>` +
      `<span class="${k.done ? 'done' : ''}">${esc(k.title)}</span></label>` +
      `<span class="due">${k.done ? '完了' : st.label}</span>` +
      `<button class="x" data-tdel="${k.id}" aria-label="削除">×</button></li>`;
  }).join('') || '<li class="muted">なし</li>';

  // 先生の一言
  $('#memoList').innerHTML = c.memos.slice().reverse().map(m =>
    `<li><div><span class="memo-date">${esc(m.date)}</span>${esc(m.text).replace(/\n/g, '<br>')}</div>` +
    `<button class="x" data-mdel="${m.id}" aria-label="削除">×</button></li>`).join('');

  // 休講
  $('#cancelList').innerHTML = t.cancels.filter(x => x.courseId === c.id)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(x => `<li><span>${md(parseYmd(x.date))} 休講</span>` +
      `<button class="x" data-cdel="${x.id}" aria-label="削除">×</button></li>`).join('')
    || '<li class="muted">なし</li>';
  const ahead = occurrencesAhead(c, 8);
  $('#cancelDate').innerHTML = ahead.length
    ? ahead.map((d, k) => `<option value="${ymd(d)}">${md(d)}${k === 0 ? '（次回）' : ''}</option>`).join('')
    : '<option value="">この先の授業が見つからない</option>';
  $('#cancelAdd').disabled = !ahead.length;
  window.renderOd?.();


  // 欠席
  let sum = `${a.n}回`;
  if (a.max != null) sum += a.left < 0 ? ` / 上限${a.max}回（超えてる）` : ` / 上限${a.max}回（あと${a.left}回）`;
  $('#absSummary').textContent = sum;
  $('#absSummary').className = a.left != null && a.left <= 1 ? 'alert' : '';
  $('#absList').innerHTML = c.absences.slice().sort().map(d =>
    `<li><span>${md(parseYmd(d))}</span><button class="x" data-adel="${d}" aria-label="削除">×</button></li>`).join('')
    || '<li class="muted">なし</li>';
}

for (const [id, key] of [['cName', 'name'], ['cShort', 'short'], ['cTeacher', 'teacher'], ['cRoom', 'room']]) {
  $('#' + id).addEventListener('input', e => {
    cur()[key] = e.target.value;
    save(); renderAll();
    if (key === 'name') renderSyllabusHint();
  });
}
for (const [id, key] of [['cDay', 'day'], ['cPeriod', 'period']]) {
  $('#' + id).addEventListener('change', e => {
    cur()[key] = +e.target.value;
    scheduleChanged();
    renderDetail();
    syncIntUI();
  });
}
// 集中講義の日程
{
  const fromEl = $('#cFrom'), toEl = $('#cTo');
  // 終わりの日を開いたとき、空なら始まりの日を入れておく（iPhoneは空だと今日が入るため）
  toEl.addEventListener('focus', () => {
    if (!toEl.value && fromEl.value) toEl.value = fromEl.value;
    toEl.min = fromEl.value || '';
  });
  for (const [el, key] of [[fromEl, 'from'], [toEl, 'to']]) {
    const commit = () => {
      const c = cur();
      if (!c || c[key] === el.value) return;
      const f = key === 'from' ? el.value : c.from;
      const t = key === 'to' ? el.value : c.to;
      if (f && t && t < f) {
        if (key === 'from') {
          c.from = el.value; c.to = el.value; toEl.value = el.value; // 終わりの日もついてくる
        } else {
          el.value = c.to || '';
          setTimeout(() => alert('終わりの日が始まりの日より前になってるよ'), 300);
          return;
        }
      } else c[key] = el.value;
      save(); renderAll();
    };
    // ホイールを回してる間は何もしない。閉じたときに反映
    el.addEventListener('change', () => { if (document.activeElement !== el) commit(); });
    el.addEventListener('blur', commit);
  }
}

// 持ち物
$('#itemAdd').onclick = () => {
  const v = $('#itemInput').value.trim();
  if (!v) return;
  const c = cur(), now = Date.now();
  c.items.push({ id: uid(), text: v, type: 'next', added: now, until: untilFor(c, term(), new Date(now)) });
  state.itemHistory = [v, ...state.itemHistory.filter(x => x !== v)].slice(0, HISTORY_MAX);
  $('#itemInput').value = '';
  save(); renderItemSuggest(); renderDetail(); renderAll();
};
$('#itemInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.isComposing) $('#itemAdd').click();
});
$('#itemList').addEventListener('click', e => {
  const c = cur();
  const tg = e.target.dataset.toggle;
  if (tg) {
    const i = c.items.find(x => x.id === tg);
    if (i.type === 'always') {
      const now = Date.now();
      i.type = 'next'; i.added = now; i.until = untilFor(c, term(), new Date(now));
    } else {
      i.type = 'always'; i.until = null;
    }
    save(); renderDetail(); renderAll();
    return;
  }
  const id = e.target.dataset.del;
  if (!id) return;
  c.items = c.items.filter(i => i.id !== id);
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

// この授業だけ休講
$('#cancelAdd').onclick = () => {
  const date = $('#cancelDate').value;
  if (!date) return;
  term().cancels.push({ id: uid(), courseId: cur().id, date });
  scheduleChanged(); renderDetail();
};
$('#cancelList').addEventListener('click', e => {
  const id = e.target.dataset.cdel;
  if (!id) return;
  term().cancels = term().cancels.filter(x => x.id !== id);
  scheduleChanged(); renderDetail();
});

// 欠席
$('#absAdd').onclick = () => {
  const d = $('#absDate').value;
  if (!d) return alert('欠席した日を選んでね');
  const c = cur();
  if (c.absences.includes(d)) return alert('その日はもう記録してあるよ');
  c.absences.push(d);
  save(); renderDetail(); renderGrid();
};
$('#absList').addEventListener('click', e => {
  const d = e.target.dataset.adel;
  if (!d) return;
  cur().absences = cur().absences.filter(x => x !== d);
  save(); renderDetail(); renderGrid();
});
$('#absMax').addEventListener('input', e => {
  const v = e.target.value;
  cur().maxAbsence = v === '' ? '' : Math.max(0, Math.floor(+v) || 0);
  save(); renderDetail(); renderGrid();
});

// シラバス
$('#cSyllabus').addEventListener('input', e => {
  cur().syllabus = e.target.value.trim();
  save(); renderSyllabusHint();
});
$('#cSyllabusOpen').onclick = () => {
  const c = cur();
  if (c.syllabus && !isHttp(c.syllabus)) return alert('URLは https:// から始まる形で入れてね');
  const url = syllabusURL(c);
  if (!url) return alert('設定の「シラバス検索」に、検索ページのURLを入れてね');
  // 授業ごとのURLがないときは授業名をコピー（開く前にやらないとiPhoneで止められる）
  if (!isHttp(c.syllabus) && c.name.trim()) navigator.clipboard?.writeText(c.name.trim()).catch(() => {});
  window.open(url, '_blank', 'noopener');
};

function removeCourse(c) {
  const t = term();
  t.courses = t.courses.filter(x => x !== c);
  t.cancels = t.cancels.filter(x => x.courseId !== c.id);
}

$('#cDelete').onclick = () => {
  if (!confirm('この授業とメモ・課題・欠席の記録を削除する？')) return;
  const c = cur();
  withUndo(`「${nm(c)}」を削除したよ`, () => removeCourse(c));
  $('#courseDlg').close();
};

// 変更があれば確認して、開く前の状態に戻す
// 変更があれば3択で聞く
async function closeCourse() {
  const c = cur();
  if (c && courseBackup && courseSnap(c) !== courseBackup) {
    const a = await ask3();
    if (a === 'back') return;
    if (a === 'discard') {
      const t = term(), b = JSON.parse(courseBackup);
      const idx = t.courses.indexOf(c);
      if (idx >= 0) t.courses[idx] = b.c;
      t.cancels = t.cancels.filter(x => x.courseId !== c.id).concat(b.cancels);
      t.ondemands = (t.ondemands || []).filter(x => x.courseId !== c.id).concat(b.ondemands || []);
      scheduleChanged();
    }
  }
  $('#courseDlg').close();
}

$('#cClose').onclick = () => $('#courseDlg').close();
$('#cX').onclick = closeCourse;
$('#cCancel').onclick = closeCourse;
$('#courseDlg').addEventListener('cancel', e => { e.preventDefault(); closeCourse(); }); // Escキー

// 何も入ってない授業（マスをタップした直後のまま）
const courseEmpty = c => !c.name.trim() && !c.short.trim() && !c.teacher.trim() && !c.room.trim() && !c.syllabus && !c.from && !c.to &&
  !c.items.length && !c.memos.length && !c.tasks.length && !c.absences.length && c.maxAbsence === '' && !(c.notes || []).length;

// 何も入ってない授業は閉じたときに消す
$('#courseDlg').addEventListener('close', () => {
  const c = cur();
  if (!c) return;
  if (courseEmpty(c)) removeCourse(c);
  save(); renderAll();
});

/* ===== カレンダー（月表示） ===== */
let calMonth = null, calSel = '';
let calMulti = false;          // 複数日選択モード
let curTab = 'today';  // 表示中のタブ
let ctEdit = null;     // 変更中の課題 { cid, id, to }
let ctLastCid = '';    // 前回選んだ授業
const calPicks = new Set();    // 選んだ日（月をまたいでも残る）
const EV_PRESET_MAX = 30;
const EV_LABEL = { job: 'バイト', other: '予定', exam: '試験' };
let evEditId = null;           // 変更中の予定

// 画面・通知・ウィジェット・目覚ましに出す予定は全部ここを通る。オフの機能（バイト・共有グループ）の予定は出さない
function eventsOn(k) {
  const job = featOn('job'), group = featOn('group');
  return state.events.concat(group ? window.grShared || [] : [])
    .filter(e => e.date === k && (job || e.kind !== 'job') && (group || !e.gid))
    .sort((a, b) => (a.start || '99').localeCompare(b.start || '99'));
}
// 予定の場所：メモの「📍 〜」の行に入れる。予定の名前ごとの「いつもの場所」は state.evPlaces
const PIN = '📍';
const placeOf = memo => (String(memo || '').split('\n').find(l => l.startsWith(PIN)) || '').slice(PIN.length).trim();
const evPlaceDefault = title => (state.evPlaces || {})[String(title || '').trim()] || '';
function setEvPlace(title, place) {
  title = String(title || '').trim().slice(0, 60);
  place = String(place || '').trim().slice(0, 60);
  if (!title) return;
  if (place) state.evPlaces[title] = place; else delete state.evPlaces[title];
}
// メモの先頭に場所の行を入れる（もうあれば置きかえる）。place が空ならメモはそのまま
function memoWithPlace(memo, place) {
  place = String(place || '').trim().slice(0, 60);
  if (!place) return String(memo || '');
  const rest = String(memo || '').split('\n').filter(l => !l.startsWith(PIN));
  return [PIN + ' ' + place, ...rest].join('\n').trim();
}
// カレンダー（月・この日の予定）だけの絞り込み。今日の画面・通知などはそのまま
function calEvents(k) {
  const hide = state.calHide || [];
  return hide.length ? eventsOn(k).filter(e => !hide.includes(e.gid || 'me')) : eventsOn(k);
}
function evTime(e) {
  if (!e.start) return '';
  const end = e.end ? `〜${toMin(e.end) <= toMin(e.start) ? '翌' : ''}${e.end}` : '〜';
  return `${e.start}${end}`;
}
function evLabel(e) {
  return esc(`${e.title || EV_LABEL[e.kind]}${e.start ? ' ' + evTime(e) : ''}`);
}
function tasksDue(k) {
  const out = [];
  for (const t of state.terms) for (const c of t.courses) for (const x of c.tasks)
    if (x.due === k) out.push({ c, x });
  for (const x of state.myTasks) if (x.due === k) out.push({ c: selfCourse, x });
  for (const g of state.cats) for (const x of g.tasks) if (x.due === k) out.push({ c: g, x });
  return out;
}
function intensiveOn(k) {
  if (!state.useGrid) return [];
  return courses().filter(c => c.day === -1 && c.from && k >= c.from && k <= (c.to || c.from));
}
function findCourse(id) {
  if (id === SELF_ID) return selfCourse;
  const g = state.cats.find(x => x.id === id);
  if (g) return g;
  for (const t of state.terms) {
    const c = t.courses.find(x => x.id === id);
    if (c) return c;
  }
  return null;
}

function renderCal() {
  const y = calMonth.getFullYear(), m = calMonth.getMonth(), t = term(), today = todayStr();
  $('#calTitle').textContent = `${y}年${m + 1}月`;
  const cp = $('#calPick');
  if (cp) cp.value = `${y}-${String(m + 1).padStart(2, '0')}`;
  const first = new Date(y, m, 1);
  // 週のはじまりは設定で選べる（月曜 or 日曜）
  const sunStart = state.weekStart === 'sun';
  const start = addDays(first, -(sunStart ? first.getDay() : dayIndex(first)));
  let h = (sunStart ? WEEK : [...WEEK.slice(1), WEEK[0]]).map(d =>
    `<div class="cw ${d === '土' ? 'sat' : d === '日' ? 'sun' : ''}">${d}</div>`).join('');

  for (let n = 0; n < 42; n++) {
    const date = addDays(start, n), k = ymd(date);
    if (n === 35 && date.getMonth() !== m) break; // 5週で収まる月
    const off = state.useGrid && inTerm(date, t) ? offInfo(date, t) : null;
    const pending = tasksDue(k).filter(({ x }) => !x.done);
    const labels = [];
    // 課題をいちばん先に並べて、「+1」に隠れないようにする
    for (const { x } of pending) labels.push(`<span class="ev task">${esc(x.title)}</span>`);
    if (off) labels.push(`<span class="ev off">${esc(off.note || '休み')}</span>`);
    for (const c of intensiveOn(k)) labels.push(`<span class="ev int">${esc(nm(c) || '集中講義')}</span>`);
    for (const e of calEvents(k)) labels.push(`<span class="ev ${e.kind}${e.gid ? ' shared' : ''}" data-evid="${e.id}">${esc(e.title || EV_LABEL[e.kind])}</span>`);

    const cls = ['cd', pending.length && 'due',
      date.getMonth() !== m && 'out', off && 'offday',
      (calMulti ? calPicks.has(k) && 'pick' : k === calSel && 'sel'), k === today && 'today',
      date.getDay() === 6 && 'sat', date.getDay() === 0 && 'sun'].filter(Boolean).join(' ');
    h += `<div class="${cls}" data-date="${k}"><span class="dn">${date.getDate()}` +
      (pending.length ? `<i class="dueMark">${pending.length}</i>` : '') +
      ((featOn('diary') && state.diary[k]) || (featOn('memo') && state.notes.some(x => !x.pin && x.date === k)) ? '<i class="noteMark">✎</i>' : '') + '</span>' +
      labels.slice(0, 3).join('') +
      (labels.length > 3 ? `<span class="more">+${labels.length - 3}</span>` : '') + '</div>';
  }
  $('#calGrid').innerHTML = h;
}

function renderDay() {
  const date = parseYmd(calSel), k = calSel, t = term(), rows = [];
  $('#dayTitle').textContent = `${md(date)}の予定`;
  const off = inTerm(date, t) ? offInfo(date, t) : null;
  if (off) rows.push(`<li><span>休み：${esc(offLabel(off))}</span></li>`);
  else {
    const cs = state.useGrid ? coursesOn(date, t) : [];
    const at = new Set(attendOn(date, t));
    if (cs.length) rows.push(`<li><span class="muted">授業：${cs.map(c => `${c.period}限 ${esc(nm(c))}${at.has(c) ? '' : '（オンデマ）'}`).join('／')}</span></li>`);
  }
  for (const c of intensiveOn(k)) rows.push(`<li><span><span class="tag">集中</span>${esc(nm(c))}</span></li>`);
  for (const { c, x } of tasksDue(k)) rows.push(
    `<li class="ctRow ${ctEdit && ctEdit.id === x.id ? 'editing' : ''}">` +
    `<input type="checkbox" data-caltask="${x.id}" data-cid="${c.id}" ${x.done ? 'checked' : ''} aria-label="完了">` +
    `<button type="button" class="evText" data-taskedit="${x.id}" data-cid="${c.id}">` +
    `<span class="${x.done ? 'done' : ''}">${esc(x.title)}</span> <span class="from">${esc(nm(c))}・締切</span></button></li>`);
  for (const e of calEvents(k)) rows.push(
    `<li class="${e.id === evEditId ? 'editing' : ''}">` +
    `<button type="button" class="evText" data-evedit="${e.id}"><span class="tag">${EV_LABEL[e.kind]}</span>${esc(evTime(e))} ${esc(e.title)}${e.gid ? grLabel(e) : ''}${placeOf(e.memo) ? ` <span class="from evPlace">${PIN}${esc(placeOf(e.memo))}</span>` : ''}${e.memo ? '<span class="evMemoMk" aria-label="メモあり">📝</span>' : ''}</button>` +
    (e.img ? `<button type="button" class="evImg" data-evimg="${esc(e.img)}" data-label="${esc(md(date) + ' ' + (e.title || 'バイト'))}" aria-label="シフト表を見る">📄</button>` : '') +
    `<button class="x" data-evdel="${e.id}" aria-label="削除">×</button></li>`);
  if (featOn('memo')) for (const n of state.notes) if (!n.pin && n.date === k) rows.push(
    `<li><span><span class="tag next">メモ</span>${esc(n.text)}</span>` +
    `<button class="x" data-ndel="${n.id}" aria-label="削除">×</button></li>`);
  if (featOn('diary') && (state.diary[k] || k <= todayStr())) rows.push(
    `<li><button type="button" class="evText" data-diary="${k}"><span class="tag">日記</span>` +
    (state.diary[k] ? esc(state.diary[k]) : '<span class="muted">一言日記を書く</span>') + '</button></li>');
  $('#dayList').innerHTML = rows.join('') || '<li class="muted">なし</li>';
  renderTaskForm();
}

const EV_ADD_TEXT = $('#evAdd').textContent;

// 予定の候補（タップすると名前・種類・時刻が入る）
function renderEvSuggest() {
  $('#evChips').innerHTML = state.evPresets.slice(0, 10).map((p, i) =>
    `<button type="button" class="chip" data-preset="${i}">${esc(p.title)}` +
    (p.start ? ` <small>${esc(evTime(p))}</small>` : '') + '</button>').join('');
}

function renderPicks(msg = '') {
  const ds = [...calPicks].sort();
  $('#calMulti').checked = calMulti;
  $('#evWeekly').disabled = calMulti;   // 複数選択中は「4週分」は使わない
  if (calMulti) $('#evWeekly').checked = false;
  $('#evHead').textContent = calMulti ? '選んだ日に予定を追加' : 'この日に予定を追加';
  $('#evAdd').textContent = calMulti ? `${ds.length}日に追加` : EV_ADD_TEXT;
  let info = '';
  if (calMulti) info = ds.length
    ? `${ds.length}日選択中：${ds.map(k => md(parseYmd(k))).join('・')}`
    : 'カレンダーの日付をタップして選んでね';
  $('#calPickInfo').textContent = msg || info;
  syncEvForm();
}

// カレンダーのタブを開いたとき（今日に戻す）
function openCal() {
  const now = new Date();
  calMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  calSel = todayStr();
  for (const id of ['evTitle', 'evStart', 'evEnd', 'ctTitle']) $('#' + id).value = '';
  $('#evWeekly').checked = false;
  calMulti = false; calPicks.clear();
  evEditId = null; ctEdit = null;
  renderEvSuggest();
  renderCal(); renderDay(); renderPicks();
}

const moveMonth = k => {
  calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + k, 1);
  renderCal();
};
$('#calPrev').onclick = () => moveMonth(-1);
$('#calNext').onclick = () => moveMonth(1);

$('#calGrid').addEventListener('click', e => {
  const d = e.target.closest('.cd');
  if (!d) return;
  if (calMulti) {
    const k = d.dataset.date;
    if (calPicks.has(k)) calPicks.delete(k); else calPicks.add(k);
    renderCal(); renderPicks();
    return;
  }
  calSel = d.dataset.date;
    if (evEditId) endEvEdit();
  if (ctEdit) endTaskEdit();
  const sd = parseYmd(calSel);
  if (sd.getMonth() !== calMonth.getMonth()) calMonth = new Date(sd.getFullYear(), sd.getMonth(), 1);
  renderCal(); renderDay();
});

$('#calMulti').onchange = e => {
  calMulti = e.target.checked;
  if (!calMulti) calPicks.clear();
  renderCal(); renderPicks();
};

$('#dayList').addEventListener('change', e => {
  const id = e.target.dataset.caltask;
  if (!id) return;
  const x = findCourse(e.target.dataset.cid)?.tasks.find(k => k.id === id);
  if (!x) return;
  x.done = e.target.checked;
  save(); renderCal(); renderDay();
});
$('#dayList').addEventListener('click', e => {
  const im = e.target.closest('[data-evimg]');
  if (im) return openShiftImg(im.dataset.evimg, im.dataset.label);
  const te = e.target.closest('[data-taskedit]');
  if (te) return startTaskEdit(te.dataset.cid, te.dataset.taskedit);
  const ed = e.target.closest('[data-evedit]');
  if (ed) { if (ctEdit) endTaskEdit(); return startEvEdit(ed.dataset.evedit); }
  const id = e.target.dataset.evdel;
  if (!id || !confirm('この予定を消す？')) return;
  state.events = state.events.filter(x => x.id !== id);
  if (id === evEditId) endEvEdit();
  save(); renderCal(); renderDay();
});

// 候補と同じ名前を入れたら、時刻が空のときだけ前回の時刻と種類を入れる
$('#evTitle').addEventListener('input', e => {
  const p = state.evPresets.find(x => x.title === e.target.value.trim());
  if (!p || $('#evStart').value || $('#evEnd').value) return;
  $('#evKind').value = p.kind;
  $('#evStart').value = p.start;
  $('#evEnd').value = p.end;
});

function rememberPreset(p) {
  if (!p.title) return;
  state.evPresets = [p, ...state.evPresets.filter(x => x.title !== p.title)].slice(0, EV_PRESET_MAX);
}

$('#evAdd').onclick = () => {
  const kind = $('#evKind').value;
  const title = $('#evTitle').value.trim();
  const start = $('#evStart').value, end = $('#evEnd').value;
  const memo = $('#evMemo').value.trim().slice(0, 2000);
  let dates;
  if (calMulti) {
    dates = [...calPicks].sort();
    if (!dates.length) return alert('カレンダーで日付を選んでね');
  } else {
    const n = $('#evWeekly').checked ? 4 : 1;
    dates = Array.from({ length: n }, (_, k) => ymd(addDays(parseYmd(calSel), 7 * k)));
  }

  // 同じ日・同じ種類・同じ名前・同じ時刻の予定は二重に入れない
  let added = 0, skipped = 0;
  for (const date of dates) {
    const dup = state.events.some(e => e.date === date && e.kind === kind &&
      e.title === title && e.start === start && e.end === end);
    if (dup) { skipped++; continue; }
    state.events.push({ id: uid(), date, kind, title, start, end, ...(memo && { memo }), ...examCidOf(kind) });
    added++;
  }
  rememberPreset({ title, kind, start, end });

  const msg = skipped
    ? `${added}日に追加したよ（${skipped}日はもう入ってたので飛ばした）`
    : dates.length > 1 ? `${added}日に追加したよ` : '';
  $('#evTitle').value = '';
  $('#evMemo').value = '';
  $('#evWeekly').checked = false;
  calMulti = false; calPicks.clear();
  save(); renderEvSuggest(); renderCal(); renderDay(); renderPicks(msg);
};

/* ===== 予定の候補・変更 ===== */
$('#evChips').addEventListener('click', e => {
  const b = e.target.closest('[data-preset]');
  const p = b && state.evPresets[+b.dataset.preset];
  if (!p) return;
  $('#evKind').value = p.kind;
  $('#evTitle').value = p.title;
  $('#evStart').value = p.start;
  $('#evEnd').value = p.end;
});

// 種類・名前・時刻が全部同じなら「同じ予定」
const sameEv = (a, b) =>
  a.kind === b.kind && a.title === b.title && a.start === b.start && a.end === b.end;

function evTargets(scope) {
  const base = state.events.find(x => x.id === evEditId);
  if (!base) return [];
  if (scope === 'one') return [base];
  // 種類と名前だけ同じ（時間は見ない）：時間が日によって違うバイトなど
  if (scope === 'name') return state.events.filter(e => e.kind === base.kind && e.title === base.title);
  return state.events.filter(e => sameEv(e, base) && (
    scope === 'all' ||
    (scope === 'after' && e.date >= base.date) ||
    (scope === 'picks' && (calPicks.has(e.date) || e.id === base.id))));
}

// 「変更する範囲」：選んだ値は隠したプルダウン（#evScope）に入れて、保存・削除はそれを見る
function renderEvScope() {
  const sel = $('#evScope'), v = sel.value;
  const base = state.events.find(x => x.id === evEditId);
  const opts = [['one', 'この予定だけ'], ['after', `${base ? md(parseYmd(base.date)) : 'この日'}以降の同じ予定`], ['all', '同じ予定すべて']];
  if (calMulti && calPicks.size) opts.push(['picks', '選んだ日の同じ予定']);
  // 時間が違う同じ名前の予定があるときだけ「種類・名前が同じ予定すべて」を出す
  const byName = evTargets('name').length;
  if (base?.title && byName > evTargets('all').length) opts.push(['name', '種類・名前が同じ予定すべて']);
  sel.innerHTML = opts.map(([k, l]) => `<option value="${k}">${l}</option>`).join('');
  // 同じ予定が1件だけ（共有した予定も）なら、選ぶものがないので出さない
  const many = Math.max(evTargets('all').length, base?.title ? byName : 0) > 1;
  sel.value = many && opts.some(o => o[0] === v) ? v : 'one';
  $('#evScopeBox').hidden = !many;
  $('#evScopeList').innerHTML = many ? opts.map(([k, l]) =>
    `<label class="inline"><input type="radio" name="evScopeR" value="${k}"${k === sel.value ? ' checked' : ''}>` +
    `${l}${k === 'one' ? '' : `（${evTargets(k).length}件）`}</label>`).join('') : '';
  $('#evScopeHint').textContent = opts.some(o => o[0] === 'name')
    ? '同じ予定＝種類・名前・時間が同じもの。「種類・名前が同じ」は時間が違っても入って、変えた所だけ全部に入る（時間を変えなければ時間はそれぞれのまま）'
    : '同じ予定＝種類・名前・時間が同じもの（毎週のバイトなど）';
}
$('#evScopeList').addEventListener('change', e => {
  if (e.target.name === 'evScopeR') $('#evScope').value = e.target.value;
});

function syncEvForm() {
  const ed = !!evEditId;
  const k = evEditId || '';
  if (k !== syncEvForm.was) $('#evMemo').value = k ? (state.events.find(x => x.id === k)?.memo || '') : '';
  syncEvForm.was = k;
  $('#evAdd').hidden = ed;
  $('#evWeeklyBox').hidden = ed;
  $('#evEditBox').hidden = !ed;
  if (ed) {
    $('#evHead').textContent = '✏️ 予定を編集中';
    renderEvScope();
  }
}

function startEvEdit(id) {
  const e = findAnyEv(id);
  if (!e) return;
  evEditId = id;
  $('#evKind').value = e.kind;
  $('#evTitle').value = e.title;
  $('#evStart').value = e.start;
  $('#evEnd').value = e.end;
  $('#evDate').value = e.date;
  $('#evScope').value = 'one';
  if ($('#evShare')) { $('#evShare').value = e.gid || ''; $('#evLock').checked = !!e.lock; syncLockUI(); }
  renderDay(); renderPicks();
  $('#evHead').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function endEvEdit() {
  evEditId = null;
  for (const id of ['evTitle', 'evStart', 'evEnd']) $('#' + id).value = '';
  if ($('#evShare') && $('#evLock')) { $('#evShare').value = ''; $('#evLock').checked = false; syncLockUI(); }
  renderDay(); renderPicks();
}

// 「変更を保存」「削除」は共有グループのところ（saveEvEdit / delEvEdit）
$('#evCancel').onclick = endEvEdit;

/* ===== カレンダーから課題 ===== */
const slotLabel = c => (Number.isInteger(c.day) && c.day >= 0 && c.period) ? `（${DAYS[c.day]}${c.period}）` : '';

function renderTaskForm() {
  const box = $('#taskBox');
  const cs = courses();
  const ed = ctEdit && findCourse(ctEdit.cid);
  box.hidden = calMulti;
  if (box.hidden) return;
  const base = [...(state.useGrid ? cs : []), ...taskGroups()];
  const list = ed && !base.includes(ed) ? [ed, ...base] : base;
  const sel = ed ? (ctEdit.to || ed.id)
    : (list.some(c => c.id === ctLastCid) ? ctLastCid : list[0].id);
  $('#ctCourse').innerHTML = list.map(c =>
    `<option value="${c.id}" ${c.id === sel ? 'selected' : ''}>${esc(nm(c) || '名前なし')}${slotLabel(c)}</option>`).join('') + '<option value="__newcat">＋ 新しい名目を作る</option>';
  $('#ctHead').textContent = ed ? '✏️ 課題を編集中' : `${md(parseYmd(calSel))}締切の課題を追加`;
  $('#ctAdd').hidden = !!ed;
  for (const id of ['ctDueBox', 'ctDel', 'ctCancel', 'ctSave']) $('#' + id).hidden = !ed;syncCatTools(); 
}

function startTaskEdit(cid, id) {
  const x = findCourse(cid)?.tasks.find(k => k.id === id);
  if (!x) return;
  if (evEditId) endEvEdit();
  ctEdit = { cid, id, to: '' };
  $('#ctTitle').value = x.title;
  $('#ctDue').value = x.due || calSel;setLeadUI('ct', x.lead);
  renderDay();
  $('#ctHead').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function endTaskEdit() {
  ctEdit = null;
  $('#ctTitle').value = '';
  renderDay();
}

$('#ctCourse').onchange = e => {
  let v = e.target.value;
  if (v === '__newcat') {
    const g = newCat();
    v = g ? g.id : (ctEdit ? (ctEdit.to || ctEdit.cid) : ctLastCid);
    if (ctEdit) ctEdit.to = v; else ctLastCid = v;
    renderTaskForm();
    return;
  }
  if (ctEdit) ctEdit.to = v;
  else ctLastCid = v;
  syncCatTools();
};

$('#ctAdd').onclick = () => {
  const title = $('#ctTitle').value.trim();
  if (!title) return alert('課題の内容を入れてね');
  const c = findCourse($('#ctCourse').value);
  if (!c) return;
  c.tasks.push({ id: uid(), title, due: calSel, done: false });
  ctLastCid = c.id;
  $('#ctTitle').value = '';
  save(); renderAll(); renderCal(); renderDay();
};

$('#ctSave').onclick = () => {
  if (!ctEdit) return;
  const from = findCourse(ctEdit.cid);
  const x = from?.tasks.find(k => k.id === ctEdit.id);
  if (!x) return endTaskEdit();
  const title = $('#ctTitle').value.trim();
  if (!title) return alert('課題の内容を入れてね');
  x.title = title;
  x.due = $('#ctDue').value;x.lead = getLeadUI('ct');
  const to = findCourse($('#ctCourse').value);
  if (to && to !== from) {
    from.tasks = from.tasks.filter(k => k !== x);
    to.tasks.push(x);
  }
  const moved = x.due !== calSel;
  save(); renderAll(); renderCal();
  endTaskEdit();
  if (moved) toast(x.due ? `締切を${md(parseYmd(x.due))}に移したよ` : '締切なしにしたよ');
};

$('#ctDel').onclick = () => {
  const c = ctEdit && findCourse(ctEdit.cid);
  if (!c || !confirm('この課題を消す？')) return;
  c.tasks = c.tasks.filter(k => k.id !== ctEdit.id);
  save(); renderAll(); renderCal();
  endTaskEdit();
};

$('#ctCancel').onclick = endTaskEdit;

/* ===== 画面の切り替え（下のタブ） ===== */
function showTab(name) {
  curTab = name;
  document.querySelectorAll('.view').forEach(v => { v.hidden = v.id !== `view-${name}`; });
  document.querySelectorAll('#tabbar [data-tab]').forEach(b => {
    const on = b.dataset.tab === name;
    b.classList.toggle('on', on);
    if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
  if (name === 'cal') openCal(); else renderAll();
  window.scrollTo(0, 0);
}
$('#tabbar').addEventListener('click', e => {
  const b = e.target.closest('[data-tab]');
  if (b) showTab(b.dataset.tab);
});
$('#shareBtn').onclick = () => openTermDlg('shareSec');

/* ===== ダイアログ中は後ろの画面を止める ===== */
let lockY = 0;
function syncScrollLock() {
  const open = !!document.querySelector('dialog[open]');
  const b = document.body;
  if (open && !b.classList.contains('lock')) {
    lockY = window.scrollY;
    b.style.top = `-${lockY}px`;
    b.classList.add('lock');
  } else if (!open && b.classList.contains('lock')) {
    b.classList.remove('lock');
    b.style.top = '';
    window.scrollTo(0, lockY);
  }
}
const dlgWatch = new MutationObserver(syncScrollLock);
document.querySelectorAll('dialog').forEach(d =>
  dlgWatch.observe(d, { attributes: true, attributeFilter: ['open'] }));

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

/* ===== 閉じるときの3択 ===== */
const ask3Dlg = document.createElement('dialog');
ask3Dlg.id = 'ask3Dlg';
ask3Dlg.innerHTML = '<div class="dlg">' +
  '<p id="ask3Msg"></p>' +
  '<button type="button" class="primary" data-a3="save">保存して閉じる</button>' +
  '<button type="button" class="danger" data-a3="discard">保存せずに閉じる</button>' +
  '<button type="button" data-a3="back">戻る</button></div>';
document.body.append(ask3Dlg);
let ask3Done = null;
function ask3(msg = '変更を保存する？') {
  $('#ask3Msg').textContent = msg;
  ask3Dlg.returnValue = '';
  ask3Dlg.showModal();
  return new Promise(ok => { ask3Done = ok; });
}
ask3Dlg.addEventListener('click', e => {
  const b = e.target.closest('[data-a3]');
  if (b) ask3Dlg.close(b.dataset.a3);
});
// Escで閉じたときは「戻る」扱い
ask3Dlg.addEventListener('close', () => {
  const r = ask3Dlg.returnValue || 'back';
  ask3Done?.(r);
  ask3Done = null;
});

// 1行だけ入れてもらう（prompt の代わり）。「やめる」・Escなら null
const askTextDlg = document.createElement('dialog');
askTextDlg.id = 'askTextDlg';
askTextDlg.innerHTML = '<form class="dlg" method="dialog">' +
  '<h2 id="askTextH"></h2>' +
  '<input id="askTextIn" autocomplete="off" aria-labelledby="askTextH">' +
  '<div class="ctBtns"><button type="button" data-at="cancel">やめる</button>' +
  '<button class="primary" value="ok">保存</button></div></form>';
document.body.append(askTextDlg);
askTextDlg.addEventListener('click', e => {
  if (e.target.closest('[data-at="cancel"]')) askTextDlg.close();
});
function askLine(title, value = '', { max = 200, placeholder = '' } = {}) {
  const i = $('#askTextIn');
  $('#askTextH').textContent = title;
  i.value = value; i.maxLength = max; i.placeholder = placeholder;
  askTextDlg.returnValue = '';
  askTextDlg.showModal();
  i.focus();
  return new Promise(ok => askTextDlg.addEventListener('close',
    () => ok(askTextDlg.returnValue === 'ok' ? i.value : null), { once: true }));
}

/* ===== AIの読み取りを中止する ===== */
let aiCtl = null;
const isAbort = err => err?.name === 'AbortError';
const abortErr = () => new DOMException('中止', 'AbortError');
function aiCheck() {
  if (aiCtl?.signal.aborted) throw abortErr();
}
// 中止ボタンで止まる sleep
function aiSleep(ms) {
  return new Promise((ok, ng) => {
    const sig = aiCtl?.signal;
    if (sig?.aborted) return ng(abortErr());
    const stop = () => { clearTimeout(t); ng(abortErr()); };
    const t = setTimeout(() => { sig?.removeEventListener('abort', stop); ok(); }, ms);
    sig?.addEventListener('abort', stop, { once: true });
  });
}
// 「読み取る」ボタンの横に「中止」を出す
function aiBegin(runSel) {
  aiCtl = new AbortController();
  const run = $(runSel);
  let stop = run.nextElementSibling;
  if (!stop || !stop.classList.contains('aiStop')) {
    stop = document.createElement('button');
    stop.type = 'button';
    stop.className = 'aiStop';
    stop.onclick = () => {
      if (!aiCtl) return;
      stop.disabled = true;
      stop.textContent = '中止中…';
      aiCtl.abort();
    };
    run.after(stop);
  }
  stop.textContent = '中止';
  stop.disabled = false;
  stop.hidden = false;
}
function aiEnd(runSel) {
  const stop = $(runSel).nextElementSibling;
  if (stop?.classList.contains('aiStop')) stop.hidden = true;
  aiCtl = null;
}

// 1回だけリクエストを送る
async function requestOnce(p, key, model, b64, prompt = PROMPT) {
  let r;
  if (p === 'claude') {
    // Sonnet 5.5 / Opus 5.5 は、安全チェックで断られたときにサーバー側で別のモデルへ切り替えてもらう
    const fb = model === 'claude-sonnet-5-5' || model === 'claude-opus-5-5';
    r = await fetch(PROVIDERS.claude.url, {
      method: 'POST',
      signal: aiCtl?.signal,
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
        ...(fb && { 'anthropic-beta': 'server-side-fallback-2026-07-01' })
      },
      body: JSON.stringify({
        // 新しいモデルは考える分もここに入るので、余裕を持たせる（足りないと結果のJSONが途中で切れる）
        model, max_tokens: 16000,
        ...(fb && { fallbacks: 'default' }),
        messages: [{ role: 'user', content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: b64 } },
          { type: 'text', text: prompt },
        ] }]
      })
    });
  } else {
    // Gemini / OpenRouter（OpenAI互換）
    r = await fetch(PROVIDERS[p].url, {
      method: 'POST',
      signal: aiCtl?.signal,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: [
          { type: 'text', text: prompt },
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
  if (p === 'claude') {
    // 安全チェックで断られたときも 200 で返ってくる
    if (d.stop_reason === 'refusal') return { ok: false, status: r.status, msg: 'この画像はAIに読み取りを断られた。別の写真で試すか、設定で別のAIに切り替えてみて' };
    if (d.stop_reason === 'max_tokens') return { ok: false, status: r.status, msg: '読み取る量が多すぎて途中で切れた。範囲をしぼるか、ページを分けて試してみて' };
    return { ok: true, text: (d.content || []).map(b => b.text || '').join('') };
  }
  const c = d.choices?.[0]?.message?.content;
  return { ok: true, text: Array.isArray(c) ? c.map(x => x.text || '').join('') : (c || '') };
}

// 混雑時は自動でやり直し、予備のモデルがあれば切り替える
async function callVision(b64, prompt = PROMPT, st = $('#ocrStatus')) {
  const p = state.provider, key = state.keys[p], main = modelOf(p);
  if (!key) throw new Error('設定でAPIキーを入れてね');
  if (!main) throw new Error('設定でモデルIDを入れてね');

  const models = [main];
  if (FALLBACK_MODEL[p] && FALLBACK_MODEL[p] !== main) models.push(FALLBACK_MODEL[p]);
  let lastMsg = '';

  for (const [mi, model] of models.entries()) {
    if (mi > 0) st.textContent = `混雑が続いてるから ${model} に切り替えるね`;
    for (let n = 0; n < 3; n++) {
      if (n > 0) {
        const w = 2 ** n * 2; // 4秒 → 8秒
        st.textContent = `混んでるみたい。${w}秒後にもう一回試すね（${model}）`;
        await aiSleep(w * 1000);
        st.textContent = `読み取り中…（${model}）`;
      }
      const r = await requestOnce(p, key, model, b64, prompt);
      aiCheck();
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
function clearImportImgs() {
  $('#imgFile').value = '';
  $('#imgPreview').style.display = 'none';
  $('#imgPreview').removeAttribute('src');
  for (const img of $('#imgThumbs').querySelectorAll('img')) URL.revokeObjectURL(img.src);
  $('#imgThumbs').innerHTML = '';
  $('#imgThumbs').hidden = true;
  $('#ocrResult').innerHTML = '';
}
// 時間割の画像：何枚でも（前期と後期、曜日で分かれたスクショなど）。2枚以上は小さく並べる
$('#imgFile').onchange = e => {
  const fs = [...e.target.files];
  const p = $('#imgPreview'), th = $('#imgThumbs');
  for (const img of th.querySelectorAll('img')) URL.revokeObjectURL(img.src);
  th.innerHTML = '';
  th.hidden = fs.length < 2;
  p.style.display = fs.length === 1 ? 'block' : 'none';
  if (fs.length === 1) p.src = URL.createObjectURL(fs[0]);
  if (fs.length > 1) {
    th.innerHTML = fs.map(() => '<img alt="">').join('');
    th.querySelectorAll('img').forEach((img, i) => { img.src = URL.createObjectURL(fs[i]); });
    $('#ocrStatus').textContent = `${fs.length}枚選んだよ。まとめて読み取って1つの表にするよ`;
  }
};

function friendlyError(err) {
  if (err instanceof TypeError && /fetch|network|load failed/i.test(err.message))
    return '通信できなかった。ネットにつながってるか確認してね';
  if (err instanceof SyntaxError) return '結果がうまく読めなかった。もう一回試すか、別のモデルで試してみて';
  return err.message;
}

let ocrRunning = false;
$('#runOcr').onclick = async () => {
  if (ocrRunning) return;
  const fs = [...$('#imgFile').files];
  if (!fs.length) return alert('画像を選んでね');
  ocrRunning = true;
  $('#runOcr').disabled = true;
  aiBegin('#runOcr');
  const st = $('#ocrStatus');
  // 何枚でも読んで1つの表にする。同じ曜日・時限・授業名は1つにまとめる（スクショが重なってても大丈夫なように）
  const all = [], seen = new Set();
  let done = 0;
  try {
    for (const [i, f] of fs.entries()) {
      if (i > 0) await aiSleep(2000); // 回数制限にかからないように間をあける
      st.textContent = `読み取り中…（${PROVIDERS[state.provider].label}${fs.length > 1 ? `・${i + 1}/${fs.length}枚目` : ''}）`;
      const txt = await callVision(await fileToJpegBase64(f), PROMPT, st);
      const s = txt.indexOf('['), e = txt.lastIndexOf(']');
      if (s < 0 || e < s) throw new Error(`${fs.length > 1 ? `${i + 1}枚目の` : ''}結果がうまく読めなかった。別のモデルで試してみて`);
      for (const c of JSON.parse(txt.slice(s, e + 1))) {
        const key = [String(c?.day ?? '').trim().charAt(0), +c?.period || 1, String(c?.name ?? '').trim()].join('|');
        if (seen.has(key)) continue;
        seen.add(key); all.push(c);
      }
      done++;
    }
    showRows(all);
    st.textContent = `${fs.length > 1 ? `${fs.length}枚から` : ''}${all.length}件読み取ったよ。間違いがあれば直してから保存してね。`;
  } catch (err) {
    // 途中まで読めた分は出しておく
    if (all.length) showRows(all);
    const part = done && fs.length > 1 ? `（${done}枚目までは読めたので下に出したよ）` : '';
    st.textContent = (isAbort(err) ? '中止したよ' : 'エラー: ' + friendlyError(err)) + part;
  } finally {
    aiEnd('#runOcr');
    ocrRunning = false;
    $('#runOcr').disabled = false;
  }
};

function showRows(arr) {
  const dayOpts = sel => DAYS.map((d, i) => `<option value="${i}" ${i === sel ? 'selected' : ''}>${d}</option>`).join('');
  // 「月曜」「月曜日」で返ってきても先頭1文字で判定
  const dayOf = c => Math.max(0, DAYS.indexOf(String(c.day ?? '').trim().charAt(0)));
  // 曜日→時限の順に並べる
  const rows = arr.map(c => ({ ...c, _d: dayOf(c), _p: +c.period || 1 }))
    .sort((a, b) => (a._d - b._d) || (a._p - b._p));
  $('#ocrResult').innerHTML =
    '<table><tr><td>曜</td><td>限</td><td>授業名</td><td>教員</td><td>教室</td><td>除外</td></tr>' +
    rows.map(c =>
      `<tr class="r"><td><select class="d" aria-label="曜日">${dayOpts(c._d)}</select></td>` +
      `<td><input class="p" type="number" min="1" max="10" value="${c._p}" aria-label="時限"></td>` +
      `<td><input class="n" value="${esc(c.name)}" aria-label="授業名"></td>` +
      `<td><input class="t" value="${esc(c.teacher)}" aria-label="教員"></td>` +
      `<td><input class="rm" value="${esc(c.room)}" aria-label="教室"></td>` +
      `<td><input type="checkbox" class="skip" aria-label="除外"></td></tr>`
    ).join('') + '</table>';
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

  // 引き継ぐのは「授業名・曜日・時限」が全部同じ授業だけ（1対1）
  const t = term(), old = courses(), used = new Set();
  let skipped = 0;
  const list = replace ? rows : rows.filter(r => {
    const dup = old.some(c => c.name === r.name && c.day === r.day && c.period === r.period);
    if (dup) skipped++;
    return !dup;
  });
  if (!list.length) return alert('全部もう登録されてるよ');
  const pairs = list.map(r => {
    const prev = replace
      ? old.find(c => !used.has(c) && c.name === r.name && c.day === r.day && c.period === r.period)
      : null;
    if (prev) used.add(prev);
    return [r, prev];
  });
  let backup = null;
  if (replace) {
    const keep = old.filter(c => c.day !== -1);
    const gone = keep.filter(c => !used.has(c));
    const lost = gone.filter(c =>
      c.items.length || c.memos.length || c.tasks.length || c.syllabus || c.absences.length);
    let msg = `「${t.name}」の時間割を置き換える？\n\n` +
      `今の授業 ${keep.length}件 → 読み込んだ授業 ${rows.length}件になるよ`;
    if (gone.length) msg += `\n今の授業のうち ${gone.length}件は時間割から消える`;
    if (lost.length) msg += '\n\n次の授業のメモ・持ち物・課題・欠席は消えるよ（授業名・曜日・時限が全部同じものだけ引き継ぐ）\n' +
      lost.map(c => `・${DAYS[c.day]}${c.period} ${nm(c)}`).join('\n');
    if (!confirm(msg)) return;
    // 読み込んだ数が今の半分より少ないときは、もう1回聞く
    if (rows.length < keep.length / 2 &&
        !confirm(`ほんとに置き換えて大丈夫？\n読み込んだのは ${rows.length}件だけだよ。\n授業を足したいだけなら、キャンセルして置き換えない方を選んでね`)) return;
    backup = { courses: structuredClone(old), cancels: structuredClone(t.cancels) };
    // 置き換える前の状態を端末にも残す（あとから「↩ 取り消す」で戻せる）
    try {
      localStorage.setItem('undoSnap', JSON.stringify({ t: Date.now(), msg: `「${t.name}」の置き換え`, snap: JSON.stringify(state) }));
    } catch (e) {
      console.warn('undoSnap', e);
    }
  }
  const added = pairs.map(([r, prev]) => prev ? Object.assign(prev, r) : newCourse(r.day, r.period, r));
  // 置き換えても集中講義は残す
  t.courses = replace ? added.concat(old.filter(c => c.day === -1)) : old.concat(added);
  if (replace) {
    const ids = new Set(t.courses.map(c => c.id));
    t.cancels = t.cancels.filter(x => ids.has(x.courseId));
  }
  state.periods = Math.max(state.periods, ...rows.map(r => r.period));
  if (rows.some(r => r.day === 5)) state.showSat = true;
  scheduleChanged();
  $('#importDlg').close();
  clearImportImgs(); // 次に開いたとき、同じ画像をまた読み取って二重に入れないように
  if (!backup && skipped) toast(`もう登録してある${skipped}件は飛ばしたよ`);
  if (backup) toast('時間割を置き換えたよ', () => {
    t.courses = backup.courses;
    t.cancels = backup.cancels;
    scheduleChanged();
  });
}
$('#applyReplace').onclick = () => applyImport(true);
$('#applyAdd').onclick = () => applyImport(false);

/* ===== 学期・休み・振替 ===== */
$('#swapDay').innerHTML = DAYS.map((d, i) => `<option value="${i}">${d}曜</option>`).join('');

function renderTermList() {
  $('#termList').innerHTML = state.terms.map(t =>
    `<li><div class="termBox">` +
      `<div class="row"><input data-rename="${t.id}" value="${esc(t.name)}" aria-label="学期の名前">` +
        (t.id === state.currentTermId ? '<span class="tag">表示中</span>' : '') +
        `<span class="from">${t.courses.length}件</span>` +
        `<button class="x" data-termdel="${t.id}">削除</button></div>` +
      `<div class="row"><span class="hint">開始</span><input type="date" data-tstart="${t.id}" aria-label="開始日">` +
        `<button type="button" class="x" data-tclr="${t.id}" data-k="start" aria-label="開始日を消す">×</button></div>` +
      `<div class="row"><span class="hint">終了</span><input type="date" data-tend="${t.id}" aria-label="終了日">` +
        `<button type="button" class="x" data-tclr="${t.id}" data-k="end" aria-label="終了日を消す">×</button></div>` +
    `</div></li>`).join('');
  // 日付は初期値として埋め込まない（iPhoneの「リセット」で空にできるように）
  for (const t of state.terms) {
    $(`[data-tstart="${t.id}"]`).value = t.start;
    $(`[data-tend="${t.id}"]`).value = t.end;
  }
}

// 学期の画面：たたんだ見出しの横に、今の状態を小さく
function renderTermSums() {
  const t = term(), d = s => { const x = parseYmd(s); return `${x.getMonth() + 1}/${x.getDate()}`; };
  $('#termSum').textContent = t.start ? `${d(t.start)}〜${t.end ? d(t.end) : ''}` : '開始日がまだ';
  $('#offSum').textContent = t.offDays.length ? `${t.offDays.length}件` : 'なし';
  $('#swapSum').textContent = t.swaps.length ? `${t.swaps.length}件` : 'なし';
}
$('#termDlg').addEventListener('change', () => setTimeout(renderTermSums, 0));
$('#termDlg').addEventListener('click', () => setTimeout(renderTermSums, 0));

function renderOffList() {
  const t = term();
  renderTermSums();
  $('#offTitle').textContent = `「${t.name}」の授業がない日`;
  $('#offList').innerHTML = t.offDays.slice().sort((a, b) => a.from.localeCompare(b.from)).map(o =>
    `<li><span>${esc(offLabel(o))}</span><button class="x" data-offdel="${o.id}" aria-label="削除">×</button></li>`).join('')
    || '<li class="muted">なし</li>';
  $('#swapList').innerHTML = t.swaps.slice().sort((a, b) => a.date.localeCompare(b.date)).map(x =>
    `<li><span>${md(parseYmd(x.date))} は${DAYS[x.asDay]}曜の授業</span>` +
    `<button class="x" data-swapdel="${x.id}" aria-label="削除">×</button></li>`).join('')
    || '<li class="muted">なし</li>';
}

function openTermDlg(openId = '') {
  renderTermList();
  renderOffList();
  for (const id of ['offFrom', 'offTo', 'offNote', 'swapDate', 'newTermStart', 'newTermEnd']) $('#' + id).value = '';
  $('#newTermName').value = nextTermName(term().name);
  $('#newTermCopy').checked = false;
  // 共有
  $('#shareItems').checked = false;
  $('#shareOff').checked = true;
  $('#shareIn').value = '';
  shareData = null;
  renderSharePreview();
  document.querySelectorAll('#termDlg details').forEach(d => { d.open = false; });
  $('#termDlg').showModal();
  $('#termDlg').scrollTop = 0;
  if (openId) {
    $('#' + openId).open = true;
    $('#' + openId).scrollIntoView({ block: 'nearest' });
  }
}
$('#termBtn').onclick = () => openTermDlg();
$('#termClose').onclick = () => $('#termDlg').close();

$('#termList').addEventListener('input', e => {
  const id = e.target.dataset.rename;
  if (!id) return;
  state.terms.find(t => t.id === id).name = e.target.value;
  save(); renderTermSelect(); renderOffList();
});
// 選んでる途中（ホイールを回してる間）はチェックしない。おかしければ反映しないだけ
$('#termList').addEventListener('change', e => {
  const { tstart, tend } = e.target.dataset;
  const id = tstart || tend;
  if (!id) return;
  const t = state.terms.find(x => x.id === id);
  const k = tstart ? 'start' : 'end', v = e.target.value;
  const s = k === 'start' ? v : t.start, en = k === 'end' ? v : t.end;
  if (s && en && en < s) return;
  t[k] = v;
  scheduleChanged();
});
// 日付欄から離れたときに、反映できてなければ知らせて戻す
$('#termList').addEventListener('focusout', e => {
  const { tstart, tend } = e.target.dataset;
  const id = tstart || tend;
  if (!id) return;
  const t = state.terms.find(x => x.id === id);
  const k = tstart ? 'start' : 'end';
  if (e.target.value === t[k]) return;
  alert('終了日が開始日より前になってるよ');
  e.target.value = t[k];
});

$('#termList').addEventListener('click', e => {
  const clr = e.target.closest('[data-tclr]');
  if (clr) {
    const t = state.terms.find(x => x.id === clr.dataset.tclr);
    if (!t) return;
    t[clr.dataset.k] = '';
    renderTermList();
    scheduleChanged();
    return;
  }
  const id = e.target.dataset.termdel;
  if (!id) return;
  if (state.terms.length === 1) return alert('学期は最低1つ必要だよ');
  const t = state.terms.find(x => x.id === id);
  if (!confirm(`「${t.name}」を削除する？授業・メモ・課題も全部消えるよ`)) return;
  withUndo(`「${t.name}」を削除したよ`, () => {
    state.terms = state.terms.filter(x => x.id !== id);
    if (state.currentTermId === id) state.currentTermId = state.terms[0].id;
  });
  renderTermList(); renderOffList();
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
  const copied = $('#newTermCopy').checked ? courses().filter(c => c.day !== -1).map(c => newCourse(c.day, c.period, {
    name: c.name, short: c.short, teacher: c.teacher, room: c.room, syllabus: c.syllabus, maxAbsence: c.maxAbsence, tag: c.tag,
    items: c.items.filter(i => i.type === 'always').map(i => ({ ...i, id: uid() }))
  })) : [];
  const t = newTerm(name, start, end, copied);
  state.terms.push(t);
  state.currentTermId = t.id;
  save(); renderAll(); $('#termDlg').close();
};

/* ===== 設定 ===== */
let tmp = null;      // 保存を押すまでの一時データ
let snapshot = '';   // 開いたときの状態（変更があったかの判定用）

$('#sProvider').innerHTML = Object.entries(PROVIDERS)
  .map(([k, v]) => `<option value="${k}">${esc(v.label)}</option>`).join('');

function fillProviderFields(p) {
  tmp.provider = p;
  $('#sProvider').value = p;
  $('#sKey').value = tmp.keys[p] || '';
  const list = PROVIDERS[p].models, m = tmp.models[p] || PROVIDERS[p].model;
  $('#sModelPick').innerHTML = list.map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('') +
    '<option value="">その他（直接入力）</option>';
  const preset = list.includes(m);
  $('#sModelPick').value = preset ? m : '';
  $('#sModel').value = preset ? '' : m;
  $('#sModel').hidden = preset;
  $('#sKeyLink').href = PROVIDERS[p].keyUrl;
  $('#sNote').textContent = PROVIDERS[p].note;
}
function stashProviderFields() {
  tmp.keys[tmp.provider] = $('#sKey').value.trim();
  tmp.models[tmp.provider] = $('#sModelPick').value || $('#sModel').value.trim();
}
$('#sModelPick').onchange = e => {
  $('#sModel').hidden = !!e.target.value;
  if (!e.target.value) $('#sModel').focus();
};

const clampPeriods = v => Math.min(10, Math.max(1, +v || 7));

function renderTimes() {
  $('#sTimes').innerHTML = Array.from({ length: tmp.periods }, (_, i) =>
    `<tr data-p="${i + 1}"><td>${i + 1}限</td>` +
    `<td><input type="time" class="ts" value="${esc(tmp.times[i].start)}" aria-label="${i + 1}限の開始"></td><td>〜</td>` +
    `<td><input type="time" class="te" value="${esc(tmp.times[i].end)}" aria-label="${i + 1}限の終了"></td></tr>`).join('');
}
function stashTimes() {
  document.querySelectorAll('#sTimes tr[data-p]').forEach(tr => {
    tmp.times[+tr.dataset.p - 1] = { start: tr.querySelector('.ts').value, end: tr.querySelector('.te').value };
  });
}
// 表は作り直さず、数字だけ書き換える
function syncTimeInputs() {
  document.querySelectorAll('#sTimes tr[data-p]').forEach(tr => {
    const t = tmp.times[+tr.dataset.p - 1];
    tr.querySelector('.ts').value = t.start;
    tr.querySelector('.te').value = t.end;
  });
}

// 時刻を delta 分ずらす（空欄と、日付をまたぐ値はそのまま）
function shiftTime(t, k, delta) {
  const v = toMin(t[k]);
  if (v == null) return;
  const n = v + delta;
  if (n >= 0 && n < 24 * 60) t[k] = fromMin(n);
}

// 入力を始めたときの値を覚えておく
let editBefore = null;
$('#sTimes').addEventListener('focusin', e => {
  if (e.target.matches('.ts, .te')) editBefore = e.target.value;
});

// 入力欄から離れたときにだけ、後ろの時限をずらす
$('#sTimes').addEventListener('focusout', e => {
  const el = e.target;
  if (!el.matches('.ts, .te')) return;
  const i = +el.closest('tr[data-p]').dataset.p - 1;
  const k = el.classList.contains('ts') ? 'start' : 'end';
  const before = toMin(editBefore), after = toMin(el.value);
  editBefore = null;
  tmp.times[i][k] = el.value;
  if (!$('#sShift').checked || before == null || after == null || before === after) return;

  const delta = after - before;
  if (k === 'start') shiftTime(tmp.times[i], 'end', delta); // 開始を変えたら同じ時限の終了も
  for (let j = i + 1; j < 10; j++) {                        // 後ろの時限は全部
    shiftTime(tmp.times[j], 'start', delta);
    shiftTime(tmp.times[j], 'end', delta);
  }
  syncTimeInputs();
});

// 画面の入力を一時データに集める
function collect() {
  stashProviderFields();
  stashTimes();
  tmp.periods = clampPeriods($('#sPeriods').value);
  tmp.showSat = $('#sSat').checked;
  tmp.shiftTimes = $('#sShift').checked;
  tmp.syllabusSearch = $('#sSyllabus').value.trim();
  tmp.theme = { color: $('#sColor').value, font: $('#sFont').value };
  tmp.taskLead = getLeadUI('s') || '2w';
  tmp.weekStart = $('#sWeekStart').value === 'sun' ? 'sun' : 'mon';
  for (const c of document.querySelectorAll('#setFeat [data-feat]')) tmp.features[c.dataset.feat] = c.checked;
}

function renderLastExport() {
  const t = state.lastExport;
  $('#lastExport').textContent = t
    ? `最後の書き出し：${md(new Date(t))}（${dayDiff(new Date(), new Date(t))}日前）`
    : 'まだ書き出してないよ';
}

function openSettings() {
  tmp = {
    provider: state.provider,
    keys: { ...state.keys },
    models: { ...state.models },
    times: structuredClone(state.times),
    periods: state.periods,
    showSat: state.showSat,
    shiftTimes: state.shiftTimes,
    syllabusSearch: state.syllabusSearch,
    theme: { ...state.theme },
    taskLead: state.taskLead,
    useGrid: state.useGrid,
    weekStart: state.weekStart,
    features: { ...state.features }
  };
  fillProviderFields(state.provider);
  $('#sWeekStart').value = tmp.weekStart;
  document.querySelectorAll('#setFeat [data-feat]').forEach(c => { c.checked = tmp.features[c.dataset.feat] !== false; });
  $('#sPeriods').value = tmp.periods;
  $('#sSat').checked = tmp.showSat;
  $('#sShift').checked = tmp.shiftTimes;
  $('#sSyllabus').value = tmp.syllabusSearch;
  $('#sColor').value = tmp.theme.color;
  $('#sFont').value = tmp.theme.font;setLeadUI('s', tmp.taskLead);
  $('#sUseGrid').checked = tmp.useGrid;
  $('#restoreFile').value = '';
  renderTimes();
  collect();
  snapshot = JSON.stringify(tmp);
  renderLastExport();
  $('#aiBox').open = false;
  $('#iconBox').open = false;
  $('#settingsDlg').showModal();
  $('#settingsDlg').scrollTop = 0;
}

async function closeSettings() {
  collect();
  if (JSON.stringify(tmp) !== snapshot) {
    const a = await ask3();
    if (a === 'back') return;
    if (a === 'save') return $('#sSave').onclick();
  }
  applyTheme(state.theme); // 試した色や文字を元に戻す
  $('#settingsDlg').close();
}

$('#settingsBtn').onclick = openSettings;
$('#sX').onclick = closeSettings;
$('#sCancel').onclick = closeSettings;
$('#settingsDlg').addEventListener('cancel', e => { e.preventDefault(); closeSettings(); }); // Escキー

// 選んだ時点で見た目を試せるように
for (const id of ['sColor', 'sFont']) {
  $('#' + id).addEventListener('change', () =>
    applyTheme({ color: $('#sColor').value, font: $('#sFont').value }));
}

$('#sProvider').onchange = e => { stashProviderFields(); fillProviderFields(e.target.value); };
$('#sPeriods').addEventListener('input', e => {
  if (!e.target.value) return;
  stashTimes();
  tmp.periods = clampPeriods(e.target.value);
  renderTimes();
});

$('#sSave').onclick = () => {
  collect();
  for (let i = 0; i < tmp.periods; i++) {
    const s = toMin(tmp.times[i].start), en = toMin(tmp.times[i].end);
    if (s != null && en != null && s >= en) return alert(`${i + 1}限の終了が開始より前になってるよ`);
  }
  if (tmp.syllabusSearch && !isHttp(tmp.syllabusSearch)) return alert('シラバス検索のURLは https:// から始まる形で入れてね');
  state.provider = tmp.provider;
  state.keys = tmp.keys;
  state.models = tmp.models;
  state.times = tmp.times;
  state.periods = tmp.periods;
  state.showSat = tmp.showSat;
  state.shiftTimes = tmp.shiftTimes;
  state.syllabusSearch = tmp.syllabusSearch;
  state.theme = tmp.theme;
  state.taskLead = tmp.taskLead;
  state.useGrid = tmp.useGrid;
  state.weekStart = tmp.weekStart;
  const groupWasOff = !featOn('group');
  state.features = { ...tmp.features };
  applyTheme(state.theme);
  scheduleChanged(); // renderAll → applyMode で、オフの機能を隠す
  // 共有グループをオンに戻したら、グループの予定を読み直す
  if (groupWasOff && featOn('group') && grMe() && navigator.onLine) loadGroups().catch(err => console.warn('共有グループ', err));
  if (curTab === 'cal' && calMonth) renderCal();
  $('#settingsDlg').close();
};

/* ===== バックアップ ===== */
$('#exportBtn').onclick = async () => {
  const { keys, ...rest } = state; // キーは書き出さない
  const name = `jikanwari-${todayStr()}.json`;
  const blob = new Blob([JSON.stringify(rest, null, 2)], { type: 'application/json' });
  const file = new File([blob], name, { type: 'application/json' });
  let shared = false;
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file] }); shared = true; }
    catch (e) { if (e.name === 'AbortError') return; }
  }
  if (!shared) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 10000);
  }
  state.lastExport = Date.now();
  save(); renderLastExport();
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
    withUndo('復元したよ', () => {
      state = normalize({ ...s, keys: state.keys, models: state.models, provider: state.provider });
      applyTheme(state.theme);
    });
    $('#settingsDlg').close();
  } catch {
    alert('ファイルが読めなかった');
  } finally {
    e.target.value = '';
  }
};

/* ===== 時間割の共有 ===== */
const SHARE_TAG = 'JKWR1';
let shareCode = '';   // 送る用のコード（先に作っておく）
let shareData = null; // 受け取って読み込んだ中身
let shareSeq = 0;

const b64u = bytes => {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const unb64u = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), ch => ch.charCodeAt(0));

// 圧縮できれば z、できなければそのまま p
async function packText(str) {
  const bytes = new TextEncoder().encode(str);
  if (typeof CompressionStream === 'function') {
    try {
      const st = new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'));
      return 'z.' + b64u(new Uint8Array(await new Response(st).arrayBuffer()));
    } catch {}
  }
  return 'p.' + b64u(bytes);
}
async function unpackText(mode, body) {
  const bytes = unb64u(body);
  if (mode === 'p') return new TextDecoder().decode(bytes);
  if (typeof DecompressionStream !== 'function') throw new Error('old');
  const st = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return await new Response(st).text();
}

// 送る中身（メモ・課題・欠席・予定は入れない）
function shareJSON() {
  const t = term(), withItems = $('#shareItems').checked;
  const d = {
    v: 1, name: t.name, start: t.start, end: t.end, p: state.periods,
    times: state.times.map(x => [x.start, x.end]),
    c: t.courses.filter(c => c.name.trim()).map(c => [
      c.day, c.period, c.name, c.short, c.teacher, c.room, c.syllabus, c.from, c.to,
      withItems ? c.items.filter(i => i.type === 'always').map(i => i.text) : [],
      tagOf(c) ? [tagOf(c).name, tagOf(c).color] : 0
    ])
  };
  if ($('#shareOff').checked) {
    d.off = t.offDays.map(o => [o.from, o.to, o.note]);
    d.sw = t.swaps.map(x => [x.date, x.asDay]);
  }
  return JSON.stringify(d);
}

// iPhoneは押した瞬間に共有シートを出さないと止められるので、コードは先に作っておく
async function renderShareCode() {
  const n = courses().filter(c => c.name.trim()).length;
  const seq = ++shareSeq;
  $('#shareSend').disabled = true;
  shareCode = '';
  $('#shareInfo').textContent = n ? `「${term().name}」の授業${n}件を送るよ` : '送れる授業がまだないよ';
  if (!n) return;
  const code = await packText(shareJSON());
  if (seq !== shareSeq) return;
  shareCode = code;
  $('#shareSend').disabled = false;
}

function shareText() {
  const url = APP_URL;
  return `がくログの共有コード（${term().name}）\n` +
    `アプリの「その他」→「時間割を共有」に、このメッセージを丸ごと貼り付けてね\n${url}\n\n` +
    `${SHARE_TAG}.${shareCode}`;
}

function copyShare(text) {
  const manual = () => prompt('これをコピーして送ってね', text);
  if (!navigator.clipboard) return manual();
  navigator.clipboard.writeText(text).then(
    () => { $('#shareInfo').textContent = 'コピーしたよ。LINEなどに貼り付けて送ってね'; },
    manual);
}

$('#shareSec').addEventListener('toggle', e => { if (e.target.open) renderShareCode(); });
$('#shareItems').onchange = renderShareCode;
$('#shareOff').onchange = renderShareCode;

$('#shareSend').onclick = () => {
  if (!shareCode) return;
  const text = shareText();
  if (navigator.share) {
    navigator.share({ text }).catch(e => { if (e.name !== 'AbortError') copyShare(text); });
  } else {
    copyShare(text);
  }
};

// 受け取ったデータの中身を確かめる
function parseShare(d) {
  if (!d || d.v !== 1 || !Array.isArray(d.c)) throw new Error('bad');
  const str = v => typeof v === 'string' ? v.slice(0, 300) : '';
  const hhmm = v => typeof v === 'string' && /^\d{2}:\d{2}$/.test(v) ? v : '';
  const okDay = v => Number.isInteger(v) && v >= -1 && v <= 5;
  const okPeriod = v => Number.isInteger(v) && v >= 1 && v <= 10;

  const cs = d.c.slice(0, 200).filter(Array.isArray).map(
    ([day, period, name, short, teacher, room, syllabus, from, to, items, tag]) => ({
      day: okDay(day) ? day : 0,
      period: okPeriod(period) ? period : 1,
      name: str(name).trim(), short: str(short), teacher: str(teacher), room: str(room),
      syllabus: isHttp(syllabus) ? str(syllabus) : '',
      from: isYmd(from) ? from : '', to: isYmd(to) ? to : '',
      tag: Array.isArray(tag) && str(tag[0]).trim()
        ? { name: str(tag[0]).trim().slice(0, 10), color: TAG_COLORS.includes(tag[1]) ? tag[1] : TAG_COLORS[0] } : null
    })).filter(c => c.name);
  if (!cs.length) throw new Error('bad');

  return {
    name: str(d.name).trim() || defaultTermName(),
    start: isYmd(d.start) ? d.start : '',
    end: isYmd(d.end) ? d.end : '',
    periods: clampPeriods(d.p),
    times: Array.isArray(d.times) && d.times.length === 10
      ? d.times.map(x => ({ start: hhmm(x?.[0]), end: hhmm(x?.[1]) })) : null,
    courses: cs,
    off: Array.isArray(d.off)
      ? d.off.filter(o => Array.isArray(o) && isYmd(o[0]))
          .map(([from, to, note]) => ({ from, to: isYmd(to) && to > from ? to : '', note: str(note) }))
      : [],
    swaps: Array.isArray(d.sw)
      ? d.sw.filter(x => Array.isArray(x) && isYmd(x[0]) && Number.isInteger(x[1]) && x[1] >= 0 && x[1] <= 5)
          .map(([date, asDay]) => ({ date, asDay }))
      : []
  };
}

$('#shareRead').onclick = async () => {
  const raw = $('#shareIn').value.replace(/\s+/g, '');
  const m = raw.match(new RegExp(`${SHARE_TAG}\\.([zp])\\.([A-Za-z0-9_-]+)`));
  if (!m) return alert('共有コードが見つからなかった。もらったメッセージを丸ごと貼り付けてね');
  try {
    shareData = parseShare(JSON.parse(await unpackText(m[1], m[2])));
  } catch (e) {
    shareData = null;
    alert(e.message === 'old'
      ? 'このブラウザだと読めなかった。iOSを新しくしてみて'
      : 'コードが途中で切れてるか、壊れてるみたい。もう一回送ってもらってね');
  }
  renderSharePreview();
};

function renderSharePreview() {
  const d = shareData;
  $('#sharePreview').hidden = !d;
  if (!d) return;
  const list = d.courses.slice().sort((a, b) =>
    (a.day < 0) - (b.day < 0) || a.day - b.day || a.period - b.period);
  const nItems = d.courses.reduce((n, c) => n + c.items.length, 0);
  $('#shareSum').textContent = `「${d.name}」の授業${d.courses.length}件` +
    (d.off.length ? `・休み${d.off.length}件` : '') +
    (d.swaps.length ? `・振替${d.swaps.length}件` : '') +
    (nItems ? `・持ち物${nItems}件` : '');
  $('#shareList').innerHTML = list.map(c =>
    `<li><span><span class="tag">${c.day < 0 ? '集中' : DAYS[c.day] + c.period}</span>${esc(c.short.trim() || c.name)}</span>` +
    `<span class="from">${esc([c.teacher, c.room].filter(Boolean).join('・'))}</span></li>`).join('');
  const diff = !!d.times && d.times.some((x, i) =>
    x.start !== state.times[i].start || x.end !== state.times[i].end);
  $('#shareTimesBox').hidden = !diff;
  $('#shareTimes').checked = false;
}

const fromShare = c => newCourse(c.day, c.period, {
  name: c.name, short: c.short, teacher: c.teacher, room: c.room,
  syllabus: c.syllabus, from: c.from, to: c.to,
  tag: shareTag(c.tag),
  items: c.items.map(text => ({ id: uid(), text, type: 'always', added: Date.now(), until: null }))
});

function applyShareCommon(d) {
  if (!$('#shareTimesBox').hidden && $('#shareTimes').checked) state.times = structuredClone(d.times);
  state.periods = Math.max(state.periods, d.periods, ...d.courses.filter(c => c.day >= 0).map(c => c.period));
  if (d.courses.some(c => c.day === 5)) state.showSat = true;
}

function finishShare(msg) {
  shareData = null;
  $('#shareIn').value = '';
  scheduleChanged();
  $('#termDlg').close();
  toast(msg);
}

$('#shareNew').onclick = () => {
  const d = shareData;
  if (!d) return;
  if (!confirm(`「${d.name}」を新しい学期として追加して、切り替える？`)) return;
  const t = newTerm(d.name, d.start, d.end, d.courses.map(fromShare));
  t.offDays = d.off.map(o => ({ id: uid(), ...o }));
  t.swaps = d.swaps.map(x => ({ id: uid(), ...x }));
  state.terms.push(t);
  state.currentTermId = t.id;
  applyShareCommon(d);
  finishShare(`「${d.name}」を追加したよ`);
};

$('#shareAdd').onclick = () => {
  const d = shareData;
  if (!d) return;
  const t = term();
  // 授業名・曜日・時限が同じ授業は飛ばす
  const fresh = d.courses.filter(c =>
    !t.courses.some(x => x.name === c.name && x.day === c.day && x.period === c.period));
  const offs = d.off.filter(o => !t.offDays.some(x => x.from === o.from && (x.to || '') === o.to));
  const sws = d.swaps.filter(x => !t.swaps.some(y => y.date === x.date));
  if (!fresh.length && !offs.length && !sws.length) return alert('全部もう入ってたよ');
  const skip = d.courses.length - fresh.length;
  if (!confirm(`「${t.name}」に授業${fresh.length}件を追加する？` +
    (skip ? `\n（同じ授業${skip}件は飛ばすよ）` : ''))) return;
  t.courses.push(...fresh.map(fromShare));
  t.offDays.push(...offs.map(o => ({ id: uid(), ...o })));
  t.swaps.push(...sws.map(x => ({ id: uid(), ...x })));
  applyShareCommon(d);
  finishShare(`授業${fresh.length}件を追加したよ`);
};

/* ===== 収入 ===== */
let inYear = new Date().getFullYear();
let inEditId = null;
const yen = n => `${Math.round(n).toLocaleString('ja-JP')}円`;
const sumOf = (xs, k) => xs.reduce((a, x) => a + (x[k] || 0), 0);
// 総支給がない記録は手取りで代わりに数える（手取り≦総支給なので少なめになる）
const grossOf = x => x.gross ?? x.net ?? 0;
const sumGross = xs => xs.reduce((a, x) => a + grossOf(x), 0);
const netOnly = xs => xs.filter(x => x.gross == null && x.net != null).length;
const incomesOf = y => state.incomes.filter(x => x.date.startsWith(`${y}-`))
  .sort((a, b) => a.date.localeCompare(b.date));

function renderIncome() {
  const xs = incomesOf(inYear);
  const g = sumGross(xs), n = sumOf(xs, 'net'), est = netOnly(xs);
  $('#inYear').textContent = `${inYear}年`;

  // 上限ライン
  let lim = '';
  if (state.incomeLimit !== '') {
    const L = state.incomeLimit, left = L - g;
    const pct = L > 0 ? Math.min(100, g / L * 100) : (g > 0 ? 100 : 0);
    const cls = left < 0 ? 'over' : pct >= 90 ? 'warn' : '';
    lim = `<div class="bar ${cls}"><i style="width:${pct}%"></i></div>` + (left >= 0
      ? `<p class="inLeft">上限まであと <b>${yen(left)}</b></p>`
      : `<p class="inLeft over">上限を ${yen(-left)} こえてる</p>`) +
      '<p class="hint">通勤手当が入ってる・扶養が気になるときは、親か勤務先に確認してね</p>';
  }
  // バイト先ごと
  const jobs = new Map();
  for (const x of xs) jobs.set(x.job || '未設定', (jobs.get(x.job || '未設定') || 0) + grossOf(x));
  $('#inSummary').innerHTML =
    `<p class="inTotal">総支給<b>${yen(g)}</b><small>手取り ${yen(n)}</small></p>` +
    (est ? `<p class="hint">総支給がわからない${est}件は手取りで数えてるよ（*の月）。本当の総支給はこれより少し多いはず</p>` : '') +
    lim +
    jobPie(jobs, g);

  // 月ごと（支給日の月）
  $('#inMonths').innerHTML = '<tr><th>月</th><th>総支給</th><th>手取り</th></tr>' +
    Array.from({ length: 12 }, (_, i) => {
      const ms = xs.filter(x => +x.date.slice(5, 7) === i + 1);
      const has = ms.length > 0;
      return `<tr class="${has ? '' : 'empty'}"><td>${i + 1}月</td>` +
      `<td>${has ? yen(sumGross(ms)) + (netOnly(ms) ? '*' : '') : '-'}</td><td>${has ? yen(sumOf(ms, 'net')) : '-'}</td></tr>`;
    }).join('');

  // 記録（新しい順）
  $('#inList').innerHTML = xs.slice().reverse().map(x =>
    `<li class="${x.id === inEditId ? 'editing' : ''}">` +
    `<button type="button" class="evText inRow" data-inedit="${x.id}">` +
    `<span class="tag">${md(parseYmd(x.date))}</span>${esc(x.job || 'バイト')}` +
    (x.month ? `<span class="from">${+x.month.slice(5)}月分</span>` : '') +
    `<span class="inAmt">` + (x.gross != null
      ? yen(x.gross) + (x.net != null ? ` <small>手取り${yen(x.net)}</small>` : '')
      : `<small>手取り</small> ${yen(x.net)}`) + '</span></button>' +
    `<button class="x" data-indel="${x.id}" aria-label="削除">×</button></li>`).join('')
    || '<li class="muted">この年の記録はまだないよ</li>';
}

// バイト先の候補（過去の記録 → カレンダーのバイト予定）
function renderJobChips() {
  const names = [];
  const add = v => { v = (v || '').trim(); if (v && !names.includes(v) && !state.jobHidden.includes(v)) names.push(v); };
  [...state.incomes].sort((a, b) => b.date.localeCompare(a.date)).forEach(x => add(x.job));
  state.evPresets.filter(p => p.kind === 'job').forEach(p => add(p.title));
  $('#inJobChips').innerHTML = names.slice(0, 8).map(v =>
    `<button type="button" class="chip" data-job="${esc(v)}">${esc(v)}</button>`).join('');
}
$('#inJobChips').addEventListener('click', e => {
  const b = e.target.closest('[data-job]');
  if (b) $('#inJob').value = b.dataset.job;
});

/* ===== 候補の長押しで削除 ===== */
function longPress(box, sel, fn) {
  let timer = null, fired = false, sx = 0, sy = 0;
  const clear = () => { clearTimeout(timer); timer = null; };
  box.addEventListener('pointerdown', e => {
    const b = e.target.closest(sel);
    fired = false;
    if (!b) return;
    sx = e.clientX; sy = e.clientY;
    clear();
    timer = setTimeout(() => { timer = null; fired = true; fn(b); }, 550);
  });
  box.addEventListener('pointermove', e => {
    if (timer && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) clear(); // 指が動いたらスクロール扱い
  });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) box.addEventListener(ev, clear);
  // 長押しのあとのタップで候補が入力されないように
  box.addEventListener('click', e => {
    if (fired) { fired = false; e.preventDefault(); e.stopPropagation(); }
  }, true);
  box.addEventListener('contextmenu', e => { if (e.target.closest(sel)) e.preventDefault(); });
}

longPress($('#evChips'), '[data-preset]', b => {
  const i = +b.dataset.preset, p = state.evPresets[i];
  if (!p || !confirm(`「${p.title}」を候補から消す？\n入ってる予定は消えないよ`)) return;
  state.evPresets.splice(i, 1);
  save(); renderEvSuggest(); renderJobChips();
});
longPress($('#inJobChips'), '[data-job]', b => {
  const v = b.dataset.job;
  if (!confirm(`「${v}」を候補から消す？\n収入の記録は消えないよ`)) return;
  if (!state.jobHidden.includes(v)) state.jobHidden.push(v);
  save(); renderJobChips();
});

/* ===== メモ・一言日記・意見箱 ===== */
const FEEDBACK_URL = 'https://forms.gle/MxiKc1onLaKgThGGA'; // GoogleフォームのURLを入れるとボタンが出る

function renderNotes() {
  const today = todayStr();
  const pin = state.notes.filter(n => n.pin);
  const day = state.notes.filter(n => !n.pin && n.date === today);
  $('#noteList').innerHTML = [...pin, ...day].map(n =>
    `<li><span><button class="tag ${n.pin ? '' : 'next'}" data-ntoggle="${n.id}">${n.pin ? '残す' : '今日だけ'}</button>` +
    `${esc(n.text)}</span><button class="x" data-ndel="${n.id}" aria-label="削除">×</button></li>`).join('')
    || '<li class="muted">なし</li>';
  const d = $('#diaryInput');
  if (document.activeElement !== d) d.value = state.diary[today] || ''; // 書いてる途中は上書きしない
}

function addNote() {
  const text = $('#noteInput').value.trim();
  if (!text) return;
  state.notes.push({ id: uid(), date: todayStr(), text, pin: false });
  $('#noteInput').value = '';
  save(); renderNotes();
}
$('#noteAdd').onclick = addNote;
$('#noteInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); addNote(); }
});

function delNote(id) {
  state.notes = state.notes.filter(x => String(x.id) !== id);
  save(); renderNotes();
  if (curTab === 'cal') { renderCal(); renderDay(); }
}

$('#noteList').addEventListener('click', e => {
  const tg = e.target.closest('[data-ntoggle]');
  if (tg) {
    const n = state.notes.find(x => String(x.id) === tg.dataset.ntoggle);
    if (!n) return;
    n.pin = !n.pin;
    if (!n.pin) n.date = todayStr(); // 「今日だけ」に戻したら今日のメモにする
    save(); renderNotes();
    return;
  }
  const dl = e.target.closest('[data-ndel]');
  if (dl) delNote(dl.dataset.ndel);
});

$('#diaryInput').addEventListener('input', e => {
  const v = e.target.value.trim(), k = todayStr();
  if (v) state.diary[k] = v; else delete state.diary[k];
  save();
});

// カレンダーで見返す・書き直す
$('#dayList').addEventListener('click', async e => {
  const dl = e.target.closest('[data-ndel]');
  if (dl) return delNote(dl.dataset.ndel);
  const dy = e.target.closest('[data-diary]');
  if (!dy) return;
  const k = dy.dataset.diary;
  const v = await askLine(`${md(parseYmd(k))}の一言日記`, state.diary[k] || '', { placeholder: 'どんな日だった？' });
  if (v == null) return;
  if (v.trim()) state.diary[k] = v.trim(); else delete state.diary[k];
  save(); renderCal(); renderDay();
  if (k === todayStr()) renderNotes();
});

// ホームから今日の予定を追加
$('#nowCard').addEventListener('click', e => {
  if (!e.target.closest('[data-addev]')) return;
  showTab('cal');
  setTimeout(() => $('#evHead').scrollIntoView({ block: 'center', behavior: 'smooth' }), 60);
});

$('#feedbackBtn').hidden = !FEEDBACK_URL;
$('#feedbackBtn').onclick = () => window.open(FEEDBACK_URL, '_blank', 'noopener');

function syncInForm() {
  $('#inHead').textContent = inEditId ? '記録を変更' : '収入を追加';
  $('#inSave').textContent = inEditId ? '変更を保存' : '追加';
  $('#inCancel').hidden = !inEditId;
}
function resetInForm() {
  inEditId = null;
  $('#inDate').value = todayStr();
  for (const id of ['inMonth', 'inJob', 'inGross', 'inNet']) $('#' + id).value = '';
  syncInForm();
}

$('#incomeBtn').onclick = () => {
  inYear = new Date().getFullYear();
  $('#inLimit').value = state.incomeLimit;
  resetInForm(); resetScan(); renderJobChips(); renderIncome();
  $('#inScan').open = false;
  $('#incomeDlg').showModal();
  $('#incomeDlg').scrollTop = 0;
};
$('#inX').onclick = () => $('#incomeDlg').close();
$('#inPrev').onclick = () => { inYear--; renderIncome(); };
$('#inNext').onclick = () => { inYear++; renderIncome(); };

$('#inLimit').addEventListener('input', e => {
  state.incomeLimit = toYen(e.target.value) ?? '';
  save(); renderIncome();
});

$('#inSave').onclick = () => {
  const date = $('#inDate').value;
  if (!date) return alert('支給日を入れてね');
  const gross = toYen($('#inGross').value), net = toYen($('#inNet').value);
  if (gross == null && net == null) return alert('総支給か手取りのどっちかは入れてね');
  if (gross != null && net != null && net > gross &&
    !confirm('手取りが総支給より多くなってるけど、このまま保存する？')) return;
  const m = $('#inMonth').value;
  const v = { date, month: /^\d{4}-\d{2}$/.test(m) ? m : '', job: $('#inJob').value.trim(), gross, net };
  if (v.job) state.jobHidden = state.jobHidden.filter(j => j !== v.job); // 消した候補でも、また使ったら戻す
  const x = inEditId && state.incomes.find(k => k.id === inEditId);
  if (x) Object.assign(x, v);
  else state.incomes.push({ id: uid(), ...v });
  inYear = +date.slice(0, 4);
  save(); resetInForm(); renderJobChips(); renderIncome();
  $('#scanStatus').textContent = '';
  toast(x ? '変更したよ' : '追加したよ');
  // 給与明細を何枚か選んでたら、次の写真へ。最後の1枚（1枚だけのときも）を保存したら写真を片づける（同じ明細を二重に入れないように）
  if (!x && scanImg) {
    if (scanQueue.length) scanNext();
    else {
      const n = scanTotal;
      resetScan();
      $('#scanStatus').textContent = n > 1 ? `${n}枚とも終わったよ` : '';
    }
  }
};
$('#inCancel').onclick = () => { resetInForm(); renderIncome(); };

$('#inList').addEventListener('click', e => {
  const ed = e.target.closest('[data-inedit]');
  if (ed) {
    const x = state.incomes.find(k => k.id === ed.dataset.inedit);
    if (!x) return;
    inEditId = x.id;
    $('#inDate').value = x.date;
    $('#inMonth').value = x.month;
    $('#inJob').value = x.job;
    $('#inGross').value = x.gross ?? '';
    $('#inNet').value = x.net ?? '';
    syncInForm(); renderIncome();
    $('#inHead').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  const id = e.target.dataset.indel;
  if (!id || !confirm('この記録を消す？')) return;
  if (id === inEditId) resetInForm();
  withUndo('記録を消したよ', () => {
    state.incomes = state.incomes.filter(k => k.id !== id);
  });
  renderIncome();
});

/* ===== 給与明細の読み取り（範囲選択・塗りつぶし） ===== */
const PAY_PROMPT = `これは給与明細の画像です（一部だけ切り取っていたり、黒く塗りつぶした部分があったりします）。読み取って、JSONオブジェクトだけを出力してください。説明文やコードブロック記号は書かないでください。
形式: {"payDate":"2026-05-25","month":"2026-04","gross":123456,"net":110000}
ルール:
- payDateは支給日（YYYY-MM-DD）。monthは何月分の給与か（YYYY-MM）。
- grossは総支給額（支給合計）。netは差引支給額（手取り・振込額）。どちらも円単位の整数で、カンマや「円」は付けない。
- 和暦（令和8年など）は西暦に直す。
- 書かれていない・読み取れない項目は、日付なら ""、金額なら null にする。推測で埋めない。
- 名前・会社名など、上の4つ以外は出力しない。`;

let scanImg = null, scanUrl = '', scanCrop = null, scanMasks = [], scanHist = [];
let scanMode = 'crop', scanDrag = null, scanRunning = false;
const scanCv = $('#scanCv');

function setScanMode(m) {
  scanMode = m;
  $('#modeCrop').classList.toggle('on', m === 'crop');
  $('#modeMask').classList.toggle('on', m === 'mask');
  $('#scanHint').textContent = m === 'crop'
    ? '送りたいところ（金額と日付）を指でなぞって四角で囲んでね。囲まなければ写真全体を送るよ'
    : '隠したいところをなぞると黒く塗りつぶすよ。何か所でもOK';
}
$('#modeCrop').onclick = () => setScanMode('crop');
$('#modeMask').onclick = () => setScanMode('mask');

function resetScan() {
  if (scanUrl) URL.revokeObjectURL(scanUrl);
  scanImg = null; scanUrl = ''; scanCrop = null; scanMasks = []; scanHist = []; scanDrag = null;
  scanQueue = []; scanTotal = 0; syncScanQueue();
  $('#scanFile').value = '';
  $('#scanBox').hidden = true;
  $('#scanStatus').textContent = '';
  const hasKey = !!state.keys[state.provider];
  $('#scanFile').hidden = !hasKey;
  $('#scanNote').textContent = hasKey
    ? '名前・会社名・口座は、範囲の外に出すか塗りつぶしてから送るのがおすすめ。' +
      (state.provider === 'gemini' ? 'Geminiの無料枠だと、送った画像がGoogleの製品改善に使われるよ' : '')
    : '設定の「画像読み取り（AI）の設定」でAPIキーを入れると使えるよ。キーがなくても下の欄から手入力できる';
  setScanMode('crop');
}

// 給与明細：何枚か選んだら1枚ずつ。読み取って「追加」で保存すると次の写真に進む
let scanQueue = [], scanTotal = 0;
function syncScanQueue() {
  const q = $('#scanQueue');
  q.hidden = scanTotal < 2;
  if (scanTotal < 2) return;
  const n = scanTotal - scanQueue.length;
  q.innerHTML = `${n}/${scanTotal}枚目。` + (scanQueue.length
    ? '保存すると次の写真に進むよ <button type="button" id="scanSkip">この写真を飛ばす</button>'
    : 'これが最後の写真だよ');
}
async function scanNext() {
  const f = scanQueue.shift();
  if (f) await loadScanFile(f);
  syncScanQueue();
}
$('#scanQueue').addEventListener('click', e => { if (e.target.id === 'scanSkip') scanNext(); });
$('#scanFile').onchange = async e => {
  scanQueue = [...e.target.files];
  scanTotal = scanQueue.length;
  await scanNext();
};
async function loadScanFile(f) {
  if (!f) return;
  if (scanUrl) URL.revokeObjectURL(scanUrl);
  scanUrl = URL.createObjectURL(f);
  try {
    scanImg = await loadImg(scanUrl);
  } catch {
    scanImg = null;
    return alert('画像が読めなかった');
  }
  scanCrop = null; scanMasks = []; scanHist = [];
  const s = Math.min(1, 1200 / Math.max(scanImg.width, scanImg.height));
  scanCv.width = Math.round(scanImg.width * s);
  scanCv.height = Math.round(scanImg.height * s);
  $('#scanBox').hidden = false;
  $('#scanStatus').textContent = '';
  drawScan();
}

const rectOf = (a, b) =>
  ({ x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y) });

// 画面上の位置 → 元の写真の位置
function scanPt(e) {
  const r = scanCv.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width * scanImg.width;
  const y = (e.clientY - r.top) / r.height * scanImg.height;
  return { x: Math.max(0, Math.min(scanImg.width, x)), y: Math.max(0, Math.min(scanImg.height, y)) };
}

function drawScan() {
  if (!scanImg) return;
  const ctx = scanCv.getContext('2d'), k = scanCv.width / scanImg.width;
  const R = r => [r.x * k, r.y * k, r.w * k, r.h * k];
  ctx.drawImage(scanImg, 0, 0, scanCv.width, scanCv.height);
  ctx.fillStyle = '#000';
  for (const m of scanMasks) ctx.fillRect(...R(m));
  const live = scanDrag && rectOf(scanDrag.a, scanDrag.b);
  if (live && scanMode === 'mask') {
    ctx.fillStyle = 'rgba(0,0,0,.6)';
    ctx.fillRect(...R(live));
  }
  const c = live && scanMode === 'crop' ? live : scanCrop;
  if (c) {
    const [x, y, w, h] = R(c), W = scanCv.width, H = scanCv.height;
    ctx.fillStyle = 'rgba(0,0,0,.45)'; // 範囲の外を暗くする
    ctx.fillRect(0, 0, W, y);
    ctx.fillRect(0, y + h, W, H - y - h);
    ctx.fillRect(0, y, x, h);
    ctx.fillRect(x + w, y, W - x - w, h);
    ctx.strokeStyle = '#ffd43b';
    ctx.lineWidth = Math.max(2, W / 250);
    ctx.strokeRect(x, y, w, h);
  }
}

scanCv.addEventListener('pointerdown', e => {
  if (!scanImg) return;
  e.preventDefault();
  scanCv.setPointerCapture(e.pointerId);
  const p = scanPt(e);
  scanDrag = { a: p, b: p };
});
scanCv.addEventListener('pointermove', e => {
  if (!scanDrag) return;
  scanDrag.b = scanPt(e);
  drawScan();
});
scanCv.addEventListener('pointerup', () => {
  if (!scanDrag) return;
  const r = rectOf(scanDrag.a, scanDrag.b);
  scanDrag = null;
  const min = Math.max(scanImg.width, scanImg.height) / 40; // 小さすぎるのはタップの誤爆として無視
  if (r.w >= min && r.h >= min) {
    scanHist.push({ crop: scanCrop, masks: scanMasks.slice() });
    if (scanMode === 'crop') scanCrop = r; else scanMasks.push(r);
  }
  drawScan();
});
scanCv.addEventListener('pointercancel', () => { scanDrag = null; drawScan(); });

$('#scanUndo').onclick = () => {
  const h = scanHist.pop();
  if (!h) return;
  scanCrop = h.crop; scanMasks = h.masks;
  drawScan();
};
$('#scanReset').onclick = () => {
  if (!scanCrop && !scanMasks.length) return;
  scanHist.push({ crop: scanCrop, masks: scanMasks.slice() });
  scanCrop = null; scanMasks = [];
  drawScan();
};

// 選んだ範囲だけ切り出して、塗りつぶしを焼き込んだ画像にする
function scanToBase64(max = 1568) {
  const r = scanCrop || { x: 0, y: 0, w: scanImg.width, h: scanImg.height };
  const s = Math.min(1, max / Math.max(r.w, r.h));
  const cv = document.createElement('canvas');
  cv.width = Math.max(1, Math.round(r.w * s));
  cv.height = Math.max(1, Math.round(r.h * s));
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.drawImage(scanImg, r.x, r.y, r.w, r.h, 0, 0, cv.width, cv.height);
  ctx.fillStyle = '#000';
  for (const m of scanMasks) ctx.fillRect((m.x - r.x) * s, (m.y - r.y) * s, m.w * s, m.h * s);
  return cv.toDataURL('image/jpeg', 0.9).split(',')[1];
}

$('#scanRun').onclick = async () => {
  if (scanRunning || !scanImg) return;
  const st = $('#scanStatus');
  scanRunning = true;
  $('#scanRun').disabled = true;
  aiBegin('#scanRun');
  st.textContent = `読み取り中…（${PROVIDERS[state.provider].label}）`;
  try {
    const txt = await callVision(scanToBase64(), PAY_PROMPT, st);
    const s = txt.indexOf('{'), e = txt.lastIndexOf('}');
    if (s < 0 || e < s) throw new Error('結果がうまく読めなかった。範囲を広げるか、別のモデルで試してみて');
    const d = JSON.parse(txt.slice(s, e + 1));
    const got = [];
    if (isYmd(d.payDate)) { $('#inDate').value = d.payDate; got.push('支給日'); }
    if (typeof d.month === 'string' && /^\d{4}-\d{2}$/.test(d.month)) { $('#inMonth').value = d.month; got.push('何月分'); }
    const g = toYen(d.gross), n = toYen(d.net);
    if (g != null) { $('#inGross').value = g; got.push('総支給'); }
    if (n != null) { $('#inNet').value = n; got.push('手取り'); }
    st.textContent = got.length
      ? `${got.join('・')}を読み取ったよ。下の欄を確認して「${$('#inSave').textContent}」を押してね`
      : '金額が見つからなかった。範囲を変えてもう一回試してみて';
  } catch (err) {
    st.textContent = isAbort(err) ? '中止したよ' : 'エラー: ' + friendlyError(err);
  } finally {
    aiEnd('#scanRun');
    scanRunning = false;
    $('#scanRun').disabled = false;
  }
};

/* ===== 「元に戻す」表示 ===== */
// ダイアログの上にも出るように popover にする（使えない端末は今まで通り）
const toastEl = $('#toast');
const canPop = typeof toastEl.showPopover === 'function';
if (canPop) toastEl.popover = 'manual';
function showToastEl() {
  toastEl.hidden = false;
  if (!canPop) return;
  if (toastEl.matches(':popover-open')) toastEl.hidePopover();
  toastEl.showPopover();
}
function hideToastEl() {
  toastEl.hidden = true;
  if (canPop && toastEl.matches(':popover-open')) toastEl.hidePopover();
}

let toastTimer = null, toastUndo = null;
// undo を渡すとボタンが出る（文字は label。ふつうは「元に戻す」）
function toast(msg, undo, label = '元に戻す') {
  $('#toastMsg').textContent = msg;
  toastUndo = undo || null;
  $('#toastUndo').hidden = !undo;
  $('#toastUndo').textContent = label;
  showToastEl();
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { hideToastEl(); toastUndo = null; }, 10000);
}

// 消す・置き換える操作を取り消せるようにする（直前の1回は端末にも残す）
function restoreSnap(snap) {
  state = normalize(JSON.parse(snap));
  applyTheme(state.theme);
  scheduleChanged();
  if ($('#termDlg')?.open) { renderTermList(); renderOffList(); }
  if ($('#incomeDlg')?.open) { resetInForm(); renderJobChips(); renderIncome(); }
}
function withUndo(msg, action) {
  const snap = JSON.stringify(state);
  try {
    localStorage.setItem('undoSnap', JSON.stringify({ t: Date.now(), msg, snap }));
  } catch (e) {
    console.warn('undoSnap', e); // 容量オーバーでも操作は止めない
  }
  action();
  scheduleChanged();
  toast(msg, () => restoreSnap(snap));
}

// 集中講義の日程を変えたら「期間中」の持ち物を付け直す
$('#courseDlg').addEventListener('close', () => scheduleChanged());
$('#toastUndo').onclick = () => {
  toastUndo?.();
  toastUndo = null;
  hideToastEl();
};
/* ===== 写真から追加（AI読み取りの入口） ===== */
const hasKey = () => !!state.keys[state.provider];

const photoDlg = document.createElement('dialog');
photoDlg.id = 'photoDlg';
photoDlg.innerHTML =
  '<div class="dlg">' +
  '<div class="dlgHead"><h2 id="phTitle">写真から追加</h2>' +
  '<button type="button" class="x" id="phX" aria-label="閉じる">×</button></div>' +
  '<div id="phPick">' +
  '<p class="hint">何の写真か選んでね。AIが読み取って、確認してから保存するよ</p>' +
  '<button type="button" class="phOpt" data-ph="grid"><b>📚 時間割</b><small>時間割の画像から授業をまとめて登録</small></button>' +
  '<button type="button" class="phOpt" data-ph="pay"><b>💴 給与明細</b><small>支給日と金額を読み取って収入に記録</small></button>' +
  '<button type="button" class="phOpt" data-ph="shift"><b>💼 シフト表</b><small>PDFや写真から自分の勤務をカレンダーに追加</small></button>' +
  '</div>' +
  '<div id="phGuide" hidden>' +
  '<p>読み取りには、AIの「APIキー」が1回だけ必要。GoogleのAI Studioなら無料で取れるよ</p>' +
  '<ol class="phSteps">' +
  '<li>「キーを取りに行く」を押して、Googleアカウントでログイン</li>' +
  '<li>APIキーを作るボタンを押して、出てきたキーをコピー</li>' +
  '<li>このアプリに戻って「設定を開く」→ AIの欄に貼り付けて保存</li>' +
  '</ol>' +
  '<p class="hint">キーはこのスマホの中にだけ保存されて、書き出しにも入らないよ。Geminiの無料枠だと、送った画像がGoogleの製品改善に使われる</p>' +
  '<div class="row split">' +
  '<a id="phKey" href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">キーを取りに行く</a>' +
  '<button type="button" class="primary" id="phSet">設定を開く</button>' +
  '</div></div></div>';
document.body.append(photoDlg);

function openPhoto(view = 'pick') {
  $('#phPick').hidden = view !== 'pick';
  $('#phGuide').hidden = view !== 'guide';
  $('#phTitle').textContent = view === 'guide' ? 'AIの準備' : '写真から追加';
  if (!photoDlg.open) photoDlg.showModal();
  photoDlg.scrollTop = 0;
}

// 時間割の読み込み・収入は、キーがないときは案内を出す
const importOpen = $('#importBtn').onclick;
$('#importBtn').onclick = () => hasKey() ? importOpen() : openPhoto('guide');
const incomeOpen = $('#incomeBtn').onclick;
$('#incomeBtn').onclick = () => { incomeOpen(); syncScanGuide(); };

function goPhoto(kind) {
  if (photoDlg.open) photoDlg.close();
  if (kind === 'memo') return openMemo();
  if (kind === 'shift') return openShift();
  if (kind === 'grid') return importOpen();
  $('#incomeBtn').click();
  $('#inScan').open = true;
  setTimeout(() => $('#inScan').scrollIntoView({ block: 'start', behavior: 'smooth' }), 60);
}
function startPhoto(kind) {
  if (!hasKey()) return openPhoto('guide');
  goPhoto(kind);
}

// 収入の画面：キーがなければ「AIの準備」ボタンを出す
function syncScanGuide() {
  let b = $('#scanGuide');
  if (!b) {
    b = document.createElement('button');
    b.type = 'button';
    b.id = 'scanGuide';
    b.textContent = '📷 AIの準備をする';
    b.onclick = () => openPhoto('guide');
    $('#scanNote').after(b);
  }
  b.hidden = hasKey();
}

photoDlg.addEventListener('click', e => {
  const o = e.target.closest('[data-ph]');
  if (o) startPhoto(o.dataset.ph);
});
$('#phX').onclick = () => photoDlg.close();
$('#phSet').onclick = () => {
  photoDlg.close();
  openSettings();
  $('#aiBox').open = true;
  setTimeout(() => $('#aiBox').scrollIntoView({ block: 'start', behavior: 'smooth' }), 60);
};

/* ===== シフト表の読み取り ===== */
// PDFを画像にするライブラリ（使うときだけ読み込む）
const PDFJS = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/legacy/build/';
let pdfLib = null;
async function loadPdfLib() {
  if (pdfLib) return pdfLib;
  const lib = await import(PDFJS + 'pdf.min.mjs');
  lib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.mjs';
  return (pdfLib = lib);
}

const shiftPrompt = name => `これはアルバイトのシフト表の画像です（1日分の表のことも、1か月分の表のこともあります）。「${name}」さんの勤務だけを探して、JSON配列だけを出力してください。説明文やコードブロック記号は書かないでください。
形式: [{"month":10,"day":17,"start":"09:30","end":"15:00","place":""}]
ルール:
- 名前の欄が「${name}」と完全に同じものだけを使う。名字だけ同じ別の人（例：「鈴木」と「鈴木大介」）や、似た字の名前は使わない。
- 1日に2回入っている場合（午前と午後の両方など）は、それぞれ別の要素にする。
- monthとdayは、その勤務の日付（表の上の日付や、日付の列）を数字で。年は書かない。
- startとendは勤務の入り・退きの時刻で、24時間表記のHH:MM。休憩や時間数（h）の欄は使わない。
- 「公休」「休み」などの欄に名前があるだけで、時刻がない日は出力しない。
- placeは、その勤務の店舗・場所が書いてあれば20文字以内で、なければ ""（いつもと違う日だけ書いてある表もある）。
- 見つからなければ [] だけを出力する。読み取れない部分を推測で埋めない。
- ほかの人の名前や、行事・メモの欄の内容は出力しない。`;
// 1か月の表用：日付の行と自分の行を別々に書き出してもらい、対応づけはアプリでやる
const gridPrompt = name => `これはアルバイトのシフト表の画像です。名前が縦に並び、日付が横に並んでいます。1つの日付の下に「始業」「終業」の2列があります。1ページに表が2段以上あることもあります。
「${name}」さんの行だけを、次の手順で読んでください。
1. 表の段ごとに、いちばん上の日付の行を左から順にすべて書き出す。勤務がない日も飛ばさない。
2. 同じ段の「${name}」さんの行を左から順に、日付1つにつき [始業, 終業] の組で書き出す。空欄は ["",""]。
3. dates と cells の数は必ず同じにする。
JSONだけを出力してください。説明文やコードブロック記号は書かないでください。
形式: {"blocks":[{"dates":["10/1","10/2"],"cells":[["13:00","22:00"],["",""]]}]}
ルール:
- 名前が「${name}」と完全に同じ行だけを使う。名字だけ同じ別の人は使わない。
- 時刻は24時間表記の HH:MM。読めないセルは推測せず ["",""] にする。
- 日付は「月/日」の数字だけ。曜日は書かない。
- 見つからなければ {"blocks":[]} だけを出力する。`;

// 名前がない表（自分の分だけ個別に送られてくるシフト・LINEのスクショなど）用：全部の勤務を読む
// 何人分も書いてある表だったら multi にして、勤務は返さない（ほかの人のシフトを拾わないように）
const minePrompt = () => `これはアルバイトのシフトが書いてある画像です（1人分だけのシフト表、シフトを知らせるLINEやメールのスクショ、手書きのメモなど）。勤務をすべて書き出して、JSONだけを出力してください。説明文やコードブロック記号は書かないでください。
形式: {"multi":false,"shifts":[{"month":10,"day":17,"start":"09:30","end":"15:00","place":""}]}
ルール:
- 何人もの名前が並んでいて、人ごとにシフトが分かれている表なら、だれのものか分からないので {"multi":true,"shifts":[]} だけを出力する。
- 1日に2回入っている場合（午前と午後の両方など）は、それぞれ別の要素にする。
- monthとdayは、その勤務の日付を数字で。年は書かない。「明日」などしか書いてなくて日付が分からないものは出力しない。
- startとendは勤務の入り・退きの時刻で、24時間表記のHH:MM（「17-22」なら "17:00" と "22:00"）。休憩や時間数（h）の欄は使わない。
- 「休み」「公休」「×」など、時刻がない日は出力しない。
- placeは、その勤務の店舗・場所が書いてあれば20文字以内で、なければ ""（いつもと違う日だけ書いてあることもある）。
- 見つからなければ {"multi":false,"shifts":[]} だけを出力する。読み取れない部分を推測で埋めない。`;

// 日付とセルの数が合わない段は、ずれてる可能性が高いので捨てる
function gridToRows(o) {
  const out = [];
  let bad = 0;
  for (const b of Array.isArray(o?.blocks) ? o.blocks : []) {
    const ds = Array.isArray(b?.dates) ? b.dates : [];
    const cs = Array.isArray(b?.cells) ? b.cells : [];
    if (!ds.length) continue;
    if (ds.length !== cs.length) { bad++; continue; }
    ds.forEach((d, j) => {
      const m = String(d).match(/(\d{1,2})\s*[\/／月]\s*(\d{1,2})/);
      const c = cs[j];
      if (!m || !Array.isArray(c) || !c[0]) return;
      out.push({ month: +m[1], day: +m[2], start: c[0], end: c[1] || '' });
    });
  }
  return { out, bad };
}


const shiftDlg = document.createElement('dialog');
shiftDlg.id = 'shiftDlg';
shiftDlg.innerHTML =
  '<div class="dlg">' +
  '<div class="dlgHead"><h2>シフト表から追加</h2>' +
  '<button type="button" class="x" id="shX" aria-label="閉じる">×</button></div>' +
  '<label>表の中の自分の名前（表に書いてあるとおりに）<input id="shName" placeholder="例：山田" autocomplete="off"></label>' +
  '<p class="hint" id="shNameHint">自分のシフトだけが書いてある表やLINEのスクショなら、名前は空欄でOK（表の形も選ばなくていいよ）</p>' +
  '<label>カレンダーに入れる名前<input id="shJob" placeholder="例：バイト先の名前" list="shJobList" autocomplete="off"></label>' +
  '<datalist id="shJobList"></datalist>' +
  '<label>いつもの場所（なくてもOK）<input id="shPlace" placeholder="例：駅前店" maxlength="60" autocomplete="off"></label>' +
  '<p class="hint">表に場所が書いてない日は、ここの場所をメモに入れるよ</p>' +
  '<label>表の形<select id="shLayout">' +
  '<option value="day">1日ごとの表・その他</option>' +
  '<option value="grid">1か月の表（名前が縦、日付が横）</option>' +
  '</select></label>' +
  '<label class="fileBtn">PDF・写真を選ぶ<input type="file" id="shFile" accept="application/pdf,image/*" multiple class="vh"></label>' +
  '<p class="hint">PDFは全ページ、写真は何枚でもまとめて選べるよ</p>' +
  '<div id="shPages" class="shPages"></div>' +
  '<p class="hint">チェックしたページは丸ごとAIに送られる（ほかの人の名前も入る）。いらないページはチェックを外してね</p>' +
  '<button type="button" class="primary" id="shRun" disabled>読み取る</button>' +
  '<p id="shStatus" class="hint" aria-live="polite"></p>' +
  '<div id="shResult"></div>' +
  '</div>';
document.body.append(shiftDlg);

let shDoc = null, shSrc = [], shRunning = false, shDoneName = '', shRows = [];
const shDone = new Map(); // ページ番号 → 読み取り結果

function openShift() {
  $('#shName').value = state.shiftName || '';
  $('#shJob').value = state.shiftJob || '';
  $('#shLayout').value = state.shiftLayout || 'day';
  $('#shPlace').value = evPlaceDefault($('#shJob').value);
  syncShName();
  const jobs = new Set();
  for (const p of state.evPresets) if (p.kind === 'job' && p.title) jobs.add(p.title);
  for (const x of state.incomes) if (x.job) jobs.add(x.job);
  $('#shJobList').innerHTML = [...jobs].map(v => `<option value="${esc(v)}">`).join('');
  if (!shiftDlg.open) shiftDlg.showModal();
  renderShJobs();
}
$('#shX').onclick = () => shiftDlg.close();
// 名前が空欄のときは「自分の分だけの表」として全部読むので、表の形は使わない
function syncShName() {
  $('#shLayout').disabled = !$('#shName').value.trim();
}
$('#shName').addEventListener('input', syncShName);

function shReset() {
  shDoc?.destroy?.();
  shDoc = null; shSrc = []; shRows = [];
  shDone.clear();
  shCuts.clear();
  $('#shPages').innerHTML = '';
  $('#shResult').innerHTML = '';
  $('#shStatus').textContent = '';
  $('#shRun').disabled = true;
  $('#shRun').textContent = '読み取る';
}

function shLoadImg(url) {
  return new Promise((ok, ng) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = ng;
    img.src = url;
  });
}

// 1ページ分を画像にする（長い辺が max px）
async function shCanvas(src, max) {
  const cv = document.createElement('canvas');
  if (src.n) {
    const page = await shDoc.getPage(src.n);
    const v1 = page.getViewport({ scale: 1 });
    const vp = page.getViewport({ scale: max / Math.max(v1.width, v1.height) });
    cv.width = Math.round(vp.width);
    cv.height = Math.round(vp.height);
    const ctx = cv.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, cv.width, cv.height);
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
  } else {
    const url = URL.createObjectURL(src.file);
    try {
      const img = await shLoadImg(url);
      const s = Math.min(1, max / Math.max(img.width, img.height));
      cv.width = Math.round(img.width * s);
      cv.height = Math.round(img.height * s);
      const ctx = cv.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.drawImage(img, 0, 0, cv.width, cv.height);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  return cv;
}

async function renderShPages() {
  const box = $('#shPages');
  box.innerHTML = shSrc.map((_, i) =>
    `<div class="shItem"><label class="shPage"><input type="checkbox" data-shp="${i}" checked><span>${i + 1}</span></label>` +
    `<button type="button" class="shCutBtn" data-shcut="${i}">✂ 海苔</button></div>`).join('');
  for (const [i, s] of shSrc.entries()) {
    const cv = await shCanvas(s, 160);
    box.children[i]?.querySelector('label')?.prepend(cv);
  }
}

$('#shFile').onchange = async e => {
  const files = [...e.target.files];
  e.target.value = '';
  if (!files.length) return;
  shReset();
  const st = $('#shStatus');
  try {
    const pdf = files.find(f => f.type === 'application/pdf' || /\.pdf$/i.test(f.name));
    if (pdf) {
      st.textContent = 'PDFを開いてる…';
      const lib = await loadPdfLib();
      shDoc = await lib.getDocument({ data: await pdf.arrayBuffer() }).promise;
      for (let n = 1; n <= shDoc.numPages; n++) shSrc.push({ n });
    } else {
      for (const f of files) shSrc.push({ file: f });
    }
    st.textContent = '準備中…';
    await renderShPages();
    st.textContent = `${shSrc.length}ページ。読み取るページにチェックを入れてね`;
    $('#shRun').disabled = false;
  } catch (err) {
    shReset();
    st.textContent = 'ファイルが開けなかった：' + (err?.message || err);
  }
};

// 年は書いてないので、今日にいちばん近い年にする
function shYmd(m, d) {
  m = +m; d = +d;
  if (!(m >= 1 && m <= 12 && d >= 1 && d <= 31)) return '';
  const now = new Date(), y0 = now.getFullYear();
  let best = null;
  for (const y of [y0 - 1, y0, y0 + 1]) {
    const dt = new Date(y, m - 1, d);
    if (dt.getMonth() !== m - 1) continue;
    if (!best || Math.abs(dt - now) < Math.abs(best - now)) best = dt;
  }
  return best ? ymd(best) : '';
}
// 「9:30」「25:00」なども HH:MM に
function shTime(v) {
  const m = String(v || '').trim().match(/^(\d{1,2})[:：](\d{2})$/);
  if (!m || +m[1] > 47 || +m[2] > 59) return '';
  return `${pad(+m[1] % 24)}:${m[2]}`;
}

$('#shRun').onclick = async () => {
  if (shRunning) return;
  const name = $('#shName').value.trim();
  if (!hasKey()) return openPhoto('guide');
  const layout = $('#shLayout').value;
  const mine = !name; // 名前なし＝自分の分だけの表
  const grid = !mine && layout === 'grid';
  state.shiftName = name;
  state.shiftJob = $('#shJob').value.trim();
  state.shiftLayout = layout;
  rememberShift(state.shiftJob, name, layout);
  save();
  // 名前か表の形が変わったら、読み取り済みのページもやり直す
  const doneKey = mine ? '|mine' : name + '|' + layout;
  if (doneKey !== shDoneName) { shDone.clear(); shDoneName = doneKey; }

  const todo = [...document.querySelectorAll('#shPages [data-shp]:checked')]
    .map(x => +x.dataset.shp).filter(i => !shDone.has(i));
  if (!todo.length) return showShRows();

  const st = $('#shStatus');
  let bad = 0, multi = 0;
  shRunning = true;
  $('#shRun').disabled = true;
  aiBegin('#shRun');
  try {
    for (const [k, i] of todo.entries()) {
      if (k > 0) await aiSleep(4000); // 回数制限にかからないように間をあける
      st.textContent = `読み取り中… ${k + 1}/${todo.length}（${i + 1}ページ目）`;
      const cv = await shCut(i, grid ? 2400 : 1800);
      const b64 = cv.toDataURL('image/jpeg', 0.9).split(',')[1];
      cv.width = cv.height = 0;
      const txt = await callVision(b64, mine ? minePrompt() : grid ? gridPrompt(name) : shiftPrompt(name), st);
      const [open, close] = grid || mine ? ['{', '}'] : ['[', ']'];
      const s = txt.indexOf(open), e = txt.lastIndexOf(close);
      if (s < 0 || e < s) throw new Error(`${i + 1}ページ目の結果がうまく読めなかった`);
      const json = JSON.parse(txt.slice(s, e + 1));
      if (mine) {
        if (json?.multi === true) multi++;
        shDone.set(i, json?.multi === true ? [] : Array.isArray(json?.shifts) ? json.shifts : []);
      } else if (grid) {
        const g = gridToRows(json);
        bad += g.bad;
        shDone.set(i, g.out);
      } else {
        shDone.set(i, json);
      }
      showShRows();
    }
    st.textContent = multi
      ? `何人分も書いてある表${multi > 1 ? `が${multi}ページ` : ''}だったよ。上に表の中の自分の名前を入れて、もう一回読み取ってね`
      : bad
      ? `読み取り終わったよ。ただ${bad}段は日付と時刻の数が合わなかったから飛ばした。下を確認してね`
      : '読み取り終わったよ。下を確認して追加してね';
    $('#shRun').textContent = '読み取る';
  } catch (err) {
    st.textContent = isAbort(err)
      ? `中止したよ（${shDone.size}ページ分は読めてる。もう一回押すと続きから）`
      : `エラー: ${friendlyError(err)}（${shDone.size}ページ分は読めてる。もう一回押すと続きから）`;
    $('#shRun').textContent = '続きから読み取る';
  } finally {
    aiEnd('#shRun');
    shRunning = false;
    $('#shRun').disabled = false;
    showShRows();
  }
};

const SH_JOIN_GAP = 15; // 分
function showShRows() {
  const map = new Map();
  for (const [page, arr] of shDone) for (const r of Array.isArray(arr) ? arr : []) {
    const date = shYmd(r?.month, r?.day), start = shTime(r?.start), end = shTime(r?.end);
    if (!date || !start) continue;
    const k = `${date} ${start}`;
    if (!map.has(k)) map.set(k, { date, start, end, page, place: String(r?.place || '').trim().slice(0, 60) });
  }
  // 同じ日で、終わりと次の始まりがつながってる勤務は1つにする。
  // 「まとめる」がオンなら、塾のコマみたいに間が SH_JOIN_GAP 分以内の勤務（17:00-17:50、18:00-18:50 など）もつなげる
  const list = [...map.values()].sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
  const gap = state.shiftJoin ? SH_JOIN_GAP : 0;
  shRows = [];
  for (const r of list) {
    const p = shRows[shRows.length - 1];
    const d = p && p.date === r.date && p.end ? toMin(r.start) - toMin(p.end) : -1;
    if (d >= 0 && d <= gap) { p.end = r.end || p.end; p.n++; p.place ||= r.place; }
    else shRows.push({ ...r, on: true, n: 1 });
  }
  // 間があいてるコマがあるときだけ「まとめる」のチェックを出す（ぴったり続いてるのはいつもつなげる）
  const canJoin = list.some((r, i) => {
    const q = list[i + 1], d = q && q.date === r.date && r.end ? toMin(q.start) - toMin(r.end) : -1;
    return d > 0 && d <= SH_JOIN_GAP;
  });
  $('#shResult').innerHTML = shRows.length
    ? (canJoin ? `<label class="inline shJoin"><input type="checkbox" id="shJoin"${state.shiftJoin ? ' checked' : ''}> 続いてるコマは1つにまとめる（間が${SH_JOIN_GAP}分以内）</label>` : '') +
      '<ul class="shList">' + shRows.map((r, i) =>
        `<li><label class="shDay"><input type="checkbox" data-shr="${i}" checked>${md(parseYmd(r.date))}</label>` +
        `<input type="time" data-sht="${i}" data-k="start" value="${r.start}" aria-label="入り">〜` +
        `<input type="time" data-sht="${i}" data-k="end" value="${r.end}" aria-label="退き">` +
        (r.n > 1 ? `<small class="muted">${r.n}コマ</small>` : '') +
        // 表に場所が書いてあった日だけ出す（ない日は「いつもの場所」）
        (r.place ? `<input class="shPlace" data-shpl="${i}" value="${esc(r.place)}" maxlength="60" aria-label="場所">` : '') + '</li>').join('') +
      '</ul>' +
      `<button type="button" class="primary" id="shAdd">${shRows.length}件をカレンダーに追加</button>`
    : shDone.size
      ? `<p class="muted">${shDoneName === '|mine' ? '勤務が見つからなかった。何人分も書いてある表なら、自分の名前を入れてね' : '勤務が見つからなかった。名前が表の書き方と同じか確認してね'}</p>`
      : '';
}

$('#shResult').addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'shJoin') { state.shiftJoin = t.checked; save(); return showShRows(); }
  if (t.dataset.shr != null) shRows[+t.dataset.shr].on = t.checked;
  if (t.dataset.sht != null) shRows[+t.dataset.sht][t.dataset.k] = t.value;
  if (t.dataset.shpl != null) shRows[+t.dataset.shpl].place = t.value.trim();
  const n = shRows.filter(r => r.on && r.start).length;
  if ($('#shAdd')) $('#shAdd').textContent = `${n}件をカレンダーに追加`;
});

$('#shResult').addEventListener('click', async e => {
  if (e.target.id !== 'shAdd') return;
  const btn = e.target;
  const title = $('#shJob').value.trim();
  state.shiftJob = title;
  setEvPlace(title, $('#shPlace').value);
  const picks = shRows.filter(r => r.on && r.start);
  if (!picks.length) return alert('追加する勤務を選んでね');
  // 同じ日・同じ名前・同じ時刻のバイトは二重に入れない
  const findDup = r => state.events.find(x => x.date === r.date && x.kind === 'job' &&
    x.title === title && x.start === r.start && x.end === r.end);
  const add = picks.filter(r => !findDup(r)), skipped = picks.length - add.length;

  // 読み取ったページの画像を保存（あとでカレンダーから見る用）
  btn.disabled = true;
  btn.textContent = 'シフト表を保存中…';
  const pages = new Map(); // ページ番号 → 画像ID
  try {
    for (const p of new Set(picks.map(r => r.page))) {
      if (p == null || !shSrc[p]) continue;
      const cv = await shCanvas(shSrc[p], 2400);
      const blob = await cvBlob(cv);
      cv.width = cv.height = 0;
      if (!blob) continue;
      const id = 'sh-' + uid();
      await imgPut(id, blob);
      pages.set(p, id);
    }
  } catch { /* 画像が保存できなくても予定は入れる */ }
  btn.disabled = false;
  btn.textContent = `${shRows.length}件をカレンダーに追加`;

  if (!add.length && !pages.size) return alert('全部もうカレンダーに入ってるよ');
  shiftDlg.close();
  shReset(); // 次に開いたとき、同じシフトをまた追加しないように
  $('#shFile').value = '';
  const msg = add.length
    ? `${add.length}件のシフトを追加したよ` + (skipped ? `（${skipped}件は入ってたので飛ばした）` : '')
    : `入ってた${skipped}件にシフト表をつけたよ`;
  withUndo(msg, () => {
    for (const r of picks) {
      const img = pages.get(r.page) || '';
      const old = findDup(r);
      if (old) { if (img) old.img = img; continue; } // 入ってた予定には画像だけつける
      const ev = { id: uid(), date: r.date, kind: 'job', title, start: r.start, end: r.end };
      if (img) ev.img = img;
      const place = r.place || evPlaceDefault(title); // 表に書いてなければ、いつもの場所
      if (place) ev.memo = memoWithPlace('', place);
      state.events.push(ev);
    }
    if (title) rememberPreset({ title, kind: 'job', start: '', end: '' });
  });
});

/* ===== シフト表：海苔で切って詰める ===== */
const shCuts = new Map(); // ページ番号 → [{d:'h'|'v', a, b}]（0〜1の割合）
const cutDlg = document.createElement('dialog');
cutDlg.id = 'cutDlg';
cutDlg.innerHTML =
  '<div class="dlg">' +
  '<div class="dlgHead"><h2 id="cutTitle">海苔で隠す</h2>' +
  '<button type="button" class="x" id="cutX" aria-label="閉じる">×</button></div>' +
  '<p class="hint">なぞった帯は切り取って、残りをくっつけて送るよ。日付の行と名前の列、自分の行は残してね。２本指で拡大できるよ</p>' +
  '<div class="row cutModes"><button type="button" id="cutH" class="on">横の海苔</button>' +
  '<button type="button" id="cutV">縦の海苔</button></div>' +
  '<div id="cutWrap"><canvas id="cutCv"></canvas></div>' +
  '<div class="row cutTools"><button type="button" id="cutUndo">1つ戻す</button>' +
  '<button type="button" id="cutClear">全部消す</button>' +
  '<button type="button" id="cutAll">ほかのページにも同じ海苔</button>' +
  '<button type="button" id="cutZoom" hidden>等倍に戻す</button></div>' +
  '<p class="hint" id="cutInfo"></p>' +
  '<button type="button" class="primary" id="cutDone">できた</button>' +
  '</div>';
document.body.append(cutDlg);

let cutIdx = -1, cutBase = null, cutMode = 'h', cutDrag = null;

// 海苔を除いて残る区間（0〜1）
function keptRanges(cuts, d) {
  const bs = cuts.filter(c => c.d === d).map(c => [c.a, c.b]).sort((x, y) => x[0] - y[0]);
  const out = [];
  let p = 0;
  for (const [a, b] of bs) {
    if (a > p) out.push([p, a]);
    p = Math.max(p, b);
  }
  if (p < 1) out.push([p, 1]);
  return out.filter(([a, b]) => b - a > 0.001);
}
function keptSize(i) {
  const cuts = shCuts.get(i) || [];
  const len = r => r.reduce((s, [a, b]) => s + b - a, 0);
  return { fx: len(keptRanges(cuts, 'v')), fy: len(keptRanges(cuts, 'h')) };
}

// 海苔を抜いて詰めた画像。残りが max くらいになるよう、元は大きめに描く
async function shCut(i, max) {
  const cuts = shCuts.get(i) || [];
  if (!cuts.length) return shCanvas(shSrc[i], max);
  const { fx, fy } = keptSize(i);
  if (fx <= 0 || fy <= 0) throw new Error(`${i + 1}ページ目が全部海苔で隠れてる`);
  const t = await shCanvas(shSrc[i], 100); // 縦横比を知るため
  const L = Math.max(t.width, t.height), aw = t.width / L, ah = t.height / L;
  t.width = t.height = 0;
  // iPhoneの画像サイズ上限を超えないように
  const M = Math.min(max / Math.max(aw * fx, ah * fy), Math.sqrt(14e6 / (aw * ah)), 8000);
  const src = await shCanvas(shSrc[i], M);
  const W = src.width, H = src.height;
  const px = keptRanges(cuts, 'v').map(([a, b]) => [Math.round(a * W), Math.round(b * W)]);
  const py = keptRanges(cuts, 'h').map(([a, b]) => [Math.round(a * H), Math.round(b * H)]);
  const out = document.createElement('canvas');
  out.width = px.reduce((s, [a, b]) => s + b - a, 0);
  out.height = py.reduce((s, [a, b]) => s + b - a, 0);
  const ctx = out.getContext('2d');
  let oy = 0;
  for (const [y0, y1] of py) {
    let ox = 0;
    for (const [x0, x1] of px) {
      ctx.drawImage(src, x0, y0, x1 - x0, y1 - y0, ox, oy, x1 - x0, y1 - y0);
      ox += x1 - x0;
    }
    oy += y1 - y0;
  }
  src.width = src.height = 0;
  return out;
}

function syncCutBtn(i) {
  const b = document.querySelector(`[data-shcut="${i}"]`);
  const n = (shCuts.get(i) || []).length;
  if (b) b.textContent = n ? `✂ 海苔${n}` : '✂ 海苔';
}

function drawCut() {
  const cv = $('#cutCv'), ctx = cv.getContext('2d');
  if (!cutBase) return;
  ctx.drawImage(cutBase, 0, 0);
  ctx.fillStyle = 'rgba(0,0,0,.8)';
  const bands = [...(shCuts.get(cutIdx) || [])];
  if (cutDrag) bands.push(cutDrag);
  for (const c of bands) {
    if (c.d === 'h') ctx.fillRect(0, c.a * cv.height, cv.width, (c.b - c.a) * cv.height);
    else ctx.fillRect(c.a * cv.width, 0, (c.b - c.a) * cv.width, cv.height);
  }
  const n = (shCuts.get(cutIdx) || []).length;
  const k = keptSize(cutIdx);
  $('#cutInfo').textContent = n
    ? `海苔${n}本・残るのは横${Math.round(k.fx * 100)}%×縦${Math.round(k.fy * 100)}%`
    : 'まだ海苔はないよ';
}

async function openCut(i) {
  cutIdx = i;
  $('#cutTitle').textContent = `${i + 1}ページ目を海苔で隠す`;
  cutBase = await shCanvas(shSrc[i], 2000);
  const cv = $('#cutCv');
  cv.width = cutBase.width;
  cv.height = cutBase.height;
  if (!cutDlg.open) cutDlg.showModal();
  fitCut();
  drawCut();
}

$('#shPages').addEventListener('click', e => {
  const b = e.target.closest('[data-shcut]');
  if (b) openCut(+b.dataset.shcut);
});

const setCutMode = m => {
  cutMode = m;
  $('#cutH').classList.toggle('on', m === 'h');
  $('#cutV').classList.toggle('on', m === 'v');
};
$('#cutH').onclick = () => setCutMode('h');
$('#cutV').onclick = () => setCutMode('v');

const clamp01 = v => Math.min(1, Math.max(0, v));
function cutPos(e) {
  const r = $('#cutCv').getBoundingClientRect();
  return clamp01(cutMode === 'h' ? (e.clientY - r.top) / r.height : (e.clientX - r.left) / r.width);
}
// 拡大：2本指でつまむ。1本指は海苔
const cutWrap = $('#cutWrap');
const cutPts = new Map();
let zs = 1, zx = 0, zy = 0, cutPinch = null;

function applyZoom() {
  const w = cutWrap.clientWidth, h = cutWrap.clientHeight;
  zs = Math.min(6, Math.max(1, zs));
  zx = Math.min(0, Math.max(w - w * zs, zx));
  zy = Math.min(0, Math.max(h - h * zs, zy));
  $('#cutCv').style.transform = `translate(${zx}px, ${zy}px) scale(${zs})`;
  $('#cutZoom').hidden = zs === 1;
}
function resetZoom() { zs = 1; zx = zy = 0; applyZoom(); }

// 画面に収まる大きさにそろえる
function fitCut() {
  const cv = $('#cutCv'), pe = cutWrap.parentElement, cs = getComputedStyle(pe);
  const mw = pe.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const s = Math.min(mw / cv.width, innerHeight * 0.6 / cv.height);
  cutWrap.style.width = cv.style.width = Math.floor(cv.width * s) + 'px';
  cutWrap.style.height = cv.style.height = Math.floor(cv.height * s) + 'px';
  resetZoom();
}

const pinchInfo = () => {
  const [p, q] = [...cutPts.values()];
  return { d: Math.hypot(p.x - q.x, p.y - q.y) || 1, x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
};

cutWrap.addEventListener('pointerdown', e => {
  e.preventDefault();
  cutWrap.setPointerCapture(e.pointerId);
  cutPts.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (cutPts.size === 2) {
    cutDrag = null; // 引きかけの海苔は取り消す
    cutPinch = { ...pinchInfo(), zs, zx, zy };
    drawCut();
    return;
  }
  if (cutPts.size > 2 || cutPinch) return;
  const p = cutPos(e);
  cutDrag = { d: cutMode, a: p, b: p, s: p };
  drawCut();
});

cutWrap.addEventListener('pointermove', e => {
  if (!cutPts.has(e.pointerId)) return;
  cutPts.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (cutPinch) {
    if (cutPts.size < 2) return;
    const r = cutWrap.getBoundingClientRect(), n = pinchInfo(), s = cutPinch;
    const ns = Math.min(6, Math.max(1, s.zs * n.d / s.d));
    // つまみ始めた点が指の真ん中に来続けるように
    const u = (s.x - r.left - s.zx) / s.zs, v = (s.y - r.top - s.zy) / s.zs;
    zs = ns;
    zx = n.x - r.left - u * ns;
    zy = n.y - r.top - v * ns;
    applyZoom();
    return;
  }
  if (!cutDrag) return;
  const p = cutPos(e);
  cutDrag.a = Math.min(cutDrag.s, p);
  cutDrag.b = Math.max(cutDrag.s, p);
  drawCut();
});

function cutUp(e, commit) {
  cutPts.delete(e.pointerId);
  // つまんだあとは、指が全部離れるまで海苔を引かない
  if (cutPinch) { if (!cutPts.size) cutPinch = null; return; }
  if (!cutDrag) return;
  const { d, a, b } = cutDrag;
  cutDrag = null;
  if (commit && b - a > 0.005) {
    shCuts.set(cutIdx, [...(shCuts.get(cutIdx) || []), { d, a, b }]);
    shDone.delete(cutIdx);
    syncCutBtn(cutIdx);
  }
  drawCut();
}
cutWrap.addEventListener('pointerup', e => cutUp(e, true));
cutWrap.addEventListener('pointercancel', e => cutUp(e, false));
$('#cutZoom').onclick = resetZoom;

$('#cutUndo').onclick = () => {
  const cs = (shCuts.get(cutIdx) || []).slice(0, -1);
  if (cs.length) shCuts.set(cutIdx, cs); else shCuts.delete(cutIdx);
  shDone.delete(cutIdx);
  syncCutBtn(cutIdx);
  drawCut();
};
$('#cutClear').onclick = () => {
  shCuts.delete(cutIdx);
  shDone.delete(cutIdx);
  syncCutBtn(cutIdx);
  drawCut();
};
$('#cutAll').onclick = () => {
  const cs = shCuts.get(cutIdx) || [];
  if (!cs.length) return alert('先にこのページに海苔を引いてね');
  if (!confirm('ほかのページも全部この海苔にする？（今ある海苔は上書き）')) return;
  shSrc.forEach((_, i) => {
    shCuts.set(i, cs.map(c => ({ ...c })));
    shDone.delete(i);
    syncCutBtn(i);
  });
  toast('全ページに同じ海苔を引いたよ');
};
const closeCut = () => {
  cutDrag = null;
  if (cutBase) cutBase.width = cutBase.height = 0;
  cutBase = null;
  cutDlg.close();
};
$('#cutX').onclick = closeCut;
$('#cutDone').onclick = closeCut;

/* ===== 収入の見込み（シフトから） ===== */
const fcBox = document.createElement('div');
fcBox.id = 'inForecast';
$('#inSummary').before(fcBox);
let fcOffset = 0, fcNames = [];

// 勤務の長さ（分）と、そのうち22時〜翌5時の分
function shiftMin(e) {
  const s = toMin(e.start), e0 = toMin(e.end);
  if (s == null || e0 == null) return null;
  const en = e0 <= s ? e0 + 1440 : e0;
  let night = 0;
  for (let m = s; m < en; m++) {
    const h = m % 1440;
    if (h >= 1320 || h < 300) night++;
  }
  return { total: en - s, night };
}
const hrs = m => `${Math.round(m / 6) / 10}時間`;

function renderForecast() {
  const now = new Date();
  const d0 = new Date(now.getFullYear(), now.getMonth() + fcOffset, 1);
  const key = `${d0.getFullYear()}-${String(d0.getMonth() + 1).padStart(2, '0')}`;
  const by = new Map();
  for (const e of state.events) {
    if (e.kind !== 'job' || !e.date.startsWith(key)) continue;
    const name = e.title || 'バイト';
    const r = by.get(name) || { n: 0, min: 0, pay: 0, noTime: 0 };
    by.set(name, r);
    const t = shiftMin(e);
    if (!t) { r.noTime++; continue; }
    const wg = state.wages[name] || {};
    const work = Math.max(0, t.total - (t.total > 360 ? (wg.brk || 0) : 0));
    const night = Math.min(t.night, work);
    r.n++; r.min += work;
    if (wg.w != null) r.pay += wg.w * (work - night) / 60 + wg.w * 1.25 * night / 60;
  }
  fcNames = [...by.keys()];
  const known = fcNames.filter(k => state.wages[k]?.w != null);
  const total = known.reduce((a, k) => a + by.get(k).pay, 0);
  const head =
    `<div class="fcHead"><button type="button" id="fcPrev" aria-label="前の月">‹</button>` +
    `<b>${d0.getMonth() + 1}月の見込み</b>` +
    `<button type="button" id="fcNext" aria-label="次の月">›</button></div>`;
  if (!fcNames.length) {
    fcBox.innerHTML = head + '<p class="hint">この月のバイト予定はまだないよ。カレンダーに入れるかシフト表を読み取ると、ここに見込みが出るよ</p>';
    return;
  }
  fcBox.innerHTML = head +
    `<p class="inTotal">${known.length ? yen(total) : '—'}<small>${fcOffset < 0 ? '働いた分' : '予定どおり働いたら'}</small></p>` +
    (known.length < fcNames.length ? '<p class="hint">時給が未入力のバイトは合計に入ってないよ</p>' : '') +
    '<ul class="fcList">' + fcNames.map((k, i) => {
      const r = by.get(k), wg = state.wages[k] || {};
      return `<li><div class="fcRow"><span>${esc(k)}<small> ${r.n}回・${hrs(r.min)}</small></span>` +
        `<b>${wg.w != null ? yen(r.pay) : '時給を入れてね'}</b></div>` +
        (r.noTime ? `<p class="hint">時刻のない予定${r.noTime}件は数えてないよ</p>` : '') +
        `<div class="fcIn"><label>時給<input type="number" inputmode="numeric" min="0" data-fw="${i}" value="${wg.w ?? ''}">円</label>` +
        `<label>休憩<input type="number" inputmode="numeric" min="0" data-fb="${i}" value="${wg.brk || ''}">分</label></div></li>`;
    }).join('') + '</ul>' +
    '<p class="hint">22〜5時は25%増しで計算。休憩は6時間を超えた日だけ引くよ。交通費や残業代は入ってないよ</p>';
}

fcBox.addEventListener('click', e => {
  if (e.target.id === 'fcPrev') { fcOffset--; renderForecast(); }
  if (e.target.id === 'fcNext') { fcOffset++; renderForecast(); }
});
fcBox.addEventListener('change', e => {
  const i = e.target.dataset.fw ?? e.target.dataset.fb;
  if (i == null) return;
  const k = fcNames[+i];
  const wg = state.wages[k] || { w: null, brk: 0 };
  if (e.target.dataset.fw != null) wg.w = toYen(e.target.value) ?? null;
  else wg.brk = Math.min(Math.max(Math.round(Number(e.target.value) || 0), 0), 180);
  if (wg.w == null && !wg.brk) delete state.wages[k];
  else state.wages[k] = wg;
  save(); renderForecast();
});
// 収入画面を開いたら今月に戻す
$('#incomeBtn').addEventListener('click', () => { fcOffset = 0; renderForecast(); });

/* ===== シフト表の画像（IndexedDBに保存） ===== */
let imgDbP = null;
function imgDb() {
  return imgDbP ??= new Promise((ok, ng) => {
    const r = indexedDB.open('gakulog-img', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('shift');
    r.onsuccess = () => ok(r.result);
    r.onerror = () => { imgDbP = null; ng(r.error); };
  });
}
async function imgTx(mode, fn) {
  const db = await imgDb();
  return new Promise((ok, ng) => {
    const tx = db.transaction('shift', mode);
    const req = fn(tx.objectStore('shift'));
    tx.oncomplete = () => ok(req?.result);
    tx.onerror = tx.onabort = () => ng(tx.error);
  });
}
const imgPut = (id, blob) => imgTx('readwrite', s => s.put(blob, id));
const imgGet = id => imgTx('readonly', s => s.get(id));
const imgKeys = () => imgTx('readonly', s => s.getAllKeys());
const imgDel = id => imgTx('readwrite', s => s.delete(id));
const cvBlob = cv => new Promise(r => cv.toBlob(r, 'image/jpeg', 0.85));

// 見る画面
const imgDlg = document.createElement('dialog');
imgDlg.id = 'imgDlg';
imgDlg.innerHTML =
  '<div class="dlg">' +
  '<div class="dlgHead"><h2 id="imgTitle" tabindex="-1" autofocus>シフト表</h2>' +
  '<button type="button" class="x big" id="imgX" aria-label="閉じる">×</button></div>' +
  '<div class="row end"><button type="button" id="imgOut" aria-label="縮小">−</button>' +
  '<button type="button" id="imgIn" aria-label="拡大">＋</button></div>' +
  '<div id="imgWrap"><img id="imgView" alt="シフト表"></div>' +
  '</div>';
document.body.append(imgDlg);

let imgUrl = '', imgZoom = 1;
function setImgZoom(z) {
  imgZoom = Math.min(4, Math.max(1, z));
  $('#imgView').style.width = `${imgZoom * 100}%`;
  $('#imgOut').disabled = imgZoom <= 1;
  $('#imgIn').disabled = imgZoom >= 4;
}
async function openShiftImg(id, label) {
  let blob = null;
  try { blob = await imgGet(id); } catch {}
  if (!blob) return alert('シフト表の画像が見つからなかった。バックアップから戻した予定には画像は入ってないよ');
  if (imgUrl) URL.revokeObjectURL(imgUrl);
  imgUrl = URL.createObjectURL(blob);
  $('#imgView').src = imgUrl;
  $('#imgTitle').textContent = label || 'シフト表';
  setImgZoom(1);
  $('#imgWrap').scrollTo(0, 0);
  imgDlg.showModal();
}
$('#imgIn').onclick = () => setImgZoom(imgZoom + 1);
$('#imgOut').onclick = () => setImgZoom(imgZoom - 1);
$('#imgX').onclick = () => imgDlg.close();
imgDlg.addEventListener('close', () => {
  $('#imgView').removeAttribute('src');
  if (imgUrl) { URL.revokeObjectURL(imgUrl); imgUrl = ''; }
});

// どの予定にも使われてない画像を消す（起動して少したってから）
async function cleanShiftImgs() {
  try {
    const used = new Set(state.events.map(e => e.img).filter(Boolean).concat('wall'));
    for (const k of await imgKeys()) if (!used.has(k)) await imgDel(k);
  } catch {}
}
setTimeout(cleanShiftImgs, 10000);

/* ===== カレンダー書き出し（.ics） ===== */
const icsDate = d => ymd(d).replace(/-/g, '');
const icsEsc = s => String(s)
  .replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

// 1行75バイトまでのルールに合わせて折り返す
function icsFold(line) {
  const enc = new TextEncoder(), out = [];
  let cur = '', size = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    if (size + n > (out.length ? 74 : 75)) { out.push(cur); cur = ''; size = 0; }
    cur += ch; size += n;
  }
  out.push(cur);
  return out.join('\r\n ');
}

// 終日の予定。通知は前日21時（当日0時の3時間前）
function icsEvent(uid, date, title, desc, stamp, seq) {
  return [
    'BEGIN:VEVENT',
    `UID:${uid}@gakulog`,
    `DTSTAMP:${stamp}`,
    `SEQUENCE:${seq}`,
    `DTSTART;VALUE=DATE:${icsDate(date)}`,
    `DTEND;VALUE=DATE:${icsDate(addDays(date, 1))}`,
    `SUMMARY:${icsEsc(title)}`,
    desc ? `DESCRIPTION:${icsEsc(desc)}` : '',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${icsEsc(title)}`,
    'TRIGGER:-PT3H',
    'END:VALARM',
    'END:VEVENT'
  ].filter(Boolean);
}

// 持ち物を書き出す日数：学期の終わりまで（終了日がなければ120日、最大200日）
function icsDays(t, today) {
  const e = t.end ? parseYmd(t.end) : null;
  if (!e) return SEARCH_DAYS;
  const n = Math.round((e - today) / 86400000) + 1;
  return Math.min(200, Math.max(0, n));
}

function buildIcs() {
  const t = term(), lines = [];
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const seq = Math.floor(Date.now() / 60000);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let nTask = 0, nPack = 0;

  // 課題の締切（終わってないもの・今日以降）
  for (const c of [...courses(), ...taskGroups()]) for (const k of c.tasks) {
    if (k.done || !k.due) continue;
    const d = parseYmd(k.due);
    if (!d || d < today) continue;
    const from = c === selfCourse ? '' : isGroup(c.id) ? `名目：${c.name}` : `授業：${nm(c)}`;
    lines.push(...icsEvent(`task-${k.id}`, d, `〆 ${k.title}`, from, stamp, seq));
    nTask++;
  }

  // 持ち物（授業がある日ごとに1件）
  const nDays = state.useGrid ? icsDays(t, today) : 0;
  for (let i = 0; i < nDays; i++) {
    const date = addDays(today, i);
    const cs = attendOn(date, t).concat(intsOn(date, t));
    const all = [], desc = [];
    for (const c of cs) {
      const o = c.day === -1 ? null : occurrence(c, date);
      const its = itemsFor(c, o ? o.start : date).map(x => x.text.trim()).filter(Boolean);
      if (!its.length) continue;
      for (const x of its) if (!all.includes(x)) all.push(x);
      desc.push(`${c.day === -1 ? '集中' : c.period + '限'} ${nm(c)}：${its.join('、')}`);
    }
    if (!all.length) continue;
    lines.push(...icsEvent(`pack-${ymd(date)}`, date, `持ち物：${all.join('、')}`, desc.join('\n'), stamp, seq));
    nPack++;
  }

  const text = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//gakulog//JP',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:がくログ',
    ...lines, 'END:VCALENDAR'
  ].map(icsFold).join('\r\n') + '\r\n';
  return { text, nTask, nPack };
}

const icsBox = document.createElement('div');
icsBox.className = 'icsBox';
icsBox.innerHTML =
  '<button type="button" id="icsBtn">📅 カレンダーに書き出す</button>' +
  '<p class="hint">課題の締切と、学期の終わりまでの持ち物を書き出すよ。通知は前日21時。「次回だけ」の持ち物や課題を足したら書き出し直してね。前に入れた予定は上書きされるよ</p>';
$('#exportBtn').parentElement.after(icsBox);

$('#icsBtn').onclick = async () => {
  const { text, nTask, nPack } = buildIcs();
  if (!nTask && !nPack) return alert('書き出す課題も持ち物もまだないよ');
  const name = `gakulog-${todayStr()}.ics`;
  const blob = new Blob([text], { type: 'text/calendar' });
  const file = new File([blob], name, { type: 'text/calendar' });
  let shared = false;
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file] }); shared = true; }
    catch (e) { if (e.name === 'AbortError') return; }
  }
  if (!shared) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 10000);
  }
  toast(`課題${nTask}件・持ち物${nPack}日分を書き出したよ`);
};

/* ===== カレンダー：年月をタップして選ぶ ===== */
const calPick = document.createElement('input');
calPick.type = 'month';
calPick.id = 'calPick';
calPick.setAttribute('aria-label', '年月を選ぶ');
const calTitleWrap = document.createElement('span');
calTitleWrap.className = 'calTitleWrap';
$('#calTitle').before(calTitleWrap);
calTitleWrap.append($('#calTitle'), calPick);
calPick.addEventListener('change', () => {
  const m = calPick.value.match(/^(\d{4})-(\d{2})$/);
  if (!m) return;
  calMonth = new Date(+m[1], +m[2] - 1, 1);
  renderCal();
});

/* ===== タグ（授業の色分け） ===== */
// 欠席警告の赤とかぶらない8色
const TAG_COLORS = ['#3b82f6', '#22a55b', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#a16207', '#6b7280'];
const tagOf = c => (c && c.tag && state.tags.find(t => t.id === c.tag)) || null;
const palHtml = (sel, attr) => TAG_COLORS.map(col =>
  `<button type="button" class="sw${col === sel ? ' on' : ''}" style="--sw:${col}" ${attr} data-col="${col}" aria-label="色"></button>`).join('');

// 共有コードのタグは、同じ名前があればそれを使い、なければ作る
function shareTag(x) {
  if (!x) return '';
  let t = state.tags.find(v => v.name === x.name);
  if (!t) { t = { id: uid(), name: x.name, color: x.color }; state.tags.push(t); }
  return t.id;
}

// 授業詳細のタグ欄
const tagBox = document.createElement('div');
tagBox.className = 'tagBox';
tagBox.innerHTML =
  '<span class="tagLbl">タグ</span><div id="cTags" class="tagChips"></div>' +
  '<div id="tagNew" class="tagNew" hidden>' +
  '<input id="tagName" placeholder="例：教職" maxlength="10" autocomplete="off" aria-label="タグの名前">' +
  '<div class="pal" id="tagNewPal"></div><p class="hint">色をタップすると作れるよ</p></div>';
($('#cRoom').closest('.row') || $('#cRoom').closest('label') || $('#cRoom')).after(tagBox);

function renderCTags() {
  const c = cur();
  if (!c) return;
  $('#cTags').innerHTML =
    state.tags.map(t =>
      `<button type="button" class="tagChip${c.tag === t.id ? ' on' : ''}" style="--tag:${t.color}" data-ctag="${t.id}">${esc(t.name)}</button>`).join('') +
    '<button type="button" class="tagChip add" data-ctag="new">＋ 新しいタグ</button>' +
    (state.tags.length ? '<button type="button" class="tagChip edit" data-ctag="edit">編集</button>' : '');
}

$('#cTags').addEventListener('click', e => {
  const b = e.target.closest('[data-ctag]');
  if (!b) return;
  const k = b.dataset.ctag, c = cur();
  if (k === 'new') {
    const box = $('#tagNew');
    box.hidden = !box.hidden;
    if (!box.hidden) {
      $('#tagNewPal').innerHTML = palHtml('', 'data-newcol');
      $('#tagName').value = '';
      $('#tagName').focus();
    }
    return;
  }
  if (k === 'edit') return openTagDlg();
  c.tag = c.tag === k ? '' : k; // もう一回押すと外れる
  save(); renderAll(); renderCTags();
});

$('#tagNewPal').addEventListener('click', e => {
  const col = e.target.closest('[data-newcol]')?.dataset.col;
  if (!col) return;
  const name = $('#tagName').value.trim();
  if (!name) return alert('タグの名前を入れてね');
  let t = state.tags.find(x => x.name === name);
  if (!t) { t = { id: uid(), name, color: col }; state.tags.push(t); }
  cur().tag = t.id;
  $('#tagNew').hidden = true;
  save(); renderAll(); renderCTags();
});

// タグの編集
const tagDlg = document.createElement('dialog');
tagDlg.id = 'tagDlg';
tagDlg.innerHTML =
  '<div class="dlg">' +
  '<div class="dlgHead"><h2>タグの編集</h2>' +
  '<button type="button" class="x" id="tagX" aria-label="閉じる">×</button></div>' +
  '<p class="hint">変更はすぐ反映されるよ。タグを消すと、付けてた授業は色なしに戻る</p>' +
  '<ul id="tagList" class="tagList"></ul>' +
  '<button type="button" class="primary" id="tagDone">閉じる</button>' +
  '</div>';
document.body.append(tagDlg);

function renderTagList() {
  $('#tagList').innerHTML = state.tags.map(t =>
    `<li><input data-tname="${t.id}" value="${esc(t.name)}" maxlength="10" aria-label="タグの名前">` +
    `<button type="button" class="x" data-tagdel="${t.id}" aria-label="削除">×</button>` +
    `<div class="pal">${palHtml(t.color, `data-tcol="${t.id}"`)}</div></li>`).join('') ||
    '<li class="muted">タグはまだないよ</li>';
}
function openTagDlg() { renderTagList(); tagDlg.showModal(); }

$('#tagList').addEventListener('change', e => {
  const id = e.target.dataset.tname;
  if (!id) return;
  const t = state.tags.find(x => x.id === id), v = e.target.value.trim();
  if (!t) return;
  if (!v) { e.target.value = t.name; return; }
  t.name = v.slice(0, 10);
  save(); renderAll(); renderCTags();
});
$('#tagList').addEventListener('click', e => {
  const sw = e.target.closest('[data-tcol]');
  if (sw) {
    const t = state.tags.find(x => x.id === sw.dataset.tcol);
    if (!t) return;
    t.color = sw.dataset.col;
    save(); renderAll(); renderCTags(); renderTagList();
    return;
  }
  const del = e.target.closest('[data-tagdel]');
  if (!del) return;
  const t = state.tags.find(x => x.id === del.dataset.tagdel);
  if (!t || !confirm(`タグ「${t.name}」を消す？`)) return;
  state.tags = state.tags.filter(x => x !== t);
  save(); renderAll(); renderCTags(); renderTagList();
});
$('#tagX').onclick = () => tagDlg.close();
$('#tagDone').onclick = () => tagDlg.close();

// 時間割の下の凡例（使ってるタグだけ）
const tagLegend = document.createElement('div');
tagLegend.id = 'tagLegend';
tagLegend.className = 'tagLegend';
$('#grid').after(tagLegend);
function renderTagLegend() {
  const used = new Set(courses().map(tagOf).filter(Boolean));
  tagLegend.innerHTML = state.tags.filter(t => used.has(t))
    .map(t => `<span style="--tag:${t.color}">${esc(t.name)}</span>`).join('');
  tagLegend.hidden = !used.size;
}

/* ===== 課題の名目・ホームに出すタイミング ===== */
function taskGroups() { return [selfCourse, ...state.cats]; }
function isGroup(id) { return id === SELF_ID || state.cats.some(g => g.id === id); }

function parseLead(s) {
  const m = /^(\d{1,2})([dwm])$/.exec(s || '');
  return m ? { n: +m[1], u: m[2] } : null;
}
function leadOf(k) { return k.lead || state.taskLead || '2w'; }
function showable(k) {
  if (!k.due) return true;
  const lead = leadOf(k);
  if (lead === 'all') return true;
  const L = parseLead(lead), d = parseYmd(k.due);
  if (!L || !d) return true;
  if (L.u === 'm') d.setMonth(d.getMonth() - L.n);
  else d.setDate(d.getDate() - L.n * (L.u === 'w' ? 7 : 1));
  return new Date() >= d;
}

function leadUI(p, withDefault) {
  return `<input type="number" id="${p}LeadN" class="leadN" min="1" max="99" inputmode="numeric" aria-label="数">` +
    `<select id="${p}LeadU">` +
    (withDefault ? '<option value="">いつもの設定</option>' : '') +
    '<option value="d">日前から</option><option value="w">週間前から</option>' +
    '<option value="m">か月前から</option><option value="all">いつも表示</option></select>';
}
function syncLeadUI(p) {
  const u = $(`#${p}LeadU`).value;
  $(`#${p}LeadN`).hidden = !u || u === 'all';
}
function setLeadUI(p, s) {
  const L = parseLead(s);
  $(`#${p}LeadU`).value = s === 'all' ? 'all' : L ? L.u : '';
  $(`#${p}LeadN`).value = L ? L.n : 2;
  syncLeadUI(p);
}
function getLeadUI(p) {
  const u = $(`#${p}LeadU`).value;
  if (!u || u === 'all') return u;
  const n = Math.min(99, Math.max(1, parseInt($(`#${p}LeadN`).value, 10) || 1));
  return n + u;
}

// 設定画面：全体のタイミング
const leadBox = document.createElement('div');
leadBox.className = 'leadBox';
leadBox.innerHTML = '<h3>課題をホームに出すタイミング</h3>' +
  '<div class="row leadRow">締切の' + leadUI('s', false) + '</div>' +
  '<p class="hint">これより先の課題はホームでは隠れるよ（カレンダーにはいつも出る）。課題ごとに変えたいときは、カレンダーで課題をタップした画面から</p>';
$('#aiBox').before(leadBox);
$('#sLeadU').addEventListener('change', () => syncLeadUI('s'));

// カレンダーの課題変更画面：課題ごとのタイミング
const ctLeadRow = document.createElement('div');
ctLeadRow.className = 'row leadRow';
ctLeadRow.innerHTML = 'ホームに出す：' + leadUI('ct', true);
$('#ctDueBox').append(ctLeadRow);
$('#ctLeadU').addEventListener('change', () => syncLeadUI('ct'));

// 名目の作成・名前変更・削除
function newCat() {
  const name = (prompt('新しい名目の名前') || '').trim().slice(0, 20);
  if (!name) return null;
  if (name === 'その他') return selfCourse;
  const same = state.cats.find(g => g.name === name);
  if (same) return same;
  const g = { id: 'cat-' + uid(), name, short: '', day: null, period: null, tasks: [] };
  state.cats.push(g);
  save();
  return g;
}
const catTools = document.createElement('div');
catTools.className = 'row catTools';
catTools.hidden = true;
catTools.innerHTML = '<button type="button" id="catRename">名前を変える</button>' +
  '<button type="button" id="catDel" class="danger">この名目を消す</button>';
$('#ctCourse').after(catTools);
function curCat() { return state.cats.find(g => g.id === $('#ctCourse').value); }
function syncCatTools() { catTools.hidden = !curCat(); }

$('#catRename').onclick = () => {
  const g = curCat();
  if (!g) return;
  const v = (prompt('名目の新しい名前', g.name) || '').trim().slice(0, 20);
  if (!v) return;
  g.name = v;
  save(); renderAll(); renderCal(); renderDay();
};
$('#catDel').onclick = () => {
  const g = curCat();
  if (!g) return;
  const n = g.tasks.length;
  if (!confirm(`「${g.name}」を消す？` + (n ? `\n中の課題${n}件は「その他」に移すよ` : ''))) return;
  state.myTasks.push(...g.tasks);
  state.cats = state.cats.filter(x => x !== g);
  if (ctEdit && ctEdit.cid === g.id) ctEdit.cid = SELF_ID;
  if (ctEdit && ctEdit.to === g.id) ctEdit.to = '';
  if (ctLastCid === g.id) ctLastCid = SELF_ID;
  save(); renderAll(); renderCal(); renderDay();
};

// 学期の画面を閉じたとき、学期メニューが開き直さないように
$('#termDlg').addEventListener('close', () => {
  const s = $('#termSelect');
  if (document.activeElement === s) s.blur();
});

/* ===== 通知（アプリ版だけ） ===== */
const isApp = !!window.Capacitor?.isNativePlatform?.();
const LN = isApp ? window.Capacitor.Plugins.LocalNotifications : null;
const NOTIFY_DAYS = 14, NOTIFY_MAX = 60;

// これから出す通知の一覧を作る
function notifyPlan() {
  const n = state.notify, t = term(), out = [];
  const now = new Date();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [hh, mm] = n.time.split(':').map(Number);
  for (let i = 0; i <= NOTIFY_DAYS; i++) {
    const day = addDays(today, i);       // 通知を出す日
    const next = addDays(today, i + 1);  // その次の日
    // 前の日の夜：持ち物と締切
    const at = new Date(day); at.setHours(hh, mm, 0, 0);
    if (at > now) {
      const lines = [], its = [], ds = [];
      for (const c of state.useGrid ? attendOn(next, t).concat(intsOn(next, t)) : []) {
        const o = c.day === -1 ? null : occurrence(c, next);
        for (const x of itemsFor(c, o ? o.start : next)) {
          const s = x.text.trim();
          if (s && !its.includes(s)) its.push(s);
        }
      }
      const k = ymd(next);
      const dk = Array.from({ length: n.tDays }, (_, j) => ymd(addDays(next, j)));
      const dl = [];
      for (const c of [...courses(), ...taskGroups()]) for (const x of c.tasks) {
        const j = x.done ? -1 : dk.indexOf(x.due);
        if (j >= 0) dl.push([j, x.title + (j ? `（あと${j + 1}日）` : '（明日）')]);
      }
      dl.sort((a, b) => a[0] - b[0]);
      ds.push(...dl.map(a => a[1]));
      const exs = eventsOn(k).filter(e => e.kind === 'exam' && grIsMine(e))
        .map(e => (e.start ? e.start + ' ' : '') + (e.title || '試験'));
      const evs = eventsOn(k).filter(e => e.kind !== 'exam' && grIsMine(e))
        .map(e => (e.start ? e.start + ' ' : '') + (e.title || EV_LABEL[e.kind] || '予定'));
      const showEx = n.exam && exs.length;
      if (showEx) lines.push('試験：' + exs.join('、'));
      if (n.events && evs.length) lines.push('予定：' + evs.join('、'));
      if (n.items && its.length) lines.push('持ち物：' + its.join('、'));
      if (n.tasks && ds.length) lines.push('締切：' + ds.join('、'));
      if (lines.length) out.push({ at, title: showEx ? `明日 ${md(next)} は試験！` : `明日 ${md(next)} の準備`, body: lines.join('\n') });
    }
    // バイトの前
    if (n.job > 0) for (const e of eventsOn(ymd(day))) {
      if (e.kind !== 'job' || !grIsMine(e)) continue;
      const s = toMin(e.start);
      if (s == null) continue;
      const at2 = new Date(day); at2.setHours(0, s - n.job, 0, 0);
      if (at2 > now) out.push({ at: at2, title: `${e.title || 'バイト'} ${e.start}から`, body: `あと${n.job}分で始まるよ` });
    }
  }

  // 朝：今日の運勢・○○の日・日課（1通にまとめる）
  const ftOn = n.fortune && n.sign !== '';
  const anOn = n.anniv && state.annivs.length > 0;
  if (n.habit || ftOn || anOn || n.fun) {
    const [mh, mi] = n.mTime.split(':').map(Number);
    const hl = n.habit ? hbLoad().list : [];
    for (let i = 0; i <= NOTIFY_DAYS; i++) {
      const day = addDays(today, i);
      const at = new Date(day); at.setHours(mh, mi, 0, 0);
      if (at <= now) continue;
      const k = ymd(day), lines = [], hits = [];
      if (anOn) for (const a of state.annivs) {
        if (annMd(a, day) === k.slice(5)) hits.push(a.name);
        else if (a.pre) {
          const p = addDays(day, a.pre);
          if (annMd(a, p) === ymd(p).slice(5)) lines.push(`あと${a.pre}日で${a.name}`);
        }
      }
      if (hits.length) lines.unshift('今日は' + hits.join('・') + '！');
      if (ftOn) lines.push(ftText(n.sign, k));
      const fd = n.fun && FUN_DAYS[k.slice(5)];
      if (fd) lines.push('今日は何の日：' + fd);
      const hs = hl.filter(h => hbOn(h, day) && !h.done.includes(k)).map(h => h.name);
      if (hs.length) lines.push('日課：' + hs.join('、'));
      if (lines.length) out.push({ at, title: `おはよう ${md(day)}`, body: lines.join('\n') });
    }
  }
  out.sort((a, b) => a.at - b.at);
  return out.slice(0, NOTIFY_MAX);
}

// 予約を全部消して入れ直す（保存が続いても1回で済むように少し待つ）
let notifyTimer = 0;
function scheduleNotify() {
  if (!LN) return;
  clearTimeout(notifyTimer);
  notifyTimer = setTimeout(syncNotify, 1500);
}
async function syncNotify() {
  try {
    const p = await LN.getPending();
    if (p.notifications.length) await LN.cancel({ notifications: p.notifications.map(x => ({ id: x.id })) });
    if (!state.notify.on) return;
    if ((await LN.checkPermissions()).display !== 'granted') return;
    const list = notifyPlan().map((x, i) => ({
      id: i + 1, title: x.title, body: x.body,
      schedule: { at: x.at, allowWhileIdle: true },
      // Android：正確な時刻じゃなくていい（数分ずれてもいい）。true のままだと Android 14 以降は
      // 予約するたびに「アラームとリマインダー」の設定画面が開いてしまう
      isExactNotification: false
    }));
    if (list.length) await LN.schedule({ notifications: list });
  } catch (err) {
    console.warn('通知の予約に失敗', err);
  }
}
async function askPerm() {
  const r = await LN.requestPermissions();
  if (r.display === 'granted') return true;
  alert('通知が許可されてないよ。スマホの設定 → アプリ → がくログ → 通知 からONにしてね');
  return false;
}

if (LN) {
  const nBox = document.createElement('div');
  nBox.className = 'nBox';
  nBox.innerHTML = '<h3>通知</h3>' +
    '<label class="row nRow"><input type="checkbox" id="nOn"> 通知を使う</label>' +
    '<div class="row nRow">前の日の <input type="time" id="nTime"> に知らせる</div>' +
    '<div class="row nRow nKinds">' +
    '<label><input type="checkbox" id="nExam"> 試験</label>' +
    '<label><input type="checkbox" id="nItems"> 持ち物</label>' +
    '<label><input type="checkbox" id="nTasks"> 課題の締切</label><label><input type="checkbox" id="nEvents"> 予定</label></div>' +
    '<div class="row nRow">課題の締切は <select id="nTDays"><option value="1">明日だけ</option><option value="3">3日以内</option><option value="7">1週間以内</option></select> を知らせる</div>' +
    '<div class="row nRow">朝の <input type="time" id="nMTime"> に知らせる</div>' +
    '<div class="row nRow nKinds">' +
    '<label><input type="checkbox" id="nHabit"> 今日の日課</label>' +
    '<label><input type="checkbox" id="nFortune"> 今日の運勢</label><label><input type="checkbox" id="nFun"> 今日は何の日</label></div>' +
    '<p class="hint">「今日は何の日」はWikipedia「日本の記念日一覧」を参考にしています</p>' +
    '<div class="row nRow">星座 <select id="nSign"></select></div>' +
    '<p class="hint">運勢はお遊びの占いだよ</p>' +
    '<div class="row nRow nKinds"><label><input type="checkbox" id="nAnniv"> ○○の日</label></div>' +
    '<ul class="annList" id="annList"></ul>' +
    '<div class="row nRow annAdd">' +
    '<input id="annName" maxlength="20" placeholder="例：母の誕生日">' +
    '<input type="date" id="annDate">' +
    '<select id="annPre"><option value="0">当日だけ</option><option value="1">前日も</option>' +
    '<option value="3">3日前も</option><option value="7">1週間前も</option></select>' +
    '<button type="button" id="annAddBtn">追加</button></div>' +
    '<p class="hint">年は関係なく、毎年その日の朝に知らせるよ</p>' +
    '<div class="row nRow">バイトの <select id="nJob">' +
    '<option value="0">通知しない</option><option value="30">30分前</option>' +
    '<option value="60">1時間前</option><option value="90">1時間半前</option>' +
    '<option value="120">2時間前</option></select></div>' +
    '<button type="button" id="nTest">テスト通知（5秒後）</button>' +
    '<p class="hint">ここは変えるとすぐ保存されるよ。予約するのは今の学期の2週間分で、アプリを開くたびに入れ直す</p>';
  $('#aiBox').before(nBox);


  const syncNotifyUI = () => {
    $('#nOn').checked = state.notify.on;
    $('#nTime').value = state.notify.time;
    $('#nJob').value = String(state.notify.job);
    $('#nExam').checked = state.notify.exam;
    $('#nItems').checked = state.notify.items;
    $('#nTasks').checked = state.notify.tasks;
    $('#nEvents').checked = state.notify.events;
    $('#nTDays').value = String(state.notify.tDays);
    $('#nFun').checked = state.notify.fun;
    $('#nMTime').value = state.notify.mTime;
    $('#nHabit').checked = state.notify.habit;
    $('#nFortune').checked = state.notify.fortune;
    $('#nAnniv').checked = state.notify.anniv;
  };
  setTimeout(syncNotifyUI, 0);

  $('#nOn').onchange = async e => {
    if (e.target.checked && !(await askPerm())) { e.target.checked = false; return; }
    state.notify.on = e.target.checked;
    save();
    toast(state.notify.on ? '通知をONにしたよ' : '通知をOFFにしたよ');
  };
  $('#nTime').onchange = e => {
    if (!/^\d\d:\d\d$/.test(e.target.value)) return syncNotifyUI();
    state.notify.time = e.target.value;
    save();
  };
  $('#nJob').onchange = e => {
    state.notify.job = +e.target.value;
    save();
  };
  $('#nTest').onclick = async () => {
    if (!(await askPerm())) return;
    await LN.schedule({ notifications: [{
      id: 99999, title: 'がくログ', body: '通知のテストだよ',
      schedule: { at: new Date(Date.now() + 5000), allowWhileIdle: true }, isExactNotification: false
    }] });
    toast('5秒後に届くよ。アプリを閉じて待ってみて');
  };

// 通知の種類（変えたらすぐ予約し直す）
for (const [id, key] of [['nExam', 'exam'], ['nItems', 'items'], ['nTasks', 'tasks'], ['nEvents', 'events']]) {
  $('#' + id).onchange = e => { state.notify[key] = e.target.checked; save(); };
}
  $('#nTDays').onchange = e => { state.notify.tDays = Number(e.target.value); save(); };
  $('#nFun').onchange = e => { state.notify.fun = e.target.checked; save(); };
  $('#nHabit').onchange = e => { state.notify.habit = e.target.checked; save(); };
  $('#nMTime').onchange = e => {
  if (!/^\d\d:\d\d$/.test(e.target.value)) return syncNotifyUI();
  state.notify.mTime = e.target.value;
  save();
};

  // ○○の日
  const renderAnn = () => {
    $('#annList').innerHTML = state.annivs.slice().sort((a, b) => a.md.localeCompare(b.md)).map(a =>
      `<li><span>${+a.md.slice(0, 2)}/${+a.md.slice(3)} ${esc(a.name)}` +
      (a.pre ? ` <small>${a.pre}日前にも</small>` : '') + '</span>' +
      `<button type="button" class="x" data-anndel="${a.id}" aria-label="削除">×</button></li>`
    ).join('') || '<li class="muted">まだないよ</li>';
  };
  setTimeout(renderAnn, 0);
  $('#nAnniv').onchange = e => { state.notify.anniv = e.target.checked; save(); };
  $('#annAddBtn').onclick = () => {
    const name = $('#annName').value.trim(), d = $('#annDate').value;
    if (!name) return $('#annName').focus();
    if (!isYmd(d)) return alert('日付を選んでね');
    state.annivs.push({ id: uid(), name: name.slice(0, 20), md: d.slice(5), pre: +$('#annPre').value });
    $('#annName').value = '';
    $('#annDate').value = '';
    save(); renderAnn();
  };
  $('#annList').onclick = e => {
    const id = e.target.closest('[data-anndel]')?.dataset.anndel;
    const a = state.annivs.find(x => x.id === id);
    if (!a || !confirm(`「${a.name}」を消す？`)) return;
    state.annivs = state.annivs.filter(x => x !== a);
    save(); renderAnn();
  };

  // 日付が変わっても予約がずれないように、開くたびに入れ直す
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) { syncNotifyUI(); scheduleNotify(); }
  });
}

/* ===== シフトをカレンダーから取り込む（アプリ版だけ） ===== */
const CAL = isApp ? window.Capacitor.Plugins.CapacitorCalendar : null;
const isIOS = isApp && window.Capacitor.getPlatform() === 'ios';
const CAL_BACK = 120, CAL_AHEAD = 60;
const pad2 = n => String(n).padStart(2, '0');
const hhmm = d => pad2(d.getHours()) + ':' + pad2(d.getMinutes());

async function calPerm() {
  const r = isIOS ? await CAL.requestFullCalendarAccess() : await CAL.requestReadOnlyCalendarAccess();
  return r.result === 'granted';
}

let calBusy = false;
async function syncCal(manual = false) {
  if (!CAL || calBusy || !state.calSync.cals.length) return;
  calBusy = true;
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const from = addDays(today, -CAL_BACK), to = addDays(today, CAL_AHEAD + 1);
    const { result } = await CAL.listEventsInRange({ from: from.getTime(), to: to.getTime() });
    // 全部のカレンダーが空で返ってきたら、許可がないとみなして何も消さない
    if (!result || !result.length) throw new Error('empty');
    const jobOf = new Map(state.calSync.cals.map(c => [c.id, c.job]));
    const fromK = ymd(from), toK = ymd(addDays(today, CAL_AHEAD));

    const fresh = [];
    for (const ev of result) {
      // 選んだカレンダー以外は、ここで捨てる（保存しない）
      if (!jobOf.has(ev.calendarId) || ev.isAllDay) continue;
      const s = new Date(ev.startDate), en = new Date(ev.endDate);
      if (!(en > s) || en - s > 24 * 3600e3) continue;
      const date = ymd(s);
      if (date < fromK || date > toK) continue;
      fresh.push({
        date, start: hhmm(s), end: hhmm(en),
        title: jobOf.get(ev.calendarId) || (ev.title || '').trim() || 'バイト',
        ext: `${ev.calendarId}|${ev.id}|${ev.startDate}`
      });
    }
    // 範囲内の取り込み済みはいったん消して入れ直す（📄の画像は引き継ぐ）
    const imgs = new Map();
    state.events = state.events.filter(e => {
      if (e.src !== 'cal' || e.date < fromK || e.date > toK) return true;
      if (e.img) imgs.set(e.ext, e.img);
      return false;
    });
    let n = 0;
    for (const f of fresh) {
      const dup = state.events.some(e => e.kind === 'job' && e.date === f.date && e.start === f.start && e.end === f.end);
      if (dup) continue;
      const e = { id: uid(), date: f.date, kind: 'job', title: f.title, start: f.start, end: f.end, src: 'cal', ext: f.ext };
      if (imgs.has(f.ext)) e.img = imgs.get(f.ext);
      state.events.push(e);
      n++;
    }
    state.calSync.last = Date.now();
    save();
    if (manual || !document.querySelector('dialog[open]')) renderAll();
    renderCsList();
    if (manual) toast(`${n}件のシフトを取り込んだよ`);
  } catch (err) {
    console.warn('カレンダーの取り込みに失敗', err);
    if (manual) alert('カレンダーを読めなかった。スマホの設定 → アプリ → がくログ で、カレンダーの許可を確かめてね');
  } finally {
    calBusy = false;
  }
}

function renderCsList() {
  if (!CAL) return;
  const cs = state.calSync.cals;
  $('#csList').innerHTML = cs.map((c, i) =>
    `<li><span class="csName">${esc(c.title || 'カレンダー')}</span>` +
    `<input type="text" data-csjob="${i}" placeholder="バイト先（空なら予定名）" maxlength="20">` +
    `<button type="button" class="x" data-csdel="${i}" aria-label="外す">×</button></li>`
  ).join('') || '<li class="muted">まだ選んでないよ</li>';
  cs.forEach((c, i) => { $(`[data-csjob="${i}"]`).value = c.job; });
  $('#csRun').hidden = !cs.length;
  const l = state.calSync.last;
  $('#csLast').textContent = l ? `最後に取り込んだ：${md(new Date(l))} ${hm(new Date(l))}` : '';
}

if (CAL) {
  const box = document.createElement('div');
  box.className = 'csBox';
  box.innerHTML = '<h3>シフトをカレンダーから取り込む</h3>' +
    '<p class="hint">シフトボードなどがスマホのカレンダーに書き出したシフトを、バイトの予定として取り込むよ。選んだカレンダー以外の予定は保存しない</p>' +
    '<ul id="csList" class="csList"></ul>' +
    '<div id="csPicker" class="csPicker" hidden></div>' +
    '<div class="row"><button type="button" id="csPick">カレンダーを選ぶ</button>' +
    '<button type="button" id="csRun">今すぐ取り込む</button></div>' +
    '<p class="hint" id="csLast"></p>' +
    '<p class="hint">ここは変えるとすぐ保存されるよ。取り込んだシフトをがくログで直しても、次に取り込むとカレンダーの内容に戻る</p>';
  $('#aiBox').before(box);

  $('#csPick').onclick = async () => {
    try {
      if (!(await calPerm())) return alert('カレンダーの許可がないよ。スマホの設定 → アプリ → がくログ からONにしてね');
      const { result } = await CAL.listCalendars();
      if (!result || !result.length) return alert('カレンダーが見つからなかった');
      const chosen = new Set(state.calSync.cals.map(c => c.id));
      const p = $('#csPicker');
      p.innerHTML = result.map((c, i) =>
        `<label class="row csOpt"><input type="checkbox" data-csi="${i}" ${chosen.has(c.id) ? 'checked' : ''}> ` +
        `${esc(c.title || '名前なし')}${c.accountName ? ` <small>${esc(c.accountName)}</small>` : ''}</label>`
      ).join('') + '<button type="button" id="csOk" class="primary">これにする</button>';
      p.hidden = false;
      p._cals = result;
    } catch (err) {
      console.warn(err);
      alert('カレンダーの一覧を読めなかった');
    }
  };

  box.addEventListener('click', e => {
    if (e.target.id === 'csOk') {
      const p = $('#csPicker'), list = p._cals || [];
      const old = new Map(state.calSync.cals.map(c => [c.id, c]));
      state.calSync.cals = [...p.querySelectorAll('[data-csi]')].filter(x => x.checked).map(x => {
        const c = list[+x.dataset.csi];
        return { id: c.id, title: c.title || '', job: old.get(c.id)?.job || '' };
      });
      p.hidden = true;
      save(); renderCsList();
      syncCal(true);
      return;
    }
    const del = e.target.dataset.csdel;
    if (del != null) {
      const c = state.calSync.cals[+del];
      if (!confirm(`「${c.title}」の取り込みをやめる？\n今日から先の取り込んだシフトは消すよ`)) return;
      const today = ymd(new Date());
      state.events = state.events.filter(x => !(x.src === 'cal' && x.ext.startsWith(c.id + '|') && x.date >= today));
      state.calSync.cals.splice(+del, 1);
      save(); renderCsList(); renderAll();
    }
  });

  box.addEventListener('change', e => {
    const i = e.target.dataset.csjob;
    if (i == null) return;
    state.calSync.cals[+i].job = e.target.value.trim().slice(0, 20);
    save();
    syncCal();
  });

  $('#csRun').onclick = () => syncCal(true);

  // 起動が終わってから表示・取り込み。開き直すたびにも取り込む
  setTimeout(renderCsList, 0);
  setTimeout(() => syncCal(), 1500);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) syncCal(); });
}

/* ===== 予定を長押しで動かす ===== */
const CAL_SRC_MSG = 'カレンダーから取り込んだ予定は、元のカレンダーで動かしてね（ここで動かしても次の取り込みで戻っちゃう）';
const evDayDiff = (a, b) => Math.round((parseYmd(b) - parseYmd(a)) / 864e5);
function moveEvents(ids, delta, msg) {
  const back = [];
  for (const e of state.events) if (ids.has(e.id)) {
    back.push([e.id, e.date]);
    e.date = ymd(addDays(parseYmd(e.date), delta));
  }
  if (!back.length) return;
  save(); renderAll(); renderCal(); renderDay();
  toast(msg, () => {
    for (const [id, d] of back) {
      const e = state.events.find(x => x.id === id);
      if (e) e.date = d;
    }
    save(); renderAll(); renderCal(); renderDay();
  });
}

let drag = null, dragSkipClick = 0;
function endDrag() {
  if (!drag) return;
  clearTimeout(drag.timer);
  drag.ghost?.remove();
  drag.over?.classList.remove('dropTo');
  drag = null;
}
function moveGhost(x, y) {
  drag.ghost.style.left = x + 'px';
  drag.ghost.style.top = y + 'px';
  const cell = document.elementFromPoint(x, y)?.closest('#calGrid .cd') || null;
  if (cell !== drag.over) {
    drag.over?.classList.remove('dropTo');
    cell?.classList.add('dropTo');
    drag.over = cell;
  }
}
$('#calGrid').addEventListener('pointerdown', e => {
  const lb = e.target.closest('[data-evid]');
  if (!lb || calMulti) return;
  const ev = findAnyEv(lb.dataset.evid);
  if (!ev) return;
  endDrag();
  const x0 = e.clientX, y0 = e.clientY;
  drag = { ev, x0, y0, on: false, over: null, ghost: null };
  drag.timer = setTimeout(() => {
    if (!drag) return;
    drag.on = true;
    navigator.vibrate?.(15);
    const g = document.createElement('div');
    g.className = 'dragGhost ev ' + ev.kind;
    g.textContent = ev.title || EV_LABEL[ev.kind];
    document.body.append(g);
    drag.ghost = g;
    moveGhost(x0, y0);
  }, 400);
});
document.addEventListener('pointermove', e => {
  if (!drag) return;
  if (!drag.on) {
    // 長押しになる前に指が動いたら、ふつうのスクロール
    if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 10) endDrag();
    return;
  }
  moveGhost(e.clientX, e.clientY);
});
document.addEventListener('pointerup', () => {
  if (!drag) return;
  const { on, over, ev } = drag;
  endDrag();
  if (!on) return;
  dragSkipClick = Date.now();
  const to = over?.dataset.date;
  if (!to || to === ev.date) return;
  if (ev.gid) {
    if (grLocked(ev)) return alert(grLockMsg(ev));
    return grMove(ev, to);
  }
  if (ev.src === 'cal') return alert(CAL_SRC_MSG);
  calSel = to;
  moveEvents(new Set([ev.id]), evDayDiff(ev.date, to), `${md(parseYmd(to))}に移動したよ`);
});
document.addEventListener('pointercancel', () => endDrag());
// つかんでる間は画面をスクロールさせない
document.addEventListener('touchmove', e => { if (drag?.on) e.preventDefault(); }, { passive: false });
// 長押しメニューと、離したあとの「日付タップ」を止める
$('#calGrid').addEventListener('contextmenu', e => {
  if (e.target.closest('[data-evid]')) e.preventDefault();
});
$('#calGrid').addEventListener('click', e => {
  if (Date.now() - dragSkipClick < 500) e.stopImmediatePropagation();
}, true);

/* ===== 機能をさがす ===== */
const goSet = sel => {
  openSettings();
  setTimeout(() => {
    const el = $(sel);
    if (!el) return;
    const d = el.closest('details');
    if (d) d.open = true;
    el.scrollIntoView({ block: 'center' });
  }, 80);
};
const goTerm = sel => {
  openTermDlg();
  const el = $(sel), d = el?.closest('details');
  if (d) { d.open = true; el.scrollIntoView({ block: 'center' }); }
};
const FEATURES = [
  { id: 'grid', name: '時間割', where: '下の「時間割」タブ', desc: '授業を曜日と時限で並べる。マスをタップすると授業の詳細', kw: '時間割 授業 科目 登録', grid: 1, go: () => showTab('grid') },
  { id: 'photoGrid', name: '写真から時間割を読み込む', where: '＋ →「📷 写真から追加」→ 時間割', desc: '大学サイトの時間割のスクショから、AIが授業を入れる', kw: '写真 画像 スクショ 読み取り 読み込み 自動', grid: 1, go: () => startPhoto('grid') },
  { id: 'photoPay', name: '給与明細を読み取る', where: '＋ →「📷 写真から追加」→ 給与明細', desc: '明細の写真から支給日・総支給・手取りを読み取る。いらない所は塗りつぶせる', kw: '給与 明細 給料 写真 読み取り', go: () => openPhoto('pick') },
  { id: 'photoShift', name: 'シフト表を読み取る', where: '＋ →「📷 写真から追加」→ シフト表／カレンダーの上の「📷 画像から予定を追加」 → シフト表', desc: 'シフト表の写真やPDFから自分の勤務だけ拾ってバイト予定にする。他の人の所は海苔で隠せる', kw: 'シフト PDF 海苔 読み取り', go: () => openPhoto('pick') },
  { id: 'items', name: '持ち物', where: '授業の詳細 →「持ち物」', desc: '「次回だけ」と「毎回」を選べる。今日と明日の分はホームにまとめて出る', kw: '持ち物 忘れ物 準備 教科書', grid: 1, go: () => showTab('grid') },
  { id: 'tasks', name: '課題', where: 'カレンダーで日付をタップ →「＋ 課題」（授業の詳細からも）', desc: '締切つきで登録すると、ホームに近い順で出る。授業と関係ない「その他」もOK', kw: '課題 宿題 レポート 締切 提出 期限', go: () => showTab('cal') },
  { id: 'taskLead', name: '課題をホームに出すタイミング', where: '設定 → 課題', desc: '締切の何日・何週間前からホームに出すか。課題ごとにも変えられる', kw: 'いつから タイミング 前から 隠す', go: () => goSet('#sLeadU') },
  { id: 'cats', name: '課題の名目', where: 'カレンダーで課題を追加 → 授業の欄 →「＋ 新しい名目を作る」', desc: 'サークルや就活など、授業以外の課題のグループ', kw: '名目 グループ サークル 授業以外', go: () => showTab('cal') },
  { id: 'cal', name: 'カレンダー', where: '下の「カレンダー」タブ', desc: '課題・バイト・予定・休みを月の表で見る。上の年月をタップすると飛べる', kw: 'カレンダー 予定 スケジュール 月', go: () => showTab('cal') },
  { id: 'job', name: 'バイトの予定', where: 'カレンダーで日付をタップ →「＋ 予定」→ 種類を「バイト」', desc: '同じ曜日に4週分まとめて追加できる。夜勤もOK', kw: 'バイト アルバイト 勤務 塾', go: () => showTab('cal') },
  { id: 'income', name: '収入', where: '「収入」ボタン', desc: '月ごと・バイト先ごとの収入、年間の上限まであといくら、時給からの見込み', kw: '収入 給料 お金 扶養 見込み 時給 上限', go: () => $('#incomeBtn').click() },
  { id: 'term', name: '学期', where: '時間割タブの上の「🗓 学期・休み」／上の学期の選択', desc: '前期・後期の切り替え、新しい学期づくり、開始日と終了日', kw: '学期 前期 後期 年度 新学期 開始日', grid: 1, go: () => goTerm('#termList') },
  { id: 'offday', name: '授業がない日・曜日の振替', where: '時間割タブの上の「🗓 学期・休み」', desc: '祝日や行事で授業がない日、ほかの曜日の授業をする日', kw: '祝日 振替 授業がない 休み', grid: 1, go: () => goTerm('#offFrom') },
  { id: 'intensive', name: '集中講義', where: '時間割の下', desc: '期間だけ決まってる授業を登録', kw: '集中講義 集中', grid: 1, go: () => showTab('grid') },
  { id: 'absence', name: '欠席の記録', where: '授業の詳細 →「詳細」', desc: '欠席の回数と、あと何回休めるか', kw: '欠席 出席 休める 単位', grid: 1, go: () => showTab('grid') },
  { id: 'cancel', name: '休講', where: '授業の詳細 →「詳細」', desc: 'その日だけ授業がないことにする。持ち物も次の回にずれる', kw: '休講', grid: 1, go: () => showTab('grid') },
  { id: 'syllabus', name: 'シラバス', where: '授業の詳細 →「詳細」', desc: 'シラバスのURLを貼っておいて、すぐ開ける', kw: 'シラバス URL', grid: 1, go: () => showTab('grid') },
  { id: 'tags', name: 'タグ（授業の色分け）', where: '授業の詳細 →「タグ」', desc: 'タグを付けると時間割が色分けされる', kw: 'タグ 色分け 分類 色', grid: 1, go: () => showTab('grid') },
  { id: 'short', name: '略名', where: '授業の詳細 → 授業名の横', desc: '時間割やホームに短い名前で出す', kw: '略名 短く 名前', grid: 1, go: () => showTab('grid') },
  { id: 'notes', name: 'メモ・一言日記', where: 'ホームの課題の下', desc: '今日だけのメモ、残すメモ、一言日記。過去の分はカレンダーで見返せる', kw: 'メモ 日記 ひとこと', go: () => showTab('today') },
  { id: 'share', name: '時間割の共有', where: '学期の画面 →「共有」', desc: '共有コードで友達と時間割をやりとり', kw: '共有 友達 送る コード', grid: 1, go: () => openTermDlg('shareSec') },
  { id: 'backup', name: 'バックアップ・復元', where: '設定 → データ', desc: 'データをファイルに書き出す・戻す。機種変更やアプリ版への引っ越しに', kw: 'バックアップ 復元 引っ越し 機種変 データ', go: () => goSet('#exportBtn') },
  { id: 'ics', name: 'カレンダーに書き出す', where: '設定 → データの下', desc: '課題の締切と持ち物をスマホのカレンダーに入れる。前日21時に通知', kw: '書き出し ics 通知 リマインド Googleカレンダー', go: () => goSet('#icsBtn') },
  { id: 'notify', name: '通知', where: '設定 →「通知」', desc: '前の日の夜に持ち物と締切、バイトの前にお知らせ', kw: '通知 リマインド お知らせ', app: 1, go: () => goSet('#nOn') },
  { id: 'calSync', name: 'カレンダーからシフトを取り込む', where: '設定', desc: 'シフトボードなどでスマホのカレンダーに入った予定を、バイトとして取り込む', kw: 'シフトボード 取り込み 同期 連携', app: 1, go: () => goSet('#csList') },
  { id: 'theme', name: 'テーマ・文字', where: 'その他 → 見た目', desc: 'アプリの色とフォントを変える', kw: 'テーマ 色 フォント 文字 見た目', go: () => openLook('font') },
  { id: 'icon', name: 'アイコンの色', where: 'その他 → 見た目', desc: 'ホーム画面のアイコンの色を選ぶ', kw: 'アイコン 色', go: () => openLook('icon') },
  { id: 'times', name: '時限の時刻', where: '設定 → 時限', desc: '何限が何時からか。1つずらすと後ろもまとめてずらせる', kw: '時刻 何限 時限 開始 終了', grid: 1, go: () => goSet('#sTimes') },
  { id: 'weekStart', name: 'カレンダーの週のはじまり', where: 'カレンダーの下の「週のはじまり」／設定 → 使い方', desc: 'カレンダーを月曜はじまりか日曜はじまりにする', kw: '週 はじまり 始まり 月曜 日曜 曜日 カレンダー', go: () => goSet('#sWeekStart') },
  { id: 'sat', name: '土曜日を表示', where: '設定 → 表示', desc: '時間割に土曜の列を出す', kw: '土曜', grid: 1, go: () => goSet('#sSat') },
  { id: 'features', name: '機能のオン/オフ', where: '設定 → 機能', desc: 'バイト・共有・日記・ToDoなど、使わない機能を隠す。データは消えない', kw: '機能 オフ 隠す 非表示 いらない シンプル バイト 共有 日記 ToDo メモ 日課 ポイント', go: () => goSet('#setFeat') },
  { id: 'useGrid', name: '時間割を使う・使わない', where: '設定 → 機能', desc: '時間割まわりを隠して、予定管理だけで使う', kw: '時間割 いらない 隠す 社会人 予定管理', go: () => goSet('#sUseGrid') },
  { id: 'ai', name: 'AIの準備（APIキー）', where: '設定 → AI', desc: '写真の読み取りに使うキーを入れる。Geminiなら無料枠あり', kw: 'AI APIキー キー Gemini', go: () => openPhoto('guide') },
  { id: 'feedback', name: '目安箱', where: '目安箱のボタン', desc: '匿名で意見や不具合を送れる', kw: '意見 要望 バグ 不具合 目安箱', go: () => window.open(FEEDBACK_URL, '_blank') }
];
// 機能をさがす：項目ごとに、出すのに必要な機能（全部オンのときだけ出す）
const FEAT_NEED = {
  job: ['job'], income: ['job'], calSync: ['job'], photoPay: ['job', 'ai'], photoShift: ['job', 'ai'],
  photoGrid: ['grid', 'ai'], photoMemo: ['ai'], ai: ['ai'], group: ['group'],
  share: ['grid', 'share'], friendGrid: ['grid', 'share'], points: ['points'], miniNote: ['grid']
};
const featShown = id => id === 'notes' ? featOn('memo') || featOn('diary') : (FEAT_NEED[id] || []).every(featOn);
function helpFeatures() {
  return FEATURES.filter(f =>
    (!f.app || isApp) && (!f.grid || state.useGrid) && featShown(f.id) && (f.id !== 'feedback' || FEEDBACK_URL));
}
// キーなし・AI失敗時のキーワード検索
function helpLocal(q) {
  const s = q.replace(/\s+/g, '');
  return helpFeatures().map(f => {
    let n = s.includes(f.name) ? 5 : 0;
    for (const k of f.kw.split(' ')) if (k && s.includes(k)) n += k.length;
    return { f, n };
  }).filter(x => x.n).sort((a, b) => b.n - a.n).slice(0, 3).map(x => x.f);
}
const helpPrompt = q => `あなたは学生向けアプリ「がくログ」の案内係です。ユーザーの質問に合う機能を、下の機能一覧の中からだけ選んでください。
一覧にない機能は「その機能はまだない」と正直に答え、作り話をしないでください。
JSONだけを出力してください。説明文やコードブロック記号は書かないでください。
一覧に書いていない細かい条件（手書き・PDF・ファイルの種類など）は、できる・できないを言い切らないで。「たぶんできるから試してみて」と近い機能を案内して。ある機能の条件を別の機能に当てはめないで。一覧にない機能やできることを作らないで。
形式: {"answer":"…","ids":["id1"]}
answerは2文以内の、やさしいタメ口の日本語。idsは関係が強い順に最大3つ。合うものがなければ空の配列。
機能一覧: ${JSON.stringify(helpFeatures().map(({ id, name, where, desc }) => ({ id, name, where, desc })))}
質問: ${q}`;

// 文字だけでAIに聞く
async function askText(prompt) {
  const p = state.provider, key = state.keys[p], model = modelOf(p);
  if (!key) throw new Error('設定でAPIキーを入れてね');
  const claude = p === 'claude';
  const r = await fetch(PROVIDERS[p].url, {
    method: 'POST',
    signal: aiCtl?.signal,
    headers: claude
      ? { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' }
      : { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify(claude
      ? { model, max_tokens: 1024, messages: [{ role: 'user', content: prompt }] }
      : { model, messages: [{ role: 'user', content: prompt }] })
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) {
    if (r.status === 429) throw new Error('回数制限に達したみたい。少し待ってね');
    throw new Error((Array.isArray(d) ? d[0] : d)?.error?.message || String(r.status));
  }
  if (claude) return (d.content || []).map(b => b.text || '').join('');
  const c = d.choices?.[0]?.message?.content;
  return Array.isArray(c) ? c.map(x => x.text || '').join('') : (c || '');
}

const helpDlg = document.createElement('dialog');
helpDlg.id = 'helpDlg';
helpDlg.innerHTML = '<div class="dlg">' +
  '<div class="dlgHead"><h2>機能をさがす</h2>' +
  '<button type="button" class="x" id="helpX" aria-label="閉じる">×</button></div>' +
  '<p class="hint">「こういうことできる？」って書いてみて</p>' +
  '<input id="helpQ" placeholder="例：課題をいつからホームに出すか変えたい" maxlength="100" autocomplete="off" aria-label="さがしたいこと">' +
  '<button type="button" class="primary" id="helpRun">さがす</button>' +
  '<p id="helpStatus" class="hint" aria-live="polite"></p>' +
  '<ul id="helpList" class="helpList"></ul></div>';
document.body.append(helpDlg);

const helpBtn = document.createElement('button');
helpBtn.type = 'button';
helpBtn.id = 'helpBtn';
helpBtn.textContent = '🔍 機能をさがす';
$('#settingsBtn').before(helpBtn);
helpBtn.onclick = () => {
  $('#helpQ').value = '';
  $('#helpStatus').textContent = '';
  $('#helpList').innerHTML = '';
  helpDlg.showModal();
};
$('#helpX').onclick = () => helpDlg.close();

function renderHelp(fs) {
  $('#helpList').innerHTML = fs.map(f =>
    `<li><b>${esc(f.name)}</b><span class="hint">${esc(f.where)}</span>` +
    `<p>${esc(f.desc)}</p><button type="button" data-help="${f.id}">開く</button></li>`).join('');
}
$('#helpList').addEventListener('click', e => {
  const f = FEATURES.find(x => x.id === e.target.closest('[data-help]')?.dataset.help);
  if (!f) return;
  helpDlg.close();
  setTimeout(f.go, 50);
});

let helpRunning = false;
$('#helpRun').onclick = async () => {
  const q = $('#helpQ').value.trim();
  if (!q || helpRunning) return;
  const st = $('#helpStatus'), local = helpLocal(q);
  if (!hasKey()) {
    renderHelp(local);
    st.textContent = local.length
      ? 'それっぽいのはこれかな'
      : '見つからなかった。短い言葉で探してみて（AIの準備をすると普通の文で探せるよ）';
    return;
  }
  helpRunning = true;
  $('#helpRun').disabled = true;
  aiBegin('#helpRun');
  st.textContent = 'AIに聞いてる…';
  try {
    const txt = await askText(helpPrompt(q));
    const s = txt.indexOf('{'), e = txt.lastIndexOf('}');
    const r = JSON.parse(txt.slice(s, e + 1));
    const fs = (Array.isArray(r.ids) ? r.ids : [])
      .map(id => helpFeatures().find(f => f.id === id)).filter(Boolean).slice(0, 3);
    renderHelp(fs);
    st.textContent = String(r.answer || (fs.length ? 'これが使えそう' : 'ぴったりの機能はないみたい'));
  } catch (err) {
    renderHelp(local);
    st.textContent = isAbort(err) ? '中止したよ'
      : `AIに聞けなかった（${friendlyError(err)}）` + (local.length ? '。キーワードで探した結果を出すね' : '');
  } finally {
    aiEnd('#helpRun');
    helpRunning = false;
    $('#helpRun').disabled = false;
  }
};
$('#helpQ').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.isComposing) $('#helpRun').click();
});

/* ===== シフト表：バイト先ごとに読み方を覚える ===== */
const SH_LAYOUT_NAME = { day: '1日ごとの表', grid: '1か月の表' };
const shMem = () => {
  const m = state.shiftByJob;
  return m && typeof m === 'object' && !Array.isArray(m) ? m : (state.shiftByJob = {});
};
function rememberShift(job, name, layout) {
  if (!job) return;
  shMem()[job] = { name, layout, at: Date.now() };
  save();
}

const shJobBox = document.createElement('div');
shJobBox.className = 'shJobs';
const shMemHint = document.createElement('p');
shMemHint.id = 'shMemHint';
shMemHint.className = 'hint';
shiftDlg.querySelector('#shJob').closest('label').after(shJobBox, shMemHint);

function renderShJobs() {
  const m = shMem(), last = new Map();
  for (const e of state.events) if (e.kind === 'job' && e.title)
    if ((last.get(e.title) || '') < e.date) last.set(e.title, e.date);
  for (const k of Object.keys(m)) if (!last.has(k)) last.set(k, '');
  const jobs = [...last.keys()]
    .sort((a, b) => (m[b]?.at || 0) - (m[a]?.at || 0) || last.get(b).localeCompare(last.get(a)))
    .slice(0, 8);
  shJobBox.innerHTML = jobs.length
    ? '<p class="hint">カレンダーのバイト（タップで前回の読み方に）</p>' +
      jobs.map(j => `<button type="button" class="chip${m[j] ? ' mem' : ''}" data-shj="${esc(j)}">${esc(j)}</button>`).join('')
    : '';
  syncShMemHint();
}
function applyShMem(job) {
  const x = shMem()[job];
  if (x) {
    $('#shName').value = x.name || ''; // 空欄＝自分の分だけの表
    if (SH_LAYOUT_NAME[x.layout]) $('#shLayout').value = x.layout;
    syncShName();
  }
  syncShMemHint();
}
function syncShMemHint() {
  const x = shMem()[$('#shJob').value.trim()];
  shMemHint.textContent = x
    ? x.name ? `前回（${md(new Date(x.at))}）は「${x.name}」・${SH_LAYOUT_NAME[x.layout] || ''}で読んだよ`
      : `前回（${md(new Date(x.at))}）は名前なし（自分の分だけの表）で読んだよ`
    : '';
  shMemHint.hidden = !x;
}
shJobBox.addEventListener('click', e => {
  const b = e.target.closest('[data-shj]');
  if (!b) return;
  $('#shJob').value = b.dataset.shj;
  applyShMem(b.dataset.shj);
});
shiftDlg.querySelector('#shJob').addEventListener('change', e => applyShMem(e.target.value.trim()));

/* ===== 共有グループ（Firebase） ===== */
const FB_VER = '13.0.0';
const FB_CONFIG = {
  apiKey: 'AIzaSyC_6pfg-scXIoqwJ5g-RdCuohEzudiLitM',
  authDomain: 'gakulog-39fb5.firebaseapp.com',
  projectId: 'gakulog-39fb5',
  storageBucket: 'gakulog-39fb5.firebasestorage.app',
  messagingSenderId: '543768102440',
  appId: '1:543768102440:web:f968e065445a54de1a571d'
};
const APP_URL = 'https://akkeymorimori-sketch.github.io/jikanwari/';
const GR_KEY = 'gakulog-group-v1'; // 自分の名前（この端末だけに保存）
const grMe = () => { try { return JSON.parse(localStorage.getItem(GR_KEY))?.name || ''; } catch { return ''; } };
const setGrMe = name => localStorage.setItem(GR_KEY, JSON.stringify({ name }));

// Firebaseは使うときだけ読み込む
let fb = null, fbLoading = null;
function fbInit() {
  if (fb) return Promise.resolve(fb);
  return fbLoading ??= (async () => {
    const base = `https://www.gstatic.com/firebasejs/${FB_VER}/`;
    const [{ initializeApp }, A, F] = await Promise.all([
      import(base + 'firebase-app.js'),
      import(base + 'firebase-auth.js'),
      import(base + 'firebase-firestore.js')
    ]);
    const app = initializeApp(FB_CONFIG);
    // アプリ版でも固まらない書き方
    const auth = A.initializeAuth(app, { persistence: A.indexedDBLocalPersistence });
    await auth.authStateReady();
    if (!auth.currentUser) await A.signInAnonymously(auth);
    fb = { db: F.getFirestore(app), uid: auth.currentUser.uid, F };
    return fb;
  })().catch(err => { fbLoading = null; throw err; });
}
function fbErr(err) {
  const c = String(err?.code || '');
  if (c.includes('permission-denied')) return 'できなかった（権限がないみたい）';
  if (c.includes('operation-not-allowed') || c.includes('admin-restricted')) return 'Firebaseの「匿名」ログインがオフになってるかも';
  if (c.includes('unavailable') || c.includes('network') || err instanceof TypeError) return 'ネットにつながってないかも';
  return `うまくいかなかった（${c || err?.message || 'エラー'}）`;
}

// 画面
const groupDlg = document.createElement('dialog');
groupDlg.id = 'groupDlg';
groupDlg.innerHTML =
  '<div class="dlg">' +
  '<div class="dlgHead"><h2>共有グループ</h2><button type="button" class="x" id="gX" aria-label="閉じる">×</button></div>' +
  '<p class="hint">共有した予定だけがネット（Googleのサーバー）に上がるよ。時間割や日記、収入は今までどおりスマホの中だけ。</p>' +
  '<label>自分の名前（グループの人に見える）<input id="gMe" maxlength="20" placeholder="例：あきと"></label>' +
  '<p id="gStatus" class="hint"></p>' +
  '<ul id="gList"></ul>' +
  '<h3>グループを作る</h3>' +
  '<div class="row"><input id="gNew" maxlength="20" placeholder="例：家族" aria-label="グループの名前"><button type="button" id="gCreate">作る</button></div>' +
  '<h3>招待コードで入る</h3>' +
  '<div class="row"><input id="gJoinCode" maxlength="6" autocapitalize="characters" autocomplete="off" placeholder="6文字" aria-label="招待コード"><button type="button" id="gJoin">入る</button></div>' +
  '</div>';
document.body.append(groupDlg);

const grBtn = document.createElement('button');
grBtn.type = 'button';
grBtn.id = 'groupBtn';
grBtn.textContent = '👥 共有グループ';
$('#settingsBtn').before(grBtn);

const gSay = t => { $('#gStatus').textContent = t; };
let grGroups = [];

async function loadGroups() {
  const { db, uid, F } = await fbInit();
  const q = F.query(F.collection(db, 'groups'), F.where('members', 'array-contains', uid));
  const snap = await F.getDocs(q);
  grGroups = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ja')); grListen();
}
function renderGroups() {
  const uid = fb?.uid;
  $('#gList').innerHTML = grGroups.map(g => {
    const names = (g.members || []).map(m => (g.names?.[m] || '名前なし') + (m === uid ? '（自分）' : ''));
    return `<li class="gItem"><div><b>${esc(g.name || 'グループ')}</b> <small>${names.length}人</small></div>` +
      `<div class="gMembers">${esc(names.join('、'))}</div>` +
      `<div class="row"><button type="button" data-ginv="${g.id}">招待コードを出す</button>` +
      `<button type="button" class="danger" data-gleave="${g.id}">抜ける</button></div>` +
      `<div class="gInv" id="gInv-${g.id}" hidden></div></li>`;
  }).join('') || '<li class="muted">まだグループはないよ</li>';
}
async function refreshGroups(msg = '') {
  await loadGroups();
  renderGroups();
  gSay(msg);
}

async function openGroups() {
  $('#gMe').value = grMe();
  $('#gList').innerHTML = '';
  if (!groupDlg.open) groupDlg.showModal();
  if (!navigator.onLine) return gSay('ネットにつながってないかも');
  gSay('読み込み中…');
  try { await refreshGroups(); } catch (err) { gSay(fbErr(err)); }
}
grBtn.onclick = openGroups;
$('#gX').onclick = () => groupDlg.close();

function needMe() {
  const n = $('#gMe').value.trim();
  if (!n) { alert('先に「自分の名前」を入れてね'); $('#gMe').focus(); return ''; }
  if (ngCheck(n)) { alert('名前に使えない言葉が入ってるみたい。書き直してね'); $('#gMe').focus(); return ''; }
  setGrMe(n);
  return n;
}

// 名前を変えたら、入ってる全部のグループに反映
$('#gMe').addEventListener('change', async e => {
  const n = e.target.value.trim().slice(0, 20);
  if (n && ngCheck(n)) {
    alert('名前に使えない言葉が入ってるみたい。書き直してね');
    e.target.value = grMe();
    return;
  }
  setGrMe(n);
  if (!n || !fb || !grGroups.length) return;
  const { db, uid, F } = fb;
  try {
    await Promise.all(grGroups.map(g => F.updateDoc(F.doc(db, 'groups', g.id), { [`names.${uid}`]: n })));
    await refreshGroups('名前を変えたよ');
  } catch (err) { gSay(fbErr(err)); }
});

// グループを作る
$('#gCreate').onclick = async () => {
  const me = needMe(); if (!me) return;
  const name = $('#gNew').value.trim().slice(0, 20);
  if (!name) return alert('グループの名前を入れてね');
  if (!name) return alert('グループの名前を入れてね');
  if (ngCheck(name)) return alert('グループの名前に使えない言葉が入ってるみたい。書き直してね');
    gSay('作ってるよ…');
  gSay('作ってるよ…');
  try {
    const { db, uid, F } = await fbInit();
    await F.addDoc(F.collection(db, 'groups'), {
      name, owner: uid, members: [uid], names: { [uid]: me }, at: F.serverTimestamp()
    });
    $('#gNew').value = '';
    await refreshGroups(`「${name}」を作ったよ。「招待コードを出す」から友達に送ってね`);
  } catch (err) { gSay(fbErr(err)); }
};

// 招待コード（見間違えやすい I・O・0・1 は使わない）
const INV_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const newCode = () => Array.from(crypto.getRandomValues(new Uint8Array(6)), b => INV_CHARS[b % 32]).join('');
async function makeInvite(gid) {
  const { db, uid, F } = await fbInit();
  const exp = Date.now() + 7 * 864e5;
  for (let i = 0; i < 4; i++) {
    const code = newCode();
    try {
      await F.setDoc(F.doc(db, 'invites', code), { gid, by: uid, exp: F.Timestamp.fromMillis(exp) });
      return { code, exp };
    } catch (err) {
      // 同じコードがもうあると弾かれるので、作り直す
      if (!String(err?.code).includes('permission-denied')) throw err;
    }
  }
  throw new Error('コードが作れなかった');
}

$('#gList').addEventListener('click', async e => {
  const inv = e.target.closest('[data-ginv]');
  const sh = e.target.closest('[data-gshare]');
  const lv = e.target.closest('[data-gleave]');

  if (inv) {
    const gid = inv.dataset.ginv;
    const box = $(`#gInv-${gid}`);
    box.hidden = false;
    box.textContent = '作ってるよ…';
    try {
      const { code, exp } = await makeInvite(gid);
      const g = grGroups.find(x => x.id === gid);
      box.innerHTML = `<p class="gCode">${code}</p>` +
        `<p class="hint">${md(new Date(exp))}まで使えるよ。相手の「共有グループ」→「招待コードで入る」に入れてもらってね</p>` +
        `<button type="button" data-gshare="${code}" data-gname="${esc(g?.name || '')}">送る</button>`;
    } catch (err) { box.textContent = fbErr(err); }
    return;
  }

  if (sh) {
    const text = `がくログの共有グループ「${sh.dataset.gname}」に招待するよ。\n` +
      `「👥 共有グループ」→「招待コードで入る」にこのコードを入れてね：${sh.dataset.gshare}\n` +
      `（7日間使えるよ）\n${APP_URL}`;
    try {
      if (navigator.share) await navigator.share({ text });
      else { await navigator.clipboard.writeText(text); toast('コピーしたよ。LINEとかに貼ってね'); }
    } catch (err) {
      if (err?.name !== 'AbortError') alert(text);
    }
    return;
  }

  if (lv) {
    const g = grGroups.find(x => x.id === lv.dataset.gleave);
    if (!g || !confirm(`「${g.name}」から抜ける？\n（もう一度入るには招待コードがいるよ）`)) return;
    try {
      const { db, uid, F } = await fbInit();
      const ref = F.doc(db, 'groups', g.id);
      if (g.owner === uid) {
        // オーナーが抜けるときは、グループごと消す（予定を先に消さないと残っちゃう）
        if ((g.members || []).length > 1 &&
            !confirm(`作った人が抜けると「${g.name}」は消えて、みんなの共有予定もなくなるよ。いい？`)) return;
        const evs = await F.getDocs(F.collection(db, 'groups', g.id, 'events'));
        for (const d of evs.docs) await grWipeComments(F, db, d.ref);
        for (let i = 0; i < evs.docs.length; i += 400) {
          const b = F.writeBatch(db);
          for (const d of evs.docs.slice(i, i + 400)) b.delete(d.ref);
          await b.commit();
        }
        await F.deleteDoc(ref);
      } else await F.updateDoc(ref, { members: F.arrayRemove(uid), [`names.${uid}`]: F.deleteField() });
      await refreshGroups(`「${g.name}」から抜けたよ`);
    } catch (err) { gSay(fbErr(err)); }
  }
});

// 招待コードで入る
$('#gJoin').onclick = async () => {
  const me = needMe(); if (!me) return;
  const code = $('#gJoinCode').value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (code.length !== 6) return alert('招待コードは6文字だよ');
  const notFound = 'コードが見つからないか、期限が切れてるよ';
  gSay('確かめてるよ…');
  try {
    const { db, uid, F } = await fbInit();
    let inv;
    try { inv = await F.getDoc(F.doc(db, 'invites', code)); }
    catch (err) {
      if (String(err?.code).includes('permission-denied')) return gSay(notFound);
      throw err;
    }
    if (!inv.exists()) return gSay(notFound);
    const gid = inv.data().gid;
    if (grGroups.some(g => g.id === gid)) return gSay('もう入ってるグループだよ');
    await F.updateDoc(F.doc(db, 'groups', gid), { members: F.arrayUnion(uid), [`names.${uid}`]: me, join: code });
    $('#gJoinCode').value = '';
    await loadGroups();
    renderGroups();
    const g = grGroups.find(x => x.id === gid);
    gSay(`「${g?.name || 'グループ'}」に入ったよ`);
  } catch (err) { gSay(fbErr(err)); }
};

/* ===== 共有した予定（v61） ===== */
const GREV_KEY = 'gakulog-grev-v1';
const grEv = new Map();   // id → 共有した予定
let grNames = {};         // グループID → 名前
let grMyUid = '';
try {
  const c = JSON.parse(localStorage.getItem(GREV_KEY));
  if (c) {
    grNames = c.names || {};
    grMyUid = c.uid || '';
    for (const e of c.events || []) grEv.set(e.id, e);
  }
} catch {}
window.grShared = [...grEv.values()];

function grSaveCache() {
  window.grShared = [...grEv.values()];
  try {
    localStorage.setItem(GREV_KEY, JSON.stringify({
      uid: fb?.uid || grMyUid, names: grNames, events: window.grShared
    }));
  } catch {}
}
function findAnyEv(id) { return state.events.find(x => x.id === id) || grEv.get(id); }
function grIsMine(e) { return !e.gid || e.own === (fb?.uid || grMyUid); }
function grLabel(e) {
  return ` <span class="from">👥${esc(grNames[e.gid] || 'グループ')}${e.lock ? '🔒' : ''}${e.byName ? '・' + esc(e.byName) : ''}</span>`;
}
const grFail = err => alert(fbErr(err));

// サーバーの予定 → アプリの形
function toGrEv(gid, d) {
  const x = d.data();
  return {
    id: `g_${gid}_${d.id}`, doc: d.id, gid,
    date: String(x.date || ''),
    kind: ['job', 'exam', 'other'].includes(x.kind) ? x.kind : 'other',
    title: String(x.title || '').slice(0, 60),
    start: String(x.start || ''), end: String(x.end || ''),
    own: String(x.own || ''), by: String(x.by || ''), byName: String(x.byName || ''),
    lock: x.lock === true
  };
}

// グループごとに見張る（変わったらすぐ届く）
const grUnsub = new Map();
function grListen() {
  if (!fb) return;
  const { db, F } = fb;
  grMyUid = fb.uid;
  const ids = new Set(grGroups.map(g => g.id));
  grNames = Object.fromEntries(grGroups.map(g => [g.id, g.name || 'グループ']));
  for (const [gid, un] of grUnsub) if (!ids.has(gid)) { un(); grUnsub.delete(gid); }
  for (const e of [...grEv.values()]) if (!ids.has(e.gid)) grEv.delete(e.id);
  const from = ymd(addDays(new Date(), -60));
  for (const gid of ids) {
    if (grUnsub.has(gid)) continue;
    const q = F.query(F.collection(db, 'groups', gid, 'events'), F.where('date', '>=', from));
    grUnsub.set(gid, F.onSnapshot(q, snap => {
      for (const ch of snap.docChanges()) {
        const id = `g_${gid}_${ch.doc.id}`;
        if (ch.type === 'removed') grEv.delete(id);
        else grEv.set(id, toGrEv(gid, ch.doc));
      }
      grSaveCache(); grRedraw();
    }, err => console.warn('共有した予定', err)));
  }
  grSaveCache(); grRedraw();
}

let grTimer = 0;
function grRedraw() {
  clearTimeout(grTimer);
  grTimer = setTimeout(() => {
    if (evEditId && !findAnyEv(evEditId)) endEvEdit();
    renderShareSel();
    renderAll();
    scheduleNotify();
  }, 300);
}

// 書き込み
function grData(v) {
  return {
    date: v.date, kind: v.kind, title: v.title || '', start: v.start || '', end: v.end || '',
    // lockSet：編集の保存で決めたロック（送る前に編集が終わってチェックが外れるので、先に読んで渡す）
    lock: typeof v.lockSet === 'boolean' ? v.lockSet
      : (evEditId || !v.doc) ? $('#evLock')?.checked === true : v.lock === true,
    by: fb.uid, byName: grMe(), at: fb.F.serverTimestamp()
  };
}
async function grAdd(gid, v) {
  const { db, F } = await fbInit();
  return F.addDoc(F.collection(db, 'groups', gid, 'events'), { ...grData(v), own: fb.uid });
}
async function grUpdate(e, v) {
  const { db, F } = await fbInit();
  return F.updateDoc(F.doc(db, 'groups', e.gid, 'events', e.doc), grData({ ...e, ...v }));
}
async function grDelete(e) {
  const { db, F } = await fbInit();
  const ref = F.doc(db, 'groups', e.gid, 'events', e.doc);
  await F.deleteDoc(ref);
  try { await grWipeComments(F, db, ref); } catch (err) { console.warn('comments', err); }
}
// 予定の下のコメントをまとめて消す
async function grWipeComments(F, db, ref) {
  const cs = await F.getDocs(F.collection(ref, 'comments'));
  for (let i = 0; i < cs.docs.length; i += 400) {
    const b = F.writeBatch(db);
    for (const d of cs.docs.slice(i, i + 400)) b.delete(d.ref);
    await b.commit();
  }
}

// 予定の入力欄に「共有」
const evShareRow = document.createElement('label');
evShareRow.id = 'evShareRow';
evShareRow.innerHTML = '共有<select id="evShare"></select>';
($('#evEnd').closest('.row') || $('#evEnd')).after(evShareRow);
function renderShareSel() {
  const sel = $('#evShare'), v = sel.value;
  sel.innerHTML = '<option value="">しない（自分だけ）</option>' +
    Object.entries(grNames).map(([id, n]) => `<option value="${id}">👥 ${esc(n)}</option>`).join('');
  sel.value = grNames[v] ? v : '';
  evShareRow.hidden = !Object.keys(grNames).length; syncLockUI();

}
const evForm = () => ({
  kind: $('#evKind').value, title: $('#evTitle').value.trim(),
  start: $('#evStart').value, end: $('#evEnd').value
});

// 追加
const evAddLocal = $('#evAdd').onclick;
$('#evAdd').onclick = () => {
  const gid = featOn('group') ? $('#evShare').value : ''; // 共有グループがオフなら送らない
  if (!gid) return evAddLocal();
  if (!grMe()) return alert('先に「👥 共有グループ」で自分の名前を入れてね');
  const v = evForm();
  if (ngCheck(v.title)) return alert('タイトルに使えない言葉が入ってるみたい。書き直してね');
  let dates;
  if (calMulti) {
    dates = [...calPicks].sort();
    if (!dates.length) return alert('カレンダーで日付を選んでね');
  } else {
    const n = $('#evWeekly').checked ? 4 : 1;
    dates = Array.from({ length: n }, (_, k) => ymd(addDays(parseYmd(calSel), 7 * k)));
  }
  for (const date of dates) grAdd(gid, { ...v, date }).catch(grFail);
  rememberPreset(v);
  $('#evTitle').value = '';
  $('#evMemo').value = '';
  $('#evWeekly').checked = false;
  calMulti = false; calPicks.clear();
  renderEvSuggest(); renderCal(); renderDay();
  renderPicks(`「${grNames[gid]}」に${dates.length > 1 ? dates.length + '日' : ''}共有したよ`);
};

// 「変更を保存」：種類・名前・時刻・日付・メモ・共有をまとめて保存する
// 自分だけの予定は「変更する範囲」の全部に同じ変更をして、日付は同じ日数ずらす（取り込んだ予定の日付はそのまま）
function saveEvEdit() {
  const e = findAnyEv(evEditId);
  if (!e) return endEvEdit();
  if (grLocked(e)) return alert(grLockMsg(e));
  const gid = featOn('group') ? $('#evShare')?.value || '' : '';
  const v = evForm();
  if (gid && ngCheck(v.title)) return alert('タイトルに使えない言葉が入ってるみたい。書き直してね');
  const memo = $('#evMemo').value.trim().slice(0, 2000);
  const lockSet = $('#evLock')?.checked === true;
  const to = $('#evDate').value;
  const delta = isYmd(to) ? evDayDiff(e.date, to) : 0;
  const moveDate = x => delta && x.src !== 'cal' ? ymd(addDays(parseYmd(x.date), delta)) : x.date;
  let msg = '予定を変更したよ', n = 1;

  if (!e.gid) {
    const ts = evTargets($('#evScope').value);
    if (!ts.length) return endEvEdit();
    if (gid && !grMe()) return alert('先に「👥 共有グループ」で自分の名前を入れてね');
    n = ts.length;
    const skip = delta ? ts.filter(x => x.src === 'cal').length : 0;
    const cidv = examCidOf(v.kind);
    // 「種類・名前が同じ」は時間がそれぞれ違うので、変えた所（種類・名前・時刻・メモ）だけを全部に入れる
    const byName = $('#evScope').value === 'name';
    const diff = byName ? Object.fromEntries(Object.entries(v).filter(([key, val]) => e[key] !== val)) : v;
    const memoChanged = !byName || (e.memo || '') !== memo;
    const apply = () => {
      for (const x of ts) {
        Object.assign(x, diff, { date: moveDate(x) });
        if (memoChanged) { if (memo) x.memo = memo; else delete x.memo; }
        if (cidv) { delete x.cid; Object.assign(x, cidv); }
        if (x.kind !== 'exam') delete x.cid;
      }
    };
    if (gid) {
      // 自分だけの予定 → グループに共有
      apply();
      for (const x of ts) grAdd(gid, { ...x, lockSet }).catch(grFail);
      const ids = new Set(ts.map(x => x.id));
      state.events = state.events.filter(x => !ids.has(x.id));
      save();
      msg = `${n > 1 ? n + '件を' : ''}「${grNames[gid]}」に共有したよ`;
    } else {
      msg = (!delta ? (n > 1 ? `${n}件まとめて変更したよ` : msg)
        : n > 1 ? `${n}件を${Math.abs(delta)}日${delta > 0 ? '後ろ' : '前'}にずらして保存したよ`
        : `${md(parseYmd(moveDate(e)))}に移動して保存したよ`) +
        (skip ? `（取り込んだ予定${skip}件の日付はそのまま）` : '');
      // 自分だけの予定のままなら「元に戻す」できる（保存と描き直しも withUndo がやる）
      const date = moveDate(e);
      withUndo(msg, apply);
      rememberPreset(v);
      endEvEdit();
      afterSave(date);
      return;
    }
  } else if (gid === e.gid) {
    grUpdate(e, { ...v, date: moveDate(e), lockSet }).catch(grFail);
    if (delta) msg = `${md(parseYmd(moveDate(e)))}に移動して保存したよ`;
  } else if (!gid) {
    // 共有をやめて自分だけに
    if (!confirm('グループから外して、自分だけの予定にする？\n（グループの人の画面からは消えるよ）')) return;
    state.events.push({ id: uid(), date: moveDate(e), ...v, ...(memo && { memo }) });
    save();
    grDelete(e).catch(grFail);
  } else {
    // 別のグループへ
    grAdd(gid, { ...e, ...v, date: moveDate(e), lockSet }).then(() => grDelete(e)).catch(grFail);
    msg = `「${grNames[gid]}」に移したよ`;
  }
  const date = moveDate(e);
  rememberPreset(v);
  endEvEdit();
  afterSave(date);
  toast(msg);

  // 移した日をカレンダーで選んで描き直す
  function afterSave(d) {
    if (delta) {
      calSel = d;
      const sd = parseYmd(d);
      calMonth = new Date(sd.getFullYear(), sd.getMonth(), 1);
    }
    renderEvSuggest(); renderAll(); renderCal(); renderDay();
  }
}

// 「削除」：自分だけの予定は「変更する範囲」の全部、共有した予定はその1件
const grDelAsk = e => confirm(`「${grNames[e.gid] || 'グループ'}」の予定を消す？\nグループの全員の画面から消えるよ`);
function delEvEdit() {
  const e = findAnyEv(evEditId);
  if (!e) return endEvEdit();
  if (grLocked(e)) return alert(grLockMsg(e));
  if (e.gid) {
    if (!grDelAsk(e)) return;
    grDelete(e).catch(grFail);
    return endEvEdit();
  }
  const ts = evTargets($('#evScope').value);
  if (!ts.length) return endEvEdit();
  if (!confirm(ts.length > 1 ? `${ts.length}件の予定をまとめて消す？` : 'この予定を消す？')) return;
  const ids = new Set(ts.map(x => x.id));
  state.events = state.events.filter(x => !ids.has(x.id));
  save(); renderCal();
  endEvEdit();
  if (ts.length > 1) renderPicks(`${ts.length}件消したよ`);
}
$('#evSave').onclick = saveEvEdit;
$('#evDel').onclick = delEvEdit;
$('#dayList').addEventListener('click', ev => {
  const b = ev.target.closest('[data-evdel]');
  const e = b && grEv.get(b.dataset.evdel);
  if (!e) return;
  ev.stopImmediatePropagation();
  if (!grDelAsk(e)) return;
  if (e.id === evEditId) endEvEdit();
  grDelete(e).catch(grFail);
}, true);

renderShareSel();
// グループに入ってる人は、起動したら見張りを始める（共有グループをオフにしてたらつながない）
if (grMe()) setTimeout(() => {
  if (navigator.onLine && featOn('group')) loadGroups().catch(err => console.warn('共有グループ', err));
}, 2000);

/* ===== 共有した予定：動かす・ロック（v63） ===== */
function grLocked(e) { return !!e?.gid && e.lock === true && !grIsMine(e); }
function grLockMsg(e) {
  const n = grGroups.find(g => g.id === e.gid)?.names?.[e.own];
  return `🔒 ${n ? n + 'さん' : '作った人'}がロックしてる予定だよ。\n変えたり消したりできるのは作った人だけ`;
}

// 日付だけ変える（ほかの人の変更を上書きしない）
async function grPatch(e, patch) {
  const { db, F } = await fbInit();
  return F.updateDoc(F.doc(db, 'groups', e.gid, 'events', e.doc),
    { ...patch, by: fb.uid, byName: grMe(), at: F.serverTimestamp() });
}
function grMove(e, to) {
  const from = e.date;
  calSel = to;
  grPatch(e, { date: to }).catch(grFail);
  toast(`${md(parseYmd(to))}に移動したよ`, () => grPatch(e, { date: from }).catch(grFail));
}

// 「🔒 ロックする」の欄
const evLockRow = document.createElement('label');
evLockRow.id = 'evLockRow';
evLockRow.innerHTML = '<input type="checkbox" id="evLock"> 🔒 ロックする（ほかの人は変更・削除できない）';
evShareRow.after(evLockRow);
function syncLockUI() {
  const row = $('#evLockRow');
  if (!row) return;
  const e = evEditId ? findAnyEv(evEditId) : null;
  row.hidden = $('#evShareRow').hidden || !$('#evShare').value;
  $('#evLock').disabled = !!e?.gid && !grIsMine(e);
}
$('#evShare').addEventListener('change', syncLockUI);
syncLockUI();

// ロックされてたら止める：一覧の「×」（保存・削除ボタンは saveEvEdit / delEvEdit で見てる）
document.addEventListener('click', ev => {
  const b = ev.target.closest?.('#dayList [data-evdel]');
  const e = b && grEv.get(b.dataset.evdel);
  if (!grLocked(e)) return;
  ev.stopPropagation(); ev.preventDefault();
  alert(grLockMsg(e));
}, true);

/* ===== 起動 ===== */
/* ===== 時間割タブの画像読み込み ===== */
const gridBar = document.createElement('div');
gridBar.id = 'gridBar';
gridBar.className = 'gridBar';
// 3つ並べても1段に収まるように、ボタンの文字は短く（読み上げ用には長い名前）
gridBar.innerHTML = '<button type="button" id="gridImport" aria-label="画像から時間割を読み込む">📷 画像から</button>' +
  '<button type="button" id="gridTerm" aria-label="学期・休み・振替">🗓 学期・休み</button>' +
  '<button type="button" id="gridShare" aria-label="時間割を共有">🔗 共有</button>';
$('#grid').before(gridBar);
$('#gridImport').onclick = () => startPhoto('grid');
$('#gridTerm').onclick = () => openTermDlg();
// 共有コード・QR・友達の時間割・空きコマ（学期の画面の「時間割を共有」を開く）
$('#gridShare').onclick = () => openTermDlg('shareSec');
function syncGridBar() {
  const bar = document.getElementById('gridBar');
  if (bar) bar.hidden = false;
}

/* ===== ＋ボタン ===== */
const fab = document.createElement('div');
fab.id = 'fab';
fab.innerHTML =
  '<div id="fabMenu" hidden>' +
  '<button type="button" data-fab="photo" class="fabPhoto">📷 写真から追加</button>' +
  '<button type="button" data-fab="task">📝 課題</button>' +
  '<button type="button" data-fab="other">📅 予定</button>' +
  '<button type="button" data-fab="job">💼 バイト</button>' +
  '<button type="button" data-fab="note">🗒 メモ</button>' +
  '<button type="button" data-fab="course">📚 授業</button>' +
  '</div>' +
  '<button type="button" id="fabBtn" class="primary" aria-label="追加">＋</button>';
document.body.append(fab);

function closeFab() {
  $('#fabMenu').hidden = true;
  $('#fabBtn').classList.remove('open');
}
$('#fabBtn').onclick = () => {
  const m = $('#fabMenu');
  m.hidden = !m.hidden;
  $('#fabBtn').classList.toggle('open', !m.hidden);
};
document.addEventListener('click', e => {
  if (!$('#fabMenu').hidden && !e.target.closest('#fab')) closeFab();
});
function goField(head, input) {
  setTimeout(() => {
    $(head)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    $(input)?.focus({ preventScroll: true });
  }, 60);
}
$('#fabMenu').addEventListener('click', e => {
  const k = e.target.closest('[data-fab]')?.dataset.fab;
  if (!k) return;
  closeFab();
  if (k === 'photo') return openPhoto('pick');
  if (k === 'task') {
    showTab('cal');
    goField('#ctHead', '#ctTitle');
  } else if (k === 'other' || k === 'job') {
    showTab('cal');
    $('#evKind').value = k;
    $('#evKind').dispatchEvent(new Event('change'));
    goField('#evHead', '#evTitle');
  } else if (k === 'note') {
    showTab('today');
    goField('#noteCard', '#noteInput');
  } else if (k === 'course') {
    showTab('grid');
    toast('空いてるマスをタップすると授業を追加できるよ');
  }
});

/* ===== 時間割を使わないモード ===== */
// 設定の時限まわりと、その他の「時間割」「学期」に印をつけておく（隠すのはCSS）
for (const el of [
  $('#importBtn')?.closest('.menu'), $('#termBtn')?.closest('.menu'),
  $('#sPeriods')?.closest('.row'), $('#sPeriods')?.closest('.row')?.previousElementSibling,
  $('#sShift')?.closest('label'), $('#sShift')?.closest('label')?.previousElementSibling, $('#sTimes'),
  $('#sSyllabus'), $('#sSyllabus')?.previousElementSibling, $('#sSyllabus')?.nextElementSibling
]) el?.classList.add('gridOnly');

$('#sUseGrid').onchange = e => { tmp.useGrid = e.target.checked; };

function applyMode() {
  const off = !state.useGrid;
  document.documentElement.classList.toggle('noGrid', off);
  // オフの機能は <html> に off-xxx を付けて、CSS で隠す（データはそのまま）
  for (const k of FEAT_KEYS) document.documentElement.classList.toggle('off-' + k, !featOn(k));
  syncJobOption();
  if (off && curTab === 'grid') showTab('today');
}

/* ===== 試験 ===== */
// 種類の並び：バイト → 試験 → その他
{
  const sel = $('#evKind');
  const ex = sel.querySelector('option[value="exam"]') || new Option('試験', 'exam');
  const other = sel.querySelector('option[value="other"]');
  other ? sel.insertBefore(ex, other) : sel.add(ex);
  const job = sel.querySelector('option[value="job"]');
  if (job) sel.insertBefore(job, sel.firstChild);
}
// カレンダーの凡例に「試験」（「その他」の見た目をまねて、その前に入れる）
{
  const lg = document.querySelector('.calLegend');
  const sw = lg?.querySelector('.other');
  if (sw && !lg.querySelector('.exam')) {
    const item = sw.textContent.trim() ? sw : sw.parentElement;
    const cp = item.cloneNode(true);
    const csw = cp.classList.contains('other') ? cp : cp.querySelector('.other');
    csw.classList.replace('other', 'exam');
    const tn = [...cp.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
    if (tn) tn.textContent = '試験'; else csw.textContent = '試験';
    item.before(cp);
  }
}

// ホームに出す「試験まであと◯日」（30日以内・最大3件）
// 試験前モード：この日数より近い試験は、その授業のノート・写真をすぐ見返せるようにする
const EXAM_PREP_DAYS = 7;

// 試験がどの授業のものか。選んであればそれ（'none' はつながない）、なければ名前に授業名・略名が入ってる授業（いちばん長く一致したもの）
function examCourse(e) {
  if (e.cid === 'none') return null;
  if (e.cid) return findCourse(e.cid) || null;
  const title = e.title || '';
  let best = null, len = 0;
  for (const c of courses()) for (const n of [c.name, c.short]) {
    const s = (n || '').trim();
    if (s.length > len && title.includes(s)) { best = c; len = s.length; }
  }
  return best;
}

// 試験の終わり：終わりの時刻、なければ始まりの90分後、時刻もなければその日の終わり
function examOver(e, now) {
  if (e.date !== ymd(now)) return e.date < ymd(now);
  const m = toMin(e.end) ?? (toMin(e.start) != null ? toMin(e.start) + 90 : null);
  return m != null && now.getHours() * 60 + now.getMinutes() >= m;
}

function examLine(now) {
  const today = ymd(now), lim = ymd(addDays(now, 30));
  const xs = state.events
    .filter(e => e.kind === 'exam' && e.date >= today && e.date <= lim && !examOver(e, now))
    .sort((a, b) => a.date.localeCompare(b.date) || (a.start || '99').localeCompare(b.start || '99'));
  if (!xs.length) return '';
  const prep = featOn('exam') && state.useGrid;
  return xs.slice(0, 3).map(e => {
    const n = evDayDiff(today, e.date);
    const when = n === 0 ? '今日' : n === 1 ? '明日' : `あと${n}日`;
    return `<div class="examLine"><p>📝 <b>${when}</b> ${esc(e.title || '試験')}` +
      ` <small>${md(parseYmd(e.date))}${e.start ? ' ' + esc(e.start) : ''}</small></p>` +
      (prep && n < EXAM_PREP_DAYS ? examActs(e) : '') + '</div>';
  }).join('') + (xs.length > 3 ? `<p class="hint">ほかに試験${xs.length - 3}件</p>` : '');
}

// 試験前の見返しボタン（授業がわからなければ「授業とつなぐ」）
function examActs(e) {
  if (e.cid === 'none') return ''; // 「つながない」を選んだ試験は何も出さない
  const c = examCourse(e);
  if (!c) return `<div class="examActs"><button type="button" data-exlink="${esc(e.id)}">🔗 授業とつなぐ</button></div>`;
  const ns = c.notes || [], pics = ns.reduce((n, x) => n + (x.pics?.length || 0), 0);
  return `<div class="examActs">` +
    `<button type="button" data-exnotes="${esc(c.id)}">📒 ノート ${ns.length}件</button>` +
    (pics ? `<button type="button" data-expics="${esc(c.id)}">🖼 写真 ${pics}枚</button>` : '') + '</div>';
}

/* ===== 明日の予定（日記の下） ===== */
// 一言日記とは別のカードにして、「今日に出すもの」で別々に選べるようにする
const tmrBox = document.createElement('section');
tmrBox.id = 'tmrBox';
tmrBox.className = 'card';
$('#noteCard').after(tmrBox);

function renderTomorrow() {
  const tm = addDays(new Date(), 1), k = ymd(tm), t = term();
  const rows = [];
  for (const { c, x } of tasksDue(k)) if (!x.done) rows.push({
    min: -4, time: '締切', cls: 'f-task',
    label: esc(x.title) + ` <small>${esc(nm(c))}</small>`
  });
  const at = new Set(attendOn(tm, t));
  const off = state.useGrid && inTerm(tm, t) ? offInfo(tm, t) : null;
  if (off) rows.push({ min: -3, time: '', cls: 'f-cls', label: `授業なし${off.note ? `（${esc(off.note)}）` : ''}` });
  else if (state.useGrid) for (const c of coursesOn(tm, t)) {
    const o = occurrence(c, tm);
    rows.push({
      min: o ? o.start.getHours() * 60 + o.start.getMinutes() : 2000 + c.period,
      time: o ? hm(o.start) : `${c.period}限`, id: c.id, cls: 'f-cls',
          label: `${c.period}限 ${esc(nm(c))}` + (at.has(c) ? '' : ' <span class="odTag">オンデマ</span>') +
            (c.room ? ` <small>${esc(c.room)}</small>` : '')
    });
  }
  for (const c of intensiveOn(k)) rows.push({ min: -2, time: '集中', id: c.id, cls: 'f-cls f-int', label: esc(nm(c)) });
  for (const e of eventsOn(k)) {
    const s = toMin(e.start), en = toMin(e.end);
    const end = e.end ? `〜${en != null && s != null && en <= s ? '翌' : ''}${e.end}` : '';
    rows.push({
      min: s ?? -1, time: e.start || '', cls: `f-${e.kind}`,
      label: esc(e.title || EV_LABEL[e.kind]) + (end ? ` <small>${esc(end)}</small>` : '')
    });
  }
  rows.sort((a, b) => a.min - b.min);
  tmrBox.innerHTML = `<h3 class="flowH">明日の予定 <small>${md(tm)}</small></h3>` +
    (rows.length
      ? '<ul class="flow">' + rows.map(r =>
          `<li class="${r.cls}"${r.id ? ` data-id="${r.id}"` : ''}>` +
          `<span class="ft">${esc(r.time)}</span><span class="fl">${r.label}</span></li>`).join('') + '</ul>'
      : '<p class="muted">明日の予定はまだないよ</p>');
}
tmrBox.addEventListener('click', e => {
  const li = e.target.closest('li[data-id]');
  if (li) openCourse(li.dataset.id);
});

// 保存データがない＝初めて開いた人。あとで「使う機能」を聞く（前から使ってる人には聞かない）
const firstRun = localStorage.getItem(KEY) == null && localStorage.getItem(OLD_KEY) == null;
state = normalize(readJSON(KEY) || fromV1(readJSON(OLD_KEY)));
if (firstRun) state.onboarded = false;
applyTheme(state.theme);
recomputeUntil();
prune();
save();
renderAll();
if (brokenSaved) alert('保存データが壊れてて読めなかった。中身は消さずに別名で残してあるよ');
navigator.storage?.persist?.().catch(() => {});

// ダイアログが開いてるときと、タップした直後は自動更新しない
let lastTouch = 0;
document.addEventListener('pointerdown', () => { lastTouch = Date.now(); }, true);
function tick() {
  if (document.querySelector('dialog[open]')) return;
  if (Date.now() - lastTouch < 3000) return;
  prune();
  renderAll();
}
setInterval(tick, 30000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });

/* ===== オフライン対応 ===== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

/* ===== 壁紙 ===== */
const WALLS = [
  ['none', 'なし'], ['photo', '写真'], ['dots', 'ドット'], ['gingham', 'ギンガム'], ['stripe', 'ストライプ']
];
const wallBg = document.createElement('div');
wallBg.id = 'wallBg';
document.body.prepend(wallBg);
let wallUrl = '';

function wallState() {
  const w = state.wall && typeof state.wall === 'object' ? state.wall : {};
  if (!WALLS.some(([k]) => k === w.type)) w.type = 'none';
  const d = Math.round(+w.dim);
  w.dim = Number.isFinite(d) ? Math.min(80, Math.max(0, d)) : 30;
  return state.wall = w;
}

// 保存してある写真を読む（なければ空）
async function wallLoad() {
  if (wallUrl) return wallUrl;
  try {
    const b = await imgGet('wall');
    if (b) wallUrl = URL.createObjectURL(b);
  } catch {}
  return wallUrl;
}

async function applyWall() {
  const w = wallState();
  wallBg.className = w.type === 'none' ? '' : 'wp-' + w.type;
  wallBg.style.setProperty('--wdim', w.dim / 100);
  wallBg.style.backgroundImage = '';
  if (w.type === 'photo') {
    const u = await wallLoad();
    if (u) wallBg.style.backgroundImage = `url("${u}")`;
  }
  document.documentElement.classList.toggle('hasWall', w.type !== 'none');
}

// 大きい写真は縮めて保存（長いほうを1600pxまで）
async function wallShrink(file, max = 1600) {
  const bmp = await createImageBitmap(file);
  const r = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const cv = document.createElement('canvas');
  cv.width = Math.round(bmp.width * r);
  cv.height = Math.round(bmp.height * r);
  cv.getContext('2d').drawImage(bmp, 0, 0, cv.width, cv.height);
  bmp.close?.();
  return new Promise((ok, ng) => cv.toBlob(b => b ? ok(b) : ng(new Error('blob')), 'image/jpeg', 0.85));
}

const wallDlg = document.createElement('dialog');
wallDlg.id = 'wallDlg';
wallDlg.innerHTML =
  '<div class="dlg">' +
  '<div class="dlgHead"><h2>🖼 壁紙</h2><button type="button" class="x big" data-wclose aria-label="閉じる">×</button></div>' +
  '<div class="wallTiles">' + WALLS.map(([k, n]) =>
    `<button type="button" class="wallTile" data-wall="${k}"><i class="wp-${k}"></i><span>${n}</span></button>`).join('') +
  '</div>' +
  '<label class="fileBtn" id="wallPick"><span id="wallPickT">📷 写真を選ぶ</span>' +
  '<input type="file" accept="image/*" class="vh" id="wallFile"></label>' +
  '<label class="wallDim">背景の薄さ<input type="range" id="wallDim" min="0" max="80" step="5"><b id="wallDimV"></b></label>' +
  '<p class="hint">選ぶとすぐに変わるよ。写真はこの端末の中だけに保存されて、バックアップの書き出しには入らない</p>' +
  '</div>';
document.body.append(wallDlg);

function renderWall() {
  const w = wallState();
  for (const b of wallDlg.querySelectorAll('[data-wall]')) b.classList.toggle('on', b.dataset.wall === w.type);
  wallDlg.querySelector('i.wp-photo').style.backgroundImage = wallUrl ? `url("${wallUrl}")` : '';
  $('#wallPickT').textContent = wallUrl ? '📷 写真を変える' : '📷 写真を選ぶ';
  $('#wallDim').value = w.dim;
  $('#wallDimV').textContent = w.dim + '%';
}

async function openWall() {
  await wallLoad();
  renderWall();
  wallDlg.showModal();
}

wallDlg.addEventListener('click', async e => {
  if (e.target.closest('[data-wclose]')) return wallDlg.close();
  const k = e.target.closest('[data-wall]')?.dataset.wall;
  if (!k) return;
  // 写真がまだなければ、そのまま選ぶ画面へ
  if (k === 'photo' && !wallUrl) return $('#wallFile').click();
  state.wall.type = k;
  save();
  await applyWall();
  renderWall();
});

$('#wallFile').onchange = async e => {
  const f = e.target.files[0];
  e.target.value = '';
  if (!f) return;
  try {
    const b = await wallShrink(f);
    await imgPut('wall', b);
    if (wallUrl) URL.revokeObjectURL(wallUrl);
    wallUrl = URL.createObjectURL(b);
    state.wall.type = 'photo';
    save();
    await applyWall();
    renderWall();
  } catch {
    alert('写真を読み込めなかった。別の写真で試してみて');
  }
};

$('#wallDim').oninput = e => {
  state.wall.dim = +e.target.value;
  $('#wallDimV').textContent = e.target.value + '%';
  wallBg.style.setProperty('--wdim', state.wall.dim / 100);
};
$('#wallDim').onchange = () => save();

// その他タブのボタン（共有グループの下）
{
  const b = document.createElement('button');
  b.type = 'button';
  b.id = 'wallBtn';
  b.innerHTML = '🖼 壁紙<small>写真やかわいい柄を背景にする</small>';
  b.onclick = openWall;
  const gb = $('#groupBtn');
  if (gb) gb.after(b); else $('#termBtn')?.closest('.menu')?.append(b);
}

applyWall();

/* ===== 整理：その他タブ ===== */
{
  const put = (id, html, before) => {
    const b = $('#' + id);
    if (!b || !$(before)) return;
    b.innerHTML = html;
    $(before).before(b);
  };
  put('groupBtn', '<b>👥 共有グループ</b><small>家族やサークルと予定を共有する</small>', '#shareBtn');
  put('wallBtn', '<b>🖼 壁紙</b><small>写真やかわいい柄を背景にする</small>', '#lookBtn');
  put('helpBtn', '<b>🔍 機能をさがす</b><small>やりたいことから、どこにあるか探す</small>', '#feedbackBtn');
}

/* ===== 整理：設定を開いたり閉じたり ===== */
// 後からJSで足した欄を、それぞれの項目の中へ
function placeSecs() {
  const mv = (sel, to) => {
    const el = $('#settingsDlg ' + sel), box = $(to);
    if (el && box && el.parentElement !== box) box.append(el);
  };
  mv('.leadBox', '#setUse');
  mv('.nBox', '#setNotify');
  mv('.wgBox', '#setNotify');
  mv('.csBox', '#setCal');
  mv('.icsBox', '#setCal');
  $('#setNotify').hidden = !$('#setNotify .nBox, #setNotify .wgBox');
  $('#setCal').hidden = !$('#setCal .csBox, #setCal .icsBox');
}

// 閉じてても今の状態がわかるように
function setSums() {
  const put = (id, t) => {
    const el = $(`#${id} > summary small`);
    if (el) el.textContent = t;
  };
  const opt = id => $(id)?.selectedOptions[0]?.textContent.trim() || '';
  const fOn = [$('#sUseGrid'), ...document.querySelectorAll('#setFeat [data-feat]')].filter(c => c.checked).length;
  put('setFeat', `${fOn}/${FEAT_KEYS.length + 1} オン`);
  put('setUse', `週のはじまり ${opt('#sWeekStart')}`);
  put('setGrid', `${$('#sPeriods').value}限まで・土曜${$('#sSat').checked ? 'あり' : 'なし'}`);
  put('setLook', `${opt('#sColor')}・${opt('#sFont')}`);
  if ($('#nOn')) {
    const job = $('#nJob')?.value !== '0' ? `・バイト${opt('#nJob')}` : '';
    put('setNotify', $('#nOn').checked ? `前の日 ${$('#nTime').value}${job}` : 'オフ');
  }
  const n = state.calSync?.cals?.length || 0;
  put('setCal', n ? `取り込み ${n}件` : '');
  const pv = PROVIDERS[$('#sProvider').value];
  put('aiBox', `${pv ? pv.label.split('（')[0] : ''}・${$('#sKey').value.trim() ? 'キーあり' : 'キーなし'}`);
  put('setSyl', $('#sSyllabus').value.trim() ? '設定済み' : '未設定');
  const d = state.lastExport ? new Date(state.lastExport) : null;
  put('setData', d && !isNaN(d) ? `最後の書き出し ${md(d)}` : 'まだ書き出してない');
}

// 開いた直後に呼ぶ。target を渡すとその項目を開く
function setPrep(target) {
  placeSecs();
  const el = target ? $(target) : null;
  const sec = el?.closest('details.set') || null;
  for (const x of $('#settingsDlg').querySelectorAll('details.set')) x.open = x === sec;
  if (el?.tagName === 'DETAILS') el.open = true;
  setSums();
  if (el && el !== sec) requestAnimationFrame(() => el.scrollIntoView({ block: 'center', behavior: 'smooth' }));
}

// 1つ開いたら、ほかは閉じる
$('#settingsDlg').addEventListener('toggle', e => {
  const d = e.target;
  if (!d.classList?.contains('set') || !d.open) return;
  for (const x of $('#settingsDlg').querySelectorAll('details.set')) if (x !== d) x.open = false;
  requestAnimationFrame(() => d.querySelector('summary').scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
}, true);
$('#settingsDlg').addEventListener('input', setSums);
$('#settingsDlg').addEventListener('change', setSums);

$('#settingsBtn').onclick = () => { openSettings(); setPrep(); };
$('#lookBtn').onclick = () => { openSettings(); setPrep('#sColor'); };
placeSecs();

// 「機能をさがす」から飛んだとき、その項目を開く
if (typeof FEATURES !== 'undefined') {
  const SET_GO = {
    taskLead: '#sLeadU', backup: '#exportBtn', ics: '#icsBtn', notify: '#nOn', calSync: '#csList',
    theme: '#sColor', icon: '#iconBox', times: '#sTimes', sat: '#sSat', useGrid: '#sUseGrid'
  };
  const WHERE = {
    taskLead: '設定 → 使い方', backup: '設定 → バックアップ', ics: '設定 → カレンダー連携',
    notify: '設定 → 通知', calSync: '設定 → カレンダー連携', theme: 'その他 → 見た目',
    icon: 'その他 → 見た目', times: '設定 → 授業と時限', sat: '設定 → 授業と時限',
    useGrid: '設定 → 機能', ai: '設定 → AI', income: 'その他 → お金', share: 'その他 → だれかと使う'
  };
  for (const f of FEATURES) {
    if (WHERE[f.id]) f.where = WHERE[f.id];
    const sel = SET_GO[f.id];
    if (!sel) continue;
    const go = f.go;
    f.go = () => { go(); setPrep(sel); };
  }
  if (!FEATURES.some(f => f.id === 'group')) FEATURES.push({
    id: 'group', name: '共有グループ', where: 'その他 → だれかと使う',
    desc: '家族やサークルと予定を共有する。招待コードで入れて、ロックもかけられる',
    kw: '共有 グループ 家族 招待 コード ロック 一緒', go: () => $('#groupBtn').click()
  });
  if (!FEATURES.some(f => f.id === 'wall')) FEATURES.push({
    id: 'wall', name: '壁紙', where: 'その他 → 見た目',
    desc: '写真やドット・ギンガム・ストライプを背景にする。薄さも変えられる',
    kw: '壁紙 背景 写真 柄 かわいい', go: () => openWall()
  });
}

/* ===== 壁紙：カードの濃さ ===== */
function cardLevel() {
  const v = Math.round(+state.wall?.card);
  return Number.isFinite(v) ? Math.min(95, Math.max(20, v)) : 60;
}
function applyCard() {
  document.documentElement.style.setProperty('--cardA', cardLevel() + '%');
}
{
  const lb = document.createElement('label');
  lb.className = 'wallDim';
  lb.innerHTML = 'カードの濃さ<input type="range" id="wallCard" min="20" max="95" step="5"><b id="wallCardV"></b>';
  wallDlg.querySelector('.wallDim').after(lb);

  $('#wallCard').oninput = e => {
    wallState();
    state.wall.card = +e.target.value;
    $('#wallCardV').textContent = e.target.value + '%';
    applyCard();
  };
  $('#wallCard').onchange = () => save();

  // 壁紙の画面を開いたときに、スライダーも今の値にする
  const renderWall0 = renderWall;
  renderWall = function () {
    renderWall0();
    $('#wallCard').value = cardLevel();
    $('#wallCardV').textContent = cardLevel() + '%';
  };
}
applyCard();

/* ===== カードと文字の色 ===== */
const HEX6 = /^#[0-9a-f]{6}$/i;
const CARD_COLORS = [
  ['', '自動'], ['#ffffff', '白'], ['#1d1f24', '黒'], ['#ffe3ec', 'ピンク'],
  ['#e3efff', '水色'], ['#e3f7ea', 'ミント'], ['#efe7ff', 'ラベンダー'], ['#fff6db', 'クリーム']
];
const TEXT_COLORS = [
  ['', '自動'], ['#222222', '黒'], ['#ffffff', '白'], ['#5a3a2e', 'こげ茶'], ['#1f3a68', '紺']
];

function toHex6(s) {
  s = String(s || '').trim();
  if (/^#[0-9a-f]{3}$/i.test(s)) s = '#' + [...s.slice(1)].map(c => c + c).join('');
  return HEX6.test(s) ? s : '#ffffff';
}
function hexLum(h) {
  const n = parseInt(h.slice(1), 16);
  const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
  return .2126 * f(n >> 16 & 255) + .7152 * f(n >> 8 & 255) + .0722 * f(n & 255);
}
function hexContrast(a, b) {
  const x = hexLum(a), y = hexLum(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}

// 色を画面に反映して、実際のカードの色と文字の色を返す
function applyCardColor() {
  const w = wallState(), r = document.documentElement;
  const c = HEX6.test(w.cardColor || '') ? w.cardColor : '';
  const t = HEX6.test(w.textColor || '') ? w.textColor
    : c ? (hexLum(c) > .4 ? '#222222' : '#f2f2f2') : '';
  if (c) r.style.setProperty('--cardC', c); else r.style.removeProperty('--cardC');
  if (t) r.style.setProperty('--cardT', t); else r.style.removeProperty('--cardT');
  r.classList.toggle('cardC', !!c);
  r.classList.toggle('cardT', !!t);
  if (t) r.dataset.cardScheme = hexLum(t) < .4 ? 'light' : 'dark';
  else delete r.dataset.cardScheme;
  const css = getComputedStyle(r);
  return {
    base: c || toHex6(css.getPropertyValue('--surface')),
    text: t || toHex6(css.getPropertyValue('--text'))
  };
}

function cardHint(res) {
  const el = $('#wallCHint');
  if (el) el.textContent = hexContrast(res.base, res.text) < 3
    ? '⚠ 読みにくいかも。文字の色を「自動」にするか、ちがう色にしてみて' : '';
}

{
  const box = document.createElement('div');
  box.className = 'wallColors';
  box.innerHTML =
    '<h3>カードの色</h3><div class="swRow" id="wallCC"></div>' +
    '<h3>文字の色</h3><div class="swRow" id="wallTC"></div>' +
    '<p class="hint" id="wallCHint"></p>';
  $('#wallCard').closest('label').after(box);
}

function renderCardColors() {
  const w = wallState(), res = applyCardColor();
  const cc = w.cardColor || '', tc = w.textColor || '';
  const pick = (key, cur, list) => {
    const mine = cur && !list.some(([v]) => v === cur);
    return `<label class="cSw custom${mine ? ' on' : ''}" style="--c:${mine ? cur : 'transparent'}" aria-label="自分で選ぶ">🎨` +
      `<input type="color" class="vh" data-${key}pick value="${cur || res.base}"></label>`;
  };
  $('#wallCC').innerHTML = CARD_COLORS.map(([v, n]) =>
    `<button type="button" class="cSw${v === cc ? ' on' : ''}" data-cc="${v}" style="--c:${v || 'transparent'}" aria-label="${n}">${v ? '' : '自動'}</button>`
  ).join('') + pick('cc', cc, CARD_COLORS);
  $('#wallTC').innerHTML = TEXT_COLORS.map(([v, n]) =>
    `<button type="button" class="cSw txt${v === tc ? ' on' : ''}" data-tc="${v}" style="--c:${res.base};color:${v || res.text}" aria-label="${n}">${v ? 'あ' : '自動'}</button>`
  ).join('') + pick('tc', tc, TEXT_COLORS);
  cardHint(res);
}

wallDlg.addEventListener('click', e => {
  const b = e.target.closest('[data-cc], [data-tc]');
  if (!b) return;
  wallState();
  if ('cc' in b.dataset) state.wall.cardColor = b.dataset.cc;
  else state.wall.textColor = b.dataset.tc;
  save();
  renderCardColors();
});
// 🎨：動かしてる間はすぐ反映、決めたら保存
wallDlg.addEventListener('input', e => {
  const p = e.target;
  if (!p.matches('[data-ccpick], [data-tcpick]')) return;
  wallState();
  state.wall['ccpick' in p.dataset ? 'cardColor' : 'textColor'] = p.value;
  cardHint(applyCardColor());
});
wallDlg.addEventListener('change', e => {
  if (!e.target.matches('[data-ccpick], [data-tcpick]')) return;
  save();
  renderCardColors();
});

{
  const renderWall1 = renderWall;
  renderWall = function () {
    renderWall1();
    renderCardColors();
  };
}
// ダークモードが切り替わったら「自動」の色を合わせ直す
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyCardColor());
applyCardColor();

/* ===== 背景の色 ===== */
const PAGE_COLORS = [
  ['', '自動'], ['#f4f5f7', '白'], ['#121316', '黒'], ['#ffd6e4', 'ピンク'],
  ['#d4e6ff', '水色'], ['#d3f2dd', 'ミント'], ['#e2d6ff', 'ラベンダー'], ['#fff0c2', 'クリーム']
];

function applyPageColor() {
  const w = wallState(), r = document.documentElement;
  const p = HEX6.test(w.pageColor || '') ? w.pageColor : '';
  if (p) r.style.setProperty('--pageC', p); else r.style.removeProperty('--pageC');
  r.classList.toggle('pageC', !!p);
  // カードの外（背景の上）の文字は、背景の明るさで色を決める（ダークモードで明るい背景を選んだときなど）
  if (p) r.dataset.pageScheme = hexLum(p) > .4 ? 'light' : 'dark';
  else delete r.dataset.pageScheme;
}

$('.wallColors').insertAdjacentHTML('afterbegin', '<h3>背景の色</h3><div class="swRow" id="wallPC"></div>');

function renderPageColors() {
  const cur = wallState().pageColor || '';
  const mine = cur && !PAGE_COLORS.some(([v]) => v === cur);
  const base = cur || toHex6(getComputedStyle(document.documentElement).getPropertyValue('--bg'));
  $('#wallPC').innerHTML = PAGE_COLORS.map(([v, n]) =>
    `<button type="button" class="cSw${v === cur ? ' on' : ''}" data-pc="${v}" style="--c:${v || 'transparent'}" aria-label="${n}">${v ? '' : '自動'}</button>`
  ).join('') +
    `<label class="cSw custom${mine ? ' on' : ''}" style="--c:${mine ? cur : 'transparent'}" aria-label="自分で選ぶ">🎨` +
    `<input type="color" class="vh" data-pcpick value="${base}"></label>`;
}

wallDlg.addEventListener('click', e => {
  const b = e.target.closest('[data-pc]');
  if (!b) return;
  wallState();
  state.wall.pageColor = b.dataset.pc;
  save();
  applyPageColor();
  renderPageColors();
});
wallDlg.addEventListener('input', e => {
  if (!e.target.matches('[data-pcpick]')) return;
  wallState();
  state.wall.pageColor = e.target.value;
  applyPageColor();
});
wallDlg.addEventListener('change', e => {
  if (!e.target.matches('[data-pcpick]')) return;
  save();
  renderPageColors();
});

{
  const renderWall2 = renderWall;
  renderWall = function () {
    renderWall2();
    renderPageColors();
  };
}

// 名前を「壁紙・色」に
wallDlg.querySelector('.dlgHead h2').textContent = '🖼 壁紙・色';
if ($('#wallBtn')) $('#wallBtn').innerHTML = '<b>🖼 壁紙・色</b><small>背景の写真や柄、背景・カード・文字の色</small>';

applyPageColor();

/* ===== ポイント ===== */
const PT_DAY = 1;
const PT_BONUS = [[7, 5], [30, 30]]; // [何日連続ごと, もらえるポイント]
// 交換できるもの（あとで足す）例：{ id: 'icon-mint', name: 'ミントのアイコン', desc: '…', cost: 50 }
// 交換できるもの：ウィジェットのデザイン [id, 名前, 説明, ポイント]
var WG_THEMES = [
  ['wg-mint', 'ミント', '🌿 さわやかな緑', 10],
  ['wg-sakura', 'さくら', '🌸 やわらかいピンク', 20],
  ['wg-sky', 'そらいろ', '☁️ 晴れた日の青', 30],
  ['wg-sunset', 'ゆうやけ', '🌇 オレンジから紫', 50],
  ['wg-night', 'よぞら', '🌙 深い紺に黄色', 80],
  ['wg-gold', 'こがね', '👑 ちょっと特別な金', 150],
];
const SHOP = WG_THEMES.map(([id, name, desc, cost]) => ({
  id, name: `ウィジェット「${name}」`, desc, cost,
  onGet() {
    state.widget = { ...(state.widget || {}), theme: id };
    save();
    window.syncWgUI?.();
  },
}));

function ptState() {
  const p = state.points && typeof state.points === 'object' ? state.points : {};
  const n = v => Number.isFinite(+v) && +v >= 0 ? Math.floor(+v) : 0;
  p.pt = n(p.pt); p.days = n(p.days); p.streak = n(p.streak); p.best = n(p.best);
  p.last = isYmd(p.last) ? p.last : '';
  p.owned = Array.isArray(p.owned) ? p.owned.filter(x => typeof x === 'string') : [];
  p.log = Array.isArray(p.log) ? p.log.filter(x => x && isYmd(x.date)).slice(0, 30) : [];
  return state.points = p;
}
const ptOwned = id => ptState().owned.includes(id);

// その日はじめて開いたときだけポイントを足す
function ptCheckIn() {
  const p = ptState(), today = todayStr();
  if (p.last && p.last >= today) return null; // 今日はもらった（時計が戻ったときも何もしない）
  const gap = p.last ? dayDiff(parseYmd(today), parseYmd(p.last)) : 0;
  p.streak = gap === 1 ? p.streak + 1 : 1;
  p.days += 1;
  p.best = Math.max(p.best, p.streak);
  p.last = today;
  let get = PT_DAY;
  const bonus = [];
  for (const [k, v] of PT_BONUS) if (p.streak % k === 0) { get += v; bonus.push(`${k}日連続 +${v}p`); }
  p.pt += get;
  p.log.unshift({ date: today, get, streak: p.streak, bonus: bonus.join('・') });
  p.log = p.log.slice(0, 30);
  save();
  return { get, bonus, streak: p.streak };
}

// 開いたときのお知らせ
function ptPop(r) {
  const el = document.createElement('div');
  el.className = 'ptPop';
  el.innerHTML = `<b>+${r.get}p</b> 連続${r.streak}日目` +
    (r.bonus.length ? `<small>🎉 ${esc(r.bonus.join('・'))}</small>` : '');
  el.onclick = () => { el.remove(); openPoints(); };
  document.body.append(el);
  setTimeout(() => el.classList.add('out'), 3200);
  setTimeout(() => el.remove(), 3700);
}

const ptDlg = document.createElement('dialog');
ptDlg.id = 'ptDlg';
ptDlg.innerHTML =
  '<div class="dlg">' +
  '<div class="dlgHead"><h2>🎁 ポイント</h2><button type="button" class="x big" data-ptclose aria-label="閉じる">×</button></div>' +
  '<div id="ptBody"></div></div>';
document.body.append(ptDlg);

// 交換所をグループに分けてたたむ
const SHOP_GROUPS = [
  ['wg-', '🧩 ウィジェット'],
  ['tb-', '🎨 タブバー'],
　['bg-', '🖼 背景'],
];
const SHOP_OPEN_KEY = 'ptShopOpen';
function shopOpenList() {
  try { return JSON.parse(localStorage.getItem(SHOP_OPEN_KEY) || '[]'); } catch { return []; }
}
function shopItem(s, p, short) {
  const got = p.owned.includes(s.id);
  const nm = short ? s.name.replace(/^.+?「(.+)」$/, '$1') : s.name;
  return `<li><div><b>${esc(nm)}</b>${s.desc ? `<small>${esc(s.desc)}</small>` : ''}</div>` +
    `<button type="button" class="wgPrevBtn" data-wgprev="${s.id}">見る</button>` +
    (got ? '<span class="ptGot">交換済み</span>'
      : `<button type="button" data-buy="${s.id}"${p.pt < s.cost ? ' disabled' : ''}>${s.cost}p</button>`) + '</li>';
}
function shopHTML(p) {
  if (!SHOP.length) return '<p class="muted">交換できるものは準備中。ポイントは貯めておけるよ</p>';
  const opened = shopOpenList(), used = new Set();
  let html = SHOP_GROUPS.map(([pre, title]) => {
    const list = SHOP.filter(s => s.id.startsWith(pre));
    if (!list.length) return '';
    list.forEach(s => used.add(s.id));
    const got = list.filter(s => p.owned.includes(s.id)).length;
    const can = list.some(s => !p.owned.includes(s.id) && p.pt >= s.cost);
    return `<details class="ptGrp" data-grp="${pre}"${opened.includes(pre) ? ' open' : ''}>` +
      `<summary><span>${title}</span><small>${can ? '<em>交換できるのあり</em>' : ''}${got}/${list.length} 交換済み</small></summary>` +
      `<ul class="ptShop">${list.map(s => shopItem(s, p, true)).join('')}</ul></details>`;
  }).join('');
  const rest = SHOP.filter(s => !used.has(s.id));
  if (rest.length) html += `<ul class="ptShop">${rest.map(s => shopItem(s, p, false)).join('')}</ul>`;
  return html;
}

function renderPoints() {
  const p = ptState();
  const next = PT_BONUS.map(([k, v]) => {
    const left = k - (p.streak % k);
    return { k, v, left, rate: Math.round((k - left) / k * 100) };
  });
  $('#ptBody').innerHTML =
    `<p class="ptNow"><b>${p.pt}</b>p</p>` +
    '<div class="ptStats">' +
    `<div><b>${p.streak}</b>日<small>連続ログイン</small></div>` +
    `<div><b>${p.days}</b>日<small>総ログイン</small></div>` +
    `<div><b>${p.best}</b>日<small>最長連続</small></div></div>` +

    '<h3>次のボーナス</h3>' + next.map(n =>
      `<div class="ptNext"><div class="row split"><span>${n.k}日連続 +${n.v}p</span><small>あと${n.left}日</small></div>` +
      `<div class="bar"><i style="width:${n.rate}%"></i></div></div>`).join('') +

    '<h3>交換所</h3>' + shopHTML(p) +

    `<details class="ptLogBox"${localStorage.getItem('ptLogOpen') === '1' ? ' open' : ''}>` +
    `<summary>最近もらったポイント <small>${Math.min(p.log.length, 10)}件</small></summary>` +
    '<ul class="ptLog">' + (p.log.slice(0, 10).map(x =>
      `<li><span>${md(parseYmd(x.date))} ${x.gift ? `🎁 ${esc(x.gift)}` : `連続${x.streak}日目${x.bonus ? ` <small>🎉${esc(x.bonus)}</small>` : ''}`}</span><b>+${x.get}p</b></li>`
    ).join('') || '<li class="muted">まだないよ</li>') + '</ul></details>' +

    '<p class="hint">毎日1回アプリを開くと1p。7日連続ごとに+5p、30日連続ごとに+30p。1日あくと連続は1日目から数え直しになるけど、貯めたポイントは減らないよ</p>';
}

function openPoints() {
  renderPoints();
  ptDlg.showModal();
}

ptDlg.addEventListener('toggle', e => {
  if (e.target.classList?.contains('ptLogBox')) localStorage.setItem('ptLogOpen', e.target.open ? '1' : '0');
}, true);

ptDlg.addEventListener('click', e => {
  if (e.target.closest('[data-ptclose]')) return ptDlg.close();
  const id = e.target.closest('[data-buy]')?.dataset.buy;
  const s = SHOP.find(x => x.id === id);
  if (!s) return;
  const p = ptState();
  if (p.owned.includes(s.id)) return;
  if (p.pt < s.cost) return alert(`あと${s.cost - p.pt}p 足りないよ`);
  if (!confirm(`${s.cost}pで「${s.name}」と交換する？`)) return;
  p.pt -= s.cost;
  p.owned.push(s.id);
  save();
  s.onGet?.();
  renderPoints(); renderPtBtn();
});

// 交換所のグループの開け閉めを覚える
ptDlg.addEventListener('toggle', e => {
  const d = e.target;
  if (!d.matches?.('.ptGrp')) return;
  const set = new Set(shopOpenList());
  d.open ? set.add(d.dataset.grp) : set.delete(d.dataset.grp);
  localStorage.setItem(SHOP_OPEN_KEY, JSON.stringify([...set]));
}, true);


// その他タブのいちばん上
{
  const card = document.createElement('div');
  card.className = 'card menu';
  card.innerHTML = '<h2>ポイント</h2><button type="button" id="ptBtn"></button>';
  $('#view-more').prepend(card);
  $('#ptBtn').onclick = openPoints;
}
function renderPtBtn() {
  const p = ptState();
  $('#ptBtn').innerHTML = `<b>🎁 ${p.pt}p</b><small>連続${p.streak}日・総ログイン${p.days}日</small>`;
}

function ptRun() {
  const r = ptCheckIn();
  renderPtBtn();
  if (ptDlg.open) renderPoints();
  if (r) ptPop(r);
}
// 開いたまま日付をまたいだときも、戻ってきたら数える
document.addEventListener('visibilitychange', () => { if (!document.hidden) ptRun(); });

if (typeof FEATURES !== 'undefined' && !FEATURES.some(f => f.id === 'points')) FEATURES.push({
  id: 'points', name: 'ポイント', where: 'その他 → ポイント',
  desc: '毎日開くとポイントが貯まる。連続ログイン・総ログインの日数も見られる',
  kw: 'ポイント ログイン ボーナス 連続 交換 ごほうび', go: () => openPoints()
});

ptRun();

/* ===== 日課 ===== */
const HB_KEY = 'gakulog-habit-v1';
const HB_WD = ['日', '月', '火', '水', '木', '金', '土'];
function hbLoad() {
  try { return JSON.parse(localStorage.getItem(HB_KEY)) || { list: [] }; }
  catch { return { list: [] }; }
}
let hb = hbLoad();
const hbSave = () => localStorage.setItem(HB_KEY, JSON.stringify(hb));
const hbOn = (h, d) => !h.days || h.days.includes(d.getDay());
function hbStreak(h) {
  const d = new Date();
  let n = 0;
  if (!h.done.includes(ymd(d))) d.setDate(d.getDate() - 1); // 今日まだなら昨日から数える
  for (let i = 0; i < 400; i++, d.setDate(d.getDate() - 1)) {
    if (!hbOn(h, d)) continue;
    if (h.done.includes(ymd(d))) n++; else break;
  }
  return n;
}

const hbCard = document.createElement('section');
hbCard.className = 'card';
hbCard.id = 'habitCard';
const hbAnchor = $('#diaryInput')?.closest('.card, section');
if (hbAnchor) hbAnchor.before(hbCard); else $('#view-today').append(hbCard);
let hbEdit = false;

function renderHabits() {
  const now = new Date(), k = ymd(now);
  const today = hb.list.filter(h => hbOn(h, now));
  const left = today.filter(h => !h.done.includes(k)).length;
  let html = '<div class="hbHead"><h2>日課 <small>' +
    (today.length ? (left ? `あと${left}つ` : 'ぜんぶできた') : '') + '</small></h2>' +
    `<button type="button" class="hbEditBtn">${hbEdit ? '完了' : '編集'}</button></div>`;
  if (hbEdit) {
    html += '<ul class="hbList">' + hb.list.map(h =>
      `<li><span>${esc(h.name)} <small>${h.days ? h.days.map(i => HB_WD[i]).join('') : '毎日'}</small></span>` +
      `<button type="button" data-hbup="${h.id}" aria-label="上へ">↑</button>` +
      `<button type="button" class="x" data-hbdel="${h.id}" aria-label="削除">×</button></li>`).join('') + '</ul>' +
      '<div class="hbAdd"><input id="hbName" maxlength="30" placeholder="例：英単語10個">' +
      '<div class="hbDays">' + HB_WD.map((w, i) =>
        `<label><input type="checkbox" value="${i}" checked>${w}</label>`).join('') + '</div>' +
      '<button type="button" class="primary" id="hbAddBtn">追加</button></div>';
  } else if (!hb.list.length) {
    html += '<p class="muted">「編集」から日課を追加できるよ</p>';
  } else if (!today.length) {
    html += '<p class="muted">今日の日課はお休み</p>';
  } else {
    html += '<ul class="hbList">' + today.map(h => {
      const on = h.done.includes(k), s = hbStreak(h);
      return `<li class="${on ? 'on' : ''}" data-hb="${h.id}"><span class="hbChk">${on ? '✓' : ''}</span>` +
        `<span class="hbName">${esc(h.name)}</span>` +
        (s >= 2 ? `<small class="hbStreak">${s}日連続</small>` : '') + '</li>';
    }).join('') + '</ul>';
  }
  hbCard.innerHTML = html;
}

hbCard.addEventListener('click', e => {
  const t = e.target;
  if (t.closest('.hbEditBtn')) { hbEdit = !hbEdit; return renderHabits(); }
  const li = t.closest('[data-hb]');
  if (li) {
    const h = hb.list.find(x => x.id === li.dataset.hb);
    if (!h) return;
    const k = todayStr(), i = h.done.indexOf(k);
    if (i >= 0) h.done.splice(i, 1);
    else {
      h.done.push(k);
      if (h.done.length > 400) h.done = h.done.slice(-400);
    }
    hbSave();
    return renderHabits();
  }
  const del = t.closest('[data-hbdel]');
  if (del) {
    const h = hb.list.find(x => x.id === del.dataset.hbdel);
    if (h && confirm(`「${h.name}」を消す？記録も消えるよ`)) {
      hb.list = hb.list.filter(x => x !== h);
      hbSave();
      renderHabits();
    }
    return;
  }
  const up = t.closest('[data-hbup]');
  if (up) {
    const i = hb.list.findIndex(x => x.id === up.dataset.hbup);
    if (i > 0) {
      [hb.list[i - 1], hb.list[i]] = [hb.list[i], hb.list[i - 1]];
      hbSave();
      renderHabits();
    }
    return;
  }
  if (t.id === 'hbAddBtn') {
    const name = $('#hbName').value.trim();
    if (!name) return $('#hbName').focus();
    const days = [...hbCard.querySelectorAll('.hbDays input:checked')].map(c => +c.value);
    if (!days.length) return alert('曜日を1つ以上選んでね');
    hb.list.push({ id: Date.now().toString(36), name, days: days.length === 7 ? null : days, done: [] });
    hbSave();
    renderHabits();
    $('#hbName').focus();
  }
});
hbCard.addEventListener('keydown', e => {
  if (e.target.id === 'hbName' && e.key === 'Enter' && !e.isComposing) $('#hbAddBtn').click();
});

let hbDay = todayStr();
function hbTick() {
  if (todayStr() === hbDay) return;
  hbDay = todayStr();
  renderHabits();
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) hbTick(); });
setInterval(hbTick, 60000);
renderHabits();

// 共有した予定：🔒のチェックはその場で保存する
$('#evLock')?.addEventListener('change', e => {
  const ev = evEditId ? findAnyEv(evEditId) : null;
  if (!ev?.gid || !grIsMine(ev)) return; // 新しく追加するときは「追加」で保存
  const on = e.target.checked;
  grPatch(ev, { lock: on })
    .then(() => toast(on ? '🔒 ロックしたよ' : 'ロックを外したよ'))
    .catch(err => { e.target.checked = !on; grFail(err); });
});

/* ===== 今日の運勢（お遊び） ===== */
const ZODIAC = ['おひつじ座', 'おうし座', 'ふたご座', 'かに座', 'しし座', 'おとめ座',
  'てんびん座', 'さそり座', 'いて座', 'やぎ座', 'みずがめ座', 'うお座'];
const ZODIAC_DATE = ['3/21〜4/19', '4/20〜5/20', '5/21〜6/21', '6/22〜7/22', '7/23〜8/22', '8/23〜9/22',
  '9/23〜10/23', '10/24〜11/22', '11/23〜12/21', '12/22〜1/19', '1/20〜2/18', '2/19〜3/20'];
const FT_GOOD = [
  '気になってた課題、今日なら一気に進むかも',
  '思い切って質問すると、いい答えが返ってくる日',
  '新しいお店や道を試すと当たりを引けそう',
  '集中力が高め。むずかしい授業ほど得るものが多い',
  '人に親切にすると、あとでちゃんと返ってくる',
  'ひらめきが冴える日。メモを手元に置いておこう',
  '予定がサクサク進んで、自由な時間ができそう',
  '久しぶりの人に連絡すると、うれしい話が聞けるかも',
  'ちょっと背伸びしたことに挑戦するとうまくいく',
  '朝のうちに一つ片付けると、一日ずっと調子がいい'
];
const FT_MID = [
  'いつものペースがいちばん。無理に急がなくて大丈夫',
  '持ち物をもう一回確認しておくと安心',
  '小さな「ありがとう」が、いい空気を作ってくれる',
  '迷ったら、先に手を動かしたほうが早い',
  '休み時間にちゃんと休むと、午後がラクになる',
  '机の上を少し片付けると、頭もスッキリする',
  '締め切りが近いものから順番にやるとうまく回る',
  '話を聞く側に回ると、いいヒントがもらえそう',
  '水分をこまめにとると調子が上がる',
  '今日やらなくていいことは、明日に回してOK'
];
const FT_LOW = [
  '今日はのんびりモード。早めに寝ると明日がいい日に',
  'うっかりに注意。時間割と持ち物を一度だけ見直そう',
  'うまくいかなくても気にしない。明日は運が上向き',
  'ひとりの時間をゆっくり楽しむと回復できる',
  '好きなものを食べて、気分を上げていこう',
  'あわてると空回りしがち。深呼吸してから動こう',
  '小さなことでいいから一つ終わらせると、気持ちが軽くなる',
  'いつもより10分早く家を出ると安心',
  '今日は守りの日。新しいことは週末に回してもいい',
  '誰かに頼ると、思ったよりすんなり助けてもらえる'
];
const FT_ITEM = ['付箋', 'イヤホン', '青いペン', 'ハンカチ', 'あめ', '折りたたみ傘', 'モバイルバッテリー',
  'マスキングテープ', '水筒', 'メモ帳', '消しゴム', 'チョコレート', '腕時計', 'リップクリーム',
  'ルーズリーフ', '缶コーヒー', 'お気に入りの靴下', 'エコバッグ', '定期入れ', 'ヘアゴム'];

// 日付の文字列から、毎回同じ乱数を作る
function ftRand(seed) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = h << 13 | h >>> 19;
  }
  return () => {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}
// その日の順位（a[0] が1位の星座）
function ftRank(k) {
  const r = ftRand('rank-' + k), a = [...Array(12).keys()];
  for (let i = 11; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function ftText(sign, k) {
  const s = +sign, rank = ftRank(k).indexOf(s) + 1;
  const r = ftRand(k + '-' + s);
  const pick = a => a[Math.floor(r() * a.length)];
  const msg = pick(rank <= 4 ? FT_GOOD : rank <= 8 ? FT_MID : FT_LOW);
  return `${ZODIAC[s]} ${rank}位：${msg}／ラッキーアイテム：${pick(FT_ITEM)}`;
}

// 設定画面
if ($('#nSign')) {
  $('#nSign').innerHTML = '<option value="">選んでね</option>' +
    ZODIAC.map((z, i) => `<option value="${i}">${z}（${ZODIAC_DATE[i]}）</option>`).join('');
  $('#nSign').value = state.notify.sign;
  $('#nSign').onchange = e => {
    state.notify.sign = e.target.value;
    save();
    if (e.target.value !== '') toast(ftText(e.target.value, todayStr()));
  };
  $('#nFortune').onchange = e => { state.notify.fortune = e.target.checked; save(); };
}

/* ===== 欠席の上限をまとめて設定 ===== */
{
  const box = document.createElement('div');
  box.className = 'absBulk';
  box.innerHTML = '<h3>欠席の上限をまとめて設定</h3>' +
    '<div class="row">' +
    '<span id="abNBox">全 <input type="number" id="abN" min="1" max="40" value="15"> 回のうち</span> ' +
    '<select id="abR"><option value="3">1/3</option><option value="4">1/4</option>' +
    '<option value="5">1/5</option><option value="0">回数で決める</option></select> ' +
    '<span id="abCBox" hidden><input type="number" id="abC" min="0" max="40" value="5"> 回まで</span></div>' +
    '<p class="hint" id="abInfo"></p>' +
    '<label class="row"><input type="checkbox" id="abOver"> 設定済みの授業も上書きする</label>' +
    '<button type="button" id="abRun">今の学期の授業に反映</button>';
  ($('#setGrid') || $('#settingsDlg')).append(box);

  const abMax = () => {
    const r = +$('#abR').value;
    return r ? Math.floor(+$('#abN').value / r) : Math.max(0, Math.floor(+$('#abC').value) || 0);
  };
  const abSync = () => {
    const r = +$('#abR').value;
    $('#abNBox').hidden = !r;
    $('#abCBox').hidden = !!r;
    $('#abInfo').textContent = `→ ${abMax()}回まで休める設定にするよ。「以上で不可」か「超えたら不可」かはシラバスで確かめてね`;
  };
  box.addEventListener('input', abSync);
  abSync();

  $('#abRun').onclick = () => {
    const max = abMax(), over = $('#abOver').checked;
    const list = courses().filter(c => over || c.maxAbsence === '');
    if (!list.length) return alert('反映する授業がないよ（全部設定済み）');
    if (!confirm(`${list.length}個の授業を「${max}回まで」にする？`)) return;
    withUndo(`${list.length}個の授業に反映したよ`, () => { for (const c of list) c.maxAbsence = max; });
  };
}

/* ===== APIキーをかんたんに貼る ===== */
{
  const KEY_FMT = [
    ['claude', /sk-ant-[\w-]{20,}/],
    ['openrouter', /sk-or-[\w-]{20,}/],
    ['gemini', /AIza[\w-]{30,}/]
  ];
  // 中にキーが入っていれば [サービス, キー] を返す
  const findKey = s => {
    for (const [p, re] of KEY_FMT) {
      const m = s.match(re);
      if (m) return [p, m[0]];
    }
    return null;
  };
  const keyKind = s => findKey(s)?.[0] || '';
  window.keyKind = keyKind;
  $('#sKey').insertAdjacentHTML('afterend', '<button type="button" id="sKeyPaste">📋 貼り付け</button>');

  // 余計な空白・改行は消す
  $('#sKey').addEventListener('input', e => {
    const v = e.target.value.replace(/\s+/g, '');
    if (v !== e.target.value) e.target.value = v;
  });

  $('#sKeyPaste').onclick = async () => {
    let s = '';
    try { s = await navigator.clipboard.readText(); }
    catch { return alert('クリップボードを読めなかった。キーの欄を長押しして貼り付けてね'); }
    const hit = findKey(s);
    if (!hit) {
      const t = s.trim();
      return alert('コピーしてる中身がAPIキーの形じゃないみたい。もう一回キーをコピーしてみて\n' +
        '（読めた中身：' + (t ? t.slice(0, 6) + '… 全' + t.length + '文字' : '空っぽ') + '）');
    }
    const [p, key] = hit;
    if (p !== $('#sProvider').value) {
      if (!confirm(`${PROVIDERS[p].label} のキーみたい。そっちに切り替えて入れる？`)) return;
      stashProviderFields();
      fillProviderFields(p);
    }
    $('#sKey').value = key;
    toast('キーを入れたよ。「保存」を押してね');
  };
}

/* ===== 日記を月ごとに見る ===== */
{
  const dyDlg = document.createElement('dialog');
  dyDlg.id = 'diaryDlg';
  dyDlg.innerHTML =
    '<div class="dyHead"><button type="button" data-dym="-1" aria-label="前の月">‹</button>' +
    '<b id="dyTitle"></b><button type="button" data-dym="1" aria-label="次の月">›</button></div>' +
    '<div class="dyWrap"><table class="dyTbl" id="dyTbl"></table></div>' +
    '<button type="button" id="dyClose">閉じる</button>';
  document.body.append(dyDlg);
  $('#diaryInput').insertAdjacentHTML('afterend',
    '<button type="button" class="more" id="diaryListBtn">📖 月ごとに見る</button>');

  let dyM = 1; // 1〜12月
  const renderDiaryList = () => {
    const mm = pad(dyM), thisY = new Date().getFullYear();
    const ys = [...new Set(Object.keys(state.diary).map(k => +k.slice(0, 4)).concat(thisY))]
      .sort((a, b) => b - a).slice(0, 5);
    $('#dyTitle').textContent = `${dyM}月`;
    let h = '<tr><th></th>' + ys.map(y => `<th>${y}</th>`).join('') + '</tr>', rows = 0;
    const last = new Date(2024, dyM, 0).getDate(); // うるう年で数えて 2/29 も出す
    for (let d = 1; d <= last; d++) {
      const ks = ys.map(y => `${y}-${mm}-${pad(d)}`);
      if (!ks.some(k => state.diary[k])) continue;
      rows++;
      h += `<tr><th>${d}日</th>` + ks.map(k =>
        `<td${state.diary[k] ? ` data-dyk="${k}"` : ''}>${esc(state.diary[k] || '')}</td>`).join('') + '</tr>';
    }
    $('#dyTbl').innerHTML = rows ? h : '<tr><td class="muted">この月の日記はまだないよ</td></tr>';
  };

  $('#diaryListBtn').onclick = () => {
    dyM = new Date().getMonth() + 1;
    renderDiaryList();
    dyDlg.showModal();
  };
  dyDlg.addEventListener('click', async e => {
    if (e.target.id === 'dyClose') return dyDlg.close();
    const m = e.target.closest('[data-dym]');
    if (m) { dyM = (dyM + 11 + +m.dataset.dym) % 12 + 1; return renderDiaryList(); }
    const c = e.target.closest('[data-dyk]');
    if (!c) return;
    const k = c.dataset.dyk;
    const v = await askLine(`${k.slice(0, 4)}年${md(parseYmd(k))}の一言日記`, state.diary[k] || '', { placeholder: 'どんな日だった？' });
    if (v == null) return;
    if (v.trim()) state.diary[k] = v.trim(); else delete state.diary[k];
    save(); renderDiaryList(); renderNotes();
    if (curTab === 'cal' && calMonth) { renderCal(); renderDay(); }
  });
}

/* ===== 予定の名目を自分で作る ===== */
const KIND_COLORS = ['#f97316', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#eab308', '#64748b'];
const kindStyle = document.createElement('style');
document.head.append(kindStyle);

// 色の上に乗せる文字：白と黒で読みやすい方
function inkOn(hex) {
  const n = parseInt(String(hex).replace('#', '').slice(0, 6), 16);
  if (!Number.isFinite(n)) return '#fff';
  const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
  const l = .2126 * f(n >> 16 & 255) + .7152 * f(n >> 8 & 255) + .0722 * f(n & 255);
  return (1.05 / (l + .05)) >= ((l + .05) / (.016 + .05)) ? '#fff' : '#222'; // #222 の明るさ ≒ .016
}

// 名前・色・選ぶ欄を今の名目に合わせる
function applyKinds() {
  for (const k of Object.keys(EV_LABEL)) if (k.startsWith('k-')) delete EV_LABEL[k];
  for (const k of state.evKinds) EV_LABEL[k.id] = k.name;
  // ラベルの文字は、色の明るさを見て白か黒の読める方。今日の流れは文字に色を付けず、時刻の前に色の●
  kindStyle.textContent = state.evKinds.map(k =>
    `.ev.${k.id}{background:${k.color};color:${inkOn(k.color)}}` +
    `.flow li.f-${k.id} .ft::before{content:'●';font-size:9px;margin-right:3px;vertical-align:1px;color:${k.color}}`).join('');
  const sel = $('#evKind'), v = sel.value;
  sel.querySelectorAll('option[value^="k-"], option[value^="__"]').forEach(o => o.remove());
  for (const k of state.evKinds) sel.add(new Option(k.name, k.id));
  sel.add(new Option('＋ 新しい名目を作る', '__newkind'));
  if (state.evKinds.length) sel.add(new Option('⚙ 名目の整理', '__editkind'));
  sel.value = [...sel.options].some(o => o.value === v) ? v : 'job';
  syncJobOption();
}

// 「バイト」をオフにしたら、種類の選択肢からも外す（iPhone は <option> を CSS で隠せないので出し入れする）
function syncJobOption() {
  const sel = $('#evKind');
  syncJobOption.opt ||= sel.querySelector('option[value="job"]');
  const opt = syncJobOption.opt;
  if (!opt) return;
  if (featOn('job')) { if (!opt.parentNode) sel.insertBefore(opt, sel.firstChild); }
  else opt.remove();
  if (![...sel.options].some(o => o.value === sel.value) || !sel.value) sel.value = featOn('job') ? 'job' : 'other';
}

let kindPrev = 'job';
$('#evKind').addEventListener('focus', e => { kindPrev = e.target.value; });
$('#evKind').addEventListener('change', e => {
  const v = e.target.value;
  if (!v.startsWith('__')) { kindPrev = v; return; }
  e.target.value = kindPrev;
  if (v === '__editkind') return openKindDlg();
  const name = prompt('新しい名目の名前（例：サークル、通院）', '')?.trim();
  if (!name) return;
  if (Object.values(EV_LABEL).includes(name)) return alert('同じ名前の名目がもうあるよ');
  const k = { id: 'k-' + uid(), name: name.slice(0, 10), color: KIND_COLORS[state.evKinds.length % KIND_COLORS.length] };
  state.evKinds.push(k);
  save(); applyKinds();
  e.target.value = kindPrev = k.id;
  toast(`「${k.name}」を作ったよ`);
});

// 名目の整理（名前・色を変える、消す）
const kindDlg = document.createElement('dialog');
kindDlg.id = 'kindDlg';
kindDlg.innerHTML = '<h3>名目の整理</h3><ul class="kindList" id="kindList"></ul>' +
  '<p class="hint">名目を消すと、その予定は「その他」になるよ</p>' +
  '<button type="button" id="kindClose">閉じる</button>';
document.body.append(kindDlg);

function renderKindList() {
  $('#kindList').innerHTML = state.evKinds.map(k =>
    `<li><input type="color" value="${k.color}" data-kcolor="${k.id}" aria-label="色">` +
    `<input value="${esc(k.name)}" maxlength="10" data-kname="${k.id}" aria-label="名前">` +
    `<button type="button" class="x" data-kdel="${k.id}" aria-label="削除">×</button></li>`).join('')
    || '<li class="muted">まだないよ</li>';
}
function openKindDlg() { renderKindList(); kindDlg.showModal(); }

kindDlg.addEventListener('change', e => {
  const t = e.target, k = state.evKinds.find(x => x.id === (t.dataset.kcolor || t.dataset.kname));
  if (!k) return;
  if (t.dataset.kcolor) k.color = t.value;
  else {
    const v = t.value.trim().slice(0, 10);
    if (!v) { t.value = k.name; return; }
    k.name = v;
  }
  save(); applyKinds(); renderAll();
});
kindDlg.addEventListener('click', e => {
  if (e.target.id === 'kindClose') return kindDlg.close();
  const id = e.target.closest('[data-kdel]')?.dataset.kdel;
  const k = state.evKinds.find(x => x.id === id);
  if (!k) return;
  const n = state.events.filter(x => x.kind === id).length;
  if (!confirm(`「${k.name}」を消す？` + (n ? `\n入ってる予定${n}件は「その他」になるよ` : ''))) return;
  state.evKinds = state.evKinds.filter(x => x !== k);
  for (const x of state.events) if (x.kind === id) x.kind = 'other';
  for (const p of state.evPresets) if (p.kind === id) p.kind = 'other';
  save(); applyKinds(); renderKindList(); renderAll();
});

applyKinds();
renderAll();

/* ===== シラバスの画像から課題・試験を読む ===== */
{
  const SY_PROMPT = c => `これは大学の授業「${c.name || '（名前なし）'}」のシラバス（授業計画）の画像です。課題・レポートの締切と、試験（小テスト・中間・期末）の予定だけを探して、JSON配列だけを出力してください。説明文やコードブロック記号は書かないでください。
形式: [{"kind":"exam","title":"中間試験","month":11,"day":20,"lesson":7}]
ルール:
- kind は試験なら "exam"、課題・レポート・提出物なら "task"。
- title は20文字以内で、何の試験・課題かわかる名前にする。
- 日付が書いてあれば month と day を数字で。書いてなければ 0。年は書かない。
- 「第7回」のように授業の回数で書いてあれば lesson にその数字を入れる。なければ 0。
- 「毎回」「随時」のように日付も回数も決まらないものは、month・day・lesson を 0 にする。
- 成績評価の欄にだけ書いてある試験やレポートも出力してよい。ただし日付は推測しない。
- 授業の内容・テーマ・教科書の説明は出力しない。
- 見つからなければ [] だけを出力する。読めない部分を推測で埋めない。`;

  // 「第n回」の日付（学期の初めから数える。休みと休講は飛ばす）
  const syLessonDate = (c, n, t = term()) => {
    if (c.day === -1) {
      const s = parseYmd(c.from);
      if (!s) return '';
      const d = ymd(addDays(s, n - 1));
      return !c.to || d <= c.to ? d : '';
    }
    const s = parseYmd(t.start);
    if (!s) return '';
    let k = 0;
    for (let i = 0; i < 200; i++) {
      const d = addDays(s, i);
      if (pastEnd(d, t)) break;
      if (hasClass(c, d, t) && ++k === n) return ymd(d);
    }
    return '';
  };

  // 月日だけの日付に、学期にいちばん近い年を付ける
  const syMdDate = (m, d, t = term()) => {
    if (!(m >= 1 && m <= 12 && d >= 1 && d <= 31)) return '';
    const s = parseYmd(t.start), e = parseYmd(t.end);
    const mid = s && e ? new Date((+s + +e) / 2) : s || new Date();
    let best = null;
    for (const y of [mid.getFullYear() - 1, mid.getFullYear(), mid.getFullYear() + 1]) {
      const x = new Date(y, m - 1, d);
      if (x.getMonth() !== m - 1) continue; // 2/30 などはなし
      if (!best || Math.abs(x - mid) < Math.abs(best - mid)) best = x;
    }
    return best ? ymd(best) : '';
  };

  const syExamTitle = (c, title) => title.includes(nm(c)) ? title : `${nm(c)} ${title}`;
  const syDup = (c, r) => r.kind === 'task'
    ? c.tasks.some(k => k.title === r.title && k.due === r.date)
    : state.events.some(e => e.kind === 'exam' && e.date === r.date && e.title === syExamTitle(c, r.title));

  const syDlg = document.createElement('dialog');
  syDlg.id = 'syDlg';
  syDlg.innerHTML = '<h3>シラバスから読み取り</h3>' +
    '<p class="hint" id="syStatus"></p><div id="syRows"></div>' +
    '<div class="row syBtns"><button type="button" class="primary" id="syAdd" disabled>チェックした分を追加</button>' +
    '<button type="button" id="syClose">閉じる</button></div>';
  document.body.append(syDlg);
  $('#cSyllabusHint').insertAdjacentHTML('afterend',
    '<button type="button" id="syBtn">📷 シラバスの画像から課題・試験を読む</button>' +
    '<input type="file" id="syFile" accept="image/*" multiple hidden>');

  let syList = [];
  const syRender = () => {
    $('#syRows').innerHTML = syList.map((r, i) =>
      `<div class="syRow" data-i="${i}">` +
      `<input type="checkbox" data-f="on"${r.on ? ' checked' : ''} aria-label="追加する">` +
      `<select data-f="kind"><option value="task"${r.kind === 'task' ? ' selected' : ''}>課題</option>` +
      `<option value="exam"${r.kind === 'exam' ? ' selected' : ''}>試験</option></select>` +
      `<input data-f="title" value="${esc(r.title)}" maxlength="40" aria-label="名前">` +
      `<input type="date" data-f="date" value="${r.date}" aria-label="日付">` +
      (r.dup ? '<small class="muted">登録済み</small>' : '') + '</div>').join('');
    $('#syAdd').disabled = !syList.some(r => r.on);
  };
  const syEdit = e => {
    const row = e.target.closest('.syRow'), f = e.target.dataset.f;
    if (!row || !f) return;
    syList[+row.dataset.i][f] = f === 'on' ? e.target.checked : e.target.value;
    $('#syAdd').disabled = !syList.some(r => r.on);
  };
  $('#syRows').addEventListener('input', syEdit);
  $('#syRows').addEventListener('change', syEdit);

  $('#syBtn').onclick = () => $('#syFile').click();
  $('#syFile').onchange = async e => {
    const files = [...e.target.files];
    e.target.value = '';
    const c = cur();
    if (!files.length || !c) return;
    syList = []; syRender();
    const st = $('#syStatus');
    syDlg.showModal();
    try {
      for (const [i, f] of files.entries()) {
        st.textContent = `${i + 1}/${files.length}枚目を読み取り中…`;
        const txt = await callVision(await fileToJpegBase64(f), SY_PROMPT(c), st);
        const s = txt.indexOf('['), en = txt.lastIndexOf(']');
        if (s < 0 || en < s) throw new Error(`${i + 1}枚目の結果がうまく読めなかった`);
        for (const x of JSON.parse(txt.slice(s, en + 1))) {
          if (!x || typeof x.title !== 'string' || !x.title.trim()) continue;
          const kind = x.kind === 'exam' ? 'exam' : 'task';
          const date = syMdDate(+x.month, +x.day) || (+x.lesson > 0 ? syLessonDate(c, +x.lesson) : '');
          const r = { kind, title: x.title.trim().slice(0, 40), date };
          if (syList.some(y => y.kind === r.kind && y.title === r.title && y.date === r.date)) continue;
          r.dup = syDup(c, r);
          r.on = !r.dup && (kind === 'task' || !!date);
          syList.push(r);
        }
        syRender();
      }
      st.textContent = syList.length
        ? '中身を確かめて、追加するものにチェックしてね。日付が空の試験は、日付を入れてから追加してね'
        : '課題や試験の予定は見つからなかった';
    } catch (err) {
      st.textContent = 'うまくいかなかった：' + (err?.message || err);
    }
  };

  $('#syAdd').onclick = () => {
    const c = cur();
    const list = syList.filter(r => r.on && r.title.trim());
    if (!c || !list.length) return;
    if (list.some(r => r.kind === 'exam' && !isYmd(r.date)))
      return alert('日付が空の試験があるよ。日付を入れるか、チェックを外してね');
    withUndo(`シラバスから${list.length}件追加したよ`, () => {
      for (const r of list) {
        const title = r.title.trim();
        if (r.kind === 'task') {
          c.tasks.push({ id: uid(), title, due: isYmd(r.date) ? r.date : '', done: false, lead: '' });
          continue;
        }
        // 授業のある日なら、その時限の時刻を入れる
        const tm = c.day >= 0 && hasClass(c, parseYmd(r.date), term()) ? state.times[c.period - 1] : null;
        state.events.push({ id: uid(), date: r.date, kind: 'exam', title: syExamTitle(c, title),
          start: tm?.start || '', end: tm?.end || '', cid: c.id });
      }
    });
    courseBackup = courseSnap(c); // 閉じるときの「変更を捨てる」で消えないように
    renderDetail();
    syDlg.close();
  };
  $('#syClose').onclick = () => syDlg.close();
}

/* ===== ウィジェット用（設定とデータ） ===== */
const WG_DAYS = [3, 7, 14, 30];

// 設定を読む（入ってなければ初期値）
function wgCfg() {
  const w = state.widget || {};
  const own = state.points?.owned || [];
  return {
    after: w.after === 'end' ? 'end' : 'next',
    days: WG_DAYS.includes(w.days) ? w.days : 7,
    theme: own.includes(w.theme) ? w.theme : ''
  };
}

// ウィジェットに渡すデータ（今日から7日後まで）
function wgData() {
  const cfg = wgCfg(), t = term(), now = new Date();
  const today = addDays(now, 0);
  const days = [];
  for (let i = 0; i <= 7; i++) {
    const d = addDays(today, i), k = ymd(d);
    const at = new Set(attendOn(d, t));
    const classes = (state.useGrid ? coursesOn(d, t) : []).map(c => {
      const o = occurrence(c, d);
      const tm = state.times[c.period - 1] || {};
      const od = !at.has(c);
      return {
        period: c.period,
        name: nm(c) + (od ? '（オンデマ）' : ''),
        room: od ? '' : (c.room || ''),
        start: o ? tm.start : '',
        end: o ? tm.end : '',
        items: od ? [] : itemsFor(c, o ? o.start : d).map(x => x.text.trim()).filter(Boolean)
      };
    });
    const events = eventsOn(k).map(e => ({
      kind: (typeof EV_LABEL !== 'undefined' && EV_LABEL[e.kind]) || 'その他',
      title: e.title || '',
      start: e.start || '',
      end: e.end || ''
    })).sort((a, b) => (a.start || '99').localeCompare(b.start || '99'));
    days.push({ date: k, label: md(d), classes, events });
  }
  // 締め切りが近い課題（過ぎたものも入れる）
  const lim = ymd(addDays(today, cfg.days));
  const tasks = [];
  for (const c of [...courses(), ...taskGroups()]) for (const x of c.tasks)
    if (!x.done && x.due && x.due <= lim)
      tasks.push({ title: x.title || '', due: x.due, from: c.short || c.name || '' });
  tasks.sort((a, b) => a.due.localeCompare(b.due));
  return { v: 1, made: now.toISOString(), after: cfg.after, taskDays: cfg.days, theme: cfg.theme, days, tasks: tasks.slice(0, 20) };
}
window.wgData = wgData;

// 設定画面の「ウィジェット」欄（「通知とウィジェット」の中に入る）
{
  const wBox = document.createElement('div');
  wBox.className = 'wgBox';
  wBox.innerHTML =
    '<h3 class="wgHead">ウィジェット</h3>' +
    '<div class="row nRow">授業が全部終わったら <select id="wAfter">' +
    '<option value="next">明日の1限を出す</option>' +
    '<option value="end">「今日はおしまい」と出す</option></select></div>' +
    '<div class="row nRow">課題の締め切り <select id="wDays">' +
    WG_DAYS.map(n => `<option value="${n}">${n}日以内</option>`).join('') +
    '</select></div>' +
    '<p class="hint">締め切りを過ぎた課題も出すよ</p>' +
    '<div class="row nRow">デザイン <select id="wTheme"></select></div>' +
    '<p class="hint">ポイントの交換所でデザインが増えるよ</p>';
  // いったん置いておけば、設定を開いたときに placeSecs が通知の項目へ移す
  $('#aiBox').before(wBox);

  // 項目の名前を「通知とウィジェット」に
  const ns = $('#setNotify > summary');
  if (ns) {
    const sml = ns.querySelector('small');
    const lab = [...ns.childNodes].find(n => n !== sml && !n.contains?.(sml) && n.textContent.trim());
    if (lab) lab.textContent = '通知とウィジェット ';
  }

  const syncWgUI = () => {
    if (!$('#wAfter')) return;
    const c = wgCfg();
    const own = state.points?.owned || [];
    $('#wAfter').value = c.after;
    $('#wDays').value = String(c.days);
    $('#wTheme').innerHTML = '<option value="">📘 シンプル</option>' +
      WG_THEMES.filter(t => own.includes(t[0]))
        .map(t => `<option value="${t[0]}">${t[2].split(' ')[0]} ${t[1]}</option>`).join('');
    $('#wTheme').value = c.theme;
  };
  window.syncWgUI = syncWgUI;
  $('#wAfter').onchange = e => { state.widget = { ...wgCfg(), after: e.target.value }; save(); };
  $('#wDays').onchange = e => { state.widget = { ...wgCfg(), days: Number(e.target.value) }; save(); };
  $('#wTheme').onchange = e => { state.widget = { ...wgCfg(), theme: e.target.value }; save(); };
  setTimeout(syncWgUI, 0);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) syncWgUI(); });
}

/* ===== ウィジェットへデータを渡す ===== */
const WG_GROUP = 'group.io.github.akkeymorimori.gakulog';
async function wgPush() {
  const WB = window.Capacitor?.Plugins?.WidgetBridgePlugin;
  if (!WB) return; // Web版では何もしない
  try {
    await WB.setItem({ key: 'gakulog', group: WG_GROUP, value: JSON.stringify(wgData()) });
    await WB.reloadAllTimelines();
  } catch (e) { console.warn('widget', e); }
}
setTimeout(wgPush, 0);
document.addEventListener('visibilitychange', () => { if (document.hidden) wgPush(); });

/* ===== 収入：バイト先ごとの円グラフ ===== */
function jobPie(jobs, total) {
  const num = v => +String(v ?? '').replace(/[^\d.]/g, '') || 0;
  const goal = num(state.incomeGoal);
  const limit = num(state.incomeLimit ?? $('#inLimit')?.value);
  if (!goal && !limit && jobs.size < 2) return '';
  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#84cc16'];
  const top = limit || goal;                       // 100%にする額
  const base = top ? Math.max(top, total) : total;
  if (!base) return '';
  const rows = [...jobs].sort((a, b) => b[1] - a[1]);
  const per = top || total;
  let deg = 0;
  const seg = [];
  const leg = rows.map(([j, v], i) => {
    const c = COLORS[i % COLORS.length], d = v / base * 360;
    seg.push(`${c} ${deg}deg ${deg + d}deg`);
    deg += d;
    return `<li><i style="background:${c}"></i>${esc(j)}<span>${yen(v)} <small>${Math.round(v / per * 100)}%</small></span></li>`;
  });
  if (deg < 359.9) {
    seg.push(`var(--line, #d1d5db) ${deg}deg 360deg`);
    leg.push(`<li class="rest"><i></i>${limit ? '上限まで' : 'まだ'}<span>${yen(top - total)}</span></li>`);
  }
  // 目標の位置に線を引く（上限があって、目標が上限より下のときだけ）
  let mark = '';
  if (limit && goal && goal < limit) {
    const a = goal / base * 360;
    mark = `conic-gradient(from ${a - 1}deg, #111 0 2deg, transparent 0),`;
    leg.push(`<li class="goal"><i></i>目標<span>${yen(goal)}</span></li>`);
  }
  const pct = top ? Math.floor(total / top * 100) : 100;
  const center = top
    ? `<small>${limit ? '上限の' : '目標の'}</small><b>${pct}%</b>`
    : `<small>合計</small><b>${yen(total)}</b>`;
  let msg = '';
  if (goal) msg += total < goal
    ? `<p class="gpMsg">目標まであと <b>${yen(goal - total)}</b></p>`
    : `<p class="gpMsg done">目標達成！ ${yen(total - goal)} こえてる</p>`;
  if (limit) msg += total <= limit
    ? `<p class="gpMsg">上限まであと <b>${yen(limit - total)}</b></p>`
    : `<p class="gpMsg over">上限を ${yen(total - limit)} こえてる</p>`;
  return `<div class="gPie"><div class="gpChart" style="background:${mark}conic-gradient(${seg.join(',')})">` +
    `<div class="gpIn">${center}</div></div><ul class="gpLeg">${leg.join('')}</ul></div>` + msg;
}

/* ===== 収入：年の切り替えを年間の合計のすぐ上へ ===== */
{
  const yr = $('#inYear')?.parentElement;
  const sum = $('#inSummary');
  if (yr && sum && yr !== sum.parentElement) sum.before(yr);
}

/* ===== 遅刻 ===== */
{
  // 授業詳細：欠席の「追加」の横に「遅刻」ボタン、欠席一覧の下に遅刻一覧
  const btn = document.createElement('button');
  btn.type = 'button'; btn.id = 'lateAdd'; btn.textContent = '遅刻';
  $('#absAdd').after(btn);
  const sum = document.createElement('p');
  sum.id = 'lateSummary'; sum.className = 'hint';
  const ul = document.createElement('ul');
  ul.id = 'lateList';
  $('#absList').after(sum, ul);

  btn.onclick = () => {
    const d = $('#absDate').value;
    if (!d) return alert('遅刻した日を選んでね');
    const c = cur();
    c.lates ??= [];
    if (c.lates.includes(d)) return alert('その日の遅刻はもう記録してあるよ');
    if (c.absences.includes(d)) return alert('その日は欠席で記録してあるよ');
    c.lates.push(d);
    save(); renderDetail(); renderGrid();
  };
  ul.addEventListener('click', e => {
    const d = e.target.dataset.ldel;
    if (!d) return;
    cur().lates = cur().lates.filter(x => x !== d);
    save(); renderDetail(); renderGrid();
  });

  // 授業詳細を描くたびに遅刻の欄も描く
  const baseDetail = renderDetail;
  renderDetail = function () {
    baseDetail();
    const c = cur();
    if (!c) return;
    const a = absInfo(c), r = state.lateRule;
    $('#lateSummary').textContent = `遅刻 ${a.late}回` +
      (r ? `（${r}回で欠席1回。今は欠席${Math.floor(a.late / r)}回ぶん）` : '（欠席には数えない設定）');
    $('#lateList').innerHTML = (c.lates || []).slice().sort().map(d =>
      `<li><span>${md(parseYmd(d))} 遅刻</span><button class="x" data-ldel="${d}" aria-label="削除">×</button></li>`).join('');
    if (a.late) $('#cMoreSum').textContent += `・遅刻${a.late}回`;
  };

  // 設定：「欠席の上限をまとめて設定」の下に換算ルール
  const box = $('.absBulk');
  if (box) {
    const row = document.createElement('div');
    row.className = 'row lateRule';
    row.innerHTML = '<span>遅刻は</span><select id="lateRule">' +
      '<option value="0">欠席に数えない</option>' +
      '<option value="2">2回で欠席1回</option>' +
      '<option value="3">3回で欠席1回</option>' +
      '<option value="4">4回で欠席1回</option></select>';
    box.append(row);
    $('#lateRule').onchange = e => {
      state.lateRule = +e.target.value;
      save(); renderAll();
    };
    // state を読み込んだあとに今の設定を入れる
    setTimeout(() => { $('#lateRule').value = String(state.lateRule); }, 0);
  }
}

/* ===== 共有グループ：自分で作った名目も送る ===== */
const grKinds = new Map(); // 相手の名目 id → { name, color }
const okKindId = v => typeof v === 'string' && /^k-[\w-]{1,40}$/.test(v);
const okKindColor = v => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v);
const grKindStyle = document.createElement('style');
document.head.append(grKindStyle);

function kindMeta(id) {
  const k = state.evKinds.find(x => x.id === id);
  if (k) return { name: k.name, color: k.color };
  return grKinds.get(id) || null;
}

// 共有された予定の中にある、相手の名目を使えるようにする
function grKindsSync() {
  grKinds.clear();
  for (const e of window.grShared || []) {
    if (!okKindId(e.kind) || !e.kName) continue;
    if (state.evKinds.some(k => k.id === e.kind)) continue;
    grKinds.set(e.kind, { name: e.kName, color: okKindColor(e.kColor) ? e.kColor : '#8b5cf6' });
  }
  for (const [id, m] of grKinds) EV_LABEL[id] = m.name;
  // 自分の名目と同じ見せ方（文字は白か黒の読める方、今日の流れは時刻の前に色の●）
  grKindStyle.textContent = [...grKinds].map(([id, m]) =>
    `.ev.${id}{background:${m.color};color:${inkOn(m.color)}}` +
    `.flow li.f-${id} .ft::before{content:'●';font-size:9px;margin-right:3px;vertical-align:1px;color:${m.color}}`).join('');
  // 予定を変えるときに選べるように
  const sel = $('#evKind');
  if (!sel) return;
  const v = sel.value;
  sel.querySelectorAll('option[data-gr]').forEach(o => o.remove());
  const before = sel.querySelector('option[value="__newkind"]');
  for (const [id, m] of grKinds) {
    const o = new Option(`${m.name}（共有）`, id);
    o.dataset.gr = '1';
    sel.add(o, before);
  }
  if ([...sel.options].some(o => o.value === v)) sel.value = v;
}

// 送るとき：名目の名前と色もつける
{
  const base = grData;
  grData = function (v) {
    const o = base(v);
    const m = okKindId(o.kind) ? kindMeta(o.kind) : null;
    if (m) { o.kName = m.name; o.kColor = m.color; }
    return o;
  };
}

// 受け取るとき：自分の名目と同じなら自分の名目で、ちがえば相手の名目で出す
{
  const base = toGrEv;
  toGrEv = function (gid, d) {
    const e = base(gid, d), x = d.data();
    if (!okKindId(x.kind)) return e;
    const name = String(x.kName || '').trim().slice(0, 10);
    const mine = state.evKinds.find(k => k.id === x.kind) ||
      (name && state.evKinds.find(k => k.name === name));
    if (mine) e.kind = mine.id;
    else if (name) {
      e.kind = x.kind;
      e.kName = name;
      e.kColor = okKindColor(x.kColor) ? x.kColor : '#8b5cf6';
    }
    return e;
  };
}

// 共有の予定が届いたとき・名目を作り直したときに入れ直す
{
  const baseCache = grSaveCache;
  grSaveCache = function () { baseCache(); grKindsSync(); };
  const baseKinds = applyKinds;
  applyKinds = function () { baseKinds(); grKindsSync(); };
}
setTimeout(() => { grKindsSync(); renderAll(); }, 0);

/* ===== 時間割の共有：QRコード ===== */
{
  // 送る側：「送る」の下に「QRコードを出す」
  const qBtn = document.createElement('button');
  qBtn.type = 'button'; qBtn.id = 'shareQrBtn'; qBtn.textContent = 'QRコードを出す';
  const qBox = document.createElement('div');
  qBox.id = 'shareQr'; qBox.hidden = true;
  $('#shareSend').after(qBtn, qBox);

  const closeQr = () => { qBox.hidden = true; qBtn.textContent = 'QRコードを出す'; };
  qBtn.onclick = () => {
    if (!qBox.hidden) return closeQr();
    if (!shareCode) return alert('共有コードを作ってる途中だよ。少し待ってもう一回押してね');
    if (typeof qrcode !== 'function') return alert('QRコードの部品が読み込めてないみたい');
    const text = `${SHARE_TAG}.${shareCode}`;
    try {
      const qr = qrcode(0, 'L');
      qr.addData(text);
      qr.make();
      qBox.innerHTML = qr.createSvgTag(4, 4) +
        '<p class="hint">相手のがくログで「📷 QRコードを読む」を押して、これを撮ってもらってね</p>';
    } catch {
      return alert('授業が多すぎてQRコードに入りきらなかった。「送る」のほうを使ってね');
    }
    qBox.hidden = false;
    qBtn.textContent = 'QRコードを閉じる';
  };
  // 持ち物・休みを入れるかを変えたら、古いQRは閉じる
  for (const id of ['#shareItems', '#shareOff']) $(id)?.addEventListener('change', closeQr);
  $('#shareSec').addEventListener('toggle', e => { if (!e.target.open) closeQr(); });

  // 読む側：「読み込む」の横に「QRコードを読む」
  const rBtn = document.createElement('label');
  rBtn.className = 'fileBtn';
  rBtn.innerHTML = '📷 QRコードを読む<input type="file" accept="image/*" class="vh" id="shareQrIn">';
  $('#shareRead').after(rBtn);

  $('#shareQrIn').onchange = async e => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f) return;
    if (typeof jsQR !== 'function') return alert('QRコードの部品が読み込めてないみたい');
    const url = URL.createObjectURL(f);
    try {
      const img = await new Promise((ok, ng) => {
        const i = new Image();
        i.onload = () => ok(i); i.onerror = ng; i.src = url;
      });
      // 大きすぎる写真は縮める（細かいQRがつぶれない程度に）
      const sc = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
      const cv = document.createElement('canvas');
      cv.width = Math.round(img.naturalWidth * sc);
      cv.height = Math.round(img.naturalHeight * sc);
      const cx = cv.getContext('2d', { willReadFrequently: true });
      cx.drawImage(img, 0, 0, cv.width, cv.height);
      const r = jsQR(cx.getImageData(0, 0, cv.width, cv.height).data, cv.width, cv.height);
      if (!r || !r.data.includes(SHARE_TAG))
        return alert('共有のQRコードが見つからなかった。QRを大きめに、ピントを合わせて撮り直してね');
      $('#shareIn').value = r.data;
      $('#shareRead').click();
    } catch {
      alert('画像を開けなかった。別の画像で試してみて');
    } finally {
      URL.revokeObjectURL(url);
    }
  };
}

/* ===== 空きコママッチ ===== */
{
  const fmDlg = document.createElement('dialog');
  fmDlg.id = 'freeDlg';
  fmDlg.innerHTML =
    '<b>空きコママッチ</b>' +
    '<p class="hint">緑はみんな空いてるコマ。数字は空いてる人数。マスをタップすると名前が出るよ</p>' +
    '<div class="fmPeople" id="fmPeople"></div>' +
    '<div class="fmWrap"><table class="fmTbl" id="fmTbl"></table></div>' +
    '<button type="button" id="fmClose">閉じる</button>';
  document.body.append(fmDlg);
  $('#shareRead').insertAdjacentHTML('afterend',
    '<button type="button" id="fmAdd">🤝 空きコマを比べる</button>');

  let fmList = [];
  const busyOf = cs => new Set(cs.filter(c => c.day >= 0).map(c => c.day + '-' + c.period));

  const renderFree = () => {
    const all = [{ name: '自分', busy: busyOf(courses()) }, ...fmList];
    const sat = state.showSat || all.some(p => [...p.busy].some(k => k.startsWith('5-')));
    const days = sat ? 6 : 5;
    const maxP = Math.max(state.periods,
      ...all.flatMap(p => [...p.busy].map(k => +k.split('-')[1])));
    $('#fmPeople').innerHTML = all.map((p, i) =>
      `<span class="fmChip">${esc(p.name)}` +
      (i ? `<button type="button" data-fmdel="${i - 1}" aria-label="外す">×</button>` : '') +
      '</span>').join('');
    let h = '<tr><th></th>' + DAYS.slice(0, days).map(d => `<th>${d}</th>`).join('') + '</tr>';
    for (let p = 1; p <= maxP; p++) {
      h += `<tr><th>${p}</th>`;
      for (let d = 0; d < days; d++) {
        const free = all.filter(x => !x.busy.has(d + '-' + p));
        const cls = free.length === all.length ? 'all' : free.length ? 'some' : '';
        h += `<td class="${cls}" data-fm="${esc(`${DAYS[d]}${p}限：` +
          (free.length ? free.map(x => x.name).join('、') : '空いてる人はいないよ'))}">${free.length}</td>`;
      }
      h += '</tr>';
    }
    $('#fmTbl').innerHTML = h;
  };

  $('#fmAdd').onclick = async () => {
    const raw = $('#shareIn').value.replace(/\s+/g, '');
    const m = raw.match(new RegExp(`${SHARE_TAG}\\.([zp])\\.([A-Za-z0-9_-]+)`));
    if (!m) return alert('先に友だちの共有コードを貼るか、QRコードを読んでね');
    let d;
    try { d = parseShare(JSON.parse(await unpackText(m[1], m[2]))); }
    catch { return alert('コードが途中で切れてるか、壊れてるみたい'); }
    const name = (prompt('誰の時間割？', `友だち${fmList.length + 1}`) || '').trim().slice(0, 10);
    if (!name) return;
    fmList.push({ name, busy: busyOf(d.courses) });
    $('#shareIn').value = '';
    renderFree();
    if (!fmDlg.open) fmDlg.showModal();
  };

  fmDlg.onclick = e => {
    const del = e.target.closest('[data-fmdel]');
    if (del) { fmList.splice(+del.dataset.fmdel, 1); renderFree(); return; }
    const td = e.target.closest('td[data-fm]');
    if (td) alert(td.dataset.fm);
  };
  $('#fmClose').onclick = () => { fmDlg.close(); fmList = []; };
}

/* ===== 他のアプリから共有された画像・PDFを受け取る（アプリ版だけ） ===== */
{
  const ST = window.Capacitor?.Plugins?.CapacitorShareTarget;
  // [種類, ボタンの文字, 説明, 入れる欄, PDFが読めるか, 複数枚いけるか]
  const ROUTES = [
    ['shift', '💼 シフト表', '自分の勤務をカレンダーに追加', '#shFile', true, true],
    ['grid', '📚 時間割', '授業をまとめて登録', '#imgFile', false, true],
    ['pay', '💴 給与明細', '支給日と金額を収入に記録', '#scanFile', false, true],
  ];
  const inDlg = document.createElement('dialog');
  inDlg.id = 'inShareDlg';
  inDlg.innerHTML =
    '<div class="dlg">' +
    '<div class="dlgHead"><h2>届いたファイル</h2>' +
    '<button type="button" class="x" id="inShareX" aria-label="閉じる">×</button></div>' +
    '<p class="hint" id="inShareInfo"></p>' +
    ROUTES.map(([k, l, d]) =>
      `<button type="button" class="phOpt" data-inshare="${k}"><b>${l}</b><small>${d}</small></button>`).join('') +
    '</div>';
  document.body.append(inDlg);

  let inFiles = [];
  const isPdf = f => f.type === 'application/pdf' || /\.pdf$/i.test(f.name);
  const toFile = async f => {
    const res = await fetch(window.Capacitor.convertFileSrc(f.uri));
    const b = await res.blob();
    return new File([b], f.name || 'shared', { type: f.mimeType || b.type });
  };
  const putFiles = (sel, files) => {
    const inp = $(sel);
    if (!inp) return alert('読み込み先が見つからなかった');
    const dt = new DataTransfer();
    files.forEach(f => dt.items.add(f));
    inp.files = dt.files;
    inp.dispatchEvent(new Event('change', { bubbles: true }));
  };

  if (ST) ST.addListener('shareReceived', async ev => {
    // バックアップ（JSON）が届いたら復元へ
    const js = (ev.files || []).find(f =>
      /json/.test(f.mimeType || '') || /\.json$/i.test(f.name || ''));
    if (js) {
      try { putFiles('#restoreFile', [await toFile(js)]); }
      catch { alert('ファイルを開けなかった。もう一回送ってみてね'); }
      return;
    }
    const fs = (ev.files || []).filter(f =>
      /^image\/|pdf$/.test(f.mimeType || '') || /\.pdf$/i.test(f.name || ''));
    if (!fs.length) return;
    try { inFiles = await Promise.all(fs.map(toFile)); }
    catch { return alert('ファイルを開けなかった。もう一回送ってみてね'); }
    const pdf = inFiles.some(isPdf);
    inDlg.querySelectorAll('[data-inshare]').forEach(b => {
      b.hidden = pdf && !ROUTES.find(r => r[0] === b.dataset.inshare)[4];
    });
    $('#inShareInfo').textContent = `${inFiles.length}件届いたよ。何として読む？` +
      (pdf ? '（PDFはシフト表だけ読めるよ）' : '');
    if (!inDlg.open) inDlg.showModal();
  });

  inDlg.onclick = e => {
    const b = e.target.closest('[data-inshare]');
    if (!b) return;
    const [kind, , , sel, , multi] = ROUTES.find(r => r[0] === b.dataset.inshare);
    const files = multi ? inFiles : inFiles.slice(0, 1);
    inDlg.close();
    inFiles = [];
    if (!hasKey()) return openPhoto('guide');
    goPhoto(kind);
    setTimeout(() => putFiles(sel, files), 50);
  };
  $('#inShareX').onclick = () => { inDlg.close(); inFiles = []; };
}

/* ===== ウィジェットのプレビュー ===== */
var WG_LOOK = {
  '':          { bg: ['#ffffff', '#f2f2f7'], fg: '#111827', ac: '#2563eb', icon: '📘' },
  'wg-mint':   { bg: ['#D9F7EC', '#A7E8D0'], fg: '#134E3A', ac: '#059669', icon: '🌿' },
  'wg-sakura': { bg: ['#FFE4EC', '#FBCFE8'], fg: '#831843', ac: '#DB2777', icon: '🌸' },
  'wg-sky':    { bg: ['#E0F2FE', '#BAE6FD'], fg: '#0C4A6E', ac: '#0284C7', icon: '☁️' },
  'wg-sunset': { bg: ['#FDBA74', '#C084FC'], fg: '#3B0764', ac: '#C2410C', icon: '🌇' },
  'wg-night':  { bg: ['#312E81', '#0F172A'], fg: '#F1F5F9', ac: '#FACC15', icon: '🌙' },
  'wg-gold':   { bg: ['#FEF3C7', '#FCD34D'], fg: '#78350F', ac: '#B45309', icon: '👑' }
};
{
  const dlg = document.createElement('dialog');
  dlg.id = 'wgPrevDlg';
  document.body.append(dlg);
  const toM = s => { const m = /^(\d\d?):(\d\d)$/.exec(s || ''); return m ? +m[1] * 60 + +m[2] : null; };

  // widget.swift の makeContent と同じ決め方
  function prevContent() {
    const d = wgData(), now = new Date(), nowM = now.getHours() * 60 + now.getMinutes();
    const [dT, dM] = d.days;
    let title = '次の授業', msg = '';
    let next = dT.classes.find(c => (toM(c.start) ?? 1e9) > nowM);
    if (!next) {
      if (d.after === 'next' && dM?.classes[0]) { next = dM.classes[0]; title = '明日'; }
      else msg = d.after === 'next' ? '明日は授業なし' : '今日はおしまい';
    }
    const today = dT.events.filter(e => { const x = toM(e.end || e.start); return x == null || x > nowM; })
      .map(e => (e.start ? e.start + ' ' : '') + (e.title || e.kind));
    return { title, next, msg, today };
  }

  function prevHTML(id, size) {
    const L = WG_LOOK[id] || WG_LOOK[''], c = prevContent(), max = size === 's' ? 2 : 3;
    const head = `<div class="wpH" style="color:${L.ac}">${esc(c.title)}</div>`;
    const nx = c.next
      ? `<div class="wpN"><span class="wpP" style="background:${L.ac}">${c.next.period}限</span><b>${esc(c.next.name)}</b></div>` +
        `<small>${esc([c.next.start, c.next.room].filter(Boolean).join('・'))}</small>`
      : `<div>${esc(c.msg)}</div>`;
    const list = `<div class="wpH" style="color:${L.ac}">今日の予定</div>` +
      (c.today.length ? c.today.slice(0, max).map(t =>
        `<div class="wpL"><i style="background:${L.ac}"></i>${esc(t)}</div>`).join('') : '<small>なし</small>') +
      (c.today.length > max ? `<small>ほか${c.today.length - max}件</small>` : '');
    return `<div class="wp wp-${size}" style="background:linear-gradient(135deg,${L.bg[0]},${L.bg[1]});color:${L.fg}">` +
      (size === 's' ? head + nx + list : `<div class="wpCol">${head + nx}</div><div class="wpCol">${list}</div>`) +
      `<span class="wpI">${L.icon}</span></div>`;
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-wgprev]');
    if (!b) return;
    const s = WG_THEMES.find(t => t[0] === b.dataset.wgprev);
    if (!s) return;
    dlg.innerHTML =
      `<div class="dlgHead"><h2>${esc(s[1])}</h2><button type="button" class="x big" data-wpclose aria-label="閉じる">×</button></div>` +
      '<div class="wpWrap">' + prevHTML(s[0], 's') + prevHTML(s[0], 'm') + '</div>' +
      `<p class="hint">今日の中身で表示してるよ。${s[3]}pで交換できる</p>`;
    dlg.showModal();
  });
  dlg.addEventListener('click', e => {
    if (e.target.closest('[data-wpclose]') || e.target === dlg) dlg.close();
  });
}

/* ===== 予定が書いてある画像から読み取る（手帳・プリント・LINEやメールのスクショなど） ===== */
{
  const memoPrompt = () => {
    const now = new Date();
    return `これは予定が書いてある画像です（手帳や手書きのメモ、ホワイトボード、プリント、LINEなどのトーク画面やメールのスクリーンショットなど）。書いてある予定を読み取って、JSON配列だけを出力してください。説明文やコードブロック記号は書かないでください。
今日は${now.getFullYear()}年${md(now)}です。
形式: [{"month":10,"day":17,"start":"18:00","end":"22:00","title":"バイト","kind":"job","place":"駅前店"}]
ルール:
- monthとdayは数字で。年は書かない。
- 「明日」「あさって」「来週の金曜」のような日付は、画像の中のメッセージやメールの日付を基準に、なければ今日を基準に、月と日に直す。「そのうち」「今度」など日が決まらないものは出力しない。
- トークやメールでは、決まった予定だけを出す。誘っているだけで決まっていないもの、「やっぱり中止」などで取り消されたものは出力しない。同じ予定が何回も出てきたら1つにまとめる。
- 1つの日に予定が2つ以上あれば、それぞれ別の要素にする。
- startとendは24時間表記のHH:MM。終わりが書いてなければ end は ""。時刻がない予定は start も end も ""。
- 「午後3時」は "15:00"、「18-22」は start "18:00"・end "22:00" のように直す。
- titleは20文字以内。手帳やメモは書いてある言葉をそのまま、トークやメールは要点だけにする（例：「駅前集合」「ゼミ飲み」）。読めない字は推測で埋めず、読めた部分だけにする。
- kindは、バイト・シフト・勤務なら "job"、試験・テスト・小テストなら "exam"、それ以外は "other"。
- placeは場所（店名・教室・駅・集合場所など）が書いてあれば20文字以内で、なければ ""。
- 線で消してある予定は出力しない。
- 予定が見つからなければ [] だけを出力する。`;
  };

  // 年は書いてないので、今日にいちばん近い年にする
  const memoYmd = (m, d) => {
    m = +m; d = +d;
    if (!(m >= 1 && m <= 12 && d >= 1 && d <= 31)) return '';
    const now = new Date(), y0 = now.getFullYear();
    let best = null;
    for (const y of [y0 - 1, y0, y0 + 1]) {
      const dt = new Date(y, m - 1, d);
      if (dt.getMonth() !== m - 1) continue;
      if (!best || Math.abs(dt - now) < Math.abs(best - now)) best = dt;
    }
    return best ? ymd(best) : '';
  };
  const memoTime = v => {
    const m = String(v || '').match(/^(\d{1,2}):(\d{2})$/);
    if (!m || +m[1] > 23 || +m[2] > 59) return '';
    return `${pad(+m[1])}:${m[2]}`;
  };
  const kindIds = () => ['job', 'exam', 'other', ...(state.evKinds || []).map(k => k.id)];
  const kindName = id => EV_LABEL[id] || (state.evKinds || []).find(k => k.id === id)?.name || id;
  const kindOpts = v => kindIds().map(id =>
    `<option value="${id}"${id === v ? ' selected' : ''}>${esc(kindName(id))}</option>`).join('');

  const mmDlg = document.createElement('dialog');
  mmDlg.id = 'memoDlg';
  mmDlg.innerHTML =
    '<div class="dlg">' +
    '<div class="dlgHead"><h2>画像から予定を追加</h2>' +
    '<button type="button" class="x big" id="mmX" aria-label="閉じる">×</button></div>' +
    '<label class="fileBtn">写真を選ぶ<input type="file" id="mmFile" accept="image/*" multiple class="vh"></label>' +
    '<p class="hint" id="mmPicked">手帳・プリント・LINEやメールのスクショなど。文字が読めるように写してね</p>' +
    '<button type="button" class="primary" id="mmRun" disabled>読み取る</button>' +
    '<p id="mmStatus" class="hint" aria-live="polite"></p>' +
    '<div id="mmResult"></div>' +
    '</div>';
  document.body.append(mmDlg);

  // 「写真から追加」の選択肢に足す
  $('#phPick').insertAdjacentHTML('beforeend',
    '<button type="button" class="phOpt" data-ph="memo"><b>📝 予定が書いてある画像</b><small>手帳・プリント・LINEやメールのスクショなどから予定をカレンダーに追加</small></button>');

  let mmRows = [];
  window.openMemo = () => {
    $('#mmFile').value = '';
    $('#mmRun').disabled = true;
    $('#mmPicked').textContent = '手帳・プリント・LINEやメールのスクショなど。文字が読めるように写してね';
    $('#mmStatus').textContent = '';
    $('#mmResult').innerHTML = '';
    mmRows = [];
    if (!mmDlg.open) mmDlg.showModal();
    mmDlg.scrollTop = 0;
  };
  $('#mmX').onclick = () => mmDlg.close();

  $('#mmFile').onchange = e => {
    const n = e.target.files.length;
    $('#mmRun').disabled = !n;
    $('#mmPicked').textContent = n ? `${n}枚選んだよ` : '手帳・プリント・LINEやメールのスクショなど。文字が読めるように写してね';
  };

  $('#mmRun').onclick = async () => {
    const files = [...$('#mmFile').files], st = $('#mmStatus');
    if (!files.length) return;
    $('#mmRun').disabled = true;
    $('#mmResult').innerHTML = '';
    mmRows = [];
    try {
      for (let i = 0; i < files.length; i++) {
        st.textContent = `読み取り中…（${i + 1}/${files.length}枚目）`;
        const txt = await callVision(await fileToJpegBase64(files[i], 2000), memoPrompt(), st);
        const s = txt.indexOf('['), e = txt.lastIndexOf(']');
        if (s < 0 || e < s) throw new Error('結果がうまく読めなかった。明るい所で撮り直すか、別のモデルで試してみて');
        for (const r of JSON.parse(txt.slice(s, e + 1))) {
          const date = memoYmd(r?.month, r?.day);
          if (!date) continue;
          mmRows.push({
            on: true, date,
            start: memoTime(r.start), end: memoTime(r.end),
            title: String(r.title || '').trim().slice(0, 60),
            kind: kindIds().includes(r.kind) ? r.kind : 'other',
            place: String(r.place || '').trim().slice(0, 60)
          });
        }
      }
      mmRows.sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
      st.textContent = mmRows.length ? '読めた予定を確認してね。違うところはここで直せるよ' : '予定が見つからなかった';
      renderMemo();
    } catch (err) {
      st.textContent = err?.message || '読み取れなかった';
    } finally {
      $('#mmRun').disabled = false;
    }
  };

  function renderMemo() {
    const n = mmRows.filter(r => r.on).length;
    $('#mmResult').innerHTML = mmRows.length
      ? '<ul class="mmList">' + mmRows.map((r, i) =>
          `<li class="${r.on ? '' : 'off'}">` +
          `<div class="mmTop"><input type="checkbox" data-i="${i}" data-f="on"${r.on ? ' checked' : ''}>` +
          `<input type="date" data-i="${i}" data-f="date" value="${r.date}">` +
          `<select data-i="${i}" data-f="kind">${kindOpts(r.kind)}</select></div>` +
          `<div class="mmTime"><input type="time" data-i="${i}" data-f="start" value="${r.start}">〜` +
          `<input type="time" data-i="${i}" data-f="end" value="${r.end}"></div>` +
          `<div class="mmTitle"><input data-i="${i}" data-f="title" value="${esc(r.title)}" placeholder="予定の名前" maxlength="60"></div>` +
          // 場所：空なら、その名前の「いつもの場所」を入れる
          `<div class="mmTitle"><input data-i="${i}" data-f="place" value="${esc(r.place)}" maxlength="60" aria-label="場所" ` +
          `placeholder="${esc(evPlaceDefault(r.title) ? `${PIN} いつもの場所：${evPlaceDefault(r.title)}` : `${PIN} 場所（なくてもOK）`)}"></div>` +
          '</li>').join('') + '</ul>' +
        `<button type="button" class="primary" id="mmAdd"${n ? '' : ' disabled'}>${n}件をカレンダーに追加</button>`
      : '';
  }

  $('#mmResult').addEventListener('change', e => {
    const el = e.target, r = mmRows[el.dataset.i];
    if (!r || !el.dataset.f) return;
    if (el.dataset.f === 'on') { r.on = el.checked; renderMemo(); return; }
    r[el.dataset.f] = el.value;
  });
  $('#mmResult').addEventListener('input', e => {
    const el = e.target, r = mmRows[el.dataset.i];
    if (r && (el.dataset.f === 'title' || el.dataset.f === 'place')) r[el.dataset.f] = el.value;
  });

  $('#mmResult').addEventListener('click', e => {
    if (e.target.id !== 'mmAdd') return;
    const picks = mmRows.filter(r => r.on && isYmd(r.date));
    if (!picks.length) return;
    const dup = r => state.events.some(x => x.date === r.date && x.start === r.start && x.title === r.title);
    const add = picks.filter(r => !dup(r));
    const skipped = picks.length - add.length;
    mmDlg.close();
    if (!add.length) return toast(`${skipped}件とも、もう入ってたよ`);
    withUndo(`${add.length}件の予定を追加したよ` + (skipped ? `（${skipped}件は入ってたので飛ばした）` : ''), () => {
      for (const r of add) {
        const place = r.place.trim() || evPlaceDefault(r.title);
        state.events.push({
          id: uid(), date: r.date, kind: r.kind, title: r.title.trim(), start: r.start, end: r.end,
          ...(place && { memo: memoWithPlace('', place) })
        });
      }
    });
  });
}

/* ===== 目覚ましアラーム（アプリ版：iOS 26以降は AlarmKit、Android は AlarmManager で鳴る） ===== */
{
  const AL = window.Capacitor?.Plugins?.GakuAlarm;
  const alAndroid = window.Capacitor?.getPlatform?.() === 'android';
  const okT = v => /^([01]\d|2[0-3]):[0-5]\d$/.test(v || '');
  const atOf = (k, t) => { const d = parseYmd(k); d.setHours(0, toMin(t), 0, 0); return d; };
  let alReady = false, alTimer = 0;
  // アラーム音（'' はスマホの標準の音。ほかは tools/alarm-sounds.mjs で作った音で、iOS側に gaku-<id>.caf、Android に res/raw/gaku_<id>.wav として入ってる）
  const AL_SOUNDS = [['', '標準'], ['pipipi', 'ピピピ'], ['bell', 'ベル'], ['chime', 'チャイム'], ['soft', 'やさしい音']];
  const okS = v => AL_SOUNDS.some(([id]) => id && id === v) ? v : '';
  const sndOpts = v => AL_SOUNDS.map(([id, name]) => `<option value="${id}"${id === v ? ' selected' : ''}>${name}</option>`).join('');

  // その時刻が次に来る日（今日まだなら今日、過ぎてたら明日）
  function alNextDate(at, now = new Date()) {
    const k = ymd(now);
    return atOf(k, at) > now ? k : ymd(addDays(now, 1));
  }
  // 一覧のアラームが鳴る時刻（1回だけなら1つ、くり返しなら days 日ぶん）
  function alTimes(o, days = 14) {
    const now = new Date();
    if (!o.days.length) return o.date ? [atOf(o.date, o.at)].filter(t => t > now) : [];
    const out = [];
    for (let i = 0; i <= days; i++) {
      const d = addDays(now, i);
      if (!o.days.includes(d.getDay())) continue;
      const t = atOf(ymd(d), o.at);
      if (t > now) out.push(t);
    }
    return out;
  }

  // 設定を読む（おかしな値・過ぎたアラームは消す）
  function alCfg() {
    const a = state.alarm && typeof state.alarm === 'object' ? state.alarm : {};
    const today = todayStr(), now = new Date();
    state.alarm = {
      on: !!a.on,
      sound: okS(a.sound), // 授業・バイトの日の音
      cls: Array.from({ length: 10 }, (_, i) => okT(a.cls?.[i]) ? a.cls[i] : ''),
      jobs: (Array.isArray(a.jobs) ? a.jobs : []).filter(r => r && okT(r.until) && okT(r.at))
        .map(r => ({ job: String(r.job || '').trim().slice(0, 20), until: r.until, at: r.at })),
      // 時計アプリみたいなアラーム：時刻・名前・くり返す曜日（0=日〜6=土、空なら1回だけ）・オン/オフ
      // 1回だけのは、オンにしたときに鳴る日（date）を決める。過ぎたらオフにして一覧には残す
      list: (Array.isArray(a.list) ? a.list : []).concat(
        // 前の「1回だけのアラーム」（日付つき）は一覧へ移す
        (Array.isArray(a.once) ? a.once : []).filter(o => o && isYmd(o.date) && okT(o.at)).map(o => ({ ...o, days: [], on: true })))
        .filter(o => o && okT(o.at))
        .map(o => {
          const days = (Array.isArray(o.days) ? o.days : []).filter(d => Number.isInteger(d) && d >= 0 && d <= 6);
          const x = { id: typeof o.id === 'string' && o.id ? o.id : uid(), at: o.at, name: String(o.name || '').trim().slice(0, 20),
            days: [...new Set(days)].sort(), on: o.on !== false, sound: okS(o.sound) };
          if (!x.days.length) {
            if (x.on && isYmd(o.date) && atOf(o.date, o.at) > now) x.date = o.date;
            else if (x.on && isYmd(o.date)) x.on = false; // 鳴り終わった1回だけのアラーム
            else if (x.on) x.date = alNextDate(x.at, now);
          }
          return x;
        }).slice(0, 30),
      skip: (Array.isArray(a.skip) ? a.skip : []).filter(k => isYmd(k) && k >= today)
    };
    return state.alarm;
  }

  // 授業・バイトから決まる、この先 days 日ぶんのアラーム
  function alPlan(days = 14) {
    const a = alCfg(), t = term(), now = new Date(), out = [];
    const base = new Date(); base.setHours(0, 0, 0, 0);
    for (let i = 0; i < days; i++) {
      const day = addDays(base, i), k = ymd(day), hits = [];
      if (state.useGrid) {
        const c = attendOn(day, t)[0];
        const at = c && a.cls[c.period - 1];
        if (at) hits.push({ min: toMin(at), why: `${c.period}限 ${nm(c)}` });
      }
      for (const e of eventsOn(k)) {
        if (e.kind !== 'job' || !grIsMine(e)) continue;
        const s = toMin(e.start);
        if (s == null) continue;
        const name = (e.title || '').trim();
        const r = a.jobs.filter(r => (!r.job || r.job === name) && s <= toMin(r.until))
          .sort((x, y) => (!!y.job - !!x.job) || toMin(x.until) - toMin(y.until))[0];
        if (r) hits.push({ min: toMin(r.at), why: `${name || 'バイト'} ${e.start}から` });
      }
      if (!hits.length) continue;
      hits.sort((x, y) => x.min - y.min);
      const at = new Date(day); at.setHours(0, hits[0].min, 0, 0);
      if (at <= now) continue;
      out.push({ k, at, title: hits.map(h => h.why).join('・').slice(0, 40), skip: a.skip.includes(k) });
    }
    return out;
  }

  // 実際に鳴らす分（自動＋1回だけ）
  function alItems() {
    const a = alCfg();
    if (!a.on) return [];
    return alPlan().filter(x => !x.skip).map(x => ({ at: x.at.getTime(), title: x.title, sound: a.sound }))
      .concat(a.list.filter(o => o.on).flatMap(o => alTimes(o).map(t => ({ at: t.getTime(), title: o.name || 'アラーム', sound: o.sound }))))
      .sort((x, y) => x.at - y.at);
  }

  // アラーム画面
  const dlg = document.createElement('dialog');
  dlg.id = 'alarmDlg';
  dlg.innerHTML =
    '<div class="dlg">' +
    '<div class="dlgHead"><h2>目覚ましアラーム</h2>' +
    '<button type="button" class="x big" id="alX" aria-label="閉じる">×</button></div>' +
    '<p class="hint" id="alNote"></p>' +
    '<label class="alSw"><input type="checkbox" id="alOn"> アラームを使う</label>' +
    '<h4>アラーム</h4>' +
    '<p class="hint">時刻を入れると、次のその時刻に鳴るよ（まだなら今日、過ぎてたら明日）。曜日を選ぶと毎週くり返す</p>' +
    '<div class="alRow"><input type="time" id="alOnceT" value="07:00" aria-label="時刻">' +
    '<input id="alOnceN" class="alName" placeholder="名前（なくてもOK）" maxlength="20"></div>' +
    '<div class="alDays" id="alNewDays" role="group" aria-label="くり返す曜日"></div>' +
    '<div class="alRow alSnd"><span>音</span><select id="alNewSnd" aria-label="アラーム音">' + sndOpts('') + '</select>' +
    '<button type="button" id="alPlay" aria-label="試し聴き">▶</button></div>' +
    '<button type="button" class="primary" id="alOnceAdd">アラームを追加</button>' +
    '<ul id="alOnce" class="alList"></ul>' +
    '<div class="alRow alSnd" id="alAutoRow"><span>授業・バイトの日の音</span><select id="alAutoSnd" aria-label="授業・バイトの日のアラーム音"></select></div>' +
    '<h4>授業がある日</h4>' +
    '<p class="hint">その日の最初の授業で決まるよ。空欄の時限からの日は鳴らない</p>' +
    '<div id="alCls"></div>' +
    '<h4>バイトがある日</h4>' +
    '<p class="hint">バイト先を空欄にすると全部のバイトに使うよ。どれにも当てはまらない日は鳴らない</p>' +
    '<div id="alJobs"></div>' +
    '<button type="button" id="alJobAdd">＋ ルールを足す</button>' +
    '<datalist id="alJobNames"></datalist>' +
    '<h4>この先1週間</h4>' +
    '<p class="hint">授業とバイトが両方ある日は、早いほうで1回だけ鳴らすよ。上の「アラーム」は別に鳴る</p>' +
    '<ul id="alNext" class="alNext"></ul>' +
    '</div>';
  document.body.append(dlg);

  // 学期の横の ⏰ ボタン
  const hb = document.createElement('button');
  hb.type = 'button';
  hb.id = 'alHead';
  hb.className = 'alHead';
  hb.setAttribute('aria-label', '目覚ましアラーム');
  hb.innerHTML = '⏰<small id="alHeadT"></small>';
  $('#termSelect').before(hb);
  hb.onclick = () => openAlarm();

  function updHead() {
    const n = alItems()[0];
    $('#alHeadT').textContent = n && n.at - Date.now() < 86400000 ? hm(new Date(n.at)) : '';
  }

  // 曜日の並び（カレンダーの週のはじまりに合わせる）
  const alDayOrder = () => state.weekStart === 'sun' ? [0, 1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6, 0];
  // 「毎日」「平日」「月・水」「明日 7:00」など
  function alWhen(o) {
    const d = o.days;
    if (d.length === 7) return '毎日';
    if (d.join() === '1,2,3,4,5') return '平日';
    if (d.join() === '0,6') return '土日';
    if (d.length) return '毎週 ' + alDayOrder().filter(i => d.includes(i)).map(i => WEEK[i]).join('・');
    if (!o.on || !o.date) return '1回だけ';
    const n = evDayDiff(todayStr(), o.date);
    return n === 0 ? '今日' : n === 1 ? '明日' : md(parseYmd(o.date));
  }
  // 次に鳴るまで（「あと8時間20分」）
  const alLeft = t => { const m = Math.round((t - Date.now()) / 60000); return m < 60 ? `あと${m}分` : `あと${Math.floor(m / 60)}時間${m % 60 ? m % 60 + '分' : ''}`; };
  function renderOnce() {
    const l = [...alCfg().list].sort((x, y) => x.at.localeCompare(y.at));
    $('#alNewDays').innerHTML = alDayOrder().map(i =>
      `<button type="button" data-alnd="${i}" aria-pressed="${alNewDays.has(i)}">${WEEK[i]}</button>`).join('');
    $('#alOnce').innerHTML = l.map(o =>
      `<li class="${o.on ? '' : 'off'}"><input type="time" data-alt="${o.id}" value="${o.at}" aria-label="時刻">` +
      `<span class="alInfo"><b>${esc(o.name || 'アラーム')}</b><small>${esc(alWhen(o))}` +
      `<span>♪<select data-als="${o.id}" aria-label="アラーム音">${sndOpts(o.sound)}</select></span></small></span>` +
      `<label class="alTg"><input type="checkbox" data-alon="${o.id}"${o.on ? ' checked' : ''} aria-label="オン/オフ"></label>` +
      `<button type="button" class="alDel" data-alox="${o.id}" aria-label="消す">×</button></li>`).join('')
      || '<li class="muted">まだアラームはないよ</li>';
  }
  const alNewDays = new Set();

  function renderAlNext() {
    const list = alPlan(7);
    $('#alNext').innerHTML = list.length
      ? list.map(x => `<li class="${x.skip ? 'off' : ''}"><b>${md(x.at)} ${hm(x.at)}</b> <small>${esc(x.title)}</small>` +
          ` <button type="button" data-alskip="${x.k}">${x.skip ? '戻す' : 'この日は止める'}</button></li>`).join('')
      : '<li class="muted">この1週間に鳴るアラームはないよ</li>';
  }

  function syncAlUI() {
    if (!state) return;
    const a = alCfg();
    $('#alNote').textContent = !AL
      ? 'アラームが鳴るのはアプリ版（iPhone は iOS 26以降、Android）だけ。ここでは設定と鳴る時刻の確認ができるよ'
      : !alReady ? 'このiPhoneはiOS 26より前なので、アラームは使えないよ'
      : alAndroid ? 'マナーモードでも、アラームの音量で鳴るよ' : 'マナーモードや集中モードでも鳴るよ';
    $('#alOn').checked = a.on;
    $('#alOn').disabled = !!AL && !alReady;
    $('#alAutoSnd').innerHTML = sndOpts(a.sound);
    $('#alCls').innerHTML = Array.from({ length: state.periods }, (_, i) =>
      `<div class="alRow"><span>${i + 1}限からの日は</span>` +
      `<input type="time" data-alp="${i}" value="${a.cls[i]}"><span>に鳴らす</span>` +
      `<button type="button" class="alDel" data-alpx="${i}" aria-label="消す">×</button></div>`).join('');
    $('#alJobs').innerHTML = a.jobs.map((r, i) =>
      `<div class="alJob"><input list="alJobNames" data-alj="${i}" data-f="job" value="${esc(r.job)}" placeholder="全部のバイト" maxlength="20">` +
      `<div class="alRow"><span>が</span><input type="time" data-alj="${i}" data-f="until" value="${r.until}"><span>までに始まる日は</span></div>` +
      `<div class="alRow"><input type="time" data-alj="${i}" data-f="at" value="${r.at}"><span>に鳴らす</span>` +
      `<button type="button" class="alDel" data-aljx="${i}" aria-label="消す">×</button></div></div>`).join('')
      || '<p class="muted">まだルールがないよ</p>';
    const names = new Set();
    for (const p of state.evPresets) if (p.kind === 'job' && p.title) names.add(p.title);
    for (const e of state.events) if (e.kind === 'job' && e.title) names.add(e.title);
    $('#alJobNames').innerHTML = [...names].map(v => `<option value="${esc(v)}">`).join('');
    renderOnce();
    renderAlNext();
  }

  function openAlarm() {
    syncAlUI();
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
  }

  // アプリに予約を渡す（全部消してから入れ直す）
  window.alPush = () => {
    if (!state) return;
    updHead();
    if (dlg.open) { renderOnce(); renderAlNext(); }
    if (!AL) return;
    clearTimeout(alTimer);
    alTimer = setTimeout(async () => {
      if (!alReady) {
        try { alReady = !!(await AL.available()).value; } catch { return; }
        if (!alReady) return;
        syncAlUI();
      }
      try { await AL.sync({ items: alItems() }); }
      catch (err) { toast('アラームを入れられなかった：' + (err.message || err)); }
    }, 300);
  };

  const alSave = () => { save(); syncAlUI(); };

  async function alEnable() {
    if (AL) {
      let r = {};
      try { r = await AL.requestPermission() || {}; } catch {}
      if (!r.granted) {
        // Android：正確な時刻に鳴らすには「アラームとリマインダー」の許可がいる（Android 12以降）
        alert(r.reason === 'exact'
          ? '時間ぴったりに鳴らすには「アラームとリマインダー」の許可がいるよ。スマホの設定 → アプリ → がくログ → アラームとリマインダー をONにして、もう一回オンにしてね'
          : r.reason === 'notifications'
          ? 'アラームは通知で鳴らすので、通知の許可がいるよ。スマホの設定 → アプリ → がくログ → 通知 からONにしてね'
          : 'アラームが許可されてないよ。スマホの設定 → アプリ → がくログ からONにしてね');
        return false;
      }
    }
    alCfg().on = true;
    return true;
  }

  async function addOnce() {
    const t = $('#alOnceT').value;
    if (!okT(t)) return alert('時刻を入れてね');
    const a = alCfg();
    const o = { id: uid(), at: t, name: $('#alOnceN').value.trim().slice(0, 20), days: [...alNewDays].sort(), on: true, sound: okS($('#alNewSnd').value) };
    if (!o.days.length) o.date = alNextDate(t);
    a.list.push(o);
    $('#alOnceN').value = '';
    alNewDays.clear();
    if (!a.on) await alEnable();
    alSave();
    const next = alTimes(o)[0];
    if (state.alarm.on && next) toast(`${alWhen(o)} ${t} に鳴るよ（${alLeft(next)}）`);
  }

  async function alChange(el) {
    if (el.id === 'alOn') {
      if (el.checked) {
        if (!(await alEnable())) { el.checked = false; return; }
      } else alCfg().on = false;
      return alSave();
    }
    const a = alCfg();
    if (el.id === 'alNewSnd') return alPlay(el.value);
    if (el.id === 'alAutoSnd') { a.sound = okS(el.value); alPlay(a.sound); return alSave(); }
    if (el.dataset.als) {
      const o = a.list.find(x => x.id === el.dataset.als);
      if (o) { o.sound = okS(el.value); alPlay(o.sound); }
      return alSave();
    }
    if (el.dataset.alon) {
      const o = a.list.find(x => x.id === el.dataset.alon);
      if (!o) return;
      o.on = el.checked;
      // 1回だけのは、オンにしたときに次のその時刻を決め直す
      if (!o.days.length) { if (o.on) o.date = alNextDate(o.at); else delete o.date; }
      if (o.on && !a.on && !(await alEnable())) { o.on = false; el.checked = false; }
      alSave();
      const next = o.on && alTimes(o)[0];
      if (next) toast(`${alWhen(o)} ${o.at} に鳴るよ（${alLeft(next)}）`);
      return;
    }
    if (el.dataset.alt) {
      const o = a.list.find(x => x.id === el.dataset.alt);
      if (!o || !okT(el.value)) return alSave(); // 空にしたときは元に戻る
      o.at = el.value;
      if (!o.days.length && o.on) o.date = alNextDate(o.at);
      return alSave();
    }
    if (el.dataset.alp != null) { a.cls[+el.dataset.alp] = okT(el.value) ? el.value : ''; return alSave(); }
    if (el.dataset.alj != null) {
      const r = a.jobs[+el.dataset.alj];
      if (!r) return;
      if (el.dataset.f === 'job') r.job = el.value.trim().slice(0, 20);
      else if (okT(el.value)) r[el.dataset.f] = el.value;
      return alSave(); // 時刻を空にしたときは元に戻る
    }
  }
  // 時刻はホイールを回してる間は保存しない。閉じたときにまとめて保存
  dlg.addEventListener('change', e => {
    if (e.target.type === 'time' && document.activeElement === e.target) return;
    alChange(e.target);
  });
  dlg.addEventListener('focusout', e => {
    if (e.target.type === 'time') alChange(e.target);
  });

  // 試し聴き（5秒の短い版。標準の音はiPhoneのものなのでここでは鳴らせない）
  let alAudio = null;
  function alPlay(id) {
    alAudio?.pause();
    alAudio = null;
    if (!id) return toast('標準はスマホのアラームの音だよ（ここでは試せない）');
    alAudio = new Audio(`sounds/${id}.wav`);
    alAudio.play().catch(() => {});
  }
  dlg.addEventListener('close', () => { alAudio?.pause(); alAudio = null; });

  dlg.addEventListener('click', e => {
    if (e.target.id === 'alX' || e.target === dlg) return dlg.close();
    if (e.target.id === 'alPlay') return alPlay($('#alNewSnd').value);
    if (e.target.id === 'alOnceAdd') return addOnce();
    const d = e.target.dataset, a = alCfg();
    if (e.target.id === 'alJobAdd') { a.jobs.push({ job: '', until: '10:00', at: '07:00' }); return alSave(); }
    if (d.alox) { a.list = a.list.filter(o => o.id !== d.alox); return alSave(); }
    if (d.alnd != null) {
      const i = +d.alnd;
      if (alNewDays.has(i)) alNewDays.delete(i); else alNewDays.add(i);
      return renderOnce();
    }
    if (d.alpx != null) { a.cls[+d.alpx] = ''; return alSave(); }
    if (d.aljx != null) { a.jobs.splice(+d.aljx, 1); return alSave(); }
    if (d.alskip) {
      a.skip = a.skip.includes(d.alskip) ? a.skip.filter(k => k !== d.alskip) : a.skip.concat(d.alskip);
      return alSave();
    }
  });

    async function alInit() {
    if (AL) {
      try { alReady = !!(await AL.available()).value; } catch { alReady = false; }
    }
    window.alPush();
  }
  setTimeout(alInit, 0); // state を読み込んでから
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    if (dlg.open) syncAlUI();
    window.alPush();
  });
}

/* ===== 終わりの日を開いたら、始まりの日を先に入れておく ===== */
for (const [a, b] of [['offFrom', 'offTo'], ['newTermStart', 'newTermEnd']]) {
  const A = $('#' + a), B = $('#' + b);
  if (!A || !B) continue;
  B.addEventListener('focus', () => {
    if (!B.value && A.value) B.value = A.value;
    B.min = A.value || '';
  });
}
$('#termList')?.addEventListener('focusin', e => {
  const id = e.target.dataset.tend;
  if (!id) return;
  const s = $('#termList').querySelector(`[data-tstart="${id}"]`);
  if (s?.value && !e.target.value) e.target.value = s.value;
  e.target.min = s?.value || '';
});

/* ===== オンデマンドの回 ===== */
{
  const odList = () => (term().ondemands ||= []);

  $('#cancelAdd').parentElement.insertAdjacentHTML('afterend',
    '<div id="odBox">' +
    '<b>オンデマンド</b>' +
    '<label><input type="checkbox" id="odAll"> 毎回オンデマンド</label>' +
    '<div class="odPick"><select id="odDate"></select>' +
    '<button type="button" id="odAdd">この回だけ</button></div>' +
    '<ul id="odList"></ul>' +
    '</div>');

  window.renderOd = () => {
    const c = cur();
    if (!c) return;
    $('#odAll').checked = !!c.onDemand;
    // 毎回オンデマンドなら、日付ごとの欄はしまう
    $('#odBox .odPick').hidden = $('#odList').hidden = !!c.onDemand;
    const mine = (term().ondemands || []).filter(x => x.courseId === c.id)
      .sort((a, b) => a.date.localeCompare(b.date));
    $('#odList').innerHTML = mine.map(x =>
      `<li><span>${md(parseYmd(x.date))} オンデマンド</span>` +
      `<button class="x" data-oddel="${x.id}" aria-label="削除">×</button></li>`).join('')
      || '<li class="muted">なし</li>';
    const done = new Set(mine.map(x => x.date));
    const ahead = occurrencesAhead(c, 8).filter(d => !done.has(ymd(d)));
    $('#odDate').innerHTML = ahead.length
      ? ahead.map(d => `<option value="${ymd(d)}">${md(d)}</option>`).join('')
      : '<option value="">この先の授業が見つからない</option>';
    $('#odAdd').disabled = !ahead.length;
  };

  $('#odAll').onchange = e => {
    cur().onDemand = e.target.checked;
    scheduleChanged(); renderDetail();
  };
  $('#odAdd').onclick = () => {
    const date = $('#odDate').value;
    if (!date) return;
    odList().push({ id: uid(), courseId: cur().id, date });
    scheduleChanged(); renderDetail();
  };
  $('#odList').addEventListener('click', e => {
    const id = e.target.dataset.oddel;
    if (!id) return;
    term().ondemands = odList().filter(x => x.id !== id);
    scheduleChanged(); renderDetail();
  });
}

/* ===== オンデマンドの回（第○回から選ぶ） ===== */
{
  const box = $('#odBox');
  box.innerHTML =
    '<h4>オンデマンドの回</h4>' +
    '<label class="odN">全 <input type="number" id="odTotal" min="1" max="30" inputmode="numeric" placeholder="15"> 回</label>' +
    '<label class="odSw"><input type="checkbox" id="odAll"> 毎回オンデマンド（あとで外せる）</label>' +
    '<p class="hint" id="odNote"></p>' +
    '<ul class="odSess" id="odSess"></ul>';

  // 学期の中でこの授業がある日（休みと休講は除く）、全○回で切る
  const sessDates = (c, t) => {
    const out = [], s = parseYmd(t.start);
    if (!s) return out;
    for (let k = 0; k < 200; k++) {
      const d = addDays(s, k);
      if (pastEnd(d, t)) break;
      if (hasClass(c, d, t)) out.push(d);
    }
    return { found: out.length, list: out.slice(0, +c.sessions || out.length) };
  };
  const odSet = (c, t) => new Set((t.ondemands || []).filter(x => x.courseId === c.id).map(x => x.date));
  const setAll = (c, t, on) => {
    t.ondemands = (t.ondemands || []).filter(x => x.courseId !== c.id);
    if (on) for (const d of sessDates(c, t).list) t.ondemands.push({ id: uid(), courseId: c.id, date: ymd(d) });
  };

  // 詳細の「オンデマ ○/○回」用
  window.odCount = c => {
    try {
      const t = term();
      if (!c || !t?.start) return { n: 0, all: 0 };
      const list = sessDates(c, t).list.map(ymd), on = odSet(c, t);
      return { n: list.filter(k => on.has(k)).length, all: list.length };
    } catch (e) {
      console.warn('odCount', e);
      return { n: 0, all: 0 };
    }
  };

  window.renderOd = () => {
    const c = cur(), t = term();
    if (!c) return;
    // 前の「毎回オンデマンド」を日付のチェックに切り替える
    if (c.onDemand) { c.onDemand = false; setAll(c, t, true); save(); }
    const r = (t.start && sessDates(c, t)) || {};
    const found = r.found || 0, list = r.list || [], on = odSet(c, t);
    const n = list.filter(d => on.has(ymd(d))).length;
    const all = $('#odAll');
    all.checked = list.length > 0 && n === list.length;
    all.indeterminate = n > 0 && n < list.length;
    all.disabled = !list.length;
    $('#odTotal').value = c.sessions || '';
    const today = ymd(new Date());
    $('#odNote').textContent = !t.start ? '学期の始まりの日を入れると回が出るよ'
      : !list.length ? 'この学期にこの授業の日が見つからなかった'
      : c.sessions && found < c.sessions ? `学期の中に${found}回分しか見つからなかった（休みと休講は除く）`
      : 'チェックした回がオンデマンドになるよ';
    $('#odSess').innerHTML = list.map((d, i) => {
      const k = ymd(d);
      return `<li class="${k < today ? 'past' : ''}"><label>` +
        `<input type="checkbox" data-od="${k}"${on.has(k) ? ' checked' : ''}>` +
        ` 第${i + 1}回 <small>${md(d)}</small></label></li>`;
    }).join('');
  };

  const redraw = () => { save(); renderDetail(); window.renderOd(); };

  $('#odAll').onchange = e => {
    const c = cur();
    if (!c) return;
    setAll(c, term(), e.target.checked);
    redraw();
  };

  $('#odTotal').onchange = e => {
    const c = cur();
    if (!c) return;
    const v = Math.round(+e.target.value);
    c.sessions = v >= 1 && v <= 30 ? v : '';
    redraw();
  };

  $('#odSess').onchange = e => {
    const k = e.target.dataset.od, c = cur(), t = term();
    if (!k || !c) return;
    t.ondemands = (t.ondemands || []).filter(x => !(x.courseId === c.id && x.date === k));
    if (e.target.checked) t.ondemands.push({ id: uid(), courseId: c.id, date: k });
    redraw();
  };

  window.renderOd();
}

/* ===== 今日の流れからオンデマを切り替える ===== */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-odt]');
  if (!b) return;
  // 授業の画面が開かないように止める
  e.preventDefault();
  e.stopPropagation();
  const t = term(), c = t.courses.find(x => x.id === b.dataset.odt);
  if (!c) return;
  if (c.onDemand) return alert('この授業は前の「毎回オンデマンド」のまま。授業の画面を1回開くと、ここで切り替えられるよ');
  const k = ymd(new Date());
  const had = (t.ondemands || []).some(x => x.courseId === c.id && x.date === k);
  t.ondemands = (t.ondemands || []).filter(x => !(x.courseId === c.id && x.date === k));
  if (!had) t.ondemands.push({ id: uid(), courseId: c.id, date: k });
  save();
  renderNow();
  if (typeof renderGrid === 'function') renderGrid();
  window.alPush?.();
}, true);

/* ===== 学期の設定から「授業と時限」へ ===== */
{
  const b = document.createElement('button');
  b.type = 'button';
  b.id = 'toPeriods';
  b.textContent = '⚙ 授業と時限の設定へ';
  $('#termList').after(b);
  b.onclick = () => {
    $('#termDlg').close();
    openSettings();
    setTimeout(() => {
      const el = $('#sPeriods'), d = el?.closest('details');
      if (!el) return;
      if (d) d.open = true;
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 80);
  };
}

/* ===== 授業数（全○回）をまとめて設定 ===== */
{
  const box = document.createElement('div');
  box.id = 'defSessBox';
  box.innerHTML =
    '<h4>授業の回数をまとめて設定</h4>' +
    '<div class="dsRow">全 <input type="number" id="dsN" min="1" max="30" inputmode="numeric" placeholder="15"> 回' +
    '<select id="dsMode"><option value="empty">まだ決めてない授業だけ</option>' +
    '<option value="all">全部の授業を上書き</option></select></div>' +
    '<button type="button" id="dsGo">今の学期に入れる</button>' +
    '<p class="hint">オンデマンドの回を選ぶときの回数になるよ。集中講義は入れない</p>';
  $('#sTimes').closest('table').after(box);

  $('#dsGo').onclick = () => {
    const n = Math.round(+$('#dsN').value);
    if (!(n >= 1 && n <= 30)) return alert('1〜30の数字を入れてね');
    const all = $('#dsMode').value === 'all';
    const list = term().courses.filter(c => !c.from && (all || !c.sessions));
    if (!list.length) return alert('入れる授業がなかったよ');
    if (all && !confirm(`${list.length}件の授業を全${n}回にするよ。決めてあった回数も変わるけどいい？`)) return;
    for (const c of list) c.sessions = n;
    save();
    const msg = `${list.length}件の授業を全${n}回にしたよ`;
    typeof toast === 'function' ? toast(msg) : alert(msg);
  };
}

/* ===== アプリのアイコンを選ぶ（アプリ版だけ） ===== */
{
  const AI = window.Capacitor?.Plugins?.AppIcon;
  // [Xcodeで付けた名前, 画面に出す名前, 見本の画像]
  const ICONS = [
    ['', 'いつもの', 'apple-touch-icon.png'],
    ['gray', 'グレー', 'icon-gray.png'],
    ['green', 'みどり', 'icon-green.png'],
    ['pink', 'ピンク', 'icon-pink.png'],
    ['purple', 'むらさき', 'icon-purple.png'],
    ['red', 'あか', 'icon-red.png'],
    ['yellow', 'きいろ', 'icon-yellow.png']
  ];
  if (AI) {
    const box = document.createElement('div');
    box.id = 'appIconBox'; // HTML の #iconBox（Web版のアイコンの色）と id がかぶらないように
    box.innerHTML = '<h4>アプリのアイコン</h4><div class="icList" id="icList"></div>' +
      '<p class="hint">変えるとiPhoneから確認が出るよ</p>';
    $('#aiBox').before(box);
    const render = async () => {
      let now = null;
      try { now = (await AI.getCurrentIcon()).icon; } catch {}
      $('#icList').innerHTML = ICONS.map(([id, name, img]) =>
        `<button type="button" data-icon="${id}" class="${(now || '') === id ? 'on' : ''}">` +
        `<img src="${img}" alt="">${name}</button>`).join('');
    };
    $('#icList').onclick = async e => {
      const b = e.target.closest('[data-icon]');
      if (!b) return;
      try {
        b.dataset.icon ? await AI.setIcon({ icon: b.dataset.icon }) : await AI.resetIcon();
      } catch (err) {
        alert('アイコンを変えられなかった：' + (err.message || err));
      }
      render();
    };
    AI.isAvailable().then(r => r.available ? render() : box.remove()).catch(() => box.remove());
  }
}

/* ===== アイコン欄をアプリ版用にまとめる ===== */
if (window.Capacitor?.isNativePlatform?.()) {
  const box = document.querySelector('#iconBox');
  if (box) {
    // Web版の説明とリンクは隠す
    [...box.children].forEach(el => {
      if (el.tagName !== 'SUMMARY') el.style.display = 'none';
    });
    box.querySelector('summary').textContent = 'アプリのアイコン';
    box.removeAttribute('open');

    // 下にあるアプリ版の選択欄を、この枠の中へ移す
    const tidy = () => {
      const h = [...document.querySelectorAll('body *')].find(el =>
        el.children.length === 0 && el.textContent.trim() === 'アプリのアイコン' &&
        !el.closest('summary'));
      if (!h) return false;
      let top = h;
      while (!top.nextElementSibling && top.parentElement) top = top.parentElement;
      const parts = [];
      let n = top.nextElementSibling;
      while (n && parts.length < 4) {
        parts.push(n);
        if (n.textContent.includes('確認が出る')) break;
        n = n.nextElementSibling;
      }
      if (!parts.length || !parts.at(-1).textContent.includes('確認が出る')) return false;
      const wrap = document.createElement('div');
      wrap.className = 'appIconIn';
      parts.forEach(p => wrap.append(p));
      box.append(wrap);
      const host = top.parentElement;
      top.remove();
      // 中身を移して空になった入れ物は消す（残ると設定の「カレンダー連携」と「AI」の間に空白ができる）
      if (host && host !== box && !host.children.length && !host.textContent.trim()) host.remove();
      return true;
    };
    let tries = 0;
    const run = () => { if (tidy() || ++tries > 25) return; setTimeout(run, 200); };
    setTimeout(run, 0);
  }
}

/* ===== テーマとアイコンを「見た目」へ移す ===== */
{
  let tries = 0;
  const move = () => {
    const dlg = document.querySelector('#wallDlg');
    const color = document.querySelector('#sColor');
    const box = document.querySelector('#iconBox');
    if (!dlg || !color || !box) { if (++tries < 25) setTimeout(move, 200); return; }

    // テーマの欄をまるごと移す
    const sec = color.closest('details');
    const hint = [...sec.querySelectorAll('.hint')]
      .find(el => el.textContent.includes('キャンセルすれば元に戻る'));
    if (hint) hint.textContent = '選ぶとすぐ変わって、そのまま保存されるよ';
    sec.classList.add('inWall');
    dlg.append(sec);

    // アイコンはテーマの下に並べる
    box.classList.add('inWall');
    dlg.append(box);

    // 選んだらすぐ保存（ここは設定画面のキャンセルと関係ない）
    const th = () => {
      state.theme = { ...state.theme, color: $('#sColor').value, font: $('#sFont').value };
      applyTheme(state.theme);
      save();
    };
    $('#sColor').addEventListener('change', th);
    $('#sFont').addEventListener('change', th);

    // 開くたびに今のテーマを表示（復元したあとなどにズレないように）
    new MutationObserver(() => {
      if (!dlg.open) return;
      $('#sColor').value = state.theme.color;
      $('#sFont').value = state.theme.font;
    }).observe(dlg, { attributes: true, attributeFilter: ['open'] });
  };
  setTimeout(move, 0);
}

/* ===== 見た目をタブで分ける ===== */
{
  let wantTab = 'bg';
  window.openLook = k => { wantTab = k; openWall(); };

  let tries = 0;
  const setup = () => {
    const dlg = document.querySelector('#wallDlg');
    const theme = dlg?.querySelector('#sColor')?.closest('details');
    const icon = dlg?.querySelector('#iconBox');
    const head = dlg?.querySelector('.dlgHead');
    if (!theme || !icon || !head) { if (++tries < 30) setTimeout(setup, 200); return; }

    // 名前を変える
    if ($('#wallBtn')) $('#wallBtn').innerHTML = '<b>🖼 壁紙・文字・アイコン</b><small>背景、カード・文字の色、テーマ、フォント、アイコン</small>';
    const h = head.querySelector('h2, h3, b');
    if (h) h.textContent = '🖼 壁紙・文字・アイコン';

    [...document.querySelectorAll('button')]
      .find(b => b.textContent.includes('テーマの色・文字'))?.remove();

    // 見出しが入ってる箱を使う（包まれてても大丈夫なように）
    const box = head.parentElement;
    const bg = document.createElement('div');
    [...box.children].forEach(el => {
      if (el === head || el.contains(theme) || el.contains(icon)) return;
      if (el.matches('form[method="dialog"], menu')) return;
      bg.append(el);
    });
    const tf = document.createElement('div');
    tf.append(theme);
    const ic = document.createElement('div');
    ic.append(icon);
    [theme, icon].forEach(d => { d.open = true; d.classList.add('flat'); });

    // タブ
    const wg = document.createElement('div');
    const panes = [['bg', '背景', bg], ['font', 'テーマ・文字', tf], ['icon', 'アイコン', ic]];
    if (isApp) panes.push(['wg', 'ウィジェット', wg]);
    // Android はアイコンの色を変えられない（iOS の別アイコンだけ）ので、アイコンのタブは出さない
    const noIcon = isApp && !window.Capacitor?.Plugins?.AppIcon;
    const bar = document.createElement('div');
    bar.className = 'lookTabs';
    bar.innerHTML = panes.filter(([k]) => !(noIcon && k === 'icon')).map(([k, n]) => `<button type="button" data-lt="${k}">${n}</button>`).join('');
    panes.forEach(([k, , p]) => { p.className = 'lookPane'; p.dataset.lp = k; });
    head.after(bar, ...panes.map(x => x[2]));

    const show = k => {
      if (noIcon && k === 'icon') k = 'bg';
      bar.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.lt === k));
      panes.forEach(([kk, , p]) => p.hidden = kk !== k);
    };
    bar.onclick = e => {
      const b = e.target.closest('[data-lt]');
      if (b) show(b.dataset.lt);
    };
    show('bg');
    const moveWg = () => {
      if (!isApp) return;
      const box = document.querySelector('.wgBox');
      if (box && box.parentElement !== wg) wg.append(box);
      if (!wg.children.length) wg.innerHTML = '<p class="hint">ウィジェットの設定が見つからなかった</p>';
    };
    moveWg();
    new MutationObserver(() => {
      if (!dlg.open) return;
      moveWg();
      show(wantTab); wantTab = 'bg';
    })
      .observe(dlg, { attributes: true, attributeFilter: ['open'] });
  };
  setTimeout(setup, 0);
}

/* ===== 一言日記をメモから切り離す ===== */
{
  const d = $('#diaryInput');
  const memo = d?.closest('section, .card');
  if (memo && !d.closest('#diaryCard')) {
    const h = [...memo.querySelectorAll('h2, h3')].find(el => el.textContent.includes('日記'));
    const card = document.createElement('section');
    card.id = 'diaryCard';
    card.className = memo.className;
    // 見出しから下を全部移す（見出しが見つからなければ入力欄から）
    let n = h || d;
    while (n && n.parentElement !== memo) n = n.parentElement;
    while (n) { const next = n.nextElementSibling; card.append(n); n = next; }
    memo.after(card);
  }
}

/* ===== ToDoリスト（日ごと） ===== */
{
  const todos = () => (state.todos = Array.isArray(state.todos) ? state.todos : []);
  const home = $('#nowCard').parentElement;
  const cardOf = el => { while (el && el.parentElement !== home) el = el.parentElement; return el; };

  const row = (x, from, tag) =>
    `<li class="todoRow"><label><input type="checkbox" data-todo="${x.id}" ${x.done ? 'checked' : ''}>` +
    (tag ? '<span class="tag">ToDo</span>' : '') +
    `<span class="${x.done ? 'done' : ''}">${esc(x.text)}</span>` +
    (from ? ` <small class="muted">${md(parseYmd(x.date))}から</small>` : '') +
    `</label><button type="button" class="x" data-tododel="${x.id}" aria-label="削除">×</button></li>`;

  // 今日タブのカード（メモの上）
  const card = document.createElement('section');
  card.id = 'todoCard';
  card.className = $('#packCard').className;
  card.innerHTML = '<h2>ToDo</h2><ul class="todoList" id="todoList"></ul>' +
    '<div class="todoAdd"><input id="todoIn" maxlength="60" placeholder="今日やること">' +
    '<button type="button" id="todoBtn">追加</button></div>';
  const memo = cardOf($('#noteList'));
  if (memo) memo.before(card); else home.append(card);

  window.renderTodo = () => {
    const k = todayStr();
    const left = todos().filter(x => !x.done && x.date < k).sort((a, b) => a.date < b.date ? -1 : 1);
    const now = todos().filter(x => x.date === k);
    $('#todoList').innerHTML = left.map(x => row(x, true)).join('') + now.map(x => row(x)).join('')
      || '<li class="muted">なし</li>';
  };

  const add = (date, inp) => {
    const text = inp.value.trim().slice(0, 60);
    if (!text) return;
    todos().push({ id: uid(), date, text, done: false });
    inp.value = '';
    save();
    redraw();
  };
  const redraw = () => {
    renderTodo();
    try { renderDay(); } catch {}
  };

  $('#todoBtn').onclick = () => add(todayStr(), $('#todoIn'));
  $('#todoIn').onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); add(todayStr(), $('#todoIn')); } };

  // チェックと削除（今日とカレンダー共通）
  document.addEventListener('change', e => {
    const id = e.target.dataset?.todo;
    if (!id) return;
    const x = todos().find(t => t.id === id);
    if (!x) return;
    x.done = e.target.checked;
    save();
    redraw();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-tododel]');
    if (!b) return;
    state.todos = todos().filter(t => t.id !== b.dataset.tododel);
    save();
    redraw();
  });

  // カレンダーの日付にも出す
  $('#dayList').insertAdjacentHTML('afterend',
    '<div class="todoAdd" id="dayTodo"><input id="dayTodoIn" maxlength="60" placeholder="この日のToDo">' +
    '<button type="button" id="dayTodoBtn">追加</button></div>');
  $('#dayTodoBtn').onclick = () => add(calSel, $('#dayTodoIn'));
  $('#dayTodoIn').onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); add(calSel, $('#dayTodoIn')); } };

  const rd0 = renderDay;
  renderDay = function () {
    rd0.apply(this, arguments);
    const mine = featOn('todo') ? todos().filter(x => x.date === calSel) : [];
    if (!mine.length) return;
    const list = $('#dayList');
    list.querySelector(':scope > li.muted:only-child')?.remove();
    list.insertAdjacentHTML('beforeend', mine.map(x => row(x, false, true)).join(''));
  };

  // 今日の画面を描き直すときに一緒に出す
  const rn0 = renderNotes;
  renderNotes = function () { rn0.apply(this, arguments); renderTodo(); };

  setTimeout(() => {
    // 終わってから30日たったものは片づける
    const old = ymd(addDays(new Date(), -30));
    state.todos = todos().filter(x => !(x.done && x.date < old));
    renderTodo();
  }, 0);
}

/* ===== 今日に出すものを選ぶ ===== */
{
  const home = $('#nowCard').parentElement;
  const NAMES = { nowCard: '次の授業・今日の流れ', todoCard: 'ToDo', packCard: '持ち物', taskCard: '課題', diaryCard: '一言日記', tmrBox: '明日の予定' };
  const hide = () => (state.homeHide = Array.isArray(state.homeHide) ? state.homeHide : []);
  const keyOf = el => el.id || el.dataset.hk ||
    (el.dataset.hk = 'h-' + (el.querySelector('h2, h3, summary')?.textContent.trim().slice(0, 12) || ''));
  const nameOf = el => NAMES[el.id] || el.querySelector('h2, h3, summary')?.textContent.trim().slice(0, 20) || '';
  const cards = () => [...home.children].filter(el =>
    el.id !== 'homeEdit' && el.tagName !== 'DIALOG' && el.tagName !== 'SCRIPT' && keyOf(el) !== 'h-');

  const apply = () => cards().forEach(el => el.hidden = hide().includes(keyOf(el)));

  const dlg = document.createElement('dialog');
  dlg.id = 'homeDlg';
  dlg.innerHTML = '<div class="dlgHead"><h2>今日の画面に表示するもの</h2>' +
    '<button type="button" class="x big" id="homeX" aria-label="閉じる">×</button></div>' +
    '<ul class="homePick" id="homePick"></ul>' +
    '<p class="hint">外したものは消えないよ。ここでいつでも戻せる</p>';
  document.body.append(dlg);
  $('#homeX').onclick = () => dlg.close();

  // 設定でオフにした機能のカードは、選ぶ一覧にも出さない
  const FEAT_CARD = { diaryCard: 'diary', todoCard: 'todo', noteCard: 'memo', habitCard: 'habit', packCard: 'grid' };
  window.openHomePick = () => {
    $('#homePick').innerHTML = cards().filter(el => !FEAT_CARD[el.id] || featOn(FEAT_CARD[el.id])).map(el =>
      `<li><label><input type="checkbox" data-hp="${esc(keyOf(el))}" ${hide().includes(keyOf(el)) ? '' : 'checked'}>` +
      `${esc(nameOf(el))}</label></li>`).join('');
    dlg.showModal();
  };
  $('#homePick').addEventListener('change', e => {
    const k = e.target.dataset.hp;
    if (!k) return;
    state.homeHide = hide().filter(x => x !== k);
    if (!e.target.checked) state.homeHide.push(k);
    save();
    apply();
  });

  home.insertAdjacentHTML('beforeend', '<button type="button" id="homeEdit">✎ 表示するものを選ぶ</button>');
  $('#homeEdit').onclick = () => openHomePick();

  if (typeof FEATURES !== 'undefined' && !FEATURES.some(f => f.id === 'homePick')) FEATURES.push({
    id: 'homePick', name: '今日の画面に表示するもの', where: '今日 → 一番下の「表示するものを選ぶ」',
    desc: '今日の画面に出す項目を選ぶ。使わないものは隠せる',
    kw: '今日 表示 非表示 隠す 消す カスタマイズ ToDo', go: () => openHomePick()
  });

  setTimeout(apply, 0);
}

/* ===== 授業のミニノート ===== */
{
  // 写真の置き場（IndexedDB）
  const db = new Promise((ok, ng) => {
    const r = indexedDB.open('gakulogNotes', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('img');
    r.onsuccess = () => ok(r.result);
    r.onerror = () => ng(r.error);
  });
  const tx = async (mode, fn) => {
    const d = await db;
    return new Promise((ok, ng) => {
      const t = d.transaction('img', mode);
      const req = fn(t.objectStore('img'));
      t.oncomplete = () => ok(req.result);
      t.onerror = () => ng(t.error);
    });
  };
  const pPut = (k, b) => tx('readwrite', s => s.put(b, k));
  const pGet = k => tx('readonly', s => s.get(k));
  window.mnGetPic = pGet; // 試験前の見返しでも写真を読む
  const pDel = k => tx('readwrite', s => s.delete(k));

  const notes = c => (c.notes = Array.isArray(c.notes) ? c.notes : []);
  const nextDate = c => {
    const k = todayStr();
    const d = occurrencesAhead(c, 8).find(x => ymd(x) > k);
    return d ? ymd(d) : null;
  };

  // 授業の画面に欄を足す（「先生の一言」の下）
  const box = document.createElement('div');
  box.id = 'mnBox';
  box.innerHTML = '<h3>📒 ミニノート</h3><ul class="mnList" id="mnList"></ul>' +
    '<button type="button" id="mnNew">＋ ノートを書く</button>';
  let a = $('#memoAdd');
  while (a.parentElement && !a.parentElement.contains($('#memoList'))) a = a.parentElement;
  a.after(box);

  const renderMn = () => {
    const c = cur();
    if (!c) return;
    const k = todayStr();
    // 新しい日が上。同じ日は1冊目→続きの順
    $('#mnList').innerHTML = notes(c).slice().sort((x, y) => y.date.localeCompare(x.date) || (x.cont || 1) - (y.cont || 1)).map(n =>
      `<li data-mn="${n.id}"><span class="memo-date">${md(parseYmd(n.date))}${n.cont ? '（続き）' : ''}</span>` +
      (n.until && n.until >= k ? '<span class="tag next">次回に表示</span>' : '') +
      (n.pics.length ? `<small> 📷${n.pics.length}</small>` : '') +
      `<div class="mnText">${esc(n.text) || '（写真だけ）'}</div></li>`).join('')
      || '<li class="muted">なし</li>';
  };
  const rd0 = renderDetail;
  renderDetail = function () { rd0.apply(this, arguments); renderMn(); };

  // 書く画面
  const dlg = document.createElement('dialog');
  dlg.id = 'mnDlg';
  dlg.innerHTML = '<div class="dlgHead"><h2>📒 ミニノート</h2>' +
    '<button type="button" class="x big" id="mnX" aria-label="閉じる">×</button></div>' +
    '<textarea id="mnText" maxlength="2000" rows="8" placeholder="次回の自分へ。範囲、先生が言ってたこと、気づいたこと…"></textarea>' +
    '<div class="mnPics" id="mnPics"></div>' +
    '<label class="mnAddPic">📷 写真を足す（4枚まで）<input type="file" id="mnFile" accept="image/*" multiple hidden></label>' +
    '<label class="mnChk"><input type="checkbox" id="mnNext"> 次の授業で見せる</label>' +
    '<div class="mnBtns"><button type="button" id="mnDel">削除</button>' +
    '<button type="button" id="mnSave" class="primary">保存</button></div>';
  document.body.append(dlg);

  let ed = null; // { note, pics: [{ key, url }], added: [], removed: [] }
  const urls = [];
  const drawPics = () => {
    $('#mnPics').innerHTML = ed.pics.map((p, i) =>
      `<div class="mnPic"><img src="${p.url}" alt="" data-mnview="${i}">` +
      `<button type="button" class="x" data-mnrm="${i}" aria-label="外す">×</button>` +
      `<button type="button" class="mnEdit" data-mned="${i}" aria-label="編集">✎</button></div>`).join('') +
      (ed.pics.length ? '<p class="hint mnPicHint">写真の ✎ で、切り取り・回転・くっきりができるよ</p>' : '');
  };
  const open = async note => {
    const c = cur();
    const isNew = !note;
    note ||= { id: uid(), date: todayStr(), text: '', pics: [], until: nextDate(c) };
    ed = { note, isNew, pics: [], added: [], removed: [] };
    for (const key of note.pics) {
      const b = await pGet(key).catch(() => null);
      if (!b) continue;
      const url = URL.createObjectURL(b);
      urls.push(url);
      ed.pics.push({ key, url });
    }
    $('#mnText').value = note.text;
    $('#mnNext').checked = !!note.until;
    $('#mnNext').disabled = !note.until && !nextDate(c);
    $('#mnDel').hidden = isNew;
    drawPics();
    dlg.showModal();
  };
  const close = async saved => {
    if (!saved) for (const k of ed.added) await pDel(k).catch(() => {});
    urls.splice(0).forEach(u => URL.revokeObjectURL(u));
    ed = null;
    dlg.close();
  };

  $('#mnNew').onclick = () => open();
  $('#mnList').onclick = e => {
    const li = e.target.closest('[data-mn]');
    const n = li && notes(cur()).find(x => x.id === li.dataset.mn);
    if (n) open(n);
  };
  $('#mnX').onclick = () => close(false);
  dlg.addEventListener('cancel', e => { e.preventDefault(); close(false); });

  $('#mnFile').onchange = async e => {
    const fs = [...e.target.files].slice(0, 4 - ed.pics.length);
    e.target.value = '';
    for (const f of fs) {
      try {
        const b = await wallShrink(f, 1280);
        const key = 'n-' + uid();
        await pPut(key, b);
        const url = URL.createObjectURL(b);
        urls.push(url);
        ed.pics.push({ key, url });
        ed.added.push(key);
      } catch (err) {
        console.warn('mini note', err);
        alert('写真を読み込めなかった');
      }
    }
    if ([...e.target.files].length > fs.length) toast?.('写真は4枚までだよ');
    drawPics();
  };
  $('#mnPics').onclick = async e => {
    // 写真を編集：新しい写真として入れて、前の写真はノートを保存したら消す（保存しなければ元のまま）
    const edt = e.target.closest('[data-mned]');
    if (edt) {
      const i = +edt.dataset.mned, p = ed.pics[i];
      const b = p && await pGet(p.key).catch(() => null);
      if (!b) return alert('写真が読めなかった');
      const out = await window.editPhoto(b).catch(() => null);
      if (!out || !ed) return;
      const key = 'n-' + uid();
      await pPut(key, out);
      const url = URL.createObjectURL(out);
      urls.push(url);
      if (ed.added.includes(p.key)) { ed.added = ed.added.filter(k => k !== p.key); pDel(p.key).catch(() => {}); }
      else ed.removed.push(p.key);
      ed.added.push(key);
      ed.pics[i] = { key, url };
      drawPics();
      return;
    }
    const rm = e.target.closest('[data-mnrm]');
    if (rm) {
      const [p] = ed.pics.splice(+rm.dataset.mnrm, 1);
      ed.removed.push(p.key);
      drawPics();
      return;
    }
    const v = e.target.closest('[data-mnview]');
    if (v) window.open(v.src, '_blank');
  };

  $('#mnSave').onclick = async () => {
    const c = cur();
    const text = $('#mnText').value.trim().slice(0, 2000);
    if (!text && !ed.pics.length) { alert('何か書くか、写真を入れてね'); return; }
    const n = ed.note;
    n.text = text;
    n.pics = ed.pics.map(p => p.key);
    n.until = $('#mnNext').checked ? (n.until || nextDate(c)) : null;
    if (ed.isNew) notes(c).push(n);
    for (const k of ed.removed) await pDel(k).catch(() => {});
    save();
    await close(true);
    renderDetail();
    try { renderNow(); } catch {}
  };
  $('#mnDel').onclick = async () => {
    if (!confirm('このノートを消す？')) return;
    const c = cur();
    for (const k of ed.note.pics.concat(ed.added)) await pDel(k).catch(() => {});
    c.notes = notes(c).filter(x => x.id !== ed.note.id);
    save();
    await close(true);
    renderDetail();
    try { renderNow(); } catch {}
  };

  // 次の授業の行に「📒」を出す
  const cl0 = courseLine;
  courseLine = function (x) {
    const html = cl0.apply(this, arguments);
    const k = ymd(x.start);
    const n = (x.c.notes || []).filter(n => n.until && n.date < k && k <= n.until)
      .sort((a, b) => b.date.localeCompare(a.date))[0];
    if (!n) return html;
    const line = (n.text.split('\n')[0] || '写真あり').slice(0, 40);
    return html.replace(/<\/div>$/, `<div class="nc-note">📒 ${esc(line)}</div></div>`);
  };

  // 今日画面の「📷 板書を撮る」：カメラで撮って、その授業の今日のノートに入れる
  // 1冊4枚まで。いっぱいなら同じ日の「続き」のノートを作る（cont: 2, 3, …）
  const MN_MAX = 4;
  const camIn = document.createElement('input');
  camIn.type = 'file';
  camIn.id = 'camIn';
  camIn.accept = 'image/*';
  camIn.setAttribute('capture', 'environment');
  camIn.hidden = true;
  document.body.append(camIn);
  let camFor = null;
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-cam]');
    if (!b) return;
    camFor = b.dataset.cam;
    camIn.value = '';
    camIn.click();
  });
  const addSnaps = async (c, files) => {
    const k = todayStr();
    let n = null;
    for (const f of files) {
      const b = await wallShrink(f, 1280);
      const key = 'n-' + uid();
      await pPut(key, b);
      const day = notes(c).filter(x => x.date === k).sort((x, y) => (x.cont || 1) - (y.cont || 1));
      n = day.find(x => x.pics.length < MN_MAX);
      if (!n) {
        // 手で書いた今日のノートがあればそこから埋めて、いっぱいなら「続き」
        n = { id: uid(), date: k, text: '', pics: [], until: nextDate(c), ...(day.length && { cont: day.length + 1 }) };
        notes(c).push(n);
      }
      n.pics.push(key);
    }
    save();
    return n;
  };
  camIn.onchange = async () => {
    const c = findCourse(camFor), files = [...camIn.files];
    camIn.value = '';
    if (!c || !files.length) return;
    try {
      const n = await addSnaps(c, files);
      try { renderNow(); } catch {}
      toast(`${nm(c)} ${md(parseYmd(n.date))}${n.cont ? '（続き）' : ''}のノートに保存したよ（${n.pics.length}/${MN_MAX}枚）`,
        () => { openCourse(c.id); open(n); }, '開く');
    } catch (err) {
      console.warn('camera note', err);
      alert('写真を保存できなかった。空き容量を確認して、もう一回ためしてね');
    }
  };

  if (typeof FEATURES !== 'undefined' && !FEATURES.some(f => f.id === 'miniNote')) FEATURES.push({
    id: 'miniNote', name: 'ミニノート', where: '授業の画面 → 先生の一言の下',
    desc: '次回の自分へのメモを写真つきで残す。次の授業の行にも出せる',
    kw: 'ノート メモ 写真 次回 引き継ぎ 板書', go: () => {}
  });
}

/* ===== 機能の紹介（チュートリアル） ===== */
{
  const native = !!window.Capacitor?.isNativePlatform?.();
  const tryGo = fn => () => { try { fn(); } catch (e) { console.warn('tour', e); } };
  const CARDS = [
    { e: '👋', t: 'がくログへようこそ', d: 'できることをざっくり紹介するね。1分くらい。気になるものは「やってみる」で、その場所へ飛べるよ。閉じたら続きから再開するよ' },
    { e: '📅', t: '時間割と授業', grid: 1, d: '授業を押すと、欠席の記録、オンデマの回、先生の一言、ミニノート（写真つきメモ）が使えるよ' },
    { e: '📷', t: '写真で読み取る', feat: ['ai'], d: 'シフト表、時間割、給与明細、シラバス、手帳やLINE・メールのスクショの予定を、撮るだけで登録できる。AIのキーを入れると使えるよ', go: () => openPhoto('guide') },
    { e: '☀️', t: '今日の画面', d: '次の授業、ToDo、持ち物、課題がまとまってる。いらないものは一番下のボタンで隠せるよ', go: () => openHomePick() },
    { e: '💴', t: 'バイトと収入', feat: ['job'], d: 'バイトの予定を入れると、月ごとの収入を円グラフで見られる。シフトはカレンダーからも取り込めるよ' },
    { e: '⏰', t: 'アラーム', app: 1, feat: ['alarm'], d: '「1限の日は7時」「このバイトが朝からある日は6時」みたいに、予定に合わせて鳴らせるよ。上の⏰から', go: () => $('#alHead').click() },
    { e: '🔔', t: '通知とウィジェット', app: 1, d: `前の日に持ち物や締め切りを知らせてくれる。ホーム画面${window.Capacitor?.getPlatform?.() === 'ios' ? 'とロック画面' : ''}にはウィジェットも置けるよ`, go: () => goSet('#nOn') },
    { e: '👥', t: '友達と共有', feat: ['share', 'group'], d: '時間割はQRコードで交換できて、空きコマが合う時間もわかる。共有グループで予定も一緒に見られるよ', go: () => openTermDlg('shareSec') },
    { e: '🎨', t: '見た目', d: '壁紙、テーマの色、フォント、アイコンの色を変えられるよ', go: () => openLook('bg') },
    { e: '💾', t: 'バックアップ', d: '機種変更の前は「書き出し」しておいてね。新しいほうで「復元」すれば元どおり', go: () => goSet('#exportBtn') },
    { e: '🔍', t: '困ったら', d: '「その他」の「機能をさがす」で、やりたいことから場所を探せる。この紹介も「その他」の「📘機能の紹介」からまた見られるよ', go: () => $('#helpBtn').click() }
  ];
  // feat：その中のどれかがオンなら出す
  const list = () => CARDS.filter(c => (!c.app || native) && (!c.grid || state.useGrid) && (!c.feat || c.feat.some(featOn)));

  const dlg = document.createElement('dialog');
  dlg.id = 'tourDlg';
  dlg.innerHTML = '<div class="tourTop"><span id="tourNo"></span>' +
    '<button type="button" id="tourAll">全部スキップ</button></div>' +
    '<div class="tourBody"><div class="tourE" id="tourE"></div><h2 id="tourT"></h2><p id="tourD"></p></div>' +
    '<div class="tourDots" id="tourDots"></div>' +
    '<div class="tourBtns"><button type="button" id="tourPrev">‹ 前へ</button>' +
    '<button type="button" id="tourGo" class="primary">やってみる</button>' +
    '<button type="button" id="tourNext">スキップ ›</button></div>';
  document.body.append(dlg);

  let i = 0;
  let watch = 0;
  const stopWatch = () => { clearInterval(watch); $('#tourPill')?.remove(); };
  const done = () => {
    stopWatch();
    state.tourDone = true;
    delete state.tourAt;
    save();
  };
  const draw = () => {
    const cs = list();
    const c = cs[i];
    $('#tourNo').textContent = `${i + 1} / ${cs.length}`;
    $('#tourE').textContent = c.e;
    $('#tourT').textContent = c.t;
    $('#tourD').textContent = c.d;
    $('#tourDots').innerHTML = cs.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('');
    $('#tourPrev').style.visibility = i ? 'visible' : 'hidden';
    $('#tourGo').hidden = !c.go;
    const last = i === cs.length - 1;
    $('#tourNext').textContent = last ? 'おわり' : c.go ? 'スキップ ›' : '次へ ›';
    $('#tourAll').style.visibility = last ? 'hidden' : 'visible';
  };
  window.openTour = (from = 0) => {
    stopWatch();
    i = Math.max(0, Math.min(from, list().length - 1));
    draw();
    dlg.showModal();
  };

  // 「やってみる」で離れたときは一時停止
  const resume = () => openTour(state.tourAt || 0);
  const pause = back => {
    if (back >= list().length) { done(); return; }
    state.tourAt = back;
    save();
    if (!$('#tourPill')) {
      const p = document.createElement('div');
      p.id = 'tourPill';
      p.innerHTML = '<button type="button" id="tourResume">📘 紹介の続きへ</button>' +
        '<button type="button" class="x" id="tourQuit" aria-label="紹介をやめる">×</button>';
      document.body.append(p);
      $('#tourResume').onclick = resume;
      $('#tourQuit').onclick = done;
    }
    // 開いた画面を全部閉じたら、自動で続きを出す
    let seen = false, n = 0;
    clearInterval(watch);
    watch = setInterval(() => {
      const open = [...document.querySelectorAll('dialog[open]')].some(d => d !== dlg);
      if (open) seen = true;
      else if (seen) resume();
      if (++n > 1200) clearInterval(watch);
    }, 500);
  };

  $('#tourPrev').onclick = () => { if (i > 0) { i--; draw(); } };
  $('#tourNext').onclick = () => {
    if (i < list().length - 1) { i++; draw(); return; }
    done(); dlg.close();
  };
  $('#tourAll').onclick = () => { done(); dlg.close(); };
  $('#tourGo').onclick = () => {
    const c = list()[i];
    dlg.close();
    pause(i + 1);
    setTimeout(tryGo(c.go), 50);
  };
  dlg.addEventListener('cancel', () => done());

  // 「その他」に置く
  setTimeout(() => {
    const help = $('#helpBtn');
    if (!help || $('#tourBtn')) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.id = 'tourBtn';
    b.className = help.className;
    b.innerHTML = '<b>📘 機能の紹介</b><small>がくログでできることを、ざっくり見る</small>';
    b.onclick = () => openTour();
    help.before(b);
  }, 0);

  if (typeof FEATURES !== 'undefined' && !FEATURES.some(f => f.id === 'tour')) FEATURES.push({
    id: 'tour', name: '機能の紹介', where: 'その他',
    desc: 'がくログでできることを、カードでざっくり紹介する',
    kw: 'チュートリアル 使い方 紹介 説明 はじめて ヘルプ', go: () => openTour()
  });

  // 初めてのとき・途中でやめたときは自動で出す（ほかの画面が開いてたら待つ）
  let wait = 0;
  const auto = () => {
    if (state.tourDone) return;
    if (!state.onboarded) { setTimeout(auto, 1500); return; } // 初めの質問に答え終わってから
    if (document.querySelector('dialog[open]')) { if (++wait < 20) setTimeout(auto, 1500); return; }
    openTour(state.tourAt || 0);
  };
  setTimeout(auto, 800);
}

/* ===== 時間割のQRコードをボタンの列の下へ出す ===== */
{
  const q = $('#shareQr');
  const row = q?.parentElement;
  if (q && row && getComputedStyle(row).display.includes('flex')) row.after(q);
}

/* ===== 共有した予定へのコメント ===== */
{
  const say = m => (typeof toast === 'function' ? toast(m) : alert(m));
  const blocked = () => (state.grBlock = Array.isArray(state.grBlock) ? state.grBlock : []);
  const myName = () => { const m = grMe(); return String((typeof m === 'string' ? m : m?.name) || '').slice(0, 20); };
  const hhmm = t => `${t.getHours()}:${String(t.getMinutes()).padStart(2, '0')}`;
  const col = (F, db, e) => F.collection(db, 'groups', e.gid, 'events', e.doc, 'comments');

  const box = document.createElement('div');
  box.id = 'cmBox';
  box.hidden = true;
  box.innerHTML = '<h3>💬 コメント</h3><ul class="cmList" id="cmList"></ul>' +
    '<div class="todoAdd"><input id="cmIn" maxlength="200" placeholder="コメントを書く">' +
    '<button type="button" id="cmSend">送る</button></div>' +
    '<p class="hint">グループのみんなに見えるよ。困ったコメントは「…」から通報・ブロックできる</p>' +
    '<button type="button" id="cmUnblk" class="more" hidden></button>';
  $('#evEditBox').after(box);

  let unsub = null, cur = null, items = [];
  const stop = () => { unsub?.(); unsub = null; cur = null; items = []; box.hidden = true; };
  const draw = () => {
    const bl = blocked();
    $('#cmList').innerHTML = items.filter(c => !bl.includes(c.by)).map(c =>
      `<li class="cmRow"><div><b>${esc(c.name || '名なし')}</b> <small class="muted">${c.when}</small>` +
      `<div class="cmText">${esc(c.text)}</div></div>` +
      `<button type="button" class="cmMenu" data-cm="${c.id}" aria-label="メニュー">…</button></li>`).join('')
      || '<li class="muted">まだないよ</li>';
    $('#cmUnblk').hidden = !bl.length;
    $('#cmUnblk').textContent = `ブロックを全部やめる（${bl.length}人）`;
  };
  const start = async e => {
    stop();
    if (!e?.gid || !e.doc) return;
    cur = e;
    box.hidden = false;
    $('#cmList').innerHTML = '<li class="muted">読み込み中…</li>';
    try {
      const { db, F } = await fbInit();
      if (cur !== e) return;
      unsub = F.onSnapshot(F.query(col(F, db, e), F.orderBy('at'), F.limit(100)), snap => {
        items = snap.docs.map(d => {
          const x = d.data(), t = x.at?.toDate?.();
          return { id: d.id, by: String(x.by || ''), name: String(x.name || ''), text: String(x.text || ''),
            when: t ? `${md(t)} ${hhmm(t)}` : '' };
        });
        draw();
      }, err => { console.warn('comment', err); $('#cmList').innerHTML = '<li class="muted">読み込めなかった</li>'; });
    } catch (err) {
      console.warn('comment', err);
      $('#cmList').innerHTML = '<li class="muted">つながらなかった</li>';
    }
  };

  // 予定の編集を開いたとき・閉じたとき
  const se0 = startEvEdit;
  startEvEdit = function (id) { const r = se0.apply(this, arguments); start(findAnyEv(id)); return r; };
  const ee0 = endEvEdit;
  endEvEdit = function () { stop(); return ee0.apply(this, arguments); };

  // 送る
  const send = async () => {
    const e = cur, text = $('#cmIn').value.trim().slice(0, 200);
    if (!e || !text) return;
    if (!e || !text) return;
    if (ngCheck(text)) { alert('使えない言葉が入ってるみたい。書き直してね'); return; }
    $('#cmSend').disabled = true;
    $('#cmSend').disabled = true;
    try {
      const { db, F, uid } = await fbInit();
      await F.addDoc(col(F, db, e), { by: uid, name: myName(), text, at: F.serverTimestamp() });
      $('#cmIn').value = '';
    } catch (err) {
      console.warn('comment', err);
      alert('送れなかった。電波を確認して、もう一回ためしてね');
    }
    $('#cmSend').disabled = false;
  };
  $('#cmSend').onclick = send;
  $('#cmIn').onkeydown = e => {
    if (e.key === 'Enter' && !e.isComposing && e.keyCode !== 229) { e.preventDefault(); send(); }
  };

  // 「…」のメニュー
  const mdlg = document.createElement('dialog');
  mdlg.id = 'cmDlg';
  mdlg.innerHTML = '<p id="cmWho"></p><div class="cmActs">' +
    '<button type="button" id="cmDel">消す</button>' +
    '<button type="button" id="cmRep">通報する</button>' +
    '<button type="button" id="cmBlk">この人をブロック</button>' +
    '<button type="button" id="cmNo">やめる</button></div>';
  document.body.append(mdlg);

  let sel = null;
  const block = uid => {
    if (!blocked().includes(uid)) blocked().push(uid);
    save();
    draw();
    say('この人のコメントは見えなくしたよ');
  };
  $('#cmList').onclick = e => {
    const b = e.target.closest('[data-cm]');
    sel = b && items.find(c => c.id === b.dataset.cm);
    if (!sel || !cur) return;
    const me = fb?.uid, mine = sel.by === me;
    $('#cmWho').textContent = `${sel.name || '名なし'}「${sel.text.slice(0, 30)}」`;
    $('#cmDel').hidden = !(mine || cur.own === me);
    $('#cmRep').hidden = mine;
    $('#cmBlk').hidden = mine;
    mdlg.showModal();
  };
  $('#cmNo').onclick = () => mdlg.close();
  $('#cmDel').onclick = async () => {
    const c = sel, e = cur;
    mdlg.close();
    if (!c || !e || !confirm('このコメントを消す？')) return;
    try {
      const { db, F } = await fbInit();
      await F.deleteDoc(F.doc(col(F, db, e), c.id));
    } catch (err) { console.warn('comment', err); alert('消せなかった'); }
  };
  $('#cmRep').onclick = async () => {
    const c = sel, e = cur;
    mdlg.close();
    if (!c || !e) return;
    const why = prompt('通報する理由（なくてもOK）', '');
    if (why === null) return;
    try {
      const { db, F, uid } = await fbInit();
      await F.addDoc(F.collection(db, 'reports'), {
        by: uid, gid: e.gid, eid: e.doc, cid: c.id, target: c.by,
        text: c.text.slice(0, 200), why: why.trim().slice(0, 200), at: F.serverTimestamp()
      });
      say('通報したよ。確認して対応するね');
    } catch (err) { console.warn('comment', err); alert('送れなかった。もう一回ためしてね'); return; }
    if (confirm('この人のコメントを、これから見えなくする？')) block(c.by);
  };
  $('#cmBlk').onclick = () => {
    const c = sel;
    mdlg.close();
    if (c && confirm(`${c.name || 'この人'}のコメントを見えなくする？（相手には伝わらないよ）`)) block(c.by);
  };
  $('#cmUnblk').onclick = () => {
    if (!confirm('ブロックを全部やめる？')) return;
    state.grBlock = [];
    save();
    draw();
  };
}

/* ===== 友達の時間割（共有コードから名前を付けて保存） ===== */
{
  if (!Array.isArray(state.friendGrids)) state.friendGrids = [];
  const FR_MAX = 30;
  let frCur = '';

  // 共有の読み込み画面に「友達として保存」を足す
  $('#shareAdd').insertAdjacentHTML('afterend',
    '<div class="frSaveBox">' +
    '<input id="frName" maxlength="20" placeholder="友達の名前（例：たけし）">' +
    '<button type="button" id="frSave">👥 友達の時間割として保存</button>' +
    '</div>');

  $('#frSave').onclick = () => {
    const d = shareData;
    if (!d) return;
    const name = $('#frName').value.trim().slice(0, 20);
    if (!name) return alert('名前を入れてね');
    const list = state.friendGrids;
    const old = list.find(f => f.name === name);
    if (old) {
      if (!confirm(`「${name}」の時間割を、今もらったものに入れ替える？`)) return;
    } else if (list.length >= FR_MAX) {
      return alert(`友達の時間割は${FR_MAX}人までだよ。いらない人を消してね`);
    }
    const g = {
      id: old?.id || uid(), name, term: d.name, at: Date.now(),
      periods: d.periods, times: d.times,
      courses: d.courses.map(c => ({
        day: c.day, period: c.period, name: c.name, short: c.short,
        teacher: c.teacher, room: c.room, from: c.from, to: c.to,
        color: c.tag?.color || ''
      }))
    };
    if (old) Object.assign(old, g); else list.push(g);
    shareData = null;
    $('#shareIn').value = '';
    $('#frName').value = '';
    save();
    $('#termDlg').close();
    syncFrBtn();
    toast(`「${name}」の時間割を保存したよ`);
    openFriends(g.id);
  };

  // 時間割の上のボタン
  $('#grid').insertAdjacentHTML('beforebegin',
    '<button type="button" id="frOpen" class="frOpen" hidden>👥 友達の時間割</button>');
  $('#frOpen').onclick = () => openFriends();
  function syncFrBtn() { $('#frOpen').hidden = !state.friendGrids.length; }

  // 見る画面
  const dlg = document.createElement('dialog');
  dlg.id = 'frDlg';
  dlg.innerHTML =
    '<div class="dlgHead"><b>👥 友達の時間割</b><button type="button" class="x big" id="frX">×</button></div>' +
    '<div class="frTabs" id="frTabs"></div>' +
    '<p class="hint" id="frInfo"></p>' +
    '<div id="frGrid" class="frGrid"></div>' +
    '<div id="frInt"></div>' +
    '<div class="frBtns">' +
    '<button type="button" id="frRename">名前を変える</button>' +
    '<button type="button" id="frDel">この人を消す</button>' +
    '</div>' +
    '<p class="hint">新しくしたいときは、もう一回共有コードをもらって同じ名前で保存してね</p>';
  document.body.append(dlg);
  $('#frX').onclick = () => dlg.close();

  const cur = () => state.friendGrids.find(f => f.id === frCur);

  window.openFriends = id => {
    if (!state.friendGrids.length) {
      return alert('まだ友達の時間割がないよ。友達に共有コードをもらって、読み込んだあと「👥 友達の時間割として保存」を押してね');
    }
    frCur = id && state.friendGrids.some(f => f.id === id) ? id : (cur()?.id || state.friendGrids[0].id);
    renderFr();
    if (!dlg.open) dlg.showModal();
  };

  function renderFr() {
    const f = cur();
    if (!f) return;
    $('#frTabs').innerHTML = state.friendGrids.map(x =>
      `<button type="button" data-frid="${x.id}" class="${x.id === f.id ? 'on' : ''}">${esc(x.name)}</button>`).join('');
    const d = new Date(f.at);
    $('#frInfo').textContent = `「${f.term}」・${d.getMonth() + 1}/${d.getDate()}にもらった時間割`;

    const cs = f.courses.filter(c => c.day >= 0);
    const days = cs.some(c => c.day === 5) ? 6 : 5;
    const periods = Math.max(f.periods || 5, ...cs.map(c => c.period));
    const g = $('#frGrid');
    g.style.gridTemplateColumns = `30px repeat(${days},1fr)`;
    let h = '<div class="frHead"></div>';
    for (let i = 0; i < days; i++) h += `<div class="frHead">${DAYS[i]}</div>`;
    for (let p = 1; p <= periods; p++) {
      const t = f.times?.[p - 1]?.start || state.times[p - 1]?.start || '';
      h += `<div class="frNum">${p}${t ? `<small>${esc(t)}</small>` : ''}</div>`;
      for (let i = 0; i < days; i++) {
        h += '<div class="frCell">' + cs.filter(c => c.day === i && c.period === p).map(c =>
          `<div class="frCo"${c.color ? ` style="--tag:${c.color}"` : ''}>` +
          `<b>${esc(c.short?.trim() || c.name)}</b>` +
          (c.room ? `<small>${esc(c.room)}</small>` : '') + '</div>').join('') + '</div>';
      }
    }
    g.innerHTML = h;

    const ints = f.courses.filter(c => c.day < 0);
    $('#frInt').innerHTML = ints.length
      ? '<b class="frIntT">集中講義</b><ul class="frIntL">' + ints.map(c =>
          `<li>${esc(c.name)}${c.from ? `<small>${esc(c.from.slice(5).replace('-', '/'))}〜${esc((c.to || c.from).slice(5).replace('-', '/'))}</small>` : ''}</li>`).join('') + '</ul>'
      : '';
  }

  $('#frTabs').addEventListener('click', e => {
    const b = e.target.closest('[data-frid]');
    if (!b) return;
    frCur = b.dataset.frid;
    renderFr();
  });

  $('#frRename').onclick = () => {
    const f = cur();
    if (!f) return;
    const n = (prompt('新しい名前', f.name) || '').trim().slice(0, 20);
    if (!n || n === f.name) return;
    if (state.friendGrids.some(x => x !== f && x.name === n)) return alert('その名前はもう使ってるよ');
    f.name = n;
    save();
    renderFr();
  };

  $('#frDel').onclick = () => {
    const f = cur();
    if (!f || !confirm(`「${f.name}」の時間割を消す？`)) return;
    state.friendGrids = state.friendGrids.filter(x => x !== f);
    frCur = '';
    save();
    syncFrBtn();
    if (state.friendGrids.length) renderFr(); else dlg.close();
  };

  // アプリ内検索に出す
  if (typeof FEATURES !== 'undefined') FEATURES.push({
    id: 'friendGrid', name: '友達の時間割', where: '時間割 → 👥 友達の時間割',
    desc: '共有コードでもらった友達の時間割を、名前ごとに見る',
    kw: '友達 時間割 共有 見る 名前', go: () => openFriends()
  });

  setTimeout(syncFrBtn, 0);
}

/* ===== QRコードをカメラで自動で読む ===== */
{
  const qIn = $('#shareQrIn');
  if (qIn) {
    // 今のボタンは「画像から読む」に名前を変える
    const lb = qIn.closest('label');
    if (lb?.firstChild?.nodeType === 3) lb.firstChild.textContent = '🖼 画像から読む';

    const cBtn = document.createElement('button');
    cBtn.type = 'button';
    cBtn.id = 'qrCamBtn';
    cBtn.textContent = '📷 カメラで読む';
    (lb || qIn).before(cBtn);

    const dlg = document.createElement('dialog');
    dlg.id = 'qrCamDlg';
    dlg.innerHTML =
      '<div class="dlgHead"><b>QRコードを読む</b><button type="button" class="x big" id="qrCamX">×</button></div>' +
      '<div class="qrCamWrap"><video id="qrCamV" playsinline muted autoplay></video><div class="qrCamFrame"></div></div>' +
      '<p class="hint" id="qrCamMsg">QRコードを枠の中に映してね</p>';
    document.body.append(dlg);

    const v = $('#qrCamV');
    const cv = document.createElement('canvas');
    const cx = cv.getContext('2d', { willReadFrequently: true });
    let stream = null, raf = 0, last = 0;

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      stream?.getTracks().forEach(t => t.stop());
      stream = null;
      v.srcObject = null;
    };

    const scan = now => {
      if (!stream) return;
      raf = requestAnimationFrame(scan);
      if (now - last < 150 || v.readyState < 2) return; // 1秒に6〜7回だけ読む
      last = now;
      const sc = Math.min(1, 720 / Math.max(v.videoWidth, v.videoHeight));
      cv.width = Math.round(v.videoWidth * sc);
      cv.height = Math.round(v.videoHeight * sc);
      cx.drawImage(v, 0, 0, cv.width, cv.height);
      const r = jsQR(cx.getImageData(0, 0, cv.width, cv.height).data, cv.width, cv.height,
        { inversionAttempts: 'dontInvert' });
      if (!r) return;
      if (!r.data.includes(SHARE_TAG)) {
        $('#qrCamMsg').textContent = 'がくログの共有QRじゃないみたい';
        return;
      }
      navigator.vibrate?.(50);
      stop();
      dlg.close();
      $('#shareIn').value = r.data;
      $('#shareRead').click();
    };

    cBtn.onclick = async () => {
      if (typeof jsQR !== 'function') return alert('QRコードの部品が読み込めてないみたい');
      if (!navigator.mediaDevices?.getUserMedia) {
        return alert('この端末だとカメラで読めないみたい。「🖼 画像から読む」を使ってね');
      }
      $('#qrCamMsg').textContent = 'QRコードを枠の中に映してね';
      dlg.showModal();
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } }, audio: false
        });
        if (!dlg.open) return stop();
        v.srcObject = stream;
        await v.play();
        raf = requestAnimationFrame(scan);
      } catch (e) {
        stop();
        dlg.close();
        alert(e.name === 'NotAllowedError'
          ? 'カメラが許可されてないよ。スマホの設定 → アプリ → がくログ → カメラ をONにしてね'
          : 'カメラを開けなかった。「🖼 画像から読む」を使ってね');
      }
    };

    $('#qrCamX').onclick = () => dlg.close();
    dlg.addEventListener('close', stop);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && dlg.open) dlg.close();
    });
  }
}

/* ===== ミニノートの写真を大きく見る ===== */
{
  const SEL = '#mnDlg .mnPic img, #mnDlg img.mnPic, #exDlg .mnPic img'; // 試験前の見返しの写真も
  const v = document.createElement('dialog');
  v.id = 'picView';
  v.innerHTML =
    '<button type="button" class="x big" id="pvX">×</button>' +
    '<div class="pvStage" id="pvStage"><img id="pvImg" alt=""></div>' +
    '<div class="pvNav"><button type="button" id="pvPrev">‹</button>' +
    '<span id="pvNo"></span><button type="button" id="pvNext">›</button></div>';
  document.body.append(v);

  const img = $('#pvImg'), stage = $('#pvStage');
  let list = [], idx = 0, s = 1, x = 0, y = 0;
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const apply = () => { img.style.transform = `translate(${x}px, ${y}px) scale(${s})`; };
  const reset = () => { s = 1; x = 0; y = 0; apply(); };
  const show = i => {
    idx = (i + list.length) % list.length;
    img.src = list[idx];
    reset();
    const many = list.length > 1;
    $('#pvNo').textContent = many ? `${idx + 1} / ${list.length}` : '';
    $('#pvPrev').hidden = $('#pvNext').hidden = !many;
  };

  // 写真をタップしたら開く（「外す」ボタンは今までどおり）
  document.addEventListener('click', e => {
    if (e.target.closest('button')) return;
    const im = e.target.closest(SEL);
    if (!im) return;
    e.preventDefault();
    e.stopPropagation();
    list = [...document.querySelectorAll(SEL)].map(i => i.src);
    v.showModal();
    show(Math.max(0, list.indexOf(im.src)));
  }, true);

  $('#pvX').onclick = () => v.close();
  $('#pvPrev').onclick = () => show(idx - 1);
  $('#pvNext').onclick = () => show(idx + 1);
  v.addEventListener('close', () => { img.removeAttribute('src'); reset(); });

  // スマホ：ピンチで拡大、1本指で移動・スワイプ、ダブルタップ
  let t0 = null, lastTap = 0;
  const dist = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  const one = t => ({ px: t.clientX, py: t.clientY, x, y });
  stage.addEventListener('touchstart', e => {
    const ts = e.touches;
    if (ts.length === 2) {
      t0 = { d: dist(ts[0], ts[1]), s, x, y,
        mx: (ts[0].clientX + ts[1].clientX) / 2, my: (ts[0].clientY + ts[1].clientY) / 2 };
    } else if (ts.length === 1) {
      const now = Date.now();
      if (now - lastTap < 300) {
        lastTap = 0;
        t0 = null;
        if (s > 1) reset(); else { s = 2.5; apply(); }
        e.preventDefault();
        return;
      }
      lastTap = now;
      t0 = one(ts[0]);
    }
  }, { passive: false });

  stage.addEventListener('touchmove', e => {
    if (!t0) return;
    e.preventDefault();
    const ts = e.touches;
    if (ts.length === 2 && t0.d) {
      s = clamp(t0.s * dist(ts[0], ts[1]) / t0.d, 1, 5);
      x = t0.x + (ts[0].clientX + ts[1].clientX) / 2 - t0.mx;
      y = t0.y + (ts[0].clientY + ts[1].clientY) / 2 - t0.my;
      apply();
    } else if (ts.length === 1 && t0.px != null && s > 1) {
      x = t0.x + ts[0].clientX - t0.px;
      y = t0.y + ts[0].clientY - t0.py;
      apply();
    }
  }, { passive: false });

  stage.addEventListener('touchend', e => {
    if (e.touches.length === 1) { t0 = one(e.touches[0]); return; }
    if (e.touches.length) return;
    if (s <= 1.02) {
      const dx = t0?.px != null ? e.changedTouches[0].clientX - t0.px : 0;
      if (list.length > 1 && Math.abs(dx) > 60) show(idx + (dx < 0 ? 1 : -1));
      else reset();
    }
    t0 = null;
  });

  // PC：ダブルクリックとホイール
  stage.addEventListener('dblclick', () => { if (s > 1) reset(); else { s = 2.5; apply(); } });
  stage.addEventListener('wheel', e => {
    e.preventDefault();
    s = clamp(s * (e.deltaY < 0 ? 1.15 : 1 / 1.15), 1, 5);
    if (s === 1) { x = 0; y = 0; }
    apply();
  }, { passive: false });
}

/* ===== 収入：記録をたたむ・目標額 ===== */
{
  if (state.incomeGoal == null) state.incomeGoal = '';

  // 目標額の入力欄（上限の欄の下）
  $('#inLimit').parentElement.insertAdjacentHTML('afterend',
    '<label class="inGoalRow">目標額（1年）' +
    '<input id="inGoal" inputmode="numeric" placeholder="例：500000"></label>' +
    '<p class="hint">入れると、円グラフが目標に対して何%かになるよ</p>');
  $('#inGoal').addEventListener('input', e => {
    state.incomeGoal = toYen(e.target.value) ?? '';
    save();
    renderIncome();
  });
  $('#incomeBtn').addEventListener('click', () => { $('#inGoal').value = state.incomeGoal; });

  // 記録の一覧を開け閉めできるように
  const list = $('#inList');
  const prev = list.previousElementSibling;
  if (prev && /^(H\d|B|P|STRONG)$/.test(prev.tagName) && prev.textContent.trim().startsWith('記録')) prev.hidden = true;
  const box = document.createElement('details');
  box.className = 'inRec';
  box.innerHTML = '<summary>記録 <small id="inRecN"></small></summary>';
  list.before(box);
  box.append(list);

  // 月ごとの表も同じく開け閉めできるように（12か月ぶん並ぶとごちゃつくので、最初は閉じる。開けたかは覚えておく）
  const mt = $('#inMonths');
  const mbox = document.createElement('details');
  mbox.className = 'inRec';
  mbox.id = 'inMonthsBox';
  mbox.innerHTML = '<summary>月ごと <small id="inMonthsN"></small></summary>';
  mt.before(mbox);
  mbox.append(mt);
  try { mbox.open = localStorage.getItem('inMonthsOpen') === '1'; } catch {}
  mbox.addEventListener('toggle', () => { try { localStorage.setItem('inMonthsOpen', mbox.open ? '1' : '0'); } catch {} });

  const _ri = renderIncome;
  renderIncome = function () {
    _ri.apply(this, arguments);
    const xs = incomesOf(inYear), n = xs.length;
    $('#inRecN').textContent = n ? `${n}件` : '';
    const months = new Set(xs.map(x => x.date.slice(5, 7))).size;
    $('#inMonthsN').textContent = months ? `${months}か月分` : 'まだなし';
  };
}

/* ===== 予定の候補：たたむ・まとめて消す ===== */
{
  const chips = $('#evChips');
  const box = document.createElement('details');
  box.className = 'evPre';
  box.open = localStorage.getItem('evPreOpen') === '1';
  box.innerHTML =
    '<summary>よく使う予定 <small id="evPreN"></small></summary>' +
    '<div class="evPreBar">' +
    '<button type="button" id="evPreEdit">✎ 編集</button>' +
    '<button type="button" id="evPreAll" hidden>全部選ぶ</button>' +
    '<button type="button" id="evPreDel" hidden>消す</button>' +
    '</div>';
  chips.before(box);
  box.append(chips);
  box.addEventListener('toggle', () => localStorage.setItem('evPreOpen', box.open ? '1' : '0'));

  let editing = false;
  const picked = new Set();

  const syncBar = () => {
    $('#evPreEdit').textContent = editing ? '完了' : '✎ 編集';
    $('#evPreAll').hidden = $('#evPreDel').hidden = !editing;
    $('#evPreDel').textContent = `選んだ${picked.size}件を消す`;
    $('#evPreDel').disabled = !picked.size;
    $('#evPreAll').textContent = picked.size === state.evPresets.length && picked.size ? '全部外す' : '全部選ぶ';
  };

  const _rs = renderEvSuggest;
  renderEvSuggest = function () {
    _rs.apply(this, arguments);
    const n = state.evPresets.length;
    $('#evPreN').textContent = n ? `${n}件` : '';
    $('#evPreEdit').disabled = !n;
    if (!n) editing = false;
    if (editing) {
      chips.innerHTML = state.evPresets.map((p, i) =>
        `<button type="button" class="chip${picked.has(i) ? ' sel' : ''}" data-preset="${i}">` +
        `${picked.has(i) ? '✓ ' : ''}${esc(p.title)}` +
        (p.start ? ` <small>${esc(evTime(p))}</small>` : '') + '</button>').join('');
    }
    chips.classList.toggle('editing', editing);
    syncBar();
  };

  $('#evPreEdit').onclick = () => {
    editing = !editing;
    picked.clear();
    renderEvSuggest();
  };

  $('#evPreAll').onclick = () => {
    const all = picked.size === state.evPresets.length;
    picked.clear();
    if (!all) state.evPresets.forEach((_, i) => picked.add(i));
    renderEvSuggest();
  };

  $('#evPreDel').onclick = () => {
    if (!picked.size) return;
    if (!confirm(`候補を${picked.size}件消す？\n入ってる予定は消えないよ`)) return;
    state.evPresets = state.evPresets.filter((_, i) => !picked.has(i));
    picked.clear();
    editing = false;
    save();
    renderEvSuggest();
    renderJobChips?.();
  };

  // 編集中はタップで選ぶだけ（入力欄には入れない）
  chips.addEventListener('click', e => {
    if (!editing) return;
    const b = e.target.closest('[data-preset]');
    if (!b) return;
    e.stopImmediatePropagation();
    const i = +b.dataset.preset;
    if (picked.has(i)) picked.delete(i); else picked.add(i);
    renderEvSuggest();
  }, true);

  renderEvSuggest();
}

/* ===== 授業の行から📒＋でミニノートを足す ===== */
{
  const _cl = courseLine;
  courseLine = function (x) {
    const h = _cl.apply(this, arguments);
    const btn = ` <button type="button" class="mnQuick" data-mnq="${x.c.id}" aria-label="ミニノートを足す">📒＋</button>`;
    const i = h.indexOf('<div', 5);
    const at = i > 0 ? i : h.lastIndexOf('</div>');
    return h.slice(0, at) + btn + h.slice(at);
  };

  let quick = false;
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-mnq]');
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    const row = b.closest('.nc');
    (row?.querySelector('b') || row)?.click(); // 授業の画面を開く
    let n = 0;
    const wait = setInterval(() => {
      const cd = $('#courseDlg'), nb = $('#mnNew');
      if (cd?.open && nb) {
        clearInterval(wait);
        quick = true;
        nb.click();
      } else if (++n > 20) {
        clearInterval(wait);
        alert('ミニノートを開けなかった。授業の画面から足してね');
      }
    }, 50);
  }, true);

  $('#mnDlg')?.addEventListener('close', () => {
    if (!quick) return;
    quick = false;
    $('#courseDlg')?.close();
    renderNow?.();
  });

  renderNow?.();
}

/* ===== タブバーの着せかえ ===== */
{
  const TB = [
    ['tb-pastel', 'パステル', '🍬 ふんわり3色', 20],
    ['tb-dark', 'よる', '🌑 黒に黄色のアクセント', 30],
    ['tb-glass', 'ガラス', '🫧 うしろがすけて見える', 40],
    ['tb-washi', 'わし', '📜 和紙と朱色', 60],
    ['tb-neon', 'ネオン', '⚡ 光る水色', 100],
  ];
  const tb = $('#tabbar');

  TB.forEach(([id, name, desc, cost]) => SHOP.push({
    id, name: `タブバー「${name}」`, desc, cost,
    onGet() { state.tabTheme = id; save(); apply(id); },
  }));

  const apply = id => {
    const root = document.documentElement;
    TB.forEach(([k]) => root.classList.remove(k));
    if (id && ptOwned(id)) root.classList.add(id);
  };
  apply(state.tabTheme);

  const dlg = document.createElement('dialog');
  dlg.id = 'tbDlg';
  dlg.innerHTML = '<div class="dlgHead"><b>🎨 タブバーの見た目</b><button type="button" class="x big" id="tbX">×</button></div>' +
    '<div id="tbList" class="tbList"></div><p class="hint">ポイント交換で増やせるよ</p>';
  document.body.append(dlg);

  const draw = () => {
    const cur = state.tabTheme && ptOwned(state.tabTheme) ? state.tabTheme : '';
    const rows = [['', 'いつもの', '最初のデザイン'], ...TB.filter(([id]) => ptOwned(id))];
    $('#tbList').innerHTML = rows.map(([id, name, desc]) =>
      `<button type="button" data-tb="${id}" class="${id === cur ? 'on' : ''}"><b>${esc(name)}</b><small>${esc(desc)}</small></button>`
    ).join('');
  };
  window.openTbTheme = () => { draw(); dlg.showModal(); };

  $('#tbList').onclick = e => {
    const b = e.target.closest('[data-tb]');
    if (!b) return;
    state.tabTheme = b.dataset.tb;
    save(); apply(state.tabTheme); draw();
  };
  $('#tbX').onclick = () => dlg.close();
}

/* ===== バーのプレビュー（上下セット） ===== */
{
  const dlg = document.createElement('dialog');
  dlg.id = 'tbPrevDlg';
  document.body.append(dlg);

  const copy = (sel, cls) => {
    const n = $(sel).cloneNode(true);
    n.removeAttribute('id');
    n.className = cls;
    n.setAttribute('aria-hidden', 'true');
    n.querySelectorAll('[id]').forEach(x => x.removeAttribute('id'));
    return n;
  };
  const set = id => {
    const hd = copy('body > header', 'hdPrev');
    const sel = hd.querySelector('select');
    if (sel) {
      const sp = document.createElement('span');
      sp.className = 'hdTerm';
      sp.textContent = $('#termSelect')?.selectedOptions[0]?.text || '学期';
      sel.replaceWith(sp);
    }
    const tb = copy('#tabbar', 'tbPrev');
    tb.querySelectorAll('button').forEach((b, i) => {
      b.tabIndex = -1;
      b.removeAttribute('aria-current');
      b.classList.toggle('on', i === 0);
    });
    return `<div class="tbSet ${id || 'tb-none'}">${hd.outerHTML}<div class="tbGap"></div>${tb.outerHTML}</div>`;
  };

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-wgprev^="tb-"]');
    if (!b) return;
    const s = SHOP.find(x => x.id === b.dataset.wgprev);
    if (!s) return;
    const now = state.tabTheme && ptOwned(state.tabTheme) ? state.tabTheme : '';
    dlg.innerHTML =
      `<div class="dlgHead"><h2>${esc(s.name)}</h2><button type="button" class="x big" data-tpclose aria-label="閉じる">×</button></div>` +
      `<p class="tpLbl">いま</p>${set(now)}` +
      `<p class="tpLbl">交換すると</p>${set(s.id)}` +
      `<p class="hint">${ptOwned(s.id) ? 'もう持ってるよ。その他 → 見た目 → テーマ・文字で切り替えられる' : `${s.cost}pで交換できる`}</p>`;
    dlg.showModal();
  });
  dlg.addEventListener('click', e => {
    if (e.target.closest('[data-tpclose]') || e.target === dlg) dlg.close();
  });
}
/* ===== タブバーの見た目を「テーマ・文字」に置く ===== */
{
  const tbList = () => SHOP.filter(s => s.id.startsWith('tb-'));
const apply = id => {
  const root = document.documentElement;
  SHOP.filter(s => s.id.startsWith('tb-')).forEach(s => root.classList.remove(s.id));
  if (id && ptOwned(id)) root.classList.add(id);
};

  const box = document.createElement('div');
  box.id = 'tbPick';
  box.innerHTML = '<p class="tbPickH">タブバー</p><div class="tbPickList"></div>' +
    '<p class="hint">🔒 はポイント交換で手に入るよ</p>';

  const draw = () => {
    const cur = state.tabTheme && ptOwned(state.tabTheme) ? state.tabTheme : '';
    const rows = [{ id: '', name: 'いつもの', cost: 0 }, ...tbList()];
    box.querySelector('.tbPickList').innerHTML = rows.map(s => {
      const has = !s.id || ptOwned(s.id);
      const nm = s.name.replace(/^タブバー「(.+)」$/, '$1');
      return `<button type="button" data-tbpick="${s.id}" class="${s.id === cur ? 'on' : ''}" ${has ? '' : 'disabled'}>` +
        `${esc(nm)}${has ? '' : `<small>🔒 ${s.cost}p</small>`}</button>`;
    }).join('');
  };

  box.addEventListener('click', e => {
    const b = e.target.closest('[data-tbpick]');
    if (!b || b.disabled) return;
    state.tabTheme = b.dataset.tbpick;
    save(); apply(state.tabTheme); draw();
  });

  let tries = 0;
  const put = () => {
    const dlg = $('#wallDlg'), sec = $('#sColor')?.closest('details');
    if (!dlg || !sec) { if (++tries < 30) setTimeout(put, 200); return; }
    sec.append(box);
    draw();
    // 開くたびに作り直す（交換したばかりのテーマもすぐ出るように）
    new MutationObserver(() => { if (dlg.open) draw(); })
      .observe(dlg, { attributes: true, attributeFilter: ['open'] });
  };
  setTimeout(put, 0);

  // 検索でも見つかるように
  if (typeof FEATURES !== 'undefined') FEATURES.push({
    id: 'tabbar', name: 'タブバーの見た目', where: 'その他 → 見た目',
    desc: '下のタブバーのデザインを変える', kw: 'タブバー 着せかえ デザイン 見た目',
    go: () => openLook('font'),
  });
}

/* ===== バーの色に合わせて、時計の文字色とブラウザの色も変える ===== */
{
  const DARK = ['tb-dark', 'tb-neon'];
  const metas = [...document.querySelectorAll('meta[name="theme-color"]')];
  const keep = metas.map(m => m.content);
  const sync = () => {
    const cl = document.documentElement.classList;
    const tb = [...cl].some(c => c.startsWith('tb-'));
    const on = tb || cl.contains('cardC'); // カードの色を選んでるときもバーはその色
    const bg = getComputedStyle($('body > header')).backgroundColor;
    const ok = on && bg && bg !== 'rgba(0, 0, 0, 0)';
    metas.forEach((m, i) => { m.content = ok ? bg : keep[i]; });
    const dark = tb ? DARK.some(c => cl.contains(c)) : document.documentElement.dataset.cardScheme === 'dark';
    const SB = window.Capacitor?.Plugins?.SystemBars;
    SB?.setStyle({ style: !on ? 'DEFAULT' : dark ? 'DARK' : 'LIGHT' }).catch?.(() => {});
  };
  new MutationObserver(() => setTimeout(sync, 350))
    .observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  setTimeout(sync, 0);
}

/* ===== 交換所の背景 ===== */
{
  const BG = [
    ['bg-dot', 'ドット', 'bg-dot.png', 10, 'うすいドットの方眼'],
    ['bg-grid', '方眼', 'bg-grid.png', 10, '白い方眼紙'],
    ['bg-note', 'ノート', 'bg-note.png', 10, '罫線ノート'],
    ['bg-char', 'チャコール', 'bg-char.png', 15, '落ち着いた濃いグレー'],
    ['bg-pastel', 'パステル', 'bg-pastel.png', 20, 'ふんわり淡い色'],
    ['bg-sky', '青空', 'bg-sky.png', 20, '晴れた空'],
    ['bg-dusk', '夕やみ', 'bg-dusk.png', 25, '紺から紫へのグラデ'],
    ['bg-board', '黒板', 'bg-board.png', 25, '深緑の方眼'],
    ['bg-sakura', '桜', 'bg-sakura.png', 30, '舞う花びら'],
    ['bg-star', '星空', 'bg-star.png', 40, '夜空に小さな星'],
  ];
  const DIR = 'wall/';
  const find = id => BG.find(b => b[0] === id);
  const url = b => `url("${DIR}${b[2]}")`;
  if (typeof state.wallShop !== 'string') state.wallShop = '';

  const use = id => {
    state.wallShop = id;
    if (id) wallState().type = 'none';
    save();
    applyWall();
    if (wallDlg.open) renderWall();
  };

  BG.forEach(([id, name, file, cost, desc]) => SHOP.push({
    id, name: `背景「${name}」`, desc, cost,
    onGet: () => use(id),
  }));

  // 壁紙の表示に交換した背景を上乗せ
  const _apply = applyWall;
  applyWall = async function (...a) {
    await _apply.apply(this, a);
    const b = find(state.wallShop);
    if (!b || !ptOwned(b[0]) || wallState().type !== 'none') return;
    wallBg.className = 'wp-shop';
    wallBg.style.backgroundImage = url(b);
    document.documentElement.classList.add('hasWall');
  };

  // 壁紙画面に「交換した背景」欄
  const box = document.createElement('div');
  box.className = 'wsBox';
  const draw = () => {
    const pane = wallDlg.querySelector('.lookPane[data-lp="bg"]') || wallDlg;
    if (box.parentElement !== pane) pane.append(box);
    const own = BG.filter(b => ptOwned(b[0]));
    box.innerHTML = '<h4>交換した背景</h4>' + (own.length
      ? '<div class="wsList">' + own.map(b =>
          `<button type="button" data-wshop="${b[0]}" class="${state.wallShop === b[0] ? 'on' : ''}">` +
          `<i style='background-image:${url(b)}'></i>${b[1]}</button>`).join('') + '</div>'
      : '<p class="hint">ポイント交換所で背景を交換すると、ここに出てくるよ</p>');
  };
  const _render = renderWall;
  renderWall = function (...a) { const r = _render.apply(this, a); draw(); return r; };

  wallDlg.addEventListener('click', e => {
    const s = e.target.closest('[data-wshop]');
    if (s) return use(s.dataset.wshop);
    if (e.target.closest('[data-wall]')) state.wallShop = '';
  }, true);
  document.addEventListener('change', e => {
    if (e.target.id === 'wallFile' && e.target.files?.length) state.wallShop = '';
  }, true);

  // 「見る」のプレビュー
  const pv = document.createElement('dialog');
  pv.id = 'bgPrevDlg';
  pv.innerHTML = '<div class="dlgHead"><b id="bgPvT"></b><button type="button" class="x big" data-bpclose aria-label="閉じる">×</button></div>' +
    '<div class="bgPvImg" id="bgPvImg"></div><p class="hint" id="bgPvMsg"></p>' +
    '<button type="button" id="bgPvUse" hidden>この背景にする</button>';
  document.body.append(pv);
  let pvId = '';
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-wgprev^="bg-"]');
    const s = b && find(b.dataset.wgprev);
    if (!s) return;
    pvId = s[0];
    const own = ptOwned(s[0]), now = state.wallShop === s[0];
    $('#bgPvT').textContent = `背景「${s[1]}」`;
    $('#bgPvImg').style.backgroundImage = url(s);
    $('#bgPvMsg').textContent = now ? 'いま使ってる背景だよ' : own ? 'もう持ってるよ' : `${s[3]}pで交換できる`;
    $('#bgPvUse').hidden = !own || now;
    pv.showModal();
  });
  pv.addEventListener('click', e => {
    if (e.target === pv || e.target.closest('[data-bpclose]')) return pv.close();
    if (e.target.closest('#bgPvUse')) { use(pvId); pv.close(); }
  });

  applyWall();
}

/* ===== 試用期間のお礼ポイント ===== */
setTimeout(() => {
  const GIFT_ID = 'beta-thanks';
  const GIFT_PT = 200;
  const LABEL = '試用期間のお礼';
  const END = new Date('2027-01-01T00:00:00+09:00').getTime();
  const p = ptState();
  if (!Array.isArray(p.gifts)) p.gifts = [];
  if (!Array.isArray(p.log)) p.log = [];
  const top = p.log[0];
  const entry = () => ({ date: ymd(new Date()), get: GIFT_PT, gift: LABEL, streak: top?.streak ?? 0 });
  let got = false;

  if (Date.now() < END && !p.gifts.includes(GIFT_ID)) {
    p.gifts.push(GIFT_ID);
    p.pt += GIFT_PT;
    p.log.unshift(entry());
    got = true;
  } else if (p.gifts.includes(GIFT_ID) && !p.log.some(x => x.gift === LABEL)) {
    p.log.unshift(entry()); // 前のコードでもらった人にも履歴だけ付ける
  } else return;

  p.log = p.log.slice(0, 30);
  save();
  if (typeof renderPtBtn === 'function') renderPtBtn();
  if (ptDlg.open) renderPoints();
  if (got) setTimeout(() => alert(`試してくれてありがとう！\nお礼に${GIFT_PT}pプレゼント`), 800);
}, 0);

/* ===== 直前の操作をあとからでも取り消す ===== */
{
  const KEY = 'undoSnap';
  const dlg = $('#termDlg');
  if (dlg) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'undoLast';
    dlg.append(btn);
    const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } };
    const sync = () => {
      const d = read();
      btn.hidden = !d;
      if (d) {
        const t = new Date(d.t);
        btn.textContent = `↩ ${t.getMonth() + 1}/${t.getDate()} ${t.getHours()}:${String(t.getMinutes()).padStart(2, '0')}の「${d.msg}」を取り消す`;
      }
      return d;
    };
    new MutationObserver(() => { if (dlg.open) sync(); })
      .observe(dlg, { attributes: true, attributeFilter: ['open'] });
    btn.onclick = () => {
      const d = read();
      if (!d) return;
      if (!confirm(`「${d.msg}」の前の状態に戻す？\nそのあとに入れた変更も消えるよ`)) return;
      const now = JSON.stringify(state);
      restoreSnap(d.snap);
      try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), msg: '取り消し', snap: now })); } catch {}
      sync();
    };
  }
}


/* ===== 予定の📷：シフト表か、予定が書いてある画像か選ぶ ===== */
{
  const dlg = document.createElement('dialog');
  dlg.id = 'evPhDlg';
  dlg.innerHTML =
    '<div class="dlgHead"><b>画像から追加</b><button type="button" class="x big" data-epx aria-label="閉じる">×</button></div>' +
    '<button type="button" class="evPhOpt" data-ep="shift"><b>📅 バイトのシフト表</b><small>シフト表の写真・PDFから自分の勤務を追加</small></button>' +
    '<button type="button" class="evPhOpt" data-ep="memo"><b>📝 予定が書いてある画像</b><small>手帳・プリント・LINEやメールのスクショなど</small></button>';
  document.body.append(dlg);
  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.closest('[data-epx]')) return dlg.close();
    const b = e.target.closest('[data-ep]');
    if (!b) return;
    dlg.close();
    startPhoto(b.dataset.ep);
  });
  $('#evPhoto')?.addEventListener('click', () => dlg.showModal());
}

/* ===== はじめにやること（クリアでポイント） ===== */
{
  const HIDE = 'qsHide';
  const BONUS = 30;
  const tab = (w, hint) => {
    [...document.querySelectorAll('#tabbar button')].find(b => b.textContent.includes(w))?.click();
    if (hint) toast(hint);
  };
  const feat = (w, hint) => {
    const f = typeof FEATURES !== 'undefined' &&
      FEATURES.find(x => Object.values(x).some(v => typeof v === 'string' && v.includes(w)));
    if (f?.go) f.go(); else toast(hint);
  };
  const QALL = [
    ['term', '学期の開始日を入れる', 10, () => !state.useGrid || !!term()?.start, () => { goTerm('#termList'); toast('学期を選んで開始日を入れてね'); }],
    // マスをタップしただけの空の授業は数えない（保存せずに閉じると消えるので）
    ['course', '授業を1つ入れる', 10, () => !state.useGrid || courses().some(c => !courseEmpty(c)), () => { showTab('grid'); toast('空いてるマスをタップして入れてね'); }],
    ['event', '予定を1つ入れる', 5, () => state.events.length > 0, () => { showTab('cal'); toast('日付を選んで「＋ 予定」から追加してね'); }],
    ['look', '見た目を変える', 5, () => !!state.tabTheme || !!state.wallShop || wallState().type !== 'none', () => openLook('bg')],
    ['ai', 'AIの準備をする', 15, () => hasKey(), () => openPhoto('guide')],
    ['shop', 'ポイントで何か交換する', 5, () => ptState().owned.length > 0, () => openPoints()],
  ];
  // オフの機能のクエストは出さない（AIがオフなら「AIの準備」はなし）
  const Q = { get list() { return QALL.filter(q => q[0] !== 'ai' || featOn('ai')); } };

  const got = () => { const p = ptState(); if (!Array.isArray(p.quest)) p.quest = []; return p.quest; };
  const ok = q => { try { return !!q[3](); } catch { return false; } };
  const allDone = () => got().includes('all');
  const hidden = () => localStorage.getItem(HIDE) === '1';

  // 上のバーのボタン
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'qsBtn';
  btn.className = 'qsBtn';
  document.querySelector('body > header')?.append(btn);

  const dlg = document.createElement('dialog');
  dlg.id = 'qsDlg';
  dlg.innerHTML = '<div class="dlgHead"><b>🔰 はじめにやること</b>' +
    '<button type="button" class="x big" data-qsclose aria-label="閉じる">×</button></div><div id="qsBody"></div>';
  document.body.append(dlg);

  const draw = () => {
    const g = got();
    const n = Q.list.filter(q => g.includes(q[0])).length;
    btn.hidden = allDone() || hidden();
    btn.innerHTML = `🔰 <b>${n}/${Q.list.length}</b>`;
    btn.classList.toggle('can', Q.list.some(q => !g.includes(q[0]) && ok(q)));
    if (!dlg.open) return;
    $('#qsBody').innerHTML =
      `<div class="qsBar"><i style="width:${n / Q.list.length * 100}%"></i></div>` +
      '<ul class="qsList">' + Q.list.map(q => {
        const [id, label, pt] = q;
        const b = g.includes(id) ? '<span class="qsGot">✓</span>'
          : ok(q) ? `<button type="button" class="primary" data-qsget="${id}">+${pt}p 受け取る</button>`
          : `<button type="button" data-qsgo="${id}">やる <small>+${pt}p</small></button>`;
        return `<li class="${g.includes(id) ? 'done' : ''}"><span>${label}</span>${b}</li>`;
      }).join('') + '</ul>' +
      `<p class="hint">全部クリアでボーナス+${BONUS}p。クリアしたらこのボタンは消えるよ</p>` +
      '<button type="button" class="qsNever" data-qshide>もう表示しない</button>';
  };

  const give = (key, pt, label) => {
    const p = ptState();
    if (!Array.isArray(p.log)) p.log = [];
    got().push(key);
    p.pt += pt;
    p.log.unshift({ date: ymd(new Date()), get: pt, gift: label, streak: p.log[0]?.streak ?? 0 });
    p.log = p.log.slice(0, 30);
  };

  btn.onclick = () => { dlg.showModal(); draw(); };

  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.closest('[data-qsclose]')) return dlg.close();
    if (e.target.closest('[data-qshide]')) {
      localStorage.setItem(HIDE, '1');
      dlg.close();
      draw();
      return toast('ポイントの画面からまた出せるよ');
    }
    const go = QALL.find(q => q[0] === e.target.closest('[data-qsgo]')?.dataset.qsgo);
    if (go) { dlg.close(); return go[4](); }
    const q = QALL.find(q => q[0] === e.target.closest('[data-qsget]')?.dataset.qsget);
    if (!q || got().includes(q[0]) || !ok(q)) return;
    give(q[0], q[2], `はじめに：${q[1]}`);
    let msg = `+${q[2]}p ゲット！`;
    if (Q.list.every(x => got().includes(x[0])) && !allDone()) {
      give('all', BONUS, 'はじめにやること全部クリア');
      msg = `全部クリア！ ボーナス込みで+${q[2] + BONUS}p`;
      setTimeout(() => dlg.close(), 1200);
    }
    save();
    navigator.vibrate?.(30);
    if (typeof renderPtBtn === 'function') renderPtBtn();
    draw();
    toast(msg);
  });

  // 「もう表示しない」にしたあとは、ポイントの画面から戻せる
  const _rp = renderPoints;
  renderPoints = function (...a) {
    const r = _rp.apply(this, a);
    if (hidden() && !allDone())
      $('#ptBody').insertAdjacentHTML('beforeend', '<button type="button" class="qsShow" data-qsshow>🔰 はじめにやることを表示</button>');
    return r;
  };
  ptDlg.addEventListener('click', e => {
    if (!e.target.closest('[data-qsshow]')) return;
    localStorage.removeItem(HIDE);
    ptDlg.close();
    dlg.showModal();
    draw();
  });

  // 何か操作したら、クリアしたか見直す
  let tm = 0;
  const later = () => { clearTimeout(tm); tm = setTimeout(draw, 300); };
  ['click', 'change', 'close'].forEach(t => document.addEventListener(t, later, true));
  draw();
}

/* ===== 通知の画面に「ウィジェットは移ったよ」 ===== */
{
  const nf = $('#setNotify');
  if (nf && isApp) {
    const a = document.createElement('button');
    a.type = 'button';
    a.className = 'wgMoved';
    a.textContent = '🧩 ウィジェットの設定は「壁紙・文字・アイコン」に移ったよ →';
    a.onclick = () => { nf.closest('dialog')?.close(); openLook('wg'); };
    nf.append(a);
  }
}

// Android はアイコンの色を変えられないので、機能をさがすからも外す
if (isApp && !window.Capacitor?.Plugins?.AppIcon) {
  const i = FEATURES.findIndex(f => f.id === 'icon');
  if (i >= 0) FEATURES.splice(i, 1);
}
FEATURES.push({ id: 'widget', name: 'ウィジェット', where: 'その他 → 🖼 壁紙・文字・アイコン → 「ウィジェット」タブ', desc: 'ホーム画面のウィジェットの見た目やテーマを変える', kw: 'ウィジェット ホーム画面 テーマ 着せかえ', app: 1, go: () => openLook('wg') });

/* ===== AIの準備を1画面で ===== */
{
  const g = $('#phGuide');
  if (g) {
    [...g.children].forEach(el => el.hidden = true); // 前の説明は隠す（消さない）
    const w = document.createElement('div');
    w.id = 'aiWiz';
    g.prepend(w);
    const P = PROVIDERS.gemini;
    const TEST_URL = P.url.replace(/chat\/completions$/, 'models');
    let step = 0;

    // Google AI Studio の手順（www/guide/ のスクショ）
    // [画像, 説明, 番号]。4 は「キーがもうある人」と「まだない人」で分かれる（アカウントによって最初から1つできてることがある）
    const AW_SHOTS = [
      ['ai-1.jpg', '<b class="awIf">個人のGoogleアカウント（Gmail）でログイン</b>学校のアカウントだと使えないことがあるよ', '1'],
      ['ai-2.jpg', '「利用目的」を聞かれたら「スキップ」でOK', '2'],
      ['ai-3.jpg', '1つ目にチェックして「続行」（2つ目のメールはなくてOK）', '3'],
      ['ai-4.jpg', '<b class="awIf">キーが出てたら</b>キーの横のコピーのボタンを押す', '4'],
      // アプリのボタンから開くと、ふつうは最初のキーが自動でできる。別の入口から開いた人などは、先にプロジェクトがいる
      ['ai-4b.jpg', '<b class="awIf">キーが1つもなかったら</b>一度このアプリの「Googleのページを開く」から開き直してみてね。' +
        'それでもないときは、右上の「API キーを作成」を押す。押せないときや「プロジェクト」を聞かれたら、先にプロジェクトを作成（名前は何でもOK）してから「API キーを作成」。できたキーの横のコピーのボタンを押す', '4'],
    ];
    const dots = n => `<p class="awStep">ステップ ${n}/3</p>`;
    const draw = (msg = '') => {
      w.innerHTML = [
        dots(1) +
        '<p class="awLead">写真やPDFを撮るだけで、時間割・シフト・給与明細をAIが読み取って入れてくれるよ</p>' +
        '<p class="hint">キーがなくても、ほかの機能は全部使える。準備は数分で終わるよ</p>' +
        '<button type="button" class="primary awMain" data-aw="1">はじめる</button>',

        dots(2) +
        '<p class="awLead">Googleのページでキーを作ってコピーする</p>' +
        '<p class="hint">こんな画面が順に出るよ。赤い枠のところを押してね（横にめくれる）</p>' +
        // 実際の画面（スマホ）に赤い枠を付けたもの。画面が変わってても分かるように、下に文字でも書く
        '<div class="awShots">' + AW_SHOTS.map(([img, cap, no]) =>
          `<figure><img src="guide/${img}" alt=""><figcaption><b>${no}</b> ${cap}</figcaption></figure>`).join('') + '</div>' +
        `<a class="button primary awMain" href="${P.keyUrl}" target="_blank" rel="noopener">Googleのページを開く</a>` +
        '<p class="hint">AI Studio は18歳以上が条件だよ。画面が違ったら「API キー」のページで、キーの横のコピーのボタンを探してね</p>' +
        `<p class="hint">${esc(P.note)}</p>` +
        '<div class="row split"><button type="button" data-aw="0">戻る</button><button type="button" class="primary" data-aw="2">コピーできた →</button></div>',

        dots(3) +
        '<p class="awLead">コピーしたキーを貼り付けて試す</p>' +
        '<div class="row"><input id="awKey" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="ここに貼り付け" aria-label="APIキー">' +
        '<button type="button" id="awPaste">📋 貼り付け</button></div>' +
        '<button type="button" class="primary awMain" id="awTest">つながるか試す</button>' +
        `<p class="awMsg" id="awMsg">${msg}</p>` +
        '<button type="button" data-aw="1">戻る</button>',

        '<p class="awDone">✅ 準備OK！</p>' +
        '<p class="hint">キーはこのスマホの中にだけ保存されて、書き出しにも入らないよ</p>' +
        '<button type="button" class="primary awMain" id="awGo">写真から追加へ</button>',
      ][step] +
      (step < 3 ? '<button type="button" class="awOther" id="awOther">OpenRouterやClaudeを使う人はこちら（設定を開く）</button>' : '');
    };

    const keep = key => {
      state.keys = { ...state.keys, gemini: key };
      if (state.provider !== 'gemini' && !state.keys[state.provider]) state.provider = 'gemini';
      save();
      step = 3;
      draw();
      navigator.vibrate?.(30);
    };

    w.addEventListener('click', async e => {
      const to = e.target.closest('[data-aw]');
      if (to) { step = +to.dataset.aw; return draw(); }

      if (e.target.closest('#awPaste')) {
        try {
          $('#awKey').value = (await navigator.clipboard.readText()).trim();
        } catch {
          $('#awKey').focus();
          toast('入力欄を長押しして「ペースト」してね');
        }
        return;
      }

      if (e.target.closest('#awTest')) {
        const key = $('#awKey').value.replace(/\s/g, '');
        const msg = $('#awMsg');
        if (!key) return msg.textContent = 'まだ何も入ってないよ';
        const btn = e.target.closest('#awTest');
        btn.disabled = true;
        msg.textContent = '確かめてる…';
        try {
          const r = await fetch(TEST_URL, { headers: { Authorization: `Bearer ${key}` } });
          if (r.ok) return keep(key);
          if (r.status === 429) { toast('今は使いすぎ制限中。キーは合ってそうだから保存したよ'); return keep(key); }
          msg.textContent = [400, 401, 403].includes(r.status)
            ? 'キーが違うみたい。最後までコピーできてるか見てみて'
            : `うまく確かめられなかった（エラー${r.status}）。少し待ってもう一度試してね`;
        } catch {
          msg.textContent = '通信できなかった。ネットにつながってるか見てみて';
        }
        btn.disabled = false;
        return;
      }

      if (e.target.closest('#awGo')) return openPhoto('pick');

      if (e.target.closest('#awOther')) {
        photoDlg.close();
        openSettings();
        $('#aiBox').open = true;
      }
    });

    // 準備画面を開くたびに最初から（もう準備できてたら完了画面）
    const _op = openPhoto;
    openPhoto = function (view = 'pick') {
      if (view === 'guide') { step = hasKey() ? 3 : 0; draw(); }
      return _op.call(this, view);
    };
    draw();
  }
}

FEATURES.push({ id: 'photoMemo', name: '画像から予定を読み取る', where: '＋ → 「📷 写真から追加」 → 予定が書いてある画像／カレンダーの上の「📷 画像から予定を追加」 → 予定が書いてある画像', desc: '手帳・手書きのメモ・プリント・LINEやメールのスクショなどから、予定を読み取ってカレンダーに追加する。「明日」「来週の金曜」も日付に直すよ', kw: '予定 手書き 手帳 メモ 紙 プリント 板書 写真 画像 スクショ スクリーンショット LINE ライン メール トーク 読み取り カレンダー', go: () => openPhoto('pick') });

/* ===== Web版では「通知とウィジェット」の欄ごと隠す ===== */
document.documentElement.classList.toggle('isWeb', !isApp);

/* ===== プライバシーポリシー ===== */
const PRIVACY_URL = APP_URL + 'privacy.html';
$('#privacyBtn')?.addEventListener('click', () => window.open(PRIVACY_URL, '_blank'));
FEATURES.push({ id: 'privacy', name: 'プライバシーポリシー', where: '下の「その他」 → 一番下の「🔒 プライバシーポリシー」', desc: 'データをどこに保存して、何を外に送るかの説明', kw: 'プライバシー ポリシー 個人情報 データ 規約', go: () => window.open(PRIVACY_URL, '_blank') });

/* ===== 投稿の言葉フィルター ===== */
const NG_WORDS = ['しね', 'ころす', 'きえろ', 'うざい', 'きもい'];
// ↑ ここに増やしていく。ひらがなで書けばOK
const ngNorm = s => String(s || '')
  .normalize('NFKC')
  .toLowerCase()
  .replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60))
  .replace(/[\s　・.,、。!！?？ー〜_*-]/g, '');
window.ngCheck = text => {
  const t = ngNorm(text);
  return NG_WORDS.some(w => t.includes(ngNorm(w)));
};

/* ===== スクショ用：予定を一時的にしまう（公開前に消す） ===== */
{
  const KEY = 'demoStashEvents';
  const reload = () => setTimeout(() => location.reload(), 300);
  const stash = () => {
    if (localStorage.getItem(KEY)) return alert('もうしまってあるよ。先に戻してね');
    const mine = state.events.filter(e => !e.gid);
    if (!confirm(`予定${mine.length}件を一時的にしまう？（グループの予定はそのまま）`)) return;
    try { localStorage.setItem(KEY, JSON.stringify(mine)); }
    catch (err) { return alert('しまえなかった。容量がいっぱいかも'); }
    state.events = state.events.filter(e => e.gid);
    save(); reload();
  };
  const back = () => {
    const s = localStorage.getItem(KEY);
    if (!s) return alert('しまってある予定はないよ');
    const demo = state.events.filter(e => !e.gid).length;
    if (!confirm(`しまった予定を戻す？いまのデモの予定${demo}件は消えるよ`)) return;
    state.events = [...JSON.parse(s), ...state.events.filter(e => e.gid)];
    save(); localStorage.removeItem(KEY); reload();
  };
  FEATURES.push(
    { id: 'demoStash', name: '【開発用】予定をしまう', where: '開発用', desc: 'スクショ用に自分の予定を一時的にしまう', kw: 'デモ しまう 退避', go: stash },
    { id: 'demoBack', name: '【開発用】予定を戻す', where: '開発用', desc: 'しまった予定を元に戻す', kw: 'デモ 戻す 退避', go: back }
  );
}

/* ===== カレンダー：日付の下のフォームは「＋」を押したときだけ出す ===== */
{
  const bar = $('#dayAddBar');
  const more = $('#evMore');
  bar.after($('#dayTodo'));
  $('.evPre')?.append($('#evChipsHint'));
  more.querySelector('summary').after($('#evShareRow'), $('#evLockRow'));

  let open = '';            // '' | 'todo' | 'task' | 'ev'
  let seen = calSel, wasEd = '', wasMulti = false;
  const sync = () => {
    const ed = ctEdit ? 'task' : evEditId ? 'ev' : '';
    if (ed || calMulti) open = ed || 'ev';
    else if (wasEd || wasMulti || calSel !== seen) open = ''; // 変更・まとめて追加が終わったら、日付を変えたらたたむ
    wasEd = ed; wasMulti = calMulti; seen = calSel;
    $('#dayTodo').hidden = open !== 'todo';
    $('#taskBox').hidden = open !== 'task' || calMulti;
    $('#evBox').hidden = open !== 'ev';
    // 編集中は「＋」を押した状態に見せず、フォームを枠で囲む
    $('#taskBox').classList.toggle('editing', ed === 'task');
    $('#evBox').classList.toggle('editing', ed === 'ev');
    $('.evPre').hidden = ed === 'ev';
    $('#evDateRow').hidden = ed !== 'ev';
    for (const b of bar.querySelectorAll('[data-dayadd]')) {
      b.setAttribute('aria-expanded', String(b.dataset.dayadd === open && !ed));
      b.hidden = calMulti && b.dataset.dayadd !== 'ev';
    }
  };
  const show = (k, focus) => {
    open = k;
    sync();
    if (!k) return;
    $({ todo: '#dayTodo', task: '#taskBox', ev: '#evBox' }[k]).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    if (focus && k !== 'ev') $(k === 'todo' ? '#dayTodoIn' : '#ctTitle').focus({ preventScroll: true });
  };

  for (const name of ['renderDay', 'renderTaskForm', 'renderPicks']) {
    const f = window[name];
    window[name] = function () { const r = f.apply(this, arguments); sync(); return r; };
  }
  const oc = openCal;
  openCal = function () { open = ''; return oc.apply(this, arguments); };
  const se = startEvEdit;
  startEvEdit = function () {
    se.apply(this, arguments);
    if ($('#evShare')?.value) more.open = true; // メモは「くわしく」の外にあるので、共有のときだけ開く
  };

  bar.addEventListener('click', e => {
    const k = e.target.closest('[data-dayadd]')?.dataset.dayadd;
    if (!k) return;
    const again = open === k && !ctEdit && !evEditId;
    if (ctEdit) endTaskEdit();
    if (evEditId) endEvEdit();
    show(again ? '' : k, true);
  });
  // ＋メニューやホームから来たときも、そのフォームを開いておく
  $('#fabMenu').addEventListener('click', e => {
    const k = { task: 'task', other: 'ev', job: 'ev' }[e.target.closest('[data-fab]')?.dataset.fab];
    if (k) show(k);
  });
  $('#nowCard').addEventListener('click', e => {
    if (e.target.closest('[data-addev]')) show('ev');
  });
  sync();
}

/* ===== ＋ボタンは「今日」だけに出す ===== */
// カレンダーは「＋ ToDo／課題／予定」、時間割はマスのタップと読み込みボタンがあるので
{
  const st0 = showTab;
  const sync = () => { $('#fab').hidden = curTab !== 'today'; closeFab(); };
  showTab = function () { const r = st0.apply(this, arguments); sync(); return r; };
  sync();
}

/* ===== 授業の詳細：開き終わった時点を「変更なし」にする ===== */
// 開いたあとに足される欄（ミニノートなど）で、何もしてないのに「保存する？」と聞かないように
{
  const oc0 = openCourse;
  openCourse = function () {
    const r = oc0.apply(this, arguments);
    const c = cur();
    if (c && $('#courseDlg').open) courseBackup = courseSnap(c);
    return r;
  };
}

/* ===== はじめての人に、使う機能を聞く ===== */
// 答えで機能をオン/オフ。あとから「設定 → 機能」で変えられる（前から使ってる人には出さない）
{
  const QS = [
    ['grid', '📚', '大学の時間割を使う？', '使う', '使わない'],
    ['job', '💼', 'バイトしてる？', 'してる', 'してない'],
    ['share', '👥', '友達や家族と予定を共有する？', 'する', 'しない'],
    ['log', '📝', '日記やToDoで毎日の記録もする？', 'する', 'しない'],
  ];
  const dlg = document.createElement('dialog');
  dlg.id = 'obDlg';
  dlg.innerHTML = '<div class="dlg"><h2>はじめに少しだけ教えてね</h2>' +
    QS.map(([k, e, q, y, n]) =>
      `<div class="obQ"><p>${e} ${q}</p><div class="obA">` +
      `<label><input type="radio" name="ob-${k}" value="1" checked><span>${y}</span></label>` +
      `<label><input type="radio" name="ob-${k}" value="0"><span>${n}</span></label></div></div>`).join('') +
    '<p class="hint">あとから「設定 → 機能」でいつでも変えられるよ</p>' +
    '<button type="button" class="primary" id="obGo">はじめる</button></div>';
  document.body.append(dlg);

  const yes = k => dlg.querySelector(`input[name="ob-${k}"]:checked`)?.value === '1';
  const done = answered => {
    if (answered) {
      const f = state.features;
      state.useGrid = yes('grid');
      f.job = yes('job');
      f.group = f.share = yes('share');
      f.diary = f.todo = f.memo = f.habit = yes('log');
    }
    state.onboarded = true;
    save(); renderAll();
    if (dlg.open) dlg.close();
    if (answered) toast('準備できたよ。使う機能はあとから「設定 → 機能」で変えられるよ');
  };
  $('#obGo').onclick = () => done(true);
  // Esc で閉じたら、全部オンのまま始める
  dlg.addEventListener('cancel', e => { e.preventDefault(); done(false); });

  if (!state.onboarded) setTimeout(() => { if (!state.onboarded && !dlg.open) dlg.showModal(); }, 300);
}

/* ===== 試験前モード：試験と授業をつなぐ・ノートと写真を見返す ===== */
// 予定の「授業」欄（種類が試験のときだけ）。null＝欄が出てない（今のつながりを触らない）、{}＝名前から自動、{ cid }＝選んだ授業か 'none'
function examCidOf(kind) {
  if (kind !== 'exam') return {};
  if ($('#evCourseRow').hidden) return null;
  const v = $('#evCourse').value;
  return v ? { cid: v } : {};
}
function syncEvCourse() {
  const row = $('#evCourseRow'), sel = $('#evCourse');
  const ed = evEditId ? findAnyEv(evEditId) : null;
  // 共有した予定はつながない（グループの人の授業とは関係ないので）
  const show = $('#evKind').value === 'exam' && featOn('exam') && state.useGrid && courses().length > 0 && !ed?.gid;
  row.hidden = !show;
  if (!show) return;
  const keep = ed && syncEvCourse.was !== ed.id ? (ed.cid || '') : sel.value;
  syncEvCourse.was = ed?.id || '';
  const auto = examCourse({ title: $('#evTitle').value });
  sel.innerHTML = `<option value="">自動（${auto ? esc(nm(auto)) : '名前から'}）</option>` +
    courses().map(c => `<option value="${c.id}">${esc(nm(c) || '名前なし')}${slotLabel(c)}</option>`).join('') +
    '<option value="none">つながない</option>';
  sel.value = [...sel.options].some(o => o.value === keep) ? keep : '';
}
{
  const se = startEvEdit;
  startEvEdit = function () { const r = se.apply(this, arguments); syncEvCourse(); return r; };
  const ee = endEvEdit;
  endEvEdit = function () { const r = ee.apply(this, arguments); $('#evCourse').value = ''; syncEvCourse.was = ''; syncEvCourse(); return r; };
  $('#evKind').addEventListener('change', syncEvCourse);
  $('#evTitle').addEventListener('input', syncEvCourse);
  syncEvCourse();

  // 見返す画面
  const dlg = document.createElement('dialog');
  dlg.id = 'exDlg';
  dlg.innerHTML = '<div class="dlg"><div class="dlgHead"><h2 id="exTitle"></h2>' +
    '<button type="button" class="x big" id="exX" aria-label="閉じる">×</button></div>' +
    '<div class="exTabs"><button type="button" data-exmode="notes">📒 ノート</button>' +
    '<button type="button" data-exmode="pics">🖼 写真</button></div>' +
    '<div id="exBody"></div></div>';
  document.body.append(dlg);
  let cur = null, mode = 'notes';
  const urls = new Map(); // 写真のキー → 表示用URL
  const url = async key => {
    if (!urls.has(key)) {
      const b = await window.mnGetPic?.(key).catch(() => null);
      urls.set(key, b ? URL.createObjectURL(b) : '');
    }
    return urls.get(key);
  };
  const pic = async key => { const u = await url(key); return u ? `<div class="mnPic"><img src="${u}" alt=""></div>` : ''; };
  const draw = async () => {
    const ns = (cur.notes || []).slice().sort((a, b) => b.date.localeCompare(a.date) || (a.cont || 1) - (b.cont || 1));
    for (const b of dlg.querySelectorAll('[data-exmode]')) b.classList.toggle('on', b.dataset.exmode === mode);
    let h = '';
    if (mode === 'notes') {
      for (const n of ns) h += `<div class="exNote"><div class="memo-date">${md(parseYmd(n.date))}${n.cont ? '（続き）' : ''}</div>` +
        (n.text ? `<div class="exText">${esc(n.text)}</div>` : '') +
        `<div class="mnPics">${(await Promise.all(n.pics.map(pic))).join('')}</div></div>`;
      h ||= '<p class="muted">この授業のミニノートはまだないよ</p>';
    } else {
      const keys = ns.flatMap(n => n.pics);
      h = keys.length ? `<div class="mnPics exGrid">${(await Promise.all(keys.map(pic))).join('')}</div>`
        : '<p class="muted">この授業の写真はまだないよ</p>';
    }
    $('#exBody').innerHTML = h;
  };
  window.openExamReview = (cid, m = 'notes') => {
    cur = findCourse(cid);
    if (!cur) return;
    mode = m;
    $('#exTitle').textContent = `${nm(cur)}を見返す`;
    dlg.showModal();
    draw();
  };
  dlg.addEventListener('click', e => {
    const m = e.target.closest('[data-exmode]')?.dataset.exmode;
    if (m && m !== mode) { mode = m; draw(); }
  });
  $('#exX').onclick = () => dlg.close();
  dlg.addEventListener('close', () => { for (const u of urls.values()) if (u) URL.revokeObjectURL(u); urls.clear(); });

  // 今日画面の試験の行のボタン
  $('#nowCard').addEventListener('click', e => {
    const b = e.target.closest('[data-exnotes], [data-expics], [data-exlink]');
    if (!b) return;
    if (b.dataset.exnotes) return openExamReview(b.dataset.exnotes, 'notes');
    if (b.dataset.expics) return openExamReview(b.dataset.expics, 'pics');
    // 授業とつなぐ：カレンダーでその試験を開いて、「授業」欄へ
    const ev = state.events.find(x => x.id === b.dataset.exlink);
    if (!ev) return;
    showTab('cal');
    calSel = ev.date;
    const d = parseYmd(ev.date);
    calMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    renderCal(); renderDay();
    startEvEdit(ev.id);
    setTimeout(() => { $('#evCourseRow').scrollIntoView({ block: 'center', behavior: 'smooth' }); $('#evCourse').focus({ preventScroll: true }); }, 100);
  });
}
// 追加したら「授業」は自動に戻す（次の試験が前の授業につながらないように）
$('#evAdd').addEventListener('click', () => { $('#evCourse').value = ''; syncEvCourse(); });

/* ===== カレンダー：週のはじまりをカレンダーの下でも変えられる ===== */
// 設定の「使い方」と同じ state.weekStart。選んだらすぐ描き直して保存
{
  const sel = $('#calWeekStart');
  const sync = () => { sel.value = state.weekStart === 'sun' ? 'sun' : 'mon'; };
  sel.onchange = () => {
    state.weekStart = sel.value === 'sun' ? 'sun' : 'mon';
    save();
    renderCal();
  };
  const rc = renderCal;
  renderCal = function () { sync(); return rc.apply(this, arguments); };
  sync();
}

/* ===== カレンダー：どの予定を出すか（自分の予定・共有グループごと） ===== */
// 上の「📷 画像から予定を追加」の横に半分の幅で置く。グループに入ってないときは出さない
{
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'calShow';
  $('#evPhoto').after(btn);
  const dlg = document.createElement('dialog');
  dlg.id = 'calShowDlg';
  dlg.innerHTML = '<div class="dlg"><div class="dlgHead"><h2>カレンダーに出す予定</h2>' +
    '<button type="button" class="x big" data-close aria-label="閉じる">×</button></div>' +
    '<p class="hint" id="calShowHint"></p>' +
    '<div id="calShowList" class="calShowList"></div>' +
    '<button type="button" id="calShowGroup">👥 共有グループを作る・入る</button>' +
    '<button type="button" class="primary" data-close>OK</button></div>';
  document.body.append(dlg);

  const groups = () => Object.entries(grNames);
  const srcs = () => [['me', '自分の予定']].concat(groups().map(([id, name]) => [id, name || 'グループ']));
  function label() {
    const on = srcs().filter(([id]) => !state.calHide.includes(id));
    if (on.length === srcs().length) return 'すべて';
    if (!on.length) return 'なし';
    return on.length === 1 ? on[0][1] : `${on.length}つ`;
  }
  function sync() {
    // 共有グループの機能がオンなら、まだグループがなくても出す（ここから作れる）
    btn.hidden = !featOn('group');
    btn.textContent = groups().length ? `👥 表示：${label()}` : '👥 共有';
    btn.setAttribute('aria-label', groups().length ? `カレンダーに出す予定（今は${label()}）` : '共有グループ');
    // 半分の幅のときは短く
    $('#evPhoto').textContent = btn.hidden ? '📷 画像から予定を追加' : '📷 画像から追加';
    $('#evPhoto').setAttribute('aria-label', '画像から予定を追加');
    // 画像から（AIオフで隠れる）も、これも出ないときは段ごと隠す
    const bar = $('#calBar');
    bar.hidden = false;
    bar.hidden = ![...bar.children].some(b => getComputedStyle(b).display !== 'none');
  }
  function renderList() {
    const has = groups().length;
    $('#calShowHint').textContent = has
      ? 'チェックを外すと、カレンダーに出なくなるよ（今日の画面や通知はそのまま）。授業と課題はいつも出る'
      : '共有グループを作ると、家族や友達と予定を一緒に見られるよ。グループの予定を出すか、ここで選べるようになる';
    $('#calShowGroup').textContent = has ? '👥 共有グループの設定' : '👥 共有グループを作る・入る';
    dlg.querySelector('h2').textContent = has ? 'カレンダーに出す予定' : '共有グループ';
    $('#calShowList').hidden = !has;
    $('#calShowList').innerHTML = srcs().map(([id, name]) =>
      `<label class="inline"><input type="checkbox" data-calsrc="${esc(id)}"${state.calHide.includes(id) ? '' : ' checked'}> ` +
      `${id === 'me' ? '🙂 ' : '👥 '}${esc(name)}</label>`).join('');
  }
  btn.onclick = () => { renderList(); dlg.showModal(); };
  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.closest('[data-close]')) dlg.close();
    if (e.target.id === 'calShowGroup') { dlg.close(); $('#groupBtn').click(); }
  });
  dlg.addEventListener('change', e => {
    const id = e.target.dataset.calsrc;
    if (id == null) return;
    state.calHide = e.target.checked ? state.calHide.filter(x => x !== id) : [...new Set(state.calHide.concat(id))];
    save();
    renderCal();
    if (calSel) renderDay();
  });
  const rc = renderCal;
  renderCal = function () { sync(); return rc.apply(this, arguments); };
  sync();
}

/* ===== 予定の「いつもの場所」 ===== */
// 予定の名前を入れたら、その名前のいつもの場所をメモに入れておく（自分で書いたメモは変えない）
{
  const row = document.createElement('div');
  row.id = 'evPlaceRow';
  row.className = 'evPlaceRow';
  $('#evMemo').after(row);
  let auto = ''; // 自動で入れたメモ。書きかえられてなければ、名前を変えたときに入れ直す
  const sync = () => {
    const t = $('#evTitle').value.trim(), def = evPlaceDefault(t);
    row.hidden = !t;
    row.innerHTML = !t ? '' : def
      ? `${PIN} 「${esc(t)}」のいつもの場所：<b>${esc(def)}</b> <button type="button" id="evPlaceSet">変える</button>`
      : `<button type="button" id="evPlaceSet">${PIN} 「${esc(t)}」のいつもの場所を決める</button>`;
    syncMore();
    if (evEditId) return;
    const memo = $('#evMemo');
    if (!memo.value) auto = '';
    if (memo.value === auto) memo.value = auto = def ? memoWithPlace('', def) : '';
  };
  // 「くわしく」の中身（まとめて追加・共有・ロック）が全部隠れてるとき（変更中で共有グループなしなど）は、枠ごと隠す
  const more = $('#evMore');
  const syncMore = () => { more.hidden = ![...more.children].some(el => el.tagName !== 'SUMMARY' && !el.hidden); };
  const rd = renderDay;
  renderDay = function () { const r = rd.apply(this, arguments); syncMore(); return r; };
  $('#evTitle').addEventListener('input', sync);
  $('#evChips').addEventListener('click', () => setTimeout(sync, 0));
  $('#evAdd').addEventListener('click', () => setTimeout(sync, 0));
  for (const name of ['startEvEdit', 'endEvEdit']) {
    const f = window[name];
    window[name] = function () { const r = f.apply(this, arguments); sync(); return r; };
  }
  row.addEventListener('click', async e => {
    if (e.target.id !== 'evPlaceSet') return;
    const t = $('#evTitle').value.trim();
    const v = await askLine(`「${t}」のいつもの場所`, evPlaceDefault(t), { max: 60, placeholder: '例：駅前店（空にすると消す）' });
    if (v == null) return;
    setEvPlace(t, v);
    save();
    // 今のメモの場所の行も変える
    const memo = $('#evMemo'), was = memo.value === auto;
    if (v.trim()) memo.value = memoWithPlace(memo.value, v);
    if (was) auto = memo.value;
    sync();
    toast(v.trim() ? `「${t}」の場所は「${v.trim()}」で覚えたよ` : `「${t}」のいつもの場所を消したよ`);
  });
  sync();

  // シフト表：バイト先を変えたら、そのバイト先のいつもの場所に
  const job = $('#shJob'), place = $('#shPlace');
  const syncSh = () => { place.value = evPlaceDefault(job.value); };
  job.addEventListener('input', syncSh);
  job.addEventListener('change', syncSh);
  job.closest('.dlg')?.addEventListener('click', e => { if (e.target.closest('[data-shj]')) setTimeout(syncSh, 0); });
}

/* ===== この日の予定：タップで変更できるのを知らせる ===== */
// 行の右の ✎ は CSS。初めての人には、一度変更するまでヒントも出す
{
  const rd = renderDay;
  renderDay = function () {
    const r = rd.apply(this, arguments);
    const list = $('#dayList');
    if (!state.evTapSeen && list.querySelector('[data-evedit], [data-taskedit]'))
      list.insertAdjacentHTML('beforeend', '<li class="evTapHint">💡 予定や課題をタップすると、変更・削除できるよ</li>');
    return r;
  };
  for (const name of ['startEvEdit', 'startTaskEdit']) {
    const f = window[name];
    window[name] = function () {
      if (!state.evTapSeen) { state.evTapSeen = true; save(); }
      return f.apply(this, arguments);
    };
  }
}

/* ===== 写真の編集（切り取り・回転・くっきり・白黒） ===== */
// window.editPhoto(blob) → 編集した写真（JPEG）。やめたら・何も変えてなければ null
{
  const dlg = document.createElement('dialog');
  dlg.id = 'peDlg';
  dlg.innerHTML = '<div class="dlg">' +
    '<div class="dlgHead"><h2>写真を編集</h2>' +
    '<button type="button" class="x big" data-pe="cancel" aria-label="閉じる">×</button></div>' +
    '<p class="hint">残したいところを指でなぞると切り取れるよ</p>' +
    '<div class="peWrap"><canvas id="peCv"></canvas></div>' +
    '<div class="peTools">' +
    '<button type="button" data-pe="rot">↻ 回転</button>' +
    '<button type="button" data-pe="enh" aria-pressed="false">✨ くっきり</button>' +
    '<button type="button" data-pe="gray" aria-pressed="false">◐ 白黒</button>' +
    '<button type="button" data-pe="reset">元に戻す</button></div>' +
    '<div class="peBtns"><button type="button" data-pe="cancel">やめる</button>' +
    '<button type="button" class="primary" data-pe="ok">決定</button></div></div>';
  document.body.append(dlg);
  const cv = dlg.querySelector('#peCv');

  let img = null, rot = 0, crop = null, enh = false, gray = false, drag = null, done = null;
  let base = null; // 回したあとの写真（長い辺 2000px まで）

  function makeBase() {
    const s = Math.min(1, 2000 / Math.max(img.width, img.height));
    const w = Math.round(img.width * s), h = Math.round(img.height * s);
    base = document.createElement('canvas');
    [base.width, base.height] = rot % 2 ? [h, w] : [w, h];
    const ctx = base.getContext('2d');
    ctx.translate(base.width / 2, base.height / 2);
    ctx.rotate(rot * Math.PI / 2);
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
  }
  const rectOf = (a, b) => ({ x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y) });

  // 画面に出す（くっきり・白黒は CSS の filter で見せる。保存するときは画素を直接いじる）
  function draw() {
    const box = dlg.querySelector('.peWrap');
    const maxW = Math.max(200, box.clientWidth || 320), maxH = Math.max(200, Math.round(window.innerHeight * 0.55));
    const s = Math.min(maxW / base.width, maxH / base.height, 1);
    cv.width = Math.round(base.width * s);
    cv.height = Math.round(base.height * s);
    const ctx = cv.getContext('2d');
    ctx.drawImage(base, 0, 0, cv.width, cv.height);
    cv.style.filter = [enh ? 'contrast(1.35) brightness(1.08)' : '', gray ? 'grayscale(1)' : ''].join(' ').trim() || 'none';
    const r = drag ? rectOf(drag.a, drag.b) : crop;
    if (r) {
      const x = r.x * cv.width, y = r.y * cv.height, w = r.w * cv.width, h = r.h * cv.height;
      ctx.fillStyle = 'rgba(0,0,0,.5)'; // 切り取る外側を暗く
      ctx.fillRect(0, 0, cv.width, y);
      ctx.fillRect(0, y + h, cv.width, cv.height - y - h);
      ctx.fillRect(0, y, x, h);
      ctx.fillRect(x + w, y, cv.width - x - w, h);
      ctx.strokeStyle = '#ffd43b';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);
    }
    dlg.querySelector('[data-pe="enh"]').setAttribute('aria-pressed', String(enh));
    dlg.querySelector('[data-pe="gray"]').setAttribute('aria-pressed', String(gray));
  }
  const pt = e => {
    const r = cv.getBoundingClientRect();
    return { x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)) };
  };
  cv.addEventListener('pointerdown', e => { e.preventDefault(); cv.setPointerCapture(e.pointerId); const p = pt(e); drag = { a: p, b: p }; });
  cv.addEventListener('pointermove', e => { if (drag) { drag.b = pt(e); draw(); } });
  cv.addEventListener('pointerup', () => {
    if (!drag) return;
    const r = rectOf(drag.a, drag.b);
    drag = null;
    if (r.w > 0.04 && r.h > 0.04) crop = r; // 小さすぎるのはタップの誤爆
    draw();
  });
  cv.addEventListener('pointercancel', () => { drag = null; draw(); });

  // 保存する写真を作る（長い辺 1280px。くっきり・白黒は画素を直接）
  function output() {
    const r = crop || { x: 0, y: 0, w: 1, h: 1 };
    const sx = r.x * base.width, sy = r.y * base.height, sw = r.w * base.width, sh = r.h * base.height;
    const s = Math.min(1, 1280 / Math.max(sw, sh));
    const out = document.createElement('canvas');
    out.width = Math.max(1, Math.round(sw * s));
    out.height = Math.max(1, Math.round(sh * s));
    const ctx = out.getContext('2d');
    ctx.drawImage(base, sx, sy, sw, sh, 0, 0, out.width, out.height);
    if (enh || gray) {
      const d = ctx.getImageData(0, 0, out.width, out.height), p = d.data;
      for (let i = 0; i < p.length; i += 4) {
        let r = p[i], g = p[i + 1], b = p[i + 2];
        if (enh) { r = (r - 128) * 1.35 + 138; g = (g - 128) * 1.35 + 138; b = (b - 128) * 1.35 + 138; }
        if (gray) r = g = b = 0.299 * r + 0.587 * g + 0.114 * b;
        p[i] = r; p[i + 1] = g; p[i + 2] = b; // Uint8ClampedArray なので 0〜255 に収まる
      }
      ctx.putImageData(d, 0, 0);
    }
    return new Promise(ok => out.toBlob(ok, 'image/jpeg', 0.85));
  }

  function finish(b) {
    if (dlg.open) dlg.close();
    if (img?.src) URL.revokeObjectURL(img.src);
    img = base = null;
    const f = done;
    done = null;
    f?.(b);
  }
  dlg.addEventListener('click', async e => {
    const k = e.target.closest('[data-pe]')?.dataset.pe;
    if (!k) return;
    if (k === 'cancel') return finish(null);
    if (k === 'ok') return finish(rot || crop || enh || gray ? await output() : null);
    if (k === 'rot') { rot = (rot + 1) % 4; crop = null; makeBase(); }
    if (k === 'enh') enh = !enh;
    if (k === 'gray') gray = !gray;
    if (k === 'reset') { rot = 0; crop = null; enh = gray = false; makeBase(); }
    draw();
  });
  dlg.addEventListener('cancel', e => { e.preventDefault(); finish(null); });

  window.editPhoto = blob => new Promise((ok, ng) => {
    const im = new Image();
    im.onload = () => {
      img = im; rot = 0; crop = null; enh = gray = false; drag = null; done = ok;
      makeBase();
      dlg.showModal();
      requestAnimationFrame(draw); // 開いてから大きさを測る
    };
    im.onerror = () => ng(new Error('写真が読めなかった'));
    im.src = URL.createObjectURL(blob);
  });
}
