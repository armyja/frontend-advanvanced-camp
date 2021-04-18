// abababx
function match(str) {
    let state = start;
    for (let c of str) {
        state = state(c);
        if (state === foundX) {
            return true;
        }
    }
    return false;
}

console.log(match("abababx"));
console.log(match("aaabababx"));
console.log(match("ababababx"));

function start(c) {
    if (c === 'a') {
        return foundA1;
    }
    return start;
}
function foundA1(c) {
    if (c === 'b') {
        return foundB1;
    }
    return start(c);
}
function foundB1(c) {
    if (c === 'a') {
        return foundA2;
    }
    return start(c);
}
function foundA2(c) {
    if (c === 'b') {
        return foundB2;
    }
    return start(c);
}
function foundB2(c) {
    if (c === 'a') {
        return foundA3;
    }
    return start(c);
}
function foundA3(c) {
    if (c === 'b') {
        return foundB3;
    }
    return start(c);
}


function foundB3(c) {
    if (c === 'x') {
        return foundX;
    }
    return foundB2(c);
}

function foundX(c) {
    return true;
}