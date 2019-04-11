import React,{Component,Fragment} from 'react';
import { Card, Button, Table, Radio, Modal, message} from 'antd';
import dayjs from 'dayjs';

import AddRoleForm from './add-role-form';
import UpdateRoleForm from './update-role-form';
import {reqRoleList,reqAddRole, reqUpdateRole} from '../../api';
import memory from '../../utils/memory-utils';

const RadioGroup =Radio.Group;

export default class Role extends Component{
    constructor(props){
        super(props);
            this.state = {
                value: '',
                roles: [],
                isShowAddRoleModal: false,
                isShowUpdateRoleModal: false,
                isDisabled: true,
                role: {},
        };

        this.addRoleForm = React.createRef();
        this.updateRoleForm = React.createRef();
    }
    columns = [
        {
            dataIndex: '_id',
            render: id => <Radio value={id} />
        },
        {
            title: '角色名称',
            dataIndex: 'name',
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '授权时间',
            dataIndex: 'auth_time',
            render: (time) => time && dayjs(time).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '授权人',
            dataIndex: 'auth_name',
        }
    ];

    onRadioChange = (e)=>{
        const value = e.target.value;
        const role = this.state.roles.find((role) => role._id === value );
        this.setState({
            value,
            isDisabeld: false,
            role
        })
    };
    changeModal = (name, flag) =>{
        return ()=> {
            this.setState({[name]: flag})
        }
    };
    handleAddRole = () => {
      const { validateFields, resetFields } = this.addRoleForm.current;

      validateFields(async (err,values) => {
          if (!err) {
              const {name} = values;
              const result = await reqAddRole(name);
              if (result.status === 0){
                  this.setState({
                      roles : [...this.state.roles, result.data],
                      isShowAddRoleModal: false
                  });
                  resetFields();
              } else{
                  message.error(result.msg);
              }
          }
      })
    };
    handleUpdateRole = async () => {
        const { role } = this.state;
        role.auth_time = Date.now();
        role.auth_name = memory.user.username;
        // 发送请求
        const result = await reqUpdateRole(role);
        if (result.status === 0) {
            this.setState({
                roles: this.state.roles.map((item) => {
                    if (item._id === role._id) {
                        return role;
                    }
                    return item;
                }),
                isShowUpdateRoleModal: false
            })
        } else {
            message.error(result.msg);
        }
    };

    getRoleList = async () => {
        const result = await reqRoleList();
        if (result.status === 0) {
            this.setState({
                roles: result.data
            })
        } else {
            message.error(result.msg);
        }
    };

    updateRole = (menus) => {
        this.setState({
            role: {...this.state.role, menus}
        })
    };

    componentDidMount() {
        this.getRoleList();
    }

    render () {
        const { roles, value, isDisabled, isShowAddRoleModal, isShowUpdateRoleModal, role } = this.state;

        return (
            <Card
                title={
                    <Fragment>
                        <Button type='primary' onClick={this.changeModal('isShowAddRoleModal', true)}>创建角色</Button> &nbsp;&nbsp;
                        <Button type='primary' disabled={isDisabled} onClick={this.changeModal('isShowUpdateRoleModal', true)}>设置角色权限</Button>
                    </Fragment>
                }
            >
                <RadioGroup onChange={this.onRadioChange} value={value} style={{width: '100%'}}>
                    <Table
                        columns={this.columns}
                        dataSource={roles}
                        bordered
                        rowKey='_id'
                        pagination={{
                            defaultPageSize: 5,
                            showSizeChanger: true,
                            pageSizeOptions: ['5', '10', '15', '20'],
                            showQuickJumper: true,
                        }}
                    />
                </RadioGroup>

                <Modal
                    title="创建角色"
                    visible={isShowAddRoleModal}
                    onOk={this.handleAddRole}
                    onCancel={this.changeModal('isShowAddRoleModal', false)}
                    okText='确认'
                    cancelText='取消'
                >
                    <AddRoleForm ref={this.addRoleForm}/>
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={isShowUpdateRoleModal}
                    onOk={this.handleUpdateRole}
                    onCancel={this.changeModal('isShowUpdateRoleModal', false)}
                    okText='确认'
                    cancelText='取消'
                >
                    <UpdateRoleForm ref={this.updateRoleForm} role={role} updateRole={this.updateRole}/>
                </Modal>

            </Card>
        )
    }
}