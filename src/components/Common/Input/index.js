import React from "react";
import "./styles.css";

function InputComponent({ type, state, setState, placeholder, required, objectKey }) {

  return (
    <div className="custom-input-div">
      <input
        type={type}
        value={state}
        onChange={objectKey?(e)=>setState(objectKey,e.target.value):(e) => setState(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="custom-input"
      />
    </div>
  );
}

export default InputComponent;
