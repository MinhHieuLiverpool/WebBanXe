# Nhập điểm
diem_list = []
print("Nhập điểm các môn học (kết thúc bằng -1): ")
while True:
    diem = int(input())
    if diem == -1:
        break

    diem_list.append(diem)

# Tính điểm trung bình
dtb = sum(diem_list) / len(diem_list) if len(diem_list) > 0 else 0

# Tính xếp loại
if dtb < 4:
    print("Xếp loại: F")
elif dtb < 5.5:
    print("Xếp loại: D")
elif dtb < 7.0:
    print("Xếp loại: C")
elif dtb < 8.5:
    print("Xếp loại: B")
else:
    print("Xếp loại: A")
