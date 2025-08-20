import React from "react";

/**
 * Constructor function for the Footer component.
 *
 * @return {JSX.Element} The Footer component JSX
 */
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <p>
        Made by <a href="https://github.com/biko633">ahmed yeslam</a> {year}
      </p>
    </footer>
  );
}

export default Footer;
