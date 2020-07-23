const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const {User} = require("./models/User"); //User Model을 가져오는 것

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://leehyunggeol:glglg12345@boilerplate.adktl.mongodb.net/<dbname>?retryWrites=true&w=majority', {
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

app.get('/', (req, res) => res.send('안녕하세요~~')) //아주 간단한 route

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))