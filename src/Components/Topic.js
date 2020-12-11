import React, { Component } from "react";
import { connect } from "react-redux";
import OpinionForm from "./OpinionForm";
import URLIS from "../Constants/URL";

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
    return <OpinionForm topic={this.props.topic} />;
  }

  render() {
    return (
      <div className="card" style={{margin: '20px'}}>
        <div className="card-body">
          <h4 className="card-title">{this.props.topic.title}</h4>
          <div>
            <button className="btn btn-primary" style={{margin: '20px'}} onClick={() => this.swapForm()}>
              {this.state.showForm ? "Nevermind" : "Give an Opinion"}
            </button>
            <button className="btn btn-primary" style={{margin: '20px'}}>Scope it Out</button>
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
