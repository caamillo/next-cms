import App from 'next/App'
import "@/app/globals.css"
import { isDevelopment } from "@/utils/global"
import dynamic from "next/dynamic"
import { MainContextProvider, MainContext } from '@/contexts/MainContext'
import { useContext } from 'react'

const Debugger = isDevelopment() ? dynamic(() => 
  import("@/components/debugger")
) : () => null

export default function MyApp({ Component, pageProps, localizedContent }) {
  return (
    <MainContextProvider localizedContent={ localizedContent }>
      <Component { ...pageProps } />
      <Debugger />
    </MainContextProvider>
  )
}

MyApp.getInitialProps = async (appContext) => {
  const props = await App.getInitialProps(appContext)
  const { ctx } = appContext
  let localizedContent = {}

  const route = ctx.pathname === '/' ? 'home' : ctx.pathname.replace(/^\/|\/$/g, '')
  const locale = ctx.locale || 'en'

  try {
    localizedContent = (await import(`../lang/pages/${ route }/${ locale }.json`)).default
  } catch (e) {
    console.error(`Failed to fetch content for /lang/pages/${ route }/${ locale }.json:`, e)
  }

  return {
    ...props,
    localizedContent
  }
}
