import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'

export const alt = 'Pet Care Studio | Estética Canina Profesional'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: '#040507', // Negro profundo para máximo contraste
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px', // Mayor espacio negativo para elegancia
                    boxSizing: 'border-box',
                }}
            >
                {/* Gallery Technical Frame */}
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.1)', // Línea exterior plateada sutil
                        borderRadius: '4px',
                        background: '#090B0F',
                        position: 'relative',
                    }}
                >
                    {/* Inner Accent Frame */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '4px',
                            left: '4px',
                            right: '4px',
                            bottom: '4px',
                            border: '1px solid rgba(28, 113, 132, 0.3)', // Línea interior de marca
                            borderRadius: '2px',
                        }}
                    />

                    {/* Glow Effect Background */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '800px',
                            height: '600px',
                            background: 'radial-gradient(circle, rgba(0, 150, 255, 0.1) 0%, transparent 70%)',
                            transform: 'translate(-50%, -50%)',
                            borderRadius: '50%',
                            display: 'flex',
                        }}
                    />

                    {/* Logo Container */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <img
                            src={`https://petcarestudio.vercel.app/icons/icon.png`}
                            alt="Pet Care Studio Logo"
                            width="468"
                            height="468"
                            style={{
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))',
                            }}
                        />
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
