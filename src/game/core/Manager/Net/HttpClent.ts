module game {
    /**
     * 模拟返回参数
     */
    export enum EnumNetCode {
        /**
         * 网络问题
         */
        Net_Error = -1,
        /**
         * 登录成功
         */
        LOGIN_SUCCESS = 2001,
        /**
         *  用户名不存在
         */
        LOGIN_USERNAME_NOT_EXIST = 2002,
        /**
         * 密码错误
         */
        LOGIN_PASSWORD_ERROR = 2003,
        /**
         * 登录失败,账号已锁
         */
        LOGIN_FAILD_INACTIVE = 2004,
        /**
        * token过期 
        * */
        TOKEN_EXPIRED = 2005,
        /**
         * token无效
         */
        TOKEN_INVALID = 2006,
        /**
         * 操作成功 
         */
        QUERY_SUCCESS = 3000,
        /**
         * 查询失败
         */
        QUERY_FAILED = 3001,
    }
    /**
     *  CodeMode类型
     */
    export enum EnumDataEncodeMode {
        NoEncode = 0,
        EncodeBase64 = 1,
        EncodeAes = 2
    }
    /**短链接*/
    export class HttpClient {
        private static mInstance: HttpClient
        public static getInstance(): HttpClient {
            if (HttpClient.mInstance == null) {
                let obj = new HttpClient();
                if (obj != null) {
                    HttpClient.mInstance = obj;
                }
            }
            return HttpClient.mInstance;
        }
        /**aes加密key */
        private mAES_KEY: string;
        /**服务器地址 */
        private mServer_addr: string;
        /**浏览器唯一标识 */
        private mDeviceID: string;
        /**token */
        private mClientToken: string;


        private constructor() {
            this.mServer_addr = "http://124.71.142.71:10000/?addr=121.36.210.172:8004&serverid=3001";
            this.mAES_KEY = "5de7e29919fad4d5";
            this.mDeviceID = UtilsGetFingerprintID();
            this.mClientToken = "";
        }
        public get deviceID(): string {
            return this.mDeviceID;
        }
        public set clientToken(token: string) {
            this.mClientToken = UtilsBase64Encode(token);
        }

        /**编码 */
        public encodeData(datamode: EnumDataEncodeMode, data: any): any {
            let result: any;
            switch (datamode) {
                case EnumDataEncodeMode.EncodeBase64: {
                    result = UtilsBase64Encode(JSON.stringify(data));
                } break;
                case EnumDataEncodeMode.EncodeAes: {
                    result = UtilsEncryptAES(JSON.stringify(data), this.mAES_KEY);
                } break;
                default: {
                    result = data;
                } break;
            }
            return result;
        }
        /**数据解码 */
        public decodeData(datamode: EnumDataEncodeMode, data: any): any {

            console.log("datamode   " + datamode);
            console.log("data   " + JSON.stringify(data));

            let result: any;
            switch (datamode) {
                case EnumDataEncodeMode.EncodeBase64: {
                    result = UtilsBase64Decode(JSON.stringify(data));
                } break;
                case EnumDataEncodeMode.EncodeAes: {
                    result = UtilsDecryptAES(JSON.stringify(data), this.mAES_KEY);
                } break;
                default: {
                    result = data;
                } break;
            }
            return result;
        }
        /**
         *http请求
         * @param apirouter 接口标识
         * @param datamode 加密说明 0-不加密 1-base64解密 2-aes加密
         * @param obj 请求数据json格式
         * @param cb
         */
        public httpReq(apirouter: string, obj: any, cb: (errorcode: number, retjson: any) => void, islogin: boolean = false): void {

            if (obj['d'] && obj['m']) {
                obj['d'] = this.encodeData(obj['m'], obj['d']);
            }
            let httpRequest = new Laya.HttpRequest();
            httpRequest.once(Laya.Event.COMPLETE, this, (result: string) => {

                console.log("result   " + result);

                let data = JSON.parse(result);
                let resultCode = data['c'];
                data['d'] = this.decodeData(data['m'], data['d']);
                if (resultCode == EnumNetCode.TOKEN_EXPIRED || resultCode == EnumNetCode.TOKEN_INVALID) {
                    //token过期失效处理
                }
                cb(resultCode, data);
            });
            httpRequest.once(Laya.Event.ERROR, this, (result: string) => {

                logger.Debug("net error:" + result);

                //网络连接失败处理
                cb(EnumNetCode.Net_Error, null)
            });
            //设置超时时间
            httpRequest.http.timeout = 10000;

            if (islogin == true) {
                httpRequest.send(this.mServer_addr + apirouter, JSON.stringify(obj), "post");
            } else {
                if (this.mClientToken != "") {
                    let header = [];
                    header[0] = 'Authorization';
                    header[1] = "Basic " + this.mClientToken;
                    httpRequest.send(this.mServer_addr + apirouter, JSON.stringify(obj), "post", "text", header);
                }
            }
        }

    }
}

