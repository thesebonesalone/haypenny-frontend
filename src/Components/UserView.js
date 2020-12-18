import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import URLIS from "../Constants/URL";
import Opinion from "./Opinion"
import {
  useParams,
  useLocation,
} from "react-router-dom";
import ReactWordcloud from "react-wordcloud";

function UserView(props) {
  const location = useLocation();
  let { userName } = useParams();
  const prevLocation = usePrevious(location);
  const [opinions, setOpinions] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [page, setPage] = useState(1);
  const [wordCloud, setWordCloud] = useState([]);
  const [sort, setSort] = useState("new");
  const [popularity, setPopularity] = useState(-3.14);
  const [weird, setWeird] = useState(0);
  const [loadCloud, setLoadCloud] = useState(true)
  const [loadOpinions, setLoadOpinions] = useState(true)

  useEffect(() => {
    if (popularity === -3.14) {
      fetch(URLIS + `/user/${userName}`)
        .then((resp) => resp.json())
        .then((message) => {
          setPopularity(message.popularity);
          setWeird(message.weird);
        });
    }
    if (location !== prevLocation) {
      fetch(URLIS + `/user/${userName}/wordcloud/40`)
          .then((resp) => resp.json())
          .then((cloud) => {
            
            setWordCloud(cloud);
          });
      setLoadOpinions(true)
      setLoadCloud(true)
      setPopularity(-3.14)
    }
    if (loadOpinions || location !== prevLocation) {
      setLoadOpinions(false)
      console.log('test')
      fetch(URLIS + `/user/${userName}/opinions/${sort}/${page}`)
        .then((resp) => resp.json())
        .then((message) => {
          //debugger
          setOpinions(message.opinions);
          setLastPage(message.last);
        });
      if (loadCloud) {
        console.log('test 2')
        setLoadCloud(false)
        fetch(URLIS + `/user/${userName}/wordcloud/40`)
          .then((resp) => resp.json())
          .then((cloud) => {
            setWordCloud(cloud);
          });
      }
    }
  });

  function loadNextPage() {
    let newPage = page + 1;
    setPage(newPage);
    fetch(URLIS + `/user/${userName}/opinions/${sort}/${newPage}`)
      .then((resp) => resp.json())
      .then((message) => {
      
        let newOpinions = [...opinions, ...message.opinions];
        setOpinions(newOpinions);
        setLastPage(message.last);
      });
  }

  function renderOpinions() {
    if (opinions !== 0) {
      let count = 0;
      return opinions.map((opinion) => {
        count += 1;
        return (
          <React.Fragment>
            <Opinion key={count} offset={count/4} opinion={opinion} />
          </React.Fragment>
        );
      });
    }
  }

  function handleSortChange(e) {
    e.preventDefault();
    debugger;
    if (sort !== e.target.name) {
      setLoadOpinions(true)
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
  return (
    <div className="card">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md">
            <h2
              className="card-title"
              style={{ textAlign: "center", paddingTop: "20px" }}
            >
              {userName}
            </h2>
            <h4
              className="card-title"
              style={{ textAlign: "center", paddingTop: "20px" }}
            >
              Popularity: {<b style={{color: `${popularity > 0 ? "green" : "red"}`}}>{popularity}</b>}
            </h4>
            <h4
              className="card-title"
              style={{ textAlign: "center", paddingTop: "20px" }}
            >
              Weirdness: {<b style={{color: `${weird > 0 ? "green" : "red"}`}}>{weird}</b>}
            </h4>
          </div>
          <div className="col-md">{simpleWordCloud()}</div>
        </div>
      </div>
      <div className="container" style={{textAlign: 'center'}}>
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
