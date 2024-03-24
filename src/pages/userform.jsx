import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import toast from "react-hot-toast";
// import { useCookies } from "react-cookie";
import { useErrorBoundary } from "react-error-boundary";
import { motion } from "framer-motion";
import useLocalStorage from "use-local-storage";

/**
 * Initializes the UserForm component. Retrieves the user ID using a token from cookies,
 * checks if the user is logged in, and redirects if necessary.
 *
 * @param {None}
 * @return {JSX.Element} The LoginForm component to be rendered.
 */
export const UserForm = () => {
  const navigator = useNavigate();
  const [token, setToken] = useLocalStorage("token", "");
  // const [cookies, _] = useCookies(["token"]);
  const user_url = import.meta.env.VITE_USER_URL;

  useEffect(() => {
    async function getID() {
      // const token = cookies.token;
      const response = await axios.get(user_url + "/userId", {
        params: {
          token: token,
        },
      });
      if (response.data.userID) {
        toast("You are already logged in");
        navigator("/");
      }
    }
    getID();
  }, []);

  return <LoginForm />;
};

/**
 * Renders a login form component.
 *
 * @return {JSX.Element} The login form component.
 */
const LoginForm = () => {
  const { showBoundary } = useErrorBoundary();
  const [RegBut, setRegBut] = useState(false);
  const [LogBut, setLogBut] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [recover, setRecover] = useState("nothing");
  const [question, setQuestion] = useState(
    "What was your childhood best friend's nickname?"
  );
  const [answer, setAnswer] = useState("");
  const [visible, setVisible] = useState(false);
  const [token, setToken] = useLocalStorage("token", "");
  const navigator = useNavigate();
  const user_url = import.meta.env.VITE_USER_URL;
  const refresh_url = import.meta.env.VITE_REFRESH_URL;
  const [flip, setFlip] = useState(false);
  const [isRemember, setIsRemember] = useState(false);
  const flipOptions = {
    rotateY: 360,
  };

  function handelRemember() {
    setIsRemember(!isRemember);
  }

  const handelRecover = (e) => {
    setRecover(e.target.value);
  };

  const handelQuestion = (e) => {
    setQuestion(e.target.value);
  };

  const handelForgot = () => {
    navigator("/auth/ForgotPassword");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const btn = document.getElementsByClassName("button-22");
    for (let i = 0; i < btn.length; i++) {
      btn[i].disabled = true;
    }
    if (username === "" || password === "") {
      toast.error("Please fill all fields");
    } else if (
      username.includes(" ") === true ||
      password.includes(" ") === true
    ) {
      toast.error("please remove any spaces in your username or password");
    } else if (username.length > 20) {
      toast.error("username must be less than or equal to 20 characters");
    } else if (password.length > 127) {
      toast.error("password must be less than or equal to 127 characters");
    } else {
      axios.defaults.withCredentials = true;
      if (RegBut) {
        try {
          if (
            (recover === "email" && email === "") ||
            email.includes(" ") === true
          ) {
            toast.error("please submit an email address without spaces");
          } else if (recover === "question" && answer === "") {
            toast.error("please submit an answer");
          } else {
            const response = await axios.post(user_url + "/register", {
              username: username,
              password: password,
              recover:
                recover === "email"
                  ? { email: email }
                  : recover === "question"
                  ? { question: question, answer: answer }
                  : { nothing: true },
              type:
                recover === "email"
                  ? "email"
                  : recover === "question"
                  ? "answer"
                  : "nothing",
            });

            if (response.data.error) {
              toast.error(response.data.error);
              setRegBut(false);
            } else if (response.data.Success) {
              setToken(response.data.token);
              const response_refresh = await axios.get(
                refresh_url + "/add_refreshToken",
                {
                  params: { id: response.data.id },
                }
              );
              if (response_refresh.data.error) {
                showBoundary(response_refresh.data.error);
              }
              setRegBut(false);
              toast.success("Successfully Registered");
              navigator("/");
            }
          }
        } catch (err) {
          showBoundary(err);
        }
      } else if (LogBut) {
        try {
          const response = await axios.post(user_url + "/login", {
            username: username,
            password: password,
            remember: isRemember,
          });
          console.log(response);
          if (response.data.error) {
            toast.error(response.data.error);
            setLogBut(false);
          } else if (response.data.Success) {
            console.log("success is here " + response.data.Success);
            localStorage.setItem("token", response.data.token);
            // setToken(response.data.token);
            // setToken(response.data.token);
            // const response_refresh = await axios.get(
            //   refresh_url + "/add_refreshToken",
            //   {
            //     params: { id: response.data.id },
            //   }
            // );
            // if (response_refresh.data.error) {
            //   showBoundary(response_refresh.data.error);
            // }
            setLogBut(false);
            toast.success("Successfully Logged In");
            navigator("/");
          }
        } catch (err) {
          showBoundary(err);
        }
      }
    }
    setTimeout(() => {
      for (let i = 0; i < btn.length; i++) {
        btn[i].disabled = false;
      }
    }, 3000);
  };

  return (
    <main className="main">
      <motion.div
        transition={{ transition: { duration: 0.45 } }}
        animate={flip ? flipOptions : ""}
      >
        <fieldset className="all-fieldset">
          <form onSubmit={onSubmit}>
            <h2 className="disable-formH2">{flip ? "Register" : "Login"}</h2>

            <div className="all-input-icons">
              <PersonIcon />
              <input
                name="Username"
                type="text"
                className="disable-userInputs"
                placeholder="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="on"
                maxLength="20"
              />
            </div>
            <div className="all-input-icons">
              <LockIcon />
              <input
                name="Password"
                type={visible ? "text" : "password"}
                className="disable-userInputs"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="on"
                maxLength="127"
              />
              {visible ? (
                <VisibilityIcon
                  sx={{
                    cursor: "pointer",
                    marginLeft: "-25px",
                    backgroundColor: "#dad5d5",
                    borderRadius: "3px",
                  }}
                  onClick={() => setVisible(!visible)}
                />
              ) : (
                <VisibilityOffIcon
                  sx={{
                    cursor: "pointer",
                    marginLeft: "-25px",
                    backgroundColor: "#dad5d5",
                    borderRadius: "3px",
                  }}
                  onClick={() => setVisible(!visible)}
                />
              )}
            </div>

            <div className={`all-input-icons ${flip ? "" : "hidden-class"}`}>
              <AutorenewIcon />
              <select
                name="recover"
                className="userform-dropdown-select"
                value={recover}
                onChange={handelRecover}
              >
                <option value="nothing">nothing</option>
                <option value="email">email</option>
                <option value="question">question</option>
              </select>
            </div>
            <div hidden={!flip}>
              <div hidden={recover != "email"}>
                <div className="all-input-icons">
                  <EmailIcon />
                  <input
                    name="email"
                    type="email"
                    className="disable-userInputs"
                    placeholder="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </div>
              <div hidden={recover != "question"}>
                <div className="all-input-icons">
                  <QuestionMarkIcon />
                  <select
                    name="question"
                    className="userform-dropdown-select"
                    value={question}
                    onChange={handelQuestion}
                  >
                    <option value="What was your childhood best friend's nickname?">
                      What was your childhood best friend's nickname?
                    </option>
                    <option value="In which city did your parents meet?">
                      In which city did your parents meet?
                    </option>
                    <option value="What's your neighbor's last name?">
                      What's your neighbor's last name?
                    </option>
                    <option value="How many pets did you have at 10 years old?">
                      How many pets did you have at 10 years old?
                    </option>
                    <option value="What month did you get married?">
                      What month did you get married?
                    </option>
                  </select>
                </div>
                <div className="all-input-icons">
                  <QuestionAnswerIcon />
                  <input
                    name="answer"
                    className="disable-userInputs"
                    type="text"
                    placeholder="answer"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="userform-remember-checkbox">
              <label>
                <input
                  hidden={flip}
                  className="disable-rememberInput"
                  type="checkbox"
                  id="remember"
                  onClick={handelRemember}
                />
                <span hidden={flip}>Remember me</span>
              </label>

              <div>
                {!flip && (
                  <a className="disable-forgot" onClick={handelForgot}>
                    Forgot Password?
                  </a>
                )}
              </div>
            </div>

            <div className="disable-button-container">
              <button
                hidden={flip}
                type="submit"
                value={LogBut}
                className="button-22"
                onClick={(event) => setLogBut(true)}
              >
                Login
              </button>
              <button
                hidden={!flip}
                type="submit"
                value={RegBut}
                className="button-22"
                onClick={(event) => setRegBut(true)}
              >
                Register
              </button>
            </div>
            <h4>
              {flip ? "Already have an account? " : "Don't have an account? "}
              <a
                onClick={() => {
                  setFlip(!flip);
                }}
              >
                {flip ? "Login" : "Register"} here
              </a>
            </h4>
          </form>
        </fieldset>
      </motion.div>
    </main>
  );
};
