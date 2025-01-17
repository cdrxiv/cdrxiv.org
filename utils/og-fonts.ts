const headers = new Headers({ Referer: 'https://cdrxiv.org/' })

type FontConfig = {
  url: string
  name: string
}

export async function getFonts(fonts: FontConfig[]) {
  const fontBuffers = await Promise.all(
    fonts.map((font) =>
      fetch(font.url, {
        cache: 'force-cache',
        headers,
      }).then((res) => res.arrayBuffer()),
    ),
  )

  return fonts.map((font, i) => ({
    name: font.name,
    data: fontBuffers[i],
  }))
}
