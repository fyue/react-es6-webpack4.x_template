import React, {Component} from 'react';
import css from './index.less';
import {DatePicker } from 'antd';

export default class Layout extends Component {

    render() {
        const props = {
          className: css.layout,
        };

        return (
            <div {...props}>
                Hello!
                <DatePicker/>
            </div>
        );
    }
}