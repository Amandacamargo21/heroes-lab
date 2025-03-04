import express from "express";
import cors from "cors";
import heroRoutes from "./routes/hero.routes";
import uploadRoutes from "./routes/upload.routes"; 

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api", heroRoutes);
app.use("/api", uploadRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
