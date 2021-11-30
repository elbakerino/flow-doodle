import React, { memo } from 'react'
import { FlowToolbarNode } from '@flow-doodle/mui/FlowToolbar/Toolbars/FlowToolbarNode'
import { FlowToolbarPane, FlowToolbarPaneHistory } from '@flow-doodle/mui/FlowToolbar/Toolbars/FlowToolbarPane'
import { FlowToolbarSave } from '@flow-doodle/mui/FlowToolbar/Toolbars/FlowToolbarSave'
import { FlowState, FlowStateDataScopes, FlowStateType, FlowStateView } from '@flow-doodle/core/FlowTypes'

const FlowToolbarBase = <FSD extends FlowStateDataScopes = FlowStateDataScopes, FV extends FlowStateView = FlowStateView, FS extends FlowState<FSD, FV> = FlowState<FSD, FV>, FST extends FlowStateType<FSD, FV, FS> = FlowStateType<FSD, FV, FS>>(
    {save}: {
        save: (fs: FST) => Promise<boolean>
    },
): React.ReactElement => {
    return <>
        <FlowToolbarNode/>

        <FlowToolbarSave<FSD, FV, FS, FST>
            save={save}
        />

        <FlowToolbarPaneHistory/>

        <FlowToolbarPane/>
    </>
}

export const FlowToolbar = memo(FlowToolbarBase)
