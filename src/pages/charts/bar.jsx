import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class Bar extends Component {

    getOption = () => {
        return {
            xAxis: {
                type: 'category',
                data: ['衬衫1', '羊毛衫1', '雪纺衫1', '裤子1', '高跟鞋1','袜子1']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [5, 20, 35, 10, 10, 20],
                type: 'bar'
            }]
        };
    };
    render() {
        return <ReactEcharts option={this.getOption()}/>;
    }
}