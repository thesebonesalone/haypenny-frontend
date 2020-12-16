import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import URLIS from "../Constants/URL";
import Opinion from "./Opinion";
import OpinionForm from "./OpinionForm";
import Overlay from "react-bootstrap/Overlay";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";

function TopicView(props) {
  let { topicTitle } = useParams();
  const [opinions, setOpinions] = useState(0);
  const [topicId, setTopicId] = useState(0)
  useEffect(() => {
    if (opinions === 0) {
      fetch(URLIS + `/topic/${topicTitle}`)
        .then((resp) => resp.json())
        .then((message) => {
          console.log(message);
          //debugger
          setTopicId(message.topic.id)
          setOpinions(message.topic.opinions);
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
      <h2 className="card-title" style={{ textAlign: "center" , paddingTop: "20px"}}>
        {topicTitle}
      </h2>
      <div className="card-body">
        <OpinionForm topic={{title: topicTitle, id: topicId}} />
      </div>
        <h4 style={{ textAlign: "center" }}>{opinions !== 0 ? "All Opinions": null}</h4>
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

export default connect(mapStateToProps, mapDispatchToProps)(TopicView);
