import React, { Component } from "react";
import { connect } from "react-redux";
import URLIS from "../Constants/URL";

class NavBar extends Component {
  renderLogin() {
    return (
      <button class="btn-primary" onClick={() => this.props.changePopUp()}>
        Log In
      </button>
    );
  }

  handleSignOut(e){
    console.log("sign out")
    localStorage.clear()
    this.props.logout()

  }

  renderProfile() {
    return (
      <div className="nav-item">
        <button className="btn btn-primary nav-item" onClick={(e) => this.handleSignOut(e)}>Sign Out</button>
        <div className="nav-item">{this.props.user.name}</div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.props.user.name !== ""
          ? this.renderProfile()
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
    logout: () => dispatch({ type: "LOGOUT"})
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
