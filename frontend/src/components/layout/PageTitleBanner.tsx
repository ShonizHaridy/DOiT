// src/components/layout/PageTitleBanner.tsx

interface PageTitleBannerProps {
  title: string
}

export default function PageTitleBanner({ title }: PageTitleBannerProps) {
  return (
    <section className="w-full h-14 lg:h-20 flex items-center justify-center bg-secondary">
      <h1 className="font-roboto-condensed font-bold text-lg lg:text-2xl text-white uppercase tracking-wider text-center px-4">
        {title}
      </h1>
    </section>
  )
}