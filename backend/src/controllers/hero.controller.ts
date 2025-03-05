import { Request, Response, NextFunction } from "express";
import Hero from "../models/hero.model";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

// Configuração do S3Client
const s3 = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// Função para deletar imagem do S3
export const deleteImageFromS3 = async (imageUrl: string) => {
  if (!imageUrl) return;
  const bucketName = process.env.AWS_BUCKET_NAME!;
  const key = imageUrl.split("/").pop(); 

  console.log(`Tentando deletar imagem: ${imageUrl} (key: ${key})`); 

  if (!key) {
    console.error("Erro ao deletar imagem: Nome do arquivo não encontrado.");
    return;
  }

  try {
    await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
    console.log(`Imagem deletada do S3: ${key}`);
  } catch (error) {
    console.error("Erro ao deletar imagem do S3:", error);
  }
};


// Listar heróis
export const getHeroes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const heroes = await Hero.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json(heroes);
  } catch (error) {
    next(error);
  }
};

// Criar herói
export const createHero = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const heroData = req.body;
    
    if (Array.isArray(heroData)) {
      const createdHeroes = [];
      
      for (const hero of heroData) {
        const { name, nickname, date_of_birth, universe, main_power, avatar_url } = hero;
        
        if (!name || !nickname || !date_of_birth || !universe || !main_power || !avatar_url) {
          res.status(400).json({ message: "Todos os campos são obrigatórios!" });
          return;
        }
        
        const newHero = await Hero.create({ 
          name, 
          nickname, 
          date_of_birth, 
          universe, 
          main_power,
          avatar_url 
        });
        
        createdHeroes.push(newHero);
      }
      
      res.status(201).json(createdHeroes);
    } else {
      const { name, nickname, date_of_birth, universe, main_power, avatar_url } = heroData;
      
      if (!name || !nickname || !date_of_birth || !universe || !main_power || !avatar_url) {
        res.status(400).json({ message: "Todos os campos são obrigatórios!" });
        return;
      }
      
      const heroAvatarUrl = avatar_url || (req.file ? (req.file as any).location : null);
      
      if (!heroAvatarUrl) {
        res.status(400).json({ message: "Avatar URL é obrigatório!" });
        return;
      }
      
      const newHero = await Hero.create({ 
        name, 
        nickname, 
        date_of_birth, 
        universe, 
        main_power, 
        avatar_url: heroAvatarUrl 
      });
      
      res.status(201).json(newHero);
    }
  } catch (error) {
    next(error);
  }
};

// Atualizar herói (com atualização de imagem)
export const updateHero = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const hero = await Hero.findByPk(id);
    if (!hero) {
      res.status(404).json({ message: "Herói não encontrado!" });
      return;
    }

    // Verifica se há nova imagem e deleta a antiga
    if (req.file) {
      if (hero.avatar_url) await deleteImageFromS3(hero.avatar_url);
      hero.avatar_url = (req.file as any).location;
    }

    await hero.update(req.body);
    res.status(200).json(hero);
  } catch (error) {
    next(error);
  }
};

// Remover imagem de um herói
// export const deleteHeroImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const hero = await Hero.findByPk(id);
//     if (!hero || !hero.avatar_url) {
//       res.status(404).json({ message: "Imagem não encontrada!" });
//       return;
//     }

//     await deleteImageFromS3(hero.avatar_url);
//     await hero.update({ avatar_url: null });

//     res.status(200).json({ message: "Imagem removida com sucesso!" });
//   } catch (error) {
//     next(error);
//   }
// };

export const deleteHeroImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const hero = await Hero.findByPk(id);
    
    if (!hero || !hero.avatar_url) {
      console.error("Imagem não encontrada!");
      res.status(404).json({ message: "Imagem não encontrada!" });
      return;
    }
    
    await deleteImageFromS3(hero.avatar_url);
    await hero.update({ avatar_url: null });
    
    console.log("Imagem deletada com sucesso!");
    
    res.status(200).json({ message: "Imagem removida com sucesso!" });
  } catch (error) {
    next(error);
  }
};


// Excluir herói (deletando a imagem antes)
export const deleteHero = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const hero = await Hero.findByPk(id);
    if (!hero) {
      res.status(404).json({ message: "Herói não encontrado!" });
      return;
    }

    // Deleta a imagem do S3 antes de excluir o herói
    if (hero.avatar_url) await deleteImageFromS3(hero.avatar_url);

    await hero.destroy();
    res.status(200).json({ message: "Herói deletado com sucesso!" });
  } catch (error) {
    next(error);
  }
};

// Alternar status ativo/inativo do herói
export const toggleHeroStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    console.log(`Recebido ID: ${id} - Novo Status: ${is_active}`);

    if (typeof is_active !== "boolean") {
      res.status(400).json({ message: "O campo is_active precisa ser um booleano!" });
      return;
    }

    const hero = await Hero.findByPk(id);
    if (!hero) {
      res.status(404).json({ message: "Herói não encontrado!" });
      return;
    }

    hero.is_active = is_active;
    await hero.save();

    console.log(`Status atualizado: ${hero.is_active}`);
    res.status(200).json({ message: "Status atualizado com sucesso!", hero });
  } catch (error) {
    console.error("Erro ao atualizar status do herói:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }

};
