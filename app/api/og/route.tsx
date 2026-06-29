import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #0a0400 0%, #1a0800 50%, #2d0f00 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '40px',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {/* Left decorative card */}
        <div
          style={{
            position: 'absolute',
            left: '40px',
            top: '120px',
            width: '240px',
            height: '390px',
            border: '2px solid #f59e0b',
            borderRadius: '25px',
            opacity: 0.3,
          }}
        />

        {/* Key icon background */}
        <div
          style={{
            position: 'absolute',
            left: '80px',
            top: '160px',
            width: '160px',
            height: '300px',
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '120px',
          }}
        >
          🔑
        </div>

        {/* Main content */}
        <div style={{ marginLeft: '300px', textAlign: 'left', width: '800px' }}>
          {/* Title */}
          <div
            style={{
              fontSize: '88px',
              fontWeight: 'bold',
              marginBottom: '20px',
              letterSpacing: '-2px',
            }}
          >
            Chaveiro Pro
          </div>

          {/* Accent line + subtitle */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '40px' }}>
            <div
              style={{
                width: '8px',
                height: '50px',
                background: 'linear-gradient(to bottom, #f59e0b, #d97706)',
                borderRadius: '4px',
              }}
            />
            <div style={{ fontSize: '48px', color: '#fbbf24', fontWeight: '600' }}>
              Gestão Completa
            </div>
          </div>

          {/* Features */}
          <div style={{ fontSize: '28px', lineHeight: '1.8', marginBottom: '40px' }}>
            <div>✓ Controle de Estoque</div>
            <div>✓ Gestão de Vendas</div>
            <div>✓ Segurança Garantida</div>
          </div>
        </div>

        {/* CTA Button */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '370px',
            right: '40px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            padding: '25px',
            borderRadius: '20px',
            fontSize: '36px',
            fontWeight: '700',
            color: '#0a0400',
            textAlign: 'center',
            border: '3px solid #fbbf24',
          }}
        >
          15 Dias Grátis • Sem Cartão de Crédito 🔑
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
