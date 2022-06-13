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
        strokeWeight(u(2));
        rect(this.x, this.y, this.w, this.h, u(4));
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

let infoButton;
let showInfo = false;
let zeroButton;
let showZeroes = false;
let menuButton;
let showMenu = false;
let selectButtons = [];

function createButtons() {
    infoButton = new Button(x("l", 58), y("t", -65), u(54), u(54), "Show\ninfo", u(14), true, null);
    infoButton.action = (function() {
        showInfo = !showInfo;
        return true;
    });

    zeroButton = new Button(x("l", -4), y("t", -65), u(54), u(54), "Show\nzeroes", u(14), true, null);
    zeroButton.action = (function () {
        showZeroes = !showZeroes;
        return true;
    });

    menuButton = new Button(x("r", 51), y("t", -65), u(54), u(54), "☰", u(35), true, null, true);
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