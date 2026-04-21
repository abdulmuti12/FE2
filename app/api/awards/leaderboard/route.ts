import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { buildApiUrl } from '@/app/api/_utils'

// Mock data dari API response - digunakan sebagai fallback saat API error
const MOCK_LEADERBOARD = {
  count: [
    {
      id: '1',
      name: 'Long AI Film',
      displays: '1',
      duration_from: '10',
      duration_to: '60',
      created_on: '1758702667',
      created_by: '1',
      updated_on: '1760676924',
      updated_by: '3',
      creator: [
        { id: '417', email: 'ayamersb@gmail.com', name: 'Rifo Wanderya', avatar: '1770439870693(2).jpg', watch: '60', likes: '106', vote: '133', views: '283', play: '227', totals: '809' },
        { id: '385', email: 'brianwhmuhamad@gmail.com', name: 'Mbrianwidi', avatar: '5238bdd4e0ef950cc09026d4a22efe80.jpg', watch: '50', likes: '71', vote: '72', views: '144', play: '110', totals: '447' },
        { id: '221', email: 'woxo.cyber@gmail.com', name: "p' wk", avatar: '1763761667161(1).jpg', watch: '50', likes: '55', vote: '57', views: '119', play: '106', totals: '387' },
        { id: '315', email: 'bakagarden@gmail.com', name: 'B.K Sillo', avatar: 'WhatsApp-Image-2025-09-01-at-150046(1).png', watch: '12', likes: '18', vote: '23', views: '88', play: '65', totals: '206' },
        { id: '39', email: 'avantara99@gmail.com', name: 'Agung', avatar: null, watch: '2', likes: '6', vote: '10', views: '133', play: '50', totals: '201' },
        { id: '379', email: 'teguh12372@gmail.com', name: 'Teguh Sugiarto', avatar: null, watch: '15', likes: '28', vote: '26', views: '50', play: '42', totals: '161' },
        { id: '449', email: 'light471@gmail.com', name: 'cahya septia', avatar: 'Screenshot-2026-02-16-185139(1).png', watch: '3', likes: '18', vote: '13', views: '49', play: '43', totals: '126' },
        { id: '245', email: 'bayupg2023@gmail.com', name: 'Bayu Putra Ginanjar', avatar: null, watch: '0', likes: '0', vote: '3', views: '56', play: '40', totals: '99' },
        { id: '421', email: 'armansyah.skom@gmail.com', name: 'Cekgu Arman', avatar: 'channel-cekgu-copy(1).png', watch: '0', likes: '0', vote: '1', views: '40', play: '38', totals: '79' },
        { id: '359', email: 'energipositif@gmail.com', name: 'Edi Haryono', avatar: 'orang-sujud.jpg', watch: '3', likes: '3', vote: '5', views: '34', play: '29', totals: '74' },
      ],
    },
    {
      id: '2',
      name: 'Short AI Film',
      displays: '1',
      duration_from: '1',
      duration_to: '9',
      created_on: '1758702954',
      created_by: '1',
      updated_on: '1766129776',
      updated_by: '2',
      creator: [
        { id: '221', email: 'woxo.cyber@gmail.com', name: "p' wk", avatar: '1763761667161(1).jpg', watch: '586', likes: '671', vote: '713', views: '793', play: '389', totals: '3152' },
        { id: '93', email: 'normayulisthia9@gmail.com', name: 'norma yulisthia', avatar: 'MUSIC_Kuat-Tanpa-Suara-Norma-Yulisthia-_1761832449150.jpg', watch: '198', likes: '243', vote: '228', views: '415', play: '131', totals: '1215' },
        { id: '180', email: 'sriyadi1980@gmail.com', name: 'SRI YADI', avatar: null, watch: '163', likes: '199', vote: '249', views: '333', play: '96', totals: '1040' },
        { id: '166', email: 'exposuro.digital@gmail.com', name: 'Exposuro', avatar: 'logo-exposuro(1).png', watch: '100', likes: '126', vote: '159', views: '339', play: '34', totals: '758' },
        { id: '50', email: 'creadeiai@gmail.com', name: 'Crea Dei', avatar: null, watch: '9', likes: '9', vote: '179', views: '306', play: '59', totals: '562' },
      ],
    },
    {
      id: '3',
      name: 'Documentary AI Film',
      displays: '1',
      duration_from: '3',
      duration_to: '30',
      created_on: '1758702963',
      created_by: '1',
      updated_on: '1760676975',
      updated_by: '3',
      creator: [
        { id: '93', email: 'normayulisthia9@gmail.com', name: 'norma yulisthia', avatar: 'MUSIC_Kuat-Tanpa-Suara-Norma-Yulisthia-_1761832449150.jpg', watch: '71', likes: '71', vote: '72', views: '108', play: '84', totals: '406' },
        { id: '24', email: 'immanuelmanurung08@gmail.com', name: 'Immanuel Manurung', avatar: 'ai_portrait_front_view_16x9.png', watch: '0', likes: '0', vote: '1', views: '30', play: '7', totals: '38' },
        { id: '405', email: 'aryluke@gmail.com', name: 'Aryluke Channel', avatar: null, watch: '7', likes: '7', vote: '7', views: '10', play: '6', totals: '37' },
      ],
    },
    {
      id: '4',
      name: 'Video Clip ',
      displays: '1',
      duration_from: '1',
      duration_to: '3',
      created_on: '1758703033',
      created_by: '1',
      updated_on: '1760676988',
      updated_by: '3',
      creator: [
        { id: '86', email: 'susinaila726@gmail.com', name: 'Susi', avatar: 'IMG_20251119_001020(2).png', watch: '1065', likes: '1108', vote: '1124', views: '1274', play: '347', totals: '4918' },
        { id: '417', email: 'ayamersb@gmail.com', name: 'Rifo Wanderya', avatar: '1770439870693(2).jpg', watch: '125', likes: '354', vote: '745', views: '860', play: '332', totals: '2416' },
        { id: '93', email: 'normayulisthia9@gmail.com', name: 'norma yulisthia', avatar: 'MUSIC_Kuat-Tanpa-Suara-Norma-Yulisthia-_1761832449150.jpg', watch: '81', likes: '85', vote: '86', views: '121', play: '70', totals: '443' },
      ],
    },
    {
      id: '5',
      name: 'Video Advertising AI',
      displays: '1',
      duration_from: '0.333333',
      duration_to: '0.833333',
      created_on: '1758703080',
      created_by: '1',
      updated_on: '1760677005',
      updated_by: '3',
      creator: [
        { id: '319', email: 'fardanajih2st@gmail.com', name: 'M FARDA NAJIH ARIFANI', avatar: 'Swap_face_image_4k_202601022004(23).jpeg', watch: '106', likes: '111', vote: '111', views: '150', play: '144', totals: '622' },
        { id: '104', email: 'rianrizkyananta@gmail.com', name: 'Rian Rizky Ananta', avatar: 'logo-ananta(1).jpg', watch: '10', likes: '10', vote: '66', views: '85', play: '18', totals: '189' },
        { id: '80', email: 'grosiradv@gmail.com', name: 'Roy Suryadi', avatar: null, watch: '3', likes: '12', vote: '31', views: '62', play: '20', totals: '128' },
      ],
    },
    {
      id: '7',
      name: 'AI Content for Social Media',
      displays: '1',
      duration_from: '0.1',
      duration_to: '2',
      created_on: '1758703242',
      created_by: '1',
      updated_on: '1760677099',
      updated_by: '3',
      creator: [
        { id: '213', email: 'williamasella@gmail.com', name: 'william asella putra', avatar: 'photo_6271728846302285128_x.jpg', watch: '104', likes: '115', vote: '138', views: '191', play: '64', totals: '612' },
        { id: '318', email: 'curhatyujiwo@gmail.com', name: 'Yu jiwo', avatar: 'YU-JIWO(1).png', watch: '35', likes: '60', vote: '81', views: '116', play: '98', totals: '390' },
        { id: '40', email: 'acan.aung23@gmail.com', name: 'acan aung', avatar: null, watch: '63', likes: '70', vote: '72', views: '103', play: '16', totals: '324' },
      ],
    },
  ],
  status: true,
  message: 'success (mock data)',
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value ?? ''

    const upstream = new URL(buildApiUrl('/award/leaderboard'))
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    console.log('[leaderboard] Fetching from API...')

    const response = await fetch(upstream.toString(), {
      method: 'GET',
      headers,
      cache: 'no-store',
    })

    console.log('[leaderboard] API Status:', response.status)

    if (response.ok) {
      const data = await response.json()
      if (data.count && Array.isArray(data.count) && data.count.length > 0) {
        console.log('[leaderboard] ✅ Using real API data')
        return NextResponse.json(data)
      }
    }

    // API error atau kosong → gunakan mock data sebagai fallback
    console.warn('[leaderboard] ⚠️ API error/empty, using mock data fallback')
    return NextResponse.json(MOCK_LEADERBOARD)
  } catch (error) {
    console.error('[leaderboard] ❌ Error:', error)
    // Final fallback: return mock data
    return NextResponse.json(MOCK_LEADERBOARD)
  }
}