const express = require('express')
const app = express()
const port = 5000
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const config = require('./config/key');

const {User} = require("./models/User"); //User Model을 가져오는 것

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURL, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))


app.post('/register', (req, res) => {
    //회원가입에 필요한 정보들을 Client에서 가져오면
    //그것들을 DB에 넣어준다

    const user = new User(req.body) //User Model 가져온 것 instance 생성

    user.save((err, doc) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    }) //mongoDB의 save

})//register Route //회원가입을 위한 route


app.post('/login', (req, res) => {

    //요청된 이메일을 DB에서 있는지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({ loginSuccess: false, msg: "제공된 이메일에 해당하는 유저가 없습니다." })
        }

        //요청된 이메일이 DB에 있다면 
        //비밀번호가 맞는 비밀번호인지 확인한다.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

            //비밀번호까지 맞다면 Token을 생성한다.
            user.generateToken((err, user) => {
                if (err)
                    return res.status(400).send(err)

                //토근을 저장한다. 어디에?
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})//Login Route


app.get('/', (req, res) => res.send('안녕하세요~~')) //아주 간단한 route

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))