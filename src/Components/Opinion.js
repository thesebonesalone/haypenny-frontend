import React, { Component } from "react";
import { connect } from "react-redux";
import URLIS from "../Constants/URL";
import Overlay from "react-bootstrap/Overlay";

class Opinion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReact: false,
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
      console.log(e.target)
      debugger
      let data = {user_id: this.props.user.id, opinion_id: this.props.opinion.id, type: e.target.dataset.name}
      let reqObj = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
      fetch(URLIS + "/reaction",reqObj)
      .then((resp) => resp.json())
      .then((message) => {
        console.log(message)
      })



  }
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
        {love.length !== 0 ? <div >😍 x{love.length}</div> : null }
        {laugh.length !== 0 ? <div >🤣 x{laugh.length}</div> : null}
        {like.length !== 0 ? <div >😊 x{like.length}</div> : null}
        {dislike.length !== 0 ? <div >😠 x{dislike.length}</div> : null}
        {angry.length !== 0 ? <div >😡 x{angry.length}</div> : null}
        {confused.length !== 0 ? <div >🤔 x{confused.length}</div> : null}
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
                <div className="react-emoji" type="button" data-name="LOVE" value='😍' onClick={(e) => this.handleClick(e)}>😍</div>
              </div>
              <div className="col-sm">
                <div className="react-emoji" type="button" data-name='LAUGH' value='🤣'  onClick={(e) => this.handleClick(e)}>🤣</div>
              </div>
              <div className="col-sm">
                <div className="react-emoji" type="button" data-name='LIKE' value='😊' onClick={(e) => this.handleClick(e)}>😊</div>
              </div>
              <div className="col-sm">
                <div className="react-emoji" type="button" data-name='DISLIKE' value='😠' onClick={(e) => this.handleClick(e)}>😠</div>
              </div>
              <div className="col-sm">
                <div className="react-emoji" type="button" data-name='ANGRY' value='😡' onClick={(e) => this.handleClick(e)}>😡</div>
              </div>
              <div className="col-sm">
                <div className="react-emoji" type="button" data-name='CONFUSED' value='🤔' onClick={(e) => this.handleClick(e)}>🤔</div>
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
    return (
      <div className="card" style={{ margin: "20px" }}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col-md-8">
              <div className="card-body">
                <h5 className="card-title">
                  On the topic of {this.props.opinion.topic}
                </h5>
                <div>{this.props.opinion.content}</div>
                <div>
                  ~{this.props.opinion.user}, {this.parseDate()}
                </div>
                <div>
                  {this.props.user.name !== ""
                    ? this.renderReactButton()
                    : null}
                </div>
              </div>
            </div>
            <div className="col-6 col-md-4">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">Reactions</h6>
                  {this.renderReactionsTally()}
                </div>
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
