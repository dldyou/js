

export class SandClock {
    constructor(xGapPer, yGapPer, ClockRGB, ShadowAlpha) {
        this.xGapPer = xGapPer;
        this.yGapPer = yGapPer;
        this.ClockRGB = ClockRGB;
        this.ShadowAlpha = ShadowAlpha;

        this.x1 = stageWidth * xGapPer;
        this.x2 = stageWidht * (1 - xGapPer * 2);
        this.y1 = stageHeight * yGapPer;
        this.y2 = stageHeight * (1 - yGapPer * 2);
    }

    animate(ctx, stageWidth, stageHeight) {
        ctx.beginPath();
        ctx.fillStyle = ClockRGB;
        ctx.rect(x1, y1, x2, y2);
        ctx.fill();
    }
}