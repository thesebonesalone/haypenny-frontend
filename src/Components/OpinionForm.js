import React, { Component } from "react";
import { connect } from "react-redux";
import URLIS from "../Constants/URL";
class OpinionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opinion: "",
    };
  }
  renderLogin() {
    return <div>You must be logged in to leave an Opinion!</div>;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let data = {
      opinion: {
        content: this.state.opinion,
        user_id: this.props.user.id,
        topic_id: this.props.topic.id,
      },
    };
    let reqObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    fetch(URLIS + "/opinion", reqObj)
      .then((resp) => resp.json())
      .then((message) => {
        console.log(message);
        this.setState({
          opinion: "",
        });
      });
  };
  handleOpinion = (e) => {
    this.setState({
      opinion: e.target.value,
    });
  };
  renderForm() {
    return (
      <div>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <div>
            <input
              type="text"
              className="input-group input-group-lg"
              placeholder="What do you think?"
              value={this.state.opinion}
              name="opinion"
              onChange={(e) => this.handleOpinion(e)}
            />
          </div>
          <input
            type="submit"
            className="btn btn-primary"
            value="Submit Opinion"
          />
        </form>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.props.user.name !== "" ? this.renderForm() : this.renderLogin()}
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

export default connect(mapStateToProps, mapDispatchToProps)(OpinionForm);
