import axios from "axios";

/**
 * Logout function that handles the user logout process by using the provided cookies.
 *
 * @param {object} cookies - The cookies object containing the user token.
 * @return {Promise<void>} A Promise that resolves after the user is successfully logged out.
 */
export default async function Logout(cookies) {
  try {
    const token = cookies.token;
    const user_url = import.meta.env.VITE_USER_URL;
    const response = await axios.get(`${user_url}/userId`, {
      params: {
        token: token,
      },
    });
    const userID = response.data.userID;
    const response_2 = await axios.put(`${user_url}/logout`, {
      params: {
        id: userID,
      },
    });
    if (response_2.data.status === "Success") {
      response_2.data.status;
    } else {
      response_2.data.status;
    }
  } catch (err) {
    // console.log(err);
  }
}
