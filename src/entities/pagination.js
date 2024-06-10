class Pagination {
    static SetLimit(bit){
        switch(bit){
            case 1:
                return 100;
            break;
            case 0:
                return 20;
            break;
        }
    }

    static BuildPagination(collection, limit, offset, url, total){
        return {
            collection: collection,
            pagination: {
                limit: limit, 
                offset: offset,
                nextPage: (parseInt(offset) + 1)*limit < total ? 
                    (!url.includes("offset") ? 
                        (url.includes("limit") ? url.concat("&offset=" + (offset+1)) : url.concat("?offset=" + (offset+1)))
                            : `${process.env.BASE_URL}${url.replace(/(offset=)\d+/, 'offset=' + (parseInt(offset) + 1))}`)
                    :null,
                total: total
            }


            //offset+1*limit menor / menor o igual al total?
        };
        
    }

    static VerifyTotal(limit, offset, total){
        return (parseInt(offset) + 1)*limit < total;
    }

    
}

export default Pagination