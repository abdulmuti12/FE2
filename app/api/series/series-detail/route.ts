import { NextRequest, NextResponse } from 'next/server'
import { buildApiUrl } from '@/app/api/_utils'

type SeriesItem = {
  id?: string
  name?: string
  folder_groups?: string
  description?: string
  run_time?: string
  years?: string
  video?: string
  image?: string
  image_landscape?: string
  comment?: string
  cats?: string
  rates?: string | null
  favorit?: string
  my_favorit?: string
  watch_me?: string
  image_url?: string
  image_landscape_url?: string
  video_url?: string
  synopsis?: string
  run_time_format?: string
}

const emptyString = (value?: string | null) => value ?? ''

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const idGroup = searchParams.get('id_group')

    if (!idGroup) {
      return NextResponse.json(
        { status: false, message: 'id_group is required' },
        { status: 400 }
      )
    }

    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { status: false, message: 'Authorization token is required' },
        { status: 401 }
      )
    }

    const query = new URLSearchParams({
      sort: 'latest',
      id_category: '',
      page: '1',
      limit: '50',
      view_type: 'potrait',
      folder_groups: idGroup,
    })

    const response = await fetch(buildApiUrl(`/series/list?${query.toString()}`), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const raw = await response.json()
    const list: SeriesItem[] = Array.isArray(raw?.list) ? raw.list : []

    if (!response.ok || raw?.status !== true || list.length === 0) {
      return NextResponse.json(
        { status: false, message: raw?.message || 'Series group content not found' },
        { status: response.ok ? 404 : response.status }
      )
    }

    const primary = list[0]

    const data = {
      id: emptyString(primary.id),
      name: emptyString(primary.name),
      folder_groups: emptyString(primary.folder_groups) || idGroup,
      description: emptyString(primary.description),
      run_time: emptyString(primary.run_time),
      years: emptyString(primary.years),
      video: emptyString(primary.video),
      image: emptyString(primary.image),
      image_landscape: emptyString(primary.image_landscape),
      comment: emptyString(primary.comment),
      cats: emptyString(primary.cats),
      rates: primary.rates ?? null,
      favorit: emptyString(primary.favorit),
      my_favorit: emptyString(primary.my_favorit),
      watch_me: emptyString(primary.watch_me),
      image_url: emptyString(primary.image_url),
      image_landscape_url: emptyString(primary.image_landscape_url),
      video_url: emptyString(primary.video_url),
      cover: '',
      cover_url: '',
      ipfs: '',
      ipfs_url: '',
      groups: list,
      recomen: [],
    }

    return NextResponse.json({ status: true, data }, { status: 200 })
  } catch {
    return NextResponse.json(
      { status: false, message: 'Failed to fetch series detail' },
      { status: 500 }
    )
  }
}
