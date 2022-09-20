/**
 * 长链接
 */
class SocketClient {
    private socket: Laya.Socket;

    private static instance: SocketClient

    public static getInstance(): SocketClient {
        if (SocketClient.instance == undefined) {
            let obj = new SocketClient();
            if (obj != undefined) {
                SocketClient.instance = obj;
            }
        }
        return SocketClient.instance;
    }
    public connect(): void {
        if (this.socket != undefined) return
        this.socket = new Laya.Socket();

        this.socket.connectByUrl("");

        this.socket.on(Laya.Event.OPEN, this, this.onSocketOpen);
        this.socket.on(Laya.Event.CLOSE, this, this.onSocketClose);
        this.socket.on(Laya.Event.MESSAGE, this, this.onMessageReveived);
        this.socket.on(Laya.Event.ERROR, this, this.onConnectError);
    }

    private onSocketOpen(): void {
        console.log("Connected");
    }

    private onSocketClose(): void {
        console.log("Socket closed");
        this.socket = undefined
    }

    private onMessageReveived(message: any): void {
        console.log("Message from server:");
        if (typeof message == "string") {
            console.log(message);
        }
        else if (message instanceof ArrayBuffer) {
            console.log(new Laya.Byte(message).readUTFBytes());
        }
        this.socket.input.clear();
    }

    private onConnectError(e: Event): void {
        console.log("error");
    }

    public send(msg: string) {
        this.socket.send(msg)
    }

    public close() {
        this.socket.close();
    }
}
