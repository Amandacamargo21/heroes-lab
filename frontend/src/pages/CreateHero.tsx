import React, { useState, useEffect } from "react";
import { createHero, Hero, uploadHeroImage, updateHero } from "../services/heroService";
import "../assets/heroform.css";
import avatarPlaceholder from "../assets/images/avatar-svgrepo-com.png";

interface CreateHeroProps {
  onClose: () => void;
  heroData?: Hero | null;
  onSubmit: () => void; // Função chamada após criação ou edição
}

const CreateHero: React.FC<CreateHeroProps> = ({ onClose, heroData, onSubmit }) => {
  const [hero, setHero] = useState<Hero>(
    heroData ?? {
      id: undefined,
      name: "",
      nickname: "",
      date_of_birth: new Date(),
      universe: "",
      main_power: "",
      avatar_url: "",
      is_active: true,
    }
  );
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (heroData) {
      setHero(heroData);
    }
  }, [heroData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "date_of_birth") {
      setHero({ ...hero, date_of_birth: new Date(value) });
    } else {
      setHero({ ...hero, [name]: value });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);
    try {
      const imageUrl = await uploadHeroImage(file);
      setHero({ ...hero, avatar_url: imageUrl });
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      alert("Falha ao enviar a imagem. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hero.avatar_url) {
      alert("Por favor, envie uma imagem antes de salvar.");
      return;
    }

    if (heroData?.id) {
      // Se for edição, atualiza o herói
      await updateHero(hero);
    } else {
      // Caso contrário, cria um novo herói
      await createHero(hero);
    }

    // Chama a função onSubmit para atualizar a lista de heróis
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="hero-form">
      <div className="avatar-container">
        <div className="avatar-preview">
          <img src={hero.avatar_url || avatarPlaceholder} alt="Avatar" />
        </div>
        <label className="change-avatar">
          <input type="file" accept="image/png, image/jpeg" onChange={handleImageUpload} />
          {heroData ? "Alterar imagem" : "Escolher imagem"}
        </label>
      </div>

      <label className="text-start">Nome completo</label>
      <input name="name" placeholder="Digite o nome completo" value={hero.name} onChange={handleChange} />

      <label className="text-start">Nome de guerra</label>
      <input name="nickname" placeholder="Digite o nome de guerra" value={hero.nickname} onChange={handleChange} />

      <div className="form-group">
        <div>
          <label className="text-start">Data de nascimento</label>
          <input type="date" name="date_of_birth" value={hero.date_of_birth ? new Date(hero.date_of_birth).toISOString().split("T")[0] : ""} onChange={handleChange} />
        </div>
        <div>
          <label className="text-start">Universo</label>
          <input name="universe" placeholder="Digite o universo" value={hero.universe} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <div>
          <label className="text-start">Habilidade</label>
          <input name="main_power" placeholder="Digite a habilidade" value={hero.main_power} onChange={handleChange} />
        </div>
      </div>

      <hr className="form-divider" />

      <div className="form-buttons">
        <button type="button" onClick={onClose} className="cancel-button">
          Cancelar
        </button>
        <button type="submit" className="save-button" disabled={uploading}>
          {heroData ? "Atualizar" : "Salvar"}
        </button>
      </div>
    </form>
  );
};

export default CreateHero;
