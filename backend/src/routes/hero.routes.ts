import { Router } from "express";
import { getHeroes, createHero, updateHero, deleteHero, deleteHeroImage, toggleHeroStatus } from "../controllers/hero.controller";

const router = Router();

router.get("/heroes", getHeroes);
router.post("/heroes", createHero);
router.put("/heroes/:id", updateHero);
router.delete("/heroes/:id", deleteHero);
router.patch("/heroes/:id/toggle-status", toggleHeroStatus);
router.delete("/heroes/:id/image", deleteHeroImage);  

export default router;
