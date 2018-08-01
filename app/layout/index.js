import React, {Component} from 'react';
import css from './index.less';
import Test from './test';

export default class Layout extends Component {
    render() {
        const props = {
          className: css.layout,
        };
        return (
            <div {...props}>
                <Test />
            </div>
        );
    }
}
