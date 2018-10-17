const I = [
    ['x'],
    ['x'],
    ['x'],
    ['x'],
];

const O = [
    ['x', 'x'],
    ['x', 'x'],
];

const Z = [
    ['x', 'x'],
    [' ', 'x', 'x'],
];

const S = [
    [' ', 'x', 'x'],
    ['x', 'x'],
];

const T = [
    ['X', 'x', 'x'],
    [' ', 'x'],
];

const L = [
    ['x'],
    ['x'],
    ['x', 'x'],
];

const J = [
    [' ', 'x'],
    [' ', 'x'],
    ['x', 'x'],
];

const BLOCKS = [
    I, O, Z, S, T, L, J
];

function makeFallingBlock(type) {
    return type.map(row =>
        row.map(cell =>
            cell === 'x' ? CELL_TYPE_FALLING : CELL_TYPE_EMPTY
        )
    );
}

function generateRandomBlock() {
    return BLOCKS[Math.floor(Math.random() * Math.floor(BLOCKS.length))];
}