import type { Metadata } from 'next'
import '../styles/index.css'

export const metadata: Metadata = {
  title: 'Descubre tu Arquetipo',
  description: 'Orientación profesional a través del marco Ikigai'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
