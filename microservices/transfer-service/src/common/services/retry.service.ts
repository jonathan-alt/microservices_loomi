import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class RetryService {
  private readonly logger = new Logger(RetryService.name);

  /**
   * Executa uma função com retry exponencial
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3,
    baseDelay: number = 1000,
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(
          `Attempt ${attempt}/${maxAttempts} failed: ${error.message}`,
        );

        if (attempt === maxAttempts) {
          this.logger.error(
            `All ${maxAttempts} attempts failed. Last error: ${error.message}`,
          );
          throw lastError;
        }

        // Exponential backoff: 1s, 2s, 4s, etc.
        const delay = baseDelay * Math.pow(2, attempt - 1);
        this.logger.log(`Retrying in ${delay}ms...`);
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  /**
   * Executa uma função com retry para operações críticas
   */
  async executeCriticalOperation<T>(operation: () => Promise<T>): Promise<T> {
    return this.executeWithRetry(
      operation,
      5, // Mais tentativas para operações críticas
      2000, // Delay maior
    );
  }

  /**
   * Executa uma função com retry para operações de banco de dados
   */
  async executeDatabaseOperation<T>(operation: () => Promise<T>): Promise<T> {
    return this.executeWithRetry(operation, 3, 1000);
  }

  /**
   * Executa uma função com retry para operações de mensageria
   */
  async executeMessagingOperation<T>(operation: () => Promise<T>): Promise<T> {
    return this.executeWithRetry(operation, 3, 500);
  }

  /**
   * Verifica se um erro é retryable
   */
  isRetryableError(error: any): boolean {
    const retryableErrors = [
      "ECONNREFUSED",
      "ECONNRESET",
      "ETIMEDOUT",
      "ENOTFOUND",
      "ECONNRESET",
      "EPIPE",
      "ENOBUFS",
      "ENETUNREACH",
    ];

    return retryableErrors.some(
      (retryableError) =>
        error.message?.includes(retryableError) ||
        error.code === retryableError,
    );
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
