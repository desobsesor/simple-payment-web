import { CreditCard as CreditCardIcon, Event as EventIcon, Lock as LockIcon, Person as PersonIcon } from '@mui/icons-material';
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
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { formatToLocalCurrency } from '../../../../shared/utils/currency';

interface PaymentCardModalProps {
    open: boolean;
    onClose: () => void;
    productName?: string;
    amount: number;
    cant: number;
}

interface CardData {
    cardNumber: string;
    cardholderName: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
}

export const PaymentCardModal = ({ open, onClose, productName, amount, cant }: PaymentCardModalProps) => {
    const [cardData, setCardData] = useState<CardData>({
        cardNumber: '',
        cardholderName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: ''
    });

    const [errors, setErrors] = useState<Partial<CardData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!open) {
            setCardData({
                cardNumber: '',
                cardholderName: '',
                expiryMonth: '',
                expiryYear: '',
                cvv: ''
            });
            setErrors({});
            setIsSubmitting(false);
        }
    }, [open]);

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

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);

            // Simulate payment processing
            setTimeout(() => {
                console.log('Payment processed:', {
                    ...cardData,
                    amount,
                    productName
                });
                setIsSubmitting(false);
                onClose();
                // Here you would typically call your payment API
            }, 1500);
        }
    };

    const formatDisplayCardNumber = () => {
        const digits = cardData.cardNumber.replace(/\s/g, '');
        return digits.padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim();
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
                    width: { xs: '90%', sm: 450 },
                    bgcolor: 'background.paper',
                    borderRadius: 4,
                    boxShadow: 24,
                    p: 4,
                    outline: 'none',
                }}>
                    <Typography id="payment-modal-title" variant="h6" component="h2" align="center" gutterBottom>
                        Credit Cart Payment
                    </Typography>
                    <Typography style={{ backgroundColor: '#EAEAEA', borderRadius: 4, padding: 4 }} variant="body2" component="p" align="center" gutterBottom>
                        Product: {productName} Cant: {cant} - Total: {formatToLocalCurrency(amount, 'es-CO')}
                    </Typography>

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
                                    {cardData.cardholderName || 'CARDHOLDER NAME'}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    {cardData.expiryMonth ? cardData.expiryMonth.padStart(2, '0') : 'MM'}/
                                    {cardData.expiryYear || 'YY'}
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            component="img"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
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
                    </Paper>

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
                                        sx={{ width: '30%', py: 0 }}
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
                                        sx={{ width: '40%' }}
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
                                        onClick={onClose}
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
                                        CANCEL
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};