export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface PaginationInput {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export function parsePagination(input?: PaginationInput | null): PaginationParams {
  const page = Math.max(1, input?.page ?? 1);
  const limit = Math.min(Math.max(1, input?.limit ?? 20), 100);
  const offset = (page - 1) * limit;

  return { limit, offset };
}

export function buildPaginationMeta<T>(
  data: T[],
  total: number,
  params: PaginationParams,
): PaginatedResult<T> {
  const page = Math.floor(params.offset / params.limit) + 1;

  return {
    data,
    meta: {
      total,
      page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit),
      hasNextPage: params.offset + params.limit < total,
      hasPreviousPage: page > 1,
    },
  };
}
