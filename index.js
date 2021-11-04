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
    let rooms = await client.video.rooms.list({ 
        status: 'in-progress', 
        uniqueName: room
    });

    // ルームが存在する場合はそちらを利用
    if (rooms.length)
        roomObj = rooms[0];
    else {

        // そうでない場合はビデオルームを作成
        roomObj = await client.video.rooms.create({
            uniqueName: room,
            type: 'go'
        });
    }

    const AccessTooken = twilio.jwt.AccessToken;
    const VideoGrant = AccessTooken.VideoGrant;

    // 特定のビデオルームのみに入室できる
    const grant = new VideoGrant();
    grant.room = roomObj.uniqueName;

    // 上記の認可を有したアクセストークンを生成
    const accessToken = new AccessTooken(
        TWILIO_ACCOUNT_SID, 
        TWILIO_API_KEY, 
        TWILIO_API_SECRET);
    accessToken.addGrant(grant);
    accessToken.identity = identity;

    // クライアント側にトークンを送信
    res.send({ token: accessToken.toJwt(), room: roomObj.uniqueName });

});


app.listen(3000, () => console.log('Node.js Server is running and listening at 3000'));