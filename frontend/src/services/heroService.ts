import api from "./api";

export interface Hero {
    id?: number;
    name: string;
    nickname: string;
    date_of_birth: Date;
    universe: string;
    main_power: string;
    avatar_url: string;
    is_active: boolean;
}

// Busca todos os heróis
export const getHeroes = async () => {
    const response = await api.get("/heroes");
    return response.data;
}

// Cria um novo herói
export const createHero = async (hero: Hero) => {
    const response = await api.post("/heroes", hero);
    return response.data;
}

// Faz upload da imagem para o backend, que envia para o S3
export const uploadHeroImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file); 

    const response = await api.post("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data.fileUrl; 
};
