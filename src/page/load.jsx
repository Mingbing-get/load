import React from 'react';
import validator from 'validator';
import { Form, Input, Button, Typography, Row, message } from 'antd';

import { connect } from 'react-redux';
import { urlChange } from "../redux/action/touterUrl.js";
import { login } from '../redux/action/login.js';

const { Title } = Typography;

class load extends React.Component{
    constructor(){
        super();
        this.state = {
            username:'',
            checkUserName:'',
            messageUserName:'',
            password:'',
            checkPassWord:'',
            messagePassWord:'',
            btndisable:true
        }
    }
    //登录按钮点击事件
    loadClick = (e)=>{
        e.preventDefault();
        this.setState({
            btndisable:true
        });
        let data = {
            username:this.state.username,
            password:this.state.password
        };
        fetch('/login', {
            method:'post',
            body:JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
            .then(res=>{
                this.setState({
                    btndisable:false
                });
                return res.json();
            })
            .then(data=>{
                if (data.status === 1){
                    this.props.history.push('/');
                    //跳转的同时，redux中的路由值，保证导航条同步
                    this.props.urlChange('home');
                    this.props.login(data.user);
                    message.destroy();
                    message.success("登录成功!");
                }
                else {
                    message.destroy();
                    message.error(data.message);
                }
            })
            .catch(function (error) {
                message.destroy();
                message.error("登录失败!");
            });
    }
    //输入框内容改变事件
    inpueChange = (e)=>{
        let value = e.target.value;
        if (e.target.name === "username"){
            this.setState({
                username : value,
                btndisable : !(value && this.state.password.length>=6 && this.state.password.length<=20)
            });
        }
        else if (e.target.name === "password"){
            this.setState({
                password : value,
                btndisable : !(this.state.username && value.length>=6 && value.length<=20)
            });
        }
    }
    //用户名输入框失去焦点事件
    usernameBlur = (e)=>{
        if (validator.isEmpty(this.state.username)){
            this.setState({
                checkUserName:'error',
                messageUserName:'用户名不能为空!'
            });
        }
        else {
            this.setState({
                checkUserName:'success',
                messageUserName:''
            });
        }
    }
    //密码输入框失去焦点
    passwordBlur = (e)=>{
        if (validator.isEmpty(this.state.password)){
            this.setState({
                checkPassWord:'error',
                messagePassWord:'密码不能为空!'
            });
        }
        else if (this.state.password.length < 6 || this.state.password.length > 20){
            this.setState({
                checkPassWord:'error',
                messagePassWord:'密码长度为(6~20)位!'
            });
        }
        else {
            this.setState({
                checkPassWord:'success',
                messagePassWord:''
            });
        }
    }

    render(){
        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        };
        const tailLayout = {
            wrapperCol: { offset: 4, span: 16 },
        };

        return (
            <div>
                <Row justify="center">
                    <Title level={2} type="secondary">用户登录</Title>
                </Row>
                <Form
                    {...layout}
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        hasFeedback
                        validateStatus={ this.state.checkUserName }
                        help={this.state.checkUserName ? this.state.messageUserName : null}
                        rules={[{ required: true}]}
                    >
                        <Input name="username" onChange={ this.inpueChange } onBlur={ this.usernameBlur } placeholder="请输入用户名"/>
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        hasFeedback
                        validateStatus={ this.state.checkPassWord }
                        help={this.state.checkPassWord ? this.state.messagePassWord : null}
                        rules={[{ required: true}]}
                    >
                        <Input.Password name="password" onChange={ this.inpueChange } onBlur={ this.passwordBlur } placeholder="请输入密码(6~20位)"/>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" disabled={this.state.btndisable || this.state.checkUserName === 'error'} onClick={ this.loadClick } htmlType="submit">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        routerUrl: state.routerReducer,
        user: state.loginReducer,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        urlChange:(text)=>{ dispatch(urlChange(text)) },
        login:(user)=>{ dispatch(login(user)) },
    }
}

load = connect(mapStateToProps, mapDispatchToProps)(load);
export default load;