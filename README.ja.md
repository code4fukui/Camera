# Camera

MediaPipeのcamera_utilsと互換性のあるカメラ処理ライブラリです。

## デモ

https://code4fukui.github.io/Camera/

## 機能

- 前面/背面カメラへのアクセスをサポート
- 動画の解像度やフレームレートを設定可能
- 動画フレーム処理用のコールバック関数を提供

## 使い方

```js
import { Camera } from "https://code4fukui.github.io/Camera/Camera.js";

const camera = new Camera(videoElement, {
  onFrame: async () => {
    // videoElementを画像として使用する
  },
  width: 1280,
  height: 720,
  backcamera: true,
});
camera.start();
```

## ライセンス

MIT License