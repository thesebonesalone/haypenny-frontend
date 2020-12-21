import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import URLIS from "../Constants/URL";
import Opinion from "./Opinion";
import { useParams, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import CommentForm from "./CommentForm";
import Comment from "./Comment";

function OpinionView(props) {
  let { opinionId } = useParams();
  const [opinion, setOpinion] = useState({ id: 0 });
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [oldOpinions, setOldOpinions] = useState([]);
  const [comments, setComments] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const prevOpinion = usePrevious(opinionId);
  useEffect(() => {
    if (prevOpinion !== opinionId) {
      setOpinion({ id: 0 });
    }
    if (opinion.id === 0) {
      setOpinion({ id: -1 });
      fetch(URLIS + `/opinion/view/${opinionId}`)
        .then((resp) => resp.json())
        .then((message) => {
          console.log(message);
          setTitle(message.title);
          setUsername(message.username);
          setOpinion(message.opinion);
          setOldOpinions(message.oldOpinions);
        });
      if (props.user.name !== "") {
        fetch(
          URLIS + `/comment/useropinioncomments/${opinionId}/${props.user.id}`
        )
          .then((resp) => resp.json())
          .then((message) => {
            setUserComments(message.comments);
          });
      }
      fetch(URLIS + `/comment/opinioncomments/${opinionId}`)
        .then((resp) => resp.json())
        .then((message) => {
          console.log(message);
          setComments(message.comments);
        });
    }
  });

  function renderOldOpinions() {
    let count = 0;
    return oldOpinions.map((subOpinion) => {
      count += 1;
      return <Opinion key={count} offset={count / 4} opinion={subOpinion} />;
    });
  }

  function renderComments() {
    let count = 0;
    return comments.map((comment) => {
      count += 1;
      if (comment.user !== props.user.name) {
      return (
        <div className="col-md">
          <Comment key={count} comment={comment} />
        </div>
      );
      } else {
          return null
      }
    });
  }

  function renderUserComments() {
    let count = 0;
    return userComments.map((comment) => {
      count += 1;
      return (
        <div className="col-md">
          <Comment key={count} comment={comment} />
        </div>
      );
    });
  }

  function renderUserCommentsDiv() {
    return (
      <div className="row">
        <div className="col-md">
          <h2> Your Comments</h2>
          {renderUserComments()}
        </div>
      </div>
    );
  }

  function renderOpinion() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md">
            <h2 className="card-title">
              {oldOpinions.length > 1
                ? `What ${username} thinks about ${title}`
                : null}
            </h2>
            {renderOldOpinions()}
          </div>
        </div>
        {props.user.name !== "" && userComments.length > 0 ? renderUserCommentsDiv() : null}
        <div className="row">
          <div className="col-md">
            <h2> Comments</h2>
            <div className="card">
              {props.user.name !== "" ? (
                <CommentForm opinionId={opinion.id} />
              ) : null}
            </div>

            {renderComments()}
          </div>
        </div>
      </div>
    );
  }
  return (
    <React.Fragment>
      <div className="card"></div>

      <div>{opinion.id !== 0 ? renderOpinion() : null}</div>
    </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(OpinionView);
