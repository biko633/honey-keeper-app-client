import React, { useState, useEffect, useRef } from "react";
import Note from "../components/Note.jsx";
import axios from "axios";
// import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useErrorBoundary } from "react-error-boundary";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { RichTextEditor } from "../components/RichTextEditor.jsx";
import { clearContent } from "../utils/cleanContent.jsx";
import useLocalStorage from "use-local-storage";

//////// TEST THE ADD TO LOCAL STORAGE AND SAVE IT HERE THEN REMOVE IT //////////////

export const Home = () => {
  axios.defaults.withCredentials = true;
  const navigator = useNavigate();
  const [userID, setUserID] = useState("");
  const tempId = useRef("");
  const [note, setNote] = useState({
    title: "",
    content: "",
  });
  const [notes, setNotes] = useState([]);
  // const [cookies, _] = useCookies(["token"]);
  const [token, setToken] = useLocalStorage("token", "");
  const note_url = import.meta.env.VITE_NOTE_URL;
  const refresh_url = import.meta.env.VITE_REFRESH_URL;
  const user_url = import.meta.env.VITE_USER_URL;
  const { showBoundary } = useErrorBoundary();

  const fetchNotes = async () => {
    try {
      const response = await axios.get(note_url + "/savedNotes", {
        headers: {
          Authorization: token,
        },
      });
      if (response.data.no_token) {
        console.log("the userId is " + tempId.current);
        handelRefreshToken(tempId.current);
      } else if (response.data.notes) {
        setNotes(response.data.notes);
      }
    } catch (err) {
      showBoundary(err);
    }
  };

  useEffect(() => {
    async function getID() {
      // const token = cookies.token;
      // console.log("the cookies is" + JSON.stringify(token));
      console.log("the token is " + token);
      try {
        const response = await axios.get(user_url + "/userId", {
          params: {
            token: token,
          },
        });
        console.log("we got response");
        console.log(response);

        if (response.data.empty) {
          ("we got empty response");
          navigator("/auth");
        } else if (response.data.userID) {
          setUserID(response.data.userID);
          tempId.current = response.data.userID;
          fetchNotes();
        }
      } catch (err) {
        showBoundary(err);
      }
    }
    getID();
  }, []);
  //// THIS WILL MAKE REFRESH TOKEN IN DATABASE /////
  /////////////////////// LOGOUT USER WHEN REFRESH TOKEN IS EXPIRED /////////////////////
  const handelRefreshToken = async (user_id) => {
    try {
      const checkRefresh = await axios.get(refresh_url + "/check_token", {
        params: { token: token },
      });
      // if (checkRefresh.data.message === "Not Found") {
      //   toast(
      //     "You have been inactive for too long and your token is expired. Please login again"
      //   );
      //   navigator("/auth");
      if (checkRefresh.data.message === "Found") {
        // const response = await axios.get(refresh_url + "/add_refreshToken", {
        //   params: { id: user_id },
        // });
        const response_2 = await axios.get(refresh_url + "/add_AccessToken", {
          params: { id: user_id },
        });
        setToken(response_2.data.token);
        setNotes([...notes]);

        // toast.success("Your session has been refreshed try again");
      } else {
        navigator("/auth");
      }
    } catch (err) {
      showBoundary(err);
    }
  };
  function addNote() {
    const saveNote = async () => {
      try {
        const response = await axios.post(note_url + `/${userID}`, note, {
          headers: {
            Authorization: token,
          },
        });
        console.log(response);

        // if (response.data.no_token) {
        //   handelRefreshToken(userID);
        // } else {
        const response_2 = await axios.put(note_url, {
          noteID: response.data._id,
          userID,
          headers: {
            Authorization: token,
          },
        });
        console.log("this is response 2 " + response_2);
        setNotes((prevNotes) => {
          return [...prevNotes, response.data];
        });
        setNote({
          title: "",
          content: "",
        });
        clearContent();
        toast.success("Successfully added a new note");
        // }
      } catch (err) {
        showBoundary(err);
      }
    };
    saveNote();
  }
  function deleteNote(id) {
    setNotes((prevNotes) => {
      return prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
    });
    console.log("the notes is " + notes);

    deleteNoteServer(this.did);
    toast.success("Successfully deleted a note");
  }

  const deleteNoteServer = async (NID) => {
    try {
      const response = await axios.put(note_url + "/deletedNote", {
        headers: {
          Authorization: token,
        },
        userID,
        noteID: NID,
      });
      console.log(response);
      console.log("delete note " + token);
      // if (response.data.no_token) {
      //   handelRefreshToken(userID);
      // }
    } catch (err) {
      showBoundary(err);
    }
  };

  const get_title = (event) => {
    const { name, value } = event.target;

    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  };
  const get_content = (content) => {
    setNote((prevNote) => {
      return {
        ...prevNote,
        content: content,
      };
    });
  };

  return (
    <main className="main">
      <div className="rich-text-editor">
        <fieldset className="rich-text-editor-fieldset">
          <input
            name="title"
            placeholder="Title"
            className="ProseMirror"
            value={note.title}
            onChange={get_title}
          ></input>
          <RichTextEditor getData={get_content} />
          <button className="rich-text-editor-submit-button" onClick={addNote}>
            Submit
          </button>
          <button
            className="rich-text-editor-clear-button"
            onClick={clearContent}
          >
            Clear
          </button>
        </fieldset>
      </div>
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 200: 1, 700: 2, 1000: 3, 1300: 4, 1650: 5 }}
      >
        <Masonry columnsCount={5} gutter="2px">
          {notes.map((noteItem, index) => {
            return (
              <Note
                key={index}
                id={index}
                did={noteItem._id}
                title={noteItem.title}
                content={noteItem.content}
                onDelete={deleteNote}
              />
            );
          })}
        </Masonry>
      </ResponsiveMasonry>
    </main>
  );
};
