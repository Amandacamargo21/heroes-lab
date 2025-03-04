import { Router } from "express";
import { getHeroes, createHero, updateHero, deleteHero, activateHero } from "../controllers/hero.controller";

const router = Router();

router.get("/heroes", getHeroes);
router.post("/heroes", createHero);
router.put("/heroes/:id", updateHero);
router.delete("/heroes/:id", deleteHero);
router.patch("/heroes/:id", activateHero);

export default router;
