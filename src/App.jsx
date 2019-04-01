import React, {Component} from 'react'
import { Switch, Route,Redirect} from 'react-router-dom'
import './assets/reset.less'

import Login from "./pages/login";
import Admin from "./pages/admin";

export default class App extends  Component{
    render(){
        return(
                <Switch>
                    <Route path='/login' component={Login}/>
                    <Route path='/admin' component={Admin}/>
                    <Redirect to='/login' />
                </Switch>
        )
    }
}