// import { parse } from "https://deno.land/x/xml@2.1.0/parse.ts";
import { fetchAndParse } from "./fetchAndParse.ts";
// import { parse as parseArguments } from "https://deno.land/std@0.182.0/flags/mod.ts";

const start = new Date().getTime();

// if (Deno.args.length === 0) {
//   console.log("Please provide an opml file");
//   Deno.exit(1);
// }

// const { file } = parseArguments(Deno.args);

// if (!file) {
//   console.log("Please provide an appropriate file");

//   Deno.exit(1);
// }

// const urls: string[] = [];
// urls.push(file);

// const start = new Date().getTime();
// const url = "https://paco.me/feed.xml";
// const url2 = "http://www.johncoulthart.com/feuilleton/feed/";
// const url3 = "https://deno.com/feed";
// const url4 = "https://www.bleepingcomputer.com/feed/";

// const urls = [url, url2, url3, url4];



async function _main(urls: string[]) {
  const promises = urls.map((url) => fetchAndParse(url));
  await Promise.all(promises);
  const end = new Date().getTime();
  console.log(`Time taken: ${(end - start) / 1000}s`);
}

// await main(urls);
