// Doi sang dinh dang tien VND
function vnd(price) {
    if (price == null || isNaN(price)) {
        return 'Giá không hợp lệ';
    }

    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}


// Close popup 
const body = document.querySelector("body");
let modalContainer = document.querySelectorAll('.modal');
let modalBox = document.querySelectorAll('.mdl-cnt');
let formLogSign = document.querySelector('.forms');

// Click vùng ngoài sẽ tắt Popup
modalContainer.forEach(item => {
    item.addEventListener('click', closeModal);
});

modalBox.forEach(item => {
    item.addEventListener('click', function (event) {
        event.stopPropagation();
    })
});

function closeModal() {
    modalContainer.forEach(item => {
        item.classList.remove('open');
    });
    console.log(modalContainer)
    body.style.overflow = "auto";
}

function increasingNumber(e) {
    let qty = e.parentNode.querySelector('.input-qty');
    if (parseInt(qty.value) < qty.max) {
        qty.value = parseInt(qty.value) + 1;
    } else {
        qty.value = qty.max;
    }
}

function decreasingNumber(e) {
    let qty = e.parentNode.querySelector('.input-qty');
    if (qty.value > qty.min) {
        qty.value = parseInt(qty.value) - 1;
    } else {
        qty.value = qty.min;
    }
}

//Xem chi tiet san pham
function detailProduct(index) {
    let modal = document.querySelector('.modal.product-detail');
    let products = JSON.parse(localStorage.getItem('products'));
    event.preventDefault();
    let infoProduct = products.find(sp => {
        return sp.id === index;
    })
    let modalHtml = `
    <div class="modal-header">
        <img class="product-image" src="${infoProduct.img}" alt="">
    </div>
    <div class="modal-body">

        <div class="product-heading">
            <h2 class="product-title">${infoProduct.title}</h2>
        </div>

        
        
        <div class="product-control">
            <div class="priceBox">
                <span class="current-price"> ${vnd(infoProduct.price)}</span>
            </div>
            <div class="buttons_added">
                <input class="minus is-form" type="button" value="-" onclick="decreasingNumber(this)">
                <input class="input-qty" max="100" min="1" name="" type="number" value="1">
                <input class="plus is-form" type="button" value="+" onclick="increasingNumber(this)">
            </div>
        </div>  
    </div>
    <div class=styleBox>
        <p class="product-style-title">Kiểu dáng: </p>
        <p class="product-style">${infoProduct.style}</p>
    </div>
    

    <div class=descBox>
        
        <p class="product-description"> Thông số chi tiết: ${
          infoProduct.desc
        }</p>
    </div>
    <div class="modal-footer">
        <div class="price-total">
            <span class="earning">Thành tiền</span>
            <span class="price">${vnd(infoProduct.price)}</span>
        </div>
        <div class="modal-footer-control">
            <button class="button-order-now" data-product="${infoProduct.id}">Đặt xe ngay</button>
            <button class="button-dat" id="add-cart" ><i class="fa fa-shopping-cart"></i></button>
        </div>
    </div>`;
    document.querySelector('#product-detail-content').innerHTML = modalHtml;
    modal.classList.add('open');
    body.style.overflow = "hidden";
    //Cap nhat gia tien khi tang so luong san pham
    let tgbtn = document.querySelectorAll('.is-form');
    let qty = document.querySelector('.product-control .input-qty');
    let priceText = document.querySelector('.price');
    tgbtn.forEach(element => {
        element.addEventListener('click', () => {
            let price = infoProduct.price * parseInt(qty.value);
            priceText.innerHTML = vnd(price);
        });
    });
    // Them san pham vao gio hang
    let productbtn = document.querySelector('.button-dat');
    productbtn.addEventListener('click', (e) => {
        if (localStorage.getItem('currentuser')) {
            addCart(infoProduct.id);
        } else {
            toast({ title: 'Warning', message: 'Vui lòng đăng nhập để mua hàng !', type: 'warning', duration: 2000 });
        }

    })
    // Mua ngay san pham
    orderNow();
}



// Them SP vao gio hang
function addCart(index) {
    let currentuser = localStorage.getItem('currentuser') ? JSON.parse(localStorage.getItem('currentuser')) : [];
    let soluong = document.querySelector('.input-qty').value;
    let productcart = {
        id: index,
        soluong: parseInt(soluong),
    }
    let vitri = currentuser.cart.findIndex(item => item.id == productcart.id);
    if (vitri == -1) {
        currentuser.cart.push(productcart);
    } else {
        currentuser.cart[vitri].soluong = parseInt(currentuser.cart[vitri].soluong) + parseInt(productcart.soluong);
    }
    localStorage.setItem('currentuser', JSON.stringify(currentuser));
    updateAmount();
    closeModal();
    toast({ title: 'Thêm thành công', message: 'Sản phẩm đã được thêm vào giỏ hàng', type: 'success', duration: 2000 });
}

//Show gio hang
function showCart() {
    if (localStorage.getItem('currentuser') != null) {
        let currentuser = JSON.parse(localStorage.getItem('currentuser'));
        if (currentuser.cart.length != 0) {
            currentuser.cart = currentuser.cart.filter(item => {
                let product = getProduct(item);
                return product.status !== 0;
            });
        
            if (currentuser.cart.length != 0) {
                document.querySelector('.no-cart').style.display = 'none';
                document.querySelector('button.get-pay').classList.remove('disabled');
                let productcarthtml = '';
                currentuser.cart.forEach(item => {
                    let product = getProduct(item);
                    productcarthtml += `
                <li class="cart-item" data-id="${product.id}">
                    

                    <div class="cart-item-info">
                        <img class="cart-item-image" src="${
                          product.img
                        }" alt="">
                        <p class="cart-item-title">
                            ${product.title}
                        </p>
                        <span class="cart-item-price price" data-price="${
                          product.price
                        }">
                            ${vnd(parseInt(product.price))}
                        </span>
                        
                    </div>

                    


                    <div class="cart-item-control">
                        <button class="cart-item-delete" onclick="deleteCartItem(${
                          product.id
                        },this)"><i class="fa fa-trash-alt"></i> Xóa</button>
                        <div class="buttons_added">
                            <input class="minus is-form" type="button" value="-" onclick="decreasingNumber(this)">
                            <input class="input-qty" max="100" min="1" name="" type="number" value="${
                              product.soluong
                            }">
                            <input class="plus is-form" type="button" value="+" onclick="increasingNumber(this)">
                        </div>
                    </div>
                    
                </li>`;
                });
                document.querySelector('.cart-list').innerHTML = productcarthtml;
                updateCartTotal();
                saveAmountCart();
            }
        } else {
            document.querySelector('.no-cart').style.display = 'flex'
        }
    }
    let modalCart = document.querySelector('.modal-cart');
    let containerCart = document.querySelector('.cart-container');
    let themmon = document.querySelector('.buy-again');
    modalCart.onclick = function () {
        closeCart();
    }
    themmon.onclick = function () {
        closeCart();
    }
    containerCart.addEventListener('click', (e) => {
        e.stopPropagation();
    })
}

// Delete cart item
function deleteCartItem(id, el) {
    let cartParent = el.parentNode.parentNode;
    cartParent.remove();
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    let vitri = currentUser.cart.findIndex(item => item.id = id)
    currentUser.cart.splice(vitri, 1);

    // Nếu trống thì hiển thị giỏ hàng trống
    if (currentUser.cart.length == 0) {
        document.querySelector('.no-cart').style.display = 'flex';
        document.querySelector('button.get-pay').classList.add('disabled');
    }
    localStorage.setItem('currentuser', JSON.stringify(currentUser));
    updateCartTotal();
}

//Update cart total
function updateCartTotal() {
    document.querySelector('.text-price').innerText = vnd(getCartTotal());
}

// Lay tong tien don hang
function getCartTotal() {
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    let tongtien = 0;
    if (currentUser != null) {
        currentUser.cart.forEach(item => {
            let product = getProduct(item);
            tongtien += (parseInt(product.soluong) * parseInt(product.price));
        });
    }
    return tongtien;
}
// Get Product 
function getProduct(item) {
    let products = JSON.parse(localStorage.getItem('products'));
    let infoProductCart = products.find(sp => item.id == sp.id)
    let product = {
        ...infoProductCart,
        ...item
    }
    return product;
}

window.onload = updateAmount();
window.onload = updateCartTotal();

// Lay so luong hang

function getAmountCart() {
    let currentuser = JSON.parse(localStorage.getItem("currentuser"));
    let amount = 0;

    if (currentuser && currentuser.cart) {
      currentuser.cart.forEach((item) => {
        let product = getProduct(item);
        if (product.status !== 0) {
          amount += parseInt(product.soluong) || 0;
        }
      });
    }

    return amount;
}

//Update Amount Cart 
function updateAmount() {
    let amount = getAmountCart();
    document.querySelector(".count-product-cart").innerText = amount;    
}

// Save Cart Info
function saveAmountCart() {
    let cartAmountbtn = document.querySelectorAll(".cart-item-control .is-form");
    let listProduct = document.querySelectorAll('.cart-item');
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    cartAmountbtn.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            let id = listProduct[parseInt(index / 2)].getAttribute("data-id");
            let productId = currentUser.cart.find(item => {
                return item.id == id;
            });
            productId.soluong = parseInt(listProduct[parseInt(index / 2)].querySelector(".input-qty").value);
            localStorage.setItem('currentuser', JSON.stringify(currentUser));
            updateCartTotal();
        })
    });
}

// Open & Close Cart
function openCart() {
    showCart();
    document.querySelector('.modal-cart').classList.add('open');
    body.style.overflow = "hidden";
}

function closeCart() {
    document.querySelector('.modal-cart').classList.remove('open');
    body.style.overflow = "auto";
    updateAmount();
}

// Open Search Advanced
document.querySelector(".filter-btn").addEventListener("click",(e) => {
    e.preventDefault();
    document.querySelector(".advanced-search").classList.toggle("open");

})

document.querySelector(".form-search-input").addEventListener("click",(e) => {
    e.preventDefault();
})

function closeSearchAdvanced() {
    document.querySelector(".advanced-search").classList.toggle("open");
    

}

//Open Search Mobile 
function openSearchMb() {
    document.querySelector(".header-container-left").style.display = "none";
    document.querySelector(".header-container-search").style.display = "block";
    document.querySelector(".header-container-user-item.close").style.display = "block";
    let liItem = document.querySelectorAll(".header-container-user-item.open");
    for(let i = 0; i < liItem.length; i++) {
        liItem[i].style.setProperty("display", "none", "important")
    }
}

//Close Search Mobile 
function closeSearchMb() {
    document.querySelector(".header-container-left").style.display = "block";
    document.querySelector(".header-container-search").style.display = "none";
    document.querySelector(".header-container-user-item.close").style.display = "none";
    let liItem = document.querySelectorAll(".header-container-user-item.open");
    for(let i = 0; i < liItem.length; i++) {
        liItem[i].style.setProperty("display", "block", "important")
    }
}

//Signup && Login Form

// Chuyen doi qua lai SignUp & Login 
let signup = document.querySelector('.sign-up-link');
let login = document.querySelector('.login-link');
let container = document.querySelector('.sign-up-login .modal-container');
login.addEventListener('click', () => {
    container.classList.add('active');
})

signup.addEventListener('click', () => {
    container.classList.remove('active');
})

let signupbtn = document.getElementById('sign-up');
let loginbtn = document.getElementById('login');
let formsg = document.querySelector('.modal.sign-up-login')
signupbtn.addEventListener('click', () => {
    formsg.classList.add('open');
    container.classList.remove('active');
    body.style.overflow = "hidden";
})

loginbtn.addEventListener('click', () => {
    document.querySelector('.form-message-check-login').innerHTML = '';
    formsg.classList.add('open');
    container.classList.add('active');
    body.style.overflow = "hidden";
})

// Dang nhap & Dang ky

// Chức năng đăng ký
let signupButton = document.getElementById('sign-up-button');
let loginButton = document.getElementById('login-button');
signupButton.addEventListener('click', (event) => {
    event.preventDefault();
    let fullNameUser = document.getElementById('fullname').value;
    let phoneUser = document.getElementById('phone').value;
    let emailUser = document.getElementById("email").value;
    let idUser = document.getElementById("username").value;
    let passwordUser = document.getElementById('password').value;
    let passwordConfirmation = document.getElementById('password_confirmation').value;
    let checkSignup = document.getElementById('checkbox-sign-up').checked;
    // Check validate
    // Họ tên
    if (fullNameUser.length == 0) {
        document.querySelector('.form-message-name').innerHTML = 'Vui lòng nhập họ vâ tên';
        document.getElementById('fullname').focus();
    } else if (fullNameUser.length < 3) {
        document.getElementById('fullname').value = '';
        document.querySelector('.form-message-name').innerHTML = 'Vui lòng nhập họ và tên lớn hơn 3 kí tự';
    } else {
        document.querySelector('.form-message-name').innerHTML = '';
    }
    // số điện thoại
    if (phoneUser.length == 0) {
        document.querySelector('.form-message-phone').innerHTML = 'Vui lòng nhập vào số điện thoại';
    } else if (phoneUser.length != 10) {
        document.querySelector('.form-message-phone').innerHTML = 'Vui lòng nhập vào số điện thoại 10 số';
        document.getElementById('phone').value = '';
    } else {
        document.querySelector('.form-message-phone').innerHTML = '';
    }

    //email
   if (emailUser.length == 0) {
     document.querySelector(".form-message-email").innerHTML = "Vui lòng nhập vào email";
    } else {
     document.querySelector(".form-message-email").innerHTML = "";
   }

    //username
    if (idUser.length == 0) {
        document.querySelector('.form-message-username').innerHTML = 'Vui lòng nhập vào tên đăng nhập';
    } else {
        document.querySelector('.form-message-username').innerHTML = '';
    }

    // Mật khẩu
    if (passwordUser.length == 0) {
        document.querySelector('.form-message-password').innerHTML = 'Vui lòng nhập mật khẩu';
    } else if (passwordUser.length < 6) {
        document.querySelector('.form-message-password').innerHTML = 'Vui lòng nhập mật khẩu lớn hơn 6 kí tự';
        document.getElementById('password').value = '';
    } else {
        document.querySelector('.form-message-password').innerHTML = '';
    }
    // nhập lại mật khẩu
    if (passwordConfirmation.length == 0) {
        document.querySelector('.form-message-password-confi').innerHTML = 'Vui lòng nhập lại mật khẩu';
    } else if (passwordConfirmation !== passwordUser) {
        document.querySelector('.form-message-password-confi').innerHTML = 'Mật khẩu không khớp';
        document.getElementById('password_confirmation').value = '';
    } else {
        document.querySelector('.form-message-password-confi').innerHTML = '';
    }
    if (checkSignup != true) {
        document.querySelector('.form-message-checkbox').innerHTML = 'Vui lòng check đăng ký';
    } else {
        document.querySelector('.form-message-checkbox').innerHTML = '';
    }

    if (fullNameUser && phoneUser && passwordUser && passwordConfirmation && checkSignup) {
        if (passwordConfirmation == passwordUser) {
            let user = {
              fullname: fullNameUser,
              phone: phoneUser,
              password: passwordUser,
              email: emailUser,
              userName: idUser,
              address: '',
              status: 1,
              join: new Date(),
              cart: [],
              userType: 0,
            };
            let accounts = localStorage.getItem('accounts') ? JSON.parse(localStorage.getItem('accounts')) : [];
            let checkloop = accounts.some(account => {
                return account.userName == user.userName;
            })
            if (!checkloop) {
                accounts.push(user);
                localStorage.setItem('accounts', JSON.stringify(accounts));
                localStorage.setItem('currentuser', JSON.stringify(user));
                toast({ title: 'Thành công', message: 'Tạo thành công tài khoản !', type: 'success', duration: 2000 });
                closeModal();
                kiemtradangnhap();
                updateAmount();
            } else {
                toast({ title: 'Error', message: 'Tài khoản đã tồn tại !', type: 'error', duration: 2000 });
            }
        } else {
            toast({ title: 'Error', message: 'Sai mật khẩu !', type: 'error', duration: 2000 });
        }
    }
}
)

// đăng nhập
loginButton.addEventListener('click', (event) => {
    event.preventDefault();
    let userNamelog = document.getElementById('userName-login').value;
    let passlog = document.getElementById('password-login').value;
    let accounts = JSON.parse(localStorage.getItem('accounts'));

    if (userNamelog.length == 0) {
        document.querySelector('.form-message.userNamelog').innerHTML = 'Vui lòng nhập vào tên đăng nhập';
    } else {
        document.querySelector(".form-message.userNamelog").innerHTML = "";
    }

    if (passlog.length == 0) {
        document.querySelector('.form-message-check-login').innerHTML = 'Vui lòng nhập mật khẩu';
    } else if (passlog.length < 6) {
        document.querySelector('.form-message-check-login').innerHTML = 'Vui lòng nhập mật khẩu lớn hơn 6 kí tự';
        document.getElementById('passwordlogin').value = '';
    } else {
        document.querySelector('.form-message-check-login').innerHTML = '';
    }

    if (userNamelog && passlog) {
        let vitri = accounts.findIndex(item => item.userName == userNamelog);
        if (vitri == -1) {
            toast({ title: 'Error', message: 'Tài khoản của bạn không tồn tại', type: 'error', duration: 2000 });
        } else if (accounts[vitri].password == passlog) {
            if(accounts[vitri].status == 0) {
                toast({ title: 'Warning', message: 'Tài khoản của bạn đã bị khóa', type: 'warning', duration: 2000 });
            } else {
                localStorage.setItem('currentuser', JSON.stringify(accounts[vitri]));
                toast({ title: 'Đăng nhập thành công', message: 'Chào mừng bạn đến với SaiThanh Showroom', type: 'success', duration: 2000 });
                closeModal();
                kiemtradangnhap();
                checkAdmin();
                updateAmount();
            }
        } else {
            toast({ title: 'Warning', message: 'Sai mật khẩu', type: 'warning', duration: 2000 });
        }
    }
})

function togglePasswordVisibility() {
  var passwordField = document.getElementById("password-login");
  var toggleButton = document.querySelector(".toggle-password");

  if (passwordField.type === "text") {
    passwordField.type = "password";
      toggleButton.classList.add("visible");
      toggleButton.innerHTML = '<i class="fa fa-eye"></i>';
  } else {
    passwordField.type = "text";
      toggleButton.classList.remove("visible");
      toggleButton.innerHTML = '<i class="fa fa-eye-slash"></i>';
  }
}

// Kiểm tra xem có tài khoản đăng nhập không ?
function kiemtradangnhap() {
    let currentUser = localStorage.getItem('currentuser');
    if (currentUser != null) {
        let user = JSON.parse(currentUser);
        document.querySelector('.auth-container').innerHTML = `<span class="text-dndk">Tài khoản</span>
            <span class="text-tk">${user.userName} <i class="fa fa-caret-down"></span>`
        document.querySelector(".header-container-user-menu").innerHTML = `
            <li><a href="javascript:;" onclick="myAccount()"><i class="fa fa-user"></i>Tài khoản của tôi</a></li>
            <li><a href="javascript:;" onclick="changePasswordUser()"><i class="fa fa-unlock-alt"></i>Đổi mật khẩu</a></li>
            <li><a href="javascript:;" onclick="orderHistory()"><i class="fa fa-shopping-bag"></i>Đơn hàng đã mua</a></li>
            <li class="border"><a id="logout" class="logout" href="javascript:;"><i class="fa fa-sign-out-alt" ></i>Đăng xuất</a></li>`;
        document.querySelector('#logout').addEventListener('click',logOut)
    }
}



function logOut() {
    let accounts = JSON.parse(localStorage.getItem('accounts'));
    user = JSON.parse(localStorage.getItem('currentuser'));
    let vitri = accounts.findIndex(item => item.userName == user.userName)
    accounts[vitri].cart.length = 0;
    for (let i = 0; i < user.cart.length; i++) {
        accounts[vitri].cart[i] = user.cart[i];
    }
    localStorage.setItem('accounts', JSON.stringify(accounts));
    localStorage.removeItem('currentuser');
    window.location = "/Layout/index.html";
}

function checkAdmin() {
    let user = JSON.parse(localStorage.getItem('currentuser'));
    if (user && user.userType == 1) {
        let node = document.createElement(`li`);
        node.innerHTML = `<a href="/Layout/admin.html"><i class="fa fa-gear"></i>Quản lý showroom</a>`
        document.querySelector('.header-container-user-menu').prepend(node);
    }
}

window.onload = kiemtradangnhap();
window.onload = checkAdmin();

// Chuyển đổi trang chủ và trang thông tin tài khoản
function myAccount() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById("homePage").classList.add("hide");
    document.getElementById('order-history').classList.remove('open');
    document.getElementById('account-user').classList.add('open');
    document.getElementById("change-password-user").classList.remove("open");
    userInfo();
}

function changePasswordUser() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById("homePage").classList.add("hide");
  document.getElementById("order-history").classList.remove("open");
    document.getElementById("account-user").classList.remove("open");
    document.getElementById("change-password-user").classList.add("open");
  userInfo();
}

// Chuyển đổi trang chủ và trang xem lịch sử đặt hàng 
function orderHistory() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('account-user').classList.remove('open');
    document.getElementById("homePage").classList.add("hide");
    document.getElementById('order-history').classList.add('open');
    document.getElementById("change-password-user").classList.remove("open");
    renderOrderProduct();
}

function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function userInfo() {
  let user = JSON.parse(localStorage.getItem("currentuser"));
  document.getElementById("info-name").value = user.fullname;
  document.getElementById("info-phone").value = user.phone;
  document.getElementById("info-username").value = user.userName;
  document.getElementById("info-email").value = user.email;
  document.getElementById("info-address").value = user.address;
  if (user.email == undefined) {
    infoemail.value = "";
  }
  if (user.address == undefined) {
    infoaddress.value = "";
  }
}


// Thay doi thong tin
function changeInformation() {
  let accounts = JSON.parse(localStorage.getItem("accounts"));
  let user = JSON.parse(localStorage.getItem("currentuser"));
  let infoName = document.getElementById("info-name");
  let infoEmail = document.getElementById("info-email");
  let infoAddress = document.getElementById("info-address");

  user.fullname = infoName.value;

  if (infoEmail.value.length > 0) {
    if (!emailIsValid(infoEmail.value)) {
      document.querySelector(".inforemail-error").innerHTML =
        "Vui lòng nhập lại email!";
      infoEmail.value = "";
    } else {
      user.email = infoEmail.value;
    }
  }

  // Chỉ cập nhật địa chỉ nếu nó thay đổi
  if (infoAddress.value.length > 0 && infoAddress.value !== user.address) {
    user.address = infoAddress.value;
  }

  let vitri = accounts.findIndex((item) => item.userName == user.userName);

  accounts[vitri].fullname = user.fullname;
  accounts[vitri].email = user.email;
  accounts[vitri].address = user.address;

  // Lưu thay đổi vào localStorage trước khi gọi hàm userInfo
  localStorage.setItem("currentuser", JSON.stringify(user));
  localStorage.setItem("accounts", JSON.stringify(accounts));

    kiemtradangnhap();
    userInfo()
  toast({
    title: "Thành công",
    message: "Thông tin của bạn đã được cập nhật!",
    type: "success",
    duration: 2000,
  });
}



// Đổi mật khẩu 
function changePassword() {
  let currentUser = JSON.parse(localStorage.getItem("currentuser"));
  let passwordCur = document.getElementById("password-cur-info");
  let passwordAfter = document.getElementById("password-after-info");
  let passwordConfirm = document.getElementById("password-comfirm-info");
  let check = true;

  if (passwordCur.value.length === 0) {
    document.querySelector(".password-cur-info-error").innerHTML =
      "Vui lòng nhập mật khẩu hiện tại";
    check = false;
  } else {
    document.querySelector(".password-cur-info-error").innerHTML = "";
  }

  if (passwordAfter.value.length === 0) {
    document.querySelector(".password-after-info-error").innerHTML =
      "Vui lòng nhập mật khẩu mới";
    check = false;
  } else if (passwordAfter.value.length < 6) {
    document.querySelector(".password-after-info-error").innerHTML =
      "Vui lòng nhập mật khẩu mới có số kí tự lớn hơn hoặc bằng 6";
    check = false;
  } else {
    document.querySelector(".password-after-info-error").innerHTML = "";
  }

  if (passwordConfirm.value.length === 0) {
    document.querySelector(".password-after-comfirm-error").innerHTML =
      "Vui lòng nhập mật khẩu xác nhận";
    check = false;
  } else if (passwordConfirm.value !== passwordAfter.value) {
    document.querySelector(".password-after-comfirm-error").innerHTML =
      "Mật khẩu bạn nhập không trùng khớp";
    check = false;
  } else {
    document.querySelector(".password-after-comfirm-error").innerHTML = "";
  }

  if (check) {
    if (passwordCur.value === currentUser.password) {
      document.querySelector(".password-cur-info-error").innerHTML = "";
      currentUser.password = passwordAfter.value;
      localStorage.setItem("currentuser", JSON.stringify(currentUser));

      // Update password in the 'accounts' local storage
      let accounts = JSON.parse(localStorage.getItem("accounts"));
      let accountChange = accounts.find(
        (acc) => acc.userName === currentUser.userName
      );
      if (accountChange) {
        accountChange.password = passwordAfter.value;
        localStorage.setItem("accounts", JSON.stringify(accounts));
      }

      toast({
        title: "Thành công",
        message: "Đổi mật khẩu thành công!",
        type: "success",
        duration: 2000,
      });
    } else {
      document.querySelector(".password-cur-info-error").innerHTML =
        "Bạn đã nhập sai mật khẩu hiện tại";
    }
  }
}


function getProductInfo(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(item => {
        return item.id == id;
    })
}

// Quan ly don hang
function renderOrderProduct() {
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    let order = localStorage.getItem('order') ? JSON.parse(localStorage.getItem('order')) : [];
    let orderHtml = "";
    let arrDonHang = [];
    for (let i = 0; i < order.length; i++) {
        if (order[i].khachhang === currentUser.userName) {
            arrDonHang.push(order[i]);
        }
    }
    if (arrDonHang.length == 0) {
        orderHtml = `<div class="empty-order-section"><p>Chưa có đơn hàng nào</p></div>`;
    } else {
        arrDonHang.forEach(item => {
            let productHtml = `<div class="order-history-group">`;
            let chiTietDon = getOrderDetails(item.id);
            chiTietDon.forEach(sp => {
                let infosp = getProductInfo(sp.id);
                productHtml += `
                <div class="order-history">
                    <div class="order-history-left">
                        <img src="${infosp.img}" alt="">
                        <div class="order-history-info">
                            <h4>${infosp.title}</h4>
                            <p>- ${infosp.style} -</p>
                            <p class="order-history-quantity">Số lượng: ${sp.soluong}</p>
                        </div>
                    </div>
                    <div class="order-history-right">
                        <div class="order-history-price">
                            <span class="order-history-current-price">${vnd(
                              sp.price
                            )}</span>
                        </div>                         
                    </div>
                </div>`;
            });
            let textCompl = item.trangthai == 1 ? "Đã xử lý" : "Đang xử lý";
            let classCompl = item.trangthai == 1 ? "complete" : "no-complete"
            productHtml += `<div class="order-history-control">
                <div class="order-history-status">
                    <span class="order-history-status-sp ${classCompl}">${textCompl}</span>
                    <button id="order-history-detail" onclick="detailOrder('${
                      item.id
                    }')"> Xem chi tiết</button>
                </div>
                <div class="order-history-total">
                    <span class="order-history-total-desc">Tổng tiền: </span>
                    <span class="order-history-total-price">${vnd(
                      item.tongtien
                    )}</span>
                </div>
            </div>`;
            productHtml += `</div>`;
            orderHtml += productHtml;
        });
    }
    document.querySelector(".order-history-section").innerHTML = orderHtml;
}

// Get Order Details
function getOrderDetails(madon) {
    let orderDetails = localStorage.getItem("orderDetails") ? JSON.parse(localStorage.getItem("orderDetails")) : [];
    let ctDon = [];
    orderDetails.forEach(item => {
        if(item.madon == madon) {
            ctDon.push(item);
        }
    });
    return ctDon;
}

// Format Date
function formatDate(date) {
    let fm = new Date(date);
    let yyyy = fm.getFullYear();
    let mm = fm.getMonth() + 1;
    let dd = fm.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return dd + '/' + mm + '/' + yyyy;
}

// Xem chi tiet don hang
function detailOrder(id) {
    let order = JSON.parse(localStorage.getItem("order"));
    let detail = order.find(item => {
        return item.id == id;
    })
    document.querySelector(".modal.detail-order").classList.add("open");
    let detailOrderHtml = `<ul class="detail-order-group">
        <li class="detail-order-item">
            <span class="detail-order-item-left"> Ngày đặt hàng</span>
            <span class="detail-order-item-right">${formatDate(detail.thoigiandat)}</span>
        </li>
        <li class="detail-order-item">
            <span class="detail-order-item-left"></i> Hình thức giao</span>
            <span class="detail-order-item-right">${detail.hinhthucgiao}</span>
        </li>
        <li class="detail-order-item">
            <span class="detail-order-item-left"></i> Ngày nhận hàng</span>
            <span class="detail-order-item-right">${(detail.thoigiangiao == "" ? "" : (detail.thoigiangiao + " - ")) + formatDate(detail.ngaygiaohang)}</span>
        </li>
        <li class="detail-order-item">
            <span class="detail-order-item-left"></i> Địa điểm nhận</span>
            <span class="detail-order-item-right">${detail.diachinhan}</span>
        </li>
        <li class="detail-order-item">
            <span class="detail-order-item-left"></i> Người nhận</span>
            <span class="detail-order-item-right">${detail.tenguoinhan}</span>
        </li>
        <li class="detail-order-item">
            <span class="detail-order-item-left"></i> Số điện thoại nhận</span>
            <span class="detail-order-item-right">${detail.sdtnhan}</span>
        </li>
    </ul>`
    document.querySelector(".detail-order-content").innerHTML = detailOrderHtml;
}

// Create id order 
function createId(arr) {
    let id = arr.length + 1;
    let check = arr.find(item => item.id == "Saithanh-2023-" + id)
    while (check != null) {
        id++;
        check = arr.find(item => item.id == "Saithanh-2023-" + id)
    }
    return "Saithanh-2023-" + id;
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

// Auto hide header on scroll
const headerNav = document.querySelector(".header-product");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
    if(lastScrollY < window.scrollY) {
        headerNav.classList.add("hide")
    } else {
        headerNav.classList.remove("hide")
    }
    lastScrollY = window.scrollY;
})

function searchAndScroll() {
  // Scroll to the home-title section
  const homeTitleElement = document.getElementById("home-title");
  if (homeTitleElement) {
    // Cuộn mượt xuống home-title
    homeTitleElement.style.display = "block";
    homeTitleElement.scrollIntoView({ behavior: "smooth" });
  }
}



// Page
function renderProducts(showProduct) {
    let productHtml = "";
    let homeTitleElement = document.getElementById("home-title");
    
    if (showProduct.length == 0) {
        homeTitleElement.style.display = "none";
        productHtml = `
        <div class="no-result">
            <div class="no-result-h">Tìm kiếm không có kết quả</div>
            <div class="no-result-p">Xin lỗi, chúng tôi không thể tìm được kết quả hợp với tìm kiếm của bạn</div>
            <div class="no-result-i"><i class="fa fa-sad-cry"></i></div>
        </div>`;
        
    } else {
      homeTitleElement.style.display = "block";
      showProduct.forEach((product) => {
          productHtml += `
        <div class="col-product">
            <article class="card-product" >
                <div class="card-header">
                    <a href="#" class="card-image-link" onclick="detailProduct(${product.id})">
                        <img class="card-image" src="${product.img}" alt="${product.title}">
                    </a>
                </div>

                <div class="card-info">
                    <div class="card-content">
                        <div class="card-title">
                            <a href="#" class="card-title-link" onclick="detailProduct(${product.id})">${product.title}</a>
                        </div>
                    </div>

                    <div class="card-footer">
                        <div class="product-price">
                            <span class="current-price">${vnd(product.price)}</span>
                        </div>
                    </div>
                </div>
            </article>
        </div>`;
      });
    }
    document.getElementById("home-products").innerHTML = productHtml;
    
}

// Find Product
var productAll = JSON.parse(localStorage.getItem('products')).filter(item => item.status == 1);
function searchProducts(mode) {
    let valeSearchInput = document.querySelector(".form-search-input").value;
    let valueStyle = document.getElementById("advanced-search-Style-select").value;
    let valueBrand = document.getElementById("advanced-search-Brand-select").value;
    let minPrice = document.getElementById("min-price").value;
    let maxPrice = document.getElementById("max-price").value;

  if (
    parseInt(minPrice) > parseInt(maxPrice) &&
    minPrice !== "" &&
    maxPrice !== ""
  ) {
    alert("Giá đã nhập sai!");
    return;
  }

  let result = productAll;

  result = result.filter((item) => {
    return valueStyle === "Tất cả" || item.style === valueStyle;
  });

  result = result.filter((item) => {
    return valueBrand === "Tất cả" || item.brand === valueBrand;
  });

  result =
    valeSearchInput === ""
      ? result
      : result.filter((item) => {
          return item.title
            .toString()
            .toUpperCase()
            .includes(valeSearchInput.toString().toUpperCase());
        });

  if (minPrice === "" && maxPrice !== "") {
    result = result.filter((item) => item.price <= maxPrice);
  } else if (minPrice !== "" && maxPrice === "") {
    result = result.filter((item) => item.price >= minPrice);
  } else if (minPrice !== "" && maxPrice !== "") {
    result = result.filter(
      (item) => item.price >= minPrice && item.price <= maxPrice
    );
  }


    switch (mode) {
      case "0":
        result = JSON.parse(localStorage.getItem("products"));
        document.querySelector(".form-search-input").value = "";
        document.getElementById("advanced-search-Style-select").value = "Tất cả";
        document.getElementById("advanced-search-Brand-select").value = "Tất cả"; 
        document.getElementById("min-price").value = "";
        document.getElementById("max-price").value = "";
        break;
      case "1":
        result.sort((a, b) => a.price - b.price);
        break;
      case "2":
        result.sort((a, b) => b.price - a.price);
        break;
    }

  showHomeProduct(result);
}

let perPage = 9;
let currentPage = 1;

function displayList(productAll, perPage, currentPage) {
  let start = (currentPage - 1) * perPage;
  let end = (currentPage - 1) * perPage + perPage;
  let productShow = productAll.slice(start, end);
  renderProducts(productShow);
}

function showHomeProduct(products) {
  let productAll = products.filter((item) => item.status == 1);
  displayList(productAll, perPage, currentPage);
  setupPagination(productAll, perPage, currentPage);
}

window.onload = function () {
  showHomeProduct(JSON.parse(localStorage.getItem("products")));
};

function setupPagination(productAll, perPage, currentPage) {
  let page_count = Math.ceil(productAll.length / perPage);
  let paginationList = document.querySelector(".page-nav-list");
  paginationList.innerHTML = "";

  // Kiểm tra nếu số lượng sản phẩm trên mỗi trang nhỏ hơn 9
  if (page_count <= 1) {
    // Ẩn thanh phân trang
    paginationList.style.display = "none";
    // Hiển thị tất cả sản phẩm
    displayList(productAll, perPage, currentPage);
  } else {
    // Hiển thị thanh phân trang
    paginationList.style.display = "flex";

    // Thêm các nút phân trang
    paginationList.appendChild(
      createPaginationButton(
        '<i class="fas fa-chevron-circle-left"></i>',
        "prev-page",
        () => {
          if (currentPage > 1) {
            currentPage--;
            updatePagination(productAll, perPage, currentPage);
          }
        }
      )
    );

    for (let i = 1; i <= Math.min(3, page_count); i++) {
      paginationList.appendChild(
        createPaginationButton(i, `page-${i}`, () => {
          updatePagination(productAll, perPage, i);
        })
      );
    }

    if (page_count > 3) {
      paginationList.appendChild(createEllipsis());
    }

    paginationList.appendChild(
      createPaginationButton(currentPage, "page-present", () => {
        handleCurrentPageClick();
      })
    );

    if (page_count > 3) {
      paginationList.appendChild(createEllipsis());
    }

    for (let i = Math.max(page_count - 2, 4); i <= page_count; i++) {
      paginationList.appendChild(
        createPaginationButton(i, `page-${i}`, () => {
          updatePagination(productAll, perPage, i);
        })
      );
    }

    paginationList.appendChild(
      createPaginationButton(
        '<i class="fas fa-chevron-circle-right"></i>',
        "next-page",
        () => {
          if (currentPage < page_count) {
            currentPage++;
            updatePagination(productAll, perPage, currentPage);
          }
        }
      )
    );

    // Set the initial active state
    updatePagination(productAll, perPage, currentPage);
  }
}

function createPaginationButton(label, id, onClick) {
  let node = document.createElement("li");
  node.classList.add("page-nav-item");
  node.id = id;
  let link = document.createElement("a");
  link.href = "javascript:;";
  link.innerHTML = label;
  link.addEventListener("click", onClick);
  node.appendChild(link);
  return node;
}

function createEllipsis() {
  let node = document.createElement("li");
  node.classList.add("page-nav-item", "ellipsis");
  node.innerHTML = "<span>...</span>";
  return node;
}

function updatePagination(productAll, perPage, currentPage) {
  displayList(productAll, perPage, currentPage);
  let t = document.querySelectorAll(".page-nav-item.active");
  for (let i = 0; i < t.length; i++) {
    t[i].classList.remove("active");
  }

  let currentPageElement = document.getElementById("page-present");
  if (currentPageElement) {
    currentPageElement.innerHTML = `<a href="javascript:;">${currentPage}</a>`;
    currentPageElement.classList.add("active");
  }
  document.getElementById("home-title").scrollIntoView();
}





// Rest of the code remains unchanged


// Hiển thị chuyên mục
function showBrand(brand) {
    document.getElementById("change-password-user").classList.remove("open");
    document.getElementById('account-user').classList.remove('open');
    document.getElementById('order-history').classList.remove('open');
    let productSearch = productAll.filter(value => {
        return value.brand.toString().toUpperCase().includes(brand.toUpperCase());
    })
    let currentPageSeach = 1;
    displayList(productSearch, perPage, currentPageSeach);
    setupPagination(productSearch, perPage, currentPageSeach);
    document.getElementById("home-title").scrollIntoView();
}





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





// slide
// slide auto
const slides = document.querySelector(".slides");
const slideItems = document.querySelectorAll(".slide");
let index = 0;

function nextSlide() {
  index = (index + 1) % slideItems.length;
  updateSlide();
}

function updateSlide() {
  slides.style.transform = `translateX(${-index * 100}%)`;
}
setInterval(nextSlide, 3000);
