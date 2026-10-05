document.addEventListener("DOMContentLoaded", () => {
    const model = new EnderecoModel();
    const view = new EnderecoView();
    new EnderecoController(model, view);
});
