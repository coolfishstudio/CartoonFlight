/**
 * Created by yves on 12/26/15.
 */
var flight;
(function (flight) {
    /**
     * 游戏主容器
     */
    var GameContainer = (function (_super) {
        __extends(GameContainer, _super);
        function GameContainer() {
            _super.call(this);
            this.enemyFlights = []; //敌人的飞机
            this.enemyFlightsTimer = new egret.Timer(1000); //触发创建敌机的间隔
            this.myBullets = []; //我的子弹
            this.enemyBullets = []; //敌人的子弹
            this.myScore = 0; //我的成绩
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }
        var d = __define,c=GameContainer;p=c.prototype;
        /**
         * 初始化
         */
        p.onAddToStage = function (event) {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.createGameScene();
        };
        /**
         * 创建游戏场景
         */
        p.createGameScene = function () {
            /**获取场景的宽高*/
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            //console.log(this.stageW, this.stageH);
            /** 添加背景 */
            this.bg = new flight.BgMap();
            this.addChild(this.bg);
            /** 添加logo */
            this.menuHero = flight.createBitmapByName('menuHero');
            this.menuHero.x = (this.stageW - this.menuHero.width) / 2; //水平居中
            this.menuHero.y = (this.stageH - this.menuHero.height) / 2; //垂直居中
            this.menuLogoText = flight.createBitmapByName('menuLogoText');
            this.menuLogoText.x = (this.stageW - this.menuLogoText.width) / 2;
            this.menuLogoText.y = this.menuHero.y + 260;
            this.addChild(this.menuHero);
            this.addChild(this.menuLogoText);
            /** 添加开始按钮 */
            this.btnLoaderPlay = flight.createBitmapByName('btnLoaderPlay');
            this.btnLoaderPlay.x = (this.stageW - this.btnLoaderPlay.width) / 2;
            this.btnLoaderPlay.y = this.menuLogoText.y + 140;
            this.btnLoaderPlay.touchEnabled = true;
            this.btnLoaderPlay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this); //点击按钮 开始游戏
            this.addChild(this.btnLoaderPlay);
            this.scorePanel = new flight.ScorePanel();
        };
        /**
         * 开始游戏
         */
        p.gameStart = function () {
            //移除开始界面内容
            this.removeChild(this.menuHero);
            this.removeChild(this.menuLogoText);
            this.removeChild(this.btnLoaderPlay);
            this.bg.start();
            //创建飞机
            this.myFlight = new flight.Airplane(RES.getRes('hero'), 200);
            this.myFlight.y = this.stageH - this.myFlight.height - 50;
            this.myFlight.x = (this.stageW - this.myFlight.width) / 2;
            this.touchEnabled = true;
            this.myFlight.fire();
            this.myFlight.addEventListener('createBullet', this.createBulletHandler, this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
            this.addChild(this.myFlight);
            this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
            this.enemyFlightsTimer.addEventListener(egret.TimerEvent.TIMER, this.createEnemyFlight, this);
            this.enemyFlightsTimer.start();
            this.myScore = 0;
            if (this.scorePanel.parent == this) {
                this.removeChild(this.scorePanel);
            }
        };
        /**
         * 创建子弹
         */
        p.createBulletHandler = function (event) {
            var bullet;
            if (event.target == this.myFlight) {
                for (var i = 0; i < 2; i++) {
                    bullet = flight.Bullet.produce('bullet');
                    //bullet.x = this.myFlight.x + this.myFlight.width / 2 - 13;
                    bullet.x = i == 0 ? (this.myFlight.x + 9) : (this.myFlight.x + this.myFlight.width - 33);
                    bullet.y = this.myFlight.y + 30;
                    this.addChildAt(bullet, this.numChildren - 1 - this.enemyFlights.length);
                    this.myBullets.push(bullet);
                }
            }
            else {
                var theFighter = event.target;
                bullet = flight.Bullet.produce('mobBullet');
                bullet.x = theFighter.x + theFighter.width / 2 - 15;
                bullet.y = theFighter.y + 20;
                this.addChildAt(bullet, this.numChildren - 1 - this.enemyFlights.length);
                this.enemyBullets.push(bullet);
            }
        };
        /**
         * touch更新我的飞机
         */
        p.touchHandler = function (event) {
            //如果移动 则修改坐标
            if (event.type == egret.TouchEvent.TOUCH_MOVE) {
                var tx = event.localX - this.myFlight.width / 2;
                tx = Math.max(10, tx); //限制左边距
                tx = Math.min(this.stageW - this.myFlight.width - 10, tx);
                this.myFlight.x = tx;
            }
        };
        /**
         * 创建敌机
         */
        p.createEnemyFlight = function (event) {
            var enemyFlight = flight.Airplane.produce('chaser', 1000);
            enemyFlight.x = Math.random() * (this.stageW - enemyFlight.width); //随机坐标
            enemyFlight.y = -enemyFlight.height - Math.random() * 300; //随机坐标
            enemyFlight.addEventListener('createBullet', this.createBulletHandler, this); //创建子弹
            enemyFlight.fire();
            this.addChildAt(enemyFlight, this.numChildren - 1);
            this.enemyFlights.push(enemyFlight);
        };
        /**
         * 游戏画面更新
         */
        p.gameViewUpdate = function (event) {
            //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
            var nowTime = egret.getTimer();
            var fps = 1000 / (nowTime - this.lastTime);
            this.lastTime = nowTime;
            var speedOffset = 60 / fps;
            var delArr = []; //回收容器
            //我的子弹运动
            var bullet;
            var myBulletsCount = this.myBullets.length;
            for (var i = 0; i < myBulletsCount; i++) {
                bullet = this.myBullets[i];
                bullet.y -= 12 * speedOffset;
                if (bullet.y < -bullet.height) {
                    delArr.push(bullet);
                }
            }
            for (var i = 0; i < delArr.length; i++) {
                bullet = delArr[i];
                this.removeChild(bullet);
                flight.Bullet.reclaim(bullet, 'bullet');
                this.myBullets.splice(this.myBullets.indexOf(bullet), 1);
            }
            //敌机飞行
            delArr = []; //清空容器
            var theFlight;
            var enemyFlightCount = this.enemyFlights.length;
            for (var i = 0; i < enemyFlightCount; i++) {
                theFlight = this.enemyFlights[i];
                theFlight.y += 4 * speedOffset;
                if (theFlight.y > this.stageH) {
                    delArr.push(theFlight);
                }
            }
            //回收死掉的飞机
            for (var i = 0; i < delArr.length; i++) {
                theFlight = delArr[i];
                this.removeChild(theFlight);
                flight.Airplane.reclaim(theFlight, 'chaser');
                this.enemyFlights.splice(this.enemyFlights.indexOf(theFlight), 1);
            }
            delArr = [];
            //敌人子弹运动
            var enemyBulletsCount = this.enemyBullets.length;
            for (var i = 0; i < enemyBulletsCount; i++) {
                bullet = this.enemyBullets[i];
                bullet.y += 8 * speedOffset;
                if (bullet.y > this.stageH) {
                    delArr.push(bullet);
                }
            }
            for (var i = 0; i < delArr.length; i++) {
                bullet = delArr[i];
                this.removeChild(bullet);
                flight.Bullet.reclaim(bullet, 'mobBullet');
                this.enemyBullets.splice(this.enemyBullets.indexOf(bullet), 1);
            }
            this.gameHitTest();
        };
        /**
         * 游戏碰撞
         */
        p.gameHitTest = function () {
            var i, j;
            var bullet;
            var theFighter;
            var myBulletsCount = this.myBullets.length;
            var enemyFighterCount = this.enemyFlights.length;
            var enemyBulletsCount = this.enemyBullets.length;
            //将需消失的子弹和飞机记录
            var delBullets = [];
            var delFighters = [];
            //我的子弹可以消灭敌机
            for (i = 0; i < myBulletsCount; i++) {
                bullet = this.myBullets[i];
                for (j = 0; j < enemyFighterCount; j++) {
                    theFighter = this.enemyFlights[j];
                    if (flight.hitTest(theFighter, bullet)) {
                        theFighter.blood -= 2;
                        if (delBullets.indexOf(bullet) == -1) {
                            delBullets.push(bullet);
                        }
                        if (theFighter.blood <= 0 && delFighters.indexOf(theFighter) == -1) {
                            delFighters.push(theFighter);
                        }
                    }
                }
            }
            //敌人的子弹可以减我血
            for (i = 0; i < enemyBulletsCount; i++) {
                bullet = this.enemyBullets[i];
                if (flight.hitTest(this.myFlight, bullet)) {
                    this.myFlight.blood -= 1;
                    if (delBullets.indexOf(bullet) == -1) {
                        delBullets.push(bullet);
                    }
                }
            }
            //敌机的撞击可以消灭我
            for (i = 0; i < enemyFighterCount; i++) {
                theFighter = this.enemyFlights[i];
                if (flight.hitTest(this.myFlight, theFighter)) {
                    this.myFlight.blood -= 10;
                }
            }
            //判断是否死亡
            if (this.myFlight.blood <= 0) {
                this.gameStop();
            }
            else {
                while (delBullets.length > 0) {
                    bullet = delBullets.pop();
                    this.removeChild(bullet);
                    if (bullet.textureName == 'bullet') {
                        this.myBullets.splice(this.myBullets.indexOf(bullet), 1);
                    }
                    else {
                        this.enemyBullets.splice(this.enemyBullets.indexOf(bullet), 1);
                    }
                    flight.Bullet.reclaim(bullet, bullet.textureName);
                }
                this.myScore += delFighters.length;
                while (delFighters.length > 0) {
                    theFighter = delFighters.pop();
                    theFighter.stopFire();
                    theFighter.removeEventListener('createBullet', this.createBulletHandler, this);
                    this.removeChild(theFighter);
                    this.enemyFlights.splice(this.enemyFlights.indexOf(theFighter), 1);
                    flight.Airplane.reclaim(theFighter, 'chaser');
                }
            }
        };
        /**
         * 游戏结束
         */
        p.gameStop = function () {
            this.addChild(this.menuHero);
            this.addChild(this.menuLogoText);
            this.addChild(this.btnLoaderPlay);
            this.bg.pause();
            this.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
            this.myFlight.stopFire();
            this.myFlight.removeEventListener('createBullet', this.createBulletHandler, this);
            this.removeChild(this.myFlight);
            this.enemyFlightsTimer.removeEventListener(egret.TimerEvent.TIMER, this.createEnemyFlight, this);
            this.enemyFlightsTimer.stop();
            //清理子弹
            var bullet;
            while (this.myBullets.length > 0) {
                bullet = this.myBullets.pop();
                this.removeChild(bullet);
                flight.Bullet.reclaim(bullet, 'bullet');
            }
            while (this.enemyBullets.length > 0) {
                bullet = this.enemyBullets.pop();
                this.removeChild(bullet);
                flight.Bullet.reclaim(bullet, 'mobBullet');
            }
            //清理飞机
            var theFighter;
            while (this.enemyFlights.length > 0) {
                theFighter = this.enemyFlights.pop();
                theFighter.stopFire();
                theFighter.removeEventListener('createBullet', this.createBulletHandler, this);
                this.removeChild(theFighter);
                flight.Airplane.reclaim(theFighter, 'chaser');
            }
            //显示成绩
            this.scorePanel.showScore(this.myScore);
            this.scorePanel.x = (this.stageW - this.scorePanel.width) / 2;
            this.scorePanel.y = 100;
            this.addChild(this.scorePanel);
        };
        return GameContainer;
    })(egret.DisplayObjectContainer);
    flight.GameContainer = GameContainer;
    egret.registerClass(GameContainer,"flight.GameContainer");
})(flight || (flight = {}));
