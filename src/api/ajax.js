import axios from 'axios';
import {message} from 'antd';

export default function ajax(url,data={},method = 'GET') {
    method = method.toUpperCase();

    let promise = null;

    if (method === 'GET'){
        promise = axios.get(url,{
            params: data
        })
    } else {
        promise = axios.post(url,data)
    }
    return promise
        .then(res =>{
            return res.data;

        })
        .catch(err =>{
            message.error('网络出现异常,请刷新重试~',2);

        })
}