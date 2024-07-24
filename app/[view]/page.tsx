'use client'

import { notFound } from 'next/navigation'
import DataView from '../../components/preprints-view'

export default function ViewPage({ params }: { params: { view: string } }) {
  const validViews = ['stack', 'grid', 'list']

  if (!validViews.includes(params.view)) {
    notFound()
  }

  return <DataView view={params.view} />
}
