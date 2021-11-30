import React from 'react'
import { CssBaseline, MuiThemeProvider } from '@material-ui/core'
import { FlowDoodle } from './FlowDoodle'
import { Icon1Provider } from '@icon1/react'
import { customTheme } from './theme'

const theme = customTheme('#4f2ab5')

export const App: React.ComponentType<{}> = () => {
    const scrollWrapper = React.useRef<HTMLDivElement | null>(null)
    const [themeId] = React.useState<'dark' | 'light'>('dark')

    const [t, sT] = React.useState(theme[themeId])
    React.useEffect(() => {
        sT({...theme[themeId]})
    }, [sT, themeId])

    return <MuiThemeProvider theme={t}>
        <CssBaseline/>
        <div
            ref={scrollWrapper}
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                width: '100vw',
                position: 'relative',
                color: '#ffffff',
                overflowY: 'auto',
                overflowX: 'hidden',
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
                <Icon1Provider api={'http://localhost:3030'}>
                    <FlowDoodle
                        contentContainerRef={scrollWrapper}
                    />
                </Icon1Provider>
            </div>

            <div style={{margin: 'auto auto 8px auto'}}>
                <p>by <a href={'https://mlbr.xyz'}>Michael Becker</a></p>
            </div>
        </div>
    </MuiThemeProvider>
}
