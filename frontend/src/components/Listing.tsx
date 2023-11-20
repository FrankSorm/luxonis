import React from 'react';

interface ListingProps {
  title: string;
  imageUrl: string;
}

const Listing: React.FC<ListingProps> = ({ title, imageUrl }) => {
  return (
    <div className="listing">
      <img src={imageUrl} alt={title} />
      <h3>{title}</h3>
    </div>
  );
};

export default Listing;