import { Alert, Snackbar } from '@mui/material';
import { useError } from '../../contexts/ErrorContext';

const ErrorNotification = () => {
    const { error, clearError } = useError();

    return (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={clearError}>
            <Alert severity="error">{error}</Alert>
        </Snackbar>
    );
};

export default ErrorNotification;