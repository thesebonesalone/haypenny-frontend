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
      opinionFilter: "new",
      topicFilter: "popular",
      topicFormUpdate: false,
    };
  }

  topicFormDidSubmit() {
    this.setState({
      topicFormDidSubmit: true,
      topicFilter: "new",
      loadingTopics: true,
      topicPage: 1,
      lastTopicPage: false,
      filteredTopics: [],
    });
    this.loadTopics(this.state.topicFilter);
    setTimeout(() => this.formDoneUpdating(), 200);
  }

  loadOpinions(filter) {
    fetch(URLIS + `/opinion/feed/${filter}/${this.state.opinionPage}`)
      .then((resp) => resp.json())
      .then((message) => {
        this.setState({
          filteredOpinions: message.opinions,
          lastOpinionPage: message.last,
        });
      });
  }
  loadTopics(filter) {
    fetch(URLIS + `/topic/feed/${filter}/${this.state.topicPage}`)
      .then((resp) => resp.json())
      .then((message) => {
        this.setState({
          filteredTopics: message.topics,
          lastTopicPage: message.last,
        });
      });
  }

  componentDidMount() {
    this.loadOpinions(this.state.opinionFilter);
    this.loadTopics(this.state.topicFilter);
  }
  handleSearchSubmit = (e) => {
    e.preventDefault();
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

  formDoneUpdating() {
    this.setState({
      topicFormDidSubmit: false,
    });
  }
  renderOpinions() {
    let count = 0;
    if (this.state.filteredOpinions.length !== 0) {
      return this.state.filteredOpinions.map((opinion) => {
        count += 1;
        return <Opinion key={count} offset={count / 4} opinion={opinion} />;
      });
    } else {
      return <h5>Getting some knowledge...</h5>;
    }
  }
  renderTopics() {
    let count = 0;
    return this.state.filteredTopics.map((topic) => {
      count += 1;
      return (
        <Topic
          filter={this.state.topicFilter}
          rank={count}
          doUpdate={this.state.topicFormUpdate}
          key={count}
          topic={topic}
        />
      );
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
  handleOpinionChange(e) {
    let name = e.target.name;
    if (name === "new" || name === "popular" || name === "weird") {
      this.setState({
        opinionFilter: name,
        filteredOpinions: [],
        opinionPage: 1,
        lastOpinionPage: false,
      });
      this.loadOpinions(name);
    }
  }
  handleTopicChange(e) {
    let name = e.target.name;
    if (name === 'new' || name === 'popular') {
      this.setState({
        topicFilter: name,
        filteredTopics: [],
        topicPage: 1,
        lastTopicPage: false,
      })
      this.loadTopics(name)
    }
  }
  windowScrollListener() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      //debugger
      if (this.state.showOpinions) {
        if (!this.state.lastOpinionPage) {
          this.handleMoreOpinions();
        }
      } else {
        if (!this.state.lastTopicPage) {
          this.handleMoreTopics();
        }
      }
    }
  }

  componentWillMount() {
    //debugger
    let OpinionContainer = this;

    window.addEventListener(
      "scroll",
      () => OpinionContainer.windowScrollListener(),
      true
    );
  }

  componentWillUnmount() {
    let OpinionContainer = this;
    window.removeEventListener(
      "scroll",
      () => OpinionContainer.windowScrollListener(),
      true
    );
  }
  titleize(word) {
    let wordArray = word.split("");
    wordArray[0] = wordArray[0].toUpperCase();
    return wordArray.join("");
  }

  holdOpinions() {
    return (
      <React.Fragment>
        <div className="card bg-light">
          <form onSubmit={(e) => this.handleSearchSubmit(e)}>
            <button className="btn btn-primary" onClick={() => this.swap()}>
              {this.state.showOpinions ? "Topics" : "Opinions"}
            </button>
            <button
              className="btn btn-secondary"
              name="new"
              onClick={(e) => this.handleOpinionChange(e)}
            >
              New
            </button>
            <button
              className="btn btn-secondary"
              name="popular"
              onClick={(e) => this.handleOpinionChange(e)}
            >
              Popular
            </button>
            <button
              className="btn btn-secondary"
              name="weird"
              onClick={(e) => this.handleOpinionChange(e)}
            >
              Weird
            </button>
          </form>
          <div className="card-title" style={{ margin: "1%", textAlign: "center" }}>
            <h3>{this.titleize(this.state.opinionFilter) + " Opinions"}</h3>
          </div>
          {this.renderOpinions()}
        </div>
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

  handleNewTopics() {

  }
  handlePopularTopics() {

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
  cancelSubmit(e) {
    e.preventDefault();
  }
  holdTopics() {
    return (
      <React.Fragment>
        <div className="card bg-light">
          <form onSubmit={(e) => this.cancelSubmit(e)}>
            <button className="btn btn-primary" onClick={() => this.swap()}>
              {this.state.showOpinions ? "Topics" : "Opinions"}
            </button>
            <button name="new" className="btn btn-secondary" onClick={(e) => this.handleTopicChange(e)}>New</button>
            <button name="popular" className="btn btn-secondary" onClick={(e) => this.handleTopicChange(e)}>Trending</button>
            <TopicForm didUpdate={() => this.topicFormDidSubmit()} />
          </form>
          <div className="card-title" style={{ margin: "1%", textAlign: "center" }}>
            <h3>{`${this.state.topicFilter === "new" ? "New" : "Trending"} Topics`}</h3>
          </div>
          {this.renderTopics()}
        </div>
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
      <div className="container-fluid bg-standard">
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
