import React, { Component } from "react";
import { connect } from "react-redux";
import URLIS from "../Constants/URL";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      password: "",
      new_name: "",
      email: "",
      new_password: "",
      confirm_password: "",
      login: true,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("THIS IS WORKING");
    let data = {
      name: this.state.name.toLowerCase(),
      password: this.state.password,
    };
    let reqObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    fetch(URLIS + "/auth", reqObj)
      .then((resp) => resp.json())
      .then((message) => {
        localStorage.setItem('my_app_token', message.token)
        this.props.changePopUp();
        this.props.login(message.user);
      });

    console.log(reqObj);
  };
  handleChange = (e) => {
    switch (e.target.name) {
      case "username":
        return this.setState({
          name: e.target.value,
        });
      case "password":
        return this.setState({
          password: e.target.value,
        });
      case "new_username":
        return this.setState({
          new_name: e.target.value,
        });
      case "email":
        return this.setState({
          email: e.target.value,
        });
      case "new_password":
        return this.setState({
          new_password: e.target.value,
        });
      case "confirm_password":
        return this.setState({
          confirm_password: e.target.value,
        });
      default:
        return null;
    }
  };
  handleSwap = (e) => {
    let newTruth = this.state.login;
    this.setState({
      login: !newTruth,
    });
  };

  renderLogin() {
    return (
      <div className="card-body" style={{ textAlign: "center" }}>
        <h2 className="card-title">Login</h2>
        <div className="container-fluid">
          <form onSubmit={(e) => this.handleSubmit(e)}>
            <div className="row">
              <div className="col">
                <input
                  style={{ width: "100%" }}
                  type="text"
                  name="username"
                  placeholder="username"
                  value={this.state.name}
                  onChange={(e) => this.handleChange(e)}
                />
              </div>
              <div className="col">
                <input
                  style={{ width: "100%" }}
                  type="password"
                  name="password"
                  placeholder="password"
                  value={this.state.password}
                  onChange={(e) => this.handleChange(e)}
                />
              </div>
            </div>
            <div className="row" style={{margin: "20px"}}>
              <div className="col" style={{ textAlign: "center" }}>
                <input
                  style={{ width: "75%" }}
                  className="btn-primary"
                  type="submit"
                  value="Login"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
  handleSubmitSignup = (e) => {
    e.preventDefault();
    if (this.state.new_password === this.state.confirm_password) {
      let data = {
        user: {
          name: this.state.new_name.toLowerCase(),
          password: this.state.new_password,
          email: this.state.email,
          profile_picture: null,
        },
      };
      let reqObj = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      fetch(URLIS + "/user", reqObj)
        .then((resp) => resp.json())
        .then((message) => {
          if (message.message === "Success") {
            alert("user created successfully");
            this.props.changePopUp();
            this.props.login(message.user);
          } else {
            alert("user was not created");
          }
        });
    } else {
      alert("Passwords must match!");
    }
  };

  renderSignUp() {
    return (
      <div className="card-body" style={{ textAlign: "center" }}>
        <h2 className="card-title">Sign Up</h2>
        <div className="container-fluid">
          <form onSubmit={(e) => this.handleSubmitSignup(e)}>
            <div className="row">
              <div className="col">
                <input
                  style={{ width: "100%" }}
                  type="text"
                  name="new_username"
                  placeholder="username"
                  value={this.state.new_name}
                  onChange={(e) => this.handleChange(e)}
                />
                <input
                  style={{ width: "100%" }}
                  type="text"
                  name="email"
                  placeholder="email"
                  value={this.state.email}
                  onChange={(e) => this.handleChange(e)}
                />
              </div>
              <div className="col">
                <input
                  style={{ width: "100%" }}
                  type="password"
                  name="new_password"
                  placeholder="password"
                  value={this.state.new_password}
                  onChange={(e) => this.handleChange(e)}
                />
                <input
                  style={{ width: "100%" }}
                  type="password"
                  name="confirm_password"
                  placeholder="confirm password"
                  value={this.state.confirm_password}
                  onChange={(e) => this.handleChange(e)}
                />
              </div>
            </div>
            <div className="row" style={{margin: "20px"}}>
              <div className="col" style={{ textAlign: "center" }}>
                <input
                  style={{ width: "75%" }}
                  className="btn-primary"
                  type="submit"
                  value="Sign Up"
                ></input>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="floating-overlay card">
        <button
          className="btn-danger exit"
          onClick={() => this.props.changePopUp()}
        >
          X
        </button>
        {this.state.login ? this.renderLogin() : this.renderSignUp()}
        <button className="btn-primary" onClick={(e) => this.handleSwap()}>
          {this.state.login ? "sign up" : "login"}
        </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
