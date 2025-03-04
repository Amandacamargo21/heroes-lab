import React, { useState } from "react";
import { Hero } from "../services/heroService";
import HeroCard from "../components/HeroCard";
import Modal from "../components/Modal";
import { useHeroes } from "../hooks/useHeroes";
import "../assets/styles.css";

const HeroList: React.FC = () => {
  const { heroes, loading, toggleStatus } = useHeroes();
  const [heroToActivate, setHeroToActivate] = useState<Hero | null>(null);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState<boolean>(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const heroesPerPage = 10;

  // 🔥 Filtrando heróis pelo termo de busca
  const filteredHeroes = heroes.filter((hero) =>
    hero.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔥 Paginação correta aplicando o filtro
  const indexOfLastHero = currentPage * heroesPerPage;
  const indexOfFirstHero = indexOfLastHero - heroesPerPage;
  const currentHeroes = filteredHeroes.slice(indexOfFirstHero, indexOfLastHero);
  const totalPages = Math.ceil(filteredHeroes.length / heroesPerPage);

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
      toggleStatus(heroToActivate.id, true);
      setIsActivateModalOpen(false);
      setHeroToActivate(null);
    }
  };

  return (
    <div className="hero-list-container">
      <h2 className="hero-title">Heróis</h2>

      <div className="hero-content-wrapper">
      <div className="search-container">
        <button className="create-button">Criar</button>
        <input
          type="text"
          placeholder="Digite o nome do herói"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // 🔥 Resetar a página ao buscar
          }}
          className="search-input"
        />
        <button className="search-button">Buscar</button>
      </div>

      {/* 🔥 Lista de Heróis */}
      {currentHeroes.length > 0 ? (
        <div className="hero-cards-container">
          {currentHeroes.map((hero) => (
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
              loadingToggle={loading?.toggle ?? null}
              loadingActivate={null}
            />
          ))}
        </div>
      ) : (
        <div className="no-heroes-message">Nenhum herói encontrado.</div>
      )}
      </div>
      

      {/* 🔄 Paginação */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-control"
          >
            &lsaquo;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`pagination-number ${currentPage === pageNum ? "active" : ""}`}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-control"
          >
            &rsaquo;
          </button>
        </div>
      )}

      {/* 🔥 Modal de Confirmação para Ativar */}
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
