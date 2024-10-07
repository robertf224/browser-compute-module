import puppeteer, { BrowserContext } from "puppeteer";
import { ComputeModule } from "@palantir/compute-module";
import { Type } from "@sinclair/typebox";

async function main(): Promise<void> {
    const browser = await puppeteer.launch();

    const computeModule = new ComputeModule({
        logger: console,
        definitions: {
          getWebpage: {
              input: Type.Object({
                  url: Type.String({ format: "uri" }),
              }),
              output:  Type.String(),
          }
        },
      });

    computeModule.register("getWebpage", async ({ url }) => {
        let context: BrowserContext | undefined;
        try {
            context = await browser.createBrowserContext();
            const page = await context.newPage();
            await page.goto(url, { waitUntil: "networkidle2"});
            return page.content();
        } finally {
            await context?.close();
        }
    });
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});