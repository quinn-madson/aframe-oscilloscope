AFRAME.registerComponent("oscilloscope", {
    schema: {
        canvas: { type: "selector" },
        ctx: { type: "selector" },
        analyser: { type: "selector" },
    },
  init: function () {
    const texture = new THREE.CanvasTexture(this.data.canvas);
    this.el.setAttribute("material", { src: texture });
    this.el.object3DMap.mesh.material.side = THREE.DoubleSide;

    this.draw = () => {
      this.data.analyser.fftSize = 2048;
      const bufferLength = this.data.analyser.fftSize;
      const dataArray = new Uint8Array(bufferLength);

      this.data.analyser.getByteTimeDomainData(dataArray);
      this.data.ctx.fillStyle = "rgb(0, 0, 0)";
      this.data.ctx.fillRect(0, 0, this.data.canvas.width, this.data.canvas.height);

      this.data.ctx.lineWidth = 2;
      this.data.ctx.strokeStyle = "rgb(0, 255, 0)";
      this.data.ctx.beginPath();

      const sliceWidth = (this.data.canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * this.data.canvas.height) / 2;

        if (i === 0) {
          this.data.ctx.moveTo(x, y);
        } else {
          this.data.ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      this.data.ctx.lineTo(this.data.canvas.width, this.data.canvas.height / 2);
      this.data.ctx.stroke();

      texture.needsUpdate = true;
      requestAnimationFrame(this.draw);
    };

    this.draw();
  },

});
