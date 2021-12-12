import { CommonTokenRepository } from "../../../../shared/indexed-db-shared/database/common-repositories";
import { Token, TokenType } from "../../../../../app/sharedAll/base-connection-to-workers-module/models/token.model";

/** Сервис предоставляющий доступ к базе Auth */
export class TokenRepositoryService extends CommonTokenRepository {
  /** Чтение токена из базы */
  getToken(tokenType: TokenType): Promise<Token | undefined> {
    return this.tokenTable.get(tokenType);
  }

  /** Запись токена в базу */
  setToken(token: Token) {
    return this.database.transaction("rw", this.tokenTable, async () => {
      return this.tokenTable.put(token);
    });
  }

  /** Очистка базы токенов */
  clearTokens() {
    return this.database.transaction("rw", this.tokenTable, async () => {
      return this.tokenTable.clear();
    });
  }
}
