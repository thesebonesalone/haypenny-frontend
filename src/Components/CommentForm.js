import React, { Component } from "react";
import { connect } from "react-redux";
import URLIS from "../Constants/URL";
import Opinion from "./Opinion";

class CommentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: "",
    };
  }

  handleChange(e) {
    this.setState({
      comment: e.target.value,
    });
  }
  handleSubmit(e) {
      e.preventDefault()
      if (this.state.comment !== '') {
         let data = {user_id: this.props.user.id, opinion_id: this.props.opinionId, content: this.state.comment}
         let reqObj = {
             method: "POST",
             headers: {
                 "Content-Type": "application/json"
             },
             body: JSON.stringify(data),
         }
         fetch(URLIS + "/comment", reqObj)
         .then((resp) => resp.json())
         .then((message) => {
            console.log(message)
            this.setState({
                comment: ""
            })
            this.props.addCommentToStable(message.comment)
         })
    


      }
  }

  render() {
    return (
      <React.Fragment>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <div>
            <input
              className="input-lg"
              type="text"
              style={{ width: "95%", margin: "2.5%"}}
              placeholder="Leave a comment"
              value={this.state.comment}
              onChange={(e) => this.handleChange(e)}
            />
          </div>
          <input type="submit" className="btn btn-primary"/>
        </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(CommentForm);
