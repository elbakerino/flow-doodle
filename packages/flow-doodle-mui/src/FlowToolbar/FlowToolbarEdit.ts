import React from 'react'
import { FlowElement } from 'react-flow-renderer'
import { FlowContextActionsType } from '@flow-doodle/core/FlowState/FlowContext'
import { FlowStateDataScopes } from '@flow-doodle/core/FlowState/FlowTypes'

export interface FlowToolbarEditProps<FSD extends FlowStateDataScopes, K extends keyof FSD = keyof FSD> {
    showEdit: Element | undefined
    setShowEdit: React.Dispatch<React.SetStateAction<Element | undefined>>
    onClose?: () => void
    selectedElement: undefined | FlowElement<FSD[K][keyof FSD[K]]>
    updateView: FlowContextActionsType<FSD>['updateView']
}
