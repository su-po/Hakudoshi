import { parseFeed } from "https://deno.land/x/rss@0.5.8/mod.ts"


export function sanitizeS(s: string): string {
  // Remove spaces and special characters using regular expression
  const modifiedString = s.replace(/[^\w\s]/gi, "").replace(/\s+/g, "")

  // Transform the modified string to lowercase characters only
  return modifiedString.toLowerCase()
}

/**
 * Function fetches and parses the feed. It then writes the feed to a file. It is all side effects. Error should be handled by the caller.
 * @param {string} url This url should be the xml / rss / atom feed path.
 * @returns  {Promise<void>} There is no return value.
 */

// TODO: If error occurs you should pass it to the caller
export async function fetchAndParse(url: string): Promise<void> {


  console.log(url, "in fetchAndParse.ts")
  const start = new Date().getTime()
  const response = await fetch(url, {
    headers: {
      "Content-Type": "text/xml; charset=UTF-8",
    },
  })
  if (!response.ok) {
    console.error(
      `Error fetching feed -> ${url}.`,
      `Error returned: ${response.statusText}`,
    )
    Deno.exit(1)
  }

  const decoder = new TextDecoder("utf-8")
  const reader = response.body?.getReader()
  if (!reader) Deno.exit(1)
  let xml = ""

  while (true) {
    const { done, value } = await reader!.read()
    if (done) break
    xml += decoder.decode(value)
  }

  const { icon, entries, type, categories, updateDate, image, title, description, id, links } = await parseFeed(xml)

  // remove content from entries
  const entriesWithoutContent = entries.map((entry) => {
    const { content : _content , ...rest } = entry
    return rest
  })

  const f = {
    icon,
    id,
    links,
    type,
    categories,
    updateDate,
    image,
    title,
    description,
    entries: entriesWithoutContent,
  }



  const filename = `feeds/${sanitizeS(title.value ?? id)}.json`
  try {
    await Deno.stat(filename)
    console.log(`File ${filename} already exists. Skipping write.`)
  } catch {
    const encoder = new TextEncoder()
    const data = encoder.encode(JSON.stringify(f))
    await Deno.writeFile(filename, data).then(() => {
      const end = new Date().getTime()
      console.log(`Wrote ${filename} in ${(end - start) / 1000}s`)
    })
  }

}
