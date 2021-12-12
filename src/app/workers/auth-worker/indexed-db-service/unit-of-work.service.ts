import { TokenRepositoryService } from "./data-bases/token/token-repository.service";

/** Сервис работы с данными estimate-office  */
export class UnitOfWork {
  private pTokenRepositry: TokenRepositoryService;

  constructor() {
    // Инициализация сервисов БД
    this.pTokenRepositry = new TokenRepositoryService();
  }

  /** Получение репозитория токенов */
  get tokenRepository(): TokenRepositoryService {
    return this.pTokenRepositry;
  }
}
