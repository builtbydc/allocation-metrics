let font;
function preload() {
    font = loadFont("./font/DejaVuSans.ttf");
}

let workload = 0;
let ham;
let btns;

let mdim;

let eham;

let dim;
let margin;
let x0;
let y0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    textAlign(LEFT);

    if (windowWidth > windowHeight) {
        dim = windowHeight;
        mdim = dim / 1000;
        margin = 70 * mdim;
        x0 = (windowWidth - dim) / 2 + margin;
        y0 = margin;
    } else {
        eham = false;
        dim = windowWidth;
        mdim = dim / 1000;
        margin = 70 * mdim;
        x0 = margin;
        y0 = (windowHeight - dim) / 2 + margin;
    }

    noFill();
    stroke(255);
    strokeWeight(7 * mdim);
    rect(x0, y0, dim - 2 * margin, dim - 2 * margin);

    strokeWeight(1);
    let gradientTopEdge = y0 + 50 * mdim;
    let gradientHeight = dim - 2 * margin - 102 * mdim;
    for (let i = gradientTopEdge; i < gradientTopEdge + gradientHeight; i++) {
        let val = i - gradientTopEdge;
        stroke(getColor(1 - (val / gradientHeight)));
        line(x0 + dim - 2 * margin + 17 * mdim, i, x0 + dim - 2 * margin + 57 * mdim, i);
    }

    noStroke();
    fill(255);
    textSize(28 * mdim);
    textFont(font);
    textSize(14 * mdim)
    textAlign(CENTER);
    text("more\npages", x0 + dim - 2 * margin + 38 * mdim, y0 + 14 * mdim);
    text("less\npages", x0 + dim - 2 * margin + 38 * mdim, y0 + dim - 2 * margin - 25 * mdim);

    textAlign(LEFT);
    textSize(28 * mdim);
    push();
    translate(x0 - 28 * mdim, y0 + 740 * mdim);
    rotate(radians(-90));
    text("time between allocation and first access ⟶", 0, 0);
    pop();

    text("number of accesses ⟶", x0 + 265 * mdim, y0 + dim - 2 * margin + 45 * mdim);

    let hm;
    let wname;
    if (workload === 0) {
        hm = new HeatMap(BFSmetrics);
        wname = "GAPBS BFS";
    }
    else if (workload === 1) {
        hm = new HeatMap(TCmetrics);
        wname = "GAPBS TC";
    }
    else if (workload === 2) {
        hm = new HeatMap(NASBTmetrics);
        wname = "NAS BT";
    }
    else if (workload === 3) {
        hm = new HeatMap(NASLU02metrics);
        wname = "NAS LU-02";
    }
    else if (workload === 4) {
        hm = new HeatMap(NASSPmetrics);
        wname = "NAS SP"
    }
    else if (workload === 5) {
        hm = new HeatMap(SPECpmniGhostmetrics);
        wname = "SPEC pmniGhost";
    }
    else if (workload === 6) {
        hm = new HeatMap(SPECpseismicmetrics);
        wname = "SPEC pseismic";
    }
    else if (workload === 7) {
        hm = new HeatMap(SPECpilbdcmetrics);
        wname = "SPEC pilbdc"
    }

    hm.display(x0, y0, dim - 140 * mdim);

    textSize(14 * mdim);
    fill(255);
    noStroke();

    textAlign(CENTER);
    text("MAX\n" + threeD(hm.max3 / 1000) + " s", x0 - 38 * mdim, y0 + 14 * mdim);
    text("MIN\n" + threeD(hm.min3 / 1000) + " s", x0 - 38 * mdim, y0 + dim - 2 * margin - 25 * mdim);

    text("MIN\n" + Math.round(threeD(hm.min4)), x0 + 17 * mdim, y0 + dim - 2 * margin + 34 * mdim);
    text("MAX\n" + Math.round(threeD(hm.max4)), x0 + 843 * mdim, y0 + dim - 2 * margin + 34 * mdim);

    textSize(35 * mdim);
    text(wname, x0 + dim / 2 - margin, y0 - 23 * mdim);

    ham = new Button(x0 + dim - 2 * margin - 55 * mdim, y0 - 65 * mdim, 56 * mdim, 56 * mdim, "☰", true, null);
    btns = [];
    btns[0] = new Button(x0 + margin / 2, y0 + margin / 2, dim / 2 - margin - margin, (dim - 2 * margin) / 4 - margin, "GAPBS BFS", false, 0);
    btns[1] = new Button(x0 + margin / 2, y0 + margin / 2 + (dim - 2 * margin) / 4, dim / 2 - margin - margin, (dim - 2 * margin) / 4 - margin, "GAPBS TC", false, 1);
    btns[2] = new Button(x0 + margin / 2, y0 + margin / 2 + (dim - 2 * margin) / 2, dim / 2 - margin - margin, (dim - 2 * margin) / 4 - margin, "NAS BT", false, 2);
    btns[3] = new Button(x0 + margin / 2, y0 + margin / 2 + 3 * (dim - 2 * margin) / 4, dim / 2 - margin - margin, (dim - 2 * margin) / 4 - margin, "NAS LU-02", false, 3);
    btns[4] = new Button(x0 + margin / 2 + dim / 2 - margin, y0 + margin / 2, dim / 2 - margin - margin, (dim - 2 * margin) / 4 - margin, "NAS SP", false, 4);
    btns[5] = new Button(x0 + margin / 2 + dim / 2 - margin, y0 + margin / 2 + (dim - 2 * margin) / 4, dim / 2 - margin - margin, (dim - 2 * margin) / 4 - margin, "SPEC pmniGhost", false, 5);
    btns[6] = new Button(x0 + margin / 2 + dim / 2 - margin, y0 + margin / 2 + (dim - 2 * margin) / 2, dim / 2 - margin - margin, (dim - 2 * margin) / 4 - margin, "SPEC pseismic", false, 6);
    btns[7] = new Button(x0 + margin / 2 + dim / 2 - margin, y0 + margin / 2 + 3 * (dim - 2 * margin) / 4, dim / 2 - margin - margin, (dim - 2 * margin) / 4 - margin, "SPEC pilbdc", false, 7);

} window.onresize = setup;

function draw() {
    if(eham) {
        ham.hDisplay();
    } else {
        ham.shown = false;
    }
    if (ham.state) {
        noStroke();
        fill(60, 9, 108, 20);
        rect(x0, y0, dim - 2 * margin, dim - 2 * margin);
        for (let i = 0; i < 8; i++) {
            btns[i].wDisplay();
            btns[i].shown = true;
        }
    }
}

function mouseClicked() {
    for (let i = 0; i < 8; i++) {
        btns[i].wClick();
        btns[i].shown = false;
    }
    if (ham.state) setup();
    ham.click();
}

function touched() {
    workload++;
    workload %= 8;
} window.ontouchend = touched;

function threeD(val) {
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

function getColor(val) {
    let p = 0.05;
    let np = 1 - p;

    let ir = 60;
    let ig = 9;
    let ib = 108;
    let er = 255;
    let eg = 255;
    let eb = 255;

    if (val < p) {
        return color((val / p) * ir, (val / p) * ig, (val / p) * ib);
    }
    return color(ir + ((val - p) / np) * (er - ir), ig + ((val - p) / np) * (eg - ig), ib + ((val - p) / np) * (eb - ib));
}

class HeatMap {
    constructor(metrics) {
        this.size = Math.floor(Math.sqrt(metrics.length));
        this.array = [];
        for (let i = 0; i < this.size; i++) {
            this.array[i] = []
            for (let j = 0; j < this.size; j++)
                this.array[i][j] = 0;
        }

        this.min3 = metrics[0][2];
        this.max3 = this.min3;
        this.min4 = metrics[0][3];
        this.max4 = this.min4;
        for (let i = 1; i < metrics.length; i++) {
            if (metrics[i][2] < this.min3) this.min3 = metrics[i][2];
            if (metrics[i][2] > this.max3) this.max3 = metrics[i][2];
            if (metrics[i][3] < this.min4) this.min4 = metrics[i][3];
            if (metrics[i][3] > this.max4) this.max4 = metrics[i][3];
        }
        let range3 = this.max3 - this.min3;
        let range4 = this.max4 - this.min4;
        fill(255, 0, 0);
        for (let i = 0; i < metrics.length; i++) {
            let yi = Math.floor(((metrics[i][2] - this.min3) / range3) * this.size);
            let xi = Math.floor(((metrics[i][3] - this.min4) / range4) * this.size);
            while (xi >= this.size) xi--;
            while (yi >= this.size) yi--;
            this.array[yi][xi] += metrics[i][0];
        }

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
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                fill(getColor((this.array[i][j] - this.arrayMin) / (this.arrayMax - this.arrayMin)));
                rect(x0 + j * (dimension / this.size), y0 + (this.size - i - 1) * (dimension / this.size), dimension / this.size, dimension / this.size);
            }
        }
    }

}

class Button {
    constructor(x, y, w, h, text, shown, wld) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.text = text;
        this.shown = shown;
        this.state = false;
        this.wld = wld;
    }
    hDisplay() {
        fill(0);
        if (mouseX >= this.x && mouseX <= this.x + this.w) {
            if (mouseY >= this.y && mouseY <= this.y + this.h) {
                fill(60, 9, 108, 20);
            }
        }
        stroke(136, 29, 237);
        strokeWeight(3 * mdim);
        rect(this.x, this.y, this.w, this.h, 5);
        textAlign(CENTER);
        fill(255);
        noStroke();
        if (mouseX >= this.x && mouseX <= this.x + this.w) {
            if (mouseY >= this.y && mouseY <= this.y + this.h) {
                stroke(255);
                strokeWeight(0.5);
            }
        }
        text(this.text, this.x + this.w / 2, this.y + 3 * this.h / 4);
    }
    wDisplay() {
        push();
        fill(0);
        if (mouseX >= this.x && mouseX <= this.x + this.w) {
            if (mouseY >= this.y && mouseY <= this.y + this.h) {
                fill(60, 9, 108, 100);
            }
        }
        stroke(136, 29, 237);
        strokeWeight(3 * mdim);
        rect(this.x, this.y, this.w, this.h, 5);
        textAlign(CENTER, CENTER);
        textSize(28 * mdim);
        fill(255);
        noStroke();
        if (mouseX >= this.x && mouseX <= this.x + this.w) {
            if (mouseY >= this.y && mouseY <= this.y + this.h) {
                stroke(255);
                strokeWeight(0.5);
            }
        }
        text(this.text, this.x + this.w / 2, this.y + this.h / 2);
        pop();
    }
    click() {
        if (this.shown) {
            if (mouseX >= this.x && mouseX <= this.x + this.w) {
                if (mouseY >= this.y && mouseY <= this.y + this.h) {
                    this.state = !this.state;
                }
            }
        }
    }
    wClick() {
        if (this.shown) {
            if (mouseX >= this.x && mouseX <= this.x + this.w) {
                if (mouseY >= this.y && mouseY <= this.y + this.h) {
                    workload = this.wld;
                }
            }
        }
    }
}