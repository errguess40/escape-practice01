// 画面の描画。状態(state など)に合わせて画面全体を作り直す。
// 小さなゲームなので、変化があるたびに毎回作り直すのが一番単純。
'use strict';

// 前回描いた面と持ち物(版31)。面が変わったらフェード、持ち物が増えたら強調するために覚えておく。
// null は「まだ描いていない」。起動直後・続きから始めたときは動きを付けない
let lastWall = null;
let lastItems = null;

function render() {
  const wall = GAME_DATA.walls[state.wall];
  const room = currentRoom();

  document.getElementById('wall-name').textContent = wall.name;
  document.getElementById('go-left').hidden = !wall.left;
  document.getElementById('go-right').hidden = !wall.right;

  // 部屋の物。床の見た目は部屋ごとに変える(floorClass)
  const roomBox = document.getElementById('room');
  // トイレを出たら(扉で台所へ戻ったときなど)、明かりは点いた状態に戻す(版40)
  if (state.wall !== 't-toilet') lightOff = false;
  roomBox.className = 'room ' + room.floorClass + (lightOff ? ' room-dark' : '');
  // 面が変わったときだけフェードさせる(style.css の .room-fade)。
  // offsetWidth を読むと、ブラウザがいったん描き直すので、続けて移動してもアニメーションが最初から再生される
  if (lastWall !== null && lastWall !== state.wall) {
    void roomBox.offsetWidth;
    roomBox.classList.add('room-fade');
  }
  lastWall = state.wall;
  roomBox.innerHTML = '';
  for (const id of wall.objects) {
    const obj = GAME_DATA.objects[id];
    // 物に need / unless があれば、条件に合うときだけ表示する(開いたクローゼットなど)
    if (!matches(obj, null)) continue;
    const button = document.createElement('button');
    button.className = 'object ' + (obj.className || '') + (lightOff && obj.inDark ? ' in-dark' : '');
    button.setAttribute('aria-label', obj.label);
    button.title = obj.label;
    button.style.left = obj.x + '%';
    button.style.top = obj.y + '%';
    if (obj.emoji) {
      button.textContent = obj.emoji;
      button.style.setProperty('--size', obj.size);
    } else {
      button.style.width = obj.w + '%';
      button.style.height = obj.h + '%';
      if (obj.text) button.textContent = obj.text;
      if (obj.svg) button.innerHTML = valueOf(obj.svg); // 状態によって変わる絵は関数で書いてある
    }
    button.addEventListener('click', () => onObjectClick(id));
    roomBox.appendChild(button);
  }

  // 持ち物
  const items = document.getElementById('items');
  items.innerHTML = '';
  if (state.items.length === 0) {
    items.textContent = '(なし)';
  }
  for (const id of state.items) {
    const item = GAME_DATA.items[id];
    const button = document.createElement('button');
    button.className = 'item' + (selectedItem === id ? ' selected' : '');
    // 前回の描画になかったアイテム = 今手に入れたアイテムは、枠を光らせる(style.css の .item-new)
    if (lastItems !== null && !lastItems.includes(id)) button.classList.add('item-new');
    // 絵は svg を優先し、なければ emoji を使う
    button.innerHTML = `<span class="item-icon">${item.svg || item.emoji}</span><span>${item.name}</span>`;
    button.addEventListener('click', () => onItemClick(id));
    items.appendChild(button);
  }

  lastItems = [...state.items];

  document.getElementById('message').textContent = message;

  // 開始画面(新しく始めるときだけ)
  document.getElementById('start-screen').hidden = !showStart;
  document.getElementById('start-title').textContent = GAME_DATA.title;
  document.getElementById('start-message').textContent = GAME_DATA.intro;

  // 区切りの画面(部屋を移った直後だけ)
  document.getElementById('room-screen').hidden = !enteringRoom;
  if (enteringRoom) {
    const enter = GAME_DATA.rooms[enteringRoom].enter;
    document.getElementById('room-title').textContent = enter.title;
    document.getElementById('room-message').textContent = enter.message;
  }

  // クリアしていればクリア画面を重ねて出す(再読み込みしてもクリア画面のまま)
  const clear = GAME_DATA.clear;
  document.getElementById('clear-screen').hidden = !(state.flags[clear.flag] || previewClear);
  document.getElementById('clear-title').textContent = clear.title;
  document.getElementById('clear-message').textContent = clear.message;
  document.getElementById('clear-letter').textContent = clear.letter;
  document.getElementById('clear-time').textContent = clearTimeText();
}

// 開始画面・クリア画面の絵を入れる(絵は変わらないので、起動時に1回だけ)
function renderSceneArt() {
  document.getElementById('start-art').innerHTML = START_SCENE_SVG;
  document.getElementById('clear-art').innerHTML = CLEAR_SCENE_SVG;
}

// ミリ秒を「18分42秒」「1時間05分12秒」の形にする(版35)
function formatTime(ms) {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = n => String(n).padStart(2, '0');
  return h > 0 ? `${h}時間${pad(m)}分${pad(s)}秒` : `${m}分${pad(s)}秒`;
}

// クリア画面に出す時間の文章(版35)。例:「クリアまでの時間 18分42秒 ／ ベスト 15分10秒」
function clearTimeText() {
  const t = state.timer;
  if (!state.flags[GAME_DATA.clear.flag] || !t || !t.startedAt || !t.clearedAt) {
    return 'クリアまでの時間 記録なし'; // デバッグのプレビュー、時間を計れないデータ
  }
  const note = { room2: '(2部屋目から)', resumed: '(途中から)' }[t.mode] || '';
  let text = `クリアまでの時間 ${formatTime(t.clearedAt - t.startedAt)}${note}`;
  if (t.newRecord) {
    text += ' ／ 新記録！';
  } else {
    const best = loadBest();
    if (best !== null) text += ` ／ ベスト ${formatTime(best)}`;
  }
  return text;
}
