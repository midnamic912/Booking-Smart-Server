function errorHandler(err, req, res, next){
    res.status(500).send("Internal Error.")
}

module.exports = errorHandler;