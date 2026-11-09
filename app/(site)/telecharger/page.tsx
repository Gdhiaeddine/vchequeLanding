import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Download, ShieldCheck, Monitor, HelpCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DownloadPage() {
  const activeRelease = await prisma.appRelease.findFirst({
    where: { is_active: true },
  });

  const fileSizeMb = activeRelease ? (activeRelease.file_size / (1024 * 1024)).toFixed(1) : null;

  return (
    <div className="py-16 bg-[#fdfbf7]">
      <div className="container max-w-4xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-[#b99a5a] mb-2">
            Distribution Officielle
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#122620] font-serif mb-4">
            Télécharger VCheque pour Windows
          </h1>
          <p className="text-[#4f5f58] text-base leading-relaxed">
            Installez la version officielle certifiée pour Windows 10 et Windows 11 (64-bit).
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-[#e2dcce] shadow-xl p-8 sm:p-12 mb-10 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Installateur certifié & vérifié</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#122620] mb-2 font-serif">
            VCheque Studio — Version {activeRelease ? activeRelease.version : '1.0.0'}
          </h2>

          <p className="text-xs sm:text-sm text-[#6b7c74] mb-8">
            Pour Windows 10, 11 (Architecture 64-bit x64) {fileSizeMb ? `• Environ ${fileSizeMb} Mo` : ''}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="/telecharger/fichier"
              className="btn btn-primary inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold shadow-lg hover:shadow-xl hover:scale-102 transition-all w-full sm:w-auto"
            >
              <Download size={20} />
              <span>Télécharger l'installateur (.exe)</span>
            </a>
            <Link
              href="/commander"
              className="px-8 py-4 rounded-xl text-base font-semibold border-2 border-[#122620] text-[#122620] hover:bg-[#122620] hover:text-[#fbf9f4] transition-all w-full sm:w-auto"
            >
              Acheter une clé de licence
            </Link>
          </div>

          {activeRelease?.sha256 && (
            <div className="p-3 rounded bg-[#fcfaf5] border border-[#e2dcce] inline-block max-w-full overflow-hidden text-[11px] font-mono text-[#86928b]">
              SHA-256 : <span className="text-[#122620]">{activeRelease.sha256}</span>
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-xl bg-white border border-[#e2dcce]">
            <div className="w-8 h-8 rounded-full bg-[#b99a5a] text-white flex items-center justify-center font-bold text-sm mb-4">
              1
            </div>
            <h4 className="font-bold text-[#122620] mb-2">Téléchargement</h4>
            <p className="text-xs text-[#4f5f58]">
              Récupérez le fichier d'installation en cliquant sur le bouton ci-dessus.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#e2dcce]">
            <div className="w-8 h-8 rounded-full bg-[#b99a5a] text-white flex items-center justify-center font-bold text-sm mb-4">
              2
            </div>
            <h4 className="font-bold text-[#122620] mb-2">Installation</h4>
            <p className="text-xs text-[#4f5f58]">
              Lancez le programme d'installation et suivez les instructions à l'écran.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#e2dcce]">
            <div className="w-8 h-8 rounded-full bg-[#b99a5a] text-white flex items-center justify-center font-bold text-sm mb-4">
              3
            </div>
            <h4 className="font-bold text-[#122620] mb-2">Activation</h4>
            <p className="text-xs text-[#4f5f58]">
              Entrez votre clé de licence reçue par email pour débloquer l'impression illimitée.
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-6 rounded-xl bg-[#fcfaf5] border border-[#b99a5a]/30 flex items-start gap-4">
          <ShieldCheck className="text-[#b99a5a] shrink-0 mt-1" size={24} />
          <div>
            <h4 className="font-bold text-[#122620] text-sm">Garantie d'intégrité et sécurité</h4>
            <p className="text-xs text-[#4f5f58] mt-1 leading-relaxed">
              Le binaire est analysé et exempt de tout logiciel espion ou publicitaire. Vos modèles et historiques de chèques restent strictement sauvegardés en local sur votre poste de travail.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
