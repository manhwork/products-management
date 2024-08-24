module.exports = (req) => {
    const objectSearch = {
        keyword:""
    }

    if (req.query.keyword) {
        objectSearch.keyword = req.query.keyword;
        const regex = new RegExp(objectSearch.keyword, "gi");
        objectSearch.regex = regex;
    }

    return objectSearch;
}