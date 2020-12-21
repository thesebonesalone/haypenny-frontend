import React, { Component } from "react";
import { connect } from "react-redux";
import URLIS from "../Constants/URL";
import { Link } from "react-router-dom";

class Comment extends Component {
  constructor(props) {
    super(props);
    let date = new Date(this.props.comment.created_at);
    let arrayDate = date.toString().split(" ");
    let parseDate = [arrayDate[1], arrayDate[2], arrayDate[3]].join(" ");
    this.state = {
      parseDate: parseDate,
    };
  }
  render() {
    return (
      <div className="card">
        <h5 className="card-title" style={{ margin: "1%" }}>
          <Link to={`/user/${this.props.comment.user}`}>
            {this.props.comment.user}
          </Link>{" "}
          on {this.state.parseDate}
        </h5>
        <div className="card-body">{this.props.comment.content}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
