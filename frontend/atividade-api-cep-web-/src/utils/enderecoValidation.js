const camposEndereco = [
    "cep",
    "logradouro",
    "numero",
    "bairro",
    "cidade",
    "estado"
];

export const unidadesFederativas = new Set([
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
    "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
    "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
]);

export function validarEndereco(dados) {
    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
        return "Os dados do endereço devem ser enviados em formato de objeto.";
    }

    for (const campo of camposEndereco) {
        if (typeof dados[campo] !== "string") {
            return `O campo ${campo} deve ser um texto.`;
        }
    }

    const cep = dados.cep.replace(/\D/g, "");
    if (cep.length !== 8) {
        return "Digite um CEP válido com 8 dígitos.";
    }

    const camposObrigatorios = ["logradouro", "numero", "bairro", "cidade", "estado"];
    const campoVazio = camposObrigatorios.find((campo) => !dados[campo].trim());
    if (campoVazio) {
        return `O campo ${campoVazio} é obrigatório.`;
    }

    if (!unidadesFederativas.has(dados.estado.trim().toUpperCase())) {
        return "Informe uma sigla de estado válida.";
    }

    return null;
}

export function normalizarEndereco(dados) {
    return {
        cep: dados.cep.trim(),
        logradouro: dados.logradouro.trim(),
        numero: dados.numero.trim(),
        bairro: dados.bairro.trim(),
        cidade: dados.cidade.trim(),
        estado: dados.estado.trim().toUpperCase()
    };
}
