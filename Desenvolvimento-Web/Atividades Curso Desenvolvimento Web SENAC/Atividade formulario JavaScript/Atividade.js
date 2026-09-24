const formulario = document.getElementById("formulario");
const campos = ["nome", "email", "telefone", "idade", "mensagem"];

function mostrarErro(campo, mensagem) {
	const elemento = document.getElementById(campo);
	const erro = document.getElementById(`erro-${campo}`);
	elemento.classList.toggle("invalido", mensagem !== "");
	elemento.setAttribute("aria-invalid", mensagem !== "");
	erro.textContent = mensagem;
}

function validarFormulario() {
	const nome = document.getElementById("nome").value.trim();
	const email = document.getElementById("email").value.trim();
	const telefone = document.getElementById("telefone").value.trim();
	const idade = Number(document.getElementById("idade").value);
	const mensagem = document.getElementById("mensagem").value.trim();
	let formularioValido = true;

	campos.forEach((campo) => mostrarErro(campo, ""));
	if (!/^[A-Za-zÀ-ÿ ]{3,}$/.test(nome)) { mostrarErro("nome", "Digite um nome com pelo menos 3 letras."); formularioValido = false; }
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { mostrarErro("email", "Digite um e-mail válido."); formularioValido = false; }
	if (!/^\d{10,11}$/.test(telefone.replace(/\D/g, ""))) { mostrarErro("telefone", "Digite um telefone com 10 ou 11 números."); formularioValido = false; }
	if (!Number.isInteger(idade) || idade < 1 || idade > 120) { mostrarErro("idade", "Digite uma idade entre 1 e 120."); formularioValido = false; }
	if (mensagem.length < 10) { mostrarErro("mensagem", "Escreva uma mensagem com pelo menos 10 caracteres."); formularioValido = false; }
	return formularioValido;
}

formulario.addEventListener("submit", (event) => {
	event.preventDefault();
	const resultado = document.getElementById("resultado");
	if (!validarFormulario()) {
		resultado.textContent = "Revise os campos destacados.";
		resultado.style.color = "#b42318";
		return;
	}
	resultado.textContent = "Formulário enviado com sucesso!";
	resultado.style.color = "#087443";
	formulario.reset();
	campos.forEach((campo) => mostrarErro(campo, ""));
});

campos.forEach((campo) => {
	document.getElementById(campo).addEventListener("input", () => {
		mostrarErro(campo, "");
		document.getElementById("resultado").textContent = "";
	});
});
