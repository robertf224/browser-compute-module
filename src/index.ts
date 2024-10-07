import puppeteer, { BrowserContext } from 'puppeteer';

import { ComputeModule } from "@palantir/compute-module";
import { Type } from "@sinclair/typebox";

const computeModule = new ComputeModule({
  logger: console,
  isAutoRegistered: false,
  definitions: {
    getWebpage: {
        input: Type.Object({
            url: Type.String({ format: "uri" }),
        }),
        output:  Type.String(),
    }
  },
});

(async () => {
    const browser = await puppeteer.launch();

    computeModule
        .register("getWebpage", async ({ url }) => {
            let context: BrowserContext | undefined;
            try {
                context = await browser.createBrowserContext();
                const page = await context.newPage();
                await page.goto(url, { waitUntil: "networkidle2"});
                return page.content();
            } finally {
                await context?.close();
            }
        })
})()

