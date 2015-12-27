/**
 * Created by yves on 12/26/15.
 */
var flight;
(function (flight) {
    /**
     * 根据name创建一个Bitmap对象.
     */
    function createBitmapByName(name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    flight.createBitmapByName = createBitmapByName;
    /**基于矩形的碰撞检测*/
    function hitTest(obj1, obj2) {
        var rect1 = obj1.getBounds();
        var rect2 = obj2.getBounds();
        rect1.x = obj1.x;
        rect1.y = obj1.y;
        rect2.x = obj2.x;
        rect2.y = obj2.y;
        return rect1.intersects(rect2);
    }
    flight.hitTest = hitTest;
})(flight || (flight = {}));
