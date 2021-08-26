import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import css from './index.less';
import classnames from 'classnames';
import Seq from './seq';
import AwardSeq from './awardSeq';

const SPEED = 5;

const BOX_WIDTH = 914;
const BOX_HEIGHT = 882;

// 箱子
const ITEM_WIDTH = 220;
const ITEM_HEIGHT = 220;
const ITEM_SPAN = 60 + ITEM_WIDTH;
const ITEM_BOTTOM = 50;

// 吊钩
const HANGER_WIDTH = 399;
const HANGER_INIT_BOTTOM = 550;
const DRAG_WITH_NONE_DURATION = 1.5;
const DRAG_WITH_ITEM_DURATION = 3;

// 下降距离
const DROP_SPAN = 500;

// 碰撞点：
const POINT_Y = 125;

const requestFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };

import bg from './images/bg.jpg';
import b1 from './images/b1.png';
import b2 from './images/b2.png';
import b3 from './images/b3.png';
import itemBottom from './images/boxBottom.png';
import hanger1 from './images/hanger1.png';
import hanger2 from './images/hanger2.png';
import hanger3 from './images/hanger3.png';
import buttonUp from './images/buttonUp.png';
import buttonDown from './images/buttonDown.png';

// const bottomSeqImages = new Array(19).fill(0).map((_i, idx) => {
//   const img = new Image();
//   img.src = `/sources/bottomSeq/bottomSeq${idx}.png`;
//   return img;
// });
//
// const firstSeqImages = new Array(38).fill(0).map((_i, idx) => {
//   const img = new Image();
//   img.src = `/sources/firstSeq/firstSeq${idx}.png`;
//   return img;
// });

export default class Wawaji extends React.Component {

  hangerPointPosition = {left: -1, bottom: -1};
  tweens = [];
  stopTicker = false;
  isPlaying = false;

  static defaultProps = {

  };

  constructor(props) {
    super(props);
    this.state = {
      showAward: false,
      sItem: {},
    };
    this.itemRefs = props.items.map(() => ({
      itemRef: React.createRef(),
      itemBottomRef: React.createRef(),
    }));
    this.hangerRef = React.createRef();
    this.buttonRef = React.createRef();
  }

  componentDidMount() {
    this.initItemPosition();
    this.initHanger();
    this.initButton();
    this.beginTicker();

    this.addTween(this.updateItemsPosition);
  }

  // 初始化DOM
  initItemPosition = () => {
    this.itemRefs.forEach(({itemRef, itemBottomRef}, idx) => {
      itemRef.current.style.left = `${ITEM_SPAN * idx}px`;
      itemBottomRef.current.style.left = `${ITEM_SPAN * idx}px`;
      itemRef.current.style.bottom = `${ITEM_BOTTOM}px`;
    });
  };

  initButton = () => {
    const {current} = this.buttonRef;
    current.src = buttonUp;
  };

  initHanger = () => {
    const {current} = this.hangerRef;
    current.style.bottom = `${HANGER_INIT_BOTTOM}px`;
    current.src = hanger1;
  };

  // Ticker方法
  beginTicker = () => {
    const ticker = () => {
      if (this.stopTicker) {
        return;
      }
      for (const tweenFuc of this.tweens) {
        if (tweenFuc) {
          tweenFuc();
        }
      }
      requestFrame(ticker);
    };
    requestFrame(ticker);
  };

  addTween = (t) => {
    if (this.tweens.includes(t)) return;
    this.tweens.push(t);
  };

  removeTween = (t) => {
    this.tweens = this.tweens.filter(i => i !== t);
  };

  // 互动逻辑
  updateItemsPosition = () => {
    this.itemRefs.forEach(({itemRef, itemBottomRef}, idx) => {
      if (parseInt(itemRef.current.style.left) >= ITEM_SPAN * (this.itemRefs.length - 1)) {
        itemRef.current.style.left = `${-ITEM_SPAN}px`;
        itemBottomRef.current.style.left = `${-ITEM_SPAN}px`;
      } else {
        itemRef.current.style.left = `${parseInt(itemRef.current.style.left) + SPEED}px`;
        itemBottomRef.current.style.left = `${parseInt(itemBottomRef.current.style.left) + SPEED}px`;
      }
    });
  };

  dropHanger = () => {
    if (this.isPlaying) {
      return;
    }
    this.buttonRef.current.src = buttonDown;

    const hangerDom = this.hangerRef.current;
    hangerDom.src = hanger2;

    JT.to(hangerDom, DRAG_WITH_NONE_DURATION, {
      bottom: HANGER_INIT_BOTTOM - DROP_SPAN,
      ease: JT.Quad.In,
      onEnd: () => {
        // 更新击中点位置
        this.hangerPointPosition.left = parseInt(hangerDom.style.left) + HANGER_WIDTH / 2;
        this.hangerPointPosition.bottom = POINT_Y;
        this.checkCollision();
      },
    });
    this.isPlaying = true;
  };

  checkCollision = () => {
    const itemCollided = this.findItemHitted();
    if (itemCollided) {
      this.removeTween(this.updateItemsPosition);
      this.raiseHangerWithItem(itemCollided);
    } else {
      this.raiseHangerWithNone();
    }
  };

  syncSelectedItemWithUrl = url => {
    const primitiveUrl = /\/sources\/.*png$/.exec(url)[0];
    const sItem = this.props.items.find(i => i.mainUrl === primitiveUrl);
    console.log(sItem);
    this.setState({
      sItem,
    });
  };

  findItemHitted = () => {
    const {left: pLeft} = this.hangerPointPosition;
    for (const {itemRef} of this.itemRefs) {
      const {style: {left, width}} = itemRef.current;
      if (pLeft > parseInt(left) && pLeft < parseInt(left) + parseInt(width)) {
        this.syncSelectedItemWithUrl(itemRef.current.src);
        return itemRef.current;
      }
    }
  };

  raiseHangerWithNone = () => {
    const hangerDom = this.hangerRef.current;
    hangerDom.src = hanger1;
    JT.to(hangerDom, DRAG_WITH_NONE_DURATION, {
      bottom: HANGER_INIT_BOTTOM,
      ease: JT.Quad.Out,
      onEnd: () => {
        this.isPlaying = false;
        this.buttonRef.current.src = buttonUp;
      }
    });
  };

  raiseHangerWithItem = (item) => {
    // 同步一次被击中项的起始上升位置
    const {style: {width, height}} = item;
    item.style.left = `${this.hangerPointPosition.left - parseInt(width) / 2 - 5}px`;
    item.style.bottom = `${this.hangerPointPosition.bottom - parseInt(height) / 2}px`;

    const hangerDom = this.hangerRef.current;
    hangerDom.src = hanger3;
    const upSpan = HANGER_INIT_BOTTOM - parseInt(hangerDom.style.bottom);

    // 上升
    JT.to(hangerDom, DRAG_WITH_ITEM_DURATION, {
      bottom: HANGER_INIT_BOTTOM,
      ease: JT.Quad.Out,
    });

    JT.to(item, DRAG_WITH_ITEM_DURATION, {
      bottom: upSpan + parseInt(item.style.bottom),
      ease: JT.Quad.Out,
      onEnd: () => {
        this.setState({
          showAward: true,
        });
      },
    });
  };

  resetToFlow = () => {
    this.isPlaying = false;
    this.buttonRef.current.src = buttonUp;
    this.initItemPosition();
    this.addTween(this.updateItemsPosition);
  };

  renderHanger = () => {
    const props = {
      key: 'hanger',
      ref: this.hangerRef,
      style: {
        position: 'absolute',
        width: HANGER_WIDTH,
        left: (BOX_WIDTH - HANGER_WIDTH) / 2,
      },
    };
    return <img {...props} />;
  };

  renderItems = () => {
    const {items} = this.props;
    return (
      items.map((i, idx) => {
        const itemProps = {
          key: `item_${idx}`,
          ref: this.itemRefs[idx].itemRef,
          src: i.mainUrl,
          style: {
            position: 'absolute',
            bottom: 50,
            width: ITEM_WIDTH,
            height: ITEM_HEIGHT,
          },
        };

        const itemBottomProps = {
          key: `item_bottom_${idx}`,
          ref: this.itemRefs[idx].itemBottomRef,
          src: itemBottom,
          style: {
            position: 'absolute',
            bottom: -5,
            width: ITEM_WIDTH,
          },
        };

        return (
          <Fragment key={`fragmentWrapper${idx}`}>
            <img {...itemBottomProps}/>
            <img {...itemProps}/>
          </Fragment>
        );
      })
    );
  };

  render() {
    const wrapper = {
      style: {
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundImage: `url(${bg})`,
        backgroundSize: '100% 100%',
      }
    };
    const mainBoxProps = {
      style: {
        position: 'absolute',
        left: 84,
        bottom: 582,
        width: BOX_WIDTH,
        height: BOX_HEIGHT,
        overflow: 'hidden',
      }
    };
    const buttonProps = {
      ref: this.buttonRef,
      style: {
        position: 'absolute',
        left: 405,
        bottom: 260,
      },
      onClick: () => {
        this.dropHanger();
      }
    };

    const bottomSeqProps = {
      sources: this.props.bottomSeq,
      tickManager: {
        add: this.addTween,
        remove: this.removeTween,
      },
    };

    const {firstSeq, awardSeq} = this.props;

    const awardProps = {
      sources: {
        firstSeq,
        awardSeq,
        itemBox: this.state.sItem,
      },
      tickManager: {
        add: this.addTween,
        remove: this.removeTween,
      },
      onClick: () => {
        this.setState({
          showAward: false,
        });
        this.resetToFlow();
      }
    };

    return (
      <div {...wrapper}>
        <div {...mainBoxProps}>
          {this.renderHanger()}
          {this.renderItems()}
        </div>
        <div className={css.topLamp}/>
        <div className={classnames([css.asideLamp, css.leftAsideLamp])} />
        <div className={classnames([css.asideLamp, css.rightAsideLamp])} />
        <Seq {...bottomSeqProps}/>
        <img {...buttonProps}/>
        {this.state.showAward && <AwardSeq {...awardProps} />}
      </div>
    );
  }
}
