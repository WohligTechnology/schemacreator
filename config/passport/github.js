// global["GoogleKey"] = "AIzaSyDMgwXi6D38isibUfShc9C2mJyaHZZ2LpE";
global["GoogleclientId"] = "35849b411badb9aa7d3a";
global["GoogleclientSecret"] = "01afc928ef293f931155eaca0a5d52ce3ca6d5fd";

passport.use(new GitHubStrategy({
    clientID: GoogleclientId,
    clientSecret: GoogleclientSecret,
    scope:"repo",
    callbackURL: global["env"].realHost + "/api/user/loginGithub?scope=user%20repo",
    accessType: "offline",
    
    },
    function (accessToken, refreshToken, profile,cb) {
        console.log(profile)
        profile.googleAccessToken = accessToken;
        profile.googleRefreshToken = refreshToken;
        return cb(profile);
    }
));