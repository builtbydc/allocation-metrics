function u(val) {
    return val * unit;
}

function x(lr, val) {
    if (lr === "l") return x0 + u(val);
    else return x0 + sideLength - u(val);
}

function y(tb, val) {
    if (tb === "t") return y0 + u(val);
    else return y0 + sideLength - u(val);
}

function singleGradient(ci, cj, val, len) {
    let p = val / len;
    return color(ci[0] + p * (cj[0]-ci[0]), 
                 ci[1] + p * (cj[1]-ci[1]),
                 ci[2] + p * (cj[2]-ci[2]));
}

function gradient(val, zero, ...colors) {
    let sum = 0;
    let i = 1;
    for(; i < colors.length - 2; i += 2) {
        if(val < colors[i]) break;
        sum = colors[i];
    }
    return singleGradient(colors[i-1], colors[i+1], val - sum, colors[i] - sum);
}

function getColor(val) {
    let black = [0,0,0];
    let purple = [60,9,108];
    let pink = [222, 77, 134];
    let green = [180, 227, 61];
    let blue = [180, 225, 255];
    let white = [255, 255, 255];

    return gradient(val, 0, white, 0.05, blue, 0.85, purple, 1, black);
}

function dig3(val) {
    if (val >= 1000) return Math.round(val);
    if (val < 0.0001) return 0;
    let c = 0;
    while (val * 10 < 1000) {
        val *= 10;
        c++;
    }
    val = Math.round(val);
    return val / Math.pow(10, c);
}

function sne(val) {
    if(val <= 0) return "0";
    let c = 0;
    for(; val * 10 < 100; c--) val *= 10;
    val = Math.round(val);
    val /= 10
    let f = Math.round(val) == val;
    return val + (f?".0":"") + "e" + (c+1);
}