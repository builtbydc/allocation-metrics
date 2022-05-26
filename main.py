import sys
import os
import json

# open file
with open(sys.argv[1]) as f:
    file = f.read()

# convert file to dictionary
accessDict = json.loads(file)

workload = sys.argv[2]

# place all values in L
L = []
for key in accessDict:
    L.append(accessDict[key])

# ensure every access time is an integer
for lst in L:
    for i in range(len(lst)):
        lst[i] = int(lst[i])

# remove duplicates and sort
for i in range(len(L)):
    L[i] = set(L[i])
    L[i] = list(L[i])
    L[i].sort()
L.sort()

# zero-index the access times
minTime = L[0][0]
for lst in L:
    for i in range(len(lst)):
        lst[i] -= minTime

maxTIME = 0
for lst in L:
    if(lst[len(lst) - 1] > maxTIME):
        maxTIME = lst[len(lst) - 1]

maxTIME += 1
tr = 1000000
gradient = []

for i in range(tr):
    gradient.append([])
    gradient[i].append(0)
    gradient[i].append(0)

for lst in L:
    for t in lst:
        i = int(tr * t / maxTIME)
        gradient[i][1] += 1

gradTotal = 0
for i in range(tr):
    gradient[i][0] = gradTotal
    gradTotal += gradient[i][1]

def use(t):
    i = int(tr * t / maxTIME)
    return gradient[i][0] + 0.5*gradient[i][1]

for lst in L:
    for i in range(len(lst)):
        lst[i] = use(lst[i])

xmetric = []
ymetric = []
for lst in L:
    if(len(lst) > 1):
        xmetric.append(lst[1] - lst[0])
        
        it = 1
        total = 0
        v = len(lst) - 1
        for i in range(v - 1):
            total += (lst[it+1] - lst[it])
        if total == 0:
            ymetric.append(0)
        else:
            ymetric.append(pow((v-1)*v / total, 1/4))


maxXMETRIC = 2800000
maxYMETRIC = 0.28

res = 70.0
unitXMETRIC = maxXMETRIC / res
unitYMETRIC = maxYMETRIC / res

# populate grid
grid = []
for i in range(int(res)):
    grid.append([])
    for j in range(int(res)):
        grid[i].append(0)

for i in range(len(xmetric)):
    if (xmetric[i] < maxXMETRIC) & (ymetric[i] < maxYMETRIC):
        x = int(xmetric[i] / unitXMETRIC)
        y = int(ymetric[i] / unitYMETRIC)
        grid[y][x] += 1

# create metrics
metrics = []
for lineIndex in range(len(grid)):
    line = grid[lineIndex]
    outLine = "\t["
    for i in range(len(line) - 1):
        outLine += str(line[i]) + ", "
    outLine += str(line[len(line) - 1]) + "]"
    if(lineIndex < len(grid) - 1):
        outLine += ", "
    outLine += "\n"
    metrics.append(outLine)

# write file
filename = workload + "-metrics.js"
try:
    os.remove(filename)
except:
    except_temp = 0
    
mfile = open(filename, "w")
mfile.write("let " + workload + "length = " + str(maxTIME) + ";\n")
mfile.write("let " + workload + "maxXMETRIC = " + str(maxXMETRIC) + ";\n")
mfile.write("let " + workload + "maxYMETRIC = " + str(maxYMETRIC) + ";\n")
mfile.write("const " + workload + "metrics = [\n")
mfile.writelines(metrics)
mfile.write("];")
mfile.close()

