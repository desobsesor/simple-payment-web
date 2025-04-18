import { CheckCircle, Error as ErrorIcon, HourglassEmpty, Pending } from '@mui/icons-material';
import { Box, CircularProgress, Fade, Paper, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { PaymentStatus } from '../../../../types/types';

interface PaymentSummaryProps {
    status: PaymentStatus;
    transactionId?: string;
    errorMessage?: string;
}

export const PaymentSummary = ({ status, transactionId, errorMessage }: PaymentSummaryProps) => {
    const steps = ['Started', 'Processing', 'Completed'];

    // Get active step based on payment status
    const getActiveStep = () => {
        switch (status) {
            case 'idle': return 0;
            case 'processing': return 1;
            case 'approved':
            case 'pending':
            case 'rejected': return 2;
            default: return 0;
        }
    };

    // Get status icon based on payment status
    const getStatusIcon = () => {
        switch (status) {
            case 'idle': return <HourglassEmpty sx={{ fontSize: 60, color: '#2196f3' }} />;
            case 'processing': return <CircularProgress size={60} sx={{ color: '#2196f3' }} />;
            case 'approved': return <CheckCircle sx={{ fontSize: 60, color: '#4CAF50' }} />;
            case 'pending': return <Pending sx={{ fontSize: 60, color: '#FF9800' }} />;
            case 'rejected': return <ErrorIcon sx={{ fontSize: 60, color: '#F44336' }} />;
            default: return <HourglassEmpty sx={{ fontSize: 60, color: '#2196f3' }} />;
        }
    };

    // Get status message based on payment status
    const getStatusMessage = () => {
        switch (status) {
            case 'idle': return 'Preparing transaction...';
            case 'processing': return 'Processing payment...';
            case 'approved': return 'Payment successfully approved';
            case 'pending': return 'Payment pending verification';
            case 'rejected': return errorMessage || 'Payment rejected';
            default: return 'Preparing transaction...';
        }
    };

    // Get status description based on payment status
    const getStatusDescription = () => {
        switch (status) {
            case 'idle': return 'We are preparing your transaction. Please wait...';
            case 'processing': return 'Your payment is being processed. This may take a few moments...';
            case 'approved': return 'Your payment has been approved. Thank you for your purchase!';
            case 'pending': return 'Your payment is pending verification. We will notify you when it is completed.';
            case 'rejected': return 'Sorry, your payment has been rejected. Please try another payment method.';
            default: return 'We are preparing your transaction. Please wait...';
        }
    };

    // Get background color based on payment status
    const getBackgroundColor = () => {
        switch (status) {
            case 'idle': return 'rgba(33, 150, 243, 0.1)';
            case 'processing': return 'rgba(33, 150, 243, 0.1)';
            case 'approved': return 'rgba(76, 175, 80, 0.1)';
            case 'pending': return 'rgba(255, 152, 0, 0.1)';
            case 'rejected': return 'rgba(244, 67, 54, 0.1)';
            default: return 'rgba(33, 150, 243, 0.1)';
        }
    };

    // Get border color based on payment status
    const getBorderColor = () => {
        switch (status) {
            case 'idle': return 'rgba(33, 150, 243, 0.3)';
            case 'processing': return 'rgba(33, 150, 243, 0.3)';
            case 'approved': return 'rgba(76, 175, 80, 0.3)';
            case 'pending': return 'rgba(255, 152, 0, 0.3)';
            case 'rejected': return 'rgba(244, 67, 54, 0.3)';
            default: return 'rgba(33, 150, 243, 0.3)';
        }
    };

    return (
        <Fade in={true}>
            <Box sx={{ width: '100%', mt: 3 }}>
                <Stepper activeStep={getActiveStep()} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Paper
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    elevation={1}
                    sx={{
                        mt: 3,
                        p: 3,
                        borderRadius: 2,
                        bgcolor: getBackgroundColor(),
                        border: `1px solid ${getBorderColor()}`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}
                >
                    <Box sx={{ mb: 2 }}>
                        {getStatusIcon()}
                    </Box>

                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                        {getStatusMessage()}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {getStatusDescription()}
                    </Typography>

                    {transactionId && status !== 'idle' && status !== 'processing' && (
                        <Typography variant="body2" sx={{
                            fontFamily: 'monospace',
                            bgcolor: 'rgba(0, 0, 0, 0.05)',
                            p: 1,
                            borderRadius: 1,
                            width: '100%'
                        }}>
                            Transaction ID: {transactionId}
                        </Typography>
                    )}
                </Paper>
            </Box>
        </Fade>
    );
};