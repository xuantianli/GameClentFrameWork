
module game {
    /**
     * 打印面板
     */
    export class DebugPanel {
        private static mDebugPanelRoot: Laya.Sprite;
        private static mMask: Laya.Sprite;
        private static mInited: boolean = false;
        private static mHtmlDivElement: Laya.HTMLDivElement;
        // 用于裁剪和滚动的面板
        private static mPanel: Laya.Panel;
        // 尺寸大小
        private static readonly mSize: Laya.Vector2 = new Laya.Vector2(300, 300);
        // 默认字体
        private static readonly mDefaultFont: string = "Arial";
        // 默认字体大小
        private static readonly mDefaultFontSize: number = 24;
        // 默认字体颜色
        private static readonly mDefaultFontColor: string = "#ffffff";
        // 默认行间距
        private static readonly mDefaultLeading: number = 10;

        private static mBlackFilter: Laya.ColorFilter;

        private static mContents: string = "";

        private constructor() {

        }

        /**
         * 控制显示位置（stage中）
         * @param posX 
         * @param posY 
         */
        public static show(posX: number = 0, posY: number = 0, width: number = 300, height: number = 300) {
            DebugPanel.mSize.x = width;
            DebugPanel.mSize.y = height;

            DebugPanel.init();
            DebugPanel.mDebugPanelRoot.pos(posX, posY);
            DebugPanel.setSize(width, height);
        }

        /**
         * 打印信息，带换行
         * @param str 文本
         */
        public static println(str: string) {
            DebugPanel.print(str);
            DebugPanel.print("<br/>");
        }

        /**
         * 打印信息，不带换行
         * @param str 文本
         */
        public static print(str: string) {
            // DebugPanel._htmlDivElement.appendHTML(str);
            DebugPanel.updatePanel();

            DebugPanel.mContents += str;
        }

        private static init() {
            if (DebugPanel.mInited) {
                return;
            }

            DebugPanel.mInited = true;

            DebugPanel.mDebugPanelRoot = new Laya.Sprite();
            DebugPanel.mDebugPanelRoot.width = DebugPanel.mSize.x;
            DebugPanel.mDebugPanelRoot.height = DebugPanel.mSize.y;
            DebugPanel.mDebugPanelRoot.zOrder = 99999;
            LayerManager.getInstance().alertLayer.addChild(DebugPanel.mDebugPanelRoot);

            DebugPanel.mMask = new Laya.Sprite();
            DebugPanel.mMask.graphics.drawRect(0, 0, DebugPanel.mSize.x, DebugPanel.mSize.y, "#000000");
            DebugPanel.mMask.width = DebugPanel.mSize.x;
            DebugPanel.mMask.height = DebugPanel.mSize.y;
            DebugPanel.mDebugPanelRoot.addChild(DebugPanel.mMask);
            let colorMatrix = [
                0, 0, 0, 0, 0,  		// R
                0, 0, 0, 0, 0, 			// G
                0, 0, 0, 0, 0,  		// B
                0, 0, 0, 0.5, 0, 		// A
            ];
            // 黑色滤镜
            DebugPanel.mBlackFilter = new Laya.ColorFilter(colorMatrix);
            DebugPanel.mMask.filters = [DebugPanel.mBlackFilter];

            DebugPanel.mHtmlDivElement = new Laya.HTMLDivElement();

            // 裁剪面板
            DebugPanel.mPanel = new Laya.Panel();
            DebugPanel.mPanel.size(DebugPanel.mSize.x, DebugPanel.mSize.y);
            DebugPanel.mPanel.vScrollBarSkin = "";	// 这里故意设置一个不存在的图片（不显示滚动条）
            DebugPanel.mDebugPanelRoot.addChild(DebugPanel.mPanel);

            // 设置富文本
            DebugPanel.mHtmlDivElement.size(DebugPanel.mSize.x, DebugPanel.mSize.y);
            DebugPanel.mHtmlDivElement.pos(0, 0);
            DebugPanel.mPanel.addChild(DebugPanel.mHtmlDivElement);

            // 设置默认的字体大小及颜色
            DebugPanel.mHtmlDivElement.style.font = DebugPanel.mDefaultFont;
            DebugPanel.mHtmlDivElement.style.fontSize = DebugPanel.mDefaultFontSize;
            DebugPanel.mHtmlDivElement.style.color = DebugPanel.mDefaultFontColor;
            DebugPanel.mHtmlDivElement.style.leading = DebugPanel.mDefaultLeading;
        }

        // 刷新滚动内容
        private static updatePanel() {
            // 刷新滚动内容
            DebugPanel.mPanel.refresh();
            // 滚动至最新的一行
            DebugPanel.mPanel.vScrollBar.value = DebugPanel.mHtmlDivElement.contextHeight - DebugPanel.mSize.y;
        }

        private static setSize(width: number, height: number) {
            DebugPanel.mSize.x = width;
            DebugPanel.mSize.y = height;

            if (DebugPanel.mDebugPanelRoot) {
                DebugPanel.mDebugPanelRoot.width = DebugPanel.mSize.x;
                DebugPanel.mDebugPanelRoot.height = DebugPanel.mSize.y;
            }

            if (DebugPanel.mMask) {
                DebugPanel.mMask.graphics.clear();
                DebugPanel.mMask.graphics.drawRect(0, 0, DebugPanel.mSize.x, DebugPanel.mSize.y, "#000000");
                DebugPanel.mMask.width = DebugPanel.mSize.x;
                DebugPanel.mMask.height = DebugPanel.mSize.y;
                DebugPanel.mMask.filters = [DebugPanel.mBlackFilter];
            }

            if (DebugPanel.mPanel) {
                DebugPanel.mPanel.size(DebugPanel.mSize.x, DebugPanel.mSize.y);
            }

            if (DebugPanel.mHtmlDivElement) {
                DebugPanel.mHtmlDivElement.size(DebugPanel.mSize.x, DebugPanel.mSize.y);
                DebugPanel.mHtmlDivElement.innerHTML = DebugPanel.mContents;
            }

            DebugPanel.updatePanel();
        }
    }
}