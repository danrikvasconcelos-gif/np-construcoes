import { getImoveis, WHATSAPP, INSTAGRAM } from '@/lib/store';
import Instagram from '@/components/Instagram';
import ImovelCard from '@/components/ImovelCard';
import ContatoForm from '@/components/ContatoForm';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const imoveis = await getImoveis();
  const zap = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Olá! Vi o site da NP Construções e gostaria de saber mais sobre os imóveis.')}`;
  return (
    <>
      <header className="top">
        <div className="wrap">
          <nav className="nav">
            <a className="logo" href="#" aria-label="NP Construções, início"><img src="/logo-header.png" alt="NP Construções" /></a>
            <div><a href="#imoveis">Imóveis</a><a href="#contato">Proposta</a><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a></div>
          </nav>
          <div className="hero">
            <div>
              <h1>Sua espera acabou. Seu novo lar chegou.</h1>
              <p>Apartamentos e casas modernos, com 2 quartos, varanda, lavanderia e área de lazer com piscina. Possibilidade de zero de entrada pelo Minha Casa Minha Vida.</p>
              <div className="acts">
                <a className="btn" href="#imoveis">Ver imóveis</a>
                <a className="btn ghost" href={zap}>Falar no WhatsApp</a>
              </div>
            </div>
            <div className="facade" aria-hidden={!imoveis[0]}>
              {imoveis[0] ? <img src={imoveis[0].fotos[0]} alt={imoveis[0].titulo} /> :
                <div className="bld">{Array.from({ length: 8 }).map((_, i) => <i key={i} />)}</div>}
            </div>
          </div>
        </div>
        <div className="faixa"><div className="wrap">
          <span>Possibilidade de zero de entrada</span><span>Programa Minha Casa Minha Vida</span><span>Qualidade, conforto e segurança</span>
        </div></div>
      </header>

      <main>
        <section className="sec" id="imoveis"><div className="wrap">
          <h2>Imóveis disponíveis</h2>
          <p className="sub">Toque na foto para ver todas as imagens do imóvel.</p>
          {imoveis.length ? <div className="grid">{imoveis.map((im) => <ImovelCard key={im.id} im={im} whatsapp={WHATSAPP} />)}</div> :
            <div className="vazio">Novos imóveis serão publicados em breve. Fale com nossos corretores no WhatsApp.</div>}
        </div></section>

        <section className="sec contato" id="contato"><div className="wrap cols">
          <div>
            <h2>Receba uma proposta</h2>
            <p style={{ margin: '12px 0 20px' }}>Informe seus dados e um corretor da NP Construções entra em contato pelo WhatsApp com valores e condições.</p>
            <p>WhatsApp: <a href={zap}><b>(85) 98170-0898</b></a></p>
            <p>Instagram: <Instagram url={INSTAGRAM} /></p>
          </div>
          <ContatoForm titulos={imoveis.map((i) => i.titulo)} />
        </div></section>
      </main>
      <footer><div className="wrap"><Instagram url={INSTAGRAM} />NP Construções · O lugar perfeito para construir sua história</div></footer>
      <a className="zap" href={zap} aria-label="Falar no WhatsApp">WhatsApp</a>
    </>
  );
}
