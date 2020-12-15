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
import UserRouter from './Components/UserRouter'
import React, { Component } from "react";
import MediaQuery from "react-responsive";
import logo from './assets/logo_transparent_background.png'

const reducer = (
  state = { heldTopic: null, user: { name: "", id: null } },
  action
) => {
  switch (action.type) {
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
  { heldTopic: null, user: { name: "", id: null } },
  composeEnhancers(applyMiddleware(thunk))
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

  componentDidMount() {
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
          console.log(user);
          store.dispatch({ type: "LOGIN", user: user.user });
        });
    }
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
          <div className="navbar navbar-light bg-dark">
            <MediaQuery maxDeviceWidth={1824} minDeviceWidth={1224}>
              <Link to="/" class="navbar-haypenny" href="#">
                <img className="img-fluid" src={logo}/>
              </Link>
            </MediaQuery>
            <MediaQuery minDeviceWidth={1224} device={{ deviceWidth: 1600}}>
              <Link to="/" class="navbar-haypenny" href="#">
              <img className="img-fluid" src={logo}/>
              </Link>
            </MediaQuery>
            <NavBar changePopUp={() => this.changePopUp()}></NavBar>
          </div>

          <div className="container">
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
          {this.state.popUp ? (
            <Login changePopUp={() => this.changePopUp()} />
          ) : null}
        </Provider>
      </Router>
    );
  }
}

export default App;
