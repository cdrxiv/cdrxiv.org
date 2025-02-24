import { withPlausibleProxy } from 'next-plausible'
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  async rewrites() {
    return [
      {
        rewrites: [
          {
            source: '/repository/object/:slug*',
            destination: `${process.env.NEXT_PUBLIC_JANEWAY_URL}/repository/object/:slug*`,
          },
        ],
      },
    ]
  },
}

const withMDX = createMDX({})

export default withPlausibleProxy()(withMDX(nextConfig))
