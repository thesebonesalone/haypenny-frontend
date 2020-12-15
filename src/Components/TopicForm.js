import React, { Component } from "react";
import { connect } from "react-redux";
import URLIS from "../Constants/URL";
import { Link } from "react-router-dom";

class TopicForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      likeTopics: [],
      timer: null,
      disabled: true,
    };
  }
  componentDidMount() {
    let query = "";
    this.setState({
      timer: setTimeout(() => this.grabLikeTopics(query), 1000),
    });
  }
  handleChange(e) {
    this.setState({
      likeTopics: [],
      title: e.target.value,
    });
    if (e.target.value !== "") {
      clearTimeout(this.state.timer);
      this.setState({
        timer: setTimeout(() => this.grabLikeTopics(e.target.value), 1000),
      });
    }
  }

  renderQueryTopics() {
    return this.state.likeTopics.map((topic) => {
      return (
        <div>
          <Link to={`/topic/${topic}`}>{topic}</Link>
        </div>
      );
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.didUpdate();
    if (this.state.disabled) {
      console.log("Must be a valid topic");
    } else {
      let data = { topic: { title: this.state.title } };
      let reqObj = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      fetch(URLIS + "/topic", reqObj)
        .then((resp) => resp.json())
        .then((topic) => {
          console.log(topic);
          this.props.pushTopic(topic.topic);
        });
    }
  }

  grabLikeTopics(query) {
    if (query !== "") {
      fetch(URLIS + "/topic/query/liketopics/" + query)
        .then((resp) => resp.json())
        .then((topics) => {
          let topicArray = topics.topics.map((topic) => topic.title);
          this.setState({
            likeTopics: topicArray,
          });
          let hasTopic = false;
          if (
            topicArray.filter((topic) => {
              return topic.toLowerCase() === query.toLowerCase();
            }).length !== 0
          ) {
            hasTopic = true;
          }
          this.setState({
            disabled: hasTopic,
          });
        });
    }
  }

  renderButton() {
    return (
      <React.Fragment>
        <h4 className="card-title bg-light">This topic does not exist. Would you like to create it?</h4>
        <button
          onClick={(e) => this.handleSubmit(e)}
          className={`btn btn-primary`}
          value="Create"
        >
          Create
        </button>
      </React.Fragment>
    );
  }

  renderQueryLive(){
    return (
      <div className="card">
        <h4 className="card-title bg-light">Topics like the one you searched.</h4>
        {this.renderQueryTopics()}
      </div>
    )
  }
  render() {
    return (
      <div className="card">
        <input
          type="text"
          name="title"
          placeholder="Search Topics"
          value={this.state.title}
          onChange={(e) => this.handleChange(e)}
        ></input>
        {this.state.disabled ? null : this.renderButton()}
        <div>{this.state.likeTopics.length > 0 ? this.renderQueryLive() : null }</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user, heldTopic: state.heldTopic };
};

const mapDispatchToProps = (dispatch) => {
  return {
    pushTopic: (topic) => dispatch({ type: "HOLD_TOPIC", topic: topic }),
    login: (user) => dispatch({ type: "LOGIN", user: user }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicForm);
