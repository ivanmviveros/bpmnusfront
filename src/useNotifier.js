import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useSnackbar } from 'notistack';
import { selectNotifications, removeSnackbar } from 'features/frame/mainFrameSlice';

let displayed = [];

const useNotifier = () => {
    const dispatch = useDispatch();
    const notifications = useSelector(selectNotifications);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const storeDisplayed = (id) => {
        displayed = [...displayed, id];
    };

    const removeDisplayed = (id) => {
        displayed = [...displayed.filter(key => id !== key)];
    };

    React.useEffect(() => {
        notifications.forEach(({ key, message, options = {}, dismissed = false }) => {
            if (dismissed) {
                // dismiss snackbar using notistack
                closeSnackbar(key);
                return;
            }

            // do nothing if snackbar is already displayed
            if (displayed.includes(key)) return;

            // display snackbar using notistack
            enqueueSnackbar(message, {
                key,
                ...options,
                action: key => (
                    <IconButton aria-label="Cerrar alerta" onClick={() => closeSnackbar(key)}>
                        <CloseIcon />
                    </IconButton>
                ),
                onClose: (event, reason, myKey) => {
                    if (options.onClose) {
                        options.onClose(event, reason, myKey);
                    }
                },
                onExited: (event, myKey) => {
                    // remove this snackbar from redux store
                    dispatch(removeSnackbar(myKey));
                    removeDisplayed(myKey);
                },
            });

            // keep track of snackbars that we've displayed
            storeDisplayed(key);
        });
    }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);
};

export default useNotifier;
