export function validarNome(nome) {
  if (typeof nome !== "string") return false;
  const tamanho = nome.trim().length;
  return tamanho >= 3 && tamanho <= 100;
}