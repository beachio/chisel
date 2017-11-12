import React from 'react';
import InlineSVG from 'svg-inline-react';

export const NoRights = () => {
  return (
    <div className="start-working">
      <InlineSVG className="hammer" src={require("assets/images/hammer.svg")}/>
      You don't have rights to access this section.
    </div>
  );
};