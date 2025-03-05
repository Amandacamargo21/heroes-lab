import request from "supertest";
import { app, server } from "../server";
import Hero from "../models/hero.model";
import * as HeroController from "../controllers/hero.controller";
import sequelize from "../config/database";

jest.mock("../models/hero.model");
jest.spyOn(HeroController, "deleteImageFromS3").mockImplementation(async (imageUrl) => {
    console.log(`🛠️ Mock deleteImageFromS3 chamado com: ${imageUrl}`);
  });
beforeAll(async () => {
    (Hero.create as jest.Mock).mockResolvedValue({
      id: "1",
      name: "Superman",
      avatar_url: "https://heroes-lab-images.s3.us-east-2.amazonaws.com/1741025530437-Captura+de+tela+2025-03-03+141057.png",
    });
  
    await request(app).post("/api/heroes").send({
      name: "Superman",
      nickname: "O Homem de Aço",
      date_of_birth: "1938-04-18",
      universe: "DC",
      main_power: "Força",
      avatar_url: "https://heroes-lab-images.s3.us-east-2.amazonaws.com/1741025530437-Captura+de+tela+2025-03-03+141057.png",
    });
  });
  

describe("Hero Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /api/heroes - Deve listar todos os heróis", async () => {
    (Hero.findAll as jest.Mock).mockResolvedValue([{ id: "1", name: "Superman" }]);

    const response = await request(app).get("/api/heroes");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: "1", name: "Superman" }]);
  });

  test("POST /api/heroes - Deve criar um herói", async () => {
    (Hero.create as jest.Mock).mockResolvedValue({ id: "2", name: "Batman" });

    const response = await request(app).post("/api/heroes").send({
      name: "Batman",
      nickname: "Cavaleiro das Trevas",
      date_of_birth: "1970-01-01",
      universe: "DC",
      main_power: "Riqueza",
      avatar_url: "https://example.com/batman.jpg",
    });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Batman");
  });

  test("PUT /api/heroes/:id - Deve atualizar um herói", async () => {
    (Hero.findByPk as jest.Mock).mockResolvedValue({
      update: jest.fn().mockResolvedValue({ id: "1", name: "Batman Atualizado" }),
    });

    const response = await request(app).put("/api/heroes/1").send({ name: "Batman Atualizado" });

    expect(response.status).toBe(200);
  });

  test("DELETE /api/heroes/:id - Deve deletar um herói", async () => {
    (Hero.findByPk as jest.Mock).mockResolvedValue({
      destroy: jest.fn().mockResolvedValue(true),
      avatar_url: "https://example.com/batman.jpg",
    });

    const response = await request(app).delete("/api/heroes/1");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Herói deletado com sucesso!");
  });

  test("DELETE /api/heroes/:id/image - Deve remover a imagem de um herói", async () => {
    const mockHero = {
      id: "1",
      avatar_url: "https://heroes-lab-images.s3.us-east-2.amazonaws.com/1741025530437-Captura+de+tela+2025-03-03+141057.png",
      update: jest.fn().mockResolvedValue(true), 
    };
  
    (Hero.findByPk as jest.Mock).mockResolvedValue(mockHero);
  
    (HeroController.deleteImageFromS3 as jest.Mock).mockResolvedValue(undefined);
    
    const response = await request(app).delete("/api/heroes/1/image");
  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Imagem removida com sucesso!");
  
    expect(HeroController.deleteImageFromS3).toHaveBeenCalledWith(mockHero.avatar_url);
    
    expect(mockHero.update).toHaveBeenCalledWith({ avatar_url: null });
  });

  test("PATCH /api/heroes/:id/toggle-status - Deve alternar o status do herói", async () => {
    (Hero.findByPk as jest.Mock).mockResolvedValue({
      save: jest.fn().mockResolvedValue(true),
      is_active: true,
    });

    const response = await request(app).patch("/api/heroes/1/toggle-status").send({ is_active: false });

    expect(response.status).toBe(200);
    expect(response.body.hero.is_active).toBe(false);
  });
});

afterAll(async () => {
  await sequelize.close();
  server.close();
});
