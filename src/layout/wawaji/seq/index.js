import React from 'react';
import PropTypes from 'prop-types';
import css from './index.less';

const INTERVAL = 1000 / 24;

export default class Seq extends React.Component {
  static propsTypes = {
    sources: PropTypes.Array,
    tickManager: PropTypes.Object,

  };
  static defaultProps = {};

  currentIndex = -1;
  currentTime = +new Date();

  constructor(props) {
    super(props);
    this.state = {};
    this.canvasDom = React.createRef();
  }

  componentWillUnmount() {
    this.props.tickManager.remove(this.updateScene);
  }

  componentDidMount() {
    this.props.tickManager.add(this.updateScene);
  }

  updateScene = () => {
    if (+new Date() - this.currentTime < INTERVAL) {
      return;
    }

    const {current} = this.canvasDom;
    const {sources} = this.props;
    if (this.currentIndex === sources.length - 1) {
      this.currentIndex = 0;
    } else {
      ++this.currentIndex;
    }

    const ctx = current.getContext('2d');
    ctx.clearRect(0, 0, 1080, 1920);    // 清除上一帧
    ctx.drawImage(sources[this.currentIndex], 0, 0, 1080, 1920);    // 绘制帧

    this.currentTime = +new Date();
  };

  render() {
    const props = {
      style: {
        position: 'absolute',
        width: '100%',
        height: '100%',
      }
    };
    const canvasProps = {
      width: '1080',
      height: '1920',
      style: {
        position: 'absolute',
        width: '100%',
        height: '100%',
      },
      ref: this.canvasDom,
    };
    return (
      <div {...props}>
        <canvas {...canvasProps} />
      </div>
    );
  }
}
