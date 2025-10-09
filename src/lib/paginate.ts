interface PaginateOptions<
  TDelegate extends { findMany: (args?: any) => any; count: (args?: any) => any },
  TFindManyArgs extends Parameters<TDelegate["findMany"]>[0] = Parameters<TDelegate["findMany"]>[0]
> {
  model: TDelegate;
  args?: TFindManyArgs; // semua Prisma args (where, include, orderBy, dll)
  page?: number;
  perPage?: number;
}

export async function paginate<
  TDelegate extends { findMany: (args?: any) => any; count: (args?: any) => any },
  TFindManyArgs extends Parameters<TDelegate["findMany"]>[0] = Parameters<TDelegate["findMany"]>[0],
  TResult = Awaited<ReturnType<TDelegate["findMany"]>>
>({
  model,
  args,
  page = 1,
  perPage = 10,
}: PaginateOptions<TDelegate, TFindManyArgs>) {
  const skip = (page - 1) * perPage;

  const [data, total] = await Promise.all([
    model.findMany({
      ...args,
      skip,
      take: perPage,
    } as TFindManyArgs),
    model.count({ where: args?.where } as any),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return {
    data: data as TResult,
    pagination: {
      total,
      totalPages,
      currentPage: page,
      perPage,
    },
  };
}
