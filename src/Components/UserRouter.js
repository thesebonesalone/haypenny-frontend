import React from "react";
import { connect } from "react-redux";
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom'
import UserView from './UserView'

function UserRouter(props) {
    let match = useRouteMatch()

    return (
        <div>
            <Switch>
                <Route exact path={`${match.path}/:userName`}>
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