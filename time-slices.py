import sys
import json

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

maxTIME = 0
for lst in L:
    if (lst[len(lst) - 1] > maxTIME) & (lst[len(lst) - 1] < 36000000):
        maxTIME = lst[len(lst) - 1]

slices = []
for i in range(maxTIME // 1000 + 1):
    slices.append([])
    for j in range(2):
        slices[i].append(0)

for lst in L:
    for i in range(len(lst)):
        if i == 0:
            if lst[i] < 36000000:
                slices[lst[i] // 1000][0] += 1
        else:
            if lst[i] < 36000000:
                slices[lst[i] // 1000][1] += 1

print(slices)