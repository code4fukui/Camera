export class Camera {
  constructor(videoElement, opt) {
    this.videoElement = videoElement;
    this.opt = opt;
  }
  async start() {
    const w = this.opt.width || 1280;
    const h = this.opt.height || 720;
    const video = {
      width: { min: w / 2, max: w * 1.5 >> 0 },
      height: { min: h / 2, max: h * 1.5 >> 0 },
      facingMode: this.opt.backcamera ? { ideal: "environment" } : "user",
    };
    const devs = await navigator.mediaDevices.enumerateDevices();
    const dev = devs.find(d => d.kind == "videoinput" && d.label.toLowerCase().indexOf("camera") >= 0 && d.label.toLowerCase().indexOf("virtual") == -1);
    if (dev) {
      video.deviceId = dev.deviceId;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ video });
    //console.log(stream);
    this.videoElement.srcObject = stream;
    this.delay = 1000 / (this.opt.fps || 30);
    this.stream = stream;

    this.videoElement.playsInline = true;
    this.videoElement.autoplay = true;
    this.videoElement.play();
    const f = async () => {
      const v = this.videoElement;
      if (v.readyState != HTMLMediaElement.HAVE_ENOUGH_DATA) {
        return;
      }
      if (v.videoWidth) {
        await this.opt.onFrame();
      }
    };
    this.timer = setInterval(f, this.delay);
    f();
  }
  stop() {
    this.videoElement.pause();
    this.videoElement.srcObject = null;
    this.stream.getVideoTracks().forEach(v => v.stop());
    this.stream = null;
    clearInterval(this.timer);
  }
  flip() {
    this.stop();
    this.opt.backcamera = !this.opt.backcamera;
    this.start();
  }
};
