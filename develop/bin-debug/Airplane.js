/**
 * Created by yves on 12/26/15.
 */
/**
 *  飞机模块
 */
var flight;
(function (flight) {
    var Airplane = (function (_super) {
        __extends(Airplane, _super);
        function Airplane(texturt, fireDelay) {
            _super.call(this);
            this.blood = 10; //飞机的生命值
            this.fireDelay = fireDelay;
            this.bmp = new egret.Bitmap(texturt);
            this.addChild(this.bmp);
            this.fireTimer = new egret.Timer(fireDelay);
            this.fireTimer.addEventListener(egret.TimerEvent.TIMER, this.createBullet, this);
        }
        var d = __define,c=Airplane;p=c.prototype;
        /**
         * 生产
         */
        Airplane.produce = function (textureName, fireDelay) {
            if (flight.Airplane.cacheDict[textureName] == null) {
                flight.Airplane.cacheDict[textureName] = []; //不存在就添加
            }
            var dict = flight.Airplane.cacheDict[textureName];
            var theFlight;
            if (dict.length > 0) {
                theFlight = dict.pop();
            }
            else {
                theFlight = new flight.Airplane(RES.getRes(textureName), fireDelay);
            }
            theFlight.blood = 10;
            return theFlight;
        };
        /**
         * 回收
         */
        Airplane.reclaim = function (theFlight, textureName) {
            if (flight.Airplane.cacheDict[textureName] == null) {
                flight.Airplane.cacheDict[textureName] = [];
            }
            var dict = flight.Airplane.cacheDict[textureName];
            if (dict.indexOf(theFlight) == -1) {
                dict.push(theFlight);
            }
        };
        /**
         * 开火
         */
        p.fire = function () {
            this.fireTimer.start();
        };
        /**
         * 停火
         */
        p.stopFire = function () {
            this.fireTimer.stop();
        };
        /**
         * 创建子弹
         */
        p.createBullet = function (event) {
            this.dispatchEventWith('createBullet');
        };
        Airplane.cacheDict = {}; //池
        return Airplane;
    })(egret.DisplayObjectContainer);
    flight.Airplane = Airplane;
    egret.registerClass(Airplane,"flight.Airplane");
})(flight || (flight = {}));
