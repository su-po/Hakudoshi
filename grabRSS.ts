// Function that grabs rss link from an html page
import {
  DOMParser,
} from "https://deno.land/x/deno_dom@v0.1.37/deno-dom-wasm.ts";

/**
 * This function grabs the rss link from an html page. It returns the rss link or undefined. It does not return an error, and that's on purpose. The program should not crash if it cannot find an rss link. It should just move on.
 * @param html string
 * @param origin url or file path
 * @returns  {string} rss url or undefined.
 * @example let rss = grabRSSUrl(html, origin);
 */
export function grabRSSUrl(html: string, origin: string): string | undefined {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  if (!doc) {
    return undefined;
  }
  const rss = doc.querySelector(`link[type='application/rss+xml']`) ||
    doc.querySelector(`link[type='application/atom+xml']`) ||
    doc.querySelector(`link[type='application/rdf+xml']`) ||
    doc.querySelector(`link[type='application/xml']`) ||
    doc.querySelector(`link[type='text/xml']`) ||
    doc.querySelector(`link[type='application/rss']`) ||
    doc.querySelector(`link[type='application/atom']`);

  if (rss) {
    //     // if rss link is relative, make it absolute
    if (rss.getAttribute("href")?.startsWith("/")) {
      const url = new URL(origin);
      return url.origin + rss.getAttribute("href") ?? "";
    }
    return rss.getAttribute("href") ?? "";
  }
  return "";
}

async function fetchHtml(url: string) {
  try {
    const res = await fetch(url);
    console.log(res.status);
    const html = await res.text();
    return html;
  } catch (e) {
    console.log("ERROR: " + e);
  }
}

const originUrl = "https://blog.codinghorror.com/";

const data = await fetchHtml(originUrl);
if (data) {
  const result = await grabRSSUrl(data, originUrl);
  console.log(result);
}
