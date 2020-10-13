module.exports ={

 isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}, 

 isLoggedInForUserjsfile(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');//redirect to starting page when logged in 
},

 notLoggedIn(req, res, next) {
    if(!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

}
