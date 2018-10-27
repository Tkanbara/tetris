// 配列を右回転
function rotate(array) {
    const newArray = [];

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            if (!newArray[j]) {
                newArray[j] = [];
            }
            newArray[j][i] = array[i][j];
        }
    }

    return newArray.map(a => a.reverse());
}

// 2次元配列をコピー
function copy2dArray(array) {
    return array.map(a => a.slice());
}

