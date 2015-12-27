/**
 * Created by yves on 12/26/15.
 */
/**
 *  飞机模块
 */
module flight {
    export class Airplane extends egret.DisplayObjectContainer {
        /**
         * 参数
         */
        private bmp:egret.Bitmap;//飞机位图
        private fireDelay:number;//创建子弹的时间间隔
        private fireTimer:egret.Timer;//定时射
        public blood:number = 10;//飞机的生命值
        private static cacheDict:Object = {};//池

        public constructor(texturt:egret.Texture, fireDelay:number) {
            super();
            this.fireDelay = fireDelay;
            this.bmp = new egret.Bitmap(texturt);
            this.addChild(this.bmp);
            this.fireTimer = new egret.Timer(fireDelay);
            this.fireTimer.addEventListener(egret.TimerEvent.TIMER, this.createBullet, this);

        }

        /**
         * 生产
         */
        public static produce(textureName:string, fireDelay:number):flight.Airplane {
            if (flight.Airplane.cacheDict[textureName] == null) {
                flight.Airplane.cacheDict[textureName] = [];//不存在就添加
            }
            var dict:flight.Airplane[] = flight.Airplane.cacheDict[textureName];
            var theFlight:flight.Airplane;
            if (dict.length > 0) {
                theFlight = dict.pop();
            } else {
                theFlight = new flight.Airplane(RES.getRes(textureName), fireDelay);
            }
            theFlight.blood = 10;
            return theFlight;
        }

        /**
         * 回收
         */
        public static reclaim(theFlight:flight.Airplane, textureName:string):void {
            if (flight.Airplane.cacheDict[textureName] == null) {
                flight.Airplane.cacheDict[textureName] = [];
            }
            var dict:flight.Airplane[] = flight.Airplane.cacheDict[textureName];
            if (dict.indexOf(theFlight) == -1) {
                dict.push(theFlight);
            }
        }

        /**
         * 开火
         */
        public fire():void {
            this.fireTimer.start();
        }

        /**
         * 停火
         */
        public stopFire():void {
            this.fireTimer.stop();
        }

        /**
         * 创建子弹
         */
        private createBullet(event:egret.TimerEvent):void {
            this.dispatchEventWith('createBullet');
        }
    }
}
