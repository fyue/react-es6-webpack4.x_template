import React from 'react';
import PropTypes from 'prop-types';
import './baseJs/tracking';
import './baseJs/data/face-min';

class FaceCamera extends React.Component {

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    onTrackFace: PropTypes.func,
  };

  static defaultProps = {
    width: 320,
    height: 240,
    className: '',
    onTrackFace: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.refCamera = React.createRef();
  }

  componentWillUnmount() {
    this.refCamera.current.srcObject = null; // 清除视频Stream流对象
    this.trackingRef.stop();
  }

  componentDidMount() {
    const { onTrackFace } = this.props;
    this.tracker = new tracking.ObjectTracker('face');
    this.tracker.setInitialScale(4);
    this.tracker.setStepSize(2);
    this.tracker.setEdgesDensity(0.1);
    this.trackingRef = tracking.track(this.refCamera.current, this.tracker, { camera: true });
    this.tracker.on('track', function(event) {
      if (event.data.length) {
        onTrackFace(event.data);
      }
    });
  }

  render() {
    const { width, height, className } = this.props;
    const videoProps = {
      id: 'faceCameraVideo',
      width,
      height,
      preload: 'true',
      autoPlay: true,
      loop: true,
      muted: true,
      ref: this.refCamera,
      className,
    };
    return <video {...videoProps}/>;
  }
}
export default FaceCamera;
