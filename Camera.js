export class Camera {
  constructor(videoElement, opt) {
    this.videoElement = videoElement;
    this.opt = opt;
  }
  async start() {
    const video = {
      width: this.opt.width || 1280,
      height: this.opt.height || 720,
    };
    const devs = await navigator.mediaDevices.enumerateDevices();
    const dev = devs.find(d => d.kind == "videoinput" && d.label.toLowerCase().indexOf("camera") >= 0 && d.label.toLowerCase().indexOf("virtual") == -1);
    if (dev) {
      video.deviceId = dev.deviceId;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ video });
    //console.log(stream);
    this.videoElement.srcObject = stream;
    this.delay = 1000 / (opt.fps || 30);
    this.stream = stream;

    this.videoElement.play();
    this.active = true;
    const f = async () => {
      if (!this.active) {
        return;
      }
      const w = this.videoElement.videoWidth;
      if (w) {
        await this.opt.onFrame();
      }
      setTimeout(f, this.delay);
    };
    f();
  }
  async stop() {
    this.videoElement.pause();
    this.videoElement.srcObject = null;
    this.stream.getVideoTracks().forEach(v => v.stop());
    this.stream = null;
    this.active = false;
  }
};
