import React from 'react';
import {
  useLocation,
  useHistory,
  useParams
} from "react-router";


export function withRouter(Component) {
  return props => {
    let location = useLocation();
    let history = useHistory();
    let params = useParams();
    return (
      <Component
        {...props}
        router={{ location, history, params }}
      />
    );
  };
}