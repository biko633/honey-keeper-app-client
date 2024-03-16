import { React, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { cleanHTML } from "../utils/cleanHTML";
import IconButton from "@mui/material/IconButton";
import { ConfirmDialog } from "../utils/confirmDialog.jsx";

/**
 * A React component that renders a note with a title, content, and delete button.
 *
 * @param {object} props - The properties passed to the component.
 * @return {JSX.Element} The rendered note component.
 */
function Note(props) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleClick() {
    props.onDelete(props.id);
  }

  const english = /^[A-Za-z0-9!@#$%^&*()]*$/;
  var align = "left";

  if (!english.test(props.title)) {
    align = "right";
  }

  const cleanContent = cleanHTML(props.content);

  return (
    <div className="note" style={{ textAlign: align }}>
      <h1>{props.title}</h1>
      <p dangerouslySetInnerHTML={{ __html: cleanContent }}></p>
      <IconButton aria-label="delete" onClick={() => setConfirmOpen(true)}>
        <DeleteIcon />
      </IconButton>
      <ConfirmDialog
        title="Delete Note?"
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={handleClick}
      >
        Are you sure you want to delete this note?
      </ConfirmDialog>
    </div>
  );
}

export default Note;
