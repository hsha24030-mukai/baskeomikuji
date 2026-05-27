const bballShoes = [
    { brand: "アシックス (asics)", name: "GELBURST 28", desc: "日本の部活生の超定番モデル。抜群のグリップ力と、激しい動きでも足首がブレない高い安定性が魅力の一足です。" },
    { brand: "アシックス (asics)", name: "NOVA SURGE 3", desc: "クッション性を最重視したタフなバッシュ。ジャンプ後の着地衝撃を吸収し、足への負担を大きく軽減してくれます。" },
    { brand: "アシックス (asics)", name: "GLIDE NOVA FF 3", desc: "圧倒的な軽量性と抜群のフィット感を誇るローカットモデル。足首が動かしやすく、スピード自慢の選手に最適です。" },
    { brand: "ナイキ (NIKE)", name: "Air Zoom G.T. Cut 3", desc: "コートを低く捉える最高峰のスピードモデル。急停止や鋭い方向転換をスムーズに行いたいガード向けの一足です。" },
    { brand: "ナイキ (NIKE)", name: "Ja 3 (ジャ・モラント)", desc: "ジャ・モラントのシグネチャー第3弾。高いクッション性と蹴り出しの軽さを両立した、個性的なデザインの人気作。" },
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

function evaluateShoe(rating) {
    const msgDisplay = document.getElementById("message-display");
    msgDisplay.className = "message-display"; 
    
    if (rating === "気に入った" && currentShoe) {
        const isSaved = saveShoeToLocalStorage(currentShoe);
        
        if (isSaved) {
            msgDisplay.innerText = "✨ 保存しました！";
            msgDisplay.classList.add("message-success");
            msgDisplay.classList.remove("hidden");
        } else {
            msgDisplay.innerText = "⚠️ そのシューズはすでに保存されています。";
            msgDisplay.classList.add("message-warn");
            msgDisplay.classList.remove("hidden");
        }
    } else {
        msgDisplay.classList.add("hidden");
    }
}

function saveShoeToLocalStorage(shoe) {
    let savedShoes = JSON.parse(localStorage.getItem("favShoes")) || [];
    
    const isAlreadySaved = savedShoes.some(savedItem => 
        savedItem.brand === shoe.brand && savedItem.name === shoe.name
    );
    
    if (isAlreadySaved) {
        return false; 
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
    return true; 
}

// 保存されたバッシュを表示する（❌ボタンを追加）
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
        // 各アイテムに deleteShoe(${shoe.timestamp}) を呼び出すボタンを設置
        const itemHtml = `
            <div class="saved-item">
                <button class="delete-btn" onclick="deleteShoe(${shoe.timestamp})" title="削除">❌</button>
                <span class="item-date">${shoe.savedAt}</span>
                <div class="item-image">👟</div>
                <div class="item-brand">${shoe.brand}</div>
                <div class="item-name" title="${shoe.name}">${shoe.name}</div>
            </div>
        `;
        savedListContainer.innerHTML += itemHtml;
    });
}

// 【追加】マイページから特定のバッシュを削除する処理
function deleteShoe(timestamp) {
    let savedShoes = JSON.parse(localStorage.getItem("favShoes")) || [];
    
    // クリックされたtimestamp以外のデータだけ残す（＝該当データを削除する）
    savedShoes = savedShoes.filter(shoe => shoe.timestamp !== timestamp);
    
    // ローカルストレージを更新して再表示
    localStorage.setItem("favShoes", JSON.stringify(savedShoes));
    displaySavedShoes();
    
    // 大きな文字で「削除しました！」を表示
    const mypageMsg = document.getElementById("mypage-message-display");
    mypageMsg.className = "message-display message-warn"; // 赤系の枠にするためwarnを使用
    mypageMsg.innerText = "🗑️ 削除しました！";
    mypageMsg.classList.remove("hidden");
    
    // 3秒後に自動的に削除メッセージを消す
    setTimeout(() => {
        mypageMsg.classList.add("hidden");
    }, 3000);
}

function resetOmikuji() {
    currentShoe = null;
    const shoebox = document.getElementById("shoebox");
    shoebox.classList.remove("open");
    
    document.getElementById("message-display").classList.add("hidden");
    
    document.getElementById("box-container").classList.remove("hidden");
    document.getElementById("result-container").classList.add("hidden");
    document.getElementById("retry-btn").classList.add("hidden");
}