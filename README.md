# Camera

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A camera processing library compatible with the [camera_utils of MediaPipe](https://www.npmjs.com/package/@mediapipe/camera_utils).

## Demo
https://code4fukui.github.io/Camera/

## Features
- Supports front and back camera access
- Configurable video resolution and frame rate
- Provides callback function for processing the video frame

## Usage

```js
import { Camera } from "https://code4fukui.github.io/Camera/Camera.js";

const camera = new Camera(videoElement, {
  onFrame: async () => {
    // use videoElement as image
  },
  width: 1280,
  height: 720,
  backcamera: true,
});
camera.start();
```

## License

MIT License — see [LICENSE](LICENSE).