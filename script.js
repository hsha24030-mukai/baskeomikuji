const bballShoes = [
    { brand: "アシックス (asics)", name: "GELBURST 28", desc: "日本の部活生の超定番モデル。抜群のグリップ力と、激しい動きでも足首がブレない高い安定性が魅力の一足です。" },
    { brand: "アシックス (asics)", name: "NOVA SURGE 3", desc: "クッション性を最重視したタフなバッシュ。ジャンプ後の着地衝撃を吸収し、足への負担を大きく軽減してくれます。" },
    { brand: "アシックス (asics)", name: "GLIDE NOVA FF 3", desc: "圧倒的な軽量性と抜群のフィット感を誇るローカットモデル。足首が動かしやすく、スピード自慢の選手に最適です。" },
    { brand: "ナイキ (NIKE)", name: "Air Zoom G.T. Cut 3", desc: "コートを低く捉える最高峰のスピードモデル。急停止や鋭い方向転換をスムーズに行いたいガード向けの一足です。" },
    { brand: "ナイキ (NIKE)", name: "Ja 3 (ジャ・モラント)", desc: "ジャ・モラント의シグネチャー第3弾。高いクッション性と蹴り出しの軽さを両立した、個性的なデザインの人気作。" },
    { brand: "ナイキ (NIKE)", name: "LeBron NXXT Gen", desc: "レブロン・ジェームズのプレイスタイルを支えるモデル。頑丈なホールド感と推進力があり、全ポジションに対応します。" },
    { brand: "ナイキ (NIKE)", name: "HYPERDUNK 2017 LOW", desc: "ナイキの歴史に残る名作万能モデル。柔らかく弾むクッションと最高のグリップ力を備え、誰にでもおすすめできます。" },
    { brand: "ジョーダン (JORDAN BRAND)", name: "Tatum 2", desc: "ジェイソン・テイタムのシグネチャーモデル。ブランド屈指の軽さで足の負担を減らす、おしゃれなデザインのバッシュ。" },
    { brand: "アディダス (adidas)", name: "Harden Volume 8", desc: "左右の激しい切り返しでも足がズレない、高いホールド感が特徴。ドライブやステップバックを多用する人に向けた一足。" },
    { brand: "アンダーアーマー (UA)", name: "Curry Flow 11", desc: "ステフィン・カリーのモデル。ゴム底を無くした画期的な構造で、圧倒的な軽さと滑らないグリップ力を実現しています。" }
];

let currentShoe = null;   
let lastPulledShoe = null; 

document.addEventListener("DOMContentLoaded", () => {
    displaySavedShoes();
    document.getElementById("shoebox").addEventListener("click", drawOmikuji);
});

function drawOmikuji() {
    const shoebox = document.getElementById("shoebox");
    if (shoebox.classList.contains("open")) return;
    
    shoebox.classList.add("open");
    
    setTimeout(() => {
        let randomIndex;
        let selectedShoe;
        
        do {
            randomIndex = Math.floor(Math.random() * bballShoes.length);
            selectedShoe = bballShoes[randomIndex];
        } while (lastPulledShoe && selectedShoe.name === lastPulledShoe.name);
        
        currentShoe = selectedShoe;
        lastPulledShoe = currentShoe;
        
        document.getElementById("result-brand").innerText = currentShoe.brand;
        document.getElementById("result-name").innerText = currentShoe.name;
        document.getElementById("result-desc").innerText = currentShoe.desc;
        
        document.getElementById("box-container").classList.add("hidden");
        document.getElementById("result-container").classList.remove("hidden");
        document.getElementById("retry-btn").classList.remove("hidden");
    }, 500);
}

// 評価ボタン押下時の処理（ポップアップアラートから画面内メッセージ表示に変更）
function evaluateShoe(rating) {
    const msgDisplay = document.getElementById("message-display");
    msgDisplay.className = "message-display"; // クラスの初期化
    
    if (rating === "気に入った" && currentShoe) {
        const isSaved = saveShoeToLocalStorage(currentShoe);
        
        if (isSaved) {
            // 新規に保存が成功した場合
            msgDisplay.innerText = "✨ 保存しました！";
            msgDisplay.classList.add("message-success");
            msgDisplay.classList.remove("hidden");
        } else {
            // すでに保存されていた場合（セーフガード）
            msgDisplay.innerText = "⚠️ そのシューズはすでに保存されています。";
            msgDisplay.classList.add("message-warn");
            msgDisplay.classList.remove("hidden");
        }
    } else {
        // 「まあまあ」「興味ない」を選んだ場合はシンプルに状態だけ提示してメッセージを隠す
        msgDisplay.classList.add("hidden");
        // 必要に応じて別の処理を記述できます
    }
}

function saveShoeToLocalStorage(shoe) {
    let savedShoes = JSON.parse(localStorage.getItem("favShoes")) || [];
    
    const isAlreadySaved = savedShoes.some(savedItem => 
        savedItem.brand === shoe.brand && savedItem.name === shoe.name
    );
    
    if (isAlreadySaved) {
        return false; // すでに保存されている
    }
    
    const now = new Date();
    const dateString = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const shoeToSave = {
        ...shoe,
        savedAt: dateString,
        timestamp: now.getTime()
    };
    
    savedShoes.push(shoeToSave);
    localStorage.setItem("favShoes", JSON.stringify(savedShoes));
    
    displaySavedShoes();
    return true; // 新規保存成功
}

function displaySavedShoes() {
    const savedListContainer = document.getElementById("saved-list");
    let savedShoes = JSON.parse(localStorage.getItem("favShoes")) || [];
    
    savedShoes.sort((a, b) => b.timestamp - a.timestamp);
    
    if (savedShoes.length === 0) {
        savedListContainer.innerHTML = '<p class="empty-message">まだお気に入りのバッシュはありません。</p>';
        return;
    }
    
    savedListContainer.innerHTML = "";
    
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

function resetOmikuji() {
    currentShoe = null;
    const shoebox = document.getElementById("shoebox");
    shoebox.classList.remove("open");
    
    // メッセージエリアも隠して初期状態に戻す
    document.getElementById("message-display").classList.add("hidden");
    
    document.getElementById("box-container").classList.remove("hidden");
    document.getElementById("result-container").classList.add("hidden");
    document.getElementById("retry-btn").classList.add("hidden");
}