import React from "react";
import { Link, useParams } from "react-router-dom";
import "./styles.css";

function PodcastCard({ id, title, displayImage }) {
  return (
    <Link to={`/podcasts/${id}`}>
      <div className="podcast-card">
        <img src={displayImage} alt={title} className="display-img-podcast"/>
        <p className="card-title">{title}</p>
      </div> 
    </Link>
  );
}

export default PodcastCard;
