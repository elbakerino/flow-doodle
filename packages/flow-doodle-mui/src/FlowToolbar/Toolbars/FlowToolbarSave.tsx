import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import { CircularProgress } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import IcCheck from '@material-ui/icons/Check'
import React from 'react'
import { useFlowState } from '@flow-doodle/core/FlowContext'
import { FlowState, FlowStateDataScopes, FlowStateType, FlowStateView } from '@flow-doodle/core/FlowTypes'

export const FlowToolbarSave = <FSD extends FlowStateDataScopes = FlowStateDataScopes, FV extends FlowStateView = FlowStateView, FS extends FlowState<FSD, FV> = FlowState<FSD, FV>, FST extends FlowStateType<FSD, FV, FS> = FlowStateType<FSD, FV, FS>>(
    {save}: {
        save: (fs: FST) => Promise<boolean>
    },
): React.ReactElement => {
    const flowState = useFlowState<FSD, FV, FS, FST>()
    const [saving, setSaving] = React.useState<number>(0)
    return <>
        <Box
            // this sizing enforces a safe zone around SAVE, so no chart interaction happens unseens just before saving
            mx={1} p={1}
            style={{
                display: 'flex',
                position: 'absolute',
                zIndex: 2,
                bottom: 0,
                left: 0,
            }}
        >
            <Button
                size={'medium'} style={{marginTop: 4}}
                disabled={saving === 1 || saving === 2}
                onClick={() => {
                    setSaving(1)
                    save(flowState).then((res) => {
                        if(res) {
                            setSaving(2)
                            window.setTimeout(() => {
                                setSaving(0)
                            }, 1700)
                        } else {
                            setSaving(3)
                        }
                    })
                }}
            >save</Button>

            {saving === 1 ? <CircularProgress size={30}/> : null}

            {saving === 2 ? <Typography variant={'body2'} style={{marginLeft: 6}}><IcCheck fontSize={'inherit'}/> saved</Typography> : null}
        </Box>
    </>
}
