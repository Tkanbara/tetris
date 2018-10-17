const FRAME_RATE = 10;
const WIDTH = 10;
const HEIGHT = 20;

var tick_count = 0;

const FRAME_DATA = [];

for (let i = 0; i < HEIGHT + 4; i++) {
    FRAME_DATA[i] = [];

    for (let j = 0; j < WIDTH; j++) {
        FRAME_DATA[i][j] = CELL_TYPE_EMPTY;
    }
}

function draw() {
    const frame = $("#frame");
    frame.empty();

    const CELL_CLASS = [
        "empty",
        "exist",
        "falling",
    ];

    for (let i = 4; i < HEIGHT + 4; i++) {
        const row = $('<div class="row">');

        for (let j = 0; j < WIDTH; j++) {
            let cell = $('<div class="cell">');

            cell.addClass(CELL_CLASS[FRAME_DATA[i][j]]);

            row.append(cell);
        }

        frame.append(row);
    }
}

function makeNextFameData() {
    if (tick_count % 10 == 0) {
        // 1秒ごとにブロックを下に落とす
        let blockFalled = FRAME_DATA.every(row => row.every(cell => cell != CELL_TYPE_FALLING))

        if (blockFalled) {
            // 下に落とす
        } else {
            // 新しいブロックを生成
            let block = generateRandomBlock();
        }
    }
}

var foo;

function run() {
    tick_count++;

    foo = setInterval(() => {
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
        console.log("fooooooooooooooo");
        clearInterval(foo);
    });

    $("#resume").on("click", () => {
        run();
    });
})
