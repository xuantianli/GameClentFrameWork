/**
 * number类型哈希结构
 */
class NumberMap<V>{

    /** @internal 元素数量 */
    private mkeyCount = 0;
    /** @internal map结构*/
    private mMap: { [key: number]: V } = Object.create(null);

    constructor(source?: [number, V][]) {
        if (source) {
            for (const [k, v] of source) {
                this.set(k, v);
            }
        }
    }

    /**清理*/
    clear() {
        this.mMap = Object.create(null);
        this.mkeyCount = 0;
    }

    /**删除*/
    delete(key: number): boolean {
        const had = this.has(key);
        delete this.mMap[key];
        if (had) {
            this.mkeyCount -= 1;
        }
        return had;
    }

    /**遍历*/
    forEach(callback: (value: V, key: number, map: NumberMap<V>) => void, thisArg?: any): void {
        for (const key in this.mMap) {
            callback.call(thisArg, this.mMap[key], key, this);
        }
    }

    /**获取 */
    get(key: number): V | undefined {
        return this.mMap[key];
    }

    /**检测是否存在*/
    has(key: number): boolean {
        return key in this.mMap;
    }

    /**设置*/
    set(key: number, value: V): this {
        const had = this.has(key);
        this.mMap[key] = value;
        if (!had) {
            this.mkeyCount += 1;
        }
        return this;
    }

    /**获取元素数量 */
    get size(): number {
        return this.mkeyCount;
    }

    /**获取valus*/
    values(): V[] {
        const values: V[] = [];
        for (const key in this.mMap) values.push(this.mMap[key]);
        return values;
    }

    /**获取健值数组*/
    keys(): number[] {
        const keys = [];
        for (const key in this.mMap) keys.push(+key);
        return keys as any;
    }
    /**获取健值对象 */
    entries(): [number, V][] {
        const entries = [];
        for (const key in this.mMap) entries.push([+key, this.mMap[key]]);
        return entries as any;
    }
}
