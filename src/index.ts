import puppeteer, { Browser, BrowserContext } from "puppeteer";
import { ComputeModule } from "@palantir/compute-module";
import { Type } from "@sinclair/typebox";

async function main(): Promise<void> {
    const computeModule = new ComputeModule({
        logger: console,
        isAutoRegistered: false,
        definitions: {
            getWebpage: {
                input: Type.Object({
                    url: Type.String({ format: "uri" }),
                }),
                output: Type.String(),
            },
            hello: {
                input: Type.Object({
                    name: Type.String(),
                }),
                output: Type.String(),
            }
        },
    });

    let cachedBrowser: Promise<Browser> | undefined;
    computeModule.register("getWebpage", async ({ url }) => {
        console.log(`Fetching ${url}`);
        let context: BrowserContext | undefined;
        try {
            if (!cachedBrowser) {
                cachedBrowser = puppeteer.launch();
            }
            const browser = await cachedBrowser;

            context = await browser.createBrowserContext();
            const page = await context.newPage();
            await page.goto(url, { waitUntil: "domcontentloaded", timeout: 10_000 });
            const content = await page.content();
            console.log(`Successfully fetched content from ${url}`);
            return content;
        } catch (error) {
            console.error(error);
            return "";
        } finally {
            await context?.close();
        }
    });

    computeModule.register("hello", async ({ name }) => {
        return `Hello, ${name}!`;
    })


}

main().catch(error => {
    console.error(error);
    process.exit(1);
});