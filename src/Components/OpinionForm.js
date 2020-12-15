import React, { Component } from "react";
import { connect } from "react-redux";
import URLIS from "../Constants/URL";
import Opinion from "./Opinion";
class OpinionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opinion: "",
      opinionOwned: null,
    };
  }

  loadUserOpinions = () => {
    fetch(URLIS + `/opinion/view/${this.props.user.id}/${this.props.topic.id}`)
      .then((resp) => resp.json())
      .then((opinion) => {
        console.log(opinion);
        //debugger
        this.setState({
          opinionOwned: opinion.opinion,
        });
      });
    return null;
  };

  componentDidMount() {
    if (this.props.user.name !== "") {
      this.loadUserOpinions();
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    if (this.props.topic.id !== prevProps.topic.id){
    if (this.props.user.name !== "") {
      this.loadUserOpinions();
    }
    return null;
  }}
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
        let newOpinion = message.opinion
        newOpinion.topic = this.props.topic.title
        newOpinion.user = this.props.user.name
        newOpinion.reactions = []
        //debugger
        this.setState({
          opinion: "",
          opinionOwned: newOpinion
        });
      });
  };
  handleOpinion = (e) => {
    this.setState({
      opinion: e.target.value,
    });
  };

  checkRenderForm() {
    if (this.state.opinionOwned) {
      return (
        <React.Fragment>
          <h5>Your Opinion</h5>
          <Opinion opinion={this.state.opinionOwned} />
          {(Date.now().valueOf() - Date.parse(this.state.opinionOwned.created_at)) > 172800000 ? this.renderForm("Has your opinion changed?") : "You must wait to change your opinion."}
          
        </React.Fragment>
      );
    } else {
      return this.renderForm("What do you think?");
    }
  }
  renderForm(message) {
    return (
      <div>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <div>
            <h5>
              {this.state.opinion.length >= 256
                ? "Opinion must be 256 characters or less!"
                : `${256 - this.state.opinion.length} characters left!`}
            </h5>
            <input
              type="text"
              className="input-group input-group-lg"
              placeholder={message}
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
        {this.props.user.name !== ""
          ? this.checkRenderForm()
          : this.renderLogin()}
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
