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
    { url: `${baseUrl}/account` },
  ]

  const apiUrl = `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/published_preprints/`
  const res = await fetchWithAlerting(apiUrl)
  const data = await res.json()
  const preprints: Preprints = data?.results ?? []
  const preprintSitemap: MetadataRoute.Sitemap = preprints.map(
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
