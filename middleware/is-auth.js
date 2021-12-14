/**
 * Middleware to check the authorization
 * to put before all the request that need authorization
 */
 module.exports = (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.redirect('/login');
    }
    next();
}