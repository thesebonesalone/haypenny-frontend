import React, { Component } from "react";
import { connect } from "react-redux";
import URLIS from "../Constants/URL";
import { Link } from "react-router-dom";
import Overlay from "react-bootstrap/Overlay";

class Opinion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReact: false,
      loveOffset: 0,
      laughOffset: 0,
      likeOffset: 0,
      dislikeOffset: 0,
      angryOffset: 0,
      confusedOffset: 0,
    };
  }
  parseDate() {
    let dateArray = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let splitDate = this.props.opinion.created_at.split("T")[0].split("-");
    let returnDate =
      dateArray[parseInt(splitDate[1]) - 1] +
      " " +
      splitDate[2] +
      ", " +
      splitDate[0];

    return returnDate;
  }
  handleClick = (e) => {
    let name = e.target.dataset.name;
    // debugger
    let data = {
      user_id: this.props.user.id,
      opinion_id: this.props.opinion.id,
      type: e.target.dataset.name,
    };
    let reqObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    fetch(URLIS + "/reaction", reqObj)
      .then((resp) => resp.json())
      .then((message) => {
        this.setState({
          showReact: false,
          loveOffset: 0,
          laughOffset: 0,
          likeOffset: 0,
          dislikeOffset: 0,
          angryOffset: 0,
          confusedOffset: 0,
        });
        switch (name) {
          case "LOVE":
            this.setState({
              loveOffset: 1,
            });
            break;
          case "LAUGH":
            this.setState({
              laughOffset: 1,
            });
            break;
          case "LIKE":
            this.setState({
              likeOffset: 1,
            });
            break;
          case "DISLIKE":
            this.setState({
              dislikeOffset: 1,
            });
            break;
          case "ANGRY":
            this.setState({
              angryOffset: 1,
            });
            break;
          case "CONFUSED":
            this.setState({
              confusedOffset: 1,
            });
            break;
        }
      });
  };
  toggleReact() {
    let newReact = this.state.showReact;
    this.setState({
      showReact: !newReact,
    });
  }
  renderReactionsTally() {
    let love = this.props.opinion.reactions.filter((reaction) => {
      return reaction === "LOVE";
    });
    let laugh = this.props.opinion.reactions.filter((reaction) => {
      return reaction === "LAUGH";
    });
    let like = this.props.opinion.reactions.filter((reaction) => {
      return reaction === "LIKE";
    });
    let dislike = this.props.opinion.reactions.filter((reaction) => {
      return reaction === "DISLIKE";
    });
    let angry = this.props.opinion.reactions.filter((reaction) => {
      return reaction === "ANGRY";
    });
    let confused = this.props.opinion.reactions.filter((reaction) => {
      return reaction === "CONFUSED";
    });
    return (
      <div>
        {love.length + this.state.loveOffset !== 0 ? (
          <div>😍 x{love.length + this.state.loveOffset}</div>
        ) : null}
        {laugh.length + this.state.laughOffset !== 0 ? (
          <div>🤣 x{laugh.length + this.state.laughOffset}</div>
        ) : null}
        {like.length + this.state.likeOffset !== 0 ? (
          <div>😊 x{like.length + this.state.likeOffset}</div>
        ) : null}
        {dislike.length + this.state.dislikeOffset !== 0 ? (
          <div>😠 x{dislike.length + this.state.dislikeOffset}</div>
        ) : null}
        {angry.length + this.state.angryOffset !== 0 ? (
          <div>😡 x{angry.length + this.state.angryOffset}</div>
        ) : null}
        {confused.length + this.state.confusedOffset !== 0 ? (
          <div>🤔 x{confused.length + this.state.confusedOffset}</div>
        ) : null}
      </div>
    );
  }

  renderReactions() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div classname="container-fluid" style={{ width: "50%" }}>
            <div className="row">
              <div className="col-sm">
                <div
                  className="react-emoji"
                  type="button"
                  data-name="LOVE"
                  value="😍"
                  onClick={(e) => this.handleClick(e)}
                >
                  😍
                </div>
              </div>
              <div className="col-sm">
                <div
                  className="react-emoji"
                  type="button"
                  data-name="LAUGH"
                  value="🤣"
                  onClick={(e) => this.handleClick(e)}
                >
                  🤣
                </div>
              </div>
              <div className="col-sm">
                <div
                  className="react-emoji"
                  type="button"
                  data-name="LIKE"
                  value="😊"
                  onClick={(e) => this.handleClick(e)}
                >
                  😊
                </div>
              </div>
              <div className="col-sm">
                <div
                  className="react-emoji"
                  type="button"
                  data-name="DISLIKE"
                  value="😠"
                  onClick={(e) => this.handleClick(e)}
                >
                  😠
                </div>
              </div>
              <div className="col-sm">
                <div
                  className="react-emoji"
                  type="button"
                  data-name="ANGRY"
                  value="😡"
                  onClick={(e) => this.handleClick(e)}
                >
                  😡
                </div>
              </div>
              <div className="col-sm">
                <div
                  className="react-emoji"
                  type="button"
                  data-name="CONFUSED"
                  value="🤔"
                  onClick={(e) => this.handleClick(e)}
                >
                  🤔
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderReactButton() {
    return (
      <div>
        <React.Fragment>
          {this.state.showReact ? this.renderReactions() : null}
        </React.Fragment>
        <button
          className="btn btn-primary"
          style={{ margin: "20px" }}
          onClick={() => this.toggleReact()}
        >
          React
        </button>
      </div>
    );
  }

  render() {
    //debugger
    return (
      <div className="card" style={{ margin: "20px" }}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-8">
              <div className="card-body">
                <h5 className="card-title">
                  On the topic of{" "}
                  <Link to={`/topic/${this.props.opinion.topic}`}>
                    {this.props.opinion.topic}
                  </Link>
                </h5>
                <div>{this.props.opinion.content}</div>
                <div>
                  ~<Link to={`/user/${this.props.opinion.user}`}>{this.props.opinion.user}</Link>, {this.parseDate()}
                </div>
                <div>
                  {this.props.user.name !== ""
                    ? this.renderReactButton()
                    : null}
                </div>
              </div>
            </div>
            <div className="col-sm-4">
                <div className="card-body">
                  <h6 className="card-title">Reactions</h6>
                  <div className="card-text reaction-box">{this.renderReactionsTally()}</div>
                
              </div>
            </div>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Opinion);
