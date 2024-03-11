import { NextRequest, NextResponse } from 'next/server'
import { isDevelopment } from '@/utils/global'

const PUBLIC_FILE = /\.(.*)$/

export function middleware(req) {  
  if (req.nextUrl.locale === 'default') {
    const locale = req.cookies.get('NEXT_LOCALE')?.value || 'en'
    // Debugging Panel
    if (req.nextUrl.pathname.startsWith('/panel') && !isDevelopment())
      return NextResponse.redirect(
        new URL(`/${ locale }`, req.url)
      )
  }
}