import "./App.css";
import URLIS from "./Constants/URL";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import Login from "./Components/Login";
import NavBar from "./Components/NavBar";
import OpinionContainer from "./Components/OpinionContainer";
import React, { Component } from "react";

const reducer = (state = { user: { name: "", id: null } }, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.user };
    case "LOGOUT":
      return { ...state, user: { name: "", id: null } };
    default:
      return state;
  }
};
const store = createStore(
  reducer,
  [] + window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__()
);
store.dispatch({ type: "@@INIT" });

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popUp: false,
      mount: null,
    };
  }
  changePopUp() {
    console.log(this.state.popUp);
    let newPopUp = this.state.popUp;
    this.setState({
      popUp: !newPopUp,
    });
  }

  renderSignUp() {
    return <div>Login</div>;
  }

  render() {
    //debugger
    return (
      <Router>
        <Provider store={store}>
          <div className="navbar navbar-light bg-light">
            <Link to="/" class="navbar-brand" href="#">
              HayPenny
            </Link>
            <NavBar changePopUp={() => this.changePopUp()}></NavBar>
          </div>

          <div className="container">
            <Switch>
              <Route path="/">
                <OpinionContainer />
              </Route>
            </Switch>
          </div>
          {this.state.popUp ? (
            <Login changePopUp={() => this.changePopUp()} />
          ) : null}
        </Provider>
      </Router>
    );
  }
}

export default App;
