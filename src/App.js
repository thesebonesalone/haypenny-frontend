import "./App.css";
import URLIS from "./Constants/URL";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import Login from "./Components/Login";
import NavBar from "./Components/NavBar";
import OpinionContainer from "./Components/OpinionContainer";
import thunk from "redux-thunk";
import TopicRouter from "./Components/TopicRouter";
import UserRouter from "./Components/UserRouter";
import React, { Component } from "react";
import MediaQuery from "react-responsive";
import Notice from "./Components/Notice"
import logo from "./assets/logo_transparent_background.png";

const reducer = (
  state = { heldTopic: null, dismiss: false, user: { name: "", id: null } },
  action
) => {
  switch (action.type) {
    case "DISMISS_NOTICE":
      return {...state, dismiss: true}
    case "HOLD_TOPIC":
      return { ...state, heldTopic: action.topic };
    case "RELEASE_TOPIC":
      return { ...state, heldTopic: null };
    case "LOGIN":
      return { ...state, user: action.user };
    case "LOGOUT":
      return { ...state, user: { name: "", id: null } };
    default:
      return state;
  }
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  { heldTopic: null, dismiss: false, user: { name: "", id: null } },
  composeEnhancers(applyMiddleware(thunk))
);
store.dispatch({ type: "@@INIT" });

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popUp: false,
      mount: null,
      dismiss: store.getState().dimiss
    };
  }

  componentDidMount() {
    //debugger
    const token = localStorage.getItem("my_app_token");
    if (token) {
      let reqObj = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      fetch(URLIS + "/current_user", reqObj)
        .then((resp) => resp.json())
        .then((user) => {
          store.dispatch({ type: "LOGIN", user: user.user });
        });
    }
  }

  changePopUp() {
    let newPopUp = this.state.popUp;
    this.setState({
      popUp: !newPopUp,
    });
  }

  renderSignUp() {
    return <div>Login</div>;
  }
  dismiss() {
    this.setState({
      dismiss: true
    })
  }

  render() {
    //debugger
    return (
      <Router>
        <Provider store={store}>
          <div className="navbar navbar-default bg-dark navbar-fixed-top" style={{position: 'fixed', width: '100%', zIndex: '10'}}>
            <div className="container">
              <MediaQuery maxDeviceWidth={764}>
                <Link to="/" className="navbar-haypenny" href="#">
                  <img className="img-icon" alt="Haypenny logo" src={logo} />
                </Link>
                <NavBar changePopUp={() => this.changePopUp()}></NavBar>
              </MediaQuery>
              <MediaQuery minDeviceWidth={765}>
                <div style={{ textAlign: "center" }}>
                  <Link to="/" className="navbar-haypenny" href="#">
                    <img className="img-fluid" alt="Haypenny logo" src={logo} />
                  </Link>
                </div>
                <NavBar changePopUp={() => this.changePopUp()} />
              </MediaQuery>
            </div>
          </div>

          <div className="container" style={{paddingTop: '200px'}}>
            <Switch>
              <Route path="/topic">
                <TopicRouter />
              </Route>
              <Route path="/user">
                <UserRouter />
              </Route>
              <Route path="/">
                <OpinionContainer />
              </Route>
            </Switch>
          </div>
          {this.state.dismiss ? null : <Notice dismiss={() => this.dismiss()}/>}
          {this.state.popUp ? (
            <Login changePopUp={() => this.changePopUp()} />
          ) : null}
        </Provider>
      </Router>
    );
  }
}

export default App;
