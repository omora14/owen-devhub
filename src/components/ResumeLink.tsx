'use client';

import Link from 'next/link';
import { useCallback } from 'react';

type Props = {
  locale: string;
  className?: string;
  children: React.ReactNode;
  pdfHref?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

export default function ResumeLink({
  locale,
  className,
  children,
  pdfHref = '/Owen-Morales-Resume.pdf',
  onClick: onClickProp,
}: Props) {
  const desktopHref = `/${locale}/resume`;

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClickProp?.(e);
      if (typeof window === 'undefined') return;

      const isPhone = window.matchMedia('(max-width: 767px)').matches;
      if (!isPhone) return;

      e.preventDefault();
      window.location.href = pdfHref;
    },
    [onClickProp, pdfHref]
  );

  return (
    <Link href={desktopHref} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}

