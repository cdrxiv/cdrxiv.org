import { MetadataRoute } from 'next'
import { fetchWithAlerting } from '../actions/server-utils'
import { Preprints } from '../types/preprint'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://cdrxiv.org'

  const staticRoutes = [
    {
      url: `${baseUrl}/`,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about/team`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about/faq`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about/scope`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/account`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
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
        changeFrequency: 'yearly' as const,
        priority: 0.9,
      }
    },
  )

  const sitemap = [...staticRoutes, ...preprintSitemap]
  return sitemap
}
