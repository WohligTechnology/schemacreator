global["GoogleKey"] = "AIzaSyDMgwXi6D38isibUfShc9C2mJyaHZZ2LpE";
global["GoogleclientId"] = "478825088445-ee1tkbkgksaju6pkf28sogde7cqpcj5a.apps.googleusercontent.com";
global["GoogleclientSecret"] = "cmpATvuIX8guVD4ZjZ0XivLi";

passport.use(new GoogleStrategy({
    clientId: GoogleclientId,
    clientSecret: GoogleclientSecret,
    callbackURL: global["env"].realHost + "/api/user/loginGoogle",
    accessType: "offline"
},
function (accessToken, refreshToken, profile, cb) {
    profile.googleAccessToken = accessToken;
    profile.googleRefreshToken = refreshToken;
    return cb(profile);
}
));