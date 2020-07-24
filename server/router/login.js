const express = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const db = require('../database/db.js');

const login = express.Router();

//给出加密种子
const salt = '$2a$10$avJpn7JMVNCBm7mHxHiMlu';
//处理用户登录
login.post('/', function (req, res) {
    var resm = {status:0, message:'用户名或密码不正确!'}
    if (validator.isEmpty(req.body.username) || validator.isEmpty(req.body.password)
        || req.body.password.length<6 || req.body.password.lengh>20){
        res.send(resm);
        return;
    }
    //去数据库查询对应的用户名，并比对密码是否正确
    db.querydb('select * from user where username = "'+req.body.username+'"')
        .then(function (result) {
            if (result.length !== 0 && result[0].password === bcrypt.hashSync(req.body.password, salt)){
                resm.status = 1;
                resm.message = '登录成功!';
                resm.user = {
                    username:result[0].username,
                    nickname:result[0].nickname,
                    email:result[0].email
                };
                req.session.user = resm.user;
                res.send(resm);
            }
            else {
                res.send(resm);
            }
        })
        .catch(function (error) {
            res.send(resm);
        });
});
//判断用户是否登录
login.get('/islogin', function (req, res) {
    var resm = {status:0, message:'该用户未登录!'};
    if (req.session.user){
        resm.status = 1;
        resm.message = '该用户已登录!'
        resm.user = req.session.user;
    }
    res.send(resm);
});
//处理退出登录
login.get('/logout', function (req, res) {
    req.session.user = null;
    res.send({status:1, message:'退出成功!'});
});

module.exports = login;