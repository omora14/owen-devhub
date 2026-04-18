import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Download, ArrowLeft } from 'lucide-react';

export default function ResumePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  const isEs = locale === 'es';
  const title = isEs ? 'Currículum' : 'Resume';
  const back = isEs ? 'Volver' : 'Back';
  const download = isEs ? 'Descargar PDF' : 'Download PDF';

  return (
    <main className="min-h-screen bg-ocean-deep text-sand-warm">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 pt-24 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/15 text-sand-warm/70 hover:text-sand-warm hover:border-white/25 hover:bg-white/5 transition-all"
            >
              <ArrowLeft size={16} />
              {back}
            </Link>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">{title}</h1>
          </div>

          <a
            href="/Owen-Morales-Resume.pdf"
            download
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sunset-orange/12 border border-sunset-orange/35 text-sunset-orange text-sm font-medium hover:bg-sunset-orange hover:text-white transition-all"
          >
            <Download size={16} />
            {download}
          </a>
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/10 bg-ocean-navy shadow-2xl shadow-black/50">
          <iframe
            title="Resume PDF"
            src="/Owen-Morales-Resume.pdf#view=FitH"
            className="w-full h-[78vh] bg-ocean-navy"
          />
        </div>
      </div>
    </main>
  );
}

