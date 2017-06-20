module.exports = function(req, res, next) {
    if (req.session.isLogged === true) {
        next();
    } else {
    	var url = '/account/login?retUrl=' + req.originalUrl;
        res.redirect(url);
    }
};