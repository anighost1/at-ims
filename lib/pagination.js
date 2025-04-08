export const paginate = async (model, whereClause, page = 1, take = 10) => {
    const startIndex = (page - 1) * take;
    const count = await model.countDocuments(whereClause);
    const result = await model.find(whereClause)
        .sort({ updatedAt: -1 })
        .skip(startIndex)
        .limit(take);

    const totalPage = Math.ceil(count / take);
    const pagination = {
        currentPage: page,
        currentTake: take,
        totalPage,
        totalResult: count,
    };

    if ((page * take) < count) {
        pagination.next = { page: page + 1, take };
    }
    if (startIndex > 0) {
        pagination.prev = { page: page - 1, take };
    }

    return { result, pagination };
};
