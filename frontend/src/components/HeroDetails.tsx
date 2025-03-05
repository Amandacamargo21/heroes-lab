import React from "react";
import { Hero } from "../services/heroService";
import "../assets/heroDetails.css";

interface HeroDetailsProps {
  hero: Hero | null;
  onClose: () => void;
}

const HeroDetails: React.FC<HeroDetailsProps> = ({ hero, onClose }) => {
  if (!hero) return null;

  const formattedDate = hero.date_of_birth
    ? new Date(hero.date_of_birth).toLocaleDateString("pt-BR")
    : "Não informada";

  return (
    <div className="hero-details">
      <h4 className="hero-details-title">{hero.name}</h4>
      <hr className="form-divider" />

      <div className="hero-details-content">
        <div className="hero-avatar">
          <img src={hero.avatar_url} alt={hero.name} />
        </div>

        <div className="hero-info">
          <div>
            <label>Nome completo:</label>
            <span>{hero.name}</span>
          </div>
          <div>
            <label>Data de nascimento:</label>
            <span>{formattedDate}</span>
          </div>
          <div>
            <label>Universo:</label>
            <span>{hero.universe}</span>
          </div>
          <div>
            <label>Habilidade:</label>
            <span>{hero.main_power}</span>
          </div>
        </div>
      </div>

      <hr className="form-divider" />
      <button className="close-modal-button" onClick={onClose}>
        Fechar
      </button>
    </div>
  );
};

export default HeroDetails;
