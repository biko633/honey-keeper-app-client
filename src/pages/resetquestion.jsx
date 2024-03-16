import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useErrorBoundary } from "react-error-boundary";

/**
 * Function to reset a security question for password recovery.
 *
 * @return {JSX.Element} The component for resetting the security question.
 */
export const ResetQuestion = () => {
  const { token } = useParams();
  const navigator = useNavigate();
  const { showBoundary } = useErrorBoundary();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const recover_url = import.meta.env.VITE_RECOVER_URL;

  const checkWho = useMemo(
    () => async () => {
      try {
        const response = await axios.post(
          recover_url + "/check-question-token",
          {
            token: token,
          }
        );
        setQuestion(response.data.question);
        toast("Please answer the question to reset your password");
      } catch (err) {
        showBoundary(err);
      }
    },
    [token]
  );

  useEffect(() => {
    checkWho();
  }, [checkWho]);

  /**
   * Asynchronously sends a request and disables the specified buttons while awaiting the response. If the response contains an error, displays an error message; otherwise, redirects the user to reset their password.
   *
   * @param {Event} event - The event triggering the function
   * @return {Promise<void>} A promise that resolves when the function completes
   */
  const send = async (event) => {
    event.preventDefault();
    const btn = document.getElementsByClassName("button-22");
    for (let i = 0; i < btn.length; i++) {
      btn[i].disabled = true;
    }
    try {
      const response = await axios.post(
        recover_url + "/submit-question-token",
        {
          token: token,
          answer: answer,
        }
      );
      if (response.data.error) {
        toast.error(
          "You answer your question incorrectly please try another time"
        );
      } else {
        const password_token = response.data.token;
        navigator(`/auth/resetPassword/${password_token}`);
      }
    } catch (err) {
      showBoundary(err);
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
        <form onSubmit={send}>
          <h2>Reset question</h2>
          <div className="forgotpassword-resetqustion">
            <label for="answer">
              <span>{question}</span>
            </label>
            <input
              type="text"
              className="forgotpassword-resetqustion-input"
              value={answer}
              placeholder="enter your answer"
              name="answer"
              onChange={(event) => setAnswer(event.target.value)}
            />
          </div>
          <button className="button-22" type="submit">
            Submit
          </button>
        </form>
      </fieldset>
    </main>
  );
};
