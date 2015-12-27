/**
 * Created by yves on 12/26/15.
 */
var flight;
(function (flight) {
    var Bullet = (function (_super) {
        __extends(Bullet, _super);
        function Bullet(texture) {
            _super.call(this, texture);
        }
        var d = __define,c=Bullet;p=c.prototype;
        /**生产*/
        Bullet.produce = function (textureName) {
            if (flight.Bullet.cacheDict[textureName] == null)
                flight.Bullet.cacheDict[textureName] = [];
            var dict = flight.Bullet.cacheDict[textureName];
            var bullet;
            if (dict.length > 0) {
                bullet = dict.pop();
            }
            else {
                bullet = new flight.Bullet(RES.getRes(textureName));
            }
            bullet.textureName = textureName;
            return bullet;
        };
        /**回收*/
        Bullet.reclaim = function (bullet, textureName) {
            if (flight.Bullet.cacheDict[textureName] == null)
                flight.Bullet.cacheDict[textureName] = [];
            var dict = flight.Bullet.cacheDict[textureName];
            if (dict.indexOf(bullet) == -1) {
                dict.push(bullet);
            }
        };
        Bullet.cacheDict = {};
        return Bullet;
    })(egret.Bitmap);
    flight.Bullet = Bullet;
    egret.registerClass(Bullet,"flight.Bullet");
})(flight || (flight = {}));
