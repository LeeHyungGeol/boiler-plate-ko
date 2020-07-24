const { User } = require('../models/User');

let auth = (req, res, next) => {

    //인증 처리를 하는 곳

    //클라이언트 Cookie에서 Token을 가져온다. //cookie-parser이용
    let token = req.cookies.x_auth;

    //Token을 복호화한 후 User를 찾는다.
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json( { isAuth: false, error: true } )
        req.token = token;
        req.user = user;
        next();
    })

    //User가 있으면 인증 OK

    //User가 없으면 인증 NO

}


module.exports = { auth };