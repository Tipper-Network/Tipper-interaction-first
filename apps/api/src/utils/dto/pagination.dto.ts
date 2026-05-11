import { Type } from 'class-transformer';
import { IsPositive, Max } from 'class-validator';

export class PaginationDto {
  @Type(() => Number)
  @IsPositive()
  page: number = 1;

  @Type(() => Number)
  @IsPositive()
  @Max(50)
  limit: number = 10;

  /**
   * Number of records to skip, derived from `page` and `limit`.
   *
   * @example
   * - page=1, limit=10 => skip=0
   * - page=2, limit=10 => skip=10
   */
  get skip(): number {
    return (this.page - 1) * this.limit;
  }

  /**
   * Number of records to take, derived from `limit`.
   */
  get take(): number {
    return this.limit;
  }
}
