# Camera
 
Compatible with [camera_utils of MediaPipe](https://www.npmjs.com/package/@mediapipe/camera_utils)

## test

https://code4fukui.github.io/Camera/

## how to use

```js
import { Camera } from "https://code4fukui.gtihub.io/Camera/Camera.js";

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
