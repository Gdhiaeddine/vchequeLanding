import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Play, Download, ShoppingCart, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DemonstrationPage() {
  const activeVideo = await prisma.demoVideo.findFirst({
    where: { is_active: true },
  });

  return (
    <div className="py-16 bg-[#fdfbf7]">
      <div className="container max-w-5xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-[#b99a5a] mb-2">
            Aperçu en action
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#122620] font-serif mb-4">
            Démonstration du logiciel VCheque
          </h1>
          <p className="text-[#4f5f58] text-base leading-relaxed">
            Découvrez en quelques minutes comment remplir vos chèques professionnels, aligner vos impressions et convertir automatiquement vos montants sans ratures.
          </p>
        </div>

        {/* Video Frame */}
        <div className="rounded-2xl bg-white border border-[#e2dcce] shadow-xl overflow-hidden p-3 mb-12">
          {activeVideo ? (
            <video
              controls
              className="w-full aspect-video rounded-xl bg-black"
              poster={activeVideo.thumbnail_path || undefined}
            >
              <source src={`/api/demonstration/video/${activeVideo.id}`} type={activeVideo.mime_type} />
              Votre navigateur ne prend pas en charge la lecture de vidéos.
            </video>
          ) : (
            <div className="w-full aspect-video rounded-xl bg-[#122620] flex flex-col items-center justify-center text-center p-8 text-white">
              <div className="w-16 h-16 rounded-full bg-[#b99a5a]/20 border border-[#b99a5a] flex items-center justify-center mb-4">
                <Play size={28} className="text-[#b99a5a] ml-1 fill-current" />
              </div>
              <h3 className="text-xl font-bold mb-2">Vidéo de présentation interactive</h3>
              <p className="text-[#c5cdc8] text-sm max-w-md mb-6">
                Le tutoriel pas-à-pas présente la configuration de l'imprimante, la sélection du chéquier de votre banque et l'impression en temps réel.
              </p>
              <Link
                href="/telecharger"
                className="btn btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold"
              >
                <Download size={16} />
                <span>Télécharger la version d'essai</span>
              </Link>
            </div>
          )}
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-xl bg-white border border-[#e2dcce]">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="text-[#b99a5a]" size={20} />
              <h4 className="font-bold text-[#122620]">1. Choix du modèle</h4>
            </div>
            <p className="text-sm text-[#4f5f58]">
              Sélectionnez votre banque parmi les modèles intégrés (BNA, CPA, BEA, etc.) ou personnalisez les dimensions de votre chéquier.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#e2dcce]">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="text-[#b99a5a]" size={20} />
              <h4 className="font-bold text-[#122620]">2. Saisie intuitive</h4>
            </div>
            <p className="text-sm text-[#4f5f58]">
              Indiquez le montant en chiffres. La conversion en lettres françaises s'exécute en temps réel avec accord des devises.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#e2dcce]">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="text-[#b99a5a]" size={20} />
              <h4 className="font-bold text-[#122620]">3. Impression & Sécurité</h4>
            </div>
            <p className="text-sm text-[#4f5f58]">
              Insérez le chèque dans votre imprimante. Barrement et mention non endossable sont apposés automatiquement.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="text-center p-8 rounded-2xl bg-[#fcfaf5] border border-[#b99a5a]/30">
          <h3 className="text-xl font-bold text-[#122620] mb-2">Convaincu par la démonstration ?</h3>
          <p className="text-sm text-[#4f5f58] mb-6">
            Commandez votre licence commerciale définitive dès aujourd'hui ou contactez notre équipe pour toute question.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/commander"
              className="btn btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold"
            >
              <ShoppingCart size={16} />
              <span>Acheter ma licence</span>
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-lg text-sm font-semibold bg-white border border-[#e2dcce] text-[#122620] hover:bg-[#f5f2ea]"
            >
              Poser une question
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
