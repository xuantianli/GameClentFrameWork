class LayerManager {
    /**
     * instance
     */
    private static mInstance: LayerManager;
    public static getInstance(): LayerManager {
        if (null == LayerManager.mInstance) {
            LayerManager.mInstance = new LayerManager();
        }
        return LayerManager.mInstance;
    }

    /**
     * 舞台引用
     */
    private stage: Laya.Stage;
    /**
     * 场景层
     */
    public sceneLayer: Laya.Sprite;
    /**
     * 主UI层
     */
    public mainUiLayer: Laya.Sprite;
    /**
     * 弹出框层
     */
    public popLayer: Laya.Sprite;
    /**
     * 二级弹窗层
     */
    public subPopLayer: Laya.Sprite;
    /**
     * loading层
     */
    public loadingLayer: Laya.Sprite;
    /**
     * 提示框层
     */
    public alertLayer: Laya.Sprite;
    /**
     * 顶层
     */
    public topLayer: Laya.Sprite;

    /**
     * 启动
     */
    public setup(tStage: Laya.Stage): void {
        this.stage = tStage;
        this.configChildren();
    }

    /**
     * 初始化
     */
    private configChildren(): void {
        this.sceneLayer = new Laya.Sprite();
        this.sceneLayer.mouseEnabled = false;
        this.stage.addChild(this.sceneLayer);

        this.mainUiLayer = new Laya.Sprite();
        this.stage.addChild(this.mainUiLayer);

        this.popLayer = new Laya.Sprite();
        this.stage.addChild(this.popLayer);

        this.subPopLayer = new Laya.Sprite();
        this.stage.addChild(this.subPopLayer);

        this.loadingLayer = new Laya.Sprite();
        this.stage.addChild(this.loadingLayer);

        this.alertLayer = new Laya.Sprite();
        this.stage.addChild(this.alertLayer);

        this.topLayer = new Laya.Sprite();
        this.stage.addChild(this.topLayer);
    }
}