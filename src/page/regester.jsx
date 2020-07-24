import React from 'react';
import validator from 'validator';
import { Form, Input, Button, Typography, Row, message } from 'antd';

import { connect } from 'react-redux';
import { urlChange } from "../redux/action/touterUrl.js";

const { Title } = Typography;

class regester extends React.Component{
    constructor(){
        super();
        this.state = {
            username:'',
            checkUserName:'',
            messageUserName:'',
            password:'',
            checkPassWord:'',
            messagePassWord:'',
            nickname:'',
            checkNickname:'',
            messageNickname:'',
            email:'',
            checkEmail:'',
            messageEmail:'',
            confirmPassword:'',
            checkConfirmPassword:'',
            messageConfirmPassword:'',
            btndisable:true
        }
    }

    //注册按钮点击事件
    regestClick = (e)=>{
        e.preventDefault();
        this.setState({
            btndisable:true
        });
        let data = {
            username:this.state.username,
            nickname:this.state.nickname,
            email:this.state.email,
            password:this.state.password,
            confirmPassword:this.state.confirmPassword
        };
        fetch('/regester/add', {
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
            .catch(error=>{
                message.destroy();
                message.error('注册失败!');
            })
            .then(data=>{
                if (data.status === 1){
                    this.props.history.push('/load');
                    //跳转的同时，redux中的路由值，保证导航条同步
                    this.props.urlChange('load');
                    message.destroy();
                    message.success('注册成功!');
                }
                else if (data.status === 0){
                    message.destroy();
                    message.error(data.message);
                }
                else{
                    message.destroy();
                    message.error('注册失败!');
                }
            });
    }
    //输入框内容改变事件
    inpueChange = (e)=>{
        let value = e.target.value;
        if (e.target.name === "username"){
            this.setState({
                username : value,
                btndisable : !(value && this.state.password.length>=6 && this.state.password.length<=20 && this.state.nickname.length>=1
                    && this.state.nickname.length<=8 && validator.isEmail(this.state.email) && this.state.password === this.state.confirmPassword)
            });
        }
        else if (e.target.name === "email"){
            this.setState({
                email : value,
                btndisable : !(this.state.username && this.state.password.length>=6 && this.state.password.length<=20 && this.state.nickname.length>=1
                    && this.state.nickname.length<=8 && validator.isEmail(value) && this.state.password === this.state.confirmPassword)
            });
        }
        else if (e.target.name === "password"){
            this.setState({
                password : value,
                btndisable : !(this.state.username && value.length>=6 && value.length<=20 && this.state.nickname.length>=1
                    && this.state.nickname.length<=8 && validator.isEmail(this.state.email) && value === this.state.confirmPassword)
            });
        }
        else if (e.target.name === "confirmPassword"){
            this.setState({
                confirmPassword : value,
                btndisable : !(this.state.username && value.length>=6 && value.length<=20 && this.state.nickname.length>=1
                    && this.state.nickname.length<=8 && validator.isEmail(this.state.email) && this.state.password === value)
            });
        }
        else if (e.target.name === "nickname"){
            this.setState({
                nickname : value,
                btndisable : !(this.state.username && this.state.password.length>=6 && this.state.password.length<=20 && value.length>=1
                    && value.length<=8 && validator.isEmail(this.state.email) && this.state.password === this.state.confirmPassword)
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
            return;
        }
        fetch('/regester/confirmUsername', {
            method:'post',
            body:JSON.stringify({username:this.state.username}),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
            .then(res=>res.json())
            .catch(error=>{
                this.setState({
                    checkUserName:'error',
                    messageUserName:'该用户已存在!'
                });
            })
            .then(data=>{
                this.setState({
                    checkUserName:data.status===1?'success':'error',
                    messageUserName:data.message
                });
            });
    }
    //邮箱输入框失去焦点
    emailBlur = (e)=>{
        var value = this.state.email;
        if (validator.isEmpty(value)){
            this.setState({
                checkEmail:'error',
                messageEmail:'邮箱不能为空!'
            });
            return;
        }
        if (!validator.isEmail(value)){
            this.setState({
                checkEmail:'error',
                messageEmail:'请输入正确的邮箱!'
            });
            return;
        }
        fetch('/regester/confirmEmail', {
            method:'post',
            body:JSON.stringify({email:value}),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
            .then(res=>res.json())
            .catch(error=>{
                this.setState({
                    checkEmail:'error',
                    messageEmail:'该邮箱已被注册!'
                });
            })
            .then(data=>{
                this.setState({
                    checkEmail:data.status===1?'success':'error',
                    messageEmail:data.message
                });
            });
    }
    //昵称框失去焦点
    nicknameBlur = (e)=>{
        if (validator.isEmpty(this.state.nickname)){
            this.setState({
                checkNickname:'error',
                messageNickname:'昵称不能为空!'
            });
        }
        else if (this.state.nickname.length>8){
            this.setState({
                checkNickname:'error',
                messageNickname:'昵称不能超过8位!'
            });
        }
        else {
            this.setState({
                checkNickname:'success',
                messageNickname:''
            });
        }
    }
    //输入密码框失去焦点
    passwordBlur = (e)=>{
        if (this.state.password.length<6 || this.state.password.length>20){
            this.setState({
                checkPassWord:'error',
                messagePassWord:'密码长度为(6~20位)!'
            });
        }
        else {
            this.setState({
                checkPassWord:'success',
                messagePassWord:''
            });
        }
    }
    //确认密码框失去焦点
    confirmPasswordBlur = (e)=>{
        if (this.state.password.length<6 || this.state.password.length>20){
            this.setState({
                checkConfirmPassword:'error',
                messageConfirmPassword:'密码长度为(6~20位)!'
            });
        }
        else if(this.state.confirmPassword !== this.state.password){
            this.setState({
                checkConfirmPassword:'error',
                messageConfirmPassword:'两次密码不同!'
            });
        }
        else {
            this.setState({
                checkConfirmPassword:'success',
                messageConfirmPassword:''
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
                    <Title level={2} type="secondary">用户注册</Title>
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
                        label="昵称"
                        name="nickname"
                        hasFeedback
                        validateStatus={ this.state.checkNickname }
                        help={this.state.checkNickname ? this.state.messageNickname : null}
                        rules={[{ required: true}]}
                    >
                        <Input name="nickname" onChange={ this.inpueChange } onBlur={ this.nicknameBlur } placeholder="请输入昵称"/>
                    </Form.Item>

                    <Form.Item
                        label="邮箱"
                        name="email"
                        hasFeedback
                        validateStatus={ this.state.checkEmail }
                        help={this.state.checkEmail ? this.state.messageEmail : null}
                        rules={[{ required: true}]}
                    >
                        <Input name="email" onChange={ this.inpueChange } onBlur={ this.emailBlur } placeholder="请输入邮箱"/>
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

                    <Form.Item
                        label="确认密码"
                        name="confirmPassword"
                        hasFeedback
                        validateStatus={ this.state.checkConfirmPassword }
                        help={this.state.checkConfirmPassword ? this.state.messageConfirmPassword : null}
                        rules={[{ required: true}]}
                    >
                        <Input.Password name="confirmPassword" onChange={ this.inpueChange } onBlur={ this.confirmPasswordBlur } placeholder="请再次输入密码"/>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" disabled={this.state.btndisable || this.state.checkUserName === 'error'} onClick={ this.regestClick } htmlType="submit">
                            注册
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        routerUrl: state.routerReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        urlChange:(text)=>{ dispatch(urlChange(text)) }
    }
}

regester = connect(mapStateToProps, mapDispatchToProps)(regester);
export default regester;