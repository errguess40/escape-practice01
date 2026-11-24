// アイテム。見た目は svg(または emoji)で表す。
// text があるアイテム(メモ)は「使う」物ではないので選択状態にならず、
// タップするとメッセージ欄に内容を表示する。
// ※ アイテムのID(driver など)は保存データに入るので、変えるときは js/save.js の migrate() で変換する
// 鍵の表示名は、使う場所(「扉の鍵」など)ではなく見た目で付ける。使う場所はプレイヤーが推理する
const ITEMS = {
  // ---------- 1部屋目 ----------
  driver: { name: 'ドライバー', svg: DRIVER_SVG },
  memoColor: { name: 'メモ1', svg: MEMO_COLOR_SVG, text: 'メモには、丸っこい字で「赤 → 青 → 黄」と書いてある。' },
  memoTime: { name: 'メモ2', svg: MEMO_TIME_SVG, text: 'メモには、メモ1と同じ丸っこい字で「絵の裏を見よ」と書いてある。' },
  closetKey: { name: '小さな鍵', svg: keySvg('#b8c0c8') },
  flashlight: { name: '懐中電灯', svg: FLASHLIGHT_ITEM_SVG },
  doorKey: { name: '金色の鍵', svg: keySvg('#d9a520') },

  // ---------- 台所(版20) ----------
  iceKey: { name: '鍵入りの氷', svg: ICE_KEY_SVG },
  oldKey: { name: '古い鍵', svg: keySvg('#a88a3e') }, // 真鍮色(くすんだ黄土色)
  tapHandle: { name: '蛇口のハンドル', svg: TAP_HANDLE_SVG }, // 版28
  coin: { name: 'コイン', svg: COIN_SVG }, // 版40。点検口のねじを回す
  padlockKey: { name: '南京錠の鍵', svg: keySvg('#7d868e') }, // 版28。濃い鋼色(小さな鍵の銀色と見分けるため)
  bellKey: { name: '鈴の付いた鍵', svg: keySvg('#b8c0c8', BELL_SVG_PART) },
};
