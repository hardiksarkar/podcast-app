import React from "react";
import "./styles.css";
import Button from "../../Common/Button";

function EpisodeDetails({ title, description, index, audioFile, onClick }) {
  return (
    <div className="episode-details-container">
      <h2 className="episode-details-title">
        {index}. {title}
      </h2>
      <p className="episode-details-desc">{description}</p>
      <Button text={"Play"} onClick={() => onClick(audioFile)} />
    </div>
  );
}

export default EpisodeDetails;
