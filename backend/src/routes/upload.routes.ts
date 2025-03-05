import { Router, Request, Response } from "express";
import { upload } from "../services/s3Service"; 

const router = Router();

router.post("/upload", upload.single("file"), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Nenhum arquivo enviado." });
      return;
    }

    res.status(201).json({
      message: "Upload bem-sucedido!",
      fileUrl: (req.file as Express.MulterS3.File).location, 
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer upload", error });
  }
});

export default router;
