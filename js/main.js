// 操作(タップしたときの処理)と起動。最後に読み込むファイル。
'use strict';

// ---------- 操作 ----------

// 部屋の物をタップしたとき
function onObjectClick(objectId) {
  const obj = GAME_DATA.objects[objectId];

  // 照明のスイッチ(版40): 明かりを消す・点ける。選んでいたアイテムは外す
  if (obj.toggleLight) {
    selectedItem = null;
    lightOff = !lightOff;
    message = lightOff ? 'スイッチだ。押すと、明かりが消えた。' : 'スイッチだ。押すと、明かりが点いた。';
    render();
    return;
  }
  // 明かりを消している間は、inDark の物(スイッチと壁の線)と usableInDark の物(扉)以外は調べられない
  if (lightOff && !obj.inDark && !obj.usableInDark) {
    selectedItem = null;
    message = '暗くて見えない。';
    render();
    return;
  }

  if (selectedItem) {
    // アイテムを選んでいる → 使う
    const item = selectedItem;
    selectedItem = null; // 使ったら選択を外す(部屋を移るときも外れるよう、ルールの実行より先に外す)
    const rule = (obj.use || []).find(r => matches(r, item));
    if (rule) {
      applyRule(rule);
    } else {
      message = '何も起きない。';
    }
  } else if (obj.lock && matches(obj.lock, null)) {
    // 何も選んでいない & まだ開いていない錠 → 入力画面を開く
    openLock(objectId);
    return;
  } else {
    // 何も選んでいない → 調べる
    const rule = (obj.examine || []).find(r => matches(r, null));
    if (rule) applyRule(rule);
  }
  save();
  render();
}

// 持ち物をタップしたとき
function onItemClick(itemId) {
  const item = GAME_DATA.items[itemId];

  // 文章(text)のあるアイテム(メモ)は「使う」物ではないので、選択状態にしない。
  // 内容をメッセージ欄に出すだけにし、ほかのアイテムを選んでいたら選択を外す
  if (item.text) {
    selectedItem = null;
    message = item.text;
    render();
    return;
  }

  // それ以外のアイテムは、選択する / もう一度タップで選択を外す
  selectedItem = (selectedItem === itemId) ? null : itemId;
  message = selectedItem ? `${item.name}を選んだ。` : '';
  render();
}

// 面を移動する
function goTo(wallId) {
  if (!wallId) return;
  state.wall = wallId;
  lightOff = false; // 面を移ったら明かりは点いた状態に戻す(版40)
  message = '';
  save();
  render();
}

// 「最初から」ボタン。確認画面を開き、「やり直す」が押されたら resetGame を呼ぶ
function onResetButton() {
  document.getElementById('confirm-dialog').showModal();
}

// 最初からやり直す
// (クリア画面の「最初から」は消える進み具合がないので、確認画面を出さずに直接呼ぶ)
function resetGame() {
  clearSave();
  state = newState();
  selectedItem = null;
  message = '';
  enteringRoom = null;
  previewClear = false;
  showStart = true; // 開始画面からやり直す
  render();
}

// クリア画面の「最初から」ボタン。
// デバッグの「クリア画面を表示」で出したときは、保存データを消さずにクリア画面を閉じるだけにする
function onClearRestart() {
  if (previewClear && !state.flags[GAME_DATA.clear.flag]) {
    previewClear = false;
    render();
    return;
  }
  resetGame();
}

// 開始画面の「ゲーム開始」ボタン
function onStartButton() {
  showStart = false;
  // ここから時間を計る(版35)。デバッグの「開始画面を表示」から押したときは、計っている途中なので変えない
  if (!state.timer.startedAt) {
    state.timer.startedAt = Date.now();
    save();
  }
  render();
}

// 区切りの画面の「進む」ボタン
function onEnterRoomButton() {
  enteringRoom = null;
  render();
}

// ---------- メニュー(版37) ----------

// メニューを開く・閉じる
function setMenuOpen(open) {
  document.getElementById('menu-list').hidden = !open;
  document.getElementById('menu-button').setAttribute('aria-expanded', String(open));
}

function isMenuOpen() {
  return !document.getElementById('menu-list').hidden;
}

// メニューボタンで開く・閉じる。項目を選ぶ・メニューの外を押す・Esc キーでも閉じる。
// メニューが開いている間に外を押したときは、閉じるだけにして、部屋の物を調べる・使うなどは起こさない(押し間違いを防ぐため)
function setupMenu() {
  const button = document.getElementById('menu-button');
  const list = document.getElementById('menu-list');
  button.addEventListener('click', () => setMenuOpen(!isMenuOpen()));
  // 項目を押したら閉じる(項目そのものの処理は、それぞれのボタンに付けた処理が行う)
  list.addEventListener('click', e => {
    if (e.target.closest('button')) setMenuOpen(false);
  });
  // 外を押したとき。「捕捉」(第3引数 true)で、部屋の物のボタンより先にこの処理を通し、クリックをそこで止める
  document.addEventListener('click', e => {
    if (!isMenuOpen() || list.contains(e.target) || button.contains(e.target)) return;
    e.stopPropagation();
    e.preventDefault();
    setMenuOpen(false);
  }, true);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isMenuOpen()) setMenuOpen(false);
  });
}

// ---------- 起動 ----------

function start() {
  const saved = load();
  if (saved) {
    state = saved;
    message = '続きから始めます。';
  } else {
    // 保存データがない = 新しく始める → 開始画面を出す
    state = newState();
    showStart = true;
  }

  document.getElementById('go-left').addEventListener('click', () => goTo(GAME_DATA.walls[state.wall].left));
  document.getElementById('go-right').addEventListener('click', () => goTo(GAME_DATA.walls[state.wall].right));
  document.getElementById('reset-button').addEventListener('click', onResetButton);
  document.getElementById('start-button').addEventListener('click', onStartButton);
  document.getElementById('room-button').addEventListener('click', onEnterRoomButton);
  document.getElementById('clear-restart').addEventListener('click', onClearRestart);
  document.getElementById('confirm-yes').addEventListener('click', () => {
    document.getElementById('confirm-dialog').close();
    resetGame();
  });
  document.getElementById('confirm-no').addEventListener('click', () => {
    document.getElementById('confirm-dialog').close();
  });

  renderSceneArt();
  setupMenu();
  setupLocks();
  setupDebug();
  setupQuickStart();
  render();
}

start();
