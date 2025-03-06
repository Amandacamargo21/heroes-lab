import { render, fireEvent, screen, waitFor, act } from "@testing-library/react";
import HeroCard from "../components/HeroCard";
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

describe("Componente HeroCard ", () => {
  const onClick = jest.fn();
  const onEdit = jest.fn();
  const onDelete = jest.fn();
  const onSliderToggle = jest.fn();
  const onMenuToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza informação do heroi corretamente", () => {
    render(
      <HeroCard
        key="1"
        hero={mockHero}
        onClick={onClick}
        onEdit={onEdit}
        onDelete={onDelete}
        onSliderToggle={onSliderToggle}
        onMenuToggle={onMenuToggle}
        menuOpen={false}
        loadingToggle={""}
        loadingActivate={false}
      />
    );
    expect(screen.getByText(mockHero.nickname)).toBeInTheDocument();
    const avatar = screen.getByAltText(mockHero.name);
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", mockHero.avatar_url);
  });

  it("chama onEdit quando o botão de edição é clicado", () => {
    render(
      <HeroCard
        key="1"
        hero={mockHero}
        onClick={onClick}
        onEdit={onEdit}
        onDelete={onDelete}
        onSliderToggle={onSliderToggle}
        onMenuToggle={onMenuToggle}
        menuOpen={false}
        loadingToggle={""}
        loadingActivate={false}
      />
    );
    // Abre o menu clicando no botão "Abrir menu"
    const menuButton = screen.getByTitle("Abrir menu");
    fireEvent.click(menuButton);
    const editButton = screen.getByTitle("Editar Herói");
    fireEvent.click(editButton);
    expect(onEdit).toHaveBeenCalledWith(mockHero.id);
  });

  it("chama onDelete quando o botão de exclusão é clicado", () => {
    render(
      <HeroCard
        key="1"
        hero={mockHero}
        onClick={onClick}
        onEdit={onEdit}
        onDelete={onDelete}
        onSliderToggle={onSliderToggle}
        onMenuToggle={onMenuToggle}
        menuOpen={false}
        loadingToggle={""}
        loadingActivate={false}
      />
    );
    // Abre o menu para que o botão de excluir apareça
    const menuButton = screen.getByTitle("Abrir menu");
    fireEvent.click(menuButton);
    const deleteButton = screen.getByTitle("Excluir Herói");
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith(mockHero.id);
  });

  it("chama onSlider toggle e fecha o menu depois de 1 segundo", async () => {
    jest.useFakeTimers();
    render(
      <HeroCard
        key="1"
        hero={mockHero}
        onClick={onClick}
        onEdit={onEdit}
        onDelete={onDelete}
        onSliderToggle={onSliderToggle}
        onMenuToggle={onMenuToggle}
        menuOpen={false}
        loadingToggle={""}
        loadingActivate={false}
      />
    );
    // Abre o menu
    const menuButton = screen.getByTitle("Abrir menu");
    fireEvent.click(menuButton);
    // Busca o checkbox que dispara onSliderToggle
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(onSliderToggle).toHaveBeenCalledWith(mockHero);
    // Avança o timer para fechar o menu (1 segundo), envolvido em act
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    await waitFor(() => {
      expect(screen.queryByTitle("Editar Herói")).not.toBeInTheDocument();
    });
    jest.useRealTimers();
  });
});
