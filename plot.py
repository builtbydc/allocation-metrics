import tcSlices
import bfsSlices
from matplotlib import colors, pyplot as plt

slices = []

length = max(len(tcSlices.tcSlice), len(bfsSlices.bfsSlice))

for i in range(length):
    slices.append([])
    if i < len(bfsSlices.bfsSlice):
        slices[i].append(bfsSlices.bfsSlice[i][0])
        slices[i].append(bfsSlices.bfsSlice[i][1])
    else:
        slices[i].append(0)
        slices[i].append(0)
    if i < len(tcSlices.tcSlice):
        slices[i].append(tcSlices.tcSlice[i][0])
        slices[i].append(tcSlices.tcSlice[i][1])
    else:
        slices[i].append(0)
        slices[i].append(0)

for i in range(length):
    if i > 0:
        slices[i][0] += slices[i-1][0]
        slices[i][1] += slices[i-1][1]
        slices[i][2] += slices[i-1][2]
        slices[i][3] += slices[i-1][3]

fig, ax = plt.subplots()
ax.plot(slices)
ax.get_lines()[0].set_color("red")
ax.get_lines()[0].set_linestyle("dashed")
ax.get_lines()[1].set_color("red")
ax.get_lines()[2].set_color("blue")
ax.get_lines()[2].set_linestyle("dashed")
ax.get_lines()[3].set_color("blue")

ax.set_title("BFS vs. TC")
ax.set_xlabel("Seconds")
ax.ticklabel_format(style="plain")
ax.legend(["BFS allocations", "BFS accesses", "TC allocations", "TC accesses"])
plt.show()
