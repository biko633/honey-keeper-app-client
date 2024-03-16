import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import toast from "react-hot-toast";
import { useErrorBoundary } from "react-error-boundary";

export const ResetPassword = () => {
  const { token } = useParams();
  const navigator = useNavigate();
  const { showBoundary } = useErrorBoundary();
  const [newPassword, setNewPassword] = useState("");
  const [conformPassword, setConformPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const recover_url = import.meta.env.VITE_RECOVER_URL;
  useEffect(() => {
    const checkWho = async () => {
      try {
        const response = await axios.post(
          recover_url + "/check-password-token",
          {
            token: token,
          }
        );
        let element = document.getElementById("RP");
        element.classList.remove("hidden-class");
      } catch (err) {
        showBoundary(err);
      }
    };
    checkWho();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const btn = document.getElementsByClassName("button-22");
    for (let i = 0; i < btn.length; i++) {
      btn[i].disabled = true;
    }
    try {
      if (
        newPassword === "" ||
        conformPassword === "" ||
        newPassword.includes(" ") === true ||
        conformPassword.includes(" ") === true
      ) {
        toast.error("Please fill all fields or remove any spaces");
      } else if (newPassword != conformPassword) {
        toast.error("Your password does not match please try again");
      } else {
        const reset = await axios.post(recover_url + "/resetPassword", {
          token: token,
          newPassword: newPassword,
        });
        if (reset.data.successful) {
          toast.success("Your password reset was successful please log in");
          navigator("/auth");
        } else {
          toast.error("SOmething went wrong");
        }
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
      <div id="RP" className="hidden-class">
        <fieldset className="all-fieldset">
          <form onSubmit={onSubmit}>
            <h2>Reset password</h2>
            <div className="all-input-icons">
              <LockIcon />
              <input
                type={visible ? "text" : "password"}
                name="newPassword"
                value={newPassword}
                placeholder="Enter your new password"
                onChange={(event) => setNewPassword(event.target.value)}
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
            <div className="all-input-icons">
              <LockIcon />
              <input
                type={visible2 ? "text" : "password"}
                name="conformPassword"
                value={conformPassword}
                placeholder="ReEnter your new password"
                onChange={(event) => setConformPassword(event.target.value)}
              />
              {visible2 ? (
                <VisibilityIcon
                  sx={{
                    cursor: "pointer",
                    marginLeft: "-25px",
                    backgroundColor: "#dad5d5",
                    borderRadius: "3px",
                  }}
                  onClick={() => setVisible2(!visible2)}
                />
              ) : (
                <VisibilityOffIcon
                  sx={{
                    cursor: "pointer",
                    marginLeft: "-25px",
                    backgroundColor: "#dad5d5",
                    borderRadius: "3px",
                  }}
                  onClick={() => setVisible2(!visible2)}
                />
              )}
            </div>
            <button className="button-22" type="submit">
              Submit
            </button>
          </form>
        </fieldset>
      </div>
    </main>
  );
};
