module.exports = (req, res, next) => {
    if(!req.session.isSuperuser){
        return res.redirect('/');
    }
    next();
}