import React from "react";
import "./styles.css";

function FileInput({ type, id, text, accept, state, setState, objectKey }) {
  return (
    <div className="custom-input-div">
      <label
        htmlFor={id}
        className={"custom-input " + (state ? "file-active " : "")}
      >
        {(state && state.name) ? `${text}: File ${state.name} Selected` : `Import ${text}`}
      </label>
      <input
        type={type}
        accept={accept}
        id={id}
        style={{ display: "none" }}
        className="custom-input"
        onChange={
          objectKey
            ? (e) =>
                setState(objectKey, e.target.files[0] ? e.target.files[0] : "")
            : (e) => setState(e.target.files[0] ? e.target.files[0] : "")
        }
      />
    </div>
  );
}

export default FileInput;
