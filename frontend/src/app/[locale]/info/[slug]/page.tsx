import { notFound } from 'next/navigation'
import PageTitleBanner from '@/components/layout/PageTitleBanner'
import { serverFetch } from '@/lib/server-fetch'

type InformationPage = {
  id: string
  slug: string
  titleEn: string
  titleAr: string
  contentEn: string
  contentAr: string
  order: number
}

type RichSection = {
  heading?: string
  body: string
}

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

const normalizeText = (value: string) => value.replace(/\r\n/g, '\n').trim()

const parseSections = (content: string): RichSection[] => {
  const normalized = normalizeText(content)
  if (!normalized) return []

  return normalized
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const lines = chunk.split('\n').map((line) => line.trim()).filter(Boolean)
      const firstLine = lines[0] ?? ''

      if (firstLine.startsWith('## ')) {
        return {
          heading: firstLine.slice(3).trim(),
          body: lines.slice(1).join('\n').trim(),
        }
      }

      return {
        body: lines.join('\n').trim(),
      }
    })
}

async function getInformationPage(slug: string): Promise<InformationPage | null> {
  try {
    return await serverFetch<InformationPage>(`/content/information-pages/${encodeURIComponent(slug)}`, {
      revalidate: 60,
      tags: ['content', 'site-pages'],
    })
  } catch {
    return null
  }
}

export default async function InformationPageBySlug({ params }: Props) {
  const { locale, slug } = await params
  const page = await getInformationPage(slug)

  if (!page) {
    notFound()
  }

  const isArabic = locale === 'ar'
  const title = isArabic ? page.titleAr : page.titleEn
  const content = isArabic ? page.contentAr : page.contentEn
  const sections = parseSections(content)

  return (
    <div className="min-h-screen bg-white">
      <PageTitleBanner title={title} />

      <div className="container-doit py-8 md:py-12 lg:py-16">
        <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-10 flex flex-col gap-6 md:gap-8 shadow-sm border border-neutral-100">
          <h2 className="text-neutral-900 text-xl md:text-2xl lg:text-3xl font-semibold">
            {title}
          </h2>

          {sections.length > 0 ? (
            sections.map((section, index) => (
              <div key={`${section.heading ?? 'section'}-${index}`} className="space-y-3 md:space-y-4">
                {section.heading && (
                  <h3 className="text-neutral-900 text-lg md:text-xl lg:text-2xl font-medium">
                    {section.heading}
                  </h3>
                )}
                <p className="text-neutral-700 text-base md:text-lg leading-relaxed whitespace-pre-line">
                  {section.body}
                </p>
              </div>
            ))
          ) : (
            <p className="text-neutral-700 text-base md:text-lg leading-relaxed whitespace-pre-line">
              {content}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
