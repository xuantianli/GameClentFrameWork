/**UI观察者事件*/
module game {
    export interface UIObserver {
        /**更新属性UI */
        updateGameUI(extendInfo?: any): void;
    }
    export class UIEventManager {
        private static instance: UIEventManager;
        static getInstance() {
            if (UIEventManager.instance == null) {
                UIEventManager.instance = new UIEventManager();
            }
            return UIEventManager.instance;
        }
        /**观察者容器 */
        private _Observers: StringMap<UIObserver[]>;
        constructor() {
            this._Observers = new StringMap<UIObserver[]>();
        }

        /**增加观察者*/
        public addObserver(uiName: string, observer: UIObserver): void {
            let ObserverMap = this._Observers.get(uiName);
            if (ObserverMap == null) {
                ObserverMap = [];
                this._Observers.set(uiName, ObserverMap);
            }
            ObserverMap.push(observer);
        }
        /**移除观察者 */
        public removeObserver(uiName: string, observer: UIObserver): void {
            let ObserverMap = this._Observers.get(uiName);
            if (ObserverMap) {
                for (let i = 0; i < ObserverMap.length; i++) {
                    if (ObserverMap[i] == observer) {
                        ObserverMap.splice(i, 1);
                        break;
                    }
                }
                if (ObserverMap.length == 0) {
                    this._Observers.delete(uiName);
                }
            }
        }
        /**广播所有的事件 */
        public broadcastAllUIEvent(extendInfo?: any) {
            let allUIName = this._Observers.keys();
            if (allUIName) {
                allUIName.forEach((name) => {
                    let ObserverMap = this._Observers.get(name);
                    if (ObserverMap) {
                        ObserverMap.forEach((uiObserver) => {
                            uiObserver.updateGameUI(extendInfo);
                        });
                    }
                });
            }
        }
        /**广播单一的事件 */
        public broadcastUIEvent(uiNames: string[], extendInfo?: any) {
            if (uiNames) {
                uiNames.forEach((name) => {
                    let ObserverMap = this._Observers.get(name);
                    if (ObserverMap) {
                        ObserverMap.forEach((uiObserver) => {
                            uiObserver.updateGameUI(extendInfo);
                        });
                    }
                });
            }
        }
    }
}