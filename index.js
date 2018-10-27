const FRAME_RATE = 50;
const BLOCK_FALLING_FREQUENCY = 25;
const WIDTH = 10;
const HEIGHT = 20 + 4;

var tick_count = 0;

const FRAME_DATA = [];

// FRAME_DATAの初期化
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

function getRotateCount(direction) {
    return {
        "down": 0,
        "right": 1,
        "up": 2,
        "left": 3,
    }[direction];
}

// 落下中ブロックを引数で指定した方向に動かせるか
function canMove(direction) {
    var frame_data = copy2dArray(FRAME_DATA);

    // 配列の走査方向を同じにするためframe_dataを回転させる
    const rotateCount = getRotateCount(direction);
    for (let i = 0; i < rotateCount; i++) {
        frame_data = rotate(frame_data);
    }

    // 縦にブロックを見ていく。
    // FALLINGの下にEXISTSがあったらブロックを落とせない。
    const width = frame_data[0].length;
    const height = frame_data.length;
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height - 1; j++) {
            let cell = frame_data[j][i];
            let followingCell = frame_data[j + 1][i];

            if (cell === CELL_TYPE_FALLING && followingCell === CELL_TYPE_EXIST) {
                return false;
            }
        }
    }

    // ブロックが底についているかの判定
    for (let i = 0; i < width; i++) {
        if (frame_data[height - 1][i] == CELL_TYPE_FALLING) {
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

// 落下中のブロックを引数で指定した方向に1マス移動する
function moveBlock(direction) {
    var frame_data = copy2dArray(FRAME_DATA);

    // 配列の走査方向を同じにするためframe_dataを回転させる
    const rotateCount = getRotateCount(direction);
    for (let i = 0; i < rotateCount; i++) {
        frame_data = rotate(frame_data);
    }

    const width = frame_data[0].length;
    const height = frame_data.length;

    for (let i = 0; i < width; i++) {
        // 下から上に向かってブロックを見ていく。
        // EMPTYの上にFALLINGがあればcellを入れ替える。
        for (let j = height - 1; 0 < j; j--) {
            let cell = frame_data[j][i];
            let precedingCell = frame_data[j - 1][i];

            if (cell === CELL_TYPE_EMPTY && precedingCell === CELL_TYPE_FALLING) {
                frame_data[j][i] = CELL_TYPE_FALLING;
                frame_data[j - 1][i] = CELL_TYPE_EMPTY;
            }
        }
    }

    // 回転させた分を戻す
    for (let i = 0; i < 4 - rotateCount; i++) {
        frame_data = rotate(frame_data);
    }

    // ブロック移動後のcellの状態をFRAME_DATAに反映
    for (let i = 0; i < HEIGHT; i++) {
        for (let j = 0; j < WIDTH; j++) {
            FRAME_DATA[i][j] = frame_data[i][j];
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

// 入力のハンドリング
function handleUserInput() {
    if (!input_buffer.length) {
        return;
    }

    var keyCode = input_buffer[input_buffer.length - 1];

    console.log("handle " + keyCode);

    const moveKeys = {
      [LEFT_KEY]: "left",
      [H_KEY]: "left",

      [RIGHT_KEY]: "right",
      [L_KEY]: "right",

      [DOWN_KEY]: "down",
      [J_KEY]: "down",
    }

    const direction = moveKeys[keyCode];
    if (direction && canMove(direction)) {
        moveBlock(direction);
    }

    input_buffer = [];
}

function makeNextFameData() {
    handleUserInput();

    // 10フレーム周期でブロックを下に落とす

    if (tick_count % BLOCK_FALLING_FREQUENCY != 0) {
        return;
    }

    if (blockFalled()) {
        enterNewBlock();  // 新しいブロックを生成
    } else {
        if (canMove("down")) {
            moveBlock("down");
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
var input_buffer = [];

function run() {
    interval = setInterval(() => {
        tick_count++;

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

    $(window).on("keydown", (event) => {
        const keyCode = event.keyCode;
        const array = [
            LEFT_KEY,
            RIGHT_KEY,
            DOWN_KEY,
            H_KEY,
            J_KEY,
            L_KEY
        ];

        if (array.includes(keyCode)) {
            input_buffer.push(keyCode);
        }
    });
});

