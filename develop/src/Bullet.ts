/**
 * Created by yves on 12/26/15.
 */
module flight {

    export class Bullet extends egret.Bitmap {
        private static cacheDict:Object = {};
        public textureName:string;

        public constructor(texture:egret.Texture) {
            super(texture);
        }

        /**生产*/
        public static produce(textureName:string):flight.Bullet {
            if(flight.Bullet.cacheDict[textureName]==null)
                flight.Bullet.cacheDict[textureName] = [];
            var dict:flight.Bullet[] = flight.Bullet.cacheDict[textureName];
            var bullet:flight.Bullet;
            if (dict.length > 0) {
                bullet = dict.pop();
            } else {
                bullet = new flight.Bullet(RES.getRes(textureName));
            }
            bullet.textureName = textureName;
            return bullet;
        }
        /**回收*/
        public static reclaim(bullet:flight.Bullet, textureName:string):void {
            if (flight.Bullet.cacheDict[textureName] == null)
                flight.Bullet.cacheDict[textureName] = [];
            var dict:flight.Bullet[] = flight.Bullet.cacheDict[textureName];
            if (dict.indexOf(bullet) == -1) {
                dict.push(bullet);
            }
        }
    }
}