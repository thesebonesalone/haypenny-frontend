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
      userHasVote: false,
      userVoteId: 0,
      voteTally: 0,
      voteOffset: 0,
      votes: this.props.comment.votes,
      hide: false,
    };
  }
  componentDidMount() {
    if (this.props.user.name !== "") {
      let uservote = this.state.votes.filter((vote) => {
        return vote.user_id === this.props.user.id;
      });
      if (uservote.length > 0) {
        this.setState({
          userHasVote: true,
          userVoteId: uservote[0].id,
        });
      }
    }
    this.tallyVotes();
  }

  tallyVotes() {
    let count = 0;
    this.state.votes.forEach((vote) => {
      count += vote.value;
    });
    // count -= 
    this.setState({
      voteTally: count,
    });
  }
  handleUpvote() {
    this.sendVote(1);
  }
  handleDownvote() {
    this.sendVote(-1);
  }

  sendVote(value) {
    let data = {
      comment_id: this.props.comment.id,
      user_id: this.props.user.id,
      value: value,
    };
    let reqObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(URLIS + "/vote", reqObj)
      .then((resp) => resp.json())
      .then((message) => {
        console.log(message);
        if (this.state.userHasVote) {
          let newVotes = this.state.votes;
          let count = 0;
          newVotes.forEach((vote) => {
            if (vote.id === this.state.userVoteId) {
              newVotes[count].value = value;
            }
            count += 1;
          });
          this.setState({
            votes: newVotes,
          });
          this.tallyVotes();
        } else {
          this.setState({
            voteOffset: -value,
          });
        }
      });
  }

  handleDelete() {
    let reqObj = {
      method: "DELETE",
    };
    fetch(URLIS + `/comment/${this.props.comment.id}`, reqObj)
      .then((resp) => resp.json())
      .then((message) => {
        console.log(message);
        this.setState({
          hide: true,
        });
      });
  }

  renderDelete() {
    return (
      <button className="btn-danger exit" onClick={() => this.handleDelete()}>
        X
      </button>
    );
  }

  renderVotes() {
    return (
      <div className="col-" style={{ margin: "1%" }}>
        <div className="react-emoji" onClick={() => this.handleUpvote()}>
          👍
        </div>
        <div className="react-emoji" onClick={() => this.handleDownvote()}>
          👎
        </div>
      </div>
    );
  }
  renderComment() {
    return (
      <div className="card">
        <h5 className="card-title" style={{ margin: "1%" }}>
          <Link to={`/user/${this.props.comment.user}`}>
            {this.props.comment.user}
          </Link>{" "}
          on {this.state.parseDate}
        </h5>

        <div className="container-fluid">
          <div className="row" style={{ margin: "1%" }}>
            {this.props.user.name !== "" ? this.renderVotes() : null}
            <div
              className="col- "
              style={{ margin: "1%", textAlign: "center" }}
            >
              <div className="center">
                Score: {this.state.voteTally - this.state.voteOffset}
              </div>
            </div>

            <div className="col col-lg">
              <div className="card-body">
                <div>{this.props.comment.content}</div>
              </div>
            </div>
          </div>
        </div>
        <div>{this.props.userOwned ? this.renderDelete() : null}</div>
      </div>
    );
  }
  render() {
    return (
      <React.Fragment>
        {this.state.hide ? null : this.renderComment()}
      </React.Fragment>
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
