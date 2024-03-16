import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "../pages/home.jsx";
import { UserForm } from "../pages/userform.jsx";
import { ForgotPassword } from "../pages/forgotpassword.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { ErrorBoundary } from "react-error-boundary";
import { HandelError } from "../Errors/handelError.jsx";
import { ResetPassword } from "../pages/resetpassword.jsx";
import { ResetQuestion } from "../pages/resetquestion.jsx";
import { Toaster } from "react-hot-toast";
import useLocalStorage from "use-local-storage";
import { useEffect } from "react";

/**
 * Function component for the main App.
 *
 * @return {JSX.Element} The JSX element representing the main App component.
 */
function App() {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );
  const switchTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    if (theme === "dark") {
      document.querySelector("html").classList.add("dark-html");
    } else {
      document.querySelector("html").classList.remove("dark-html");
    }
  }, [theme]);
  return (
    <div className="App" data-theme={theme}>
      <ErrorBoundary
        FallbackComponent={HandelError}
        onReset={() => {
          document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          location.href = "/auth";
        }}
      >
        <Router>
          <Header switchTheme={switchTheme} theme={theme} />
          <Routes>
            <Route path="/" element={<UserForm />} />
            <Route path="/auth" element={<Home />} />
            <Route path="/auth/ForgotPassword" element={<ForgotPassword />} />
            <Route
              path="/auth/resetQuestion/:token"
              element={<ResetQuestion />}
            />
            <Route
              path="/auth/resetPassword/:token"
              element={<ResetPassword />}
            />
            <Route path="/*" element={<HandelError />} />
          </Routes>
          <Footer />
        </Router>
      </ErrorBoundary>
      <Toaster
        position="top-center"
        toastOptions={{
          className: "notification",
          duration: 4000,
        }}
      />
    </div>
  );
}

export default App;
