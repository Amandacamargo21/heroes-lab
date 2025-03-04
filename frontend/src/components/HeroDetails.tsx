import React from "react";
import { Hero } from "../services/heroService";

interface HeroDetailsProps {
  hero: Hero | null;
  onClose: () => void;
}

const HeroDetails: React.FC<HeroDetailsProps> = ({ hero, onClose }) => {
  if (!hero) return null;

  // Formata a data antes de exibir
  const formattedDate = hero.date_of_birth
    ? new Date(hero.date_of_birth).toLocaleDateString("pt-BR") 
    : "Não informada";

  return (
    <div className="hero-details">
      <h2>{hero.name}</h2>
      <button className="close-button" onClick={onClose}>✖</button>

      <div className="hero-avatar">
        <img src={hero.avatar_url} alt={hero.name} />
      </div>

      <div className="hero-info">
        <div>
          <strong>Nome completo:</strong> {hero.name}
        </div>
        <div>
          <strong>Data de nascimento:</strong> {formattedDate} 
        </div>
        <div>
          <strong>Universo:</strong> {hero.universe}
        </div>
        <div>
          <strong>Habilidade:</strong> {hero.main_power}
        </div>
      </div>

      <button className="close-modal-button" onClick={onClose}>Fechar</button>
    </div>
  );
};

export default HeroDetails;
