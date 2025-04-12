import { CreditCard as CreditCardIcon, Event as EventIcon, Label, Lock as LockIcon, Person as PersonIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    Fade,
    FormHelperText,
    Grid,
    InputAdornment,
    Modal,
    Paper,
    TextField,
    Typography,
    Divider
} from '@mui/material';
import { useEffect, useState } from 'react';
import useUser from '../../../../contexts/UserContext';
import usePaymentMethod from '../../../../contexts/PaymentMethodContext';
import { formatToLocalCurrency } from '../../../../shared/utils/currency';
import { PaymentRequest, PaymentService } from '../../infrastructure/services/PaymentService';
import { PaymentStatus, PaymentSummary } from './PaymentSummary';
import { PaymentMethod } from '../../domain/models/PaymentMethod';
import { PaymentMethodService } from '../../infrastructure/services/PaymentMethodService';
import { SavedPaymentMethodList } from './SavedPaymentMethodList';
interface PaymentCardModalProps {
    open: boolean;
    onClose: () => void;
    productName?: string;
    amount: number;
    cant: number;
    productId: number;
}

interface CardData {
    cardNumber: string;
    cardholderName: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
}

interface PaymentResult {
    status: PaymentStatus;
    transactionId?: string;
    errorMessage?: string;
}

export const PaymentCardModal = ({ open, onClose, productName, amount, cant, productId }: PaymentCardModalProps) => {
    const { user } = useUser();
    const { selectedPaymentMethod, setSelectedPaymentMethod } = usePaymentMethod();
    const [cardData, setCardData] = useState<CardData>({
        cardNumber: '1234567891122233',
        cardholderName: 'Yovany Suárez Silva',
        expiryMonth: '11',
        expiryYear: '26',
        cvv: '987'
    });

    const [errors, setErrors] = useState<Partial<CardData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentResult, setPaymentResult] = useState<PaymentResult>({ status: 'idle' });
    const [showPaymentForm, setShowPaymentForm] = useState(true);
    const [showNewCardForm, setShowNewCardForm] = useState(false);
    const [savedPaymentMethods, setSavedPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
    const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);

    // Initialize services
    const paymentService = new PaymentService();
    const paymentMethodService = new PaymentMethodService();

    useEffect(() => {
        console.log('user in useEffect:', user);
        if (!open) {
            // Reset form when modal closes
            setCardData({
                cardNumber: '1234567891122233',
                cardholderName: 'Yovany Suárez Silva',
                expiryMonth: '11',
                expiryYear: '26',
                cvv: '987'
            });
            setErrors({});
            setIsSubmitting(false);
            setPaymentResult({ status: 'idle' });
            setShowPaymentForm(true);
            setShowNewCardForm(false);
            setSelectedPaymentMethodId(null);
        } else if (open && user?.userId) {
            // Load saved payment methods when modal opens
            loadSavedPaymentMethods();
        }
    }, [open, user]);

    /**
     * Loads saved payment methods for the user.
     * If there are no valid methods, shows the new card form.
     */
    const loadSavedPaymentMethods = async () => {
        if (!user?.userId) return;

        setLoadingPaymentMethods(true);
        try {
            const methods = await paymentMethodService.getUserPaymentMethods(user.userId);

            // Make sure there is always at least one payment method to display
            // If there are no methods or there is an error, we use mock data
            if (methods && methods.length > 0) {
                setSavedPaymentMethods(methods);

                // If there are valid methods, select the default one
                const validMethods = methods.filter(m => !m.isExpired);
                if (validMethods.length > 0) {
                    const defaultMethod = validMethods.find(m => m.isDefault) || validMethods[0];
                    setSelectedPaymentMethodId(defaultMethod.id);
                    setShowNewCardForm(false);
                } else {
                    // If there are no valid methods, show new card form
                    setShowNewCardForm(true);
                }
            } else {
                // If there are no methods, use mock data
                const mockMethods: PaymentMethod[] = [
                    {
                        id: 'pm_mock1',
                        type: 'credit',
                        cardNumber: '4111111111111111',
                        lastFour: '1111',
                        cardholderName: 'Yovany Suárez Silva',
                        expiryMonth: '12',
                        expiryYear: '25',
                        brand: 'visa',
                        isDefault: true,
                        isExpired: false
                    },
                    {
                        id: 'pm_mock2',
                        type: 'credit',
                        cardNumber: '5555555555554444',
                        lastFour: '4444',
                        cardholderName: 'Yovany Suárez Silva',
                        expiryMonth: '10',
                        expiryYear: '24',
                        brand: 'mastercard',
                        isDefault: false,
                        isExpired: false
                    },
                    {
                        id: 'pm_mock3',
                        type: 'debit',
                        cardNumber: '4111111111112222',
                        lastFour: '2222',
                        cardholderName: 'Yovany Suárez Silva',
                        expiryMonth: '03',
                        expiryYear: '23',
                        brand: 'visa',
                        isDefault: false,
                        isExpired: true
                    }
                ];

                setSavedPaymentMethods(mockMethods);
                setSelectedPaymentMethodId('pm_mock1');
                setShowNewCardForm(false);
            }
        } catch (error) {
            console.error('Error loading payment methods:', error);

            // If there is an error, use mock data
            const mockMethods: PaymentMethod[] = [
                {
                    id: 'pm_mock1',
                    type: 'credit',
                    cardNumber: '4111111111111111',
                    lastFour: '1111',
                    cardholderName: 'Yovany Suárez Silva',
                    expiryMonth: '12',
                    expiryYear: '25',
                    brand: 'visa',
                    isDefault: true,
                    isExpired: false
                },
                {
                    id: 'pm_mock2',
                    type: 'credit',
                    cardNumber: '5555555555554444',
                    lastFour: '4444',
                    cardholderName: 'Yovany Suárez Silva',
                    expiryMonth: '10',
                    expiryYear: '24',
                    brand: 'mastercard',
                    isDefault: false,
                    isExpired: false
                }
            ];

            setSavedPaymentMethods(mockMethods);
            setSelectedPaymentMethodId('pm_mock1');
            setShowNewCardForm(false);
        } finally {
            setLoadingPaymentMethods(false);
        }
    };

    const handleChange = (field: keyof CardData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;

        // Format card number with spaces every 4 digits
        if (field === 'cardNumber') {
            value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
            value = value.substring(0, 19); // Limit to 16 digits + 3 spaces
        }

        // Limit month to 2 digits
        if (field === 'expiryMonth') {
            value = value.replace(/\D/g, '').substring(0, 2);
            // Ensure month is between 1-12
            if (value && parseInt(value) > 12) {
                value = '12';
            }
        }

        // Limit year to 2 digits
        if (field === 'expiryYear') {
            value = value.replace(/\D/g, '').substring(0, 2);
        }

        // Limit CVV to 3 digits
        if (field === 'cvv') {
            value = value.replace(/\D/g, '').substring(0, 3);
        }

        setCardData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<CardData> = {};

        // Validate card number (16 digits)
        if (!cardData.cardNumber.replace(/\s/g, '') || cardData.cardNumber.replace(/\s/g, '').length !== 16) {
            newErrors.cardNumber = 'Enter a valid 16-digit card number';
        }

        // Validate cardholder name
        if (!cardData.cardholderName.trim()) {
            newErrors.cardholderName = 'Enter the cardholders name';
        }

        // Validate expiry month
        if (!cardData.expiryMonth || parseInt(cardData.expiryMonth) < 1 || parseInt(cardData.expiryMonth) > 12) {
            newErrors.expiryMonth = 'Invalid month';
        }

        // Validate expiry year
        const currentYear = new Date().getFullYear() % 100; // Get last 2 digits of current year
        if (!cardData.expiryYear || parseInt(cardData.expiryYear) < currentYear) {
            newErrors.expiryYear = 'Invalid year';
        }

        // Validate CVV (3 digits)
        if (!cardData.cvv || cardData.cvv.length !== 3) {
            newErrors.cvv = 'Invalid CVV';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);
            setPaymentResult({ status: 'processing' });
            setShowPaymentForm(false);

            try {
                const paymentRequest: PaymentRequest = {
                    ...cardData,
                    amount,
                    productName,
                    userId: user?.userId,
                    productId: productId,
                    quantity: cant
                };

                // Process payment
                const response = await paymentService.processPayment(paymentRequest);

                // Update payment result
                setPaymentResult({
                    status: response.status,
                    transactionId: response.transactionId,
                    errorMessage: response.errorMessage
                });

                // If payment is pending, check status after a delay
                if (response.status === 'pending' && response.transactionId) {
                    checkPendingPayment(response.transactionId);
                }

                setIsSubmitting(false);

                // Only close modal automatically if payment is approved
                if (response.status === 'approved') {
                    setTimeout(() => onClose(), 3000);
                }
            } catch (error) {
                console.error('Payment error:', error);
                setPaymentResult({
                    status: 'rejected',
                    errorMessage: 'Error processing payment. Please try again.'
                });
                setIsSubmitting(false);
            }
        }
    };

    /**
     * Handles the payment with a saved payment method.
     */
    const handlePayWithSavedMethod = async () => {
        if (!selectedPaymentMethodId || !user?.userId) return;

        setIsSubmitting(true);
        setPaymentResult({ status: 'processing' });
        setShowPaymentForm(false);

        try {
            // Process payment with saved method
            const response = await paymentMethodService.processPaymentWithSavedMethod(
                selectedPaymentMethodId,
                amount,
                productId,
                cant,
                user.userId
            );

            // Update payment result
            setPaymentResult({
                status: 'approved',//response.status, //NOTE: this is a mock response
                transactionId: response.transactionId,
                errorMessage: response.errorMessage
            });

            // If payment is pending, check status after a delay
            if (response.status === 'pending' && response.transactionId) {
                checkPendingPayment(response.transactionId);
            }

            setIsSubmitting(false);

            // Only close modal automatically if payment is approved
            if (response.status === 'approved') {
                setTimeout(() => onClose(), 3000);
            }
        } catch (error) {
            console.error('Payment error with saved method:', error);
            setPaymentResult({
                status: 'rejected',
                errorMessage: 'Error al procesar el pago. Por favor intente nuevamente.'
            });
            setIsSubmitting(false);
        }
    };

    /**
     * Handles adding a new payment method.
     */
    const handleAddNewCard = () => {
        setShowNewCardForm(true);
        setSelectedPaymentMethodId(null);
        // Clear the selected payment method in the context
        setSelectedPaymentMethod(null);
    };

    // Handle selecting a saved payment method
    const handleSelectPaymentMethod = (paymentMethodId: string) => {
        setSelectedPaymentMethodId(paymentMethodId);
        setShowNewCardForm(false);

        // Update the selected payment method in the context
        const selectedMethod = savedPaymentMethods.find(method => method.id === paymentMethodId) || null;
        setSelectedPaymentMethod(selectedMethod);
    };

    /**
     * Checks the status of a pending payment after a delay.
     * @param transactionId The ID of the pending payment transaction.
     */
    const checkPendingPayment = async (transactionId: string) => {
        try {
            // Wait 3 seconds before checking
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Check payment status
            const updatedStatus = await paymentService.checkPaymentStatus(transactionId);

            // Update payment result
            setPaymentResult({
                status: updatedStatus.status,
                transactionId: updatedStatus.transactionId,
                errorMessage: updatedStatus.errorMessage
            });

            // If still pending, check again
            if (updatedStatus.status === 'pending') {
                checkPendingPayment(transactionId);
            } else if (updatedStatus.status === 'approved') {
                // Close modal after 3 seconds if approved
                setTimeout(() => onClose(), 3000);
            }
        } catch (error) {
            console.error('Error checking payment status:', error);
        }
    };

    /**
     * Formats the display card number.
     * If there is a selected payment method and we are showing saved methods,
     * it uses the data from the selected payment method. Otherwise, it uses the form data.
     * @returns The formatted card number.
     */
    const formatDisplayCardNumber = () => {
        // If there is a selected payment method and we are showing saved methods, use that data
        if (selectedPaymentMethod && !showNewCardForm && savedPaymentMethods.length > 0) {
            const digits = selectedPaymentMethod.cardNumber.replace(/\s/g, '');
            return digits.padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim();
        } else {
            // If not, use the form data
            const digits = cardData.cardNumber.replace(/\s/g, '');
            return digits.padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim();
        }
    };

    return (
        <Modal
            open={open}
            onClose={!isSubmitting ? onClose : undefined}
            aria-labelledby="payment-modal-title"
            closeAfterTransition
        >
            <Fade in={open}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: 360 },
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    boxShadow: 24,
                    p: 3,
                    outline: 'none',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}>
                    <Typography id="payment-modal-title" variant="h6" component="h2" align="center" gutterBottom>
                        {showPaymentForm ? 'Credit Card Payment' : 'Payment Summary'}
                    </Typography>
                    <Typography
                        sx={{
                            bgcolor: 'rgba(33, 150, 243, 0.1)',
                            borderRadius: 2,
                            padding: 1,
                            color: '#0d47a1',
                            border: '1px solid rgba(33, 150, 243, 0.3)',
                            fontWeight: 'medium',
                            mb: 2
                        }}
                        variant="body2"
                        component="p"
                        align="center"
                        gutterBottom
                    >
                        <Label style={{ fontWeight: 'bold', verticalAlign: 'middle' }} /> {productName}, Qty: {cant}, Total: {formatToLocalCurrency(amount, 'en-US')}
                    </Typography>

                    {/* Show payment methods section when showing payment form */}
                    {showPaymentForm && (
                        <>
                            {/* Show saved payment methods if available and not showing new card form */}
                            {savedPaymentMethods.length > 0 && !showNewCardForm && (
                                <>
                                    <SavedPaymentMethodList
                                        paymentMethods={savedPaymentMethods}
                                        selectedPaymentMethodId={selectedPaymentMethodId}
                                        onSelectPaymentMethod={handleSelectPaymentMethod}
                                        onAddNewCard={handleAddNewCard}
                                    />

                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5, mb: 0.5 }}>
                                        <Button
                                            variant="contained"
                                            onClick={handlePayWithSavedMethod}
                                            disabled={!selectedPaymentMethodId || isSubmitting}
                                            sx={{
                                                py: 1,
                                                bgcolor: '#2196f3',
                                                '&:hover': { bgcolor: '#1976d2' },
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                minWidth: '180px'
                                            }}
                                        >
                                            {isSubmitting ? 'Processing...' : 'PAY WITH THIS CARD'}
                                        </Button>
                                    </Box>

                                    <Divider sx={{ my: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            or use a new card
                                        </Typography>
                                    </Divider>
                                </>
                            )}
                        </>
                    )}

                    {/* Show card visual when in payment form and not showing new card form */}
                    {showPaymentForm && !showNewCardForm ? (
                        <Paper
                            elevation={3}
                            sx={{
                                bgcolor: '#2196f3',
                                color: 'white',
                                borderRadius: 2,
                                p: 2,
                                mb: 3,
                                position: 'relative',
                                height: 160,
                                backgroundImage: 'linear-gradient(135deg, #2196f3 0%, #0d47a1 100%)',
                            }}
                        >
                            <Box sx={{ position: 'absolute', top: 15, right: 15 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box
                                        component="span"
                                        sx={{
                                            width: 30,
                                            height: 20,
                                            borderRadius: 1,
                                            bgcolor: '#f5f5f5',
                                            mr: 1,
                                            display: 'inline-block',
                                        }}
                                    />
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        <Box component="span" sx={{ fontSize: 18 }}>))</Box>
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 5 }}>
                                <Typography variant="body1" sx={{ letterSpacing: 2, mb: 2, fontFamily: 'monospace', fontSize: '1.1rem' }}>
                                    {formatDisplayCardNumber()}
                                </Typography>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <Typography variant="body2" sx={{ textTransform: 'uppercase', opacity: 0.8 }}>
                                        {selectedPaymentMethod && !showNewCardForm && savedPaymentMethods.length > 0
                                            ? selectedPaymentMethod.cardholderName
                                            : (cardData.cardholderName || 'CARDHOLDER NAME')}
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        {selectedPaymentMethod && !showNewCardForm && savedPaymentMethods.length > 0
                                            ? `${selectedPaymentMethod.expiryMonth}/${selectedPaymentMethod.expiryYear}`
                                            : `${cardData.expiryMonth ? cardData.expiryMonth.padStart(2, '0') : 'MM'}/${cardData.expiryYear || 'YY'}`}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                component="img"
                                src={selectedPaymentMethod && !showNewCardForm && savedPaymentMethods.length > 0
                                    ? (selectedPaymentMethod.brand === 'visa'
                                        ? "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
                                        : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png")
                                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"}
                                alt="chip"
                                sx={{
                                    position: 'absolute',
                                    top: 15,
                                    left: 15,
                                    width: 40,
                                    height: 25,
                                    objectFit: 'contain',
                                }}
                            />
                        </Paper>) : (!showPaymentForm && <PaymentSummary
                            status={paymentResult.status}
                            transactionId={paymentResult.transactionId}
                            errorMessage={paymentResult.errorMessage}
                        />)}

                    {/* Show new card form when in payment form and either showNewCardForm is true or there are no saved methods */}
                    {showPaymentForm && (showNewCardForm || savedPaymentMethods.length === 0) ? (
                        <Box component="form" onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                    <Box sx={{ gap: 2 }}>
                                        <TextField
                                            style={{ width: '100%' }}
                                            label="CARD NUMBER"
                                            variant="outlined"
                                            value={cardData.cardNumber}
                                            onChange={handleChange('cardNumber')}
                                            error={!!errors.cardNumber}
                                            helperText={errors.cardNumber}
                                            disabled={isSubmitting}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <CreditCardIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            inputProps={{
                                                inputMode: 'numeric',
                                            }}
                                        />
                                        <TextField
                                            style={{ width: '100%', marginTop: 10 }}
                                            label="CARDHOLDER NAME"
                                            variant="outlined"
                                            value={cardData.cardholderName}
                                            onChange={handleChange('cardholderName')}
                                            error={!!errors.cardholderName}
                                            helperText={errors.cardholderName}
                                            disabled={isSubmitting}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <PersonIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <TextField
                                            label="MM"
                                            variant="outlined"
                                            value={cardData.expiryMonth}
                                            onChange={handleChange('expiryMonth')}
                                            error={!!errors.expiryMonth}
                                            disabled={isSubmitting}
                                            sx={{ width: '50%', py: 0 }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EventIcon fontSize="small" color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            inputProps={{
                                                inputMode: 'numeric',
                                                style: { textAlign: 'center' }
                                            }}
                                        />
                                        <TextField
                                            label="YY"
                                            variant="outlined"
                                            value={cardData.expiryYear}
                                            onChange={handleChange('expiryYear')}
                                            error={!!errors.expiryYear}
                                            disabled={isSubmitting}
                                            sx={{ width: '30%' }}
                                            inputProps={{
                                                inputMode: 'numeric',
                                                style: { textAlign: 'center' }
                                            }}
                                        />
                                        <TextField
                                            label="CVV"
                                            variant="outlined"
                                            value={cardData.cvv}
                                            onChange={handleChange('cvv')}
                                            error={!!errors.cvv}
                                            helperText={errors.cvv}
                                            disabled={isSubmitting}
                                            type="password"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <LockIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            inputProps={{
                                                inputMode: 'numeric',
                                            }}
                                        />
                                    </Box>
                                    {(errors.expiryMonth || errors.expiryYear) && (
                                        <FormHelperText error>
                                            {errors.expiryMonth || errors.expiryYear}
                                        </FormHelperText>
                                    )}
                                </Grid>

                                <Grid
                                    size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', alignContent: 'flex-end' }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={isSubmitting}
                                            sx={{
                                                py: 1,
                                                bgcolor: '#2196f3',
                                                '&:hover': { bgcolor: '#1976d2' },
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                minWidth: '120px'
                                            }}
                                        >
                                            {isSubmitting ? 'Processing...' : 'PAY NOW'}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={savedPaymentMethods.length > 0 ? () => setShowNewCardForm(false) : onClose}
                                            disabled={isSubmitting}
                                            sx={{
                                                py: 1,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                color: '#757575',
                                                borderColor: '#bdbdbd',
                                                '&:hover': {
                                                    borderColor: '#757575',
                                                },
                                                minWidth: '100px'
                                            }}
                                        >
                                            {savedPaymentMethods.length > 0 ? 'BACK' : 'CANCEL'}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={onClose}
                                sx={{
                                    py: 1,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    color: '#757575',
                                    borderColor: '#bdbdbd',
                                    '&:hover': {
                                        borderColor: '#757575',
                                    },
                                    minWidth: '120px'
                                }}
                            >
                                {paymentResult.status === 'approved' ? 'CLOSE' : 'BACK'}
                            </Button>
                        </Box>
                    )}

                </Box>
            </Fade>
        </Modal>
    );
};