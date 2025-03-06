import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateHero from "../pages/CreateHero";
import { Hero } from "../services/heroService";

jest.mock("../services/heroService", () => ({
    ...jest.requireActual("../services/heroService"),
    uploadHeroImage: jest.fn().mockResolvedValue("https://fakeurl.com/fake.png"),
    createHero: jest.fn().mockResolvedValue({}),
    updateHero: jest.fn().mockResolvedValue({}),
  }));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
  },
}));

describe("Componente CreateHero", () => {
  const onClose = jest.fn();
  const onSubmit = jest.fn();

  const heroData: Hero = {
    id: "1",
    name: "Batman",
    nickname: "The Dark Knight",
    date_of_birth: new Date("1970-01-01"),
    universe: "DC",
    main_power: "Wealth",
    avatar_url: "https://example.com/batman.jpg",
    is_active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("renderiza campos do form", () => {
    render(<CreateHero onClose={onClose} onSubmit={onSubmit} />);
    expect(screen.getByPlaceholderText("Digite o nome completo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite o nome de guerra")).toBeInTheDocument();
  });

  it("insere registros nos inputs do form para edição", () => {
    render(<CreateHero onClose={onClose} heroData={heroData} onSubmit={onSubmit} />);
    expect(screen.getByDisplayValue(heroData.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(heroData.nickname)).toBeInTheDocument();
  });

  it("chama onSubmit quando o form é enviado", async () => {
    render(<CreateHero onClose={onClose} onSubmit={onSubmit} />);
    
    // Preenche o campo de nome
    const nameInput = screen.getByPlaceholderText("Digite o nome completo");
    fireEvent.change(nameInput, { target: { value: "Batman" } });
    
    // Simula upload de arquivo
    const fileInput = screen.getByLabelText(/Escolher imagem/i);
    const file = new File(["(⌐□_□)"], "batman.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Aguarda que o upload seja chamado e o avatar atualizado
    await waitFor(() =>
      expect(require("../services/heroService").uploadHeroImage).toHaveBeenCalled()
    );
    
    await waitFor(() =>
      expect(screen.getByAltText("Avatar")).toHaveAttribute("src", "https://fakeurl.com/fake.png")
    );
    
    await waitFor(() =>
      expect(require("../services/heroService").createHero).not.toHaveBeenCalled() 
    );
    
    // Agora clica em Salvar
    const submitButton = screen.getByRole("button", { name: /salvar/i });
    fireEvent.click(submitButton);
    
    // Aguarda que createHero seja chamado e consequentemente onSubmit
    await waitFor(() =>
      expect(require("../services/heroService").createHero).toHaveBeenCalled()
    );
    
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });
  
  
});
