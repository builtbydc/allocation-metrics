lst = [1, 2, 3, 4, 5]

for i in range(len(lst)):
    print(i)
    if(lst[i] == 2):
        lst.pop(i)
        i -= 1