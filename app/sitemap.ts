import { MetadataRoute } from 'next'
import { fetchWithAlerting } from '../actions/server-utils'
import { Preprints } from '../types/preprint'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://cdrxiv.org'

  const staticRoutes = [
    { url: `${baseUrl}/` },
    { url: `${baseUrl}/about` },
    { url: `${baseUrl}/about/team` },
    { url: `${baseUrl}/about/faq` },
    { url: `${baseUrl}/about/scope` },
    { url: `${baseUrl}/about/screening` },
    { url: `${baseUrl}/account` },
    { url: `${baseUrl}/register` },
    { url: `${baseUrl}/cookies-notice` },
    { url: `${baseUrl}/privacy-policy` },
    { url: `${baseUrl}/terms-of-use` },
  ]

  const apiUrl = `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/published_preprints/`
  let nextUrl: string | null = apiUrl
  let allPreprints: Preprints = []

  while (nextUrl) {
    const res = await fetchWithAlerting(nextUrl)
    const data = await res.json()
    allPreprints = [...allPreprints, ...(data?.results ?? [])]
    nextUrl = data?.next ?? null
  }

  const preprintSitemap: MetadataRoute.Sitemap = allPreprints.map(
    (preprint: any) => {
      return {
        url: `${baseUrl}/preprint/${preprint.pk}`,
        lastModified: new Date(preprint.versions[0].date_time),
      }
    },
  )

  const sitemap = [...staticRoutes, ...preprintSitemap]
  return sitemap
}
