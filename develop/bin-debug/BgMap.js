/**
 * Created by yves on 12/26/15.
 */
var flight;
(function (flight) {
    /**
     * 可滚动的背景图片
     */
    var BgMap = (function (_super) {
        __extends(BgMap, _super);
        /**
         * 主入口
         */
        function BgMap() {
            _super.call(this);
            this.speed = 2;
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }
        var d = __define,c=BgMap;p=c.prototype;
        /**
         * 初始化
         */
        p.onAddToStage = function () {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            var texture = RES.getRes('bgImage');
            this.textureHeight = texture.textureHeight; //原始纹理高度
            this.textureWidth = texture.textureWidth;
            this.rowCount = Math.ceil(this.stageH / this.textureHeight) + 1;
            this.bmpArr = [];
            //创建图片设置Y,使其连接在一起
            for (var i = 0; i < this.rowCount; i++) {
                var bgBmp = flight.createBitmapByName('bgImage');
                bgBmp.x = (this.stageW - this.textureWidth) / 2;
                bgBmp.y = this.textureHeight * i - (this.textureHeight * this.rowCount - this.stageH);
                this.bmpArr.push(bgBmp);
                this.addChild(bgBmp);
            }
        };
        /**
         * 开始滚动
         */
        p.start = function () {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        };
        /**
         * 逐帧运动
         */
        p.enterFrameHandler = function (event) {
            for (var i = 0; i < this.rowCount; i++) {
                var bgBmp = this.bmpArr[i];
                bgBmp.y += this.speed;
                //判断超出屏幕 回到队首,实现循环
                if (bgBmp.y > this.stageH) {
                    bgBmp.y = this.bmpArr[0].y - this.textureHeight;
                    this.bmpArr.pop();
                    this.bmpArr.unshift(bgBmp);
                }
            }
        };
        /**
         * 暂停运动
         */
        p.pause = function () {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        };
        return BgMap;
    })(egret.DisplayObjectContainer);
    flight.BgMap = BgMap;
    egret.registerClass(BgMap,"flight.BgMap");
})(flight || (flight = {}));
