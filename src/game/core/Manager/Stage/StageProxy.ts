module game {
    /**
     * 舞台代理
     */
    export class StageProxyManager {
        /** instance*/
        private static mInstance: StageProxyManager;
        public static getInstance(): StageProxyManager {
            if (null == StageProxyManager.mInstance) {
                StageProxyManager.mInstance = new StageProxyManager();
            }
            return StageProxyManager.mInstance;
        }

        /** 游戏舞台*/
        private mStage: Laya.Stage;

        public constructor() {
        }

        /** 启动*/
        public setup(cusStage: Laya.Stage): void {
            this.mStage = cusStage;
        }

        /** 获取舞台引用*/
        public get stage(): Laya.Stage { return this.mStage; }
        /** 舞台宽*/
        public get width(): number { return this.mStage.width; }
        /** 舞台高*/
        public get height(): number { return this.mStage.height; }
        /** 帧频*/
        public get frameRate(): number { return 30; }

    }
}