import Popover from '@material-ui/core/Popover'
import React, { memo } from 'react'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { Icon1IconDetails } from '@icon1/core'
import { Icon1Picker } from '@icon1/mui'
import IcDelete from '@material-ui/icons/Delete'
import { FlowStateDataScopes, FlowStateView } from '@flow-doodle/core/FlowTypes'
import { FlowToolbarEditProps } from '../FlowToolbarEdit'
import MuiLink from '@material-ui/core/Link'
import IcSearch from '@material-ui/icons/Search'
import IcColorize from '@material-ui/icons/ColorLens'
import Button from '@material-ui/core/Button'
import { BlockPicker } from 'react-color'
import { useNamedColors } from 'named-color-maps'
import useTheme from '@material-ui/core/styles/useTheme'

export const FlowToolbarEditIconBase = <FSD extends FlowStateDataScopes>(
    {
        icon,
        showEdit,
        setShowEdit,
        onClose,
        selectedElement,
        updateView,
        colorMapId = 'flow_box',
        containerRef,
    }: {
        icon: FlowStateView['icon'] | undefined
        colorMapId?: string
        containerRef?: React.MutableRefObject<HTMLDivElement | null>
    } & FlowToolbarEditProps<FSD>,
): React.ReactElement => {
    const [provider, setProvider] = React.useState<'simple-icons' | 'material-ui'>('simple-icons')
    const [showColor, setShowColor] = React.useState<undefined | Element>()
    const {palette, typography} = useTheme()
    const {getNamedColor, getColorsInHex} = useNamedColors(colorMapId)
    const [iconUrlInvalid, setIconUrlInvalid] = React.useState<boolean>(false)
    const [activeSearch, setActiveSearch] = React.useState('')
    const [iconSearch, setIconSearch] = React.useState<{
        search: string
    } | undefined>()

    const open = Boolean(showEdit)
    React.useEffect(() => {
        setIconSearch(undefined)
    }, [open, setIconSearch])

    const iconSearchSearch = iconSearch?.search
    React.useEffect(() => {
        const timer = window.setTimeout(() => {
            setActiveSearch(iconSearchSearch || '')
        }, 80)
        return () => window.clearTimeout(timer)
    }, [iconSearchSearch, setActiveSearch])

    // @ts-ignore
    const sType = selectedElement?.type
    const sId = selectedElement?.id
    const onSelectIcon = React.useCallback((provider, icon: Icon1IconDetails) => {
        if(!sType || !sId) return
        updateView(
            sId,
            (view) => ({
                ...view,
                icon: view.icon?.provider === provider && view.icon?.name === icon.id ? undefined : {
                    name: icon.id,
                    provider: provider,
                    color: icon.colorDefault || view.icon?.color || undefined,
                },
            }),
        )
    }, [updateView, sType, sId])

    return <Popover
        open={open}
        anchorEl={showEdit || undefined}
        keepMounted={false}
        container={containerRef?.current}
        onClose={() => {
            setShowEdit(undefined)
            window.setTimeout(() => onClose && onClose(), 10)
        }}
        anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
    >
        <Paper elevation={1}>
            <Box p={1} style={{minWidth: 220}}>
                <Box style={{display: 'flex', flexDirection: 'column'}}>
                    <Select
                        value={provider}
                        onChange={(e) => setProvider(e.target.value as 'simple-icons' | 'material-ui')}
                        fullWidth
                    >
                        <MenuItem value={'simple-icons'}>Brand Icons</MenuItem>
                        <MenuItem value={'material-ui'}>Material UI</MenuItem>
                    </Select>

                    <Typography style={{width: '100%'}} variant={'caption'}>
                        {'icons by '}
                        {provider === 'simple-icons' ? <MuiLink
                            href={'https://simpleicons.org'}
                            color={'inherit'}
                            target={'_blank'} rel={'noopener noreferrer'}
                        >simpleicons.org</MuiLink> : null}
                        {provider === 'material-ui' ? <MuiLink
                            href={'https://material.io/icons'}
                            color={'inherit'}
                            target={'_blank'} rel={'noopener noreferrer'}
                        >material.io</MuiLink> : null}
                    </Typography>
                </Box>
                <Box mb={2} style={{display: 'flex', flexDirection: 'column'}}>
                    <Box>
                        <TextField
                            size={'small'}
                            fullWidth
                            value={iconSearch?.search || ''}
                            onChange={e => setIconSearch({
                                search: e.target.value,
                            })}
                            InputProps={{
                                endAdornment: <IcSearch/>,
                            }}
                        />
                    </Box>

                    <Box mt={2}>
                        <Icon1Picker
                            provider={provider}
                            selected={icon?.provider === provider ? icon?.name : undefined}
                            search={activeSearch}
                            onSelect={onSelectIcon}
                        />
                    </Box>

                    <Box mt={1}>
                        <Box style={{display: 'flex'}}>
                            <Button
                                size={'small'} fullWidth
                                onClick={(e) => setShowColor(e.currentTarget)}
                                endIcon={<IcColorize style={{color: getNamedColor(icon?.color)?.color || icon?.color}}/>}
                            >
                                Color
                            </Button>
                            <Button
                                size={'small'} fullWidth
                                onClick={() => {
                                    if(!selectedElement) return
                                    updateView(
                                        selectedElement.id,
                                        (view) => ({
                                            ...view,
                                            icon: {
                                                ...(view.icon || {}),
                                                color: undefined,
                                            },
                                        }),
                                    )
                                }}
                            >
                                Clear Color
                            </Button>
                        </Box>
                    </Box>
                </Box>

                <Popover
                    open={Boolean(showColor)}
                    anchorEl={showColor || undefined}
                    onClose={() => {
                        setShowColor(undefined)
                        //window.setTimeout(() => onClose && onClose(), 10)
                    }}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <BlockPicker
                        color={getNamedColor(icon?.color, 'background__paper')?.color || ''}
                        styles={{
                            default: {
                                card: {
                                    background: 'transparent',
                                },
                                input: {
                                    background: palette.background.paper,
                                    color: palette.text.primary,
                                    padding: '8px 6px',
                                    fontSize: typography.body2.fontSize,
                                    height: 'auto',
                                    border: '1px solid ' + palette.divider,
                                },
                            },
                        }}
                        colors={getColorsInHex().slice(3)}
                        width={'106px'}
                        onChange={(color) => {
                            if(!selectedElement) return
                            updateView(
                                selectedElement.id,
                                (view) => ({
                                    ...view,
                                    icon: {
                                        ...(view.icon || {}),
                                        color: getNamedColor(color.hex)?.name || color.hex,
                                    },
                                }),
                            )
                        }}
                    />
                </Popover>

                <Box mb={2} style={{display: 'flex'}}>
                    <TextField
                        label={'Icon URL'}
                        type={'url'}
                        error={Boolean(icon?.url && iconUrlInvalid)}
                        size={'small'} fullWidth
                        value={icon?.url || ''}
                        onChange={(e) => {
                            if(!selectedElement) return
                            setIconUrlInvalid(!e.currentTarget.reportValidity())
                            updateView(
                                selectedElement.id,
                                (view) => ({
                                    ...view,
                                    icon: {
                                        url: e.target.value as string,
                                    },
                                }),
                            )
                        }}
                    />

                    <IconButton
                        size={'small'} style={{margin: 'auto 0 auto 8px'}}
                        onClick={() => {
                            if(!selectedElement) return
                            updateView(
                                selectedElement.id,
                                (view) => ({
                                    ...view,
                                    icon: undefined,
                                }),
                            )
                        }}
                    >
                        <IcDelete/>
                    </IconButton>
                </Box>
            </Box>
        </Paper>
    </Popover>
}

export const FlowToolbarEditIcon = memo(FlowToolbarEditIconBase)
