import React, { Component } from "react";
import { connect } from "react-redux";
import OpinionForm from "./OpinionForm";
import { Link } from "react-router-dom";

class Topic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
    };
  }
  swapForm() {
    let newShowForm = this.state.showForm;
    this.setState({
      showForm: !newShowForm,
    });
  }

  renderOpinionForm() {
    return <div>{this.props.doUpdate ? null : <OpinionForm topic={this.props.topic} />}</div>;
  }
  componentDidUpdate() {
    if (this.props.doUpdate === true){
      this.setState({
        showForm: false
      })
    }
  }

  render() {
    return (
      <div className="card" style={{ margin: "20px" }}>
        <div className="card-body">
          <h4>
            <Link
              className="card-title"
              to={`/topic/${this.props.topic.title}`}
            >
              {this.props.topic.title}
            </Link>
          </h4>
          <div>
            <button
              className="btn btn-primary"
              style={{ margin: "20px" }}
              onClick={() => this.swapForm()}
            >
              {this.state.showForm ? "Nevermind" : "Give an Opinion"}
            </button>
          </div>
          <React.Fragment>
            {this.state.showForm ? this.renderOpinionForm() : null}
          </React.Fragment>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Topic);
