//导入配置选项
const pz = require("../myconfig.js");

//导入第三方模块
const mysql = require("mysql");

//配置数据库选项
const db = mysql.createConnection({
    host : pz.host,
    user : pz.user,
    password : pz.password,
    database : pz.database
});

//链接数据库
db.connect((err)=>{
    if (err) return console.log("数据库链接失败");
    console.log("数据库链接成功");
});

//利用异步方法封装数据库函数
//查询数据库
exports.querydb = function (sql) {
    return new Promise(
        function(resolve, reject){
            db.query(sql, (err, result)=>{
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        }
    );
};
//删除，修改，增加
exports.updatedb = function (sql, post) {
    return new Promise(
        function (resolve, reject) {
            db.query(sql, post, (err, result)=>{
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        }
    )
};