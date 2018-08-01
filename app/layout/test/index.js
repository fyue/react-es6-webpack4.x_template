import React from 'react';
import PropTypes from 'prop-types';
import css from './index.less';

export default class Test extends React.Component {
  static propsTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  componentDidMount() {}
  
  render() {
    return (
      <div>
        Test
        $END$
      </div>
    );
  }
}