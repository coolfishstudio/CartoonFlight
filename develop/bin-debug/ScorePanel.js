/**
 * Created by yves on 12/27/15.
 */
var flight;
(function (flight) {
    /**
     * 成绩显示
     */
    var ScorePanel = (function (_super) {
        __extends(ScorePanel, _super);
        function ScorePanel() {
            _super.call(this);
            this.txt = new egret.TextField();
            this.txt.width = 400;
            this.txt.height = 200;
            this.txt.textAlign = 'center';
            this.txt.textColor = 0x000000;
            this.txt.size = 24;
            this.txt.y = 585;
            this.addChild(this.txt);
        }
        var d = __define,c=ScorePanel;p=c.prototype;
        p.showScore = function (value) {
            var msg = '您的成绩是: 消灭了 ' + value + ' 架敌机';
            this.txt.text = msg;
        };
        return ScorePanel;
    })(egret.Sprite);
    flight.ScorePanel = ScorePanel;
    egret.registerClass(ScorePanel,"flight.ScorePanel");
})(flight || (flight = {}));
