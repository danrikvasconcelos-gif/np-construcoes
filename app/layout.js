import { Cormorant_Garamond, Outfit } from 'next/font/google';
import './globals.css';

const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--f-display' });
const body = Outfit({ subsets: ['latin'], variable: '--f-body' });

const base = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(base),
  openGraph: { title: 'NP Construções', description: 'Apartamentos e casas à venda. Possibilidade de zero de entrada.', images: ['/logo-np-construcoes-fundo-azul.png'], locale: 'pt_BR', type: 'website' },
  title: 'NP Construções | Casas e apartamentos à venda',
  description: 'Apartamentos e casas modernas com possibilidade de zero de entrada pelo Minha Casa Minha Vida. Fale com a NP Construções.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
