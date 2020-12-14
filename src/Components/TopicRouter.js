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
import TopicView from './TopicView'
import URLIS from "../Constants/URL";


function TopicRouter(props) {
  let match = useRouteMatch()
    // debugger
    return (
      <div>
        <Switch>
          <Route path={`${match.path}/:topicTitle`}>
            <TopicView/>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(TopicRouter);