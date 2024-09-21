export class Camera {
  constructor(videoElement, opt) {
    this.videoElement = videoElement;
    this.opt = opt || {};
    this.onFrame = opt.onFrame;
  }
  async start() {
    const w = this.opt.width || 1280;
    const h = this.opt.height || 720;
    const video = {
      width: { ideal: w },
      height: { ideal: h },
    };
    if (navigator.userAgent.indexOf("Android") == -1) {
      video.facingMode = this.opt.backcamera ? { ideal: "environment" } : "user";
    }
    await navigator.mediaDevices.getUserMedia({ video: true });
    const devs = await navigator.mediaDevices.enumerateDevices();
    //console.log(devs);
    /*
    const div = document.createElement("div");
    document.body.appendChild(div);
    div.innerHTML += JSON.stringify(devs.filter(d => d.kind == "videoinput"), null, 2).replace(/\n/g, "<br>");
    */
    const tryToStart = async (devs) => {
      for (const dev of devs) {
        try {
          video.deviceId = dev.deviceId;
          const stream = await navigator.mediaDevices.getUserMedia({ video });
          this.videoElement.srcObject = stream;
          this.delay = 1000 / (this.opt.fps || 30);
          this.stream = stream;
          this.videoElement.playsInline = true;
          this.videoElement.autoplay = true;
          this.videoElement.play();
          this.active = true;
          this.endfunc = null;
          const f = async () => {
            if (!this.active) {
              if (this.endfunc) {
                this.endfunc();
              }
              return;
            }
            const v = this.videoElement;
            if (v.readyState == HTMLMediaElement.HAVE_ENOUGH_DATA) {
              if (this.onFrame) await this.onFrame();
            }
            setTimeout(f, this.delay);
          };
          f();
          return;
        } catch (e) {
          console.log(e);
        }
      }
    };

    let devs2 = devs.filter(d => {
      const l = d.label.toLowerCase();
      const back = l.indexOf("back") >= 0 || l.indexOf("背面") >= 0;
      return d.kind == "videoinput" &&
        //l.indexOf("camera") >= 0 &&
        l.indexOf("immersed") == -1 &&
        l.indexOf("virtual") == -1 &&
        this.opt.backcamera == back;
    });
    if (devs2.length > 0) {
      await tryToStart(devs2);
    } else {
      devs2 = devs.filter(d => {
        const l = d.label.toLowerCase();
        return d.kind == "videoinput" &&
          //l.indexOf("camera") >= 0 &&
          l.indexOf("immersed") == -1 &&
          l.indexOf("virtual") == -1;
      });
      if (this.opt.backcamera && devs2.length > 1) {
        const devs3 = [];
        for (let i = 1; i < devs2.length; i++) devs3.push(devs2[i]);
        await tryToStart(devs3);
      } else if (devs2.length > 0) {
        await tryToStart(devs2);
      }
    }
  }
  async stop() {
    return new Promise((resolve) => {
      this.videoElement.pause();
      if (this.stream) {
        this.stream.getVideoTracks().forEach(v => v.stop());
        this.stream = null;
      }
      this.videoElement.srcObject = null;
      this.active = false;
      this.endfunc = resolve;
    });
  }
  async flip() {
    await this.stop();
    this.opt.backcamera = !this.opt.backcamera;
    await this.start();
  }
  async setBackCamera(b) {
    if (this.opt.backcamera == b) return;
    await this.stop();
    this.opt.backcamera = b;
    await this.start();
  }
};
