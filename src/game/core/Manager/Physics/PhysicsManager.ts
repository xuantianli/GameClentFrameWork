
module game {

    // 用于物理碰撞的形状
    export enum PhysicsShape {
        // 圆形，数据格式：[x: 圆心x坐标, y: 圆心y坐标, radius: 半径]
        Circle,
        // 矩形，数据格式：[x: 原点x, y: 原点y, width: 宽度, height: 高度]
        Rectangle,
        // 正多边形，数据格式：[x: 圆心x, y: 圆心y, sides: 边数, radius: 半径]
        RegularPolygon,
        // 任意多边形（包括凹多边形），数据格式：[每个点的坐标...（严格按照顺时针排序）]，例如：[0, 100, 50, 0, 100, 100]
        Polygon,
    }

    export class PhysicsManager {
        private static mInstance: PhysicsManager = null;
        public static getInstance() {
            if (PhysicsManager.mInstance == null) {
                PhysicsManager.mInstance = new PhysicsManager();
            }
            return PhysicsManager.mInstance;
        }
        /**是否初始化物理引擎 */
        private mInited: boolean = false;
        /**物理引擎*/
        private mMatter: any = Laya.Browser.window.Matter;
        /**Laya渲染模式 */
        private mLayaRender: any = Laya.Browser.window.LayaRender;
        /**引擎*/
        private mEngine: any;
        /**放置物理世界的根*/
        private mPhysicsWorld: Laya.Sprite;
        /**是否需要绘制刚体的碰撞区域 */
        private mDrawWireframes: boolean = true;

        constructor() {
        }

        /**
         * 初始化物理引擎
         * @param physicsWorld 放置物理世界的根sprite
         * @param worldWidth 世界宽度
         * @param worldHeight 世界高度
         * @param drawWireframes 是否需要绘制刚体的碰撞区域
         */
        public initPhysicsWorld(physicsWorld: Laya.Sprite, worldWidth: number, worldHeight: number, drawWireframes: boolean) {
            if (this.mInited) {
                return;
            }
            this.mInited = true;
            this.mDrawWireframes = drawWireframes;

            this.mPhysicsWorld = physicsWorld;

            // 初始化物理引擎
            this.mEngine = this.mMatter.Engine.create({ enableSleeping: false });
            this.mMatter.Engine.run(this.mEngine);

            this.mEngine.world.gravity.y = 0;
            this.mEngine.world.friction = 0;

            let render = this.mLayaRender.create({
                engine: this.mEngine,
                container: this.mPhysicsWorld,
                width: worldWidth,
                height: worldHeight,
                options: {
                    wireframes: this.mDrawWireframes,
                    // showAngleIndicator: true,
                }
            });
            this.mLayaRender.run(render);

            // 监听碰撞
            this.mMatter.Events.on(this.mEngine, 'collisionStart', this.onCollisionStart);
            this.mMatter.Events.on(this.mEngine, 'collisionEnd', this.onCollisionEnd);
            // this.Matter.Events.on(this.engine, 'collisionActive', this.onCollisionActive);
        }
        /**
         * 转换为本地坐标
         * @param globalPoint 
         * @returns 
         */
        public positionInPhysicsWorld(globalPoint: Laya.Point): Laya.Point {
            return this.mPhysicsWorld.globalToLocal(globalPoint);
        }

        /**
         * 创建圆形刚体Body
         * @param x 
         * @param y 
         * @param radius 半径
         * @param options 
         * @returns 
         */
        public createBodyCircle(x: number, y: number, radius: number, options = {}) {
            return this.mMatter.Bodies.circle(x, y, radius, options);
        }

        /**
         * 创建矩形刚体Body
         * @param x 起点x
         * @param y 起点y
         * @param width 刚体宽
         * @param height 刚体高
         * @param options 
         * @returns 
         */
        public createBodyRectangle(x: number, y: number, width: number, height: number, options = {}) {
            return this.mMatter.Bodies.rectangle(x, y, width, height, options);
        }

        /**
         * 创建正多边形刚体Body
         * @param x 起点x
         * @param y 起点y
         * @param sides 面数
         * @param radius 半径
         * @param options 可选项
         * @returns 
         */
        public createBodyRegularPolygon(x: number, y: number, sides: number, radius: number, options = {}) {
            return this.mMatter.Bodies.polygon(x, y, sides, radius, options);
        }

        /**
         * 创建梯形刚体Body
         * @param x 起点x
         * @param y 起点y
         * @param width 刚体宽
         * @param height 刚体高
         * @param slope 倾斜
         * @param options 可选项
         * @returns 
         */
        public createBodyTrapezoid(x: number, y: number, width: number, height: number, slope: number, options = {}) {
            return this.mMatter.Bodies.trapezoid(x, y, width, height, slope, options);
        }

        /**
         * 创建任意多边形刚体Body
         * @param vPoints x,y
         * @param options 
         * @returns 
         */
        public createBodyFromVertices(vPoints: GPoint[], options = {}) {

            let vres = [];
            vPoints.forEach(element => {
                vres.push(element.x, element.y);
            });
            let verticesStr = vres.join(' ');
            options['vertices'] = this.mMatter.Vertices.fromPath(verticesStr);
            return this.mMatter.Body.create(options);
        }

        /**将Body加入物理世界 */
        public addBody(body: any) {
            this.mMatter.World.add(this.mEngine.world, body);
        }

        /**移除物理引擎*/
        public remove(object: any) {
            this.mMatter.World.remove(this.mEngine.world, object);
        }

        public clear() {
            let allBodies = this.mMatter.Composite.allBodies(this.mEngine.world);
            allBodies.forEach(body => {
                if (body.layaSprite) {
                    body.layaSprite.destroy();
                }
            });
            this.mMatter.World.clear(this.mEngine.world, false);
        }
        /**碰撞开始*/
        private onCollisionStart(event: any) {
            let pairs = event.pairs;
            for (let i = 0; i < pairs.length; i++) {
                let pair = pairs[i];
                let layaSprite = pair.bodyA.layaSprite;
                if (layaSprite)
                    pair.bodyA.layaSprite.onCollisionStart(pair.bodyB.layaSprite);
            }
        }
        /**碰撞结束 */
        private onCollisionEnd(event: any) {
            let pairs = event.pairs;
            for (let i = 0; i < pairs.length; i++) {
                let pair = pairs[i];
                let layaSprite = pair.bodyA.layaSprite;
                if (layaSprite)
                    pair.bodyA.layaSprite.onCollisionEnd(pair.bodyB.layaSprite);
            }
        }

        get drawWireframes(): boolean {
            return this.mDrawWireframes;
        }

        set drawWireframes(flag: boolean) {
            this.mDrawWireframes = flag;
        }

        // private onCollisionActive(event: any) {
        // 	let pairs = event.pairs;
        // 	for (let i = 0; i < pairs.length; i++) {
        // 		let pair = pairs[i];
        // 		let layaSprite = pair.bodyA.layaSprite;
        // 		if (layaSprite)
        // 			pair.bodyA.layaSprite.onCollisionActive(pair.bodyB.layaSprite);
        // 	}
        // }
    }
}