import { User, TrendingUp, BarChart3, Target, Play, CreditCard, ArrowUpDown, Users, BarChart, MessageSquare, FileText, Settings } from 'lucide-react';

export interface DemoChapter {
  id: number;
  title: string;
  icon: typeof User;
  description: string;
  objectives: string[];
  duration: string;
  highlightKey?: string;
  ctaLabel?: string;
  route?: string; // Route where this chapter should be displayed
}

export const demoChapters: DemoChapter[] = [
  {
    id: 1,
    title: "Benvenuto nella Piattaforma di Trading",
    icon: User,
    description: "Ciao! Sono il tuo mentore virtuale. Ti guiderò attraverso tutte le funzionalità della nostra piattaforma di trading avanzata. Iniziamo esplorando l'interfaccia principale di trading.",
    objectives: [
      "Esplora l'interfaccia di trading principale",
      "Identifica i pannelli principali (Market Watch, Chart, Trading Panel)",
      "Naviga tra i diversi componenti"
    ],
    duration: "2 min",
    route: "/trade",
    ctaLabel: "Inizia l'Esplorazione"
  },
  {
    id: 2,
    title: "Scopri il Mercato",
    icon: TrendingUp,
    description: "Il mercato finanziario è un oceano di opportunità. Impariamo a leggere i prezzi e selezionare gli strumenti giusti. Il Market Watch è il tuo punto di partenza!",
    objectives: [
      "Seleziona EUR/USD dal Market Watch",
      "Osserva i prezzi Bid/Ask in tempo reale",
      "Comprendi lo spread e la volatilità"
    ],
    duration: "3 min",
    route: "/trade",
    highlightKey: "market-watch",
    ctaLabel: "Esplora il Mercato"
  },
  {
    id: 3,
    title: "Il Potere del Chart",
    icon: BarChart3,
    description: "I grafici sono gli occhi del trader. Vediamo come analizzare l'andamento dei prezzi nel tempo. Ogni timeframe racconta una storia diversa!",
    objectives: [
      "Cambia timeframe da H1 a M15",
      "Usa zoom e pan per esplorare il grafico",
      "Identifica pattern di prezzo"
    ],
    duration: "4 min",
    route: "/trade",
    highlightKey: "chart-toolbar",
    ctaLabel: "Analizza il Grafico"
  },
  {
    id: 4,
    title: "Gli Strumenti del Trader",
    icon: Target,
    description: "Gli indicatori tecnici sono i tuoi alleati strategici. Apriamo il Navigator per aggiungere strumenti di analisi avanzati al tuo grafico.",
    objectives: [
      "Clicca sul pannello Navigator a sinistra",
      "Esplora gli indicatori disponibili",
      "Aggiungi Moving Average e RSI al grafico"
    ],
    duration: "5 min",
    route: "/trade",
    highlightKey: "navigator",
    ctaLabel: "Apri il Navigator"
  },
  {
    id: 5,
    title: "Il Primo Trade",
    icon: Play,
    description: "È ora di fare pratica! Usiamo il pannello di trading per eseguire un ordine demo. Ricorda: la pratica rende perfetti!",
    objectives: [
      "Seleziona la direzione del trade (Buy/Sell)",
      "Imposta volume, Stop Loss e Take Profit",
      "Esegui l'ordine demo"
    ],
    duration: "6 min",
    route: "/trade",
    highlightKey: "trading-panel",
    ctaLabel: "Esegui il Primo Trade"
  },
  {
    id: 6,
    title: "Social Trading - Condividi e Impara",
    icon: Users,
    description: "Il Social Trading ti permette di seguire i trader esperti e imparare dalle loro strategie. Una comunità di trader per crescere insieme!",
    objectives: [
      "Esplora i trader più performanti",
      "Visualizza le loro strategie e statistiche",
      "Scopri come seguire un trader"
    ],
    duration: "4 min",
    route: "/social",
    ctaLabel: "Esplora il Social Trading"
  },
  {
    id: 7,
    title: "Gestione dei Fondi",
    icon: CreditCard,
    description: "Per fare trading reale, devi finanziare il tuo conto. Vediamo come depositare e prelevare fondi in modo sicuro e veloce.",
    objectives: [
      "Accedi alla sezione Funds dal menu",
      "Esplora il saldo disponibile e margine utilizzato",
      "Scopri i metodi di deposito disponibili"
    ],
    duration: "5 min",
    route: "/funds",
    ctaLabel: "Gestisci i tuoi Fondi"
  },
  {
    id: 8,
    title: "Le Tue Posizioni Aperte",
    icon: BarChart,
    description: "Monitora tutti i tuoi trade attivi in tempo reale. Qui puoi vedere profitti/perdite, modificare stop loss e chiudere posizioni.",
    objectives: [
      "Visualizza tutte le posizioni aperte",
      "Monitora P&L in tempo reale",
      "Comprendi il margine utilizzato"
    ],
    duration: "4 min",
    route: "/open-positions",
    ctaLabel: "Controlla le Posizioni"
  },
  {
    id: 9,
    title: "Storico delle Transazioni",
    icon: FileText,
    description: "Analizza il tuo storico di trading per imparare dai successi e dagli errori. Ogni trade è una lezione preziosa!",
    objectives: [
      "Esplora le posizioni chiuse",
      "Analizza performance e statistiche",
      "Comprendi i costi di trading"
    ],
    duration: "3 min",
    route: "/closed-positions",
    ctaLabel: "Analizza lo Storico"
  },
  {
    id: 10,
    title: "Supporto e Assistenza",
    icon: MessageSquare,
    description: "Hai bisogno di aiuto? Il nostro team di supporto è sempre disponibile. Scopri come contattarci e trovare risposte alle tue domande.",
    objectives: [
      "Accedi alla sezione Supporto",
      "Scopri i canali di assistenza disponibili",
      "Impara a utilizzare la chat e i ticket"
    ],
    duration: "3 min",
    route: "/support",
    ctaLabel: "Contatta il Supporto"
  },
  {
    id: 11,
    title: "Tutorial Completato!",
    icon: Play,
    description: "Complimenti! Hai completato il tutorial completo della piattaforma di trading. Ora conosci tutti gli strumenti e le funzionalità per fare trading in sicurezza.",
    objectives: [
      "Hai esplorato l'interfaccia di trading",
      "Hai imparato ad analizzare i grafici",
      "Sai come gestire i tuoi fondi",
      "Conosci il social trading",
      "Hai scoperto il supporto disponibile"
    ],
    duration: "1 min",
    route: "/trade",
    ctaLabel: "Inizia a Fare Trading!"
  }
];