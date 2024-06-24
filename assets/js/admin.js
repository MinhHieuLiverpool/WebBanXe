
function checkLogin() {
    let currentUser = JSON.parse(localStorage.getItem("currentuser"));
    if(currentUser == null || currentUser.userType == 0) {
        document.querySelector("body").innerHTML = `
        <div class="access-denied-section">
            <img class="access-denied-img" src="./assets/img/access-denied.webp" alt="">
        </div>`
    } else {
        document.getElementById("name-acc").innerHTML = currentUser.fullname;
    }
}
window.onload = checkLogin();

//Đóng mở sidebar
const menuIconButton = document.querySelector(".menu-icon-btn");
const sidebar = document.querySelector(".sidebar");
const content = document.querySelector(".content");
menuIconButton.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    content.classList.toggle("active");
});

// tab for section
const sidebars = document.querySelectorAll(".sidebar-list-item.tab-content");
const sections = document.querySelectorAll(".section");

for(let i = 0; i < sidebars.length; i++) {
    sidebars[i].onclick = function () {
        document.querySelector(".sidebar-list-item.active").classList.remove("active");
        document.querySelector(".section.active").classList.remove("active");
        sidebars[i].classList.add("active");
        sections[i].classList.add("active");
    };
}

const closeBtn = document.querySelectorAll('.section');
console.log(closeBtn[0])
for(let i=0;i<closeBtn.length;i++){
    closeBtn[i].addEventListener('click',(e) => {
        sidebar.classList.add("active");
        content.classList.add("active");
    })
}





// Hiển thị số lượng sản phẩn (lấy tù storage)
function getAmoumtProduct() {
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
    return products.length;
}

// Hiển thị số lượng user (lấy tù storage)
function getAmoumtUser() {
    let accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : [];
    return accounts.filter(item => item.userType == 0).length;
}

// Hiển thị số lượng doanh thu (lấy từ storage)
function getMoney() {
    let tongtien = 0;
    let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    orders.forEach(item => {
        tongtien += item.tongtien
    });
    return tongtien;
}

document.getElementById("amount-user").innerHTML = getAmoumtUser();
document.getElementById("amount-product").innerHTML = getAmoumtProduct();
document.getElementById("statistics").innerHTML = vnd(getMoney());

// Doi sang dinh dang tien VND
function vnd(price) {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

// Phân trang 
let perPage = 12;
let currentPage = 1;
let totalPage = 0;
let perProducts = [];

function displayList(productAll, perPage, currentPage) {
    let start = (currentPage - 1) * perPage;
    let end = (currentPage - 1) * perPage + perPage;
    let productShow = productAll.slice(start, end);
    showProductArr(productShow);
}

function setupPagination(productAll, perPage) {
    document.querySelector('.page-nav-list').innerHTML = '';
    let page_count = Math.ceil(productAll.length / perPage);
    for (let i = 1; i <= page_count; i++) {
        let li = paginationChange(i, productAll, currentPage);
        document.querySelector('.page-nav-list').appendChild(li);
    }
}

function paginationChange(page, productAll, currentPage) {
    let node = document.createElement(`li`);
    node.classList.add('page-nav-item');
    node.innerHTML = `<a href="#">${page}</a>`;
    if (currentPage == page) node.classList.add('active');
    node.addEventListener('click', function () {
        currentPage = page;
        displayList(productAll, perPage, currentPage);
        let t = document.querySelectorAll('.page-nav-item.active');
        for (let i = 0; i < t.length; i++) {
            t[i].classList.remove('active');
        }
        node.classList.add('active');
    })
    return node;
}

// Hiển thị danh sách sản phẩm 
function showProductArr(arr) {
    let productHtml = "";
    if(arr.length == 0) {
        productHtml = `<div class="no-result"><div class="no-result-i"><i class="fa fa-home"></i></div><div class="no-result-h">Không có sản phẩm để hiển thị</div></div>`;
    } else {
        arr.forEach(product => {
            let btnCtl = product.status == 1 ? 
            `<button class="btn-delete" onclick="deleteProduct(${product.id})"><i class="fa fa-trash"></i></button>` :
            `<button class="btn-delete" onclick="changeStatusProduct(${product.id})"><i class="fa fa-pencil"></i></button>`;
            productHtml += `
            <div class="list">
                <div class="list-left">
                    <img src="${product.img}" alt="">
                    <div class="list-info">
                        <h4>${product.title}</h4>
                        <p class="list-brand">Hãng xe: ${product.brand}</p>
                        <p class="list-style">Kiểu dáng: ${product.style}</p>
                        <p class="list-desc">${product.desc}</p> 
                    </div>
                </div>

                <div class="list-right">
                    <div class="list-price">
                        <span class="list-current-price">${vnd(product.price)}</span>                   
                    </div>
                    <div class="list-control">
                        <div class="list-tool">
                            <button class="btn-edit" onclick="editProduct(${product.id})"><i class="fas fa-edit"></i></button>${btnCtl}
                        </div>                       
                    </div>
                </div> 
            </div>`;
        });
    }
    document.getElementById("show-product").innerHTML = productHtml;
}


// Hiển thị sản phẩm khi lọc tìm kiếm
function showProduct() {
  let selectStyle = document.getElementById("style-search").value;
  let selectBrand = document.getElementById("brand-search").value;
  let valeSearchInput = document.getElementById("form-search-product").value;
  let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")): [];

  result = products.filter((item) => {
    const matchStyle = selectStyle === "Tất cả" || item.style === selectStyle;
    const matchBrand = selectBrand === "Tất cả" || item.brand === selectBrand;

    return item.status === 1 && matchStyle && matchBrand;
  });

    result = valeSearchInput == "" ? result : result.filter((item) => {
        return item.title.toString().toUpperCase().includes(valeSearchInput.toString().toUpperCase());
        });

  displayList(result, perPage, currentPage);
  setupPagination(result, perPage, currentPage);
}

function cancelSearchProduct() {
  let products = localStorage.getItem("products")
    ? JSON.parse(localStorage.getItem("products")).filter(
        (item) => item.status == 1
      )
    : [];
  document.getElementById("style-search").value = "Tất cả";
  document.getElementById("brand-search").value = "Tất cả";
  document.getElementById("form-search-product").value = "";
  displayList(products, perPage, currentPage);
  setupPagination(products, perPage, currentPage);
}


window.onload = showProduct();

// tạo id cho sản phẩm
function createId(arr) {
    let id = arr.length;
    let check = arr.find((item) => item.id == id);
    while (check != null) {
        id++;
        check = arr.find((item) => item.id == id);
    }
    return id;
}


// Xóa sản phẩm 
function deleteProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    let index = products.findIndex(item => {
        return item.id == id;
    })
    if (confirm("Bạn có chắc muốn xóa?") == true) {
        products[index].status = 0;
        toast({ title: 'Success', message: 'Xóa sản phẩm thành công !', type: 'success', duration: 2000 });
    }
    localStorage.setItem("products", JSON.stringify(products));
    showProduct();
}

function changeStatusProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    let index = products.findIndex(item => {
        return item.id == id;
    })
    if (confirm("Bạn có chắc chắn muốn hủy xóa?") == true) {
        products[index].status = 1;
        toast({ title: 'Success', message: 'Khôi phục sản phẩm thành công !', type: 'success', duration: 2000 });
    }
    localStorage.setItem("products", JSON.stringify(products));
    showProduct();
}

var indexCur;
function editProduct(id) {
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
    let index = products.findIndex(item => {
        return item.id == id;
    })
    indexCur = index;
    document.querySelectorAll(".add-product-e").forEach(item => {
        item.style.display = "none";
    })
    document.querySelectorAll(".edit-product-e").forEach(item => {
        item.style.display = "block";
    })
    document.querySelector(".add-product").classList.add("open");
    //
    document.querySelector(".upload-image-preview").src = products[index].img;
    document.getElementById("up-name").value = products[index].title;
    document.getElementById("up-price").value = products[index].price;
    document.getElementById("up-desc").value = products[index].desc;
    document.getElementById("up-brand").value = products[index].brand;
}

function getPathImage(path) {
    let patharr = path.split("/");
    return "/assets/image/" + patharr[patharr.length - 1];
}

let btnUpdateProductIn = document.getElementById("update-product-button");
btnUpdateProductIn.addEventListener("click", (e) => {
    e.preventDefault();
    let products = JSON.parse(localStorage.getItem("products"));
    let idProduct = products[indexCur].id;
    let imgProduct = products[indexCur].img;
    let titleProduct = products[indexCur].title;
    let curProduct = products[indexCur].price;
    let descProduct = products[indexCur].desc;
    let brandProduct = products[indexCur].brand;
    let imgProductCur = getPathImage(document.querySelector(".upload-image-preview").src)
    let titleProductCur = document.getElementById("up-name").value;
    let curProductCur = document.getElementById("up-price").value;
    let descProductCur = document.getElementById("up-desc").value;
    let brandText = document.getElementById("up-brand").value;
    let styleText = document.getElementById("up-style").value;

    if (imgProductCur != imgProduct || titleProductCur != titleProduct || curProductCur != curProduct || descProductCur != descProduct || brandText != brandProduct) {
        let productadd = {
          id: idProduct,
          title: titleProductCur,
          img: imgProductCur,
          brand: brandText,
          style: styleText,
          price: parseInt(curProductCur),
          desc: descProductCur,
          status: 1,
        };
        products.splice(indexCur, 1);
        products.splice(indexCur, 0, productadd);
        localStorage.setItem("products", JSON.stringify(products));
        toast({ title: "Success", message: "Sửa sản phẩm thành công!", type: "success", duration: 2000, });
        setDefaultValue();
        document.querySelector(".add-product").classList.remove("open");
        showProduct();
    } else {
        toast({ title: "Warning", message: "Sản phẩm của bạn không thay đổi!", type: "warning", duration: 2000, });
    }
});

let btnAddProductIn = document.getElementById("add-product-button");
btnAddProductIn.addEventListener("click", (e) => {
    e.preventDefault();
    let imgProduct = getPathImage(document.querySelector(".upload-image-preview").src)
    let tenMon = document.getElementById("up-name").value;
    let price = document.getElementById("up-price").value;
    let moTa = document.getElementById("up-desc").value;
    let brandText = document.getElementById("up-brand").value;
    let styleText = document.getElementById("up-style").value;
    if(tenMon == "" || price == "" || moTa == "") {
        toast({ title: "Chú ý", message: "Vui lòng nhập đầy đủ thông tin món!", type: "warning", duration: 2000, });
    } else {
        if(isNaN(price)) {
            toast({ title: "Chú ý", message: "Giá phải ở dạng số!", type: "warning", duration: 2000, });
        } else {
            let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
            let product = {
              id: createId(products),
              title: tenMon,
              img: imgProduct,
              brand: brandText,
              style: styleText,
              price: parseInt(price),
              desc: moTa,
              status: 1,
            };
            products.unshift(product);
            localStorage.setItem("products", JSON.stringify(products));
            showProduct();
            document.querySelector(".add-product").classList.remove("open");
            toast({ title: "Success", message: "Thêm sản phẩm thành công!", type: "success", duration: 2000});
            setDefaultValue();
        }
    }
});

document.querySelector(".modal-close.product-form").addEventListener("click",() => {
    setDefaultValue();
})

function setDefaultValue() {
    document.querySelector(".upload-image-preview").src = "/assets/image/add-car.png";
    document.getElementById("up-name").value = "";
    document.getElementById("up-price").value = "";
    document.getElementById("up-desc").value = "";
    document.getElementById("up-brand").value = "";
}

// Open Popup Modal
let btnAddProduct = document.getElementById("btn-add-product");
btnAddProduct.addEventListener("click", () => {
    document.querySelectorAll(".add-product-e").forEach(item => {
        item.style.display = "block";
    })
    document.querySelectorAll(".edit-product-e").forEach(item => {
        item.style.display = "none";
    })
    document.querySelector(".add-product").classList.add("open");
});

// Close Popup Modal
let closePopup = document.querySelectorAll(".modal-close");
let modalPopup = document.querySelectorAll(".modal");

for (let i = 0; i < closePopup.length; i++) {
    closePopup[i].onclick = () => {
        modalPopup[i].classList.remove("open");
    };
}

// On change Image

function uploadImage(el) {
    let path = "/assets/image/" + el.value.split("\\")[2];
    document.querySelector(".upload-image-preview").setAttribute("src", path);
}


// Delete Image
document.getElementById("delete-image").addEventListener("click", () => {
    document.querySelector(".upload-image-preview").src = "/assets/image/add-car.png";

});


// Đổi trạng thái đơn hàng
function changeStatus(id, el) {
    let orders = JSON.parse(localStorage.getItem("order"));
    let order = orders.find((item) => {
        return item.id == id;
    });
    order.trangthai = 1;
    el.classList.remove("btn-check-not-done");
    el.classList.add("btn-check-done");
    el.innerHTML = "Đã xử lý";
    localStorage.setItem("order", JSON.stringify(orders));
    findOrder(orders);
}

// Format Date
function formatDate(date) {
    let fm = new Date(date);
    let yyyy = fm.getFullYear();
    let mm = fm.getMonth() + 1;
    let dd = fm.getDate();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    return dd + "/" + mm + "/" + yyyy;
}

// Show order
function showOrder(arr) {
    let orderHtml = "";
    if(arr.length == 0) {
        orderHtml = `<td colspan="6">Không có dữ liệu</td>`
    } else {
        arr.forEach((item) => {
            let status = item.trangthai == 0 ? `<span class="fa fa-times check-not-done" > Chưa xử lý</span>` : `<span class="fa fa-check check-done">Đã xử lý</span>`;
            let date = formatDate(item.thoigiandat);
            orderHtml += `
            <tr>
            <td>${item.id}</td>
            <td>${item.khachhang}</td>
            <td>${date}</td>
            <td>${vnd(item.tongtien)}</td>                               
            <td>${status}</td>
            <td class="control">
            <button class="btn-detail" id="" onclick="detailOrder('${item.id}')"><i class="	fa fa-eye"></i> Chi tiết</button>
            </td>
            </tr>      
            `;
        });
    }
    document.getElementById("showOrder").innerHTML = orderHtml;
}

let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
window.onload = showOrder(orders);

// Get Order Details
function getOrderDetails(madon) {
    let orderDetails = localStorage.getItem("orderDetails") ?
        JSON.parse(localStorage.getItem("orderDetails")) : [];
    let ctDon = [];
    orderDetails.forEach((item) => {
        if (item.madon == madon) {
            ctDon.push(item);
        }
    });
    return ctDon;
}

// Show Order Detail
function detailOrder(id) {
    document.querySelector(".modal.detail-order").classList.add("open");
    let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    let products = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("products")) : [];
    // Lấy hóa đơn 
    let order = orders.find((item) => item.id == id);
    // Lấy chi tiết hóa đơn
    let ctDon = getOrderDetails(id);
    let spHtml = `<div class="modal-detail-left"><div class="order-item-group">`;

    ctDon.forEach((item) => {
        let detaiSP = products.find(product => product.id == item.id);
        spHtml += `<div class="order-product">
            <div class="order-product-left">
                <img src="${detaiSP.img}" alt="">
                <div class="order-product-info">
                    <h4>${detaiSP.title}</h4>
                    <p class="order-product-quantity">Số lượng: ${item.soluong}<p>
                </div>
            </div>
            <div class="order-product-right">
                <div class="order-product-price">
                    <span class="order-product-current-price">${vnd(item.price)}</span>
                </div>                         
            </div>
        </div>`;
    });
    spHtml += `</div></div>`;
    spHtml += `<div class="modal-detail-right">
        <ul class="detail-order-group">
            <li class="detail-order-item">
                <span class="detail-order-item-left"><i class="fa fa-calendar"></i> Ngày đặt hàng</span>
                <span class="detail-order-item-right">${formatDate(order.thoigiandat)}</span>
            </li>
            <li class="detail-order-item">
                <span class="detail-order-item-left"><i class="fa fa-truck"></i> Hình thức giao</span>
                <span class="detail-order-item-right">${order.hinhthucgiao}</span>
            </li>
            <li class="detail-order-item">
            <span class="detail-order-item-left"><i class="fa fa-user-tag"></i> Người nhận</span>
            <span class="detail-order-item-right">${order.tenguoinhan}</span>
            </li>
            <li class="detail-order-item">
            <span class="detail-order-item-left"><i class="fa fa-phone"></i> Số điện thoại</span>
            <span class="detail-order-item-right">${order.sdtnhan}</span>
            </li>
            <li class="detail-order-item tb">
                <span class="detail-order-item-left"><i class="fa fa-clock"></i> Thời gian giao</span>
                <p class="detail-order-item-b">${(order.thoigiangiao == "" ? "" : (order.thoigiangiao + " - ")) + formatDate(order.ngaygiaohang)}</p>
            </li>
            <li class="detail-order-item tb">
                <span class="detail-order-item-t"><i class="fas fa-map-marked-alt"></i> Địa chỉ nhận</span>
                <p class="detail-order-item-b">${order.diachinhan}</p>
            </li>
        </ul>
    </div>`;
    document.querySelector(".modal-detail-order").innerHTML = spHtml;

    let classDetailBtn = order.trangthai == 0 ? "btn-check-not-done" : "btn-check-done";
    let textDetailBtn = order.trangthai == 0 ? "Chưa xử lý" : "Đã xử lý";
    document.querySelector(
      ".modal-detail-bottom"
    ).innerHTML = `
    <div class="modal-detail-bottom-left">
        <button class="modal-detail-btn ${classDetailBtn}" onclick="changeStatus('${order.id}',this)">${textDetailBtn}</button>   
    </div>
    <div class="modal-detail-bottom-right">
        <div class="price-total">
            <span class="priceAll">Tổng tiền</span>
            <span class="price">${vnd(order.tongtien)}</span>
        </div>
    </div>`;
}

// Find Order
function findOrder() {
    let tinhTrang = parseInt(document.getElementById("status").value);
    let ct = document.getElementById("form-search-order").value;
    let timeStart = document.getElementById("time-start").value;
    let timeEnd = document.getElementById("time-end").value;
    
    if (timeEnd < timeStart && timeEnd != "" && timeStart != "") {
        alert("Lựa chọn thời gian sai !");
        return;
    }
    let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    let result = tinhTrang == 2 ? orders : orders.filter((item) => {
        return item.trangthai == tinhTrang;
    });
    result = ct == "" ? result : result.filter((item) => {
        return (item.khachhang.toLowerCase().includes(ct.toLowerCase()) || item.id.toString().toLowerCase().includes(ct.toLowerCase()));
    });

    if (timeStart != "" && timeEnd == "") {
        result = result.filter((item) => {
            return new Date(item.thoigiandat) >= new Date(timeStart).setHours(0, 0, 0);
        });
    } else if (timeStart == "" && timeEnd != "") {
        result = result.filter((item) => {
            return new Date(item.thoigiandat) <= new Date(timeEnd).setHours(23, 59, 59);
        });
    } else if (timeStart != "" && timeEnd != "") {
        result = result.filter((item) => {
            return (new Date(item.thoigiandat) >= new Date(timeStart).setHours(0, 0, 0) && new Date(item.thoigiandat) <= new Date(timeEnd).setHours(23, 59, 59)
            );
        });
    }
    showOrder(result);
}

function cancelSearchOrder(){
    let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    document.getElementById("status").value = 2;
    document.getElementById("form-search-order").value = "";
    document.getElementById("time-start").value = "";
    document.getElementById("time-end").value = "";
    showOrder(orders);
}

// Create Object Thong ke
function createObj() {
    let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : []; 
    let orderDetails = localStorage.getItem("orderDetails") ? JSON.parse(localStorage.getItem("orderDetails")) : []; 
    let result = [];
    orderDetails.forEach(item => {
        // Lấy thông tin sản phẩm
        let prod = products.find(product => {return product.id == item.id;});
        let obj = new Object();
        obj.id = item.id;
        obj.madon = item.madon;
        obj.price = item.price;
        obj.quantity = item.soluong;
        obj.brand = prod.brand;
        obj.style = prod.style;
        obj.title = prod.title;
        obj.img = prod.img;
        obj.time = (orders.find(order => order.id == item.madon)).thoigiandat;
        result.push(obj);
    });
    return result;
}
function thongKe(mode) {
    let styleTk = document.getElementById("style-search-tk").value;
    let brandTk = document.getElementById("brand-search-tk").value;
  let ct = document.getElementById("form-search-tk").value;
  let timeStart = document.getElementById("time-start-tk").value;
  let timeEnd = document.getElementById("time-end-tk").value;

  if (timeEnd < timeStart && timeEnd != "" && timeStart != "") {
    alert("Lựa chọn thời gian sai !");
    return;
  }

  let arrDetail = createObj();
  let result = arrDetail;

  if (brandTk !== "Tất cả") {
    result = result.filter((item) => {
      return item.brand === brandTk;
    });
  }

  if (styleTk !== "Tất cả") {
    result = result.filter((item) => {
      return item.style === styleTk;
    });
  }

  result =
    ct === ""
      ? result
      : result.filter((item) => {
          return item.title.toLowerCase().includes(ct.toLowerCase());
        });

  if (timeStart !== "" && timeEnd === "") {
    result = result.filter((item) => {
      return new Date(item.time) > new Date(timeStart).setHours(0, 0, 0);
    });
  } else if (timeStart === "" && timeEnd !== "") {
    result = result.filter((item) => {
      return new Date(item.time) < new Date(timeEnd).setHours(23, 59, 59);
    });
  } else if (timeStart !== "" && timeEnd !== "") {
    result = result.filter((item) => {
      return (
        new Date(item.time) > new Date(timeStart).setHours(0, 0, 0) &&
        new Date(item.time) < new Date(timeEnd).setHours(23, 59, 59)
      );
    });
  }

  showThongKe(result, mode);
}

// Show số lượng sp, số lượng đơn bán, doanh thu
function showOverview(arr){
    document.getElementById("quantity-product").innerText = arr.length;
    document.getElementById("quantity-order").innerText = arr.reduce((sum, cur) => (sum + parseInt(cur.quantity)),0);
    document.getElementById("quantity-sale").innerText = vnd(arr.reduce((sum, cur) => (sum + parseInt(cur.doanhthu)),0));
}

function showThongKe(arr,mode) {
    let orderHtml = "";
    let mergeObj = mergeObjThongKe(arr);
    showOverview(mergeObj);

    switch (mode) {
      case 0:
        mergeObj = mergeObjThongKe(createObj());
        showOverview(mergeObj);
        document.getElementById("style-search-tk").value = "Tất cả";
        document.getElementById("form-search-tk").value = "";
        document.getElementById("time-start-tk").value = "";
        document.getElementById("time-end-tk").value = "";
        break;
      case 1:
        mergeObj = mergeObjThongKe(createObj());
        showOverview(mergeObj);
        document.getElementById("brand-search-tk").value = "Tất cả";
        document.getElementById("form-search-tk").value = "";
        document.getElementById("time-start-tk").value = "";
        document.getElementById("time-end-tk").value = "";
        break;
      case 2:
        mergeObj.sort((a, b) => parseInt(a.quantity) - parseInt(b.quantity));
        break;
      case 3:
        mergeObj.sort((a, b) => parseInt(b.quantity) - parseInt(a.quantity));
        break;
    }
    for(let i = 0; i < mergeObj.length; i++) {
        orderHtml += `
        <tr>
            <td>${i + 1}</td>
            <td>
                <div class="prod-img-title">
                    <img class="prd-img-tbl" src="${mergeObj[i].img}" alt="">
                    <p>${mergeObj[i].title}</p>
                </div>
            </td>
            <td>${mergeObj[i].style}</td>
            <td>${mergeObj[i].brand}</td>
            <td>${mergeObj[i].quantity}</td>
            <td>${vnd(mergeObj[i].doanhthu)}</td>
            <td>
                <button class="btn-detail product-order-detail" data-id="${
                  mergeObj[i].id
                }"><i class="fa fa-eye"></i> Chi tiết</button>
            </td>
        </tr>      
        `;
    }
    document.getElementById("showTk").innerHTML = orderHtml;
    document.querySelectorAll(".product-order-detail").forEach(item => {
        let idProduct = item.getAttribute("data-id");
        item.addEventListener("click", () => {           
            detailOrderProduct(arr,idProduct);
        })
    })
}

showThongKe(createObj())

function mergeObjThongKe(arr) {
    let result = [];
    arr.forEach(item => {
        let check = result.find(i => i.id == item.id) // Không tìm thấy gì trả về undefined

        if(check){
            check.quantity = parseInt(check.quantity)  + parseInt(item.quantity);
            check.doanhthu += parseInt(item.price) * parseInt(item.quantity);
        } else {
            const newItem = {...item}
            newItem.doanhthu = newItem.price * newItem.quantity;
            result.push(newItem);
        }
        
    });
    return result;
}

function detailOrderProduct(arr,id) {
    let orderHtml = "";
    arr.forEach(item => {
        if(item.id == id) {
            orderHtml += `<tr>
            <td>${item.madon}</td>
            <td>${item.quantity}</td>
            <td>${vnd(item.price)}</td>
            <td>${formatDate(item.time)}</td>
            </tr>      
            `;
        }
    });
    document.getElementById("show-product-order-detail").innerHTML = orderHtml
    document.querySelector(".modal.detail-order-product").classList.add("open")
}

// User
let updateAccount = document.getElementById("btn-update-account")

document.querySelector(".modal.sign-up .modal-close").addEventListener("click",() => {
    signUpFormReset();
})



function signUpFormReset() {
    document.getElementById('fullname').value = ""
    document.getElementById('phone').value = ""
    document.getElementById('password').value = ""
    document.querySelector('.form-message-name').innerHTML = '';
    document.querySelector('.form-message-phone').innerHTML = '';
    document.querySelector('.form-message-password').innerHTML = '';
}

function showUserArr(arr) {
    let accountHtml = '';
    if(arr.length == 0) {
        accountHtml = `<td colspan="5">Không có dữ liệu</td>`
    } else {
        arr.forEach((account, index) => {
            let tinhtrang = account.status == 0 ? `<span class="status-no-complete">Bị khóa</span>` : `<span class="status-complete">Hoạt động</span>`;
            accountHtml += ` 
            <tr>
                <td>${index + 1}</td>
                <td>${account.fullname}</td>
                <td>${account.phone}</td>
                <td>${account.userName}</td>
                <td>${formatDate(account.join)}</td>
                <td>${tinhtrang}</td>
                <td class="control control-table">
                    <button class="btn-edit" id="edit-account" onclick='editAccount(${account.phone})' ><i class="fas fa-eye"></i></button>
                    <button class="btn-delete" id="delete-account" onclick="deleteAcount(${index})"><i class="fa fa-trash"></i></button>
                </td>
            </tr>`;
        })
    }
    document.getElementById('show-user').innerHTML = accountHtml;
}
    
function showUser() {
    let tinhTrang = parseInt(document.getElementById("status-user").value);
    let ct = document.getElementById("form-search-user").value;
    let timeStart = document.getElementById("time-start-user").value;
    let timeEnd = document.getElementById("time-end-user").value;

    if (timeEnd < timeStart && timeEnd != "" && timeStart != "") {
        alert("Lựa chọn thời gian sai !");
        return;
    }

    let accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")).filter(item => item.userType == 0) : [];
    let result = tinhTrang == 2 ? accounts : accounts.filter(item => item.status == tinhTrang);

    result = ct == "" ? result : result.filter((item) => {
        return (item.fullname.toLowerCase().includes(ct.toLowerCase()) || item.userName.toString().toLowerCase().includes(ct.toLowerCase()));
    });

    if (timeStart != "" && timeEnd == "") {
        result = result.filter((item) => {
            return new Date(item.join) >= new Date(timeStart).setHours(0, 0, 0);
        });
    } else if (timeStart == "" && timeEnd != "") {
        result = result.filter((item) => {
            return new Date(item.join) <= new Date(timeEnd).setHours(23, 59, 59);
        });
    } else if (timeStart != "" && timeEnd != "") {
        result = result.filter((item) => {
            return (new Date(item.join) >= new Date(timeStart).setHours(0, 0, 0) && new Date(item.join) <= new Date(timeEnd).setHours(23, 59, 59)
            );
        });
    }
    showUserArr(result);
}

function cancelSearchUser() {
    let accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")).filter(item => item.userType == 0) : [];
    showUserArr(accounts);
    document.getElementById("status-user").value = 2;
    document.getElementById("form-search-user").value = "";
    document.getElementById("time-start-user").value = "";
    document.getElementById("time-end-user").value = "";
}

window.onload = showUser();

function deleteAcount(userName) {
    let accounts = JSON.parse(localStorage.getItem('accounts'));
    let index = accounts.findIndex(item => item.userName == userName);
    if (confirm("Bạn có chắc muốn xóa?")) {
        accounts.splice(index, 1)
    }
    localStorage.setItem("accounts", JSON.stringify(accounts));
    showUser();
}

let indexFlag;

function editAccount(phone) {
    document.querySelector(".sign-up").classList.add("open");
    document.querySelectorAll(".edit-account-e").forEach(item => {
        item.style.display = "block"
    })
    let accounts = JSON.parse(localStorage.getItem("accounts"));
    let index = accounts.findIndex(item => {
        return item.phone == phone
    })
    indexFlag = index;
    document.getElementById("fullname").value = accounts[index].fullname;
    document.getElementById("phone").value = accounts[index].phone;
    document.getElementById("password").value = accounts[index].password;
    document.getElementById("email").value = accounts[index].email;
    document.getElementById("userName").value = accounts[index].userName;
    document.getElementById("user-status").checked = accounts[index].status == 1 ? true : false;
}

updateAccount.addEventListener("click", (e) => {
    e.preventDefault();
    let accounts = JSON.parse(localStorage.getItem("accounts"));
    let fullname = document.getElementById("fullname").value;
    let email = document.getElementById("email").value;
    let userName = document.getElementById("userName").value;
    let phone = document.getElementById("phone").value;
    let password = document.getElementById("password").value;
    if (fullname == "" || phone == "" || password == "" || email == "" || userName == "") {
      toast({
        title: "Chú ý",
        message: "Vui lòng nhập đầy đủ thông tin !",
        type: "warning",
        duration: 2000,
      });
    } else {
      accounts[indexFlag].fullname = document.getElementById("fullname").value;
      accounts[indexFlag].email = document.getElementById("email").value;
      accounts[indexFlag].userName = document.getElementById("userName").value;
      accounts[indexFlag].phone = document.getElementById("phone").value;
      accounts[indexFlag].password = document.getElementById("password").value;
      accounts[indexFlag].status = document.getElementById("user-status")
        .checked
        ? true
        : false;
      localStorage.setItem("accounts", JSON.stringify(accounts));
      toast({
        title: "Thành công",
        message: "Thay đổi thông tin thành công !",
        type: "success",
        duration: 2000,
      });
      document.querySelector(".sign-up").classList.remove("open");
      signUpFormReset();
      showUser();
    }
})


// document.getElementById("logout-acc").addEventListener('click', (e) => {
//     e.preventDefault();
//     localStorage.removeItem("currentuser");
//     window.location = "/Layout/index.html";
// })


//Toast message
function toast({
    title = 'Thành công',
    message = 'Tạo tài khoản thành công',
    type = 'success', 
    duration = 3000
}){
    const main = document.getElementById('toast');
    if(main){
        const toast = document.createElement('div');
        //Auto remove toast
        const autoRemove = setTimeout(function(){
            main.removeChild(toast);
        },duration+1000);
        //Remove toast when click btn close
        toast.onclick = function(e){
            if(e.target.closest('.fa.fa-times')){
                main.removeChild(toast);
                clearTimeout(autoRemove);
            }
        }
        const colors = {
            success: '#47d864',
            info: '#2f86eb',
            warning: '#ffc021',
            error: '#ff6243'
        }
        const icons = {
            success: 'fa fa-check',
            info: 'fa fa-info',
            warning: 'fa fa-exclamation-triangle',
            error: 'fa fa-bug'
        };
        const color = colors[type];
        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);
        toast.classList.add('toast', `toast--${type}`);
        toast.style.animation = `slideInLeft ease 0.3s, fadeOut linear 1s ${delay}s forwards`;
        toast.innerHTML = `<div class="toast__private">
        <div class="toast__icon">
            <i class="${icon}"></i>
        </div>
        <div class="toast__body">
            <h3 class="toast__title">${title}</h3>
            <p class="toast__msg">
                ${message}
            </p>
        </div>
        <div class="toast__close">
            <i class="fa fa-times"></i>
        </div>
    </div>
    <div class="toast__background"style="background-color: ${color};">
    </div>`
    main.appendChild(toast);
    }
}








// Back to top
window.onscroll = () => {
    let backtopTop = document.querySelector(".back-to-top")
    if (document.documentElement.scrollTop > 100) {
        backtopTop.classList.add("active");
    } else {
        backtopTop.classList.remove("active");
    }
}

