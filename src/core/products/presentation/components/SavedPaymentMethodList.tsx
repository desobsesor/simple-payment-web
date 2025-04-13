import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Button } from '@mui/material';
import { CreditCard as CreditCardIcon, Add as AddIcon, CheckCircle } from '@mui/icons-material';
import { PaymentMethod } from '../../domain/models/PaymentMethod';
import usePaymentMethod from '../../../../contexts/PaymentMethodContext';
import { SxProps } from '@mui/system';

interface SavedPaymentMethodListProps {
    paymentMethods: PaymentMethod[];
    selectedPaymentMethodId: string | null;
    onSelectPaymentMethod: (paymentMethodId: string) => void;
    onAddNewCard: () => void;
}

//#region STYLES

const getCardImageStyles = (): SxProps => ({
    width: 32,
    height: 'auto'
});

const getContainerStyles = (): SxProps => ({
    width: '100%',
    mb: 2
});

const getListStyles = (): SxProps => ({
    width: '100%',
    py: 0,
    bgcolor: 'background.paper',
    borderRadius: 2,
    border: '1px solid rgba(0, 0, 0, 0.12)'
});

const getListItemStyles = (isExpired: boolean): SxProps => ({
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
    '&:last-child': {
        borderBottom: 'none'
    },
    opacity: isExpired ? 0.6 : 1
});

const getListItemButtonStyles = (): SxProps => ({
    py: 0.5,
    '&.Mui-selected': {
        bgcolor: 'rgba(33, 150, 243, 0.08)'
    }
});

const getListItemIconStyles = (): SxProps => ({
    minWidth: 40
});

const getAddCardButtonStyles = (): SxProps => ({
    py: 1.5
});

const getBadgeStyles = (isError: boolean = false): SxProps => ({
    ml: 1,
    bgcolor: isError ? 'error.light' : 'primary.light',
    color: 'white',
    px: 0.8,
    py: 0.3,
    borderRadius: 1,
    fontSize: '0.65rem'
});

const getCardInfoStyles = (): SxProps => ({
    display: 'flex',
    alignItems: 'center'
});

//#endregion

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
                sx={getCardImageStyles()}
            />
            : brand === 'mastercard' ?
                <Box
                    component="img"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
                    alt="Mastercard"
                    sx={getCardImageStyles()}
                />
                :
                <CreditCardIcon color="action" />;

    };

    return (
        <Box sx={getContainerStyles()}>
            <List sx={getListStyles()}>
                {paymentMethods.map((method: PaymentMethod) => (
                    <ListItem
                        key={method.id}
                        disablePadding
                        secondaryAction={
                            selectedPaymentMethodId === method.id && (
                                <CheckCircle color="primary" sx={{ mr: 1 }} />
                            )
                        }
                        sx={getListItemStyles(method.isExpired || false)}
                    >
                        <ListItemButton
                            onClick={() => {
                                onSelectPaymentMethod(method.id);
                                setSelectedPaymentMethod(method);
                            }}
                            selected={selectedPaymentMethodId === method.id}
                            disabled={method.isExpired}
                            sx={getListItemButtonStyles()}
                        >
                            <ListItemIcon sx={getListItemIconStyles()}>
                                {getCardBrandIcon(method.brand)}
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Box sx={getCardInfoStyles()}>
                                        <Typography variant="body1" component="span">
                                            {method.brand === 'visa' ? 'Visa' : method.brand === 'mastercard' ? 'Mastercard' : 'Tarjeta'}-{method.lastFour}
                                        </Typography>
                                        {method.isDefault && (
                                            <Typography
                                                variant="caption"
                                                component="span"
                                                sx={getBadgeStyles()}
                                            >
                                                Default
                                            </Typography>
                                        )}
                                        {method.isExpired && (
                                            <Typography
                                                variant="caption"
                                                component="span"
                                                sx={getBadgeStyles(true)}
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
                    <ListItemButton onClick={onAddNewCard} sx={getAddCardButtonStyles()}>
                        <ListItemIcon sx={getListItemIconStyles()}>
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