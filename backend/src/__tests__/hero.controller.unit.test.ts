import { Request, Response, NextFunction } from "express";
import { 
  getHeroes, 
  createHero, 
  updateHero, 
  deleteHeroImage, 
  deleteHero, 
  toggleHeroStatus,
  deleteImageFromS3
} from "../controllers/hero.controller";
import Hero from "../models/hero.model";
import sequelize from "../config/database";
import { server } from "../server";

// Mock do modelo
jest.mock("../models/hero.model");

// Para evitar erros com "arguments", usamos rest parameters
import * as HeroController from "../controllers/hero.controller";
jest.spyOn(HeroController, "deleteImageFromS3").mockImplementation(async (...args: any[]) => {
  console.log(`🛠️ Mock deleteImageFromS3 chamado com: ${args[0]}`);
});

describe("Hero Controller Unit Tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  // Teste para getHeroes
  describe("getHeroes", () => {
    it("Deve retornar os heróis com status 200", async () => {
      (Hero.findAll as jest.Mock).mockResolvedValue([{ id: "1", name: "Superman" }]);
      await getHeroes(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: "1", name: "Superman" }]);
    });

    it("Deve chamar next com erro se findAll falhar", async () => {
      const error = new Error("DB Error");
      (Hero.findAll as jest.Mock).mockRejectedValue(error);
      await getHeroes(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // Teste para createHero
  describe("createHero", () => {
    it("Deve criar um herói e retornar status 201", async () => {
      req.body = {
        name: "Batman",
        nickname: "Cavaleiro das Trevas",
        date_of_birth: "1970-01-01",
        universe: "DC",
        main_power: "Riqueza",
        avatar_url: "https://example.com/batman.jpg",
      };
      (Hero.create as jest.Mock).mockResolvedValue(req.body);
      await createHero(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it("Deve retornar 400 se os campos obrigatórios não forem informados", async () => {
      req.body = { name: "Batman" };
      await createHero(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Todos os campos são obrigatórios!" });
    });
  });

  // Teste para updateHero
  describe("updateHero", () => {
    it("Deve atualizar um herói e retornar status 200", async () => {
      req.params = { id: "1" };
      req.body = { name: "Batman Atualizado" };

      // Função update que muta o objeto; anotamos explicitamente o tipo de "this"
      const heroMock = {
        id: "1",
        name: "Batman",
        update: jest.fn().mockImplementation(function (this: any, data: any) {
          Object.assign(this, data);
          return Promise.resolve(this);
        }),
      };

      (Hero.findByPk as jest.Mock).mockResolvedValue(heroMock);
      await updateHero(req as Request, res as Response, next);
      expect(Hero.findByPk).toHaveBeenCalledWith("1");
      expect(heroMock.name).toBe("Batman Atualizado");
      expect(heroMock.update).toHaveBeenCalledWith({ name: "Batman Atualizado" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(heroMock);
    });

    it("Deve retornar 404 se o herói não for encontrado", async () => {
      req.params = { id: "1" };
      (Hero.findByPk as jest.Mock).mockResolvedValue(null);
      await updateHero(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Herói não encontrado!" });
    });
  });

  // Teste para deleteHeroImage
  describe("deleteHeroImage", () => {
    it("Deve remover a imagem do herói e retornar status 200", async () => {
      req.params = { id: "1" };
      const mockHero = {
        id: "1",
        avatar_url: "https://example.com/image.jpg",
        update: jest.fn().mockResolvedValue(true),
      };

      (Hero.findByPk as jest.Mock).mockResolvedValue(mockHero);
      await deleteHeroImage(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Imagem removida com sucesso!" });
      expect(HeroController.deleteImageFromS3).toHaveBeenCalledWith(mockHero.avatar_url);
      expect(mockHero.update).toHaveBeenCalledWith({ avatar_url: null });
    });

    it("Deve retornar 404 se o herói ou avatar não existir", async () => {
      req.params = { id: "1" };
      (Hero.findByPk as jest.Mock).mockResolvedValue(null);
      await deleteHeroImage(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Imagem não encontrada!" });
    });
  });

  // Teste para deleteHero
  describe("deleteHero", () => {
    it("Deve excluir o herói e retornar status 200", async () => {
      req.params = { id: "1" };
      const heroMock = {
        id: "1",
        avatar_url: "https://example.com/image.jpg",
        destroy: jest.fn().mockResolvedValue(true),
      };
      (Hero.findByPk as jest.Mock).mockResolvedValue(heroMock);
      await deleteHero(req as Request, res as Response, next);
      expect(Hero.findByPk).toHaveBeenCalledWith("1");
      expect(heroMock.destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Herói deletado com sucesso!" });
    });

    it("Deve retornar 404 se o herói não for encontrado", async () => {
      req.params = { id: "1" };
      (Hero.findByPk as jest.Mock).mockResolvedValue(null);
      await deleteHero(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Herói não encontrado!" });
    });
  });

  // Teste para toggleHeroStatus
  describe("toggleHeroStatus", () => {
    it("Deve alternar o status do herói e retornar status 200", async () => {
      req.params = { id: "1" };
      req.body = { is_active: false };
      const heroMock = {
        id: "1",
        is_active: true,
        save: jest.fn().mockResolvedValue(true),
      };
      (Hero.findByPk as jest.Mock).mockResolvedValue(heroMock);
      await toggleHeroStatus(req as Request, res as Response, next);
      expect(Hero.findByPk).toHaveBeenCalledWith("1");
      expect(heroMock.is_active).toBe(false);
      expect(heroMock.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Status atualizado com sucesso!", hero: heroMock });
    });

    it("Deve retornar 400 se is_active não for boolean", async () => {
      req.params = { id: "1" };
      req.body = { is_active: "false" };
      await toggleHeroStatus(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "O campo is_active precisa ser um booleano!" });
    });
  });
});

afterAll(async () => {
  await sequelize.close();
  server.close();
});
