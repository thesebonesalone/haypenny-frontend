import React, { Component } from "react";
import { connect } from "react-redux";
import URLIS from "../Constants/URL";
import MediaQuery from "react-responsive";

class Notice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirm: false
    };
}

  renderNotice() {
    return (
      <div className="card-body" style={{ textAlign: "center" }}>
        <h2 className="card-title">IMPORTANT NOTICE</h2>
        <div className="container">
            <div className="card">
            <p>If you're seeing this message you probably know me, in that case, please remember that this app will be shown to future employers.
            Because of that, please be mindful of the language and content in your posts! All posts are subject to removal at my discretion,
            so be good!</p>
            <p>While using this, feel free to log in, create Topics and Opinions, React to Opinions, and scope out what others have to say!</p>
            <p>If you're an employer visting and this notice isn't down (Or you're scoping my Git Repo) then welcome! This project was
                built with a Rails backend and a React Frontend. The CSS is courtesy of Bootstrap with a little custom work thrown in for taste.
                It also looks good on a phone!
            </p>
            <p>You might be interested in some of my other projects!</p>
            <p>A Javascript Sequencer called <a href="http://dcccviii.herokuapp.com/">DCCCVIII</a> made in collaboration with Mike Sapienza and Tom Bigelow</p>
            <p>A pure Javascript game engine called <a href="https://github.com/thesebonesalone/BonkersJs">BonkersJS</a> that is being updated regularly.</p>
            <p>Or my blog <a href="https://duikhead2.medium.com/">here!</a></p>            
            <p>Have fun!</p>
             
             </div>
            <h3>~Will</h3>
        </div>
        </div>
    );
  }

  handleDismiss() {
      this.props.dismiss()
      this.props.storeDismiss()
  }
  render() {
    return (
      <React.Fragment>
          <div className="overlay card container-fluid" style={{height: 'auto'}}>
            <button
              className="btn-danger exit"
              onClick={() => this.handleDismiss()}
            >
              X
            </button>
            {this.renderNotice()}
          </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return { notice: state.notice };
};

const mapDispatchToProps = (dispatch) => {
  return {
    storeDismiss: () => dispatch({ type: "DISMISS_NOTICE"}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notice);
