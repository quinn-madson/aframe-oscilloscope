AFRAME.registerShader('gradient-sky', {
    schema: {
      topColor: { type: 'color', is: 'uniform', default: '#56CCF2' },
      bottomColor: { type: 'color', is: 'uniform', default: '#2F80ED' }
    },

    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,

    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + vec3(0, 1, 0)).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), 0.6), 0.0)), 1.0);
      }
    `
  });

  AFRAME.registerComponent('gradient-sky', {
    schema: {
      radius: { type: 'number', default: 500 },
      topColor: { type: 'color', default: '#56CCF2' },
      bottomColor: { type: 'color', default: '#2F80ED' }
    },

    init: function () {
      const sky = document.createElement('a-sphere');
      sky.setAttribute('radius', this.data.radius);
      sky.setAttribute('segments-width', 32);
      sky.setAttribute('segments-height', 15);
      sky.setAttribute('scale', '1 1 -1');
      sky.setAttribute('material', `shader: gradient-sky; side: double; topColor: ${this.data.topColor}; bottomColor: ${this.data.bottomColor}`);
      this.el.appendChild(sky);
    }
  });