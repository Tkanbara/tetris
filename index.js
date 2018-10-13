const FRAME_RATE = 1;
const WIDTH = 10;
const HEIGHT = 20;

const FRAME = [];

for (let i = 0; i < HEIGHT; i++) {
    FRAME[i] = [];

    for (let j = 0; j < WIDTH; j++) {
        FRAME[i][j] = CELL_TYPE_EMPTY;
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

    for (let i = 0; i < HEIGHT; i++) {
        const row = $('<div class="row">');

        for (let j = 0; j < WIDTH; j++) {
            let cell = $('<div class="cell">');

            cell.addClass(CELL_CLASS[FRAME[i][j]]);

            row.append(cell);
        }

        frame.append(row);
    }
}

var foo;

function run() {
    foo = setInterval(() => {
        // TODO 処理を書く
        console.log("tick");
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
