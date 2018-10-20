const FRAME_RATE = 100;
const WIDTH = 10;
const HEIGHT = 20 + 4;

var tick_count = 0;

const FRAME_DATA = [];

for (let i = 0; i < HEIGHT; i++) {
    FRAME_DATA[i] = [];

    for (let j = 0; j < WIDTH; j++) {
        FRAME_DATA[i][j] = CELL_TYPE_EMPTY;
    }
}

// FRAME_DATAを描画
function draw() {
    const frame = $("#frame");
    frame.empty();

    const CELL_CLASS = [
        "empty",
        "exist",
        "falling",
    ];

    for (let i = 0; i < HEIGHT; i++) {
        const row = $('<div class="row">');

        for (let j = 0; j < WIDTH; j++) {
            let cell = $('<div class="cell">');

            cell.addClass(CELL_CLASS[FRAME_DATA[i][j]]);

            row.append(cell);
        }

        frame.append(row);
    }
}

// 落下中のブロックが存在するか
function blockFalled() {
    return FRAME_DATA.every(row => row.every(cell => cell != CELL_TYPE_FALLING));
}

// 新しいブロックを生成してFRAME_DATAに入れる
function enterNewBlock() {
    const blocks = [
        "I", "O", "Z", "S", "T", "L", "J"
    ];

    let blockType = blocks[Math.floor(Math.random() * blocks.length)];
    console.log("ブロック生成 " + blockType);

    let block = makeFallingBlock(this[blockType]);
    let blockHeight = block.length;
    let verticalOffset = 4 - blockHeight;
    let horizontalOffset = WIDTH / 2 - 1;

    for (let i = 0; i < blockHeight; i++) {
        let blockRow = block[i];

        for (let j = 0; j < blockRow.length; j++) {
            FRAME_DATA[verticalOffset + i][horizontalOffset + j] = block[i][j];
        }
    }
}

// 落下中のブロックが下に落ちられるか
function canFall() {
    // 縦にブロックを見ていく。
    // FALLINGの下にEXISTSがあったらブロックを落とせない。
    for (let i = 0; i < WIDTH; i++) {
        for (let j = 0; j < HEIGHT - 1; j++) {
            let cell = FRAME_DATA[j][i];
            let followingCell = FRAME_DATA[j + 1][i];

            if (cell === CELL_TYPE_FALLING && followingCell === CELL_TYPE_EXIST) {
                return false;
            }
        }
    }

    // ブロックが底についているかの判定
    for (let i = 0; i < WIDTH; i++) {
        if (FRAME_DATA[HEIGHT - 1][i] == CELL_TYPE_FALLING) {
            return false;
        }
    }

    return true;
}

// ゲームオーバー検出
function detectGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < WIDTH; j++) {
            if (FRAME_DATA[i][j] == CELL_TYPE_EXIST) {
                return true;
            }
        }
    }

    return false;
}

// 落下中のブロックを1マス下へ移動する
function fallBlock() {
    for (let i = 0; i < WIDTH; i++) {
        // 縦にブロックを見ていく。
        // FALLINGの下にEXISTSがあったらブロックを落とせない。
        for (let j = HEIGHT - 1; 0 < j; j--) {
            let cell = FRAME_DATA[j][i];
            let precedingCell = FRAME_DATA[j - 1][i];

            if (cell === CELL_TYPE_EMPTY && precedingCell === CELL_TYPE_FALLING) {
                FRAME_DATA[j][i] = CELL_TYPE_FALLING;
                FRAME_DATA[j - 1][i] = CELL_TYPE_EMPTY;
            }
        }
    }
}

// CELL_TYPE_FALLING のセルを CELL_TYPE_EXIST にする
function fixBlock() {
    for (let i = 0; i < HEIGHT; i++) {
        for (let j = 0; j < WIDTH; j++) {
            if (FRAME_DATA[i][j] === CELL_TYPE_FALLING) {
                FRAME_DATA[i][j] = CELL_TYPE_EXIST;
            }
        }
    }
}

function makeNextFameData() {
    // 1秒ごとにブロックを下に落とす

    if (tick_count % 10 != 0) {
        return;
    }

    if (blockFalled()) {
        // 新しいブロックを生成
        enterNewBlock();

    } else {
        if (canFall()) {
            fallBlock();
        } else {
            fixBlock();

            if (detectGameOver()) {
                clearInterval(interval);
                alert("ゲームオーバー");
            }
        }
    }
}

var interval;

function run() {
    interval = setInterval(() => {
        tick_count++;

        // handle_user_input();

        makeNextFameData();

        draw();
    }, 1000 / FRAME_RATE);
}

$(() => {
    run();
});

$(() => {
    $("#stop").on("click", () => {
        clearInterval(interval);
    });

    $("#resume").on("click", () => {
        run();
    });
});

