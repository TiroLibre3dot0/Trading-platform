const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#040915] text-white">
      <div className="section-shell grid gap-8 lg:grid-cols-5 text-sm text-white/70">
        <div className="lg:col-span-2 space-y-3">
          <div className="text-lg font-semibold text-white">Bullwaves</div>
          <p className="leading-relaxed text-white/75">Solida esperienza, esecuzione veloce, supporto umano.</p>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-white/70">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.18)]" />
            <span>Regulated multi-asset broker</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="font-semibold text-white">Azienda</div>
          <ul className="space-y-1.5 text-white/75">
            <li><a href="#why-us" className="hover:text-white">Perche noi</a></li>
            <li><a href="#accounts" className="hover:text-white">Tipi di conto</a></li>
            <li><a href="#support" className="hover:text-white">Supporto</a></li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="font-semibold text-white">Conformità</div>
          <ul className="space-y-1.5 text-white/75">
            <li>Rischio: il 75% dei conti retail perde denaro con i CFD.</li>
            <li>Valuta se puoi sostenere l&apos;alto rischio di perdita.</li>
            <li>Protezione del saldo negativo inclusa.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="font-semibold text-white">Contatti</div>
          <div className="text-white">support@bullwaves.com</div>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-white/10">Chat 24/7</span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-white/10">WhatsApp</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="section-shell py-6 text-xs text-white/60 leading-relaxed space-y-2">
          <div className="text-white/70">Bullwaves Ltd. P.IVA 00000000000 · Segregazione fondi clienti · Audit periodici indipendenti.</div>
          <div className="text-white/60">I CFD sono strumenti complessi e presentano un rischio elevato di perdere denaro rapidamente a causa della leva finanziaria. Valuta se comprendi il funzionamento dei CFD e se puoi permetterti di correre l&apos;alto rischio di perdere il tuo denaro.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
