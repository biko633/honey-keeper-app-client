/**
 * Handle error and display error page.
 *
 * @param {object} error - the error object
 * @param {object} errorInfo - the error information object
 * @param {function} resetErrorBoundary - the function to reset error boundary
 * @return {JSX.Element} the error page component
 */
export const HandelError = ({ error, errorInfo, resetErrorBoundary }) => {
  const error_status = error?.response?.data?.status || 500;
  const error_name = error?.response?.data?.error || "error in server";
  const error_message =
    error?.response?.data?.message || "Something went wrong";

  return (
    <div id="EPage">
      <div className="EPage">
        <h1 className="EH1">{error_status}</h1>
        <h2 className="EH2">{error_name}</h2>
        <p className="EP">{error_message}</p>
        <button className="EB" onClick={resetErrorBoundary}>
          Home
        </button>
      </div>
    </div>
  );
};
