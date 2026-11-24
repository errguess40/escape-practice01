// 錠の入力画面(数字の錠と、版20で足した色の錠)。
// 物の lock に書いた内容で入力画面を作り、正解したら lock の結果(message / gain / set)を実行する。
// lock.type が 'color' なら色の入力画面、それ以外は数字の入力画面を開く。
'use strict';

let lockObjectId = null; // 入力画面を開いている物
let lockInput = '';      // 入力中の数字

function currentLock() {
  return GAME_DATA.objects[lockObjectId].lock;
}

// 何桁入力するか(pattern の # の数)
function lockLength(lock) {
  return lock.pattern.split('#').length - 1;
}

function openLock(objectId) {
  lockObjectId = objectId;
  if (currentLock().type === 'color') {
    openColorLock();
    return;
  }
  lockInput = '';
  renderLock('');
  document.getElementById('lock-dialog').showModal();
}

function closeLock() {
  document.getElementById('lock-dialog').close();
}

// 入力画面の表示を更新する。note は入力欄の下に出す一言(「開かない。」など)
function renderLock(note) {
  const lock = currentLock();
  // pattern の # を、入力済みの数字か「_」に置き換えて表示する 例: '7_ _'
  let i = 0;
  const display = lock.pattern.replace(/#/g, () => lockInput[i++] || '_');
  document.getElementById('lock-prompt').textContent = lock.prompt;
  document.getElementById('lock-display').textContent = display;
  document.getElementById('lock-note').textContent = note;
}

// テンキーの数字ボタン
function onLockDigit(digit) {
  if (lockInput.length < lockLength(currentLock())) lockInput += digit;
  renderLock('');
}

function onLockClear() {
  lockInput = '';
  renderLock('');
}

function onLockSubmit() {
  const lock = currentLock();
  const length = lockLength(lock);
  if (lockInput.length < length) {
    renderLock(`${length}桁の数字を入力してください。`);
    return;
  }
  if (lockInput === valueOf(lock.answer)) {
    solveLock('lock-dialog');
  } else {
    lockInput = '';
    renderLock(lock.wrongNote || '開かない。'); // 不正解の一言は錠ごとに変えられる(書かなければ「開かない。」)
  }
}

// 正解したときの処理(数字の錠・色の錠で共通)
function solveLock(dialogId) {
  document.getElementById(dialogId).close();
  applyRule(currentLock()); // 正解したときの結果は【ルール】と同じ書き方
  save();
  render();
}

// ---------- 色の錠 ----------
// 数字の錠と仕組みはほぼ同じだが、入力が「色の ID の配列」になる。
// 1つの関数にまとめると分岐が増えて読みにくくなるため、数字の錠とは別に書く

let colorInput = []; // 押した色の ID の配列 例: ['blue', 'white']

function openColorLock() {
  colorInput = [];
  renderColorLock('');
  document.getElementById('color-lock-dialog').showModal();
}

// 色の入力画面の表示を更新する。マスを length 個並べ、押した色で塗る
function renderColorLock(note) {
  const lock = currentLock();
  const display = document.getElementById('color-lock-display');
  display.innerHTML = '';
  for (let i = 0; i < lock.length; i++) {
    const slot = document.createElement('span');
    const color = LOCK_COLORS.find(c => c.id === colorInput[i]);
    slot.className = 'color-slot' + (color ? ' filled' : '');
    if (color) {
      slot.style.background = color.color;
      slot.title = color.name;
    }
    display.appendChild(slot);
  }
  document.getElementById('color-lock-prompt').textContent = lock.prompt;
  document.getElementById('color-lock-note').textContent = note;
}

function onColorButton(colorId) {
  if (colorInput.length < currentLock().length) colorInput.push(colorId);
  renderColorLock('');
}

function onColorLockSubmit() {
  const lock = currentLock();
  if (colorInput.length < lock.length) {
    renderColorLock(`${lock.length}つの色を入力してください。`);
    return;
  }
  if (colorInput.join(',') === valueOf(lock.answer).join(',')) {
    solveLock('color-lock-dialog');
  } else {
    colorInput = [];
    renderColorLock(lock.wrongNote || '開かない。');
  }
}

// 入力画面のボタンに処理をつなぐ(起動時に1回だけ呼ぶ)
function setupLocks() {
  // 数字ボタンは data-digit 属性に数字を持たせてある
  for (const button of document.querySelectorAll('[data-digit]')) {
    button.addEventListener('click', () => onLockDigit(button.dataset.digit));
  }
  document.getElementById('lock-clear').addEventListener('click', onLockClear);
  document.getElementById('lock-submit').addEventListener('click', onLockSubmit);
  document.getElementById('lock-close').addEventListener('click', closeLock);

  // 色の錠: 色のボタンを LOCK_COLORS から作る
  const pad = document.getElementById('color-pad');
  for (const c of LOCK_COLORS) {
    const button = document.createElement('button');
    button.textContent = c.name;
    button.style.background = c.color;
    button.style.color = c.text;
    button.addEventListener('click', () => onColorButton(c.id));
    pad.appendChild(button);
  }
  document.getElementById('color-lock-clear').addEventListener('click', () => {
    colorInput = [];
    renderColorLock('');
  });
  document.getElementById('color-lock-submit').addEventListener('click', onColorLockSubmit);
  document.getElementById('color-lock-close').addEventListener('click', () => {
    document.getElementById('color-lock-dialog').close();
  });
}
