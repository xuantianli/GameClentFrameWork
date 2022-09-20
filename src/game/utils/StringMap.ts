/**StringMap*/
class NarrowStringMap<K extends string, V> {

    /** @internal */
    private mKeyCount = 0;
    /** @internal */
    private mMap: { [key: string]: V } = Object.create(null);

    constructor(source?: [K, V][]) {
        if (source) {
            for (const [k, v] of source) {
                this.set(k, v);
            }
        }
    }
    /**清理*/
    clear() {
        this.mMap = Object.create(null);
        this.mKeyCount = 0;
    }
    /**删除*/
    delete(key: K): boolean {
        const had = this.has(key);
        delete this.mMap[key];
        if (had) {
            this.mKeyCount -= 1;
        }
        return had;
    }
    /**遍历*/
    forEach(callback: (value: V, key: K, map: NarrowStringMap<K, V>) => void, thisArg?: any): void {
        for (const key in this.mMap) {
            callback.call(thisArg, this.mMap[key], key, this);
        }
    }

    get(key: K): V | undefined {
        return this.mMap[key];
    }

    has(key: K): boolean {
        return key in this.mMap;
    }
    /**设置*/
    set(key: K, value: V): this {
        const had = this.has(key);
        this.mMap[key] = value;
        if (!had) {
            this.mKeyCount += 1;
        }
        return this;
    }
    /**获取长度 */
    get size(): number {
        return this.mKeyCount;
    }
    /**获取valus*/
    values(): V[] {
        const values: V[] = [];
        for (const key in this.mMap) values.push(this.mMap[key]);
        return values;
    }
    /**获取健值数组*/
    keys(): K[] {
        const keys = [];
        for (const key in this.mMap) keys.push(key);
        return keys as any;
    }
    /**获取健值对象 */
    entries(): [K, V][] {
        const entries = [];
        for (const key in this.mMap) entries.push([key, this.mMap[key]]);
        return entries as any;
    }
}

class StringMap<V> extends NarrowStringMap<string, V> {
}