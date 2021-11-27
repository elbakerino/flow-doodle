import React from 'react'
import { FlowDoodle } from './FlowDoodle'

export const App: React.ComponentType<{}> = () => {
    const scrollWrapper = React.useRef<HTMLDivElement | null>(null)
    return <div
        ref={scrollWrapper}
        style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100vw',
            position: 'relative',
            background: '#081717',
            color: '#ffffff',
            overflow: 'auto',
        }}
    >
        <div style={{padding: '9px 12px', display: 'flex'}}>
            <h1 style={{fontWeight: 600, fontSize: '1.125rem', marginBottom: 8}}>Flow Doodle</h1>
            <p style={{
                fontWeight: 300, fontSize: '0.85rem',
                margin: 'auto 0 auto auto',
                display: 'flex',
            }}>
                <a
                    href={'https://github.com/elbakerino/flow-doodle'}
                    style={{
                        fontWeight: 300, fontSize: '0.85rem',
                        marginTop: 0,
                        marginLeft: 4,
                    }}
                >GitHub</a>
            </p>
        </div>

        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                height: '100%',
            }}
        >
            <FlowDoodle
                contentContainerRef={scrollWrapper}
            />
        </div>

        <div style={{margin: 'auto auto 8px auto'}}>
            <p>by <a href={'https://mlbr.xyz'}>Michael Becker</a></p>
        </div>
    </div>
}