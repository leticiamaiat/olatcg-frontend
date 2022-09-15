import { FilePresent, Science } from "@mui/icons-material";
import { Button, Grid, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useRequest from "../hooks/useRequest";
import useStepForm from "../hooks/useStepForm";
import { getMessage } from "../services/MessageService";
import { API_ROUTES } from "../routes/Routes";
import ValidationService from "../services/ValidationService";
import OlatcgSnackbar from "./OlatcgSnackbar";
import useStepConditions from "../hooks/useStepConditions";
import useStepResponse from "../hooks/useStepResponse";
import useStepActualPosition from "../hooks/useStepActualPosition";

const HomologySearchFileInputStep = () => {
    const [handleInputChange] = useStepForm();
    const [makeRequest] = useRequest();
    const [getStepActualPosition, setStepActualPosition] = useStepActualPosition();
    const stepForm = useSelector(state => state.stepForm);
    const dispatch = useDispatch();
    const [_, setNextCondition] = useStepConditions();
    const [setStepResponse] = useStepResponse();
    const [colorAlignIcon, setColorAlignIcon] = useState('');
    const [isSnackbarOpened, openSnackbar] = useState(false);
    const [statusSnackbar, setStatusSanckbar] = useState('error');
    const [msgSnackbar, setMsgSnackbar] = useState('');

    useEffect(() => {
        dispatch({
            type: 'SET_NEXT_CONDITION',
            payload: false,
        });
        
        return () => {
            dispatch({
                type: 'RETURN_TO_STEP_CHANGE_CONDITIONS_INITIAL_STATE',
            }); 
        }
    }, [dispatch]);

    useEffect(() => {
        if(!(stepForm.sequenceA && stepForm.sequenceB)){
            dispatch({
                type: 'UPDATE_STEP_FORM',
                payload: {
                    sequenceA: stepForm.sequenceA ? stepForm.sequenceA : '',
                    sequenceB: stepForm.sequenceB ? stepForm.sequenceB : '',
                },
            });
        }
    }, [stepForm, dispatch])

    const showSnackbar = (msg, status) => {
        setMsgSnackbar(msg);
        setStatusSanckbar(status);
        openSnackbar(true);
    }

    const onSuccessAlignment = (data) => {
        setStepResponse(data);
        setNextCondition(true);
        showSnackbar(getMessage('common.label.success'), 'success');
        setStepActualPosition(2);
    }

    const onFailureAlignment = (error) => {
        setNextCondition(false);
        showSnackbar(error.errorDescription, 'error');
    }

    const makeAlignRequest = () => {
        try{
            ValidationService.validateAlignmentForm(stepForm);
            makeRequest(API_ROUTES.ALIGN, 'POST', stepForm, onSuccessAlignment, onFailureAlignment);
        }catch (errorMessage){
            showSnackbar(errorMessage, 'error');
        }
    }

    return <>
        <Stack
            spacing={0}
            sx={{textAlign: 'center', px: 'auto'}}
        >   
            <Typography variant="h4">
                {getMessage('homology.input.label.sequenceFile')}
            </Typography>
            <br/>
            <Button
                variant="outlined"
                component="label"
                sx={{p: 2, border: '2px inset', borderColor: 'primary.light'}}
            >
            <FilePresent sx={{fontSize: 80}} />
            <input
                type="file"
                hidden
            />
            </Button>
        </Stack>
        <OlatcgSnackbar
            isOpened={isSnackbarOpened} 
            onClose={() => openSnackbar(false)}
            status={statusSnackbar}
            msg={msgSnackbar} 
        />
    </>
}

export default HomologySearchFileInputStep;