import math
import sys
import os
import json
import matplotlib.pyplot as plt
import matplotlib.ticker as mtick

# open file
with open(sys.argv[1]) as f:
    file = f.read()

# convert file to dictionary
accessDict = json.loads(file)

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
        
maxTime = 0
for lst in L:
    if len(lst) > 1:
        if lst[len(lst) - 1] > maxTime:
            maxTime = lst[len(lst) - 1]
    elif len(lst) == 1:
        if lst[0] > maxTime:
            maxTime = lst[0]
        

        
dt = []
dt2 = []
count = []
count2 = []
for lst in L:
    if(len(lst) > 1):
        dt.append(lst[1] - lst[0])
        dt2.append(lst[1] - lst[0])
        count.append(len(lst) - 1)
        count2.append(len(lst) - 1)
        
dt2.sort()
count2.sort()
num2 = len(dt2)
trim = 0.01
trimN = int(trim*num2)
maxDT = dt2[num2 - trimN] + 1
maxCOUNT = count2[num2 - trimN] + 1

toRemove = 0
print("prob1")
for i in range(num2):
    if (dt[i] > maxDT) | (count[i] > maxCOUNT):
        dt[i] = -1
        count[i] = -1
        toRemove += 1

print("prob2")
    
print("prob3")
maxDT = max(dt) + 1
maxCOUNT = max(count) + 1

grid = []
res = maxCOUNT
for i in range(res):
    grid.append([])
    for j in range(res):
        grid[i].append(0)

unitDT = maxDT / (res + 0.0)
unitCOUNT = maxCOUNT / (res + 0.0)

for i in range(len(dt)):
    if (dt[i] != -1) & (count[i] != -1):
        x = int(dt[i] / unitDT)
        y = int(count[i] / unitCOUNT)
        grid[y][x] += 1


metrics = []
# for i in range(len(B)-1):
#     metrics.append("\t[" + str(y1[i]) + ", " + str(y2[i]) + 
#                    ", " + str(y3[i]) + ", " + str(y4[i]) + "],\n")
# metrics.append("\t[" + str(y1[len(B)-1]) + ", " + str(y2[len(B)-1]) + 
#                    ", " + str(y3[len(B)-1]) + ", " + str(y4[len(B)-1]) + "]\n")
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
        
filename = sys.argv[3] + "-metrics.js"
try:
    os.remove(filename)
except:
    except_temp = 0
    
mfile = open(filename, "w")
mfile.write("let " + sys.argv[3] + "length = " + str(maxTime) + ";\n")
mfile.write("let " + sys.argv[3] + "maxDT = " + str(maxDT) + ";\n")
mfile.write("let " + sys.argv[3] + "maxCOUNT = " + str(maxCOUNT) + ";\n")
mfile.write("const " + sys.argv[3] + "metrics = [\n")
mfile.writelines(metrics)
mfile.write("];")
mfile.close()