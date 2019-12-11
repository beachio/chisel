import React from 'react';
import InlineSVG from 'svg-inline-react';

import ImageHammer from 'assets/images/hammer.svg';


export default () => (
  <div className="start-working">
    <InlineSVG className="hammer" src={ImageHammer}/>
    You don't have rights to access this section.
  </div>
);