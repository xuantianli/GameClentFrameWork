/**
 * 单例对象
 */
export default class Singleton<T>{
    private static mInstance: any = null;
    public static GetInstance<T>(c: { new(): T }): T {
        return this.mInstance ||= new c();
    }

    /// <summary>
    /// 清理单例对象数据
    /// </summary>
    public clearData(): void {

    }
}