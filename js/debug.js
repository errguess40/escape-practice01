// デバッグ機能。URL に ?debug=1 を付けると有効になる。
// アーティファクトでは ? 以降を渡せないため、#debug でも有効にする
'use strict';

const debugMode = new URLSearchParams(location.search).get('debug') === '1' || location.hash === '#debug';

// 動作確認用の「1部屋目から」「2部屋目から」ボタン。
// アーティファクト版を作るときだけ、build で window.QUICK_START = true を書き込んで表示する
// (分割したファイルのまま開いたときは表示しない)
function setupQuickStart() {
  if (!window.QUICK_START) return;
  document.getElementById('start-room1').hidden = false;
  document.getElementById('start-room2').hidden = false;
  document.getElementById('start-room1').addEventListener('click', () => startFromRoom('room1'));
  document.getElementById('start-room2').addEventListener('click', () => startFromRoom('kitchen'));
}

// 確認なしで、保存データを消して指定の部屋の最初から始める(開始画面・区切りの画面は出さない)。
// 2部屋目からのときは、1部屋目を出た扱い(フラグ leftRoom1)にする。持ち物は空
function startFromRoom(roomId) {
  clearSave();
  state = newState();
  if (roomId !== GAME_DATA.startRoom) {
    state.flags.leftRoom1 = true;
    state.wall = GAME_DATA.rooms[roomId].startWall;
  }
  // 時間はここから計る。2部屋目からはベストの対象外(版35)
  state.timer = newTimer(roomId === GAME_DATA.startRoom ? 'full' : 'room2', Date.now());
  selectedItem = null;
  message = '';
  showStart = false;
  previewClear = false;
  enteringRoom = null;
  save();
  render();
}

function setupDebug() {
  if (!debugMode) return;
  document.getElementById('debug-panel').hidden = false;
  const box = document.getElementById('debug-walls');

  // 面へ直接移動するボタンを、部屋ごとに1行にまとめて並べる。
  // 部屋をまたいで移動しても、区切りの画面は出さず、持ち物も消さない(確認用のため)
  for (const room of Object.values(GAME_DATA.rooms)) {
    const row = document.createElement('div');
    row.className = 'debug-row';
    const label = document.createElement('span');
    label.textContent = room.name + ':';
    row.appendChild(label);
    for (const [id, wall] of Object.entries(room.walls)) {
      const button = document.createElement('button');
      button.textContent = wall.name;
      button.addEventListener('click', () => goTo(id));
      row.appendChild(button);
    }
    box.appendChild(row);
  }

  // 開始画面・クリア画面を、最初から・最後まで遊ばずに確かめる(保存データは変えない)。
  // 開始画面の「ゲーム開始」は画面を閉じるだけ。クリア画面の「最初から」も閉じるだけ(main.js の onClearRestart)
  document.getElementById('debug-start-screen').addEventListener('click', () => {
    showStart = true;
    render();
  });
  document.getElementById('debug-clear-screen').addEventListener('click', () => {
    previewClear = true;
    render();
  });

  document.getElementById('debug-clear').addEventListener('click', () => {
    clearSave();
    location.reload();
  });
}
