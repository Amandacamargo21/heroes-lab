import React, { useEffect, useState } from "react";
import { getHeroes, Hero } from "../services/heroService";
import HeroCard from "../components/HeroCard";
import Modal from "../components/Modal";
import CreateHero from "./CreateHero";
import HeroDetails from "../components/HeroDetails";
import "../assets/styles.css";

const HeroList: React.FC = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null); 
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const heroesPerPage = 5;

  useEffect(() => {
    const fetchHeroes = async () => {
      const data = await getHeroes();
      setHeroes(data);
    };
    fetchHeroes();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredHeroes = heroes.filter((hero) =>
    hero.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastHero = currentPage * heroesPerPage;
  const indexOfFirstHero = indexOfLastHero - heroesPerPage;
  const currentHeroes = filteredHeroes.slice(indexOfFirstHero, indexOfLastHero);
  const totalPages = Math.ceil(filteredHeroes.length / heroesPerPage);

  return (
    <div className="hero-list-container">
      <h2 className="hero-title">Heróis</h2>

      <div className="hero-content-wrapper">
        <div className="search-container">
          <button
            className="create-button"
            onClick={() => setIsModalOpen(true)}
          >
            Criar
          </button>
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Digite o nome do herói"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          <button className="search-button">Buscar</button>
        </div>

        {currentHeroes.length > 0 ? (
          <div className="hero-cards-container">
            {currentHeroes.map((hero) => (
              <HeroCard 
                key={hero.id} 
                hero={hero} 
                onClick={() => setSelectedHero(hero)} 
              />
            ))}
          </div>
        ) : (
          <div className="no-heroes-message">Nenhum herói encontrado.</div>
        )}
      </div>

      {/* Modal para criar um novo herói */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h4 className="text-start">Criar Herói</h4>
        <hr className="form-divider" />
        <CreateHero onClose={() => setIsModalOpen(false)} />
      </Modal>

      <Modal isOpen={!!selectedHero} onClose={() => setSelectedHero(null)}>
        {selectedHero && <HeroDetails hero={selectedHero} onClose={() => setSelectedHero(null)} />}
      </Modal>

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
    </div>
  );
};

export default HeroList;
