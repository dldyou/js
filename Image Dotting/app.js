import {Ripple} from './ripple.js';
import {Dot} from  './dot.js';
import {collide} from './utils.js';
import {getBWValue} from './utils.js';


class App {
    constructor() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.tmpCanvas = document.createElement('canvas');
        this.tmpCtx = this.tmpCanvas.getContext('2d');

        this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
        // this.pixelRatio = 1;

        this.ripple = new Ripple();

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();

        this.stdRadius = 118;
        this.stdPixelSize = 118;
        this.radius = 118;
        this.pixelSize = 118;
        this.Gap = 10;
        this.dots = [];

        this.isLoaded = false;
        this.isPressed = false;
        this.x1 = -1000;
        this.x2 = -1000;
        this.y1 = -1000;
        this.y2 = -1000;
        this.mGap = 150;
        this.BOUNCE = 0.8;
        this.detect = 6;
        this.detectIncrease = 0.5;

        this.imgPos = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };

        this.imageSRC = [
            'yasuo.png',
            'teemo.png',
            'thresh.png',
            'ahri.png',
            'cassiopea.png',
            'kindred.png',
            'lillia.png',
            'riven.png',
            'vayen.png',
            'light.jpg',
            'rkb.png',
        ];
        this.imageSRCIndex = 0;
        this.imageSRCtotal = this.imageSRC.length;
        this.dot;
        this.image = new Image();
        this.image.src = this.imageSRC[this.imageSRCIndex];
        this.image.onload = () => {
            this.isLoaded = true;
            this.drawImage();
        };

        this.shape = 0;
        this.totalShapes = 4;

        window.requestAnimationFrame(this.animate.bind(this));

        document.addEventListener('pointerdown', this.onDown.bind(this), false);
        document.addEventListener('pointermove', this.onMove.bind(this), false);
        document.addEventListener('pointerup', this.onUp.bind(this), false);
        document.addEventListener('keyup', this.onKey.bind(this), false); 
    }

    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        
        this.canvas.width = this.stageWidth * this.pixelRatio;
        this.canvas.height = this.stageHeight * this.pixelRatio;
        this.ctx.scale(this.pixelRatio, this.pixelRatio);

        this.tmpCanvas.width = this.stageWidth;
        this.tmpCanvas.height = this.stageHeight;
        this.ripple.resize(this.stageWidth, this.stageHeight);
        if (this.isLoaded) {
            this.drawImage();
        }
    }

    drawImage() {
        const stageRatio = this.stageWidth / this.stageHeight;
        const imgRatio = this.image.width / this.image.height;

        this.imgPos.width = this.stageWidth;
        this.imgPos.height = this.stageHeight;

        if (imgRatio > stageRatio) {
            this.imgPos.width = Math.round(
                this.image.width * (this.stageHeight / this.image.height)
            );
            this.imgPos.x = Math.round(
                (this.stageWidth - this.imgPos.width) / 2
            );
        }   else {
            this.imgPos.height = Math.round(
                this.image.height * (this.stageWidth / this.image.width)
            );
            this.imgPos.y = Math.round(
                (this.stageHeight - this.imgPos.height) / 2
            );
        }

        this.tmpCtx.drawImage(
            this.image,
            0, 0,
            this.image.width, this.image.height,
            this.imgPos.x, this.imgPos.y,
            this.imgPos.width, this.imgPos.height,
        );

        this.imgData = this.tmpCtx.getImageData(0, 0, this.stageWidth, this.stageHeight);

        this.drawDots();
    }

    drawDots() {
        this.dots = [];

        this.columns = Math.ceil(this.stageWidth / this.pixelSize);
        this.rows = Math.ceil(this.stageHeight / this.pixelSize);

        for (let i = 0; i < this.rows; i++) {
            const y = (i + 0.5) * this.pixelSize;
            const pixelY = Math.max(Math.min(y, this.stageHeight), 0);

            for (let j = 0; j < this.columns; j++) {
                const x = (j + 0.5) * this.pixelSize;
                const pixelX = Math.max(Math.min(x, this.stageWidth), 0);

                const pixelIndex = (pixelX + pixelY * this.stageWidth) * 4;
                const red = this.imgData.data[pixelIndex + 0];
                const green = this.imgData.data[pixelIndex + 1];
                const blue = this.imgData.data[pixelIndex + 2];
                const scale = getBWValue(red, green, blue, false, this.detect);

                const dot = new Dot(
                    x, y, 
                    this.radius,
                    this.pixelSize,
                    red, green, blue,
                    scale,
                    this.shape, this.totalShapes,
                    this.BOUNCE,
                );
                if (dot.targetRadius > 0.1) {
                    this.dots.push(dot);
                }
            }
        }
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));

        this.ripple.animate(this.ctx);

        for (let i = 0; i < this.dots.length; i++) {
            const dot = this.dots[i];
            if(collide(
                dot.x, dot.y,
                this.ripple.x, this.ripple.y,
                this.ripple.radius
            )) {
                dot.animate(this.ctx);
            }
        }
        if(this.isLast) {
            this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
            this.ctx.drawImage(
                this.image,
                0, 0,
                this.image.width, this.image.height,
                this.imgPos.x, this.imgPos.y,
                this.imgPos.width, this.imgPos.height,
            );
        }
    }

    reset() {
        this.isLast = false;
        this.radius = this.stdRadius;
        this.pixelSize = this.stdPixelSize;
        this.image.src = this.imageSRC[this.imageSRCIndex];
        this.resize();
    }
    onKey(e) {
        e = e || window.event;
        if (e.keyCode == '38') {
            //up arrow
            if (this.detect < 20) {
                this.detect += this.detectIncrease;
                if (!this.isLast) {
                    // this.drawDots(); //1
                    // this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
                    for (let i = 0; i < this.dots.length; i++) {
                        this.dots[i].reset();
                    }
                    this.drawDots();
                    // this.ripple.start(this.stageWidth / 2, this.stageHeight / 2); //1
                }
            }
        }
        else if (e.keyCode == '40') {
            //down arrow
            if (this.detect > 1) {
                this.detect -= this.detectIncrease;
                if (!this.isLast) {
                    // this.drawDots(); //1
                    // this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
                    for (let i = 0; i < this.dots.length; i++) {
                        this.dots[i].reset();
                    }
                    this.drawDots();
                    // this.ripple.start(this.stageWidth / 2, this.stageHeight / 2); //1
                }
            }
        }
    }
    onDown(e) {
        this.isPressed = true;
        this.x1 = e.clientX;
        this.y1 = e.clientY;
    }
    
    onMove(e) {
        this.x2 = e.clientX;
        this.y2 = e.clientY;
    }

    onUp(e) {
        if(this.isPressed) {
            this.X = this.x1 - this.x2;
            this.Y = this.y1 - this.y2;
            this.Xswipe = false;
            this.Yswipe = false;
            if (Math.abs(this.X) > this.mGap) {
                this.Xswipe = true;
            } 
            if (Math.abs(this.Y) > this.mGap) {
                this.Yswipe = true;
            }
            
            if (!this.Yswipe) {
                this.isPressed = false;
                if (this.radius - this.Gap > 0 && this.pixelSize - this.Gap > 0) {
                    this.radius -= this.Gap;
                    this.pixelSize -= this.Gap;
                    this.isLast = false;
                }   else {
                    this.radius = this.stdRadius;
                    this.pixelSize = this.stdPixelSize;
                    this.isLast = true;
                }
                if (!this.isLast) {
                    this.drawDots();
                    // this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
                    for (let i = 0; i < this.dots.length; i++) {
                        this.dots[i].reset();
                    }
                    this.ripple.start(this.x1, this.y1);
                }
            }
            
            if(this.Xswipe && !this.Yswipe) {
                while (this.ripple.radius < this.ripple.maxRadius) {
                    this.ripple.radius += this.ripple.speed;
                }
            }
            
            if (this.X < this.mGap * -1 && !this.Yswipe) {
                if (this.imageSRCIndex == 0) {
                    this.imageSRCIndex = this.imageSRCtotal - 1;
                }   else {
                    this.imageSRCIndex -= 1;
                }
            }   else if (this.X > this.mGap && !this.Yswipe) {
                if (this.imageSRCIndex == this.imageSRCtotal - 1) {
                    this.imageSRCIndex = 0;
                }   else {
                    this.imageSRCIndex += 1;
                }
            }

            if (this.Y < this.mGap * -1 && !this.Xswipe) {
                if (this.shape == 0) {
                    this.shape = this.totalShapes - 1;
                } else {
                    this.shape -= 1;
                }
            } else if (this.Y > this.mGap && !this.Xswipe) {
                if (this.shape == this.totalShapes - 1) {
                    this.shape = 0;
                } else {
                    this.shape += 1;
                }
            }
           
            if (this.Xswipe && !this.Yswipe) {
                this.reset();
            } else if (!this.Xswipe && this.Yswipe) {
                // this.resize();
            }
            
            if (this.Yswipe) {
                if (!this.isLast) {
                    this.drawDots();
                    // this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
                    for (let i = 0; i < this.dots.length; i++) {
                        this.dots[i].reset();
                    }
                    this.ripple.start(this.x1, this.y1);
                }
            }
        }
    }
}

window.onload = () => {
    new App();
}