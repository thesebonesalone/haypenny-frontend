import React, { Component } from "react";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from 'react-router-dom'
import UserView from './UserView'
import URLIS from "../Constants/URL";

function UserRouter(props) {
    let match = useRouteMatch()

    return (
        <div>
            <Switch>
                <Route path={`${match.path}/:userName`}>
                    <UserView/>
                </Route>
            </Switch>
        </div>
    )
}

const mapStateToProps = (state) => {
    return { user: state.user };
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {
      login: (user) => dispatch({ type: "LOGIN", user: user }),
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(UserRouter);