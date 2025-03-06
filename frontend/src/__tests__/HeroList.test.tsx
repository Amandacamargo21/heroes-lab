import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HeroList from "../pages/HeroList";
import { useHeroes } from "../hooks/useHeroes";

// Mock do hook useHeroes para controlar os dados
jest.mock("../hooks/useHeroes");

const mockHeroes = [
  {
    id: "1",
    name: "Batman",
    nickname: "The Dark Knight",
    date_of_birth: new Date("1970-01-01"),
    universe: "DC",
    main_power: "Wealth",
    avatar_url: "https://example.com/batman.jpg",
    is_active: true,
  },
  {
    id: "2",
    name: "Superman",
    nickname: "Man of Steel",
    date_of_birth: new Date("1938-04-18"),
    universe: "DC",
    main_power: "Super strength",
    avatar_url: "https://example.com/superman.jpg",
    is_active: true,
  },
];

describe("HeroList Page", () => {
  beforeEach(() => {
    (useHeroes as jest.Mock).mockReturnValue({
      heroes: mockHeroes,
      loading: { toggle: "" },
      toggleStatus: jest.fn(),
      fetchHeroes: jest.fn(),
    });
  });

  it("renders a list of hero cards", () => {
    render(<HeroList />);
    expect(screen.getByText("Heróis")).toBeInTheDocument();
    // Verifica se os heróis aparecem
    expect(screen.getByText("The Dark Knight")).toBeInTheDocument();
    expect(screen.getByText("Man of Steel")).toBeInTheDocument();
  });

  it("filters heroes based on search input", async () => {
    render(<HeroList />);
    const searchInput = screen.getByPlaceholderText("Digite o nome do herói");
    fireEvent.change(searchInput, { target: { value: "Batman" } });
    await waitFor(() => {
      expect(screen.getByText("The Dark Knight")).toBeInTheDocument();
      expect(screen.queryByText("Man of Steel")).toBeNull();
    });
  });
});
