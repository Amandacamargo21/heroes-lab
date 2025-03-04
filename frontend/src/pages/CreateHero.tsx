import React, { useState } from "react";
import { createHero, Hero, uploadHeroImage } from "../services/heroService";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import "../assets/heroform.css";

interface CreateHeroProps {
  onClose: () => void;
}

const CreateHero: React.FC<CreateHeroProps> = ({ onClose }) => {
  const [hero, setHero] = useState<Hero>({
    name: "",
    nickname: "",
    date_of_birth: new Date(),
    universe: "",
    main_power: "",
    avatar_url: "",
    is_active: true,
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "date_of_birth") {
      setHero({ ...hero, date_of_birth: new Date(value) });
    } else {
      setHero({ ...hero, [name]: value });
    }
  };

  // Upload da imagem antes de salvar
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

  // Salvar herói no banco
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hero.avatar_url) {
      alert("Por favor, envie uma imagem antes de salvar.");
      return;
    }

    await createHero(hero);
    alert("Herói criado com sucesso!");
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="hero-form">
      <label className="text-start">Nome completo</label>
      <input
        name="name"
        placeholder="Digite o nome completo"
        onChange={handleChange}
      />

      <label className="text-start">Nome de guerra</label>
      <input
        name="nickname"
        placeholder="Digite o nome de guerra"
        onChange={handleChange}
      />

      <div className="form-group">
        <div>
          <label className="text-start">Data de nascimento</label>
          <input
            type="text"
            name="date_of_birth"
            placeholder="Digite a data"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => e.target.value === "" && (e.target.type = "text")}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="text-start">Universo</label>
          <input
            name="universe"
            placeholder="Digite o universo"
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
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="text-start">Avatar</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageUpload}
          />
          {uploading && <p>Enviando imagem...</p>}
          {hero.avatar_url && (
            <img
              src={hero.avatar_url}
              alt="Avatar"
              className="avatar-preview"
            />
          )}
        </div>
      </div>

      <hr className="form-divider" />

      <div className="form-buttons">
        <button type="button" onClick={onClose} className="cancel-button">
          Cancelar
        </button>
        <button type="submit" className="save-button" disabled={uploading}>
          Salvar
        </button>
      </div>
    </form>
  );
};

export default CreateHero;
