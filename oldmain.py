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

maxTime = L[len(L) - 1][0]

lenB = 1600
ivl = math.ceil(maxTime / lenB)

# initialize B
B = []
for i in range(lenB):
    B.append([])

# fill B
for lst in L:
    index = int(lst[0] / ivl)
    if index >= len(B):  # should not happen
        B.append([])
    B[int(lst[0] / ivl)].append(lst)

# initialize ys
y1 = []
y2 = []
y3 = []
y4 = []
for i in range(len(B)):
    y1.append(0)
    y2.append(0)
    y3.append(0)
    y4.append(0)

    lst = B[i]
    y1[i] = len(lst)  # number of allocations

    if len(lst) > 0:
        mult = 0
        for page in lst:
            if len(page) > 1:
                mult += 1
        y2[i] = mult / len(lst)  # percentage of re-accessed pages

        total = 0
        count = 0
        for page in lst:
            if len(page) > 1:
                count += 1
                total += (page[1] - page[0])
        if count > 0:
            y3[i] = total / count  # avg. time until re-access

        total = 0
        count = 0
        for page in lst:
            if len(page) > 1:
                count += 1
                total += (len(page) - 1)
        if count > 0:
            y4[i] = total / count # avg. number of re-accesses

# fig, ax = plt.subplots(2, 2, figsize=[14, 7])

# fig.suptitle(sys.argv[3])

# ax[0, 0].plot(y1, linewidth=1)
# ax[0, 0].set_ylabel("Number of allocations in time window")

# ax[1, 0].plot(y2, linewidth=1)
# ax[1, 0].set_ylabel("Percentage of pages re-accessed\n[pages allocated in this window]")
# ax[1, 0].yaxis.set_major_formatter(mtick.PercentFormatter(1.0))

y3[len(y3)-1] = 0  # bug fix
# ax[0, 1].plot(y3, linewidth=1)
# ax[0, 1].set_ylabel("Average time until first re-access (ms)\n[re-accessed pages only]")

# ax[1, 1].plot(y4, linewidth=1)
# ax[1, 1].set_ylabel("Average number of re-accesses\n[re-accessed pages only]")

# ax[0, 0].set_xlabel("Time Window IDs [unit: workload duration / " + str(lenB) + "]")
# ax[0, 1].set_xlabel("Time Window IDs [unit: workload duration / " + str(lenB) + "]")
# ax[1, 0].set_xlabel("Time Window IDs [unit: workload duration / " + str(lenB) + "]")
# ax[1, 1].set_xlabel("Time Window IDs [unit: workload duration / " + str(lenB) + "]")

# plt.tight_layout(pad=2)
# plt.savefig(sys.argv[2])

metrics = []
for i in range(len(B)-1):
    metrics.append("\t[" + str(y1[i]) + ", " + str(y2[i]) + 
                   ", " + str(y3[i]) + ", " + str(y4[i]) + "],\n")
metrics.append("\t[" + str(y1[len(B)-1]) + ", " + str(y2[len(B)-1]) + 
                   ", " + str(y3[len(B)-1]) + ", " + str(y4[len(B)-1]) + "]\n")

filename = sys.argv[3] + "-metrics.js"
try:
    os.remove(filename)
except:
    except_temp = 0
    
mfile = open(filename, "w")
mfile.write("const " + sys.argv[3] + "metrics = [\n")
mfile.writelines(metrics)
mfile.write("]")
mfile.close()