import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class NavBar extends Component {
  renderLogin() {
    return (
      <div className="navbar-item float-md-right">
      <button className="btn-primary" onClick={() => this.props.changePopUp()}>
        Log In
      </button>
      </div>
    );
  }

  handleSignOut(e) {
    console.log("sign out");
    localStorage.clear();
    this.props.logout();
  }

  renderProfile() {
    return (
      <div className="navbar-item float-md-right">
        <h6>
          <Link to={`/user/${this.props.user.name}`} >
            {this.props.user.name}
          </Link>
        </h6>
        <button
          className="navbar-item btn btn-primary btn-small"
          onClick={(e) => this.handleSignOut(e)}
        >
          Sign Out
        </button>
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
    logout: () => dispatch({ type: "LOGOUT" }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
