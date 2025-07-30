// Configurações globais para testes e2e
import { config } from "dotenv";

// Carrega variáveis de ambiente para testes
config({ path: ".env.test" });

// Configurações globais do Jest
beforeAll(() => {
  // Setup global antes de todos os testes
  console.log("🚀 Iniciando testes e2e...");
});

afterAll(() => {
  // Cleanup global após todos os testes
  console.log("✅ Testes e2e finalizados");
});

// Configurações de timeout para testes
jest.setTimeout(30000);

// Configurações de console para reduzir ruído nos testes
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeEach(() => {
  // Suprime logs durante os testes para reduzir ruído
  console.log = jest.fn();
  console.error = jest.fn();
});

afterEach(() => {
  // Restaura console após cada teste
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});
