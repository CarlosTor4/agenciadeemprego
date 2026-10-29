// Formatting helpers for CPF, CNPJ, Telefone and Moeda BRL

/**
 * Formata CNPJ: 00.000.000/0001-00
 */
export const formatCnpj = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  if (!digits) return '';
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};

/**
 * Formata CPF: 000.000.000-00
 */
export const formatCpf = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
};

/**
 * Formata dinamicamente CPF ou CNPJ conforme digitação do usuário:
 * Até 11 dígitos: 000.000.000-00 (CPF)
 * De 12 a 14 dígitos: 00.000.000/0001-00 (CNPJ)
 * Se contiver letras (ex: e-mail), não aplica máscara de dígitos.
 */
export const formatCpfCnpj = (value: string): string => {
  if (/[a-zA-Z@]/.test(value)) {
    return value;
  }

  const digits = value.replace(/\D/g, '').slice(0, 14);
  if (!digits) return '';

  if (digits.length <= 11) {
    return digits
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2');
  } else {
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
};

/**
 * Formata Telefone ou WhatsApp brasileiro: (00) 00000-0000 ou (00) 0000-0000
 */
export const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
};

/**
 * Formata Moeda brasileira Real (R$): R$ 1.500,00
 */
export const formatCurrencyBRL = (value: string): string => {
  const cleanDigits = value.replace(/\D/g, '');
  if (!cleanDigits) return '';
  const numValue = parseInt(cleanDigits, 10) / 100;
  return numValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
