# twilio-video-app-demo

[Twilio Programmable Video](https://www.twilio.com/ja/video)を使ったサンプルアプリケーションです。

基本機能に加え、仮想背景機能を実装しています。

## 使用方法

リポジトリをクローンし、次のコマンドでパッケージをインストールします。
```
npm install
```

続けて`.env.sample`ファイルを`.env`ファイルにリネームしてください。このファイルには次の名前で環境変数が宣言されています。

```
TWILIO_ACCOUNT_SID=
TWILIO_API_KEY=
TWILIO_API_SECRET=
```

[Twilioコンソール](https://jp.twilio.com/console)に表示されている`ACCOUNT_SID`を転記し、[APIキーの作成画面](https://jp.twilio.com/console/project/api-keys/create)でAPIキー、およびAPIシークレットを作成してください。

`npm start`コマンドを実行し`https://localhost:3000`にアクセスしてください。

