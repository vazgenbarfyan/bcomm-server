module.exports = function(app, passport){

    app.post('/login', passport.authenticate('local-login'));

    app.post('/signup', passport.authenticate('local-signup'));

    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

    app.get('/auth/google/callback',
        passport.authenticate('google'));

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    })
};