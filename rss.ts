import axios from "axios";

let XMLParser: any;

if (typeof window === "undefined") {
    import("fast-xml-parser").then(module => {
        XMLParser = module.XMLParser;
    });
}

export default class AurWebRss {
    private baseUrl: string;

    constructor(config: any) {
        if (config.proxy) {
            this.baseUrl = `https://corsproxy.io/?url=${config.baseUrl}`;
        } else {
            this.baseUrl = config.baseUrl;
        }
    }

    private async request(args: string = ""): Promise<string> {
        const resp = await axios.get(`${this.baseUrl}/rss${args}`, {
            responseType: "text"
        });
        return resp.data;
    }

    private parseRssData(rssData: string) {
        if (typeof window === "undefined") {
            // Серверная сторона (Node.js / Bun)
            if (!XMLParser) {
                throw new Error("XMLParser is not loaded yet. Ensure it's available before calling this function.");
            }
            const parser = new XMLParser();
            const xml = parser.parse(rssData);
            return xml.rss?.channel?.item ?? [];
        } else {
            // Клиентская сторона (в браузере)
            const parser = new DOMParser();
            const xml = parser.parseFromString(rssData, "application/xml");
            return Array.from(xml.querySelectorAll("item")).map(item => ({
                title: item.querySelector("title")?.textContent || null,
                link: item.querySelector("link")?.textContent || "#",
                description: item.querySelector("description")?.textContent || null,
                pubDate: item.querySelector("pubDate")?.textContent || null,
            }));
        }
    }

    async getLatestPackages() {
        const rssData = await this.request();
        return this.parseRssData(rssData);
    }
}