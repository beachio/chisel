import React from 'react';
import InlineSVG from 'svg-inline-react';

export default props => <InlineSVG src={require(`./${props.icon}.svg`)} />
