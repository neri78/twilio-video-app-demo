let videoRoom;
let videoTrack;
let blurBg;
let virtualBg;
window.addEventListener('load', () => {
    const loginForm = document.getElementById('login-form');
    const identityField = document.getElementById('identity');
    const roomField = document.getElementById('room');
    const blurBgBtn = document.getElementById('blurBg');
    const virtualBgBtn = document.getElementById('virtualBg');

    // 仮想背景（ぼかし）を有効・無効化
    blurBgBtn.addEventListener('click', async() => {
        if (videoTrack.processor)
        {
            videoTrack.removeProcessor(videoTrack.processor);
        }
        else{ 
            if (!blurBg) {
                blurBg = new Twilio.VideoProcessors.GaussianBlurBackgroundProcessor({
                    assetsPath: '/js/twilio-video-processor',
                    maskBlurRadius: 10,
                    blurFilterRadius: 5,
                });
                await blurBg.loadModel();
            }
            videoTrack.addProcessor(blurBg);
        }
    });

    // 仮想背景（画像）を有効・無効化
    virtualBgBtn.addEventListener('click', async() => {
        if (videoTrack.processor)
        {
            videoTrack.removeProcessor(videoTrack.processor);
        }
        else{ 
            if (!virtualBg) {
                let img = new Image();
                img.src = '/images/2021.jpg';
                img.onload = async () => {
                    virtualBg = new Twilio.VideoProcessors.VirtualBackgroundProcessor({
                        assetsPath: '/js/twilio-video-processor',
                        backgroundImage: img,
                        maskBlurRadius: 5,
                    });
                    await virtualBg.loadModel();
                    console.log(virtualBg);
                    videoTrack.addProcessor(virtualBg);
                }
            }
            else
                videoTrack.addProcessor(virtualBg);
        }
    });

    // フォームに入力があった場合
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        // ユーザー名・ルーム名を取得
        const identity = identityField.value;
        const roomName = roomField.value;

        // アクセストークンをリクエスト
        let response = await fetch('/video-token', {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({identity: identity, room: roomName})
        });
        

        let {token, room} = await response.json();
        
        // ビデオチャットを開始
        startVideoChat(token, room);        
    });
});


async function startVideoChat(token, room) {
    // // Video Client SDKを使用し、Roomに接続（ビデオのみ）
    // videoTrack = await Twilio.Video.createLocalVideoTrack();
    // videoRoom = await Twilio.Video.connect(
    //     token, {
    //         name: room,
    //         tracks: [videoTrack]
    //  });

    // // ローカル参加者を画面に追加    
    // participantConnected(videoRoom.localParticipant);
 
    // // 現在のルーム参加者をページに追加
    // videoRoom.participants.forEach(participantConnected);

    // // Roomに新たに参加者が追加された場合のイベントハンドラを指定
    // videoRoom.on('participantConnected', participantConnected);
    
    // // Roomから参加者が退出した場合のイベントハンドラを指定
    // videoRoom.on('participantDisconnected', participantDisconnected);

    // // Roomから自分自身が退出した際の処理
    // videoRoom.once('disconnected', (room) => {
    //     console.log(room.state);
    // })

    // // ブラウザーのクローズやリロードの処理
    // window.addEventListener('beforeunload', tidyUp(videoRoom));
    // window.addEventListener('pagehide', tidyUp(videoRoom));
}

function participantConnected(participant) {

    //  デバッグ用に出力
    console.log(`${participant.identity}がRoomに参加しました。`)

    // <Div>要素を作成。参加者のidentityをIDに設定
    const el = document.createElement('div');
    el.setAttribute('id', participant.identity);
    el.setAttribute('class', 'video-element');

    // 参加者一覧に追加
    const participants = document.getElementById('participants');
    participants.appendChild(el);

    // 参加者のトラック（映像、音声）をページに追加
    participant.tracks.forEach((trackPublication) => {
        trackPublished(trackPublication, participant);
        
    })

    // 参加者が新しくパブリッシュした場合のイベントハンドラを登録
    participant.on('trackPublished', trackPublished)
}

// トラックがパブリッシュされた際の処理
function trackPublished(trackPublication, participant) {
    // 事前に作成した参加者のIdentityをIDにした<div>要素を取得
    const el = document.getElementById(participant.identity);

     // トラックがサブスクライブされた際の処理
     const trackSubscribed = (track) => {
        // trackの種類に合わせて<video> <audio>タグを要素に追加
        el.appendChild(track.attach())
        // デバッグ用に出力
        console.log(`${track}のサブスクライブ後処理を完了しました。`)
     };

    // パブリッシュされたトラックがサブスクライブされている場合
    if (trackPublication.track)
        trackSubscribed(trackPublication.track);
    
    // パブリッシュされたトラックのサブスクライブイベントハンドラを登録
    trackPublication.on('subscribed', trackSubscribed);
}

// 参加者が接続解除した際の処理
function participantDisconnected(participant) {
    participant.removeAllListeners();
    const el = document.getElementById(participant.identity);
    el.remove();
}

// トラックがアンパブリッシュされた際の処理
function trackUnpublished(trackPublication) {
    trackPublication.track.detach().forEach(function (mediaElement) {
    mediaElement.remove();
    });
}

// 退出処理
function tidyUp(room) {
    return function (event) {
        if (event.persisted) {
            console.log('is this a case?');
            return;
        }
        if (room) {
            room.disconnect();
            room = null;
        }
    };
}