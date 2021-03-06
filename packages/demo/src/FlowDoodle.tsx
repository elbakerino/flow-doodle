import React, { memo } from 'react'
import { FlowRenderer, FlowRendererProps } from '@flow-doodle/core/FlowRenderer'
import { FlowState, FlowStateDataScopes, FlowStateType, FlowStateView } from '@flow-doodle/core/FlowTypes'
import { FlowContextProvider } from '@flow-doodle/core/FlowContext'
import { EdgeTypesType } from 'react-flow-renderer'
import { EdgeInteractive } from '@flow-doodle/mui/FlowEdges/EdgeInteractive'
import { FlowToolbar } from '@flow-doodle/mui/FlowToolbar/FlowToolbar'
import { FlowNoticer } from '@flow-doodle/mui/FlowNoticer/FlowNoticer'
import { buildViewList } from '@flow-doodle/core/FlowStateActionHandler'
import { FlowHistoryProvider, useFlowHistoryMaker } from '@flow-doodle/core/FlowHistory'
import { NamedColorsProvider } from 'named-color-maps'
import { green, grey } from '@material-ui/core/colors'
import useTheme from '@material-ui/core/styles/useTheme'
import { flowBoxContentColorMap } from '@flow-doodle/mui/FlowNodeBox'
import { FlowToolbarProvider, useFlowToolbar } from '@flow-doodle/core/FlowToolbarProvider'
import { NodeCardLabel, NodeCardLabelFlowStateDataScopes } from '@flow-doodle/mui/FlowNodes/NodeCardLabel'
import { NodeCardNote, NodeCardNoteFlowStateDataScopes } from '@flow-doodle/mui/FlowNodes/NodeCardNote'
import { parseHandleId } from '@flow-doodle/core/FlowNodeHelper/parseHandleId'
import { NodeSelector } from '@flow-doodle/mui/FlowNodes/NodeSelector'

export interface CustomFlowStateDataScopes extends FlowStateDataScopes, NodeCardLabelFlowStateDataScopes, NodeCardNoteFlowStateDataScopes {
    //entity: NodeEntityData
}

const nodeTypes: FlowRendererProps<CustomFlowStateDataScopes>['nodeTypes'] = {
    _selector: NodeSelector,
    card_label: NodeCardLabel,
    card_note: NodeCardNote,
}

const edgeTypes: EdgeTypesType = {
    default: EdgeInteractive,
}

const getEdgeType: FlowRendererProps<CustomFlowStateDataScopes>['getEdgeType'] = (connection) => {
    const {action: sourceHandleAction, type: sourceHandleType} = parseHandleId(connection.sourceHandle) || {}
    const {type: targetHandleType} = parseHandleId(connection.targetHandle) || {}
    if(sourceHandleType === '_prop' && targetHandleType === '_prop') {
        if(sourceHandleAction === 'out') {
            return 'entity_property_connection'
        }
    }
    return 'default'
}

export type CustomFlowState = FlowState<CustomFlowStateDataScopes>
export type CustomFlowStateType = FlowStateType<CustomFlowStateDataScopes>

const shadedColors = {green, grey}

const colorMaps = {
    flow_box: flowBoxContentColorMap,
}

const save = (fs: any) => {
    console.log(fs?.toJS())
    return Promise.resolve(true)
}

export const FlowDoodle: React.ComponentType<{
    contentContainerRef: React.MutableRefObject<HTMLDivElement | null>
}> = (
    {
        contentContainerRef,
    },
) => {
    const [flowState, setFlowStateState] = React.useState<CustomFlowStateType>(() =>
        buildViewList<CustomFlowStateDataScopes>([]),
    )

    const {setFlowState, ...history} = useFlowHistoryMaker<CustomFlowStateDataScopes>(setFlowStateState, flowState)

    const {palette} = useTheme()

    const colorPalette = React.useMemo(() => ({
        primary: palette.primary,
        secondary: palette.secondary,
        error: palette.error,
        warning: palette.warning,
        info: palette.info,
        success: palette.success,
        background: palette.background,
    }), [palette])

    console.log(flowState.toJS())

    return <NamedColorsProvider
        shadedColors={shadedColors}
        colorMaps={colorMaps}
        palette={colorPalette}
    >
        <FlowHistoryProvider {...history}>
            <FlowContextProvider<CustomFlowStateDataScopes>
                update={setFlowState}
                flowState={flowState}
                container={contentContainerRef}
            >
                <FlowToolbarProvider>
                    <FlowToolbar save={save}/>
                    <FlowNoticer
                        showEmptyNotice={((flowState?.get('viewList') as CustomFlowState['viewList'])?.length || 0) < 1}
                    />
                    <EnhancedFlowRenderer<CustomFlowStateDataScopes>
                        viewList={flowState.get('viewList') as CustomFlowState['viewList']}
                        setFlowState={setFlowState}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        getEdgeType={getEdgeType}
                    />
                </FlowToolbarProvider>
            </FlowContextProvider>
        </FlowHistoryProvider>
    </NamedColorsProvider>
}

const EnhancedFlowRendererBase = <FSD extends FlowStateDataScopes, FV extends FlowStateView = FlowStateView>(
    props: React.PropsWithChildren<FlowRendererProps<FSD, FV>>,
): React.ReactElement => {
    const {snapGrid, snapToGrid} = useFlowToolbar()
    return <FlowRenderer<FSD, FV>
        snapToGrid={snapToGrid}
        snapGrid={snapGrid}
        {...props}
    />
}
const EnhancedFlowRenderer = memo(EnhancedFlowRendererBase) as typeof EnhancedFlowRendererBase
