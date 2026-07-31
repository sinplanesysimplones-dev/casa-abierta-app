import '@/src/styles/index.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  // SONAR - Professional Archetype Discovery App
  return <Component {...pageProps} />
}
