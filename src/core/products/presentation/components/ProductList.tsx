import { Add as AddIcon, CameraAlt as CameraIcon, CreditCard as CreditCardIcon, InfoRounded, Inventory2Sharp, Remove as RemoveIcon } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, Grid, IconButton, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { formatToLocalCurrency } from '../../../../shared/utils/currency';
import ErrorPage from '../../../errors/presentation/ErrorPage';
import { Product } from '../../domain/models/Product';
import { ProductService } from '../../infrastructure/services/ProductService';
import { PaymentCardModal } from './PaymentCardModal';
import useUser from '../../../../contexts/UserContext';

export const ProductList = () => {
    const { setUser } = useUser();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        const productService = new ProductService();
        productService.login()
            .then((data) => {
                const { token, user } = data;
                if (token) {
                    console.log('Token:', token);
                }
                setUser(user)
            }).catch(err => {
                console.error('Error logging in:', err);
            });

        productService.getProducts()
            .then(data => {
                setProducts(data);
                // Initialize quantities with 1 for each product
                const initialQuantities: { [key: string]: number } = {};
                data.forEach(product => {
                    initialQuantities[product.productId] = Number(product.productId);
                });
                setQuantities(initialQuantities);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });

    }, []);

    if (loading) return (
        <Grid container spacing={4} sx={{ paddingY: 4, maxWidth: '100%' }}>
            {[...Array(4)].map((_, index) => (
                <Grid key={index}
                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                    sx={{ width: { sm: 'calc(50% - 32px)', md: 'calc(33.33% - 32px)', lg: 'calc(25% - 32px)' } }}>
                    <Card
                        component={motion.div}
                        whileHover={{ scale: 1.03 }}
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: 2,
                            borderRadius: 2,
                            overflow: 'hidden',
                            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out'
                        }}
                    >
                        <Skeleton variant="rectangular" height={140} />
                        <CardContent sx={{ flexGrow: 1, px: 2, pt: 2, pb: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Skeleton width="60%" height={32} />
                                <Skeleton width="80px" height={32} variant="rounded" />
                            </Box>
                            <Skeleton width="60%" />
                            <Skeleton width="40%" sx={{ mt: 2 }} />
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'flex-start', px: 2, pb: 2, pt: 0 }}>
                            <Skeleton width="80px" height="36px" />
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    if (error) return <ErrorPage error={error} />

    const handleQuantityChange = (productId: string, increment: boolean) => {
        const currentQuantity = quantities[productId] || 1;
        const product = products.find(p => p.productId === productId);

        if (!product) return;

        let newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;

        if (newQuantity > 0 && newQuantity <= product.stock) {
            setQuantities(prev => ({
                ...prev,
                [productId]: newQuantity
            }));
        }
    };

    return (
        <>
            <Grid container spacing={2} sx={{ paddingY: 2, maxWidth: '100%' }}>
                {products.map((product) => (
                    <Grid key={product.productId}
                        size={{ xs: 12, sm: 6, md: 3, lg: 3 }} sx={{ mb: 2 }}>
                        <Card
                            component={motion.div}
                            whileHover={{ scale: 1.01 }}
                            sx={{
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
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                                <IconButton size="small" sx={{ bgcolor: '#F5F5F5', width: 36, height: 36 }}>
                                    <InfoRounded fontSize="small" />
                                </IconButton>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                    {product.name}
                                </Typography>
                                <IconButton size="small" sx={{ bgcolor: '#F5F5F5', width: 36, height: 36 }}>
                                    <CameraIcon fontSize="small" />
                                </IconButton>
                            </Box>

                            <Box
                                component="img"
                                src={`./src/assets/${product.imageUrl}`}
                                alt={product.name}
                                sx={{
                                    width: '100%',
                                    height: 220,
                                    objectFit: 'cover',
                                    mb: 2
                                }}
                            />

                            <CardContent sx={{ px: 3, pt: 0, pb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 0.5 }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleQuantityChange(product.productId, false)}
                                            sx={{
                                                bgcolor: '#F5F5F5',
                                                borderRadius: '50%',
                                                width: 24,
                                                height: 24,
                                                '&:hover': { bgcolor: '#E0E0E0' }
                                            }}
                                        >
                                            <RemoveIcon fontSize="small" />
                                        </IconButton>
                                        <Typography sx={{ mx: 2, fontWeight: 'bold' }}>
                                            {quantities[product.productId] || 1}Kg
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleQuantityChange(product.productId, true)}
                                            sx={{
                                                bgcolor: '#4CAF50',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: 24,
                                                height: 24,
                                                '&:hover': { bgcolor: '#43A047' }
                                            }}
                                        >
                                            <AddIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                        {formatToLocalCurrency(product.price, 'es-CO')}
                                    </Typography>
                                </Box>

                                <Typography variant="body2" color="text.secondary" sx={{
                                    mb: 2,
                                    lineHeight: 1.6,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    height: '4.8em'
                                }}>
                                    {product.description}
                                </Typography>

                                <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
                                    <Paper elevation={0} sx={{
                                        bgcolor: '#F5F5F5',
                                        p: 1,
                                        borderRadius: 2,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        flex: 1
                                    }}>
                                        <Box sx={{
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
                                        }}>
                                            <Box component="span" sx={{ fontSize: 18 }}>
                                                <Inventory2Sharp fontSize="small" />
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
                                        setPaymentModalOpen(true);
                                    }}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        py: 1.5,
                                        borderRadius: 8,
                                        bgcolor: '#4CAF50',
                                        '&:hover': {
                                            bgcolor: '#43A047'
                                        }
                                    }}
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
                <PaymentCardModal
                    open={paymentModalOpen}
                    onClose={() => setPaymentModalOpen(false)}
                    productName={selectedProduct.name}
                    amount={selectedProduct.price * (quantities[selectedProduct.productId] || 1)}
                    cant={quantities[selectedProduct.productId] || 1}
                    productId={Number(quantities[selectedProduct.productId])}
                />
            )}
        </>
    );


};