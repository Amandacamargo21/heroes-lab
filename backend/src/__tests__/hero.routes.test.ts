import request from "supertest";
import {app, server } from "./../server";
import Hero from "./../models/hero.model";
import sequelize from "../config/database";

jest.mock("./../models/hero.model");

describe("Hero Routes", () => {
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
  });

  afterAll(async () => {
    await sequelize.close(); // Fecha o banco
    server.close(); // Fecha o servidor
  });