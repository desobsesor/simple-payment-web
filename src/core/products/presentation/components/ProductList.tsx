import { Add as AddIcon, CameraAlt as CameraIcon, CreditCard as CreditCardIcon, InfoRounded, Inventory2Sharp, Remove as RemoveIcon } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, Grid, IconButton, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import useUser from '../../../../contexts/UserContext';
import { Notification } from '../../../../shared/feedback/Notification';
import useSocket from '../../../../shared/hooks/useSocket';
import { formatToLocalCurrency } from '../../../../shared/utils/currency';
import ErrorPage from '../../../errors/presentation/ErrorPage';
import { Product } from '../../domain/models/Product';
import { ProductService } from '../../infrastructure/services/ProductService';
import { PaymentCardModal } from './PaymentCardModal';
import { ProductImageModal } from './ProductImageModal';
import { ProductInfoModal } from './ProductInfoModal';
import { QuantityEditPopover } from './QuantityEditPopover';

//#region STYLES

const getGridContainerStyles = (): SxProps => ({
    paddingY: 2,
    maxWidth: '100%'
});

const getLoadingGridContainerStyles = (): SxProps => ({
    paddingY: 4,
    minWidth: '100%'
});

const getGridItemStyles = (): SxProps => ({
    mb: 2,
    width: { sm: 'calc(50% - 32px)', md: 'calc(33.33% - 32px)', lg: 'calc(25% - 32px)' }
});

const getCardStyles = (): SxProps => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 3,
    borderRadius: 4,
    overflow: 'hidden',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    bgcolor: '#FFFFFF',
    maxWidth: 280,
    mx: 'auto'
});

const getLoadingCardStyles = (): SxProps => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 2,
    borderRadius: 2,
    overflow: 'hidden',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out'
});

const getCardHeaderStyles = (): SxProps => ({
    display: 'flex',
    justifyContent: 'space-between',
    p: 2
});

const getInfoButtonStyles = (): SxProps => ({
    bgcolor: '#F5F5F5',
    width: 36,
    height: 36
});

const getProductImageStyles = (): SxProps => ({
    width: '100%',
    height: 220,
    objectFit: 'cover',
    mb: 2
});

const getCardContentStyles = (): SxProps => ({
    px: 3,
    pt: 0,
    pb: 2
});

const getQuantityContainerStyles = (): SxProps => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    mb: 1
});

const getQuantityControlsStyles = (): SxProps => ({
    display: 'flex',
    alignItems: 'center',
    mb: 2,
    mt: 0.5
});

const getDecreaseButtonStyles = (): SxProps => ({
    bgcolor: '#F5F5F5',
    borderRadius: '50%',
    width: 24,
    height: 24,
    '&:hover': { bgcolor: '#E0E0E0' }
});

const getIncreaseButtonStyles = (): SxProps => ({
    bgcolor: '#4CAF50',
    color: 'white',
    borderRadius: '50%',
    width: 24,
    height: 24,
    '&:hover': { bgcolor: '#43A047' }
});

const getQuantityTextStyles = (): SxProps => ({
    mx: 1,
    fontWeight: 'bold',
    cursor: 'pointer',
    '&:hover': { textDecoration: 'underline' }
});

const getPriceStyles = (): SxProps => ({
    fontWeight: 'bold'
});

const getDescriptionStyles = (): SxProps => ({
    mb: 2,
    lineHeight: 1.6,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: '4.8em'
});

const getStockContainerStyles = (): SxProps => ({
    mb: 3
});

const getStockPaperStyles = (): SxProps => ({
    bgcolor: '#F5F5F5',
    p: 1,
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
});

const getStockIconContainerStyles = (): SxProps => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: '#4CAF50',
    color: 'white',
    borderRadius: '50%',
    width: 32,
    height: 32,
    mr: 1.5,
    pt: 1
});

const getStockIconStyles = (): SxProps => ({
    fontSize: 14
});

const getPayButtonStyles = (): SxProps => ({
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    py: 1.5,
    borderRadius: 8,
    bgcolor: '#4CAF50',
    '&:hover': {
        bgcolor: '#43A047'
    }
});

const getLoadingBoxStyles = (): SxProps => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 1
});

const getLoadingCardActionsStyles = (): SxProps => ({
    justifyContent: 'flex-start',
    px: 2,
    pb: 2,
    pt: 0
});

const getLoadingCardContentStyles = (): SxProps => ({
    flexGrow: 1,
    px: 2,
    pt: 2,
    pb: 1
});

//#endregion

export const ProductList = () => {
    const { setUser } = useUser();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [editingProductId, setEditingProductId] = useState<string>('');
    const [notification, setNotification] = useState<{ open: boolean, message: string, severity: 'error' | 'warning' | 'info' | 'success' }>({ open: false, message: '', severity: 'error' });

    //#region SOCKET

    // Use the custom hook to manage the Socket.IO connection
    const {
        socket,
        status: socketStatus,
        isConnected,
        connect,
        emit,
        on,
        off
    } = useSocket({
        url: 'http://192.168.101.72:3000', //config.API_URL,
        autoConnect: false,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ['websocket', 'polling'],
        eventHandlers: {
            'product_stock_updated': (data) => {
                console.log('Product stock updated:', data);
                handleProductStockUpdated(data);
            },
            'notification': (data) => {
                alert(`Notification: ${data.text}`);
            }
        }
    });

    // Reference to control if connection has already been attempted
    const [socketInitialized, setSocketInitialized] = useState(false);

    // Start the connection only once when the component loads
    // and only when necessary
    useEffect(() => {
        if (!socketInitialized && !isConnected) {
            console.log('Starting manual socket connection');
            connect();
            setSocketInitialized(true);
        }
    }, [connect, socketInitialized, isConnected]);


    // Use a reference to track the previous socket status
    const prevSocketStatusRef = useRef(socketStatus);

    useEffect(() => {
        // Only show notification when the status changes (not on first load)
        // and only for significant states (connected/error)
        if (prevSocketStatusRef.current !== socketStatus) {
            if (socketStatus === 'connected') {
                setNotification({
                    open: true,
                    message: 'Connected to event server',
                    severity: 'success'
                });
            } else if (socketStatus === 'error') {
                setNotification({
                    open: true,
                    message: 'Connection error with event server',
                    severity: 'error'
                });
            }
            // Update the reference to the previous status
            prevSocketStatusRef.current = socketStatus;
        }
    }, [socketStatus]);

    // Reference to store the retry interval ID
    const emitRetryIntervalRef = useRef<number | null>(null);

    // Handler for the stock update event
    const handleProductStockUpdated = useCallback((updatedData: any) => {
        console.log('Product update event received:', updatedData);
        setNotification({
            open: true,
            message: 'Product inventory updated',
            severity: 'success'
        });

        // Update the product list when an update is received
        const productService = new ProductService();
        productService.getProductById(updatedData.productId)
            .then(product => {
                if (product) {
                    setProducts(prevProducts => prevProducts.map(p => p.productId === product.productId ? product : p));
                }
            })
            .catch(err => {
                console.error('Error updating product:', err);
            });
    }, []);

    // Function to try emitting the connection event
    const tryEmitConnectionEvent = useCallback(() => {
        if (socket) {
            console.log('Emitting client_connected event with ID:', socket?.id);
            // Ensure the event is emitted correctly
            //emit('product_stock_updated', { productId: socket?.id, stock: 10 });

            // Clear the interval if it exists
            if (emitRetryIntervalRef.current !== null) {
                window.clearInterval(emitRetryIntervalRef.current);
                emitRetryIntervalRef.current = null;
            }
            // Clear all socket events
            socket?.off('connect');
            socket?.off('disconnect');
            socket?.off('product_stock_updated');
            return true;
        }
        return false;
    }, [socket, emit]);

    useEffect(() => {
        if (isConnected && socket) {
            // Register connection/disconnection events for debugging only when connected
            console.log('Registering event handlers for connected socket');

            on('connect', () => {
                console.log('Socket connected with ID:', socket?.id);

                // Try emitting the event immediately after connection
                tryEmitConnectionEvent();
            });

            // Subscribe to the product_stock_updated event
            // on('product_stock_updated', handleProductStockUpdated);

            on('disconnect', (reason: any) => {
                console.log('Socket disconnected, reason:', reason);
            });
        }

        // Clean up subscriptions on unmount
        return () => {

            // Unsubscribe from events only if the socket exists
            if (socket) {
                off('connect');
                off('disconnect');
                off('product_stock_updated');
            }

            // Clear the interval if it exists
            if (emitRetryIntervalRef.current !== null) {
                window.clearInterval(emitRetryIntervalRef.current);
                emitRetryIntervalRef.current = null;
            }
        };
    }, [on, off, isConnected, socket, tryEmitConnectionEvent]);

    useEffect(() => {
        // If the socket disconnects unexpectedly and was already initialized,
        // do not attempt to reconnect automatically, let the user do it
        if (socketStatus === 'disconnected' && socketInitialized) {
            console.log('Socket disconnected after initialization');
        }
    }, [socketStatus, socketInitialized]);

    //#endregion

    useEffect(() => {
        const productService = new ProductService();
        productService.login()
            .then((data) => {
                const { token, user } = data;
                if (token) {
                    setNotification({
                        open: true,
                        message: `Authenticated user: ${user.username}`,
                        severity: 'info'
                    });
                }
                setUser(user)
            }).catch(err => {
                console.error('Error logging in:', err);
            });

        productService.getProducts()
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });

    }, []);

    if (loading) return (
        <Grid container spacing={4} sx={getLoadingGridContainerStyles()}>
            {[...Array(12)].map((_, index) => (
                <Grid key={index}
                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                    sx={getGridItemStyles()}>
                    <Card
                        component={motion.div}
                        whileHover={{ scale: 1.05 }}
                        sx={getLoadingCardStyles()}
                    >
                        <Skeleton variant="rectangular" height={140} />
                        <CardContent sx={getLoadingCardContentStyles()}>
                            <Box sx={getLoadingBoxStyles()}>
                                <Skeleton width="60%" height={32} />
                                <Skeleton width="80px" height={32} variant="rounded" />
                            </Box>
                            <Skeleton width="60%" />
                            <Skeleton width="40%" sx={{ mt: 2 }} />
                        </CardContent>
                        <CardActions sx={getLoadingCardActionsStyles()}>
                            <Skeleton width="80px" height="36px" />
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    if (error) return <ErrorPage error={error} />

    const handleQuantityChange = (productId: string, increment: boolean): void => {
        const currentQuantity = quantities[productId] || 1;
        const product = products.find(p => p.productId === productId);

        if (!product) return;

        let newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;

        if (newQuantity > 0 && newQuantity <= product.stock) {
            setQuantities(prev => ({
                ...prev,
                [productId]: newQuantity
            }));
        } else if (newQuantity > product.stock) {
            setNotification({
                open: true,
                message: `The quantity cannot be greater than the available stock (${product.stock} kg)`,
                severity: 'error'
            });
        } else if (newQuantity < 1) {
            setNotification({
                open: true,
                message: 'The quantity must be at least 1 kg',
                severity: 'warning'
            });
        }
    };

    const handleQuantityClick = (event: React.MouseEvent<HTMLElement>, productId: string) => {
        setAnchorEl(event.currentTarget);
        setEditingProductId(productId);
        //setEditingQuantity(String(quantities[productId] || 1));
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setEditingProductId('');
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    return (
        <>
            {/* <h4 style={{ textAlign: 'center', color: '#4CAF50' }}>Socket Connection: {isConnected ? 'Connected' : 'Disconnected'}</h4>*/}
            <Grid container spacing={4} sx={getGridContainerStyles()} >

                {products.map((product) => (
                    <Grid key={product.productId} sx={getGridItemStyles()} >
                        <Card
                            component={motion.div}
                            whileHover={{ scale: 1.01 }}
                            sx={getCardStyles()}
                        >
                            <Box sx={getCardHeaderStyles()}>
                                <IconButton
                                    size="small"
                                    sx={getInfoButtonStyles()}
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        setInfoModalOpen(true);
                                    }}
                                >
                                    <InfoRounded fontSize="small" />
                                </IconButton>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                    {product.name}
                                </Typography>
                                <IconButton
                                    size="small"
                                    sx={getInfoButtonStyles()}
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        setImageModalOpen(true);
                                    }}
                                >
                                    <CameraIcon fontSize="small" />
                                </IconButton>
                            </Box>

                            <Box
                                component="img"
                                src={`./src/assets/${product.imageUrl}`}
                                alt={product.name}
                                sx={getProductImageStyles()}
                            />

                            <CardContent sx={getCardContentStyles()}>
                                <Box sx={getQuantityContainerStyles()}>
                                    <Box sx={getQuantityControlsStyles()}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleQuantityChange(product.productId, false)}
                                            sx={getDecreaseButtonStyles()}
                                        >
                                            <RemoveIcon fontSize="small" />
                                        </IconButton>
                                        <Typography
                                            sx={getQuantityTextStyles()}
                                            onClick={(e) => handleQuantityClick(e, product.productId)}
                                        >
                                            {quantities[product.productId] || 1}Kg
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleQuantityChange(product.productId, true)}
                                            sx={getIncreaseButtonStyles()}
                                        >
                                            <AddIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    <Typography variant="h5" sx={getPriceStyles()}>
                                        {formatToLocalCurrency(product.price, 'es-CO')}
                                    </Typography>
                                </Box>

                                <QuantityEditPopover
                                    open={Boolean(anchorEl) && editingProductId === product.productId}
                                    anchorEl={anchorEl}
                                    onClose={handlePopoverClose}
                                    productId={product.productId}
                                    stock={product.stock}
                                    initialQuantity={quantities[product.productId] || 1}
                                    onSubmit={(productId, quantity) => {
                                        setQuantities(prev => ({
                                            ...prev,
                                            [productId]: quantity
                                        }));
                                    }}
                                    onNotification={(message, severity) => {
                                        setNotification({
                                            open: true,
                                            message,
                                            severity
                                        });
                                    }}
                                />

                                <Typography variant="body2" color="text.secondary" sx={getDescriptionStyles()}>
                                    {product.description}
                                </Typography>

                                <Stack direction="column" spacing={2} sx={getStockContainerStyles()}>
                                    <Paper elevation={0} sx={getStockPaperStyles()}>
                                        <Box sx={getStockIconContainerStyles()}>
                                            <Box component="span" sx={getStockIconStyles()}>
                                                <Inventory2Sharp style={{ color: 'whitesmoke' }} fontSize="small" />
                                            </Box>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{product.stock} kilograms in stock</Typography>
                                        </Box>
                                    </Paper>
                                </Stack>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        console.log('Selected product:', product);
                                        setPaymentModalOpen(true);
                                    }}
                                    sx={getPayButtonStyles()}
                                    startIcon={<CreditCardIcon />}
                                >
                                    Pay with credit card
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {selectedProduct && (
                <>
                    <PaymentCardModal
                        open={paymentModalOpen}
                        onClose={() => setPaymentModalOpen(false)}
                        productName={selectedProduct.name}
                        amount={selectedProduct.price * (quantities[selectedProduct.productId] || 1)}
                        cant={quantities[selectedProduct.productId] || 1}
                        productId={Number(selectedProduct.productId)}
                    />
                    <ProductImageModal
                        open={imageModalOpen}
                        onClose={() => setImageModalOpen(false)}
                        productName={selectedProduct.name}
                        imageUrl={selectedProduct.imageUrl}
                    />
                    <ProductInfoModal
                        open={infoModalOpen}
                        onClose={() => setInfoModalOpen(false)}
                        productName={selectedProduct.name}
                        productDescription={selectedProduct.description}
                        productPrice={selectedProduct.price}
                        productStock={selectedProduct.stock}
                        imageUrl={selectedProduct.imageUrl}
                    />
                </>
            )}

            <Notification
                open={notification.open}
                message={notification.message}
                severity={notification.severity}
                onClose={handleCloseNotification}
                duration={4000}
                position={{ vertical: 'top', horizontal: 'right' }}
            />
        </>
    );
};