const PHIVANCHUYEN = 4000000;
const BIENSOXE = 20000000;
const PHIVAT = 30000000;
const PHIDUONGBO = 1560000;
const PHIDANGKIEM = 340000;
const BAOHIEMDANSU = 437000;
const PHITRAGOP = 0.1;



let priceFinal = document.getElementById("checkout-cart-price-final");
// Trang thanh toan
function thanhtoanpage(option, product) {
  // Xu ly ngay nhan hang
  let today = new Date();
  let ngaymai = new Date();
  let ngaykia = new Date();
  ngaymai.setDate(today.getDate() + 1);
  ngaykia.setDate(today.getDate() + 2);
  let dateorderhtml = `<a href="javascript:;" class="pick-date active" data-date="${today}">
        <span class="text">Hôm nay</span>
        <span class="date">${today.getDate()}/${today.getMonth() + 1}</span>
        </a>
        <a href="javascript:;" class="pick-date" data-date="${ngaymai}">
            <span class="text">Ngày mai</span>
            <span class="date">${ngaymai.getDate()}/${
    ngaymai.getMonth() + 1
  }</span>
        </a>

        <a href="javascript:;" class="pick-date" data-date="${ngaykia}">
            <span class="text">Ngày kia</span>
            <span class="date">${ngaykia.getDate()}/${
    ngaykia.getMonth() + 1
  }</span>
    </a>`;
  document.querySelector(".date-order").innerHTML = dateorderhtml;
  let pickdate = document.getElementsByClassName("pick-date");
  for (let i = 0; i < pickdate.length; i++) {
    pickdate[i].onclick = function () {
      document.querySelector(".pick-date.active").classList.remove("active");
      this.classList.add("active");
    };
  }

  let totalBillOrder = document.querySelector(".total-bill-order");
  let totalBillOrderHtml;
  // Xu ly don hang
  switch (option) {
    case 1: // Truong hop thanh toan san pham trong gio
      // Hien thi don hang
      showProductCart();
      // Tinh tien
      totalBillOrderHtml = `
        <div class="priceFlx">
            <div class="text">
                Giá niêm yết:  
                <span class="count">${getAmountCart()} xe</span>
            </div>
            <div class="price-detail">
                <span id="checkout-cart-total">${vnd(getCartTotal())}</span>
            </div>
        </div>
        <div class="priceFlx ">
            <div class="text">Phí biển số xe: </div>
            <div class="price-detail ">
                <span>${vnd(BIENSOXE)}</span>
            </div>
        </div>
        <div class="priceFlx ">
            <div class="text">Phí sử dụng đường bộ (1 năm ): </div>
            <div class="price-detail chk-free-ship">
                <span>${vnd(PHIDUONGBO)}</span>
            </div>
        </div>
        <div class="priceFlx ">
            <div class="text">Phí đăng kiểm: </div>
            <div class="price-detail chk-free-ship">
                <span>${vnd(PHIDANGKIEM)}</span>
            </div>
        </div>
        <div class="priceFlx ">
            <div class="text">Bảo hiểm dân sự (1 năm): </div>
            <div class="price-detail chk-free-ship">
                <span>${vnd(BAOHIEMDANSU)}</span>
            </div>
        </div>
        <div class="priceFlx ">
            <div class="text">Phí trước bạ:</div>
                <div class="price-detail chk-free-ship">
                <span>${vnd(PHIVAT)}</span>
            </div>
        </div>




        <div class="priceFlx chk-ship">
            <div class="text">Phí vận chuyển</div>
            <div class="price-detail chk-free-ship">
                <span>${vnd(PHIVANCHUYEN)}</span>
            </div>
        </div>`;
      // Tong tien
      priceFinal.innerText = vnd(
        getCartTotal() +
          PHIVANCHUYEN +
          BIENSOXE +
          PHIDANGKIEM +
          BAOHIEMDANSU +
          PHIDUONGBO +
          PHIVAT
      );
      break;
    case 2: // Truong hop mua ngay
      // Hien thi san pham
      showProductBuyNow(product);
      // Tinh tien
      totalBillOrderHtml = `
            <div class="priceFlx">
                <div class="text">
                    Giá niêm yết: 
                    <span class="count">${product.soluong} xe</span>
                </div>
                <div class="price-detail">
                    <span id="checkout-cart-total">${vnd(
                      product.soluong * product.price
                    )}</span>
                </div>
            </div>
            <div class="priceFlx ">
                <div class="text">Phí biển số xe</div>
                <div class="price-detail ">
                    <span>${vnd(BIENSOXE)}</span>
                </div>
            </div>

            <div class="priceFlx ">
                <div class="text">Phí sử dụng đường bộ (1 năm ): </div>
                <div class="price-detail chk-free-ship">
                    <span>${vnd(PHIDUONGBO)}</span>
                </div>
            </div>

            <div class="priceFlx ">
                <div class="text">Phí đăng kiểm: </div>
                <div class="price-detail chk-free-ship">
                    <span>${vnd(PHIDANGKIEM)}</span>
                </div>
            </div>

            <div class="priceFlx ">
            <div class="text">Bảo hiểm dân sự (1 năm): </div>
            <div class="price-detail chk-free-ship">
                <span>${vnd(BAOHIEMDANSU)}</span>
            </div>
            </div>
        
            <div class="priceFlx ">
                <div class="text">Phí trước bạ:</div>
                    <div class="price-detail chk-free-ship">
                    <span>${vnd(PHIVAT)}</span>
                </div>
            </div>
            <div class="priceFlx chk-ship">
                <div class="text">Phí vận chuyển</div>
                <div class="price-detail chk-free-ship">
                    <span>${vnd(PHIVANCHUYEN)}</span>
                </div>
            </div>`;
      // Tong tien
      priceFinal.innerText = vnd(
        product.soluong * product.price +
          PHIVANCHUYEN +
          BIENSOXE +
          PHIDANGKIEM +
          BAOHIEMDANSU +
          PHIDUONGBO +
          PHIVAT
      );
      break;
  }

  // Tinh tien
  totalBillOrder.innerHTML = totalBillOrderHtml;

  // Xu ly hinh thuc giao hang
  let giaotannoi = document.querySelector("#giaotannoi");
  let tudenlay = document.querySelector("#tudenlay");
  let tudenlayGroup = document.querySelector("#tudenlay-group");
  let chkShip = document.querySelectorAll(".chk-ship");

  tudenlay.addEventListener("click", () => {
    giaotannoi.classList.remove("active");
    tudenlay.classList.add("active");
    chkShip.forEach((item) => {
      item.style.display = "none";
    });
    tudenlayGroup.style.display = "block";
    switch (option) {
      case 1:
        priceFinal.innerText = vnd(getCartTotal());
        break;
      case 2:
        priceFinal.innerText = vnd(product.soluong * product.price);
        break;
    }
  });

  giaotannoi.addEventListener("click", () => {
    tudenlay.classList.remove("active");
    giaotannoi.classList.add("active");
    tudenlayGroup.style.display = "none";
    chkShip.forEach((item) => {
      item.style.display = "flex";
    });
    switch (option) {
      case 1:
        priceFinal.innerText = vnd(getCartTotal() + PHIVANCHUYEN);
        break;
      case 2:
        priceFinal.innerText = vnd(
          product.soluong * product.price + PHIVANCHUYEN
        );
        break;
    }
  });
  // Su kien khu nhan nut dat hang
  document.querySelector(".complete-checkout-btn").onclick = () => {
    switch (option) {
      case 1:
        xulyDathang();
        break;
      case 2:
        xulyDathang(product);
        break;
    }
  };
}

// Hien thi hang trong gio
function showProductCart() {
    let currentuser = JSON.parse(localStorage.getItem('currentuser'));
    let listOrder = document.getElementById("list-order-checkout");
    // Đoạn mã HTML này có vẻ là một phần của mã JavaScript được viết bằng cú pháp template literal 
    // (sử dụng dấu backticks ``). Đoạn mã này tạo ra một đoạn HTML và thêm vào một biến có tên là listOrderHtml
    let listOrderHtml = '';
    currentuser.cart.forEach(item => {
        let product = getProduct(item);
        listOrderHtml += `
        <div class="car-total">
            
            <div class="info-car"> 
                <div class="name-car">${product.title}</div>
            </div>
            <div class="count">x${product.soluong}</div>
        </div>`;
    })
    listOrder.innerHTML = listOrderHtml;
}

// Hien thi hang mua ngay
function showProductBuyNow(product) {
    let listOrder = document.getElementById("list-order-checkout");
    let listOrderHtml = `<div class="car-total">
        
        <div class="info-car">
            <div class="name-car">${product.title}</div>
        </div>

        <div class="count">x${product.soluong}</div>
    </div>`;
    listOrder.innerHTML = listOrderHtml;
}

//Open Page Checkout
let nutthanhtoan = document.querySelector('.get-pay')
let checkoutpage = document.querySelector('.checkout-page');
nutthanhtoan.addEventListener('click', () => {
    checkoutpage.classList.add('active');
    thanhtoanpage(1);
    closeCart();
    body.style.overflow = "hidden"
})

// Đặt hàng ngay
function orderNow() {
    let productInfo = document.getElementById("product-detail-content");
    let ordernowBtn = productInfo.querySelector(".button-order-now");
    ordernowBtn.onclick = () => {
        if(localStorage.getItem('currentuser')) {
            let productId = ordernowBtn.getAttribute("data-product");
            let soluong = parseInt(productInfo.querySelector(".buttons_added .input-qty").value);
            let products = JSON.parse(localStorage.getItem('products'));
            let a = products.find(item => item.id == productId);
            a.soluong = parseInt(soluong);
            checkoutpage.classList.add('active');
            thanhtoanpage(2,a);
            closeCart();
            body.style.overflow = "hidden"
        } else {
            toast({ title: 'Warning', message: 'Vui lòng đăng nhập để mua hàng !', type: 'warning', duration: 2000 });
        }
    }
}

// Close Page Checkout
function closecheckout() {
    checkoutpage.classList.remove('active');
    body.style.overflow = "auto"
}

// Thong tin cac don hang da mua - Xu ly khi nhan nut dat hang
function xulyDathang(product) {
    let diachinhan = "";
    let hinhthucgiao = "";
    let thoigiangiao = "";
    let giaotannoi = document.querySelector("#giaotannoi");
    let tudenlay = document.querySelector("#tudenlay");
    let giaongay = document.querySelector("#giaongay");
    let giaovaogio = document.querySelector("#deliverytime");
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    // Hinh thuc giao & Dia chi nhan hang
    if(giaotannoi.classList.contains("active")) {
        diachinhan = document.querySelector("#diachinhan").value;
        hinhthucgiao = giaotannoi.innerText;
    }
    if(tudenlay.classList.contains("active")){
        let chinhanh1 = document.querySelector("#chinhanh-1");
        let chinhanh2 = document.querySelector("#chinhanh-2");
        if(chinhanh1.checked) {
            diachinhan = "273 An Dương Vương, Phường 3, Quận 5, Thành phố Hồ Chí Minh";
        }
        if(chinhanh2.checked) {
            diachinhan =
              "04 Tôn Đức Thắng, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh";
        }
        hinhthucgiao = tudenlay.innerText;
    }

    // Thoi gian nhan hang
    if(giaongay.checked) {
        thoigiangiao = "Giao ngay khi xe về showroom";
    }

    if(giaovaogio.checked) {
        thoigiangiao = document.querySelector(".choise-time").value;
    }

    let orderDetails = localStorage.getItem("orderDetails") ? JSON.parse(localStorage.getItem("orderDetails")) : [];
    let order = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    let madon = createId(order);
    let tongtien = 0;
    if(product == undefined) {
        currentUser.cart.forEach(item => {
            item.madon = madon;
            item.price = getpriceProduct(item.id);
            tongtien += item.price * item.soluong;
            orderDetails.push(item);
        });
    } else {
        product.madon = madon;
        product.price = getpriceProduct(product.id);
        tongtien += product.price * product.soluong;
        orderDetails.push(product);
    }   
    
    let tennguoinhan = document.querySelector("#tennguoinhan").value;
    let sdtnhan = document.querySelector("#sdtnhan").value

    if(tennguoinhan == "" || sdtnhan == "" || diachinhan == "") {
        toast({ title: 'Chú ý', message: 'Vui lòng nhập đầy đủ thông tin !', type: 'warning', duration: 2000 });
    } else {
        let donhang = {
            id: madon,
            khachhang: currentUser.userName,
            hinhthucgiao: hinhthucgiao,
            ngaygiaohang: document.querySelector(".pick-date.active").getAttribute("data-date"),
            thoigiangiao: thoigiangiao,
            tenguoinhan: tennguoinhan,
            sdtnhan: sdtnhan,
            diachinhan: diachinhan,
            thoigiandat: new Date(),
            tongtien:tongtien,
            trangthai: 0
        }
    
        order.unshift(donhang);
        if(product == null) {
            currentUser.cart.length = 0;
        }
    
        localStorage.setItem("order",JSON.stringify(order));
        localStorage.setItem("currentuser",JSON.stringify(currentUser));
        localStorage.setItem("orderDetails",JSON.stringify(orderDetails));
        toast({ title: 'Thành công', message: 'Đặt hàng thành công !', type: 'success', duration: 2000 });
        setTimeout((e)=>{
            window.location = "/Layout/index.html";
        },2000);  
    }
}

function getpriceProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    let sp = products.find(item => {
        return item.id == id;
    })
    return sp.price;
}
