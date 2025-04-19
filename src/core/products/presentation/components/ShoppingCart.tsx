import { Close as CloseIcon, Delete as DeleteIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { Badge, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import { useState } from 'react';
import useCart from '../../../../contexts/CartContext';
import { formatToLocalCurrency } from '../../../../shared/utils/currency';
import { PaymentCardModal } from './PaymentCardModal';

//#region STYLES
const getCartIconStyles = (): SxProps => ({
    position: 'fixed',
    bottom: 20,
    right: 20,
    zIndex: 1000,
    bgcolor: '#4CAF50',
    color: 'white',
    width: 60,
    height: 60,
    '&:hover': {
        bgcolor: '#43A047'
    },
    boxShadow: 3
});

const getDrawerStyles = (): SxProps => ({
    width: { xs: '100%', sm: 400 },
    maxWidth: '100%'
});

const getDrawerHeaderStyles = (): SxProps => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    p: 2,
    bgcolor: '#f5f5f5'
});

const getDrawerContentStyles = (): SxProps => ({
    p: 2,
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
});

const getListContainerStyles = (): SxProps => ({
    flexGrow: 1,
    overflow: 'auto'
});

const getListItemStyles = (): SxProps => ({
    py: 2,
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
});

const getProductImageStyles = (): SxProps => ({
    width: 60,
    height: 60,
    objectFit: 'cover',
    borderRadius: 1
});

const getQuantityStyles = (): SxProps => ({
    display: 'inline-block',
    bgcolor: '#f5f5f5',
    px: 1,
    py: 0.5,
    borderRadius: 1,
    fontSize: '0.875rem',
    mr: 1,
});

const getEmptyCartStyles = (): SxProps => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    p: 3,
    textAlign: 'center'
});

const getSummaryContainerStyles = (): SxProps => ({
    mt: 2,
    p: 2,
    bgcolor: '#f5f5f5',
    borderRadius: 2
});

const getCheckoutButtonStyles = (): SxProps => ({
    mt: 2,
    py: 1.5,
    bgcolor: '#4CAF50',
    '&:hover': {
        bgcolor: '#43A047'
    },
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 'bold'
});

const getBadgeStyles = (): SxProps => ({
    '& .MuiBadge-badge': {
        bgcolor: '#FF5722',
        color: 'white',
        fontWeight: 'bold'
    }
});
//#endregion

export const ShoppingCart = () => {
    const [open, setOpen] = useState(false);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const { cartItems, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();

    const handleOpenCart = () => {
        setOpen(true);
    };

    const handleCloseCart = () => {
        setOpen(false);
    };

    const handleCheckout = () => {
        setPaymentModalOpen(true);
        setOpen(false);
    };

    const handleClosePaymentModal = () => {
        setPaymentModalOpen(false);
    };

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();

    return (
        <>
            <IconButton
                aria-label="shopping cart"
                onClick={handleOpenCart}
                sx={getCartIconStyles()}
            >
                <Badge badgeContent={totalItems} sx={getBadgeStyles()}>
                    <ShoppingCartIcon fontSize="large" />
                </Badge>
            </IconButton>

            <Drawer
                anchor="right"
                open={open}
                onClose={handleCloseCart}
                PaperProps={{
                    sx: getDrawerStyles()
                }}
            >
                <Box sx={getDrawerHeaderStyles()}>
                    <Typography variant="h6" fontWeight="bold">
                        Shopping Cart
                    </Typography>
                    <IconButton onClick={handleCloseCart}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider />

                <Box sx={getDrawerContentStyles()}>
                    {cartItems.length === 0 ? (
                        <Box sx={getEmptyCartStyles()}>
                            <ShoppingCartIcon sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Your cart is empty
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Add products from the store to start your purchase
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <Box sx={getListContainerStyles()}>
                                <List>
                                    {cartItems.map((item) => (
                                        <ListItem key={item.product.productId} sx={getListItemStyles()}>
                                            <ListItemAvatar>
                                                <Box
                                                    component="img"
                                                    src={`./src/assets/${item.product.imageUrl}`}
                                                    alt={item.product.name}
                                                    sx={getProductImageStyles()}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                sx={{ ml: 2 }}
                                                primary={item.product.name}
                                                secondary={
                                                    <>
                                                        <Box component="span" sx={getQuantityStyles()}>
                                                            {item.quantity} Kg
                                                        </Box>
                                                        {formatToLocalCurrency(item.product.price * item.quantity, 'es-CO')}
                                                    </>
                                                }
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" onClick={() => removeFromCart(item.product.productId)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>

                            <Box sx={getSummaryContainerStyles()}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Purchase Summary
                                </Typography>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="body2">Products ({totalItems}):</Typography>
                                    <Typography variant="body2">{formatToLocalCurrency(totalPrice, 'es-CO')}</Typography>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
                                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                        {formatToLocalCurrency(totalPrice, 'es-CO')}
                                    </Typography>
                                </Box>
                            </Box>

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleCheckout}
                                sx={getCheckoutButtonStyles()}
                            >
                                Proceed to Payment
                            </Button>
                        </>
                    )}
                </Box>
            </Drawer>

            {paymentModalOpen && (
                <PaymentCardModal
                    open={paymentModalOpen}
                    onClose={handleClosePaymentModal}
                    productName={`Cart (${totalItems} products)`}
                    amount={totalPrice}
                    cant={totalItems}
                    productId={1}
                />
            )}
        </>
    );
};