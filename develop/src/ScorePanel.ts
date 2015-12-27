/**
 * Created by yves on 12/27/15.
 */
module flight
{
    /**
     * 成绩显示
     */
    export class ScorePanel extends egret.Sprite {

        private txt:egret.TextField;

        public constructor() {
            super();
            this.txt = new egret.TextField();
            this.txt.width = 400;
            this.txt.height = 200;
            this.txt.textAlign = 'center';
            this.txt.textColor = 0x000000;
            this.txt.size = 24;
            this.txt.y = 585;
            this.addChild(this.txt);
        }

        public showScore(value:number):void {
            var msg:string = '您的成绩是: 消灭了 ' + value + ' 架敌机';
            this.txt.text = msg;
        }
    }
}