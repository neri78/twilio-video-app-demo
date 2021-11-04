require('dotenv').config();
const express = require('express');
const twilio = require('twilio');

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('public'));

app.all('/video-token', async (req, res) => {


    const { identity, room } = req.body;
    const {TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET} = process.env;

    // Twilio Node Clientを初期化
    const client = new twilio(TWILIO_API_KEY, TWILIO_API_SECRET, 
                                {accountSid: TWILIO_ACCOUNT_SID});

    let roomObj;

    // 現在進行中のビデオルームを検索

    // ルームが存在する場合はそちらを利用
    // そうでない場合はビデオルームを作成
    
    const AccessTooken = twilio.jwt.AccessToken;
    const VideoGrant = AccessTooken.VideoGrant;

    // 特定のビデオルームのみに入室できる
    
    // 上記の認可を有したアクセストークンを生成
    
    // クライアント側にトークンを送信
    

});


app.listen(3000, () => console.log('Node.js Server is running and listening at 3000'));