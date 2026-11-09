import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#F7F4EC]">
      <div className="max-w-md p-8 rounded-2xl bg-white border border-[#E5DEC9] shadow-md">
        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#EFEAD9] text-[#B99A5A] text-2xl font-bold mb-4 font-serif">
          404
        </span>
        <h1 className="text-2xl font-serif text-[#102C25] mb-2">Page non trouvée</h1>
        <p className="text-[#64746B] text-sm mb-6">
          La page demandée est introuvable ou a été déplacée.
        </p>
        <Link
          href="/"
          className="btn btn-primary inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-semibold"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
