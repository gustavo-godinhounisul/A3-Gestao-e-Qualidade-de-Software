export function normalizarCpf(texto) {
  if (typeof texto !== "string") {
    return "";
  }

  return texto.replace(/\D/g, "");
}

export function validarCpf(texto) {
  const digitos = normalizarCpf(texto);

  if (digitos.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(digitos)) {
    return false;
  }

  let soma = 0;
  for (let i = 0; i < 9; i += 1) {
    soma += Number(digitos[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10) {
    resto = 0;
  }
  if (resto !== Number(digitos[9])) {
    return false;
  }

  soma = 0;
  for (let i = 0; i < 10; i += 1) {
    soma += Number(digitos[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10) {
    resto = 0;
  }
  if (resto !== Number(digitos[10])) {
    return false;
  }

  return true;
}