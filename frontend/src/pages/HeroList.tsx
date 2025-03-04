import React, { useState } from "react";
import { Hero } from "../services/heroService";
import HeroCard from "../components/HeroCard";
import Modal from "../components/Modal";
import CreateHero from "./CreateHero";
import { useHeroes } from "../hooks/useHeroes";
import "../assets/styles.css";

const HeroList: React.FC = () => {
  // Obtemos os heróis, o loading e a função para atualizar a lista do hook
  const { heroes, loading, toggleStatus, fetchHeroes } = useHeroes();

  // Estados para modais e edição/ativação
  const [heroToActivate, setHeroToActivate] = useState<Hero | null>(null);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState<boolean>(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isCreateHeroModalOpen, setIsCreateHeroModalOpen] = useState<boolean>(false);
  const [heroToEdit, setHeroToEdit] = useState<Hero | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Estados para busca e paginação
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const heroesPerPage = 10;

  // Filtrando os heróis pelo termo de busca (usa nickname)
  const filteredHeroes = heroes.filter((hero) =>
    hero.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginação: calcula os índices para exibir apenas os heróis da página atual
  const indexOfLastHero = currentPage * heroesPerPage;
  const indexOfFirstHero = indexOfLastHero - heroesPerPage;
  const currentHeroes = filteredHeroes.slice(indexOfFirstHero, indexOfLastHero);
  const totalPages = Math.ceil(filteredHeroes.length / heroesPerPage);

  // Função para alternar o status do herói (ativa/desativa)
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

  // Função para alternar o menu aberto para cada herói
  const handleMenuToggle = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  // Confirmação para ativar um herói
  const confirmActivateHero = async () => {
    if (heroToActivate?.id) {
      toggleStatus(heroToActivate.id, true);
      setIsActivateModalOpen(false);
      setHeroToActivate(null);
    }
  };

  // Abre a modal de criação
  const handleCreateHero = () => {
    setHeroToEdit(null);
    setIsCreateHeroModalOpen(true);
  };

  // Abre a modal de edição
  const handleEditHero = (hero: Hero) => {
    setHeroToEdit(hero);
    setIsCreateHeroModalOpen(true);
  };

  // Após criação/edição, recarrega os heróis e fecha a modal
  const handleHeroSubmit = async () => {
    setIsLoading(true);
    await fetchHeroes();
    setIsLoading(false);
    setIsCreateHeroModalOpen(false);
  };

  return (
    <div className="hero-list-container">
      <h2 className="hero-title">Heróis</h2>

      <div className="hero-content-wrapper">
        {/* Área de busca e criação */}
        <div className="search-container">
          <button className="create-button" onClick={handleCreateHero}>
            Criar
          </button>
          <input
            type="text"
            placeholder="Digite o nome do herói"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reseta a página ao buscar
            }}
            className="search-input"
          />
          <button className="search-button">Buscar</button>
        </div>

        {/* Indicador de carregamento */}
        {isLoading ? (
          <div className="loading-indicator">Carregando...</div>
        ) : null}

        {/* Lista de Heróis */}
        {currentHeroes.length > 0 ? (
          <div className="hero-cards-container">
            {currentHeroes.map((hero) => (
              <HeroCard
                key={hero.id || ""}
                hero={hero}
                onClick={() => {}}
                onEdit={() => handleEditHero(hero)}
                onDelete={() => {}}
                onToggleActive={() =>
                  handleToggleStatus(hero.id ?? "", hero.is_active)
                }
                onActivate={confirmActivateHero}
                menuOpen={openMenuId === hero.id}
                onMenuToggle={() => handleMenuToggle(hero.id ?? "")}
                loadingToggle={loading.toggle ?? ""}
                loadingActivate={false}
              />
            ))}
          </div>
        ) : (
          <div className="no-heroes-message">Nenhum herói encontrado.</div>
        )}
      </div>

      {/* Paginação */}
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
              className={`pagination-number ${
                currentPage === pageNum ? "active" : ""
              }`}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="pagination-control"
          >
            &rsaquo;
          </button>
        </div>
      )}

      {/* Modal para confirmar ativação */}
      <Modal
        isOpen={isActivateModalOpen}
        onClose={() => setIsActivateModalOpen(false)}
      >
        <h4 className="text-start">Ativar Herói</h4>
        <hr />
        <span>Tem certeza que deseja ativar {heroToActivate?.name}?</span>
        <hr />
        <div className="form-buttons">
          <button
            className="cancel-button"
            onClick={() => setIsActivateModalOpen(false)}
          >
            Cancelar
          </button>
          <button className="activate-button" onClick={confirmActivateHero}>
            Confirmar Ativação
          </button>
        </div>
      </Modal>

      {/* Modal para criação/edição */}
      <Modal
        isOpen={isCreateHeroModalOpen}
        onClose={() => setIsCreateHeroModalOpen(false)}
      >
        <CreateHero
          heroData={heroToEdit}
          onClose={() => setIsCreateHeroModalOpen(false)}
          onSubmit={handleHeroSubmit}
        />
      </Modal>
    </div>
  );
};

export default HeroList;
