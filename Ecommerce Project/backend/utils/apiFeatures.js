class ApiFeatures {
    constructor(query , queryStr){
        this.query = query;
        this.queryStr = queryStr;

    }
    

    search() {
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options: "i",
            }
        }:{}

        

        this.query = this.query.find({...keyword})

        // console.log("in the keyword" ,this.query._conditions);
        return this;
    }

    filter() {
        const queryCopy = {...this.queryStr}
        console.log('query copy',queryCopy);
        const removeFields = ['keyword', 'page', 'limit'];

        removeFields.forEach(key => delete queryCopy[key]);

        //Filter for price and rating
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key=> `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));

        // console.log("in the category" ,this.query._conditions);

        //Filter for price and rating

        return this;
    }

    pagination (resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;

    }

}

module.exports = ApiFeatures;