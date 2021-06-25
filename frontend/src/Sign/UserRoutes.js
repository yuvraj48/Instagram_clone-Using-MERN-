import React from 'react';
import {Route, Redirect} from 'react-router-dom'
import { isAutheticated } from './Helper';

function UserRoute({ component:Component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>

                isAutheticated() ? (
                    <Component {...props}/>
                
            
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }
  export default UserRoute;