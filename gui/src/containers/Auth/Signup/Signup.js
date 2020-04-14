import React from "react";
import Button from "../../../components/UI/Button/Button";
import classes from "../Auth.module.css";
import { Redirect } from "react-router-dom";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { updateObject, checkValidity } from "../../../shared/utility";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import { createForm } from "../../../shared/utility";

class Auth extends React.Component {
  state = {
    controls: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your Email",
        },
        value: "",
        label: "Email",
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false,
      },
      username: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Desired Username",
        },
        value: "",
        label: "Username",
        validation: {
          required: true,
          isEmail: true,
        },
        valid: false,
        touched: false,
      },
      password1: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Your Password",
        },
        value: "",
        label: "Password",
        validation: {
          required: true,
          minLength: 6,
        },
        valid: false,
        touched: false,
      },
      password2: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Confirm Password",
        },
        value: "",
        label: "Confirm Password",
        validation: {
          required: true,
          minLength: 6,
        },
        valid: false,
        touched: false,
      },
    },
    IsSignup: true,
  };

  componentDidMount() {
    if (this.props.auth.token != null) {
      console.log("ONSETAUTHREDIRECT");
      this.props.onSetAuthRedirectPath();
    }
  }

  inputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(this.state.controls, {
      [controlName]: updateObject(this.state.controls[controlName], {
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true,
      }),
    });
    this.setState({
      controls: updatedControls,
    });
  };

  submitHandler = (event) => {
    event.preventDefault();
    console.log("SUBMIT");
    const email = this.state.controls.email.value;
    const username = this.state.controls.username.value;
    const password1 = this.state.controls.password1.value;
    const password2 = this.state.controls.password2.value;
    this.props.onSignup(username, email, password1, password2);
  };

  switchAuthModeHandler = () => {
    this.props.history.push("/login");
  };

  render() {
    let form = createForm(this.state.controls, this.inputChangedHandler);

    if (this.props.loading) {
      form = <Spinner />;
    }

    let authRedirect = null;
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to={this.props.authRedirectPath} />;
    }
    let errorMessage = null;
    if (this.props.auth.error) {
      errorMessage = <p>{this.props.auth.error}</p>;
    }
    return (
      <div className={classes.Auth}>
        {authRedirect}
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success" type="submit">
            {" "}
            SUBMIT{" "}
          </Button>
          <Button btnType="Danger" clicked={this.switchAuthModeHandler}>
            {" "}
            LOGIN{" "}
          </Button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignup: (username, email, password1, password2) => {
      dispatch(actions.signup(username, email, password1, password2));
    },
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath("/")),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
