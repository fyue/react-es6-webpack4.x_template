import React from 'react';
import classnames from 'classnames';
import css from './index.less';
import Wawaji from './wawaji';

const items = [
  {
    mainUrl: '/sources/treasureBox/treasureBox1.png',
    openUrl: '/sources/treasureBox/treasureBoxOpened1.png'
  },
  {
    mainUrl: '/sources/treasureBox/treasureBox2.png',
    openUrl: '/sources/treasureBox/treasureBoxOpened2.png'
  },
  {
    mainUrl: '/sources/treasureBox/treasureBox3.png',
    openUrl: '/sources/treasureBox/treasureBoxOpened3.png'
  }
];

class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sources: {},
      preLoading: true,
    };
  }

  componentDidMount() {
    this.preLoadData();
  }

  preLoadData = async () => {
    const bottomSeq = await Promise.all(new Array(19).fill(0).map((_i, idx) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve(img);
        };
        img.src = `/sources/bottomSeq/bottomSeq${idx}.png`;
      });
    }));

    const firstSeq = await Promise.all(new Array(38).fill(0).map((_i, idx) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve(img);
        };
        img.src = `/sources/firstSeq/firstSeq${idx}.png`;
      });
    }));

    const awardSeq = await Promise.all(new Array(25).fill(0).map((_i, idx) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve(img);
        };
        img.src = `/sources/awardSeq/awardSeq${idx}.png`;
      });
    }));

    this.setState({
      sources: {
        bottomSeq,
        firstSeq,
        awardSeq,
        items: [...items, ...items],
      },
      preLoading: false,
    });
  };

  render() {
    const cls = classnames([css.layout]);
    const {preLoading, sources} = this.state;
    if (preLoading) {
      return null;
    }

    const props = {
      ...sources,
    };

    return (
      <div className={cls}>
        <Wawaji {...props}/>
      </div>
    );
  }
}

export default Layout;
