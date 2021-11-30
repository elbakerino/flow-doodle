import React, { memo } from 'react'
import { NodeBox, NodeBoxContent } from '@flow-doodle/mui/FlowNodeBox'
import { NodeTagOuter } from '@flow-doodle/mui/NodeTagOuter'
import IcSwitch from '@material-ui/icons/SwapHoriz'
import { calcPxByView, calcPyByView } from '@flow-doodle/mui/FlowNodeBox/NodeBoxHelper'
import { NodeSelectorContent, NodeSelectorContentProps } from '@flow-doodle/mui/FlowNodes/NodeSelectorContent'
import { FlowNodeType, FlowStateDataScopes, FlowStateViewData } from '@flow-doodle/core/FlowTypes'
import { NodeCardNoteData } from '@flow-doodle/mui/FlowNodes/NodeCardNote'

export interface NodeSelectorProps {
    isDragging: boolean
    selected: boolean
    NodeSelectorContent?: React.ComponentType<NodeSelectorContentProps>
}

export interface NodeCardSelectorFlowStateDataScopes extends FlowStateDataScopes {
    _selector: NodeCardNoteData
}

export const NodeSelectorBase: React.ComponentType<FlowNodeType<NodeCardSelectorFlowStateDataScopes, '_selector', FlowStateViewData> & NodeSelectorProps> = (
    {
        selected,
        isDragging,
        type,
        id,
        data,
        NodeSelectorContent: CustomNodeSelector,
    },
): React.ReactElement => {
    // todo: replace with injectable FlowContext components
    const NodeSelectorComp = CustomNodeSelector || NodeSelectorContent
    const view = data?.view
    return <NodeBox
        isDragging={isDragging}
    >
        <NodeTagOuter
            label={<><IcSwitch fontSize={'inherit'}/> Select</>}
            highlight
        />

        <NodeBoxContent
            type={type} id={id}
            selected={selected}
            allowClicks
            px={calcPxByView(view)}
            py={calcPyByView(view)}
            {...view}
            boxStyles={{
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <NodeSelectorComp
                id={id}
                type={type}
            />
        </NodeBoxContent>
    </NodeBox>
}
export const NodeSelector = memo(NodeSelectorBase)
