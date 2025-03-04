import React from "react";
import { Hero } from "../services/heroService";

interface HeroCardProps {
  hero: Hero;
  onClick: () => void; 
}

const HeroCard: React.FC<HeroCardProps> = ({ hero, onClick }) => {
  return (
    <div className="hero-card" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="hero-avatar">
        <img src={hero.avatar_url} alt={hero.name} />
      </div>
      <h3 className="hero-name">{hero.name}</h3>
    </div>
  );
};

export default HeroCard;
