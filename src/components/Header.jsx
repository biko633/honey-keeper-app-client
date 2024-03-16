import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import HiveIcon from "@mui/icons-material/Hive";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import toast from "react-hot-toast";
import Logout from "./Logout.jsx";
import DarkMode from "./Darkmodebutton.jsx";

/**
 * Renders the header component with theme switching and user authentication functionalities.
 *
 * @param {function} switchTheme - The function to switch the theme
 * @param {string} theme - The current theme
 * @return {JSX.Element} The header component UI
 */
export const Header = ({ switchTheme, theme }) => {
  const [cookies, setCookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    setAnchorEl(null);
  };

  return (
    <header>
      <div className="header-container">
        <h1>
          <HiveIcon />
          Honey Keeper
        </h1>
        <DarkMode switchTheme={switchTheme} theme={theme} />
        {cookies.token === undefined ? (
          <></>
        ) : (
          <>
            <div className="icon">
              <IconButton
                sx={{
                  position: "absolute",
                  cursor: "pointer",
                  right: "0%",
                  top: "-14%",
                }}
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <AccountCircleIcon sx={{ fontSize: "40px", color: "#fff" }} />
              </IconButton>
              <Popover
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                disableScrollLock={true}
              >
                <fieldset className="header-fieldset">
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      Logout(cookies);
                      setTimeout(() => {
                        navigate("/auth");
                        toast.success("Successfully logged out");
                      }, 500);
                    }}
                  >
                    Logout
                  </MenuItem>
                </fieldset>
              </Popover>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
