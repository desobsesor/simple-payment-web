import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Button } from '@mui/material';
import { CreditCard as CreditCardIcon, Add as AddIcon, CheckCircle } from '@mui/icons-material';
import { PaymentMethod } from '../../domain/models/PaymentMethod';
import usePaymentMethod from '../../../../contexts/PaymentMethodContext';

interface SavedPaymentMethodListProps {
    paymentMethods: PaymentMethod[];
    selectedPaymentMethodId: string | null;
    onSelectPaymentMethod: (paymentMethodId: string) => void;
    onAddNewCard: () => void;
}

export const SavedPaymentMethodList = ({
    paymentMethods,
    selectedPaymentMethodId,
    onSelectPaymentMethod,
    onAddNewCard
}: SavedPaymentMethodListProps) => {
    const { setSelectedPaymentMethod } = usePaymentMethod();

    /**
     * Get card brand icon based on the brand name
     * @param brand The brand name of the card
     * @returns The icon component for the card brand
     */
    const getCardBrandIcon = (brand: string) => {
        return brand === 'visa' ?
            <Box
                component="img"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
                alt="Visa"
                sx={{ width: 32, height: 'auto' }}
            />
            : brand === 'mastercard' ?
                <Box
                    component="img"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
                    alt="Mastercard"
                    sx={{ width: 32, height: 'auto' }}
                />
                :
                <CreditCardIcon color="action" />;

    };

    return (
        <Box sx={{ width: '100%', mb: 2 }}>
            <List sx={{
                width: '100%',
                py: 0,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid rgba(0, 0, 0, 0.12)',
            }}>
                {paymentMethods.map((method) => (
                    <ListItem
                        key={method.id}
                        disablePadding
                        secondaryAction={
                            selectedPaymentMethodId === method.id && (
                                <CheckCircle color="primary" sx={{ mr: 1 }} />
                            )
                        }
                        sx={{
                            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                            '&:last-child': {
                                borderBottom: 'none'
                            },
                            opacity: method.isExpired ? 0.6 : 1
                        }}
                    >
                        <ListItemButton
                            onClick={() => {
                                onSelectPaymentMethod(method.id);
                                setSelectedPaymentMethod(method);
                            }}
                            selected={selectedPaymentMethodId === method.id}
                            disabled={method.isExpired}
                            sx={{
                                py: 0.5,
                                '&.Mui-selected': {
                                    bgcolor: 'rgba(33, 150, 243, 0.08)',
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                {getCardBrandIcon(method.brand)}
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="body1" component="span">
                                            {method.brand === 'visa' ? 'Visa' : method.brand === 'mastercard' ? 'Mastercard' : 'Tarjeta'}-{method.lastFour}
                                        </Typography>
                                        {method.isDefault && (
                                            <Typography
                                                variant="caption"
                                                component="span"
                                                sx={{
                                                    ml: 1,
                                                    bgcolor: 'primary.light',
                                                    color: 'white',
                                                    px: 0.8,
                                                    py: 0.3,
                                                    borderRadius: 1,
                                                    fontSize: '0.65rem'
                                                }}
                                            >
                                                Default
                                            </Typography>
                                        )}
                                        {method.isExpired && (
                                            <Typography
                                                variant="caption"
                                                component="span"
                                                sx={{
                                                    ml: 1,
                                                    bgcolor: 'error.light',
                                                    color: 'white',
                                                    px: 0.8,
                                                    py: 0.3,
                                                    borderRadius: 1,
                                                    fontSize: '0.65rem'
                                                }}
                                            >
                                                Expired
                                            </Typography>
                                        )}
                                    </Box>
                                }
                                secondary={
                                    <Typography variant="caption" color="text.secondary">
                                        Expires: {method.expiryMonth}/{method.expiryYear}
                                    </Typography>
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                ))}

                <ListItem disablePadding>
                    <ListItemButton onClick={onAddNewCard} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <AddIcon color="action" />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography variant="body2" color="primary">
                                    Add card...
                                </Typography>
                            }
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
};