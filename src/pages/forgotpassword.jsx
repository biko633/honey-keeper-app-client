import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import toast from "react-hot-toast";

/**
 * Function to handle the forgot password process, including checking for existing requests, sending emails, and resetting passwords.
 *
 * @param {string} type - The type of recovery method (email or question)
 * @return {string} Success or error message based on the recovery method chosen
 */
export const ForgotPassword = () => {
  const [forgotValue, setForgotValue] = useState("");
  const recover_url = import.meta.env.VITE_RECOVER_URL;
  const auth_url = import.meta.env.VITE_FRONTEND_AUTH_URL;
  const user_url = import.meta.env.VITE_USER_URL;
  const navigator = useNavigate();

  const isItFound = async (type) => {
    const response = await axios.post(`${recover_url}/add-user`, {
      username: forgotValue,
    });
    if (response.data.state === "Failed") {
      return "You have already sent a request to change your password please try again later";
    } else if (response.data.error) {
      return "User does't exist";
    } else {
      if (type === "email") {
        await axios.post(`${recover_url}/send-email`, {
          username: forgotValue,
        });
        return "An email has been sent with instructions";
      } else if (type === "question") {
        const response = await axios.post(`${recover_url}/add-question-token`, {
          username: forgotValue,
        });
        window.open(
          `${auth_url}/resetQuestion/${response.data.token}`,
          "_blank"
        );
        return "Please answer the question to reset your password";
      } else {
        return "You chose not to add a recovery method sorry";
      }
    }
  };

  //// ADD THE ERROR WHEN YOU CAN'T FIND ANYTHING LATER ///////
  async function getMethod(method) {
    if (method?.nothing) {
      return "You chose not to add a recovery method sorry";
    } else if (method?.email) {
      let tempEmail = "email";
      const answer = await isItFound(tempEmail);
      return answer;
    } else if (method?.question) {
      let tempQuestion = "question";
      const answer = await isItFound(tempQuestion);
      return answer;
    } else {
      return "User does't exist";
    }
  }

  /**
   * A function that handles form submission asynchronously.
   *
   * @param {Event} event - The event triggering the form submission
   * @return {Promise} A Promise that resolves after form submission is handled
   */
  const submit = async (event) => {
    event.preventDefault();
    const btn = document.getElementsByClassName("button-22");
    for (let i = 0; i < btn.length; i++) {
      btn[i].disabled = true;
    }
    if (forgotValue === "") {
      toast.error("Please fill the username field");
    } else if (forgotValue.includes(" ") === true) {
      toast.error("please remove any spaces in the username");
    } else {
      const response = await axios.post(`${user_url}/recover-info`, {
        username: forgotValue,
      });
      const show_response = await getMethod(response.data);
      toast.success(show_response);
    }
    setTimeout(() => {
      for (let i = 0; i < btn.length; i++) {
        btn[i].disabled = false;
      }
    }, 3000);
  };
  return (
    <main className="main">
      <fieldset className="all-fieldset">
        <button
          className="forgotpassword-goBack-button"
          onClick={() => navigator("/auth")}
        >
          <ArrowBackIcon />
        </button>
        <form id="forgotpassword-form" onSubmit={submit}>
          <h2>Forgot password</h2>
          <div className="forgotpassword-resetqustion">
            <label>
              <span>Enter your username</span>
            </label>
            <input
              value={forgotValue}
              className="forgotpassword-resetqustion-input"
              placeholder="Username"
              type="text"
              onChange={(event) =>
                setForgotValue(event.target.value.toLowerCase())
              }
            />
          </div>
          <button className="button-22" type="submit">
            Enter
          </button>
        </form>
      </fieldset>
    </main>
  );
};
