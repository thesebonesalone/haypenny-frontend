import React, { Component } from "react";
import { connect } from "react-redux";
import URLIS from "../Constants/URL";
import Opinion from "./Opinion";
import Topic from "./Topic";
import TopicForm from "./TopicForm";

class OpinionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredOpinions: [],
      filteredTopics: [],
      opinionSearch: "",
      topicSearch: "",
      showOpinions: true,
      opinionPage: 1,
      topicPage: 1,
      lastOpinionPage: false,
      lastTopicPage: true,
    };
  }
  componentDidMount() {
    fetch(URLIS + `/opinion/feed/new/${this.state.opinionPage}`)
      .then((resp) => resp.json())
      .then((message) => {
        console.log(message);
        this.setState({
          filteredOpinions: message.opinions,
        });
      });
    fetch(URLIS + "/topic")
      .then((resp) => resp.json())
      .then((message) => {
        console.log(message);
        this.setState({
          filteredTopics: message.topics,
        });
      });
  }
  handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("search feature");
  };
  handleChange = (e) => {
    switch (e.target.name) {
      case "opinion_search":
        this.setState({
          opinionSearch: e.target.value,
        });
      case "topic_search":
        this.setState({
          topicSearch: e.target.value,
        });
    }
  };
  renderOpinions() {
    return this.state.filteredOpinions.map((opinion) => {
      return <Opinion opinion={opinion} />;
    });
  }
  renderTopics() {
    return this.state.filteredTopics.map((topic) => {
      return <Topic topic={topic} />;
    });
  }

  swap() {
    let newTruth = this.state.showOpinions;
    this.setState({
      showOpinions: !newTruth,
    });
  }

  holdOpinions() {
    return (
      <React.Fragment>
        <form onSubmit={(e) => this.handleSearchSubmit(e)}>
          <button className="btn">New</button>
          <button className="btn">Popular</button>
          <button className="btn">Weird</button>
          <input
            type="text"
            placeholder="search opinions"
            name="opinion_search"
            value={this.state.opinionSearch}
            onChange={(e) => this.handleChange(e)}
          />
          <input type="submit" value="Search" />
        </form>
        <div className="card">{this.renderOpinions()}</div>
        <div className="card">
          <h3>
            {this.state.lastOpinionPage
              ? `You've seen every opinion ever had. Do you feel enlightened yet?`
              : null}
          </h3>
        </div>
      </React.Fragment>
    );
  }
  holdTopics() {
    return (
      <React.Fragment>
        <form>
          <button className="btn">New</button>
          <button className="btn">Popular</button>
          <button className="btn">Weird</button>
        </form>
        <div>
          <TopicForm />
        </div>
        <div className="card">{this.renderTopics()}</div>
        <div className="card">
          <h2>Topics? What Topics?</h2>
          <h3>There is nothing of interest left to talk about.</h3>
        </div>
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="container-fluid">
        <button className="btn btn-primary" onClick={() => this.swap()}>
          {this.state.showOpinions ? "Show Topics" : "Show Opinions"}
        </button>
        {this.state.showOpinions ? this.holdOpinions() : this.holdTopics()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (user) => dispatch({ type: "LOGIN", user: user }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OpinionContainer);
