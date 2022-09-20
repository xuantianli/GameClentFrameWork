/**Event事件类*/
module game {

    export class EventManager {
        private static instance: EventManager;
        static getInstance() {
            if (EventManager.instance == null) {
                EventManager.instance = new EventManager();
            }
            return EventManager.instance;
        }


        private event_listener: Object;
        constructor() {
            this.event_listener = {};
        }

        public clearAllEvent() {
            for (let event_name in this.event_listener) {
                if (this.event_listener[event_name] != null) {
                    this.event_listener[event_name].splice(0, this.event_listener[event_name].length);
                }
            }
        }


        /**
         *
         * @param event_name 事件索引
         * @param handler   事件回调
         * @param isOneEvent 是否是单向事件(多处注册,仅最后注册的地方可以收到事件)
         */
        public register(event_name: string, handler: (eventData: any) => void, isOneEvent: boolean = false): number {
            if (this.event_listener[event_name] == null) {
                this.event_listener[event_name] = [];
            }
            if (isOneEvent == true) {
                this.event_listener[event_name][0] = handler;
            } else {
                this.event_listener[event_name].push(handler);
            }
            return this.event_listener[event_name].length - 1;
        }
        /**
         *
         * @param event_name 事件索引
         * @param eventData 事件参数
         */
        public dispatch(event_name: string, eventData?: any): void {
            if (this.event_listener[event_name] != null) {
                this.event_listener[event_name].forEach(element => {
                    if (element != null) {
                        element(eventData);
                    }
                });
            }
        }

        /**
         *
         * @param event_name 事件索引
         * @param handler   事件回调
         * @param isOneEvent 是否是单向事件(多处注册,仅最后注册的地方可以收到事件)
         */
        public eventRegister(event_name: string, handler: (eventData: any) => void, isOneEvent: boolean = false): number {
            if (this.event_listener[event_name] == null) {
                this.event_listener[event_name] = [];
            }
            if (isOneEvent == true) {
                this.event_listener[event_name][0] = handler;
            } else {
                this.event_listener[event_name].push(handler);
            }
            return this.event_listener[event_name].length - 1;
        }

        public eventDispatch(event_name: string, eventData: any = null): void {
            if (this.event_listener[event_name] != null) {
                this.event_listener[event_name].forEach(element => {
                    if (element != null) {
                        element(eventData);
                    }
                });
            }
        }

        /**
         *
         * @param event_name 事件注册总索引
         * @param eventIndex 注册事件时返回的相关事件在事件数组中的索引
         * @param handler    注册事件时的回调函数引用
         */
        public eventUnregister(event_name: string, eventIndex?: number, handler?: (eventData: any) => void): boolean {
            if (this.event_listener[event_name] != null) {
                if (handler != null) {
                    for (let i = 0; i < this.event_listener[event_name].length; i++) {
                        if (this.event_listener[event_name][i] == handler) {
                            this.event_listener[event_name].splice(i, 1);
                            return true;
                        }
                    }
                } else if (eventIndex != null) {
                    for (let i = 0; i < this.event_listener[event_name].length; i++) {
                        if (i == eventIndex) {
                            this.event_listener[event_name].splice(i, 1);
                            return true;
                        }
                    }
                } else {
                    this.event_listener[event_name].splice(0, this.event_listener[event_name].length);
                    return true;
                }
            }
            return false;
        }
    }
}