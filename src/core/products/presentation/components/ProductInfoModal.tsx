import { Close as CloseIcon, Inventory2Sharp } from '@mui/icons-material';
import { Box, Button, Dialog, DialogContent, DialogTitle, Fade, IconButton, Paper, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { formatToLocalCurrency } from '../../../../shared/utils/currency';

interface ProductInfoModalProps {
    open: boolean;
    onClose: () => void;
    productName: string;
    productDescription: string;
    productPrice: number;
    productStock: number;
    imageUrl: string;
}

export const ProductInfoModal = ({
    open,
    onClose,
    productName,
    productDescription,
    productPrice,
    productStock,
    imageUrl
}: ProductInfoModalProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            TransitionComponent={Fade}
            TransitionProps={{
                timeout: 300
            }}
            PaperProps={{
                style: {
                    borderRadius: 16,
                    overflow: 'hidden',
                    padding: 0
                }
            }}
        >
            <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                sx={{ width: '100%' }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    bgcolor: '#F5F5F5'
                }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        Product Information
                    </Typography>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                        sx={{
                            bgcolor: '#E0E0E0',
                            '&:hover': { bgcolor: '#D0D0D0' }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0, '&.MuiDialogContent-root': { overflowY: 'auto' }, maxHeight: { xs: 'calc(100vh - 64px)', sm: 'auto' } }}>
                    <Box sx={{ p: 3, maxHeight: { xs: '80vh', sm: 'auto' } }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 3, sm: 4 } }}>
                            <Box sx={{ width: { xs: '100%', sm: '40%' } }}>
                                <Box
                                    component="img"
                                    src={`./src/assets/${imageUrl}`}
                                    alt={productName}
                                    sx={{
                                        width: '100%',
                                        height: { xs: 200, sm: 220 },
                                        objectFit: 'cover',
                                        borderRadius: 2
                                    }}
                                />
                            </Box>

                            <Box sx={{ width: { xs: '100%', sm: '60%' }, display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {productName}
                                </Typography>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                        {formatToLocalCurrency(productPrice, 'es-CO')}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Inventory2Sharp style={{ color: '#4CAF50' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {productStock} kg in stock
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography variant="body1" paragraph sx={{ mb: 2, lineHeight: 1.6 }}>
                                    {productDescription}
                                </Typography>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={onClose}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        py: 1,
                                        mt: { xs: 2, sm: 1 },
                                        borderRadius: 8,
                                        bgcolor: '#4CAF50',
                                        '&:hover': {
                                            bgcolor: '#43A047'
                                        }
                                    }}
                                >
                                    Back to product list
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
            </Box>
        </Dialog>
    );
};