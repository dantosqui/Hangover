export class Pagination {
    static BuildPagination(collection, limit, offset, url, total){
        return {
            collection: collection,
            pagination: {
                limit: limit, 
                offset: offset,
                nextPage: (offset+1)*limit < total ? (!url.includes("offset") ? (url.includes("limit") ? url.concat("&offset=" + (offset+1)) : url.concat("offset=" + (offset+1))): `${process.env.BASE_URL}${url.replace(/(offset=)\d+/, 'offset=' + (parseInt(offset) + 1))}`):null,
                total: total
            }

            //offset+1*limit menor / menor o igual al total?
        };
        
    }

    static ParseLimit(limit) {
        return !isNaN(limit) && limit > 0 ? limit : 10;
    }

    static ParseOffset(offset) {
        return !isNaN(offset) ? offset : 0;
    }

    
}