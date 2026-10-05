document.addEventListener("DOMContentLoaded", () => {
    const model = new EnderecoModel();
    const view = new EnderecoView();
    const controller = new EnderecoController(model, view);

    window.buscarCep = () => controller.buscarCep();
});
