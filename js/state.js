// ゲームの状態と、ルールの判定・実行。
// ここで宣言した変数・関数は、後から読み込む js/ のファイルからも使う(読み込む順は index.html を参照)。
'use strict';

// ゲームの状態(この内容をそのまま保存する。形は js/save.js の newState() を参照)
let state;
// 選択中のアイテム(保存しない。再読み込みすると選択は外れる)
let selectedItem = null;
// メッセージ欄に表示する文章
let message = '';
// 開始画面を出しているか(保存しない。新しく始めるときだけ true にする)
let showStart = false;
// デバッグの「クリア画面を表示」で、クリアしていなくてもクリア画面を出す(保存しない)
let previewClear = false;
// トイレの明かりを消しているか(版40。保存しない。トイレを出ると点いた状態に戻る)
let lightOff = false;
// 区切りの画面を出している部屋のID(保存しない。部屋を移った直後だけ入る。出していなければ null)
let enteringRoom = null;

// 今いる部屋のデータ
function currentRoom() {
  return GAME_DATA.rooms[GAME_DATA.walls[state.wall].room];
}

// データに書いた値を取り出す。関数なら、今の状態を渡して呼んだ結果を返す
// (栞の配置で変わる本の文章や、机の錠の答えのように、状態によって変わる値のため)
function valueOf(v) {
  return typeof v === 'function' ? v(state) : v;
}

// ルールの条件(need / unless / item)に合っているか
function matches(rule, item) {
  if (rule.need && !state.flags[rule.need]) return false;
  if (rule.unless && state.flags[rule.unless]) return false;
  if (rule.item && rule.item !== item) return false;
  return true;
}

// ルールの結果を実行する
function applyRule(rule) {
  if (rule.remove) state.items = state.items.filter(name => name !== rule.remove);
  if (rule.gain && !state.items.includes(rule.gain)) state.items.push(rule.gain);
  if (rule.set) state.flags[rule.set] = true;
  if (rule.set === GAME_DATA.clear.flag) recordClear(); // クリアした時刻を記録する(版35。js/save.js)
  message = valueOf(rule.message);
  if (rule.goWall) state.wall = rule.goWall; // 扉をタップして別の部屋の面へ移る
  if (rule.enterRoom) enterRoom(rule.enterRoom);
}

// 別の部屋へ移る。持ち物から dropItems を消し、その部屋の最初の面へ移って、区切りの画面を出す
function enterRoom(roomId) {
  const room = GAME_DATA.rooms[roomId];
  state.items = state.items.filter(id => !(room.dropItems || []).includes(id));
  state.wall = room.startWall;
  selectedItem = null;
  message = ''; // 前の部屋の文章(「扉が開いた！」など)は区切りの画面で区切るので消す
  enteringRoom = roomId;
}
