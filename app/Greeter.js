import React, {Component} from 'react'
import config from './config.json';
import styles from './Greeter.less';//导入

class Greeter extends Component{
    render() {
        console.log('render!!!');
        return (
            <div className={styles.root}>
                {config.greetText}
            </div>
        );
    }
}

export default Greeter;
