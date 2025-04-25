import React from "react";
import backImage from "/Purple.png"; 

function SingleCard({ card, flipCard }) {
 
  const handleClick = () => {
    flipCard(card); 
  };

  return (
    <div className="card" onClick={handleClick}>
      <img
        src={card.isFlipped ? card.image : backImage}
        alt={card.isFlipped ? "Card" : "Back image"}
      />
    </div>
  );
}

export default SingleCard;
