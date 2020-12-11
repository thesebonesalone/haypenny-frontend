import React, { Component } from "react";
import { connect } from "react-redux";
import URLIS from "../Constants/URL";

class NavBar extends Component {

    renderLogin() {
        return (
            <button class="btn-primary" onClick={() => this.props.changePopUp()}>Log In</button>
        )
    }
    renderProfile() {
        return (
            <div>{this.props.user.name}</div>
        )
    }

    render() {
        return (
            <div>
                {this.props.user.name !== "" ? this.renderProfile()
                : this.renderLogin() }
            </div>

        )
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(NavBar);