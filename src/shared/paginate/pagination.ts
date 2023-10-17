import { PaginationResultInterface } from './pagination.results.interface';

export class Pagination<PaginationEntity> {
  public results: PaginationEntity[];
  public page_total: number;
  public total: number;

  constructor(paginationResults: PaginationResultInterface<PaginationEntity>) {
    const { results, total, limit } = paginationResults;
    this.results = results;
    this.page_total =
      total % limit === 0 ? total / limit : Math.floor(total / limit) + 1;
    this.total = paginationResults.total;
  }
}
