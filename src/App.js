import logo from "./logo.svg";
import "./App.css";
import URL from "./Constants/URL";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";

const reducer = (state = { user: { name: "", id: null } }, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.user };
    case "LOGOUT":
      return { ...state, user: { name: "", id: null } };
  }
};
const store = createStore(
  reducer,
  [] + window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__()
);
store.dispatch({ type: "@@INIT" });

function App() {
  return (
    <Router>
      <Provider store={store}>
        <div>THIS IS WORKING HOORAY</div>
      </Provider>
    </Router>
  );
}

export default App;
