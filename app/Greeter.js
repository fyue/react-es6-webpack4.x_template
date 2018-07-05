import React, {Component} from 'react'
import config from './config.json';
import styles from './Greeter.less';

function decorator(Com) {
    return class extends Component {
        render() {
            return <Com {...this.props} />
        }
    }
}

@decorator
class Greeter extends Component {

    test2 = async () => {
        return 1;
    };

    *haha() {
        const a = yield 1;
        yield a;
    }

    test1 = () => {
        console.log('test1');
        const t = this.haha();
        console.log(t.next(5));
        console.log(t.next());

        console.log({...{a:1, b:2}}.b);
        const [a] = [1];
        console.log('a:', a);
    };

    componentDidMount() {
        this.test1();
        console.log(this.test2());
        console.log([1].includes(1));
    }

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
