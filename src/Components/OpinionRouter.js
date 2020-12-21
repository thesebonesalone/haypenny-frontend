import React from "react";
import { connect } from "react-redux";
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom'
import OpinionView from './OpinionView'


function OpinionRouter(props) {
  let match = useRouteMatch()
    // debugger
    return (
      <div>
        <Switch>
          <Route path={`${match.path}/view/:opinionId`}>
            <OpinionView/>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(OpinionRouter);