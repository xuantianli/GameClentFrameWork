
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
        private static _panel: Laya.Panel;
        // 尺寸大小
        private static readonly _size: Laya.Vector2 = new Laya.Vector2(300, 300);
        // 默认字体
        private static readonly _defaultFont: string = "Arial";
        // 默认字体大小
        private static readonly _defaultFontSize: number = 24;
        // 默认字体颜色
        private static readonly _defaultFontColor: string = "#ffffff";
        // 默认行间距
        private static readonly _defaultLeading: number = 10;

        private static _blackFilter: Laya.ColorFilter;

        private static _contents: string = "";

        private constructor() {

        }

        /**
         * 控制显示位置（stage中）
         * @param posX 
         * @param posY 
         */
        public static show(posX: number = 0, posY: number = 0, width: number = 300, height: number = 300) {
            DebugPanel._size.x = width;
            DebugPanel._size.y = height;

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

            DebugPanel._contents += str;
        }

        private static init() {
            if (DebugPanel.mInited) {
                return;
            }

            DebugPanel.mInited = true;

            DebugPanel.mDebugPanelRoot = new Laya.Sprite();
            DebugPanel.mDebugPanelRoot.width = DebugPanel._size.x;
            DebugPanel.mDebugPanelRoot.height = DebugPanel._size.y;
            DebugPanel.mDebugPanelRoot.zOrder = 99999;
            LayerManager.getInstance().alertLayer.addChild(DebugPanel.mDebugPanelRoot);

            DebugPanel.mMask = new Laya.Sprite();
            DebugPanel.mMask.graphics.drawRect(0, 0, DebugPanel._size.x, DebugPanel._size.y, "#000000");
            DebugPanel.mMask.width = DebugPanel._size.x;
            DebugPanel.mMask.height = DebugPanel._size.y;
            DebugPanel.mDebugPanelRoot.addChild(DebugPanel.mMask);
            let colorMatrix = [
                0, 0, 0, 0, 0,  		// R
                0, 0, 0, 0, 0, 			// G
                0, 0, 0, 0, 0,  		// B
                0, 0, 0, 0.5, 0, 		// A
            ];
            // 黑色滤镜
            DebugPanel._blackFilter = new Laya.ColorFilter(colorMatrix);
            DebugPanel.mMask.filters = [DebugPanel._blackFilter];

            DebugPanel.mHtmlDivElement = new Laya.HTMLDivElement();

            // 裁剪面板
            DebugPanel._panel = new Laya.Panel();
            DebugPanel._panel.size(DebugPanel._size.x, DebugPanel._size.y);
            DebugPanel._panel.vScrollBarSkin = "";	// 这里故意设置一个不存在的图片（不显示滚动条）
            DebugPanel.mDebugPanelRoot.addChild(DebugPanel._panel);

            // 设置富文本
            DebugPanel.mHtmlDivElement.size(DebugPanel._size.x, DebugPanel._size.y);
            DebugPanel.mHtmlDivElement.pos(0, 0);
            DebugPanel._panel.addChild(DebugPanel.mHtmlDivElement);

            // 设置默认的字体大小及颜色
            DebugPanel.mHtmlDivElement.style.font = DebugPanel._defaultFont;
            DebugPanel.mHtmlDivElement.style.fontSize = DebugPanel._defaultFontSize;
            DebugPanel.mHtmlDivElement.style.color = DebugPanel._defaultFontColor;
            DebugPanel.mHtmlDivElement.style.leading = DebugPanel._defaultLeading;
        }

        // 刷新滚动内容
        private static updatePanel() {
            // 刷新滚动内容
            DebugPanel._panel.refresh();
            // 滚动至最新的一行
            DebugPanel._panel.vScrollBar.value = DebugPanel.mHtmlDivElement.contextHeight - DebugPanel._size.y;
        }

        private static setSize(width: number, height: number) {
            DebugPanel._size.x = width;
            DebugPanel._size.y = height;

            if (DebugPanel.mDebugPanelRoot) {
                DebugPanel.mDebugPanelRoot.width = DebugPanel._size.x;
                DebugPanel.mDebugPanelRoot.height = DebugPanel._size.y;
            }

            if (DebugPanel.mMask) {
                DebugPanel.mMask.graphics.clear();
                DebugPanel.mMask.graphics.drawRect(0, 0, DebugPanel._size.x, DebugPanel._size.y, "#000000");
                DebugPanel.mMask.width = DebugPanel._size.x;
                DebugPanel.mMask.height = DebugPanel._size.y;
                DebugPanel.mMask.filters = [DebugPanel._blackFilter];
            }

            if (DebugPanel._panel) {
                DebugPanel._panel.size(DebugPanel._size.x, DebugPanel._size.y);
            }

            if (DebugPanel.mHtmlDivElement) {
                DebugPanel.mHtmlDivElement.size(DebugPanel._size.x, DebugPanel._size.y);
                DebugPanel.mHtmlDivElement.innerHTML = DebugPanel._contents;
            }

            DebugPanel.updatePanel();
        }
    }
}