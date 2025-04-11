import { Alert, AlertColor, AlertProps, Snackbar, SnackbarOrigin } from '@mui/material';
import { ReactNode, createContext, useContext, useState } from 'react';

type NotificationContextType = {
    open: boolean;
    message: string;
    severity: AlertColor;
    showNotification: (message: string, severity?: AlertColor) => void;
    hideNotification: () => void;
};

const NotificationContext = createContext<NotificationContextType>({} as NotificationContextType);

// Define the hook as a named function declaration instead of an arrow function
// This makes it compatible with React Fast Refresh
export function useNotification() {
    return useContext(NotificationContext);
}

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notification, setNotification] = useState<{
        open: boolean;
        message: string;
        severity: AlertColor;
    }>({ open: false, message: '', severity: 'info' });

    const showNotification = (message: string, severity: AlertColor = 'info') => {
        setNotification({ open: true, message, severity });
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    return (
        <NotificationContext.Provider
            value={{
                ...notification,
                showNotification,
                hideNotification,
            }}
        >
            {children}
            <Notification
                open={notification.open}
                message={notification.message}
                severity={notification.severity}
                onClose={hideNotification}
            />
        </NotificationContext.Provider>
    );
};

type NotificationProps = {
    open: boolean;
    message: string;
    severity?: AlertColor;
    duration?: number;
    position?: SnackbarOrigin;
    onClose?: () => void;
    alertProps?: Partial<AlertProps>;
};

/**
* Reusable component for displaying notifications in the application.
* Can be used directly or through the NotificationContext context.
*/
export const Notification = ({
    open,
    message,
    severity = 'info',
    duration = 4000,
    position = { vertical: 'top', horizontal: 'right' },
    onClose,
    alertProps,
}: NotificationProps) => {
    const handleClose = () => {
        if (onClose) onClose();
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={handleClose}
            anchorOrigin={position}
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                variant="filled"
                sx={{ width: { xs: '100%', lg: '70%' } }}
                {...alertProps}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Notification;