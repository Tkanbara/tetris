var I = [
    ['x'],
    ['x'],
    ['x'],
    ['x'],
];

var O = [
    ['x', 'x'],
    ['x', 'x'],
];

var Z = [
    ['x', 'x'],
    [' ', 'x', 'x'],
];

var S = [
    [' ', 'x', 'x'],
    ['x', 'x'],
];

var T = [
    ['x', 'x', 'x'],
    [' ', 'x'],
];

var L = [
    ['x'],
    ['x'],
    ['x', 'x'],
];

var J = [
    [' ', 'x'],
    [' ', 'x'],
    ['x', 'x'],
];

function makeFallingBlock(type) {
    return type.map(row =>
        row.map(cell =>
            cell === 'x' ? CELL_TYPE_FALLING : CELL_TYPE_EMPTY
        )
    );
}
