import React, { useState } from "react";
import { Hero } from "../services/heroService"; // 🔥 Importação corrigida
import HeroCard from "../components/HeroCard";
import Modal from "../components/Modal";
import { useHeroes } from "../hooks/useHeroes";
import "../assets/styles.css";

const HeroList: React.FC = () => {
  const { heroes, loading, toggleStatus } = useHeroes();
  const [heroToActivate, setHeroToActivate] = useState<Hero | null>(null);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState<boolean>(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleToggleStatus = (id: string, isActive: boolean) => {
    if (!isActive) {
      const hero = heroes.find((h) => h.id === id);
      if (hero) {
        setHeroToActivate(hero);
        setIsActivateModalOpen(true);
      }
    } else {
      toggleStatus(id, false);
    }
  };

  const handleMenuToggle = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };
  

  const confirmActivateHero = async () => {
    if (heroToActivate?.id) {
      toggleStatus(heroToActivate.id ?? "", true);
      setIsActivateModalOpen(false);
      setHeroToActivate(null);
    }
  };

  return (
    <div className="hero-list-container">
      <h2 className="hero-title">Heróis</h2>

      <div className="hero-content-wrapper">
        {heroes.length > 0 ? (
          <div className="hero-cards-container">
            {heroes.map((hero) => (
              <HeroCard
                key={hero.id || ""}
                hero={hero}
                onClick={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
                onToggleActive={() => handleToggleStatus(hero.id || "", hero.is_active)}
                onActivate={confirmActivateHero}
                menuOpen={openMenuId === hero.id}
                onMenuToggle={() => handleMenuToggle(hero.id || "")} 
                loadingToggle={loading.toggle}
                loadingActivate={null}
              />
            ))}
          </div>
        ) : (
          <div className="no-heroes-message">Nenhum herói encontrado.</div>
        )}
      </div>

      <Modal isOpen={isActivateModalOpen} onClose={() => setIsActivateModalOpen(false)}>
        <h4 className="text-start">Ativar Herói</h4>
        <hr />
        <span>Tem certeza que deseja ativar {heroToActivate?.name}?</span>
        <hr />
        <div className="form-buttons">
          <button className="cancel-button" onClick={() => setIsActivateModalOpen(false)}>
            Cancelar
          </button>
          <button className="activate-button" onClick={confirmActivateHero}>
            Confirmar Ativação
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default HeroList;

