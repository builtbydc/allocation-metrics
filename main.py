import math
import sys
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

lenB = 512
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

fig, ax = plt.subplots(2, 2)

ax[0, 0].plot(y1, linewidth=1)
ax[0, 0].set_title("Number of allocations in time window")

ax[1, 0].plot(y2, linewidth=1)
ax[1, 0].set_title("Percentage of pages re-accessed\n[pages allocated in this window]")
ax[1, 0].yaxis.set_major_formatter(mtick.PercentFormatter(1.0))

y3[len(y3)-1] = 0  # bug fix
ax[0, 1].plot(y3, linewidth=1)
ax[0, 1].set_title("Average time until first re-access\n[re-accessed pages only]")

ax[1, 1].plot(y4, linewidth=1)
ax[1, 1].set_title("Average number of re-accesses\n[re-accessed pages only]")

ax[0, 0].set_xlabel("Time Window IDs [unit: workload duration / " + str(lenB) + "]")
ax[0, 1].set_xlabel("Time Window IDs [unit: workload duration / " + str(lenB) + "]")
ax[1, 0].set_xlabel("Time Window IDs [unit: workload duration / " + str(lenB) + "]")
ax[1, 1].set_xlabel("Time Window IDs [unit: workload duration / " + str(lenB) + "]")

fig.suptitle(sys.argv[2])
fig.tight_layout()
plt.show()

metrics = {}
for i in range(len(B)):
    metrics["window" + str(i)] = [y1[i], y2[i], y3[i], y4[i]]

# print(metrics)

