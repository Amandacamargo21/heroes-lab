import request from "supertest";
import { app } from "../server";

describe("App Server", () => {
  test("GET /api/heroes - Deve retornar status 200", async () => {
    const response = await request(app).get("/api/heroes");
    expect(response.status).toBe(200);
  });
});
