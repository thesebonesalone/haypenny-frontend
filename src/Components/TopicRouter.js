import React from "react";
import { connect } from "react-redux";
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom'
import TopicView from './TopicView'


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