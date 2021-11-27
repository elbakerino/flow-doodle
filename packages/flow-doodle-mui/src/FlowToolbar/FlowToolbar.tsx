import React, { memo } from 'react'
import { FlowToolbarNode } from './Toolbars/FlowToolbarNode'
import { FlowToolbarPane, FlowToolbarPaneHistory } from './Toolbars/FlowToolbarPane'
import { FlowToolbarSave } from './Toolbars/FlowToolbarSave'

const FlowToolbarBase: React.ComponentType<{
    save: () => void
}> = (
    {
        save,
    },
) => {
    return <>
        <FlowToolbarNode/>

        <FlowToolbarSave
            save={save}
        />

        <FlowToolbarPaneHistory/>

        <FlowToolbarPane/>
    </>
}

export const FlowToolbar = memo(FlowToolbarBase)
