import React, { useState } from "react";
import { Hero } from "../services/heroService";
import { FaTrash, FaEdit, FaSpinner } from "react-icons/fa";
import { MdMoreVert } from "react-icons/md";
import  "../assets/heroCard.css";


interface HeroCardProps {
  key: string;
  hero: Hero;
  onClick: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSliderToggle: (hero: Hero) => void;
  onMenuToggle: () => void;
  menuOpen: boolean;
  loadingToggle: string | undefined;
  loadingActivate: boolean;
}

const HeroCard: React.FC<HeroCardProps> = ({
  hero,
  onClick,
  onEdit,
  onDelete,
  onSliderToggle,
  onMenuToggle,
  menuOpen: _menuOpen,
  loadingToggle,
  loadingActivate: _loadingActivate,
}) => {
  const [localMenuOpen, setLocalMenuOpen] = useState(false);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalMenuOpen((prev) => !prev);
    onMenuToggle();
  };

  // Função auxiliar que executa uma ação e fecha o menu após 1 segundo
  const handleAction = (action: () => void) => {
    action();
    setTimeout(() => {
      setLocalMenuOpen(false);
    }, 1000);
  };

  return (
    <div
      className={`hero-card ${hero.is_active ? "" : "inactive"}`}>
      {/* Overlay do spinner (centralizado no card) */}
      {loadingToggle === hero.id && (
        <div className="spinner-overlay">
          <FaSpinner className="spinner-icon" />
        </div>
      )}

      {/* Botão de Menu */}
      <button
        className={`menu-button ${localMenuOpen ? "menu-active" : ""}`}
        onClick={handleMenuToggle}
        title="Abrir menu"
      >
        <MdMoreVert className="menu-icon" />
      </button>

      {/* Dropdown do Menu */}
      {localMenuOpen && (
        <div className="menu-dropdown">
          {hero.is_active && (
            <>
              <button
                className="menu-item delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(hero.id ?? "");
                }}
                disabled={!hero.is_active}
                title="Excluir Herói"
              >
                <FaTrash />
              </button>
              <button
                className="menu-item edit"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(hero.id ?? "");
                }}
                disabled={!hero.is_active}
                title="Editar Herói"
              >
                <FaEdit />
              </button>
            </>
          )}
          <div className="menu-item toggle">
            <label className="switch">
              <input
                type="checkbox"
                checked={hero.is_active}
                disabled={loadingToggle === hero.id}
                onChange={() => handleAction(() => onSliderToggle(hero))}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      )}

      {/* Avatar do Herói */}
      <div className="hero-avatar" onClick={onClick}>
        <img src={hero.avatar_url} alt={hero.name} />
      </div>

      {/* Nome do Herói */}
      <h3 className="hero-name" onClick={onClick}>{hero.nickname}</h3>
    </div>
  );
};

export default HeroCard;
