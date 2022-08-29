const PI2 = Math.PI * 2;

export class Dot {
    constructor(x, y, radius, pixelSize, red, green, blue, scale, shape, totalShapes, BOUNCE) {
        
        this.BOUNCE = BOUNCE;
        this.x = x;
        this.y = y;
        const ratio = radius / 256 / 2; 
        ;
        this.targetRadius = ratio * scale;
        this.radius = radius;
        this.radiusV = 0;
        this.pixelSize = pixelSize;
        this.pixelSizeHalf = pixelSize / 2;
        this.red = red;
        this.green = green;
        this.blue = blue;

        this.shape = shape;
        this.totalShapes = totalShapes;
    }

    animate(ctx) {
        const accel = (this.targetRadius - this.radius) / 2;
        this.radiusV += accel;
        this.radiusV *= this.BOUNCE;
        this.radius += this.radiusV;
        ctx.beginPath();
        ctx.fillStyle = "rgb(" + this.red + "," + this.green + "," + this.blue + ")";

        if (this.radius > 0) {
            if (this.shape == 0) {
                ctx.arc(this.x, this.y, this.radius, 0, PI2, false);
            } else if (this.shape == 1) {
                ctx.rect(this.x, this.y, this.radius * 2, this.radius * 2);
            } else if (this.shape == 2) {
                ctx.arc(this.x, this.y, this.radius, 0, PI2, false);
                ctx.rect(this.x, this.y, this.radius, this.radius);
            } else if (this.shape == 3) {
                ctx.rect(this.x, this.y, this.radius, this.radius * 2);
            } 
        }
        
        ctx.fill();
    }
    reset() {
        this.radius = 0;
        this.radiusV = 0;
    }
}