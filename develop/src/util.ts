/**
 * Created by yves on 12/26/15.
 */
module flight {
    /**
     * 根据name创建一个Bitmap对象.
     */
    export function createBitmapByName(name:string):egret.Bitmap {
        var result:egret.Bitmap = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    /**基于矩形的碰撞检测*/
    export function hitTest(obj1:egret.DisplayObject, obj2:egret.DisplayObject):boolean {
        var rect1:egret.Rectangle = obj1.getBounds();
        var rect2:egret.Rectangle = obj2.getBounds();
        rect1.x = obj1.x;
        rect1.y = obj1.y;
        rect2.x = obj2.x;
        rect2.y = obj2.y;
        return rect1.intersects(rect2);
    }
}