import jsonp from 'jsonp'
import ajax from './ajax';

const prefix = process.env.NODE_ENV === 'development'? 'http://localhost:3000' : 'http://localhost:5000';

export const reqLogin = (username, password) => ajax(prefix + '/login', {username, password}, 'POST');

export const reqWeather = (city) => {
    return new Promise((resolve,reject) => {
        jsonp(
            `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`,
            (err,data) => {
                if (!err){
                    const { dayPictureUrl,weather } = data.results[0].weather_data[0];
                    resolve({weather,weatherImg: dayPictureUrl});
                } else{
                    reject('请求失败,网络不稳定');
                }
            }
        )
    })
};

export const reqGetCategories = (parentId) => ajax(prefix + '/manage/category/list', {parentId});

export const reqAddCategory = (parentId, categoryName) => ajax(prefix + '/manage/category/add', {parentId, categoryName}, 'POST');

export const reqUpdateCategoryName = (categoryId, categoryName) => ajax(prefix + '/manage/category/update', {categoryId, categoryName}, 'POST');

export const reqGetProducts = (pageNum, pageSize) => ajax(prefix + '/manage/product/list', { pageNum, pageSize });