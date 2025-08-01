declare module 'cpf-cnpj-validator' {
  export const cpf: {
    isValid(cpf: string): boolean;
    format(cpf: string): string;
    generate(): string;
  };
} 