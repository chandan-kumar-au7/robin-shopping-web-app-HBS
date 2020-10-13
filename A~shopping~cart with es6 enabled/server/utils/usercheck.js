export function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
export function isLoggedInForUserjsfile(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/'); //redirect to starting page when logged in 
}
export function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
