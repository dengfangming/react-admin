import React, { Component } from 'react';
import { Card,Icon,Form,Input,Cascader,InputNumber,Button,message } from 'antd';

import './index.less';
import {reqGetCategories,reqUpdateProduct,reqAddProduct} from "../../../api";
import RichTextEditor from './rich-text-editor';
import PicturesWall from './pictures-wall'

const Item = Form.Item;

@Form.create()
class SaveUpdate extends Component{
    constructor(props) {
        super(props);

        this.state ={
            options: [],
        };
        this.richTextEditor = React.createRef();
    }
    formItemLayout = {
        labelCol: {
            xs:{ span: 24 },
            sm:{ span:2},
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 10 },
        },
    };
    goBack = () => {
        this.props.history.goBack();
    };
    onChange = (value) => {

    };
    submit = (e)=>{
        e.preventDefault();
        this.props.form.validateFields( async (err, values) => {
            if (!err) {
                const { name,desc,price,category} = values;
                const detail = this.richTextEditor.current.state.editorState.toHTML();
                let pCategoryId,categoryId;
                if ( category.length ===1) {
                    pCategoryId = '0';
                    categoryId = category[0];
                } else {
                    pCategoryId = category[0];
                    categoryId = category[1];
                }
                const { location : { state }} = this.props;
                let result = null;
                let msg ='';
                if (state) {
                    result = await reqUpdateProduct({name, desc, price, pCategoryId, categoryId, detail, _id: state._id});
                    msg = '修改商品成功'
                } else {
                    result = await reqAddProduct({name, desc, price, pCategoryId, categoryId, detail});
                    msg = '添加商品成功';
                }
                if (result.status === 0) {
                    message.success(msg);
                    this.props.history.goBack();
                } else {
                    message.error(result.msg);
                }
            }
        })
    };
    loadData = (selectedOptions) =>{
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        this.getCategories(targetOption.value);
    };
    getCategories = async (parentId) => {
        const result = await reqGetCategories(parentId);
        if (result.status ===0 ){
            if (parentId ==='0') {
                this.setState({
                    options: result.data.map((item) => {
                        return{
                            label:item.name,
                            value: item._id,
                            isLeaf:false,
                        }
                    })
                })
            } else{
                this.setState({
                    options: this.state.options.map((option) => {
                        if (option.value === parentId) {
                            // 说明找到了要修改分类
                            option.children = result.data.map((item) => {
                                return {
                                    label: item.name,
                                    value: item._id
                                }
                            });
                            option.loading = false;
                            option.isLeaf = true;
                        }
                        return option;
                    })
                })
            }
        } else{
            message.error(result.msg);
        }
    };
    componentDidMount(){
        this.getCategories('0');
        const { state } = this.props.location;
        if (state){
            const { pCategorgoryId, categoryId} = state;
            if (pCategorgoryId ==='0'){
                this.category = [categoryId]
            } else{
                this.getCategories(pCategorgoryId);
                this.category = [pCategorgoryId,categoryId]
            }
        }
    }
    render() {
        const { options } = this.state;
        const {form: {getFieldDecorator}, location: { state } } = this.props;

        return (
            <Card
                title={<div className="save-update-title" onClick={this.goBack}><Icon className="save-update-icon" type="arrow-left"/>&nbsp;&nbsp;<span>修改商品</span></div>}
            >
                <Form {...this.formItemLayout} onSubmit={this.submit}>
                    <Item label="商品名称">
                        {
                            getFieldDecorator(
                                'name',
                                {
                                    rules: [{required: true, whiteSpace: true, message: '商品名称不能为空'}]
                                }
                            )(<Input placeholder="请输入商品名称"/>)
                        }
                    </Item>
                    <Item label="商品描述">
                        {
                            getFieldDecorator(
                                'desc',
                                {
                                    rules: [{required: true, whiteSpace: true, message: '商品描述不能为空'}]
                                }
                            )(<Input placeholder="请输入商品描述"/>)
                        }
                    </Item>
                    <Item
                        label="选择分类"
                        wrapperCol={{
                            xs: { span: 24 },
                            sm: { span: 5 },
                        }}
                    >
                        {
                            getFieldDecorator(
                                'category',
                                {
                                    rules: [{required: true, message: '请选择商品分类'}]
                                }
                            )(
                                <Cascader
                                    options={options}
                                    onChange={this.onChange}
                                    placeholder="请选择分类"
                                    changeOnSelect
                                    loadData={this.loadData}
                                />
                            )
                        }

                    </Item>
                    <Item
                        label="商品价格"
                        wrapperCol={{
                            xs: { span: 24 },
                            sm: { span: 5 },
                        }}
                    >
                        {
                            getFieldDecorator(
                                'price',
                                {
                                    rules: [{required: true, message: '请输入商品价格'}],
                                    initialValue : state ? state.price : ''
                                }
                            )(
                                <InputNumber
                                    className="save-update-input-number"
                                    formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/￥\s?|(,*)/g, '')}
                                />
                            )
                        }
                    </Item>
                    {
                        state ? <Item label="商品图片">
                            <PicturesWall _id={state._id} imgs={state.imgs}/>
                        </Item> : null
                    }
                    <Item
                        label="商品详情"
                        wrapperCol={{
                            xs: { span: 24 },
                            sm: { span: 21 },
                        }}
                    >
                        <RichTextEditor ref={this.richTextEditor}/>
                    </Item>
                    <Item>
                        <Button type="primary" className="save-update-button" htmlType="submit">提交</Button>
                    </Item>
                </Form>
            </Card>
        );
    }
}
export default SaveUpdate;