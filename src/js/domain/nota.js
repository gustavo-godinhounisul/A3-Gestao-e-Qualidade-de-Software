export function validarNota(nota) {
  return typeof nota === "number" && nota >= 0 && nota <= 10;
}
