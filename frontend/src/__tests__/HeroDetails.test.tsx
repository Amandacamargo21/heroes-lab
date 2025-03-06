import { render, screen, fireEvent } from "@testing-library/react";
import HeroDetails from "../components/HeroDetails";
import { Hero } from "../services/heroService";

const mockHero: Hero = {
  id: "1",
  name: "Batman",
  nickname: "The Dark Knight",
  date_of_birth: new Date("1970-01-01"),
  universe: "DC",
  main_power: "Wealth",
  avatar_url: "https://example.com/batman.jpg",
  is_active: true,
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-02"),
};

describe("Componente HeroDetails", () => {
  it("renders hero details correctly", () => {
    const onClose = jest.fn();
    render(<HeroDetails hero={mockHero} onClose={onClose} />);
    
    // Busca o heading que contém o nome "Batman"
    expect(screen.getByRole("heading", { name: /Batman/i })).toBeInTheDocument();
    expect(screen.getByText("DC")).toBeInTheDocument();
  });

  it("Chama onClose quando o botão de fechar é clicado", () => {
    const onClose = jest.fn();
    render(<HeroDetails hero={mockHero} onClose={onClose} />);
    const closeButton = screen.getByText("Fechar");
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});
