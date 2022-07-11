let font;
function preload() {
    font = loadFont("./font/DejaVuSans.ttf");
}

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
    stroke(0);
    rect(x("l", -4), y("t", -4), sideLength + u(8), sideLength + u(8));

    textSize(u(21));
    textAlign(CENTER);
    strokeWeight(0.5);
    fill(0);
    let counter = heatMap.size;
    if(linear) {
        for(let yt = y0; yt < y0 + sideLength + 1; yt += sideLength / heatMap.size) {
            if(counter % 10 === 0) {
                line(x0 - u(17), yt, x0 - u(5), yt);

                push();
                noStroke();
                translate(x0 - u(20), yt);
                rotate(radians(-90));
                let num = counter * heatMap.maxCOUNT / heatMap.size;
                text(sne(num), 0, 0);
                pop();
            } else
                line(x0 - u(11), yt, x0 - u(5), yt);
            counter--;
        }
    } else {
        let max = Math.pow(heatMap.maxCOUNT, 4);
        let delta = max / 70;
        let counter = 0;
        for(let i = 0; i < max; i += delta) {
            let yt = y0 + sideLength - Math.pow(i, 1/4) / heatMap.maxCOUNT * sideLength;
            if(counter % 10 == 0) {
                line(x("l", -17), yt, x("l", -5), yt);

                push();
                noStroke();
                translate(x("l", -20), yt);
                rotate(radians(-90));
                if(counter != 30 && counter != 50 && counter != 60) text(sne(i), 0, 0);
                pop();
            } else {
                line(x0 - u(11), yt, x0 - u(5), yt);
            }
            counter++;
        }
    }

    counter = 0;
    for(let xt = x0; xt < x0 + sideLength + 1; xt += sideLength / heatMap.size) {
        if(counter % 10 === 0) {
            line(xt, y("b", -17), xt, y("b", -5));

            push();
            noStroke();
            text(dig3(counter * (heatMap.maxDT / heatMap.size) / 1000000) + " M", xt, y("b", -36));
            pop();
        } else
            line(xt, y("b", -11), xt, y("b", -5));
        counter++;
    }
    
    textSize(u(32));
    noStroke();

    push();
    translate(x("l", -63), y0 + sideLength / 2);
    rotate(radians(-90));
    text("Importance [no. Accesses / avg. Reuse Distance]", 0, 0);
    pop();

    text("Distance [allocation to first access]", x0 + sideLength / 2, y("b", -80));

    textSize(u(35));
    text(workloadName, x0 + sideLength / 2, y("t", -23));

    pop();
}

function buildGradient() {
    push();

    strokeWeight(2);
    let gradientTopEdge = y("t", 50);
    let gradientHeight = sideLength - u(102);
    for (let i = gradientTopEdge; i < gradientTopEdge + gradientHeight; i++) {
        let val = i - gradientTopEdge;
        stroke(getColor(1 - (val / gradientHeight)));
        line(x("r", -30), i, x("r", -70), i);
    }

    noStroke();
    fill(0);
    textSize(u(21));
    textAlign(CENTER);
    text("more\npages", x("r", -50), y("t", 10));
    text("less\npages", x("r", -50), y("b", 27));

    pop();
}

function buildInfo() {
    push();

    strokeWeight(u(4));
    stroke(0);
    fill(255);
    rect(x("l", 50), y("t", 50), sideLength - margin, sideLength / 4 - margin / 2);

    noStroke();
    fill(0);
    textSize(u(28));
    text("best allocation policies", x("l", 60), y("t", 80));

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

    text(info, x("l", 60), y("t", 107));

    pop();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    textFont(font);

    setConstants();

    createButtons();
    createHeatMap();

    buildAxes();
    buildGradient();

    heatMap.display(x0, y0, sideLength);

    if(showInfo) buildInfo();

} window.onresize = setup;

function draw() {
    // infoButton.display();
    // zeroButton.display();
    // linearButton.display();
    // menuButton.display();

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
    // infoButton.click();
    // zeroButton.click();
    // linearButton.click();

    // let menuClick = menuButton.click();
    // let selectClick = false;
    // for (let i = 0; i < 8; i++) {
    //     selectClick = selectClick || selectButtons[i].click();
    //     selectButtons[i].shown = false;
    // }
    // let mapHover = ((mouseX >= x0 && mouseX <= x0 + sideLength) && 
    //                 (mouseY >= y0 && mouseY <= y0 + sideLength));

    // if(selectClick || (!menuClick && !mapHover)) {
    //     showMenu = false;
    //     setup();
    // }

    workload++;
    workload %= 8;
    setup();
} window.ontouchend = mouseClicked;