const canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
const meiImg = document.getElementById("mei");
const keiImg = document.getElementById("kei");



let ballRadius = 50;
let ballRadius1 = 50;
let x = canvas.width / 2;
let y = canvas.height / 2;
let x1 = canvas.width / 4;
let y1 = canvas.height/4;
let dx = 6;
let dy = -8;
let dx1 = -4;
let dy1 = -4;
const imgSize = ballRadius * 2;


//初期ライフ
let lives = 5;
const hearts = document.querySelectorAll(".heart");

//blocks
let blocks = [];
const blockWidth = 100;
const blockHeight = 30;
const padding = 20;
const startX = 50;
const startY = canvas.height - blockHeight -5;
const rows = 2;//行数の指定
const cols = 1;//一行当たりのブロック数

//setIntervalの管理
let gameInterval = null;

//gemeover
function gameOver() {
    clearInterval(gameInterval);//ゲームループ停止
    canvas.style.display = "none";
    document.getElementById("livesContainer").style.display = "none";
    document.getElementById("gameOverScreen").style.display = "block";
}
//gameclear
function gameClear() {
    clearInterval(gameInterval);
    canvas.style.display = "none";
    document.getElementById("livesContainer").style.display = "none";
    document.getElementById("gameClearScreen").style.display = "flex";
}


//ライフ表示の更新
function updateHearts() {
    for (let i = 0; i < hearts.length; i++) {
        hearts[i].style.visibility = i < lives ? "visible" : "hidden";
    }
}


//playervar
const barWidth = 150;
const barHeight = 20;
let barX = (canvas.width - barWidth) / 2;
const barY = canvas.height - (blockHeight * 2) -barHeight - 20;
let rightPressed = false;
let leftPressed = false;
const barSpeed = 5;


//keyBord
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}


for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        blocks.push({
            x: startX + col * (blockWidth + padding),
            y: startY - row * (blockHeight + padding),
            width: blockWidth,
            height: blockHeight,
            visible: true
        });
    }
}


function drawBlocks() {
    ctx.fillStyle = "blue";
    blocks.forEach(block => {
        if (block.visible) {
            ctx.fillRect(block.x, block.y, block.width, block.height);
        }
    });
}



function isCollidingWithBlock(ballX, ballY, radius, block) {
    if (!block.visible) return false;

    let closestX = Math.max(block.x, Math.min(ballX, block.x + block.width));
    let closestY = Math.max(block.y, Math.min(ballY, block.y + block.height));

    let dx = ballX - closestX;
    let dy = ballY - closestY;

    return (dx * dx + dy * dy) < (radius * radius);
    
}

function drawBar() {
    ctx.fillStyle = "black";
    ctx.fillRect(barX, barY, barWidth, barHeight);
}

function isCollidingWithBar(ballX, ballY, radius) {
    return (
        ballX + radius > barX &&
        ballX - radius < barX + barWidth &&
        ballY + radius > barY &&
        ballY - radius < barY + barHeight
    );
}


function drawBalls() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBlocks();

    ctx.drawImage(meiImg, x - ballRadius, y - ballRadius, imgSize, imgSize);
    x += dx;
    y += dy;
    if (x > canvas.width - ballRadius || x < ballRadius) {
        dx = -dx;
    }
    if (y > canvas.height - ballRadius || y < ballRadius) {
        dy = -dy;
    }

    ctx.drawImage(keiImg, x1 - ballRadius1, y1 - ballRadius1, imgSize, imgSize);
    x1 += dx1;
    y1 += dy1;
    if (x1 > canvas.width - ballRadius1 || x1 < ballRadius1) {
        dx1 = -dx1;
    }
    if (y1 > canvas.height - ballRadius1 || y1 < ballRadius1) {
        dy1 = -dy1;
    }

    const dxBetween = x - x1;
    const dyBetween = y - y1;
    const distance = Math.sqrt(dxBetween * dxBetween + dyBetween * dyBetween);
    if (distance <= ballRadius + ballRadius1) {
        dx = -dx;
        dy = -dy;
        dx1 = -dx1;
        dy1 = -dy1;
    }

    blocks.forEach(block => {
        if (isCollidingWithBlock(x, y, ballRadius, block) && block.visible) {
            block.visible = false;
            lives--;
            updateHearts();
            if (lives <= 0) {
                gameOver();
            }
        }
        if (isCollidingWithBlock(x1, y1, ballRadius1, block) && block.visible) {
            block.visible = false;
        }
    });

    // バーの移動
if (rightPressed && barX + barWidth < canvas.width) {
    barX += barSpeed;
}
if (leftPressed && barX > 0) {
    barX -= barSpeed;
}
if (isCollidingWithBar(x, y, ballRadius)) {
    dy = -Math.abs(dy);//上に跳ね返る
}
if (isCollidingWithBar(x1, y1, ballRadius1)) {
    dy1 = -Math.abs(dy1);//上に跳ね返る
}

// バーを描画
drawBar();
//gameclear if all blocks is gone
if (blocks.every(block => !block.visible)) {
    gameClear();
}
    
}
    document.getElementById("startButton").addEventListener("click", function () {
    document.getElementById("homeScreen").style.display = "none";
    document.getElementById("description").style.display = "none";
    canvas.style.display = "block";
    document.getElementById("livesContainer").style.display = "block";//ハートの表示
    gameInterval = setInterval(drawBalls, 10);
});

document.getElementById("restartButton").addEventListener("click", function () {
    lives = 5;
    updateHearts();

    // ブロックを復活
    blocks.forEach(block => block.visible = true);

    // プレイヤーやボールの位置初期化
    x = canvas.width / 2;
    y = canvas.height / 2;
    x1 = canvas.width / 4;
    y1 = canvas.height / 4;
    dx = 6;
    dy = -8;
    dx1 = -4;
    dy1 = -4;
    barX = (canvas.width - barWidth) / 2;

    // 画面切替
    document.getElementById("gameOverScreen").style.display = "none";
    canvas.style.display = "block";
    document.getElementById("livesContainer").style.display = "block";

    // 再開
    gameInterval = setInterval(drawBalls, 10);
});
    //クリア後の処理
    document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("restartButtonFromClear").addEventListener("click", function () {
    lives = 5;
    updateHearts();

    blocks.forEach(block => block.visible = true);

    x = canvas.width / 2;
    y = canvas.height / 2;
    x1 = canvas.width / 4;
    y1 = canvas.height / 4;
    dx = 6;
    dy = -8;
    dx1 = -4;
    dy1 = -4;
    barX = (canvas.width - barWidth) / 2;

    document.getElementById("gameClearScreen").style.display = "none";
    canvas.style.display = "block";
    document.getElementById("livesContainer").style.display = "block";

    gameInterval = setInterval(drawBalls, 10);
});
})

