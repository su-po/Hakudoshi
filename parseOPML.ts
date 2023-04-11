import { parse } from "https://deno.land/x/xml@2.1.0/mod.ts"
import { fetchAndParse } from "./fetchAndParse.ts"
import { denoDomDisableQuerySelectorCodeGeneration } from "https://deno.land/x/deno_dom@v0.1.37/deno-dom-wasm.ts"
const start = new Date().getTime()
const directoryPath = Deno.cwd() + "/opml"

async function getFilePaths(directoryPath: string): Promise<string[]> {
  const fileNames: string[] = []

  for await (const dirEntry of Deno.readDir(directoryPath)) {
    if (dirEntry.isFile) {
      fileNames.push(dirEntry.name)
    }
  }
  const filePaths = fileNames.map((fileName: string) => `${directoryPath}/${fileName}`)
  const fileStatPromises = filePaths.map(filePath => Deno.stat(filePath))
  const fileStats = await Promise.all(fileStatPromises)
  const filePathsWithStats = filePaths.filter((_, i) => fileStats[i].isFile)
  return filePathsWithStats
}





// extend document type to include opml using typescript

/**
 * This function is meant to extract rss and atom links from opml file and then fetch and parse them. Under the hood, it uses fetchAndParse to fetch and parse the feeds.
 * @param opmlPath path to opml file or url to opml file
 */
export async function extractRssAtomLinksFromOpml(
  opmlPath: string,
) {
  const opmlText = await Deno.readTextFile(opmlPath)
  const { root } = parse(opmlText, {
    flatten: true,

  })

  console.log(root)

  // extend root to include opml


  if (root) {
    // I know that typescript is not happy with this, but it works
    for (const child of root.opml.outline) {
      try {
        const url = child["@xmlUrl"]
        await fetchAndParse(url)
      } catch (e) {
        console.log(e, "when accessing url", child)
        // if fetching fails, delete url from opml file
      }
    }
  }
}

const paths = await getFilePaths(directoryPath)

for (let i = 0; i < paths.length; i++) {
  await extractRssAtomLinksFromOpml(paths[i])
}
const end = new Date().getTime()
console.log(`Time taken: ${(end - start) / 1000}s`)


// await extractRssAtomLinksFromOpml(opml)
