import React, { Component } from 'react';
import './SignInOut.css';
import gLogo from './g-logo.png'; // Tell Webpack this JS file uses this image

function SignInOut(props) {
  return (
    <div onClick={props.atClick} className={'button ' + (props.signedIn ? 'signed-in' : 'not-signed-in')}>
      {!props.signedIn && <div className="button__logo"><img src={gLogo} alt="Logo"/></div>}
      <p className="button__text">{!props.signedIn ? 'Sign in with Google' : 'Sign out'}</p>
    </div>
  );
}

export default SignInOut;