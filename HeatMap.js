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
        let halfD = d / 2;
        let len = this.size;

        let copy = []
        for(let i = 0; i < len; i++) {
            copy[i] = [];
            for(let j = 0; j < len; j++) {
                if(this.array[i][j] > 0) copy[i][j] = Math.log2(this.array[i][j]);
            }
        }

        let p = 1;
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
                            if(copy[i][j] > 0) {
                                let n = copy[i][j];
                                let jx = j * d + halfD;
                                let iy = i * d + halfD;
                                let xPart = Math.pow(2, -k * Math.pow(x - jx, 2));
                                let yPart = Math.pow(2, -k * Math.pow(y - iy, 2));
                                z += n * xPart * yPart;
                            }
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
                            if(copy[i][j] > 0) {
                                let n = copy[i][j];
                                let jx = j * d + halfD;
                                let iy = i * d + halfD;
                                let xPart = Math.pow(2, -k * Math.pow(x - jx, 2));
                                let yPart = Math.pow(2, -k * Math.pow(y - iy, 2));
                                z += n * xPart * yPart;
                            }
                        }
                    }
                }
                z = z / maxZ;
                
                let f;
                if (z > 0.004) {
                    f = getColor(z);
                    //f = z * 255;
                    stroke(f);
                    fill(f);
                    rect(x0 + x, y0 + dimension - y - p, p, p);
                    
                }
                
                
            }
        }
        noStroke();
        if(showZeroes) {
            for(let i = 0; i < len; i++) {
                for(let j = 0; j < len; j++) {
                    if(this.array[i][j] == 0) {
                        fill(100, 90, 40);
                        rect(x0 + j*d + d/4, y0 + (len - i - 1) * d + d/4, d/2, d/2, d/4);
                    }
                }
            }
        }
    }

}

let heatMap;
let workload = 0;
let workloadName;
let linear = false;

function createHeatMap() {
    if (workload === 0) {
        if(linear)
            heatMap = new HeatMap(BFSmetricsLinear, BFSmaxXMETRICLinear, BFSmaxYMETRICLinear, BFSlengthLinear);
        else
            heatMap = new HeatMap(BFSmetrics, BFSmaxXMETRIC, BFSmaxYMETRIC, BFSlength);
        workloadName = "GAPBS BFS";
    } else if (workload === 1) {
        if(linear)
            heatMap = new HeatMap(TCmetricsLinear, TCmaxXMETRICLinear, TCmaxYMETRICLinear, TClengthLinear);
        else
            heatMap = new HeatMap(TCmetrics, TCmaxXMETRIC, TCmaxYMETRIC, TClength);
        workloadName = "GAPBS TC";
    } else if (workload === 2) {
        if(linear)
            heatMap = new HeatMap(BTmetricsLinear, BTmaxXMETRICLinear, BTmaxYMETRICLinear, BTlengthLinear);
        else
            heatMap = new HeatMap(BTmetrics, BTmaxXMETRIC, BTmaxYMETRIC, BTlength);
        workloadName = "NAS BT";
    } else if (workload === 3) {
        if(linear)
            heatMap = new HeatMap(LUmetricsLinear, LUmaxXMETRICLinear, LUmaxYMETRICLinear, LUlengthLinear);
        else
            heatMap = new HeatMap(LUmetrics, LUmaxXMETRIC, LUmaxYMETRIC, LUlength);
        workloadName = "NAS LU-02";
    } else if (workload === 4) {
        if(linear)
            heatMap = new HeatMap(SPmetricsLinear, SPmaxXMETRICLinear, SPmaxYMETRICLinear, SPlengthLinear);
        else
            heatMap = new HeatMap(SPmetrics, SPmaxXMETRIC, SPmaxYMETRIC, SPlength);
        workloadName = "NAS SP"
    } else if (workload === 5) {
        if(linear)
            heatMap = new HeatMap(PGmetricsLinear, PGmaxXMETRICLinear, PGmaxYMETRICLinear, PGlengthLinear);
        else
            heatMap = new HeatMap(PGmetrics, PGmaxXMETRIC, PGmaxYMETRIC, PGlength);
        workloadName = "SPEC pmniGhost";
    } else if (workload === 6) {
        if(linear)
            heatMap = new HeatMap(PSMmetricsLinear, PSMmaxXMETRICLinear, PSMmaxYMETRICLinear, PSMlengthLinear);
        else
            heatMap = new HeatMap(PSMmetrics, PSMmaxXMETRIC, PSMmaxYMETRIC, PSMlength);
        workloadName = "SPEC pseismic";
    } else if (workload === 7) {
        if(linear)
            heatMap = new HeatMap(PBmetricsLinear, PBmaxXMETRICLinear, PBmaxYMETRICLinear, PBlengthLinear);
        else
            heatMap = new HeatMap(PBmetrics, PBmaxXMETRIC, PBmaxYMETRIC, PBlength);
        workloadName = "SPEC pilbdc"
    }
}