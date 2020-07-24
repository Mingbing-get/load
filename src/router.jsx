import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, message } from 'antd';

import { connect } from 'react-redux';
import { urlChange } from "./redux/action/touterUrl.js";
import { login, logout } from './redux/action/login.js';

class router extends React.Component{
    componentDidMount(){
        this.props.urlChange(window.location.hash.substring(2) || 'home');
        //判断用户是否已经登录
        fetch('/login/islogin')
            .then(res=>res.json())
            .then(data=>{
                if (data.status === 1){
                    this.props.login(data.user);
                }
            })
            .catch(error=>{
                console.log(error);
            });
    }

    menuClick = (e)=>{
        this.props.urlChange(e.key);
    }

    logout = ()=>{
        //清除服务端保存的登录状态
        fetch('/login/logout')
            .then(res=>res.json())
            .then(data=>{
                if (data.status === 1){
                    this.props.logout();
                    //跳转到登录页面
                    this.props.urlChange('load');
                    message.destroy();
                    message.success(data.message);
                }
            })
            .catch(error=>{
                message.destroy();
                message.error('退出失败!');
            });
    }

    islogin(){
        if (this.props.user.login){
            return(
                <Link onClick={ this.logout } to='/load'>退出</Link>
            );
        }
        else {
            return (
                <Link to='/load'>登录</Link>
            );
        }
    }

    showRegester(){
        if (!this.props.user.login){
            return (
                <Menu.Item key="regeter">
                    <Link to='/regeter'>注册</Link>
                </Menu.Item>
            );
        }
        return '';
    }

    render() {
        return (
            <Menu mode="horizontal" onClick={this.menuClick} selectedKeys={ this.props.routerUrl } style={{marginBottom:"20px"}}>
                <Menu.Item key="home">
                    <Link to='/'>主页</Link>
                </Menu.Item>
                <Menu.Item key="load">
                    {this.islogin()}
                </Menu.Item>
                {this.showRegester()}
            </Menu>
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
        logout:()=>{ dispatch(logout()) },
        login:(user)=>{ dispatch(login(user)) },
    }
}

router = connect(mapStateToProps, mapDispatchToProps)(router);
export default router;