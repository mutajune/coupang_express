const db = require("./datatbase");
// const june = require("./june")

const port = 3000;
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended : true}));

let respond;

// coupang main_post
app.get('/main_post', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = 'SELECT A.sno, A.post_name, A.post_mark, A.part, A.banner, A.product, A.b_key , A.p_key, C.banner_name, C.banner_description, C.banner_href, C.banner_mark, C.banner_category, C.banner_img, B.name, B.list_image, B.delivery, B.price, B.href, B.scope, B.discount, B.review, B.option, B.category, D.delivery_img FROM main_post AS A LEFT JOIN product AS B ON A.product = B.sno LEFT JOIN banner AS C ON A.banner = c.sno LEFT JOIN delivery AS D ON B.delivery = D.sno'
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

// -------------------------------------------------------
app.get('/', async function (req, res, next) {
  let conn = await db.getConnection(async conn => conn);
  var query = "SELECT * FROM user";
  const [rows, fields] = await conn.query(query);
  conn.release

  respond = "뿜빠삐삐"
  next()
}, function A (req , res) {
  res.send( respond + 'Hello world! aa');
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



// 5번 log-in
app.get('/user/login', async function (req, res) {
  res.header("Access-Control-Allow-Origin","*");
  const data = req.query;
  let conn = await db.getConnection(async conn => conn);
  var query = `SELECT id, pw , sno , nickname FROM user WHERE id='${data.id}' AND pw='${data.pw}' `;
  const [rows, fields] = await conn.query(query);
  conn.release();

 if(rows.length  === 1) {
  res.json([{ sno : rows[0].sno , nickname: rows[0].nickname , is_success: true }])
 } else {
  res.json({is_success: false})
 }


})

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

