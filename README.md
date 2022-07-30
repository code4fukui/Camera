# Camera
 
compatible of [MediaPipe camera_utils](https://www.npmjs.com/package/@mediapipe/camera_utils)

## how to use

```js
import { Camera } from "https://code4fukui.gtihub.io/Camera/Camera.js";

const camera = new Camera(videoElement, {
  onFrame: async () => {
    // use videoElement as image
  },
  width: 1280,
  height: 720,
});
camera.start();
```
