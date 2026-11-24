import { validarNota } from "./nota.js";

const MEDIA_MINIMA = 7;

export function calcularSituacao(media) {
  if (!validarNota(media)) {
    throw new RangeError("A média deve ser um número entre 0 e 10.");
  }
  return media >= MEDIA_MINIMA ? "aprovado" : "reprovado";
}