import GameConfig from "../../../../GameConfig";

module game {
    export class UiHelpManager {

        /***
         * @param itemID 道具ID
         * @param uiName 不同UI使用不同的后缀
         */
        public static getItemIconPathByID(itemID: number, uiName: string = "") {
            let iconpath = "";
            return iconpath;
        }

        public static getSoundPath(soundID: number): string {
            let path = "";
            return path;
        }

        /**
         * 用来适配
         * @param viewRootNode ui总节点
         * @param viewBgNode ui背景图节点
         */
        public static resetViewScale(viewRootNode: Laya.View, viewBgNode: Laya.Image = null) {

        }
    }
}