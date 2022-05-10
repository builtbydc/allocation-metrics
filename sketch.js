let font;
function preload() {
    font = loadFont("./font/DejaVuSans.ttf");
}

let workload = 0;
let heatMap;
let workloadName;

let menuButton;
let selectButtons;
let zeroButton;
let showZeroes = false;


let unit;

let landscape;

let dimension;
let margin;
let sideLength;
let x0;
let y0;

function u(val) {
    return val * unit;
}

function x(lr, val) {
    if (lr === "l") return x0 + u(val);
    if (lr === "r") return x0 + sideLength + u(val);
}

function y(tb, val) {
    if (tb === "t") return y0 + u(val);
    if (tb === "b") return y0 + sideLength + u(val);
}

function getColor(val) {
    let p = 0.05;
    let np = 1 - p;

    let r0 = 0;
    let g0 = 0;
    let b0 = 0;

    let r1 = 60;
    let g1 = 9;
    let b1 = 108;

    let r2 = 255;
    let g2 = 255;
    let b2 = 255;

    if (val < p) {
        return color(r0 + (val / p) * (r1 - r0), g0 + (val / p) * (g1 - g0), b0 + (val / p) * (b1 - b0));
    }
    return color(r1 + ((val - p) / np) * (r2 - r1), g1 + ((val - p) / np) * (g2 - g1), b1 + ((val - p) / np) * (b2 - b1));
}

function dig3(val) {
    if (val >= 1000) return Math.round(val);
    if (val < 0.001) return 0;
    let c = 0;
    while (val * 10 < 1000) {
        val *= 10;
        c++;
    }
    val = Math.round(val);
    return val / Math.pow(10, c);
}

function setConstants() {
    if (windowWidth > windowHeight) {
        landscape = true;
        dimension = windowHeight;
        unit = dimension / 1000;
        margin = u(70);
        x0 = (windowWidth - dimension) / 2 + margin;
        y0 = margin;
    } else {
        landscape = false;
        dimension = windowWidth;
        unit = dimension / 1000;
        margin = u(70);
        x0 = margin;
        y0 = (windowHeight - dimension) / 2 + margin;
    }
    sideLength = dimension - 2 * margin;
}

function buildAxes() {
    push();

    noFill();
    strokeWeight(u(4));
    stroke(255);
    rect(x("l", -4), y("t", -4), sideLength + u(8), sideLength + u(8));

    textAlign(LEFT);
    textSize(u(28));
    noStroke();
    fill(255);

    push();
    translate(x("l", -28), y("t", 600));
    rotate(radians(-90));
    text("number of accesses ⟶", 0, 0);
    pop();

    text("time between allocation and first access ⟶", x("l", 120), y("b", 45));

    textSize(u(14));
    fill(255);
    noStroke();

    textAlign(CENTER);
    text("MAX\n" + dig3(heatMap.maxCOUNT), x("l", -38), y("t", 14));
    text("MIN\n" + dig3(heatMap.minCOUNT), x("l", -38), y("b", -25));

    text("MIN\n" + dig3(heatMap.minDT / 1000) + " s", x("l", 17), y("b", 34));
    text("MAX\n" + dig3(heatMap.maxDT / 1000) + " s", x("l", 843), y("b", 34));

    textSize(u(35));
    text(workloadName, x0 + sideLength / 2, y("t", -23));

    pop();
}

function buildGradient() {
    push();

    strokeWeight(1);
    let gradientTopEdge = y("t", 50);
    let gradientHeight = sideLength - u(102);
    for (let i = gradientTopEdge; i < gradientTopEdge + gradientHeight; i++) {
        let val = i - gradientTopEdge;
        stroke(getColor(1 - (val / gradientHeight)));
        line(x("r", 17), i, x("r", 57), i);
    }

    noStroke();
    fill(255);
    textSize(u(14));
    textAlign(CENTER);
    text("more\npages", x("r", 38), y("t", 14));
    text("less\npages", x("r", 38), y("b", -25));

    pop();
}

function createButtons() {
    zeroButton = new Button(x("l", -4), y("t", -65), u(54), u(54), "Show\nzeroes", u(14), true, null);
    zeroButton.action = (function () {
        showZeroes = !showZeroes;
        setup();
    });

    menuButton = new Button(x("r", -51), y("t", -65), u(54), u(54), "☰", u(35), true, null, true);
    menuButton.action = (function () {
        menuButton.state = !menuButton.state;
    });

    let sbx0 = x("l", 35);
    let sbx1 = x("l", 35) + sideLength / 2;
    let sby0 = y("t", 35);
    let sby1 = y("t", 35) + sideLength / 4;
    let sby2 = y("t", 35) + sideLength / 2;
    let sby3 = y("t", 35) + 3 * sideLength / 4;
    let sbw = sideLength / 2 - margin;
    let sbh = sideLength / 4 - margin;
    selectButtons = [];
    selectButtons[0] = new Button(sbx0, sby0, sbw, sbh, "GAPBS BFS", u(28), false, 0);
    selectButtons[1] = new Button(sbx0, sby1, sbw, sbh, "GAPBS TC", u(28), false, 1);
    selectButtons[2] = new Button(sbx0, sby2, sbw, sbh, "NAS BT", u(28), false, 2);
    selectButtons[3] = new Button(sbx0, sby3, sbw, sbh, "NAS LU-02", u(28), false, 3);
    selectButtons[4] = new Button(sbx1, sby0, sbw, sbh, "NAS SP", u(28), false, 4);
    selectButtons[5] = new Button(sbx1, sby1, sbw, sbh, "SPEC pmniGhost", u(28), false, 5);
    selectButtons[6] = new Button(sbx1, sby2, sbw, sbh, "SPEC pseismic", u(28), false, 6);
    selectButtons[7] = new Button(sbx1, sby3, sbw, sbh, "SPEC pilbdc", u(28), false, 7);
    for (let i = 0; i < 8; i++) {
        selectButtons[i].action = (function () {
            workload = selectButtons[i].wld;
        });
    }
}

function createHeatMap() {
    if (workload === 0) {
        heatMap = new HeatMap(BFSmetrics, BFSmaxDT, BFSmaxCOUNT, BFSlength);
        workloadName = "GAPBS BFS";
    } else if (workload === 1) {
        heatMap = new HeatMap(TCmetrics, TCmaxDT, TCmaxCOUNT, TClength);
        workloadName = "GAPBS TC";
    } else if (workload === 2) {
        heatMap = new HeatMap(NASBTmetrics, NASBTmaxDT, NASBTmaxCOUNT, NASBTlength);
        workloadName = "NAS BT";
    } else if (workload === 3) {
        heatMap = new HeatMap(NASLU02metrics, NASLU02maxDT, NASLU02maxCOUNT, NASLU02length);
        workloadName = "NAS LU-02";
    } else if (workload === 4) {
        heatMap = new HeatMap(NASSPmetrics, NASSPmaxDT, NASSPmaxCOUNT, NASSPlength);
        workloadName = "NAS SP"
    } else if (workload === 5) {
        heatMap = new HeatMap(SPECpmniGhostmetrics, SPECpmniGhostmaxDT, SPECpmniGhostmaxCOUNT, SPECpmniGhostlength);
        workloadName = "SPEC pmniGhost";
    } else if (workload === 6) {
        heatMap = new HeatMap(SPECpseismicmetrics, SPECpseismicmaxDT, SPECpseismicmaxCOUNT, SPECpseismiclength);
        workloadName = "SPEC pseismic";
    } else if (workload === 7) {
        heatMap = new HeatMap(SPECpilbdcmetrics, SPECpilbdcmaxDT, SPECpilbdcmaxCOUNT, SPECpilbdclength);
        workloadName = "SPEC pilbdc"
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    textFont(font);

    setConstants();

    createButtons();
    createHeatMap();

    buildAxes();
    buildGradient();

    heatMap.display(x0, y0, dimension - u(140));

} window.onresize = setup;

function draw() {
    zeroButton.display();

    if (landscape) {
        menuButton.display();
    } else {
        menuButton.shown = false;
    }
    if (menuButton.state) {
        noStroke();
        fill(60, 9, 108, 15);
        rect(x0, y0, dimension - 2 * margin, dimension - 2 * margin);
        for (let i = 0; i < 8; i++) {
            selectButtons[i].display();
            selectButtons[i].shown = true;
        }
    }
}

function mouseClicked() {
    if (landscape) {
        for (let i = 0; i < 8; i++) {
            selectButtons[i].click();
            selectButtons[i].shown = false;
        }
        if (menuButton.state) setup();
        menuButton.click();
    } else {
        touched();
    }
    zeroButton.click();
}

function touched() {
    workload++;
    workload %= 8;
    setup();
} window.ontouchend = touched;

class HeatMap {
    constructor(metrics, maxDT, maxCOUNT, length) {
        this.array = metrics;
        this.size = metrics.length;

        this.minDT = 0;
        this.maxDT = maxDT;
        this.minCOUNT = 0;
        this.maxCOUNT = maxCOUNT;

        this.arrayMax = this.array[0][0];
        this.arrayMin = this.arrayMax;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.array[i][j] > this.arrayMax) this.arrayMax = this.array[i][j];
                if (this.array[i][j] < this.arrayMin) this.arrayMin = this.array[i][j];
            }
        }
    }

    display(x0, y0, dimension) {
        let range = this.arrayMax - this.arrayMin;
        let d = dimension / this.size;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                let rowCF = this.size - i - 1;
                if (showZeroes && this.array[i][j] === 0) {
                    stroke(0);
                    let wgt = u(3);
                    strokeWeight(wgt);
                    fill(100);
                    rect(x0 + j * d + wgt, y0 + rowCF * d + wgt, d - 2 * wgt, d - 2 * wgt, d / 2);
                }
                else {
                    let val = this.array[i][j] - this.arrayMin;
                    strokeWeight(u(1));
                    stroke(getColor(val / range));
                    fill(getColor(val / range));
                    rect(x0 + j * d, y0 + rowCF * d, d, d);
                }
            }

        }
    }

}

class Button {
    constructor(x, y, w, h, text, fontSize, shown, wld, center_opt) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.text = text;
        this.fontSize = fontSize;
        this.shown = shown;
        this.state = false;
        this.wld = wld;
        this.center_opt = center_opt;
    }

    display() {
        push();
        fill(0);
        if (mouseX >= this.x && mouseX <= this.x + this.w) {
            if (mouseY >= this.y && mouseY <= this.y + this.h) {
                fill(60, 9, 108, 100);
            }
        }
        stroke(136, 29, 237);
        strokeWeight(u(3));
        rect(this.x, this.y, this.w, this.h, 5);
        textAlign(CENTER, CENTER);
        textSize(this.fontSize);
        fill(255);
        noStroke();
        if (mouseX >= this.x && mouseX <= this.x + this.w) {
            if (mouseY >= this.y && mouseY <= this.y + this.h) {
                stroke(255);
                strokeWeight(0.5);
            }
        }
        if (this.center_opt)
            text(this.text, this.x + this.w / 2, this.y + 4 * this.h / 9);
        else
            text(this.text, this.x + this.w / 2, this.y + this.h / 2);
        pop();
    }

    click() {
        if (this.shown) {
            if (mouseX >= this.x && mouseX <= this.x + this.w) {
                if (mouseY >= this.y && mouseY <= this.y + this.h) {
                    this.action();
                }
            }
        }
    }
    action() { }
}