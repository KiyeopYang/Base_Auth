import {
  Route,
  Redirect,
} from 'react-router-dom';
import React from 'react';

export default ({
  component: Component,
  mode,
  isAuth,
  redirectPath,
  ...rest,
}) => (
  <Route {...rest} render={props => {
    let passed = false;
    if (mode === 'private') {
      passed = isAuth;
    } else {
      passed = !isAuth;
    }
    return passed ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: `${redirectPath}`,
        state: { from: props.location }
      }}/>
    )
  }}/>
);
