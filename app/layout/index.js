import React, {Component} from 'react';
import css from './index.less';

export default class Layout extends Component {
    render() {
        const props = {
          className: css.layout,
        };
        return (
            <div {...props}>
                Hello!
            </div>
        );
    }
}
