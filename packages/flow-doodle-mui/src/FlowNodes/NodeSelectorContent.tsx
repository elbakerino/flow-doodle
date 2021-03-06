import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MuiList from '@material-ui/core/List'
import React from 'react'
import { useFlowActions } from '@flow-doodle/core/FlowContext'
import { NodeCardLabelFlowStateDataScopes } from './NodeCardLabel'

export interface NodeSelectorContentProps {
    type: string
    id: string
}

export const NodeSelectorContent: React.ComponentType<NodeSelectorContentProps> = ({id}) => {
    const {switchType} = useFlowActions<NodeCardLabelFlowStateDataScopes>()
    return <MuiList dense style={{minWidth: 100}}>
        <ListItem
            onClick={() =>
                switchType(id, 'card_label')
            }
            button selected
        >
            <ListItemText primary={'Label'}/>
        </ListItem>
        <ListItem
            onClick={() => {
                switchType(id, 'card_note')
            }}
            button
        >
            <ListItemText primary={'Note'}/>
        </ListItem>
    </MuiList>
}
