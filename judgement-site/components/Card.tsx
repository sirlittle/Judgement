import React from 'react';

export const Card = ({ rank, suit }) => {
  const imageUrl = `/card_images/${rank}_of_${suit}.png`;

  return (
    <div className="card">
      <img src={imageUrl} alt={`${rank} of ${suit}`} />
    </div>
  );
};

