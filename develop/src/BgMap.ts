/**
 * Created by yves on 12/26/15.
 */
module flight {
    /**
     * 可滚动的背景图片
     */
    export class BgMap extends egret.DisplayObjectContainer {
        /**
         * 参数
         */
        private stageW:number;
        private stageH:number;
        private textureHeight:number;
        private textureWidth:number;
        private rowCount:number;
        private bmpArr:egret.Bitmap[];
        private speed:number = 2;

        /**
         * 主入口
         */
        public constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }

        /**
         * 初始化
         */
        private onAddToStage() {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            var texture:egret.Texture = RES.getRes('bgImage');
            this.textureHeight = texture.textureHeight;//原始纹理高度
            this.textureWidth = texture.textureWidth;
            this.rowCount = Math.ceil(this.stageH/this.textureHeight) + 1;
            this.bmpArr = [];
            //创建图片设置Y,使其连接在一起
            for (var i:number = 0; i < this.rowCount; i++) {
                var bgBmp:egret.Bitmap = flight.createBitmapByName('bgImage');
                bgBmp.x = (this.stageW - this.textureWidth)/2;
                bgBmp.y = this.textureHeight * i - (this.textureHeight * this.rowCount - this.stageH);
                this.bmpArr.push(bgBmp);
                this.addChild(bgBmp);
            }
        }

        /**
         * 开始滚动
         */
        public start():void {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        }

        /**
         * 逐帧运动
         */
        private enterFrameHandler(event:egret.Event):void {
            for (var i:number = 0; i < this.rowCount; i++) {
                var bgBmp:egret.Bitmap = this.bmpArr[i];
                bgBmp.y += this.speed;
                //判断超出屏幕 回到队首,实现循环
                if (bgBmp.y > this.stageH) {
                    bgBmp.y = this.bmpArr[0].y - this.textureHeight;
                    this.bmpArr.pop();
                    this.bmpArr.unshift(bgBmp);
                }
            }
        }

        /**
         * 暂停运动
         */
        public pause():void {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        }
    }
}