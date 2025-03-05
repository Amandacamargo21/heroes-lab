import React, { useState, useEffect } from "react";
import { createHero, Hero, uploadHeroImage, updateHero } from "../services/heroService";
import "../assets/heroform.css";
import avatarPlaceholder from "../assets/images/avatar-svgrepo-com.png";
import { toast } from "react-toastify";

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
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false); // flag para evitar duplicação

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
      toast.dismiss();
      toast.success("Imagem enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      toast.dismiss();
      toast.error("Falha ao enviar a imagem. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Se já submetido, não prossegue
    if (submitted) return;
    setSubmitted(true);
    toast.dismiss();
    if (!hero.avatar_url) {
      toast.error("Por favor, envie uma imagem antes de salvar.");
      setSubmitted(false);
      return;
    }
    try {
      if (heroData?.id) {
        // Modo edição: atualiza o herói
        await updateHero(hero);
        toast.success("Herói atualizado com sucesso!");
      } else {
        // Modo criação: cria um novo herói
        await createHero(hero);
        toast.success("Herói criado com sucesso!");
      }
      onSubmit();
    } catch (error) {
      console.error("Erro ao salvar herói:", error);
      toast.dismiss();
      toast.error("Erro ao salvar herói. Tente novamente.");
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="hero-form">
      {/* Avatar no topo */}
      <div className="avatar-container">
        <div className="avatar-preview">
          <img src={hero.avatar_url || avatarPlaceholder} alt="Avatar" />
        </div>
        <label className="change-avatar">
          <input type="file" accept="image/png, image/jpeg" onChange={handleImageUpload} />
          {uploading ? "Enviando..." : heroData ? "Alterar imagem" : "Escolher imagem"}
        </label>
      </div>

      {/* Campos Editáveis */}
      <label className="text-start">Nome completo</label>
      <input
        name="name"
        placeholder="Digite o nome completo"
        value={hero.name}
        onChange={handleChange}
      />

      <label className="text-start">Nome de guerra</label>
      <input
        name="nickname"
        placeholder="Digite o nome de guerra"
        value={hero.nickname}
        onChange={handleChange}
      />

      <div className="form-group">
        <div>
          <label className="text-start">Data de nascimento</label>
          <input
            type="date"
            name="date_of_birth"
            value={hero.date_of_birth ? new Date(hero.date_of_birth).toISOString().split("T")[0] : ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="text-start">Universo</label>
          <input
            name="universe"
            placeholder="Digite o universo"
            value={hero.universe}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <div>
          <label className="text-start">Habilidade</label>
          <input
            name="main_power"
            placeholder="Digite a habilidade"
            value={hero.main_power}
            onChange={handleChange}
          />
        </div>
      </div>

      <hr className="form-divider" />

      {/* Campos Somente Leitura (apenas em modo edição) */}
      {heroData && (
        <>
          <div className="form-group">
            <div className="read-only-field">
              <label>ID:</label>
              <input type="text" value={heroData.id || ""} disabled />
            </div>
            <div className="read-only-field">
              <label>Status:</label>
              <input type="text" value={heroData.is_active ? "Ativo" : "Inativo"} disabled />
            </div>
          </div>
          <div className="form-group">
            <div className="read-only-field">
              <label>Criado em:</label>
              <input
                type="text"
                value={heroData.createdAt ? new Date(heroData.createdAt).toLocaleString("pt-BR") : ""}
                disabled
              />
            </div>
            <div className="read-only-field">
              <label>Atualizado em:</label>
              <input
                type="text"
                value={heroData.updatedAt ? new Date(heroData.updatedAt).toLocaleString("pt-BR") : ""}
                disabled
              />
            </div>
          </div>
          <hr className="form-divider" />
        </>
      )}

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
