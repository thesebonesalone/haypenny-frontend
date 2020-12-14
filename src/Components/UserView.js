import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import URLIS from "../Constants/URL";
import Opinion from "./Opinion";
import Overlay from "react-bootstrap/Overlay";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";

function UserView(props) {
  let { userName } = useParams();
  const [opinions, setOpinions] = useState(0);
  useEffect(() => {
    if (opinions === 0) {
      fetch(URLIS + `/user/${userName}`)
        .then((resp) => resp.json())
        .then((message) => {
          console.log(message);
          //debugger
          setOpinions(message.user.opinions);
        });
    }
  });
  function renderOpinions() {
    if (opinions !== 0) {
      let count = 0;
      return opinions.map((opinion) => {
        count += 1;
        return <Opinion key={count} opinion={opinion} />;
      });
    }
  }
  return (
    <div className="card">
      <h2 className="card-title" style={{textAlign: 'center'}}>{userName}</h2>
      <div className="card-body">{renderOpinions()}</div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { user: state.user };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (user) => dispatch({ type: "LOGIN", user: user }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
