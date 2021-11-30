import React, { memo } from 'react'
import InputBase from '@material-ui/core/InputBase'
import { useFlowActions } from '@flow-doodle/core/FlowContext'
import { FlowNodeType, FlowNodeViewOptions, FlowStateDataScopes, FlowStateViewData, NodeData } from '@flow-doodle/core/FlowTypes'
import { useResponsiveInput } from '@flow-doodle/core/FlowNodeHelper/useResponsiveInput'
import { NodeTagOuter } from '@flow-doodle/mui/NodeTagOuter'
import { NodeBox, NodeBoxContent } from '@flow-doodle/mui/FlowNodeBox'
import MuiLink from '@material-ui/core/Link'
import IcOpenInNew from '@material-ui/icons/OpenInNew'
import { calcPxByView, calcPyByView } from '@flow-doodle/mui/FlowNodeBox/NodeBoxHelper'
import { Icon1Embed } from '@icon1/react'
import { useNamedColors } from 'named-color-maps'
import { handlePreventPaneKeyboardEvent } from '@flow-doodle/core/FlowNodeHelper/handlePreventPaneKeyboardEvent'
import { IconImg } from '@flow-doodle/mui/IconImg'

export interface NodeCardLabelData extends NodeData {
    label: string
}

export interface NodeCardLabelFlowStateDataScopes extends FlowStateDataScopes {
    card_label: NodeCardLabelData
}

export interface NodeCardLabelProps {
    isDragging: boolean
    selected: boolean
    label: string | undefined
    type: 'card_label'
    id: string
    view?: FlowNodeViewOptions
    colorMapId?: string
}

export const NodeCardLabelContentBase: React.ComponentType<NodeCardLabelProps> = (
    {
        selected,
        isDragging, label,
        type,
        id,
        view,
        colorMapId = 'flow_box',
    },
) => {
    const {getNamedColor} = useNamedColors(colorMapId)
    const {width, getWidth} = useResponsiveInput(
        label || '',
        // todo: no hard coded base size
        ((view?.fontSize || 1) * 16) + 'px',
    )
    const inpWidth = getWidth(width) * (view?.fontWeight === 'bold' ? 1.12 : 1)
    const [focus, setFocus] = React.useState(false)
    const {update} = useFlowActions<NodeCardLabelFlowStateDataScopes>()

    const activeIconColor = view?.icon?.color && getNamedColor(view?.icon?.color) ? getNamedColor(view?.icon?.color)?.color || undefined : view?.icon?.color

    React.useEffect(() => {
        if(!selected) {
            setFocus(false)
        }
    }, [selected, setFocus])

    return <NodeBox
        isDragging={isDragging}
    >
        <NodeTagOuter
            label={'Label'}
            highlight={focus}
        />

        <NodeBoxContent
            type={type} id={id}
            selected={selected}
            onFocus={setFocus}
            px={calcPxByView(view)}
            py={calcPyByView(view)}
            {...view}
            boxStyles={{
                display: 'flex',
                alignItems: 'center',
            }}
            clickable={
                view?.link?.target ?
                    <MuiLink
                        href={view?.link?.target}
                        className={'nodrag'}
                        target={'_blank'} rel={'noopener noreferrer'}
                        style={{
                            display: 'flex',
                            padding: '0 4px',
                            fontSize: ((view?.fontSize || 1) * 1.5) + 'rem',
                        }}
                    >
                        {view?.link?.iconUrl ?
                            <img src={view?.link?.iconUrl} style={{height: '1em', width: '1em'}} alt={'Link to ' + view?.link?.target}/> :
                            <IcOpenInNew fontSize={'inherit'}/>}
                    </MuiLink> : null
            }
        >
            <div style={{display: 'flex'}}>
                {view?.icon?.url || view?.icon?.name ?
                    <span
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            marginRight: (view?.fontSize || 1) >= 1.5 ? 16 : 8,
                            fontSize: ((view?.fontSize || 1) * 1.5) + 'rem',
                            color: activeIconColor,
                        }}>
                        {view?.icon?.url ?
                            <IconImg
                                src={view?.icon?.url}
                                title={'Icon'}
                                disableGutters
                                fontSize={'inherit'}
                            /> :
                            view?.icon?.name && view?.icon?.provider ?
                                <Icon1Embed
                                    provider={view?.icon?.provider}
                                    id={view?.icon?.name}
                                    fontSize={'inherit'}
                                    color={'inherit'}
                                /> : null}
                    </span> : null}
                <div style={{display: 'flex', minWidth: 100, width: inpWidth, overflow: 'auto'}}>
                    <InputBase
                        value={label || ''}
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
                        autoFocus={!label}
                        className={'nodrag'}
                        style={{
                            color: 'inherit',
                            fontSize: view?.fontSize + 'rem',
                            fontWeight: view?.fontWeight,
                        }}
                        onChange={(e) => {
                            const v = e.target.value
                            type && update<typeof type>(
                                id,
                                data => ({
                                    ...data,
                                    label: v,
                                }),
                            )
                        }}
                        onKeyPress={handlePreventPaneKeyboardEvent}
                        fullWidth
                    />
                </div>
            </div>
        </NodeBoxContent>
    </NodeBox>
}
const NodeCardLabelContent = memo(NodeCardLabelContentBase)

export type NodeCardLabelBaseProps = FlowNodeType<NodeCardLabelFlowStateDataScopes, 'card_label', FlowStateViewData>

export const NodeCardLabelBase: React.ComponentType<NodeCardLabelBaseProps> = (
    {
        data,
        id, type,
        isDragging,
        selected,
    },
) => {
    const label = data?.data?.label

    return <NodeCardLabelContent
        isDragging={isDragging}
        selected={selected}
        label={label}
        type={type}
        id={id}
        view={data?.view}
    />
}

export const NodeCardLabel = memo(NodeCardLabelBase)
