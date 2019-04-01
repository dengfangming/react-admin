import React,{Component} from 'react'
import {Form, Icon, Input, Button} from 'antd';

import logo from './logo.png'
import './index.less'


@Form.create()
 class Login extends Component{
    render(){
        const Item = Form.Item;
        const { getFieldDecorator } = this.props.form;
        return(
            <div className='login'>
               <div className="login-hander">
                   <img src={logo} alt="logo"/>
                   <h1>React项目: 后台管理系统</h1>
               </div>
                <section className="login-content">
                    <h3>用户登录</h3>
                    <Form onSubmit={this.login} className="login-form">

                            <Item>
                            {getFieldDecorator('userName', {
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: '必须输入用户名'},
                                    {min:4,message:'用户名必须大于4位'},
                                    {max:12,message:'用户名必须小于12位'},
                                    {pattern: /^[a-zA-Z0-9_]+$/,message:'用户名必须是英文,数字或下划线组成'}
                                ],
                            })(
                                <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} type="username" placeholder="用户名"/>
                            )}
                        </Item>
                        <Item>
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: '必须输入密码'},
                                    {min:4,message:'密码必须大于4位'},
                                    {max:12,message:'密码必须小于12位'},
                                    {pattern: /^[a-zA-Z0-9_]+$/,message:'密码必须是英文,数字或下划线组成'}
                                ],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password" placeholder="密码"/>
                            )}

                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Item>
                    </Form>
                </section>
            </div>
        )
    }
}
export default Login