module logger {
    /**
     *打印信息
     */
    export enum LogTag {
        AttackLog = 0x000001,//数值计算log
        OtherLog = 0x000002,//其他log
        AllLog = 0xFFFFFF
    }

    function println(content: string = "") {
        console.debug("###Game### - " + content);
    }

    const showTag = LogTag.OtherLog;

    /**打印输出 */
    export function Debug(content: string = "", tag: LogTag = LogTag.OtherLog) {
        if (showTag & tag) {
            println(content);
        }
    }
}