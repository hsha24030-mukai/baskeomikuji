// 定番のバッシュデータ（仕様書に基づき、まずは均等な確率の10足を設定）
const bballShoes = [
    { brand: "アシックス (asics)", name: "GELBURST 28", desc: "抜群の加速感と高いソール剛性を誇る、日本の部活生の超定番モデル。高い安定性が魅力。" },
    { brand: "アシックス (asics)", name: "NOVA SURGE 3", desc: "クッション性とリバウンド性に優れたモデル。ジャンプが多いプレイヤーやタフなプレイにおすすめ。" },
    { brand: "ナイキ (NIKE)", name: "Air Zoom G.T. Cut 3", desc: "一瞬の俊敏性を引き出すローカットモデル。床を捉える高いグリップ力と反発性が特徴。" },
    { brand: "ナイキ (NIKE)", name: "Ja 3 (ジャ・モラント)", desc: "ジャ・モラントのプレイスタイルを体現したスピード＆クイックネス特化型のバッシュ。" },
    { brand: "ナイキ (NIKE)", name: "LeBron NXXT Gen", desc: "キングことレブロンの多才なプレイを支える一足。高いクッション性と推進力を両立。" },
    { brand: "アディダス (adidas)", name: "Harden Volume 8", desc: "ジェームズ・ハーデンの特徴的なステップを支えるモデル。ホールド感と独特のデザインが人気。" },
    { brand: "アディダス (adidas)", name: "Dame 9", desc: "軽量かつ安定感のあるクッショニング。コート上での快適性とダッシュ力を高めます。" },
    { brand: "アンダーアーマー (UA)", name: "Curry Flow 11", desc: "ラバーを排除した革新的なソールで圧倒的な軽さとグリップ力を実現。シュートを狙うプレイヤーに。" },
    { brand: "プーマ (PUMA)", name: "All-Pro NITRO", desc: "高反発な窒素注入フォームを搭載。海外でも非常に評価が高い、軽量でバランスの取れた一足。" },
    { brand: "ミズノ (MIZUNO)", name: "WAVE FANG (バスケ仕様)", desc: "日本人の足型に馴染みやすい設計。優れた耐久性と高いフィット感で初心者も安心。" }
];

let currentShoe = null; // 現在引いたバッシュを保持

// ページ読み込み時に保存されたリストを表示
document.addEventListener("DOMContentLoaded", () => {
    displaySavedShoes();
    
    // 箱をクリックしたらおみくじを引くイベントを設定
    document.getElementById("shoebox").addEventListener("click", drawOmikuji);
});

// おみくじを引くメイン処理
function drawOmikuji() {
    const shoebox = document.getElementById("shoebox");
    
    // 既に開いていたら何もしない
    if (shoebox.classList.contains("open")) return;
    
    // 1. 箱が開くアニメーション開始
    shoebox.classList.add("open");
    
    // 2. アニメーションが少し進んだら（0.5秒後）結果をランダムに選んで表示
    setTimeout(() => {
        // 均等な確率でランダムに1つ選ぶ
        const randomIndex = Math.floor(Math.random() * bballShoes.length);
        currentShoe = bballShoes[randomIndex];
        
        // 画面にデータを反映
        document.getElementById("result-brand").innerText = currentShoe.brand;
        document.getElementById("result-name").innerText = currentShoe.name;
        document.getElementById("result-desc").innerText = currentShoe.desc;
        
        // 箱を隠して結果とリトライボタンを表示
        document.getElementById("box-container").classList.add("hidden");
        document.getElementById("result-container").classList.remove("hidden");
        document.getElementById("retry-btn").classList.remove("hidden");
    }, 500);
}

// 評価ボタンが押されたときの処理
function evaluateShoe(rating) {
    if (rating === "気に入った" && currentShoe) {
        saveShoeToLocalStorage(currentShoe);
    }
    
    // ボタンを目立たなくする、または次の行動を促すための簡易フィードバック
    alert(`「${rating}」として評価しました！`);
}

// ローカルストレージにバッシュを保存する
function saveShoeToLocalStorage(shoe) {
    let savedShoes = JSON.parse(localStorage.getItem("favShoes")) || [];
    
    // 保存用のデータ（引いた日付を追加）
    const now = new Date();
    const dateString = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const shoeToSave = {
        ...shoe,
        savedAt: dateString,
        timestamp: now.getTime() // ソート用
    };
    
    savedShoes.push(shoeToSave);
    localStorage.setItem("favShoes", JSON.stringify(savedShoes));
    
    // マイページの一覧を更新
    displaySavedShoes();
}

// 保存されたバッシュを日付順（新しい順）に表示する
function displaySavedShoes() {
    const savedListContainer = document.getElementById("saved-list");
    let savedShoes = JSON.parse(localStorage.getItem("favShoes")) || [];
    
    // 日付順（降順：新しいものが上）に並び替え
    savedShoes.sort((a, b) => b.timestamp - a.timestamp);
    
    if (savedShoes.length === 0) {
        savedListContainer.innerHTML = '<p class="empty-message">まだお気に入りのバッシュはありません。</p>';
        return;
    }
    
    savedListContainer.innerHTML = ""; // 初期化
    
    savedShoes.forEach(shoe => {
        const itemHtml = `
            <div class="saved-item">
                <span class="item-date">${shoe.savedAt}</span>
                <div class="item-image">👟</div>
                <div class="item-brand">${shoe.brand}</div>
                <div class="item-name" title="${shoe.name}">${shoe.name}</div>
            </div>
        `;
        savedListContainer.innerHTML += itemHtml;
    });
}

// もう一度引くための画面リセット
function resetOmikuji() {
    currentShoe = null;
    
    // 箱の状態を戻す
    const shoebox = document.getElementById("shoebox");
    shoebox.classList.remove("open");
    
    // 表示の切り替え
    document.getElementById("box-container").classList.remove("hidden");
    document.getElementById("result-container").classList.add("hidden");
    document.getElementById("retry-btn").classList.add("hidden");
}