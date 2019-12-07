import React from 'react';
import InlineSVG from 'svg-inline-react';

export default props =>
  <InlineSVG src={require(`assets/images/icons/${props.icon}.svg`)} />;
