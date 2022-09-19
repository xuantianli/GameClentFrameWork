module game {
    export interface IResettable {
        // 回收时被调用重置
        recycleReset(): void;
        // 对象池中缓存不足时，需要提供更多的对象
        requiresMore(): any[];
        // 必须调用摧毁
        mustDestroy(): void;
    }

    function isIResettable(object: any): object is IResettable {
        return 'recycleReset' in object && 'requiresMore' in object && 'mustDestroy' in object;
    }
    /**
     * 对象池
     */
    export class ObjectPool<T> {
        /**池子容器 */
        private mPool: Array<T>;
        /** 经过一段时间，没有取过的话，就进行减半操作，以空出内存*/
        private static readonly mReduceDuraion: number = 10 * 1000;		// 单位：ms
        /**回收时间 */
        private mReduceTimer: number = ObjectPool.mReduceDuraion;
        /**最后回收时间*/
        private mLastUpdateTime: number = 0;

        constructor() {
            this.mPool = new Array<T>();

            this.mLastUpdateTime = Laya.Browser.now();
            this.mReduceTimer = ObjectPool.mReduceDuraion;

            Laya.timer.frameLoop(1, this, this.frameUpdate);
        }

        private frameUpdate() {
            let _now = Laya.Browser.now();
            let _delta = _now - this.mLastUpdateTime;
            this.mLastUpdateTime = _now;

            // 定时削减缓存，以释放内存
            this.mReduceTimer -= _delta;
            if (this.mReduceTimer < 0) {
                this.mReduceTimer = ObjectPool.mReduceDuraion;
                this.reduceCache();
            }
        }

        /**
         * 填充缓冲对象
         * @param objs 
         */
        fill(objs: T[]) {
            this.mPool = this.mPool.concat(objs);
        }

        /**
         * 从对象池中获取一个对象
         */
        get(debugInfo: string = ""): T {
            this.resetReduceTimer();

            if (this.mPool.length > 0) {
                if (this.mPool.length == 1) {
                    let _obj = this.mPool[0];
                    if (isIResettable(_obj)) {
                        this.fill(_obj.requiresMore());
                    }
                }
                let _ret = this.mPool.splice(0, 1)[0];
                return _ret;
            } else {
                throw Error(`请先填充对象池`);
            }
            return null;
        }

        /**
         * 清理对象池
         */
        clear(): void {
            if (this.mPool) {
                while (this.mPool.length > 0) {
                    let _obj = this.mPool.pop();
                    if (isIResettable(_obj)) {
                        _obj.mustDestroy();
                    }
                }
            }
        }

        /**
         * 回收一个对象
         * @param obj 
         */
        recycle(obj: T): void {
            if (isIResettable(obj)) {
                obj.recycleReset();
            } else {
                throw Error(`加入对象池前，必须实现IResettable接口`);
            }
            this.mPool.push(obj);
        }

        /**
         * 获取对象池中的数量
         */
        get length(): number {
            return this.mPool.length;
        }

        /**
         * 重置最后回收时间
         */
        private resetReduceTimer() {
            this.mReduceTimer = ObjectPool.mReduceDuraion;
        }

        /**
         * 清除缓存
         */
        private reduceCache() {
            if (this.mPool) {
                let _reduce = Math.floor(this.mPool.length / 2);
                while (_reduce > 0 && this.mPool.length > 1) {
                    let obj = this.mPool.pop();
                    if (isIResettable(obj)) {
                        obj.mustDestroy();
                    }
                    _reduce--;
                }
            }
        }
    }
}