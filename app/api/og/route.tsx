import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0400 0%, #1a0800 50%, #2d0f00 100%)',
          width: '1200px',
          height: '630px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '60px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {/* Left side - Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '300px',
            height: '300px',
            background: 'rgba(245, 158, 11, 0.15)',
            borderRadius: '20px',
            border: '3px solid #f59e0b',
          }}
        >
          <div
            style={{
              fontSize: '180px',
              fontWeight: 'bold',
            }}
          >
            🔑
          </div>
        </div>

        {/* Right side - Text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            flex: 1,
            marginLeft: '40px',
          }}
        >
          <h1
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0',
              lineHeight: '1.1',
            }}
          >
            Chaveiro Pro
          </h1>

          <p
            style={{
              fontSize: '48px',
              color: '#fbbf24',
              margin: '0',
              fontWeight: '600',
            }}
          >
            Gestão Completa
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              marginTop: '20px',
            }}
          >
            <p style={{ color: 'white', fontSize: '24px', margin: '0' }}>
              ✓ Controle de Estoque
            </p>
            <p style={{ color: 'white', fontSize: '24px', margin: '0' }}>
              ✓ Gestão de Vendas
            </p>
            <p style={{ color: 'white', fontSize: '24px', margin: '0' }}>
              ✓ 15 Dias Grátis
            </p>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
