import { useEffect, useState } from "react";
import { getHeroes, toggleHeroStatus, Hero } from "../services/heroService";

export const useHeroes = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState<{ toggle: string | null }>({ toggle: null });

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const data = await getHeroes();
        setHeroes(data);
      } catch (error) {
        console.error("Erro ao buscar heróis:", error);
      }
    };
    fetchHeroes();
  }, []);

  const toggleStatus = async (id: string, isActive: boolean) => {
    if (!isActive) return;

    setLoading((prev) => ({ ...prev, toggle: id }));
    try {
      const updatedStatus = await toggleHeroStatus(id, isActive);
      setHeroes((prev) =>
        prev.map((hero) => (hero.id === id ? { ...hero, is_active: updatedStatus } : hero))
      );
    } catch (error) {
      console.error("Erro ao alternar status:", error);
    } finally {
      setLoading((prev) => ({ ...prev, toggle: "" }));
    }
  };

  return { heroes, loading, toggleStatus };
};
