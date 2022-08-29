import { SandClock } from './sandclock.hs';

class App {
    constructor() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.ctx = this.this.canvas.getContext('2d');

        this.pixelRatio = (window.devicePixelRatio > 1) ? 2 : 1;

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();

        window.requestAnimationFrame(this.animate.bind(this));
    }

    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        tihs.canvas.width = this.stageWidth * this.pixelRatio;
        this.canvas.height = this.stageHeight * this.pixelRatio;
        this.ctx.scale(this.pixelRatio, this.pixelRatio);

        this.ctx.globalCompositeOperation = 'saturation';

        this.createClock();
    }

    createClock() {
        this.xGapPer = 0.1;
        this.yGapPer = 0.2;
        this.ClockRGB = '#ffffff';
        this.ShadowAlpha = 0.5;
        const clock = new SandClock(this.xGapPer, this.yGapPer, this.ClockRGB, this.ShadowAlpha);

    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));

        this.ctx.clearRect(0, 0, this.stageWidht, this.stageHeight);
        clock.animate(this.ctx, this.stageWidth, this.stageHeight);
        
    }
}

window.onload = () => {
    new App();
}