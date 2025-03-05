import React, { useState } from "react";
import { Hero, deleteHero } from "../services/heroService";
import HeroCard from "../components/HeroCard";
import Modal from "../components/Modal";
import CreateHero from "./CreateHero";
import HeroDetails from "../components/HeroDetails";
import { useHeroes } from "../hooks/useHeroes";
import "../assets/herolist.css";
import { toast } from "react-toastify";

const HeroList: React.FC = () => {
  // Obtemos os heróis, loading e as funções do hook
  const { heroes, loading, toggleStatus, fetchHeroes } = useHeroes();

  // Estados para modais e operações
  const [heroToActivate, setHeroToActivate] = useState<Hero | null>(null);
  const [isActivateModalOpen, setIsActivateModalOpen] =
    useState<boolean>(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isCreateHeroModalOpen, setIsCreateHeroModalOpen] =
    useState<boolean>(false);
  const [heroToEdit, setHeroToEdit] = useState<Hero | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Estados para busca e paginação
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const heroesPerPage = 10;

  // Estados para exclusão
  const [heroToDelete, setHeroToDelete] = useState<Hero | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  // Estados para exibir os detalhes do herói
  const [heroToView, setHeroToView] = useState<Hero | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

  // Filtra os heróis pelo termo de busca (por nickname ou name)
  const filteredHeroes = heroes.filter(
    (hero) =>
      hero.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hero.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginação: calcula os índices para exibir apenas os heróis da página atual
  const indexOfLastHero = currentPage * heroesPerPage;
  const indexOfFirstHero = indexOfLastHero - heroesPerPage;
  const currentHeroes = filteredHeroes.slice(indexOfFirstHero, indexOfLastHero);
  const totalPages = Math.ceil(filteredHeroes.length / heroesPerPage);

  // Função unificada para ativação/desativação via slider:
  // Se o herói estiver ativo, desativa-o imediatamente;
  // Se estiver inativo, abre a modal para confirmar a ativação.
  const handleSliderToggle = (hero: Hero) => {
    if (hero.is_active) {
      toggleStatus(hero.id ?? "", false)
        .then(() => toast.success("Herói desativado com sucesso!"))
        .catch((error) => {
          console.error("Erro ao desativar herói:", error);
          toast.error("Erro ao desativar herói.");
        });
    } else {
      setHeroToActivate(hero);
      setIsActivateModalOpen(true);
    }
  };

  // Alterna o menu aberto para cada herói
  const handleMenuToggle = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  // Confirma ativação de herói (na modal)
  const confirmActivateHero = async () => {
    if (heroToActivate?.id) {
      try {
        await toggleStatus(heroToActivate.id, true);
        toast.success("Herói ativado com sucesso!");
      } catch (error) {
        console.error("Erro ao ativar herói:", error);
        toast.error("Erro ao ativar herói.");
      }
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
    try {
      await fetchHeroes();
    } catch (error) {
      console.error("Erro ao salvar herói:", error);
      toast.error("Erro ao salvar herói. Tente novamente.");
    } finally {
      setIsLoading(false);
      setIsCreateHeroModalOpen(false);
    }
  };

  // Abre a modal de exclusão
  const handleDeleteHero = (hero: Hero) => {
    setHeroToDelete(hero);
    setIsDeleteModalOpen(true);
  };

  // Confirma a exclusão
  const confirmDeleteHero = async () => {
    if (heroToDelete?.id) {
      try {
        await deleteHero(heroToDelete.id);
        await fetchHeroes();
        toast.success("Herói excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir herói:", error);
        toast.error("Erro ao excluir herói. Tente novamente.");
      } finally {
        setIsDeleteModalOpen(false);
        setHeroToDelete(null);
      }
    }
  };

  // Abre a modal de detalhes ao clicar no card
  const handleViewDetails = (hero: Hero) => {
    setHeroToView(hero);
    setIsDetailsModalOpen(true);
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

        {isLoading && <div className="loading-indicator">Carregando...</div>}

        {/* Lista de Heróis */}
        {currentHeroes.length > 0 ? (
          <div className="hero-cards-container">
            {currentHeroes.map((hero) => (
              <HeroCard
                key={hero.id || ""}
                hero={hero}
                onClick={() => handleViewDetails(hero)}
                onEdit={() => handleEditHero(hero)}
                onDelete={() => handleDeleteHero(hero)}
                onSliderToggle={() => handleSliderToggle(hero)}
                onMenuToggle={() => handleMenuToggle(hero.id ?? "")}
                menuOpen={openMenuId === hero.id}
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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`pagination-number ${
                  currentPage === pageNum ? "active" : ""
                }`}
              >
                {pageNum}
              </button>
            )
          )}
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

      {/* Modal para confirmar exclusão */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <h4 className="text-start">Excluir Herói</h4>
        <hr />
        <span>Tem certeza que deseja excluir {heroToDelete?.name}?</span>
        <hr />
        <div className="form-buttons">
          <button
            className="cancel-button"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancelar
          </button>
          <button className="delete-button" onClick={confirmDeleteHero}>
            Confirmar Exclusão
          </button>
        </div>
      </Modal>

      {/* Modal para criação/edição */}
      <Modal
        isOpen={isCreateHeroModalOpen}
        onClose={() => setIsCreateHeroModalOpen(false)}
      >
        <h4 className="text-start">
          {heroToEdit ? "Editar Herói" : "Criar de Herói"}
        </h4>
        <hr />
        <CreateHero
          heroData={heroToEdit}
          onClose={() => setIsCreateHeroModalOpen(false)}
          onSubmit={handleHeroSubmit}
        />
      </Modal>

      {/* Modal para exibir detalhes do herói */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      >
        <HeroDetails
          hero={heroToView}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default HeroList;
