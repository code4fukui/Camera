export class Camera {
  constructor(videoElement, opt) {
    this.videoElement = videoElement;
    this.opt = opt;
  }
  async start() {
    const devs = await navigator.mediaDevices.enumerateDevices();
    //console.log(devs);
    const dev = devs.find(d => d.kind == "videoinput" && d.label.toLowerCase().indexOf("camera") >= 0 && d.label.toLowerCase().indexOf("virtual") == -1);
    //console.log(dev);
    const opt = {
      video: {
        deviceId: dev?.deviceId,
        width: this.opt.width || 1280,
        height: this.opt.height || 720,
      },
    };
    const stream = await navigator.mediaDevices.getUserMedia(opt);
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
