import Singleton from "../../../utils/Singleton";

module game {
    /**
     * 配置表管理类
     */
    export class ConfigManager {

        static mInstance: ConfigManager;
        static getInstance() {
            if (ConfigManager.mInstance == null) {
                ConfigManager.mInstance = new ConfigManager();
            }
            return ConfigManager.mInstance;
        }
        /**
         * 初始化配置表数据
         */
        public initConfig(allConfigs: any) {

        }
    }

}