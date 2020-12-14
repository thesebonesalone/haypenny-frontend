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
      loadingOpinions: false,
      loadingTopics: false,
      opinionFilter: 'new',
      topicFilter: 'new'
    };
  }
  loadOpinions(filter) {
    fetch(URLIS + `/opinion/feed/${filter}/${this.state.opinionPage}`)
      .then((resp) => resp.json())
      .then((message) => {
        console.log(message);
        this.setState({
          filteredOpinions: message.opinions,
          lastOpinionPage: message.last,
        });
      });
  }


  componentDidMount() {
    this.loadOpinions(this.state.opinionFilter)
    fetch(URLIS + `/topic/feed/${this.state.topicFilter}/${this.state.topicPage}`)
      .then((resp) => resp.json())
      .then((message) => {
        console.log(message);
        this.setState({
          filteredTopics: message.topics,
          lastTopicPage: message.last,
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
        break;
      case "topic_search":
        this.setState({
          topicSearch: e.target.value,
        });
        break;
      default:
        return null;
    }
  };
  renderOpinions() {
    let count = 0
    if (this.state.filteredOpinions.length !== 0){
    return this.state.filteredOpinions.map((opinion) => {
      count += 1
      return <Opinion key={count} opinion={opinion} />;
    })} else
    {
      return <h5>Getting some knowledge...</h5>
    };
  }
  renderTopics() {
    let count = 0
    return this.state.filteredTopics.map((topic) => {
      count += 1
      return <Topic key={count} topic={topic} />;
    });
  }

  swap() {
    let newTruth = this.state.showOpinions;
    this.setState({
      showOpinions: !newTruth,
    });
  }

  handleMoreOpinions(e) {
    let newOpinionPage = this.state.opinionPage + 1;
    this.setState({
      loadingOpinions: true,
      opinionPage: newOpinionPage,
    });
    fetch(URLIS + `/opinion/feed/new/${newOpinionPage}`)
      .then((resp) => resp.json())
      .then((message) => {
        let oldOpinions = this.state.filteredOpinions;
        this.setState({
          filteredOpinions: oldOpinions.concat(message.opinions),
          lastOpinionPage: message.last,
          loadingOpinions: false,
        });
      });
  }

  handleMoreTopics(e) {
    console.log("Loading more topics");
    let newTopicPage = this.state.topicPage + 1;
    this.setState({
      loadingTopics: true,
      topicPage: newTopicPage,
    });
    fetch(URLIS + `/topic/feed/new/${newTopicPage}`)
      .then((resp) => resp.json())
      .then((message) => {
        let oldTopics = this.state.filteredTopics;
        this.setState({
          filteredTopics: oldTopics.concat(message.topics),
          lastTopicPage: message.last,
          loadingTopics: false,
        });
      });
  }

  renderOpinionPageButton() {
    return (
      <React.Fragment>
        <button
          className="btn btn-primary"
          onClick={(e) => this.handleMoreOpinions(e)}
        >
          Load More
        </button>
      </React.Fragment>
    );
  }

  renderTopicPageButton() {
    return (
      <React.Fragment>
        <button
          className="btn btn-primary"
          onClick={(e) => this.handleMoreTopics(e)}
        >
          Load More
        </button>
      </React.Fragment>
    );
  }
  handleOpinionChange(e){
    let name = e.target.name
    if (name === "new" || name==="popular" || name === "weird"){
      this.setState({
        opinionFilter: name,
        filteredOpinions: [],
        opinionPage: 1,
        lastOpinionPage: false
      })
      this.loadOpinions(name)
    }
  }

  holdOpinions() {
    return (
      <React.Fragment>
        <form onSubmit={(e) => this.handleSearchSubmit(e)}>
          <button className="btn" name="new" onClick={(e) => this.handleOpinionChange(e)}>New</button>
          <button className="btn" name="popular" onClick={(e) => this.handleOpinionChange(e)}>Popular</button>
          <button className="btn" name="weird" onClick={(e) => this.handleOpinionChange(e)}>Weird</button>
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
              : this.renderOpinionPageButton()}
          </h3>
        </div>
      </React.Fragment>
    );
  }
  renderNewTopic() {
    let newTopic = [this.props.topic];
    let oldTopics = this.state.filteredTopics;
    this.setState({
      filteredTopics: newTopic.concat(oldTopics),
    });
    this.props.dropTopic();

    return <React.Fragment></React.Fragment>;
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
        {this.props.topic ? this.renderNewTopic() : null}
        <div className="card">
          <h3>
            {this.state.lastTopicPage
              ? "There is nothing of interest left to talk about."
              : this.renderTopicPageButton()}
          </h3>
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
  return { user: state.user, topic: state.heldTopic };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dropTopic: () => dispatch({ type: "RELEASE_TOPIC" }),
    login: (user) => dispatch({ type: "LOGIN", user: user }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OpinionContainer);