/**
 * 规范实例具体配置表类
 */
module game {
    export class PD_Test {
        /**测试ID */
        DialogID: number;

        public initConfig(config: PD_Test) {
            this.DialogID = config.DialogID;
        }
    }
}
