import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "../components/Modal";

describe("Componente modal", () => {
  const onClose = jest.fn();

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <Modal isOpen={false} onClose={onClose}>
        <div>Conteúdo do Modal</div>
      </Modal>
    );
    expect(container.firstChild).toBeNull();
  });

  it("Renderiza children quando onOpen é true", () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Conteúdo do Modal</div>
      </Modal>
    );
    expect(screen.getByText("Conteúdo do Modal")).toBeInTheDocument();
  });

  it("chama onclose ao clicar fora da modal", () => {
    const { container } = render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Conteúdo do Modal</div>
      </Modal>
    );
    // Clicar no overlay (a primeira div do modal)
    fireEvent.click(container.firstChild!);
    expect(onClose).toHaveBeenCalled();
  });
});
