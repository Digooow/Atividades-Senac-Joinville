document.addEventListener("DOMContentLoaded", () => {
    const model = new EnderecoModel();
    const view = new EnderecoView();
    globalThis.enderecoController = new EnderecoController(model, view);
});
