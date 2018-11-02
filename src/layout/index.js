import React, {Component} from 'react';
import css from './index.less';
import {DatePicker, Upload, Button } from 'antd';
import { resolve } from 'upath';

import img from '../assets/foo.jpg';

{
    console.log('url:', img);
}

function getDataFromFile(file) {
    return new Promise(resolve => {

        console.log(file);

        //创建读取文件的对象
        var reader = new FileReader();
    
        //为文件读取成功设置事件
        reader.onload=function(e) {
            const rlt = e.target.result;
            resolve(rlt);
            console.log('reader:', reader);
        };
    
        //正式读取文件
        reader.readAsDataURL(file);
    })
}

export default class Layout extends Component {

    state = {
        picUrl: '',
    }

    // getFile = (e) => {
    //     const file = e.target.files[0];
    //     getDataFromFile(file).then(rlt => {
    //         console.log(rlt);
    //         this.setState({
    //             picUrl: rlt,
    //         })
    //     })
    // }

    onChange = e => {
        console.log(e);

        getDataFromFile(e.file.originFileObj).then(rlt => {
            this.setState({
                picUrl: rlt,
            })
        })
    }

    render() {
        const props = {
          className: css.layout,
        };

        return (
            <div {...props}>
                <Upload onChange={this.onChange} showUploadList={false}>
                    <Button/>
                </Upload>
                <div>
                    <img src={this.state.picUrl} />
                </div>
                <div><img src={img}/></div>
            </div>
        );
    }
}