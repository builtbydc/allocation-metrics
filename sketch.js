let font;
function preload() {
    font = loadFont("./font/DejaVuSans.ttf");
}

let workload = 0;
let ham;
let btns;
let zb;
let showZ = false;


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
        eham = true;
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
    strokeWeight(4*mdim);
    rect(x0 - 4*mdim, y0-4*mdim, dim - 2 * margin + 8*mdim, dim - 2 * margin + 8*mdim);

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
    translate(x0 - 28 * mdim, y0 + 600 * mdim);
    rotate(radians(-90));
    text("number of accesses ⟶", 0, 0);
    pop();
    
    text("time between allocation and first access ⟶", x0 + 120 * mdim, y0 + dim - 2 * margin + 45 * mdim);

    let hm;
    let wname;
    if (workload === 0) {
        hm = new HeatMap(BFSmetrics, BFSmaxDT, BFSmaxCOUNT, BFSlength);
        wname = "GAPBS BFS";
    }
    else if (workload === 1) {
        hm = new HeatMap(TCmetrics, TCmaxDT, TCmaxCOUNT, TClength);
        wname = "GAPBS TC";
    }
    else if (workload === 2) {
        hm = new HeatMap(NASBTmetrics, NASBTmaxDT, NASBTmaxCOUNT, NASBTlength);
        wname = "NAS BT";
    }
    else if (workload === 3) {
        hm = new HeatMap(NASLU02metrics, NASLU02maxDT, NASLU02maxCOUNT, NASLU02length);
        wname = "NAS LU-02";
    }
    else if (workload === 4) {
        hm = new HeatMap(NASSPmetrics, NASSPmaxDT, NASSPmaxCOUNT, NASSPlength);
        wname = "NAS SP"
    }
    else if (workload === 5) {
        hm = new HeatMap(SPECpmniGhostmetrics, SPECpmniGhostmaxDT, SPECpmniGhostmaxCOUNT, SPECpmniGhostlength);
        wname = "SPEC pmniGhost";
    }
    else if (workload === 6) {
        hm = new HeatMap(SPECpseismicmetrics, SPECpseismicmaxDT, SPECpseismicmaxCOUNT, SPECpseismiclength);
        wname = "SPEC pseismic";
    }
    else if (workload === 7) {
        hm = new HeatMap(SPECpilbdcmetrics, SPECpilbdcmaxDT, SPECpilbdcmaxCOUNT, SPECpilbdclength);
        wname = "SPEC pilbdc"
    }
    zb = new Button(x0 - 4*mdim, y0 - 65 * mdim, 54 * mdim, 54 * mdim, "Show\nzeroes", true, null);

    hm.display(x0, y0, dim - 140 * mdim);

    textSize(14 * mdim);
    fill(255);
    noStroke();

    textAlign(CENTER);
    text("MAX\n" + threeD(hm.maxCOUNT), x0 - 38 * mdim, y0 + 14 * mdim);
    text("MIN\n" + threeD(hm.minCOUNT), x0 - 38 * mdim, y0 + dim - 2 * margin - 25 * mdim);

    text("MIN\n" + threeD(hm.minDT / 1000) + " s", x0 + 17 * mdim, y0 + dim - 2 * margin + 34 * mdim);
    text("MAX\n" + threeD(hm.maxDT / 1000) + " s", x0 + 843 * mdim, y0 + dim - 2 * margin + 34 * mdim);

    textSize(35 * mdim);
    text(wname, x0 + dim / 2 - margin, y0 - 23 * mdim);
    ham = new Button(x0 + dim - 2 * margin - 51 * mdim, y0 - 65 * mdim, 54 * mdim, 54 * mdim, "☰", true, null);
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
    zb.zDisplay();

    if(eham) {
        ham.hDisplay();
    } else {
        ham.shown = false;
    }
    if (ham.state) {
        noStroke();
        fill(60, 9, 108, 15);
        rect(x0, y0, dim - 2 * margin, dim - 2 * margin);
        for (let i = 0; i < 8; i++) {
            btns[i].wDisplay();
            btns[i].shown = true;
        }
    }
}

function mouseClicked() {
    if(eham) {
        for (let i = 0; i < 8; i++) {
            btns[i].wClick();
            btns[i].shown = false;
        }
        if (ham.state) setup();
        ham.click();
    } else {
        touched();
    }
    zb.zClick();
}

function touched() {
    workload++;
    workload %= 8;
    setup();
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

    let br = 0;
    let bg = 0;
    let bb = 0;
    let ir = 60;
    let ig = 9;
    let ib = 108;
    let er = 255;
    let eg = 255;
    let eb = 255;

    if (val < p) {
        return color(br + (val / p) * (ir - br), bg + (val / p) * (ig - bg), bb + (val / p) * (ib - bb));
    }
    return color(ir + ((val - p) / np) * (er - ir), ig + ((val - p) / np) * (eg - ig), ib + ((val - p) / np) * (eb - ib));
}

class HeatMap {
    constructor(metrics, maxDT, maxCOUNT, length) {
        this.array = metrics;
        this.size = metrics.length;

        this.minDT = 0;
        this.maxDT = maxDT;
        this.minCOUNT = 1;
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
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                stroke(getColor((this.array[i][j] - this.arrayMin) / (this.arrayMax - this.arrayMin)));
                strokeWeight(1*mdim);
                fill(getColor((this.array[i][j] - this.arrayMin) / (this.arrayMax - this.arrayMin)));
                if(showZ && this.array[i][j] === 0) {
                    stroke(0);
                    let wgt = 3*mdim
                    strokeWeight(wgt);
                    fill(100);
                    rect(x0 + j * (dimension / this.size) + wgt, y0 + ((this.size - i) % this.size) * (dimension / this.size) + wgt, dimension / this.size - 2*wgt, dimension / this.size - 2*wgt, dimension / (2*this.size));
                }
                else
                    rect(x0 + j * (dimension / this.size), y0 + ((this.size - i) % this.size) * (dimension / this.size), dimension / this.size, dimension / this.size);
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
    zDisplay() {
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
        textSize(14 * mdim);
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
    zClick() {
        if (this.shown) {
            if (mouseX >= this.x && mouseX <= this.x + this.w) {
                if (mouseY >= this.y && mouseY <= this.y + this.h) {
                    showZ = !showZ;
                    setup();
                }
            }
        }
    }
}