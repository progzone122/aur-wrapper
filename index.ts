import AurWebRpc from "./rpc";
import AurWebRss from "./rss";

export default class AurWebWrapper {
    public readonly rpc: AurWebRpc;
    public readonly rss: AurWebRss;

    public readonly baseUrl: string;
    public readonly proxy: boolean;

    constructor({ baseUrl = "https://aur.archlinux.org", proxy = false }) {
        this.baseUrl = baseUrl;
        this.proxy = proxy;

        this.rpc = new AurWebRpc(this);
        this.rss = new AurWebRss(this);
    }
}