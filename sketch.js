let font;
function preload() {
    font = loadFont("./font/DejaVuSans.ttf");
}

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

function setLineDash(list) {
    drawingContext.setLineDash(list);
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

let heatMap;
let workload = 0;
let workloadName;

let infoButton;
let showInfo = false;
let areaButton;
let showAreas = false;
let zeroButton;
let showZeroes = false;
let menuButton;
let showMenu = false;
let selectButtons;

let landscape;
let dimension;
let unit;
let margin;
let x0;
let y0;
let sideLength;

function setConstants() {
    if (windowWidth > windowHeight) {
        landscape = true;
        dimension = windowHeight;
        unit = dimension / 1000;
        margin = u(100);
        x0 = (windowWidth - dimension) / 2 + margin;
        y0 = margin;
    } else {
        landscape = false;
        dimension = windowWidth;
        unit = dimension / 1000;
        margin = u(100);
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

    stroke(255);
    strokeWeight(1);
    let counter = heatMap.size;
    for(let yt = y0; yt < y0 + sideLength + 1; yt += sideLength / heatMap.size) {
        if(counter % 5 === 0) {
            line(x0 - u(17), yt, x0 - u(5), yt);
            push();
            noStroke();
            fill(255);
            textSize(u(14));
            textAlign(CENTER);

            push();
            translate(x0 - u(20), yt);
            rotate(radians(-90));
            text(dig3(counter * heatMap.maxCOUNT / heatMap.size), 0, 0);
            
            pop();

            pop();
        } else
            line(x0 - u(11), yt, x0 - u(5), yt);
        counter--;
    }

    counter = 0;
    for(let xt = x0; xt < x0 + sideLength + 1; xt += sideLength / heatMap.size) {
        if(counter % 5 === 0) {
            line(xt, y0 + sideLength + u(17), xt, y0 + sideLength + u(5));
            push();
            noStroke();
            fill(255);
            textSize(u(14));
            textAlign(CENTER);
            text(dig3(counter * (heatMap.maxDT / heatMap.size) / 1000000) + " M", xt, y("b", 31));
            pop();
        } else
            line(xt, y0 + sideLength + u(11), xt, y0 + sideLength + u(5));
        counter++;
    }

    textAlign(LEFT);
    textSize(u(28));
    noStroke();
    fill(255);

    push();
    textAlign(CENTER);
    translate(x("l", -58), y0 + sideLength / 2);
    rotate(radians(-90));
    text("page importance [(# accesses / avg. reuse distance)^(1/4)]", 0, 0);
    pop();

    push();
    textAlign(CENTER);
    text("reuse distance [allocation to first access] (millions)", x0 + sideLength / 2, y("b", 70));
    pop();

    textSize(u(14));
    fill(255);
    noStroke();

    textAlign(CENTER);
    /*
    text("MAX\n" + dig3(heatMap.maxCOUNT), x("l", -38), y("t", 14));
    text("MIN\n" + dig3(heatMap.minCOUNT), x("l", -38), y("b", -25));

    text("MIN\n" + dig3(heatMap.minDT / 1000) + " s", x("l", 17), y("b", 34));
    text("MAX\n" + dig3(heatMap.maxDT / 1000) + " s", x("l", 843), y("b", 34));
    */

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

function buildAreas() {
    push();

    let areaWeight = u(10);
    let DAx = x0 + areaWeight / 2;
    let DPx = DAx;
    //let PPx = x0 + (10000 / heatMap.maxDT) * sideLength + areaWeight / 2;
    let DAy = y0 + areaWeight / 2;
    let DPy = DAy + max(.6, (heatMap.maxCOUNT - 10)/heatMap.maxCOUNT) * sideLength + areaWeight / 2;
    //let PPy = DAy;

    let DAw = min(.2, 10000 / heatMap.maxDT) * sideLength;
    let DPw = min(.4, 21000 / heatMap.maxDT) * sideLength;
    //let PPw = sideLength - DAw - 2*areaWeight;

    let DAh = DPy - y0 - 1.5*areaWeight;
    let DPh = sideLength - DAh - 2*areaWeight;
    //let PPh = sideLength - areaWeight;
    noFill();
    strokeWeight(u(10));
    stroke(0, 255, 0, 100);
    rect(DAx, DAy, DAw, DAh);

    stroke(255, 255, 0, 100);
    rect(DPx, DPy, DPw, DPh);

    pop();
}

function buildAvgLine() {
    let arr = heatMap.array;
    let s = arr.length;
    let t = 0;
    for(let i = 0; i < s; i++) {
        for(let j = 0; j < s; j++) {
            t += arr[i][j];
        }
    }
    t = t / 2;
    let t2 = 0;
    let f = false;
    let row = 0;
    for(let i = 0; i < s; i++) {
        for(let j = 0; j < s; j++) {
            t2 += arr[i][j];
            if(t2 >= t) {
                f = true;
                row = i;
                break;
            }
        }
        if (f) break;
    }
    row = 70 - row;
    push();
    strokeWeight(3);
    stroke(255);
    setLineDash([10, 10]);
    line(x0, y0 + (row / 70) * sideLength, x0 + sideLength, y0 + (row/ 70) * sideLength);
    pop();

    t2 = 0;
    f = false;
    col = 0;
    for(let i = 0; i < s; i++) {
        for(let j = 0; j < s; j++) {
            t2 += arr[j][i];
            if(t2 >= t) {
                f = true;
                col = i;
                break;
            }
        }
        if (f) break;
    }

    push();
    strokeWeight(3);
    stroke(255);
    setLineDash([10, 10]);
    line(x0 + (col / 70) * sideLength, y0, x0 + (col/ 70) * sideLength, y0 + sideLength);
    pop();

}

function buildInfo() {
    push();

    strokeWeight(u(5));
    stroke(255);
    fill(0);
    rect(x0 + margin / 2, y0 + margin / 2, sideLength - margin, sideLength / 4 - margin / 2);

    noStroke();
    fill(255);
    textSize(u(28));
    text("best allocation policies", x0 + margin / 2 + u(10), y0 + margin / 2 + u(30));

    textSize(u(20));

    let info;
    if(workload === 0) info = "1. DRAM preferred\n2. DRAM always\n3. PM preferred";
    else if(workload === 1) info = "1. PM preferred\n2. DRAM preferred\n3. DRAM always";
    else if(workload === 2) info = "1. PM preferred\n2. DRAM preferred\n3. DRAM always\n(small differences)";
    else if(workload === 3) info = "1. PM preferred\n2. DRAM preferred\n3. DRAM always\n(small differences)";
    else if(workload === 4) info = "1. PM preferred\n2-3. DRAM always, DRAM preferred (tie)";
    else if(workload === 5) info = "1. PM preferred\n2. DRAM always\n3. DRAM preferred";
    else if(workload === 6) info = "1. DRAM preferred\n2. DRAM always\n3. PM preferred\n(small differences)"
    else info = "[no info available]";

    text(info, x0 + margin / 2 + u(10), y0 + margin / 2 + u(57));

    pop();
}

function createButtons() {
    infoButton = new Button(x("l", 58), y("t", -65), u(54), u(54), "Show\ninfo", u(14), true, null);
    infoButton.action = (function() {
        showInfo = !showInfo;
        return true;
    })
    areaButton = new Button(x("l", 58), y("t", -65), u(54), u(54), "Show\nareas", u(14), false, null);
    areaButton.action = (function() {
        showAreas = !showAreas;
        return true;
    });

    zeroButton = new Button(x("l", -4), y("t", -65), u(54), u(54), "Show\nzeroes", u(14), true, null);
    zeroButton.action = (function () {
        showZeroes = !showZeroes;
        return true;
    });

    menuButton = new Button(x("r", -51), y("t", -65), u(54), u(54), "☰", u(35), true, null, true);
    menuButton.action = (function () {
        showMenu = !showMenu;
        setup();
        return true;
    });

    let buttonMargin = u(50);
    let sbx0 = x0 + buttonMargin / 2;
    let sbx1 = x0 + buttonMargin / 2 + sideLength / 2;
    let sby0 = y0 + buttonMargin / 2;
    let sby1 = y0 + buttonMargin / 2 + sideLength / 4;
    let sby2 = y0 + buttonMargin / 2 + sideLength / 2;
    let sby3 = y0 + buttonMargin / 2 + 3 * sideLength / 4;
    let sbw = sideLength / 2 - buttonMargin;
    let sbh = sideLength / 4 - buttonMargin;
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
            return true;
        });
    }
}

function createHeatMap() {
    if (workload === 0) {
        heatMap = new HeatMap(BFSmetrics, BFSmaxXMETRIC, BFSmaxYMETRIC, BFSlength);
        workloadName = "GAPBS BFS";
    } else if (workload === 1) {
        heatMap = new HeatMap(TCmetrics, TCmaxXMETRIC, TCmaxYMETRIC, TClength);
        workloadName = "GAPBS TC";
    } else if (workload === 2) {
        heatMap = new HeatMap(BTmetrics, BTmaxXMETRIC, BTmaxYMETRIC, BTlength);
        workloadName = "NAS BT";
    } else if (workload === 3) {
        heatMap = new HeatMap(LUmetrics, LUmaxXMETRIC, LUmaxYMETRIC, LUlength);
        workloadName = "NAS LU-02";
    } else if (workload === 4) {
        heatMap = new HeatMap(SPmetrics, SPmaxXMETRIC, SPmaxYMETRIC, SPlength);
        workloadName = "NAS SP"
    } else if (workload === 5) {
        heatMap = new HeatMap(PGmetrics, PGmaxXMETRIC, PGmaxYMETRIC, PGlength);
        workloadName = "SPEC pmniGhost";
    } else if (workload === 6) {
        heatMap = new HeatMap(PSMmetrics, PSMmaxXMETRIC, PSMmaxYMETRIC, PSMlength);
        workloadName = "SPEC pseismic";
    } else if (workload === 7) {
        heatMap = new HeatMap(PBmetrics, PBmaxXMETRIC, PBmaxYMETRIC, PBlength);
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

    heatMap.display(x0, y0, dimension - 2*margin);
    //buildAvgLine();


    if(showAreas) buildAreas();
    if(showInfo) buildInfo();

} window.onresize = setup;

function draw() {
    infoButton.display();
    //areaButton.display();
    zeroButton.display();
    menuButton.display();
    if (showMenu) {
        noStroke();
        fill(60, 9, 108, 15);
        rect(x0, y0, sideLength, sideLength);
        for (let i = 0; i < 8; i++) {
            selectButtons[i].display();
            selectButtons[i].shown = true;
        }
    }
}

function mouseClicked() {
    infoButton.click();
    areaButton.click();
    zeroButton.click();

    let menuClick = menuButton.click();
    let selectClick = false;
    for (let i = 0; i < 8; i++) {
        selectClick = selectClick || selectButtons[i].click();
        selectButtons[i].shown = false;
    }
    let mapHover = ((mouseX >= x0 && mouseX <= x0 + sideLength) && 
                    (mouseY >= y0 && mouseY <= y0 + sideLength));

    if(selectClick || (!menuClick && !mapHover)) {
        showMenu = false;
        setup();
    }

} window.ontouchend = mouseClicked;

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
        noStroke();

        let d = dimension / this.size;
        let len = this.size;
        let p = 2;
        let e = 2;
        let k = 1 / Math.pow(d * Math.sqrt(2) / 2, 2);
        let maxZ = 0;
        for (let y = 0; y < dimension; y += p) {
            for (let x = 0; x < dimension; x += p) {
                let z = 0;

                let i0 = Math.floor(y / d) - e;
                let j0 = Math.floor(x / d) - e;
                for (let i = i0; i <= i0 + 2 * e; i++) {
                    for (let j = j0; j <= j0 + 2 * e; j++) {
                        if (i >= 0 && i < len && j >= 0 && j < len) {
                            let n = this.array[i][j] / this.arrayMax;
                            let jx = j * d + d / 2;
                            let iy = i * d + d / 2;
                            let xPart = Math.pow(2, -k * Math.pow(x - jx, 2));
                            let yPart = Math.pow(2, -k * Math.pow(y - iy, 2));
                            z += n * xPart * yPart;
                        }
                    }
                }
                if(z > maxZ) maxZ = z;
            }
        }
        for (let y = 0; y < dimension; y += p) {
            for (let x = 0; x < dimension; x += p) {
                let z = 0;

                let i0 = Math.floor(y / d) - e;
                let j0 = Math.floor(x / d) - e;
                for (let i = i0; i <= i0 + 2 * e; i++) {
                    for (let j = j0; j <= j0 + 2 * e; j++) {
                        if (i >= 0 && i < len && j >= 0 && j < len) {
                            let n = this.array[i][j] / this.arrayMax;
                            let jx = j * d + d / 2;
                            let iy = i * d + d / 2;
                            let xPart = Math.pow(2, -k * Math.pow(x - jx, 2));
                            let yPart = Math.pow(2, -k * Math.pow(y - iy, 2));
                            z += n * xPart * yPart;
                        }
                    }
                }
                let f = getColor(z / maxZ);
                //let f = z*255;
                //stroke(f);
                fill(f);
                rect(x0 + x, y0 + dimension-y-p, p, p);
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
                    if(this.action()) return true;
                    return false;
                }
            }
        }
    }
    action() { }
}