import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import URLIS from "../Constants/URL";
import Opinion from "./Opinion";
import OpinionForm from "./OpinionForm";
import { useParams, useLocation } from "react-router-dom";
import ReactWordcloud from "react-wordcloud";

function TopicView(props) {
  const location = useLocation();
  let { topicTitle } = useParams();
  const prevLocation = usePrevious(location);
  const [opinions, setOpinions] = useState(0);
  const [topicId, setTopicId] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(false);
  const [sort, setSort] = useState("new");
  const [loadOpinions, setLoadOpinions] = useState(true)
  const [wordCloud, setWordCloud] = useState([]);

  useEffect(() => {
    if (loadOpinions || location !== prevLocation) {
      setLoadOpinions(false)
      fetch(URLIS + `/topic/${topicTitle}/opinions/${sort}/${page}`)
        .then((resp) => resp.json())
        .then((message) => {
          setTopicId(message.topic);
          setOpinions(message.opinions);
          setLastPage(message.last);
        });
      if (wordCloud.length === 0) {
        fetch(URLIS + `/topic/${topicTitle}/wordcloud/40`)
          .then((resp) => resp.json())
          .then((cloud) => {
            setWordCloud(cloud);
          });
      }
    }
  });
  function renderOpinions() {
    if (opinions !== 0) {
      let count = 0;
      return opinions.map((opinion) => {
        count += 1;
        return <Opinion key={count} offset={count / 4} opinion={opinion} />;
      });
    }
  }
  function handleSortChange(e) {
    e.preventDefault();
    debugger;
    if (sort !== e.target.name) {
      setOpinions(0);
      setPage(1);
      setLastPage(false);
      setSort(e.target.name);
    }
  }
  function simpleWordCloud() {
    return (
      <ReactWordcloud
        options={{ rotations: 0, rotationAngles: [0] }}
        words={wordCloud}
      />
    );
  }
  function loadNextPage() {
    let newPage = page + 1;
    setPage(newPage);
    fetch(URLIS + `/topic/${topicTitle}/opinions/${sort}/${newPage}`)
      .then((resp) => resp.json())
      .then((message) => {
        console.log(message);
        let newOpinions = [...opinions, ...message.opinions];
        setOpinions(newOpinions);
        setLastPage(message.last);
      });
  }

  return (
    <div className="card">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md">
            <h2
              className="card-title"
              style={{ textAlign: "center", paddingTop: "20px" }}
            >
              {topicTitle}
            </h2>
            <div className="col-md">{simpleWordCloud()}</div>
          </div>
        </div>
      </div>
      <div className="container" style={{ textAlign: "center" }}>
        <form>
          <button
            className="btn btn-secondary"
            name="new"
            onClick={(e) => handleSortChange(e)}
          >
            New
          </button>
          <button
            className="btn btn-secondary"
            name="popular"
            onClick={(e) => handleSortChange(e)}
          >
            Popular
          </button>
          <button
            className="btn btn-secondary"
            name="weird"
            onClick={(e) => handleSortChange(e)}
          >
            Weird
          </button>
        </form>
      </div>
      <div className="card-body">
        <OpinionForm topic={{ title: topicTitle, id: topicId }} />
      </div>
      <h4 style={{ textAlign: "center" }}>
        {opinions !== 0 ? "All Opinions" : null}
      </h4>
      <div className="card-body">{renderOpinions()}</div>
      <div className="card-body" style={{ textAlign: "center" }}>
        {lastPage ? null : (
          <button className="btn btn-primary" onClick={() => loadNextPage()}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
}
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
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
