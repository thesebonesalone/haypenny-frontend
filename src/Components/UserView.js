import React, { useState, useEffect, useRef } from "react";
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
  useLocation,
} from "react-router-dom";
import { createBrowserHistory } from "history";
import ReactWordcloud from "react-wordcloud";

function UserView(props) {
  const location = useLocation();
  let { userName } = useParams();
  const prevLocation = usePrevious(location);
  const [opinions, setOpinions] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [page, setPage] = useState(1);
  const [wordCloud, setWordCloud] = useState([]);
  useEffect(() => {
    if (location !== prevLocation) {
      setWordCloud([])
    }
    if (opinions === 0 || location !== prevLocation) {
      fetch(URLIS + `/user/${userName}`)
        .then((resp) => resp.json())
        .then((message) => {
          console.log(message);
          //debugger
          setOpinions(message.user.opinions);
        });
      if (wordCloud.length === 0) {
        fetch(URLIS + `/user/${userName}/wordcloud/40`)
          .then((resp) => resp.json())
          .then((cloud) => {
            console.log(cloud);
            setWordCloud(cloud);
          });
      }
    }
  });
  function loadNextPage() {
    console.log("Something");
  }

  function renderOpinions() {
    if (opinions !== 0) {
      let count = 0;
      return opinions.map((opinion) => {
        count += 1;
        return (
          <React.Fragment>
            <Opinion key={count} opinion={opinion} />
          </React.Fragment>
        );
      });
    }
  }

  function simpleWordCloud() {
    return <ReactWordcloud options={{rotations: 0, rotationAngles: [0]}} words={wordCloud} />;
  }
  return (
    <div className="card">
      <h2
        className="card-title"
        style={{ textAlign: "center", paddingTop: "20px" }}
      >
        {userName}
      </h2>
      <div>{simpleWordCloud()}</div>
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

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
