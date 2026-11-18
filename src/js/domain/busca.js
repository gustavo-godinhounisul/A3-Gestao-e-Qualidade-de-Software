export function filtrarAlunos(lista, termo) {
  if (!termo || termo.trim() === '') {
    return lista;
  }

  // Normaliza o termo: minúsculas, sem acentos e sem pontuação (útil para o CPF)
  const termoLimpo = termo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
  
  const termoNumeros = termo.replace(/\D/g, ''); // Remove tudo que não é número

  return lista.filter(aluno => {
    const nomeLimpo = aluno.nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    
    const cpfLimpo = aluno.cpf.replace(/\D/g, '');

    const bateComNome = nomeLimpo.includes(termoLimpo);
    const bateComCpf = termoNumeros !== '' && cpfLimpo.includes(termoNumeros);

    return bateComNome || bateComCpf;
  });
}