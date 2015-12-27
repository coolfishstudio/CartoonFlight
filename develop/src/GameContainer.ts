/**
 * Created by yves on 12/26/15.
 */
module flight {
    /**
     * 游戏主容器
     */
    export class GameContainer extends egret.DisplayObjectContainer {
        /**
         * 参数
         */
        private stageW:number;
        private stageH:number;

        private bg:flight.BgMap;//背景图片
        private menuHero:egret.Bitmap;//启动页面的人
        private menuLogoText:egret.Bitmap;//启动页面的文字
        private btnLoaderPlay:egret.Bitmap;//启动页面的开始按钮

        private myFlight:flight.Airplane;//我的飞机
        private enemyFlights:flight.Airplane[] = [];//敌人的飞机
        private enemyFlightsTimer:egret.Timer = new egret.Timer(1000);//触发创建敌机的间隔

        private lastTime:number;

        private myBullets:flight.Bullet[] = [];//我的子弹
        private enemyBullets:flight.Bullet[] = [];//敌人的子弹

        private myScore:number = 0;//我的成绩
        private scorePanel:flight.ScorePanel;

        public constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }

        /**
         * 初始化
         */
        private onAddToStage(event:egret.Event) {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.createGameScene();
        }

        /**
         * 创建游戏场景
         */
        private createGameScene():void {
            /**获取场景的宽高*/
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            //console.log(this.stageW, this.stageH);
            /** 添加背景 */
            this.bg = new flight.BgMap();
            this.addChild(this.bg);
            /** 添加logo */
            this.menuHero = flight.createBitmapByName('menuHero');
            this.menuHero.x = (this.stageW - this.menuHero.width) / 2;//水平居中
            this.menuHero.y = (this.stageH - this.menuHero.height) / 2;//垂直居中
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
            this.btnLoaderPlay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this);//点击按钮 开始游戏
            this.addChild(this.btnLoaderPlay);

            this.scorePanel = new flight.ScorePanel();
        }

        /**
         * 开始游戏
         */
        private gameStart():void {
            //移除开始界面内容
            this.removeChild(this.menuHero);
            this.removeChild(this.menuLogoText);
            this.removeChild(this.btnLoaderPlay);
            this.bg.start();

            //创建飞机
            this.myFlight = new flight.Airplane(RES.getRes('hero'), 200);
            this.myFlight.y = this.stageH - this.myFlight.height - 50;
            this.myFlight.x = (this.stageW - this.myFlight.width)/2;
            this.touchEnabled = true;
            this.myFlight.fire();
            this.myFlight.addEventListener('createBullet',this.createBulletHandler,this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
            this.addChild(this.myFlight);

            this.addEventListener(egret.Event.ENTER_FRAME,this.gameViewUpdate,this);

            this.enemyFlightsTimer.addEventListener(egret.TimerEvent.TIMER,this.createEnemyFlight,this);
            this.enemyFlightsTimer.start();

            this.myScore = 0;

            if(this.scorePanel.parent == this) {
                this.removeChild(this.scorePanel);
            }
        }

        /**
         * 创建子弹
         */
        private createBulletHandler(event:egret.Event):void {
            var bullet:flight.Bullet;
            if (event.target == this.myFlight) {
                for(var i:number = 0; i < 2; i++) {
                    bullet = flight.Bullet.produce('bullet');
                    //bullet.x = this.myFlight.x + this.myFlight.width / 2 - 13;
                    bullet.x = i==0 ? (this.myFlight.x + 9) : (this.myFlight.x + this.myFlight.width - 33);
                    bullet.y = this.myFlight.y + 30;
                    this.addChildAt(bullet, this.numChildren - 1 - this.enemyFlights.length);
                    this.myBullets.push(bullet);
                }
            } else {
                var theFighter:flight.Airplane = event.target;
                bullet = flight.Bullet.produce('mobBullet');
                bullet.x = theFighter.x + theFighter.width/2 - 15;
                bullet.y = theFighter.y + 20;
                this.addChildAt(bullet, this.numChildren - 1 - this.enemyFlights.length);
                this.enemyBullets.push(bullet);
            }
        }

        /**
         * touch更新我的飞机
         */
        private touchHandler(event:egret.TouchEvent):void {
            //如果移动 则修改坐标
            if (event.type == egret.TouchEvent.TOUCH_MOVE) {
                var tx:number = event.localX - this.myFlight.width/2;
                tx = Math.max(10, tx);//限制左边距
                tx = Math.min(this.stageW - this.myFlight.width - 10, tx);
                this.myFlight.x = tx;
            }
        }

        /**
         * 创建敌机
         */
        private createEnemyFlight(event:egret.TimerEvent):void {
            var enemyFlight:flight.Airplane = flight.Airplane.produce('chaser', 1000);
            enemyFlight.x = Math.random() * (this.stageW - enemyFlight.width);//随机坐标
            enemyFlight.y = -enemyFlight.height - Math.random() * 300;//随机坐标
            enemyFlight.addEventListener('createBullet', this.createBulletHandler, this);//创建子弹
            enemyFlight.fire();
            this.addChildAt(enemyFlight, this.numChildren - 1);
            this.enemyFlights.push(enemyFlight);
        }

        /**
         * 游戏画面更新
         */
        private gameViewUpdate(event:egret.Event):void {
            //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
            var nowTime:number = egret.getTimer();
            var fps:number = 1000/(nowTime - this.lastTime);
            this.lastTime = nowTime;
            var speedOffset:number = 60/fps;

            var delArr:any[] = [];//回收容器

            //我的子弹运动
            var bullet:flight.Bullet;
            var myBulletsCount:number = this.myBullets.length;
            for(var i:number = 0; i < myBulletsCount; i++) {
                bullet = this.myBullets[i];
                bullet.y -= 12 * speedOffset;
                if(bullet.y < -bullet.height) {
                    delArr.push(bullet);
                }
            }
            for(var i:number = 0; i < delArr.length;i++) {//回收不显示的子弹
                bullet = delArr[i];
                this.removeChild(bullet);
                flight.Bullet.reclaim(bullet,'bullet');
                this.myBullets.splice(this.myBullets.indexOf(bullet), 1);
            }
            //敌机飞行

            delArr = [];//清空容器
            var theFlight:flight.Airplane;
            var enemyFlightCount:number = this.enemyFlights.length;
            for (var i:number = 0; i < enemyFlightCount; i++) {
                theFlight = this.enemyFlights[i];
                theFlight.y += 4*speedOffset;
                if (theFlight.y > this.stageH) {
                    delArr.push(theFlight);
                }
            }
            //回收死掉的飞机
            for (var i:number = 0; i < delArr.length; i++) {
                theFlight = delArr[i];
                this.removeChild(theFlight);
                flight.Airplane.reclaim(theFlight, 'chaser');
                this.enemyFlights.splice(this.enemyFlights.indexOf(theFlight), 1);
            }
            delArr = [];
            //敌人子弹运动
            var enemyBulletsCount:number = this.enemyBullets.length;
            for (var i:number = 0; i < enemyBulletsCount; i++) {
                bullet = this.enemyBullets[i];
                bullet.y += 8 * speedOffset;
                if (bullet.y > this.stageH) {
                    delArr.push(bullet);
                }
            }
            for(var i:number = 0; i < delArr.length; i++) {//回收不显示的子弹
                bullet = delArr[i];
                this.removeChild(bullet);
                flight.Bullet.reclaim(bullet, 'mobBullet');
                this.enemyBullets.splice(this.enemyBullets.indexOf(bullet), 1);
            }
            this.gameHitTest();
        }

        /**
         * 游戏碰撞
         */
        private gameHitTest():void {
            var i:number, j:number;
            var bullet:flight.Bullet;
            var theFighter:flight.Airplane;
            var myBulletsCount:number = this.myBullets.length;
            var enemyFighterCount:number = this.enemyFlights.length;
            var enemyBulletsCount:number = this.enemyBullets.length;
            //将需消失的子弹和飞机记录
            var delBullets:flight.Bullet[] = [];
            var delFighters:flight.Airplane[] = [];

            //我的子弹可以消灭敌机
            for(i = 0; i < myBulletsCount; i++) {
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
            for(i = 0; i < enemyBulletsCount; i++) {
                bullet = this.enemyBullets[i];
                if (flight.hitTest(this.myFlight, bullet)) {
                    this.myFlight.blood -= 1;
                    if (delBullets.indexOf(bullet) == -1) {
                        delBullets.push(bullet);
                    }
                }
            }

            //敌机的撞击可以消灭我
            for(i = 0; i < enemyFighterCount; i++) {
                theFighter = this.enemyFlights[i];
                if (flight.hitTest(this.myFlight,theFighter)) {
                    this.myFlight.blood -= 10;
                }
            }

            //判断是否死亡
            if (this.myFlight.blood <= 0) {
                this.gameStop();
            } else {
                while (delBullets.length > 0) {
                    bullet = delBullets.pop();
                    this.removeChild(bullet);
                    if (bullet.textureName == 'bullet') {
                        this.myBullets.splice(this.myBullets.indexOf(bullet), 1);
                    } else {
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
        }

        /**
         * 游戏结束
         */
        private gameStop():void {
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
            var bullet:flight.Bullet;
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
            var theFighter:flight.Airplane;
            while (this.enemyFlights.length > 0) {
                theFighter = this.enemyFlights.pop();
                theFighter.stopFire();
                theFighter.removeEventListener('createBullet', this.createBulletHandler, this);
                this.removeChild(theFighter);
                flight.Airplane.reclaim(theFighter, 'chaser');
            }

            //显示成绩
            this.scorePanel.showScore(this.myScore);
            this.scorePanel.x = (this.stageW - this.scorePanel.width)/2;
            this.scorePanel.y = 100;
            this.addChild(this.scorePanel);
        }
    }
}
