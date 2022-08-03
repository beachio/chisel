import React from 'react';
import {
  useLocation,
  useNavigate,
  useNavigationType,
  useParams
} from "react-router-dom";


export function withRouter(Component) {
  return props => {
    let location = useLocation();
    let navigate = useNavigate();
    let navigationType = useNavigationType();
    let params = useParams();
    return (
      <Component
        {...props}
        router={{ location, navigate, navigationType, params }}
      />
    );
  };
}