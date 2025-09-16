const db = require("./datatbase");
// const june = require("./june")

const port = 3000;
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const { log } = require("console");
app.use(bodyParser.urlencoded({extended : true}));

let respond;

// 암호화 복호화
const cryptojs = require("crypto-js");

const encryptedKey = "암복호화키를 넣어주세용";

// 암호화
function encryptPassword(password, encryptedKey) {
  var cipherText = cryptojs.AES.encrypt(password, encryptedKey).toString();
  return cipherText;
}

// 복호화
function decryptPassword(password, encryptedKey) {
  var bytes = cryptojs.AES.decrypt(password, encryptedKey);
  var originalText = bytes.toString(cryptojs.enc.Utf8);

  return originalText;
}

var test_password = encryptPassword('123', encryptedKey);
var test_password2 = encryptPassword('12', encryptedKey);
var test_passwords = decryptPassword(test_password, encryptedKey);

app.get('/a', async function (req, res) {
  
  let conn = await db.getConnection(async conn => conn);
  var query = "SELECT * FROM user";
  const [rows, fields] = await conn.query(query);
  conn.release
  res.send({test_password , test_passwords , test_password2});
})


// coupang main_post
app.get('/main_post', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = 'SELECT A.sno, A.post_name, A.post_mark, A.part, A.banner, A.product, A.b_key , A.p_key, C.banner_name, C.banner_description, C.banner_href, C.banner_mark, C.banner_category, C.banner_img, B.name, B.list_image, B.delivery, B.price, B.href, B.scope, B.discount, B.review, B.category, D.delivery_img FROM main_post AS A LEFT JOIN product AS B ON A.product = B.sno LEFT JOIN banner AS C ON A.banner = c.sno LEFT JOIN delivery AS D ON B.delivery = D.sno'
  const [rows, fields] = await conn.query(query);
  conn.release();

  res.json(rows)
})

// coupang tag
app.get('/tag', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = 'SELECT A.sno, A.tag, B.title_img , A.category, B.name FROM tag AS A LEFT JOIN category AS B ON A.category = B.sno'
  const [rows, fields] = await conn.query(query);
  conn.release();

  res.json(rows)
})

// coupang category
app.get('/category', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = 'SELECT A.sno, A.name, A.category, A.title_img, A.class, A.bt_banner FROM category AS A'
  const [rows, fields] = await conn.query(query);
  conn.release();

  res.json(rows)
})

// coupang_marketplace sign_up
app.post('/marketplace/sign_up', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const pw = req.body.pw;
  const id = req.body.id;
  const name = req.body.name;
  const phone = req.body.phone;
  const e_mail = req.body.e_mail;
  res.redirect("http://localhost:3001/");

  console.log(id,pw,name,phone,e_mail)
 
  db.query("insert into seller (pw, id, `name`, phone, e_mail ) VALUES " + `( '${pw}', '${id}', '${name}','${phone}','${e_mail}') `)
})

// coupang product
app.get('/product', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = `SELECT A.sno, A.scope, A.list_image, A.name, A.review , A.price, B.delivery , B.delivery_img FROM product AS A LEFT JOIN delivery AS B ON A.delivery = B.sno WHERE A.name like '%${data.search}%'`
  const [rows, fields] = await conn.query(query);
  conn.release();

  res.json(rows)
})

app.get('/product/detall', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = `SELECT A.sno, A.scope, A.list_image, A.list_image1, A.list_image2, A.list_image3, A.list_image4, A.list_image5,
  A.list_image6, A.list_image7, A.name, A.standard, A.unit, A.number, A.review , A.price, A.coupang_price, A.real_price, A.discount,
  B.delivery,B.delivery_img, C.category, D.notation_name1,D.notation_valvue1, D.notation_name2,D.notation_valvue2, D.notation_name3,
  D.notation_valvue3, D.notation_name4, D.notation_valvue4, D.notation_name5,D.notation_valvue5, D.notation_name6,D.notation_valvue6,
  D.notation_name7,D.notation_valvue7, D.notation_name8,D.notation_valvue8, D.notation_name9,D.notation_valvue9, D.notation_name10,
  D.notation_valvue10, D.notation_name11, D.notation_valvue11, D.notation_name12,D.notation_valvue12, D.notation_name13,
  D.notation_valvue13, A.d_img1, A.d_img2, A.d_img3, A.d_img4, A.d_img5, A.d_img6, D.delivery_method , D.delivery_company,
  D.delivery_cost, D.Bundled_not, D.delivery_period, D.exchange_cost, D.exchange_date, D.limit_thing1,D.limit_thing2, D.limit_thing3,
  D.limit_thing4, D.limit_thing5, D.seller_mutual, D.seller_workplace, D.seller_email, D.seller_phone, D.seller_report, D.seller_business, D.seller_safety
  FROM product AS A LEFT JOIN delivery AS B ON A.delivery = B.sno LEFT JOIN category AS C ON A.category = C.sno LEFT JOIN notation AS D ON A.notation = D.sno WHERE A.name like '${data.detall}'`
  const [rows, fields] = await conn.query(query);
  conn.release();

  res.json(rows)
})

app.get('/product/detall/option', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = "SELECT * FROM   `option` AS A LEFT JOIN product AS B ON  B.sno = A.option_product WHERE B.name like" + `'${data.option}'`
  const [rows, fields] = await conn.query(query);
  conn.release();

  res.json(rows)
})

// coupang shopping_cart
app.get('/shopping_cart', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = "SELECT * FROM shopping_cart AS A LEFT JOIN `user` AS B ON A.user_sno = B.user_sno LEFT JOIN product AS C ON A.product_sno = C.sno LEFT JOIN delivery AS D ON C.delivery = D.sno WHERE A.user_sno =" + `'${data.users}'`
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json(rows)
})

// shopping_cart_delete
app.get('/cart_delete', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = `DELETE FROM shopping_cart WHERE product_sno=${data.sno} AND user_sno= ${data.user}`;
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json(rows);
})

// shopping_cart_add
app.get('/cart_add', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = `insert into shopping_cart (user_sno, product_sno, amount) VALUES ( ${data.user} , ${data.product}, ${data.amount})`
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json(rows);
})

// coupang log-in
app.post('/coupang/user/login', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const email = req.body.form_e_mail
  const pw = encryptPassword(req.body.form_pw , encryptedKey);
  let conn = await db.getConnection(async conn => conn);
  var query = `SELECT * FROM user WHERE user_e_mail='${email}' AND user_pw='${decryptPassword(pw, encryptedKey)}' `
  const [rows, fields] = await conn.query(query);
  conn.release();
 if(rows.length  === 1) {
  res.json([{ user_sno : rows[0].user_sno , user_nickname: rows[0].user_nickname , user_name: rows[0].user_name, user_phone: rows[0].user_phone , user_point: rows[0].user_point , user_e_mail: rows[0].user_e_mail ,is_success: true }])
 } else {
  res.json({is_success: false})
 }
})

// coupang arrive
app.get('/coupang/user/arrive', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = "SELECT DISTINCT user_sno, order_arrive FROM `order` " + `WHERE order_arrive != 0 and user_sno='${data.users}' ` ;
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json(rows);
})

// coupang order
app.get('/coupang/user/order', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = "SELECT * FROM `order` " + `WHERE user_sno='${data.users}' ` ;
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json(rows);
})

// coupang add order
app.post('/coupang/user/add_order', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  res.redirect("http://localhost:3001/");
  datas = JSON.parse(req.body.list)
  for ($i=0; $i<datas.length; $i++) {
  db.query("insert into `order` (user_sno, product_sno, order_price,  order_cnt) VALUES" + `( ${datas[$i].user_sno} , ${datas[$i].product_sno}, ${datas[$i].real_price * datas[$i].amount}, ${datas[$i].amount})`)
  }
})

// coupang sign_up
app.post('/coupang/sign_up', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const e_mail = req.body.e_mail;
  const pw = req.body.pw;
  const name = req.body.name;
  const phone = req.body.phone;
  res.redirect("http://localhost:3001/");

  console.log(pw,name,phone,e_mail)
 
  db.query("insert into user (user_e_mail, user_pw,`user_name`, user_phone ) VALUES " + `( '${e_mail}' , '${pw}', '${name}','${phone}') `)
})

// coupon_list
app.get('/coupang/coupon', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = `SELECT * FROM coupon AS A` ;
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json(rows);
})

// coupon_uselist
app.get('/coupang/usecoupon', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = `SELECT * FROM usecoupon AS A Left Join coupon AS B On A.coupon_sno = B.coupon_sno WHERE A.user_sno = ${data.user}` ;
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json(rows);
  console.log(rows)
})

// coupon_uselist_add
app.post('/coupang/usecoupon_add', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  // res.redirect("http://localhost:3001/");
  console.log(req.body)
  db.query(`insert into usecoupon (coupon_sno, user_sno, usecoupon_use) VALUES (${req.body.e} , ${req.body.usernum}, 'Y')`)
})

// coupon_uselist_use
app.post('/coupang/usecoupon_use', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  // res.redirect("http://localhost:3001/");
  console.log(req.body)
  db.query(`UPDATE usecoupon SET usecoupon_use = 'N' WHERE user_sno=${req.body.usernum} AND coupon_sno=${req.body.couponset}`)
})

// add_point
app.post('/add_point', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  // res.redirect("http://localhost:3001/");
  console.log(req.body)
  db.query("UPDATE `user`" +  `SET user_point = ${req.body.add} WHERE user_sno = ${req.body.usernum}`)
})

// check adit
// app.get('/adit/check', async function (req, res) {
//   res.header("Access-Control-Allow-Origin","*");
//   const data = req.query;
//   let conn = await db.getConnection(async conn => conn);
//   var query = `SELECT * FROM user WHERE user_pw='${data.pw}' AND user_e_mail='${data.e_mail}' `;
//   const [rows, fields] = await conn.query(query);
//   conn.release();
//  if(rows.length  === 1) {
//   res.json([{is_success: true }])
//  } else {
//   res.json({is_success: false})
//  }
// })

app.post('/adit/check', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const e_mail =req.body.e_mail;
  const pw = req.body.pw;
  db.query(`SELECT * FROM user WHERE user_pw='${pw}' AND user_e_mail='${e_mail}' `)
  res.json([{is_success: true }])
})

// adit pw
app.post('/adit/pw', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const nowpw = req.body.nowpw;
  const newpw = req.body.newpw;
  console.log(req.body)
  db.query("UPDATE `user`" +  `SET user_pw = ${newpw} WHERE user_pw = ${nowpw} AND user_sno = ${req.body.usernum}`)
  res.json([{is_success: true }])
})

// adit email
app.post('/adit/email', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  console.log(req.body)
  db.query("UPDATE `user`" +  `SET user_e_mail = ${req.body.newemail} WHERE user_sno = ${req.body.usernum}`)
  res.json([{is_success: true }])
})

// adit phon
app.post('/adit/phon', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  console.log(req.body)
  db.query("UPDATE `user`" +  `SET user_phone = ${req.body.newphon} WHERE user_sno = ${req.body.usernum}`)
  res.json([{is_success: true }])
})




// <------------------------------ admin --------------------------------------->

// admin log-in
app.post('/admin/login', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const id = req.body.form_id
  const pw = encryptPassword(req.body.form_pw , encryptedKey);
  let conn = await db.getConnection(async conn => conn);
  var query = `SELECT * FROM admin WHERE admin_id='${id}' AND admin_pw='${req.body.form_pw}' `
  const [rows, fields] = await conn.query(query);
  conn.release();
 if(rows.length  === 1) {
  res.json([{is_success: true , admin_sno : rows[0].admin_sno , admin_name: rows[0].admin_name, admin_phone: rows[0].admin_phone , admin_id: rows[0].admin_id}])
} else {
  res.json([{is_success: false}])
 }
})


// <------------------------------ admin data list --------------------------------------->

// admin adminlist
app.get('/admin/adminlist', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = "SELECT * FROM `admin` AS A" ;
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json(rows);
})

// admin userlist
app.get('/admin/userlist', async function (req, res) {
  res.header("Access-Control-Allow-Origin","http://localhost:3002");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = "SELECT * FROM `user` AS A" ;
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json(rows);
})

// admin product
app.get('/admin/product', async function (req, res) {
  res.header("Access-Control-Allow-Origin","http://localhost:3002");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = `SELECT A.sno , A.category, A.name , A.price, B.delivery, A.list_image, A.scope, A.review, A.discount FROM product AS A LEFT JOIN delivery AS B ON A.delivery = B.sno LEFT JOIN category AS C ON A.category = C.sno LEFT JOIN notation AS D ON A.notation = D.sno`
  const [rows, fields] = await conn.query(query);
  conn.release();

  res.json(rows)
})

// admin user order
app.get('/admin/user/order', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = "SELECT * FROM `order`" ;
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json(rows);
})

// admin coupon_list
app.get('/admin/coupon', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = `SELECT * FROM coupon AS A` ;
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json(rows);
})

// admin coupon_uselist
app.get('/admin/usecoupon', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = `SELECT * FROM usecoupon AS A Left Join coupon AS B On A.coupon_sno = B.coupon_sno` ;
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json(rows);
})

// <------------------------------ admin delete --------------------------------------->

// adminlist delete
app.post('/admin/adminlist/delete', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = `DELETE FROM admin WHERE admin_sno=${req.body.sno}`;
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json([{is_success: true}]);
})

app.post('/admin/userlist/delete', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = "DELETE FROM `user`" + `WHERE user_sno=${req.body.sno}`;
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json([{is_success: true}]);
})

app.post('/admin/product/delete', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = `DELETE FROM product WHERE sno=${req.body.sno}`;
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json([{is_success: true}]);
})

app.post('/admin/user/order/delete', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = "DELETE FROM `order`" + `WHERE sno=${req.body.sno}`;
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json([{is_success: true}]);
})

app.post('/admin/coupon/delete', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = `DELETE FROM coupon WHERE coupon_sno=${req.body.sno}`;
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json([{is_success: true}]);
})

app.post('/admin/usecoupon/delete', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = `DELETE FROM usecoupon WHERE usecoupon_sno=${req.body.sno}`;
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json([{is_success: true}]);
})

// <------------------------------ insert to add --------------------------------------->

app.post('/admin/insert/adminlist', async function (req, res) {
  res.header("Access-Control-Allow-Origin","http://localhost:3002");
  const id = req.body.insert_a;
  const pw = req.body.insert_b;
  const name = req.body.insert_c;
  const phone = req.body.insert_d;
  let conn = await db.getConnection(async conn => conn);
  var query = ("insert into admin (admin_id, admin_pw, admin_name, admin_phone ) VALUES " + `( '${id}' , '${pw}', '${name}','${phone}') `)
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json([{is_success: true}]);

})

app.post('/admin/insert/userlist', async function (req, res) {
  res.header("Access-Control-Allow-Origin","http://localhost:3002");
  const id = req.body.insert_a;
  const pw = req.body.insert_b;
  const name = req.body.insert_c;
  const phone = req.body.insert_d;
  const birth = req.body.insert_e;  
  const nickname = req.body.insert_f;
    let conn = await db.getConnection(async conn => conn);
  var query = ("insert into `user` (user_e_mail, user_pw, user_name, user_phone, user_birth, user_nickname ) VALUES " + `( '${id}' , '${pw}', '${name}','${phone}', '${birth}' , '${nickname}' ) `)
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json([{is_success: true}]);

})

app.post('/admin/insert/product', async function (req, res) {
  res.header("Access-Control-Allow-Origin","http://localhost:3002");
  const name = req.body.insert_a;
  const category = req.body.insert_b;
  const price = req.body.insert_c;
  const delivery = req.body.insert_d;
    let conn = await db.getConnection(async conn => conn);
  var query = ("insert into product (name, category, price, delivery) VALUES " + `( '${name}' , '${category}', '${price}','${delivery}' ) `)
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json([{is_success: true}]);

})

app.post('/admin/insert/order', async function (req, res) {
  res.header("Access-Control-Allow-Origin","http://localhost:3002");
  const user = req.body.insert_a;
  const product = req.body.insert_b;
  const cnt = req.body.insert_c;
  const price = req.body.insert_d;
    let conn = await db.getConnection(async conn => conn);
  var query = ("insert into `order` (user_sno, product_sno, order_cnt, order_price ) VALUES " + `( '${user}' , '${product}', '${cnt}','${price}' ) `)
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json([{is_success: true}]);

})

app.post('/admin/insert/coupon', async function (req, res) {
  res.header("Access-Control-Allow-Origin","http://localhost:3002");
  const num = req.body.insert_a;
  const discount = req.body.insert_b;
  const name = req.body.insert_c;
    let conn = await db.getConnection(async conn => conn);
  var query = ("insert into coupon (coupon_num, coupon_name, coupon_discount) VALUES " + `( '${num}' , '${name}','${discount}') `)
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json([{is_success: true}]);

})

app.post('/admin/insert/usecoupon', async function (req, res) {
  res.header("Access-Control-Allow-Origin","http://localhost:3002");
  const coupon = req.body.insert_a;
  const user = req.body.insert_b;
  let conn = await db.getConnection(async conn => conn);
  var query = ("insert into usecoupon (coupon_sno, user_sno, usecoupon_use) VALUES " + `( '${coupon}' ,'${user}','Y') `)
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json([{is_success: true}]);

})
// <------------------------------ edit UPDATE --------------------------------------->

app.post('/admin/update/adminlist', async function (req, res) {
  res.header("Access-Control-Allow-Origin","http://localhost:3002");
  const id = req.body.insert_a;
  const pw = req.body.insert_b;
  const name = req.body.insert_c;
  const phone = req.body.insert_d;
  const editnum = req.body.editnum;
  let conn = await db.getConnection(async conn => conn);
  var query = (`UPDATE admin SET admin_pw='${pw}', admin_name='${name}',  admin_phone='${phone}' WHERE admin_sno=${editnum}`)
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json([{is_success: true}]);

})

app.post('/admin/update/userlist', async function (req, res) {
  res.header("Access-Control-Allow-Origin","http://localhost:3002");
  const id = req.body.insert_a;
  const pw = req.body.insert_b;
  const name = req.body.insert_c;
  const phone = req.body.insert_d;
  const birth = req.body.insert_e;  
  const nickname = req.body.insert_f;
  const editnum = req.body.editnum;
  let conn = await db.getConnection(async conn => conn);
  var query = ("UPDATE `user`" + `SET user_e_mail='${id}', user_pw=${pw}, user_name='${name}', user_phone=${phone}, user_birth=${birth}, user_nickname='${nickname}' WHERE admin_sno=${editnum}`)
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json([{is_success: true}]);

})

app.post('/admin/update/product', async function (req, res) {
  res.header("Access-Control-Allow-Origin","http://localhost:3002");
  const name = req.body.insert_a;
  const category = req.body.insert_b;
  const price = req.body.insert_c;
  const delivery = req.body.insert_d;
  const editnum = req.body.editnum;
  let conn = await db.getConnection(async conn => conn);
  var query = ("UPDATE `product`" + `SET  name='${name}', category=${category}, price=${price}, delivery='${delivery}', WHERE sno=${editnum}`)
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json([{is_success: true}]);

})

app.post('/admin/update/order', async function (req, res) {
  res.header("Access-Control-Allow-Origin","http://localhost:3002");
  const user = req.body.insert_a;
  const product = req.body.insert_b;
  const cnt = req.body.insert_c;
  const price = req.body.insert_d;
  const editnum = req.body.editnum;
  let conn = await db.getConnection(async conn => conn);
  var query = ("UPDATE `order`" + `SET  user_sno=${user}, product_sno=${product}, order_cnt=${cnt}, order_price=${price} WHERE sno=${editnum}`)
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json([{is_success: true}]);

})

app.post('/admin/update/coupon', async function (req, res) {
  res.header("Access-Control-Allow-Origin","http://localhost:3002");
  const num = req.body.insert_a;
  const discount = req.body.insert_b;
  const name = req.body.insert_c;
  const use = req.body.insert_d;
  const editnum = req.body.editnum;
  let conn = await db.getConnection(async conn => conn);
  var query = ("UPDATE `coupon` " + `SET coupon_num=${num}, coupon_name='${name}', coupon_discount=${discount}, coupon_use='${use}' WHERE coupon_sno=${editnum}`)
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.json([{is_success: true}]);

})


// usecoupon
// app.post('/coupang/coupon', async function (req, res) {
//   res.header("Access-Control-Allow-Origin","*");
//   const data = req.query;
//   const num = req.body.num;
//   db.query(`SELECT * FROM coupon AS A WHERE A.coupon_num = ${num} and A.coupon_use = 'Y'`)
//   const [rows, fields] = await conn.query(query);
//   conn.release();

//   if(rows[0] != "") {
//     app.get('/coupang/usecoupon', async function (req, res) {
//       res.header("Access-Control-Allow-Origin","*");
//       db.query(`SELECT * FROM usecoupon AS A LEFT JOIN coupon AS B ON A.coupon_sno = B.coupon_num WHERE A.user_sno = ${data.user} and A.coupon_sno = ${rows[0].coupon_sno}`)
//       const [newrows, newfields] = await conn.query(query);
//       conn.release();

//       if(newrows[0] == ""){
//         app.post('/coupang/usecoupon_add', async function (req, res) {
//           res.header("Access-Control-Allow-Origin","*");
//           res.redirect("http://localhost:3001/");

//           db.query(`insert into usecoupon (coupon_sno, user_sno) VALUES ( ${rows[0].coupon_sno} ,  ${data.user})`)
//         })

//       } else {
//         alert("이미 사용된 쿠폰입니다.")
//       }
//     })
//   } else {
//     res.redirect("http://localhost:3001/");
//     alert("유효하지 않은 번호입니다")
//   }

// })









// -------------------------------------------------------

app.get('/', async function (req, res, next) {
  let conn = await db.getConnection(async conn => conn);
  var query = "SELECT * FROM user";
  const [rows, fields] = await conn.query(query);
  conn.release

  respond = "뿜빠삐삐"
  next()
}, function A (req , res) {
  res.send(( "aa"));
} )

// app.get('/user/list', function (req, res) {
//   res.send('현민준');
// })

app.post('/', function (req, res) {
  res.send('Got a post request');
})

app.delete('/', function (req, res) {
  res.send('Got a delete request');
})

// app.get('/member/list/:keyword/mode/:mode', function (req, res) {
//   const datas = req.params;
//   console.log("키워드는 " +datas.keyword + " 입니다" + datas.mode + "모드") 
//   res.send("keyword : " + datas.keyword + " 입니다" + datas.mode + "모드" )
// });

app.get('/member/list', function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  console.log("키워드는 " +data.keyword + " 입니다" + data.mode + "모드") 
  res.send("keyword : " + data.keyword + " 입니다" + data.mode + "모드" )
});



// 2번 API : /user/list-> user list
app.get('/user/list', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = "SELECT * FROM user";
  const [rows, fields] = await conn.query(query);
  conn.release();

    console.log(rows);
    res.send(rows);
})




//5-2 post registration test 용용
// app.post('/registration', async function (req, res) {
//   const name = req.body.name;
//   const num = req.body.num;
//   console.log(name);
//   console.log(num);
//   june.query("insert INto `insert` (`name` , num) VALUES " + `( '${name}', ${num})`)
//   res.redirect("http://localhost:3001/");
// })


// 6번 produt
app.get('/produt', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  let conn = await db.getConnection(async conn => conn);
  var query = `SELECT * FROM product AS A LEFT JOIN product_options AS B ON A.sno = B.product_sno`;
  const [rows, fields] = await conn.query(query);
  conn.release();
  console.log(rows);
  res.json(rows);
})

// 6번-1 produt_view
app.get('/produt_view', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = `SELECT * FROM product AS A LEFT JOIN product_options AS B ON A.sno = B.product_sno`;
  const [rows, fields] = await conn.query(query);
  conn.release();
  console.log(data.sno);
  res.json(rows[data.sno]);
})

// 7번 order
app.get('/order', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  let conn = await db.getConnection(async conn => conn);
  var query = "SELECT A.sno, C.name, C.phone_number,C.e_mail , B.product_name, B.departure_date, B.arrival_date,D.option_name  FROM `order` AS A LEFT JOIN product AS B ON A.product_sno = B.sno LEFT JOIN user AS C ON A.user_sno = C.sno LEFT JOIN product_options AS D ON A.product_options_sno = D.sno";
  const [rows, fields] = await conn.query(query);
  conn.release();
  console.log(rows);
  res.json(rows);
})

// 8번 search
app.get('/search', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  let conn = await db.getConnection(async conn => conn);
  var query = "SELECT A.sno, B.product_name , B.departure_date, B.arrival_date, D.option_name, B.region  FROM `order` AS A LEFT JOIN product AS B ON A.product_sno = B.sno LEFT JOIN product_options AS D ON A.product_options_sno = D.sno";
  const [rows, fields] = await conn.query(query);
  const data = req.query;
  conn.release();
  console.log("키워드는 " +data.search + "모드") 
  console.log(rows);
  res.json(rows);
})

// 9-1번 search/product_name
app.get('/search/product_name', async function (req, res) {
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = "SELECT A.sno, B.product_name , B.departure_date, B.arrival_date, D.option_name, B.region FROM `order`" + `AS A LEFT JOIN product AS B ON A.product_sno = B.sno LEFT JOIN product_options AS D ON A.product_options_sno = D.sno WHERE B.product_name like '%${data.search}%'`;
  const [rows, fields] = await conn.query(query);
  conn.release();
  console.log("키워드는 " +data.search + "모드") 
  console.log(rows);
  res.json(rows);
})

// 9-2번 search/option_name
app.get('/search/option_name', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = "SELECT A.sno, B.product_name , B.departure_date, B.arrival_date, D.option_name, B.region FROM `order`" +  `AS A LEFT JOIN product AS B ON A.product_sno = B.sno LEFT JOIN product_options AS D ON A.product_options_sno = D.sno WHERE D.option_name like '%${data.search}%'`;
  const [rows, fields] = await conn.query(query);
  conn.release();
  console.log("키워드는 " +data.search + "모드") 
  console.log(rows);
  res.json(rows);
})



// // 5번 log-in
// app.get('/user/login', async function (req, res) {
//   res.header("Access-Control-Allow-Origin","*");
//   const data = req.query;
//   let conn = await db.getConnection(async conn => conn);
//   var query = `SELECT id, pw , sno , nickname FROM user WHERE id='${data.id}' AND pw='${data.pw}' `;
//   const [rows, fields] = await conn.query(query);
//   conn.release();

//  if(rows.length  === 1) {
//   res.json([{ sno : rows[0].sno , nickname: rows[0].nickname , is_success: true }])
//  } else {
//   res.json({is_success: false})
//  }


// })

// 2번 API : /user/list/user login_user data
app.get('/user/login/user', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = "SELECT * FROM user WHERE nickname=" + `'${data.nickname}'`;
  const [rows, fields] = await conn.query(query);
  conn.release();

    console.log(rows);
    res.send(rows);
})

// 9-3번 search/region
app.get('/search/region', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = "SELECT A.sno, B.product_name , B.departure_date, B.arrival_date, D.option_name, B.region FROM `order`" +  `AS A LEFT JOIN product AS B ON A.product_sno = B.sno LEFT JOIN product_options AS D ON A.product_options_sno = D.sno WHERE B.region like '%${data.search}%'`;
  const [rows, fields] = await conn.query(query);
  conn.release();
  console.log("키워드는 " +data.search + "모드") 
  console.log(rows);
  res.json(rows);
})

// 9-4번 search/all
app.get('/search/all', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = "SELECT A.sno, B.product_name , B.departure_date, B.arrival_date, D.option_name, B.region FROM `order`" +  `AS A LEFT JOIN product AS B ON A.product_sno = B.sno LEFT JOIN product_options AS D ON A.product_options_sno = D.sno WHERE B.product_name like '%${data.search}%' OR D.option_name like '%${data.search}%' OR B.region like '%${data.search}%'`;
  const [rows, fields] = await conn.query(query);
  conn.release();
  console.log("키워드는 " +data.search + "모드") 
  console.log(rows);
  res.json(rows);
})

//post edit
app.post('/user/edit', async function (req, res) {
  const data = req.query;
  const phone = req.body.phone;
  const e_mail = req.body.e_mail;

  const name = req.body.editname;
  const nickname = req.body.editnickname;
  const introduction = req.body.editintroduction;
  console.log(name,nickname,introduction)
  res.redirect("http://localhost:3001/");

  db.query("UPDATE `user` SET " + `name='${name}', nickname='${nickname}', introduction='${introduction}' where sno='${data.sno}'`)

})

//post edit_pw
app.post('/user/edit_pw', async function (req, res) {
  const data = req.query;
  const pw = req.body.pw;
  const edit = req.body.editpw;
  const check = req.body.check_pw;

  console.log(pw)
  if (edit === check) {
    db.query("UPDATE `user` SET " + `pw='${edit}' where pw='${pw}' AND sno='${data.sno}'`)
    res.redirect("http://localhost:3001/");
  } else {
  }


})

// 컬렉션 목록
app.get('/user/collection', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = 'SELECT B.sno, A.name , A.explanation, c.collection, c.name AS restaurant FROM collection AS A LEFT JOIN `user` AS B ON A.user = B.sno LEFT JOIN restaurant AS C ON A.sno = C.collection WHERE B.sno='+`${data.sno}`;
  const [rows, fields] = await conn.query(query);
  conn.release();

  res.json(rows)

})

// 컬렉션 상세
app.get('/user/collection/name', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = 'SELECT B.sno, A.name , A.explanation, c.collection, c.name AS restaurant FROM collection AS A LEFT JOIN `user` AS B ON A.user = B.sno LEFT JOIN restaurant AS C ON A.sno = C.collection WHERE B.sno='+`${data.sno}` + ' AND A.name='+`${data.name}`;
  const [rows, fields] = await conn.query(query);
  conn.release();

  res.json(rows)

})

//컬렉션 edit
app.post('/collection/edit', async function (req, res) {
  const data = req.query;
  const name = req.body.name;
  const explanation = req.body.explanation;
  res.redirect("http://localhost:3001/");

  db.query("UPDATE collection SET " + `name='${name}', explanation='${explanation}' where sno='${data.sno}'`)

})

// 탈퇴 
app.get('/user/secession', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = 'DELETE FROM user WHERE sno='+`${data.sno}`;
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.redirect("http://localhost:3001/");
})

// 콜렉션 만들기
app.post('/user/collection/add', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  const name = req.body.name;
  const explanation = req.body.explanation;
  let conn = await db.getConnection(async conn => conn);
  var query = ("insert INto collection ( user, `name` , explanation) VALUES " + `( ${data.sno}, '${name}', '${explanation}')`)
  const [rows, fields] = await conn.query(query);
  conn.release();
  res.redirect("http://localhost:3001/");
})

// 콜렉션 삭제
app.get('/user/collection/remove', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = 'DELETE FROM collection WHERE user='+`${data.user}` + ' AND name='+`'${data.name}'`;
  const [rows, fields] = await conn.query(query);
  conn.release();
})

// 즐겨찾기한 레스토랑 추가
app.get('/user/restaurant/add', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = ("insert INto restaurant (collection , `name`) VALUES " + `( '${data.collection}', ${data.name})`)
  'SELECT B.sno, A.name , c.collection, c.name FROM collection AS A LEFT JOIN `user` AS B ON A.user = B.sno LEFT JOIN restaurant AS C ON A.sno = C.collection WHERE B.sno='+`${data.sno}`;
  const [rows, fields] = await conn.query(query);
  conn.release();

  res.json(rows)

}
)

// reservation
app.get('/user/reservation', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = 'SELECT B.sno, A.name , A.date , A.status FROM reservation AS A LEFT JOIN `user` AS B ON A.user = B.sno WHERE B.sno='+`${data.sno}`;
  const [rows, fields] = await conn.query(query);
  conn.release();

  res.json(rows)

})


app.listen(port);

