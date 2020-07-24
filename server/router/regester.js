const express = require("express");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const db = require("../database/db.js");

const router = express.Router();

//给出加密种子
const salt = '$2a$10$avJpn7JMVNCBm7mHxHiMlu';

//注册的相应事件
router.post('/add', function (req, res) {
    var resm = {status: 0, message: '注册失败!'};
    //验证数据的正确性
    if (validator.isEmpty(req.body.username)) {
        resm.message = "用户名不能为空!";
        res.send(resm);
        return;
    }
    if (validator.isEmpty(req.body.nickname)) {
        resm.message = "昵称不能为空!";
        res.send(resm);
        return;
    }
    if (req.body.nickname.length>8) {
        resm.message = "昵称不能超过8位!";
        res.send(resm);
        return;
    }
    if (!validator.isEmail(req.body.email)) {
        resm.message = "邮箱格式不正确!";
        res.send(resm);
        return;
    }
    if (validator.isEmpty(req.body.password)) {
        resm.message = "密码不能为空!";
        res.send(resm);
        return;
    }
    if (req.body.password.length < 6 || req.body.password.length>20) {
        resm.message = "密码长度必须在六到二十之间!";
        res.send(resm);
        return;
    }
    if (req.body.password !== req.body.confirmPassword) {
        resm.message = "两次密码不一致!";
        res.send(resm);
        return;
    }

    //验证用户名和邮箱是否已经被注册了
    IsExist({username:req.body.username, email:req.body.email})
        .then(function (result) {
            if (result == 0){
                //数据正确，且都没有被注册, 直接存入数据
                var post = {
                    username:req.body.username,
                    nickname:req.body.nickname,
                    email:req.body.email,
                    password:bcrypt.hashSync(req.body.password, salt)
                }
                return db.updatedb('insert into user set ?', post);
            }
            else{
                resm.message = '该信息已被注册!';
                res.send(resm);
            }
        })
        .then(function (result) {
            if (result && result.affectedRows == 1){
                resm.status = 1;
                resm.message = "注册成功!";
                res.send(resm);
            }
        })
        .catch(function (error) {
            resm.message = "注册失败!";
            res.send(resm);
        });
});

//判断用户名是否已经被注册
router.post('/confirmUsername', function (req, res) {
    var resm = {status:0, message:'该用户名已存在!'};
    if (validator.isEmpty(req.body.username)){
        resm.message = '用户名不能为空!';
        res.send(resm);
        return;
    }
    IsExist({username:req.body.username})
        .then(function (result) {
            if (result == 0){
                resm.status = 1;
                resm.message = '通过验证!';
            }
            resm.status = 1;
            res.send(resm);
        })
        .catch(function (error) {
            res.send(resm);
        });
});

//判断邮箱是否已经被注册
router.post('/confirmEmail', function (req, res) {
    var resm = {status:0, message:'邮箱已被注册!'};
    if (!validator.isEmail(req.body.email)){
        resm.message = '请输入正确的邮箱!';
        res.send(resm);
        return;
    }
    IsExist({email:req.body.email})
        .then(function (result) {
            if (result == 0){
                resm.status = 1;
                resm.message = '通过验证!';
            }
            res.send(resm);
        })
        .catch(function (error) {
            res.send(resm);
        });
});

//验证验证的键对应的值是否存在是否存在
function IsExist(data){
    return new Promise(
        function (resolve, reject) {
            var sql = 'select count(*) as count from user where ';
            for (var key in data){
                sql += key +'="'+data[key]+'" or '
            }
            sql = sql.substring(0,sql.length-4);
            db.querydb(sql)
                .then(function (result) {
                    resolve(result[0].count);
                })
                .catch(function (error) {
                    reject(error);
                })
        }
    )
}
//将router导出
module.exports = router;