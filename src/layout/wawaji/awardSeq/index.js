import React from 'react';
import PropTypes from 'prop-types';
import css from './index.less';


const INTERVAL = 1000 / 24;

const ITEM_SIZE = 431;
const BOX_LEFT = 325;
const BOX_TOP = 523;

export default class Seq extends React.Component {
  static propsTypes = {
    sources: PropTypes.Array,
    tickManager: PropTypes.Object,
  };
  static defaultProps = {
    awardItem: {
      id: 1,
      picUrl: '',
      descHeader: '恭喜获得 20元天猫优惠券',
      descFooter: '手淘扫码，即可领取优惠券 惊喜优惠尽在babycare天猫旗舰店',
    }
  };
  currentIndex = -1;
  currentTime = +new Date();

  constructor(props) {
    super(props);
    const {sources: {itemBox, firstSeq, awardSeq}} = props;
    this.state = {
      displayAward: false,
    };
    this.itemBoxImage = this.generateItemBoxImage(itemBox);
    this.firstSeq = firstSeq.slice();
    this.awardSeq = awardSeq.slice();
    this.canvasDom = React.createRef();
  }

  generateItemBoxImage = (o) => {
    const _obj = {};
    for (const i of Object.keys(o)) {
      _obj[i] = new Image();
      _obj[i].src = o[i];
    }
    return _obj;
  };

  componentDidMount() {
    this.props.tickManager.add(this.playFirstSeq);
  }

  playFirstSeq = () => {
    if (+new Date() - this.currentTime < INTERVAL) {
      return;
    }

    const frame = this.firstSeq.shift();
    if (!frame) {
      this.props.tickManager.remove(this.playFirstSeq);
      return;
    }

    const {current} = this.canvasDom;
    const ctx = current.getContext('2d');
    ctx.clearRect(0, 0, 1080, 1920);    // 清除上一帧
    ctx.drawImage(frame, 0, 0, 1080, 1920);    // 绘制帧
    if (this.firstSeq.length === 0) {
      // 渲染本次序列帧最后一次时
      ctx.drawImage(this.itemBoxImage.mainUrl, BOX_LEFT, BOX_TOP, ITEM_SIZE, ITEM_SIZE);    // 绘制帧
    }

    this.currentTime = +new Date();
  };

  onClickBox = e => {
    if (this.collide(e) && !this.played) {
      this.flushOpenBox();
      setTimeout(() => {
        this.props.tickManager.add(this.playAwardSeq);
      }, 1000);
    }
  };

  collide = ({clientX, clientY}) => {
    if (clientX > BOX_LEFT && clientX < BOX_LEFT + ITEM_SIZE) {
      if (clientY > BOX_TOP && clientY < BOX_TOP + ITEM_SIZE) {
        return true;
      }
    }
    return false;
  };

  flushOpenBox = () => {
    const lastFrame = this.props.sources.firstSeq;
    const {current} = this.canvasDom;
    const ctx = current.getContext('2d');
    ctx.clearRect(0, 0, 1080, 1920);    // 清除上一帧
    ctx.drawImage(lastFrame[lastFrame.length - 1], 0, 0, 1080, 1920);    // 绘制上次动画的最后一帧
    ctx.drawImage(this.itemBoxImage.openUrl, BOX_LEFT, BOX_TOP, ITEM_SIZE, ITEM_SIZE);    // 绘制帧
  };

  playAwardSeq = () => {
    if (+new Date() - this.currentTime < INTERVAL) {
      return;
    }
    const frame = this.awardSeq.shift();
    if (!frame) {
      this.props.tickManager.remove(this.playAwardSeq);
      return;
    }
    const {current} = this.canvasDom;
    const ctx = current.getContext('2d');
    ctx.clearRect(0, 0, 1080, 1920);    // 清除上一帧
    ctx.drawImage(frame, 0, 0, 1080, 1920);    // 绘制帧
    if (this.awardSeq.length === 0) {
      // 渲染本次序列帧最后一次时
      this.played = true;
      this.showAward();
    }

    this.currentTime = +new Date();
  };

  showAward = () => {
    this.setState({
      displayAward: true,
    });
    console.log('todo: 绘制奖品');
    // todo：奖品描述
  };

  renderAwardItem = () => {
    const buttonProps = {
      style: {
        position: 'absolute',
        bottom: 0,
        width: 50,
        height: 50,
        backgroundColor: 'yellow',
      },
      onClick: this.props.onClick,
    };
    return (
      <div {...buttonProps} />
    );
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
      onClick: this.onClickBox
    };

    return (
      <div {...props}>
        <canvas {...canvasProps} />
        {this.state.displayAward && this.renderAwardItem()}
      </div>
    );
  }
}
