import React, { useState } from "react";
import { Hero } from "../services/heroService";
import { FaTrash, FaEdit } from "react-icons/fa";
import { MdMoreVert } from "react-icons/md";

interface HeroCardProps {
  key: string;
  hero: Hero;
  onClick: () => void;  
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;  
  onToggleActive: (id: string, newStatus: boolean) => void;
  onActivate: (hero: Hero) => void;
  onMenuToggle: () => void;
  menuOpen: boolean;
  loadingToggle: string | undefined; 
  loadingActivate: boolean;
}

const HeroCard: React.FC<HeroCardProps> = ({
  hero,
  onClick,
  onDelete,
  onEdit,
  onToggleActive,
  onActivate,
  loadingToggle,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className={`hero-card ${hero.is_active ? "" : "inactive"}`} onClick={onClick}>
      {/* Botão de Menu */}
      <button
        className={`menu-button ${menuOpen ? "menu-active" : ""}`}
        onClick={handleMenuToggle}
        title="Abrir menu"
      >
        <MdMoreVert className="menu-icon" />
      </button>

      {/* Dropdown do Menu */}
      {menuOpen && (
        <div className="menu-dropdown">
          {/* Botões de Edição e Exclusão */}
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

          {/* Toggle de Ativação */}
          <div className="menu-item toggle">
            <label className="switch">
              <input
                type="checkbox"
                checked={hero.is_active}
                disabled={loadingToggle === hero.id}
                onChange={() =>
                  hero.is_active
                    ? onToggleActive(hero.id ?? "", false)
                    : onActivate(hero)
                }
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      )}

      {/* Avatar do Herói */}
      <div className="hero-avatar">
        <img src={hero.avatar_url} alt={hero.name} />
      </div>

      {/* Nome do Herói */}
      <h3 className="hero-name">{hero.name}</h3>
    </div>
  );
};

export default HeroCard;
