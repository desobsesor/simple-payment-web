import { Close as CloseIcon, Inventory2Sharp } from '@mui/icons-material';
import { Box, Button, Dialog, DialogContent, DialogTitle, Fade, IconButton, Paper, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { formatToLocalCurrency } from '../../../../shared/utils/currency';
import { SxProps } from '@mui/system';

interface ProductInfoModalProps {
    open: boolean;
    onClose: () => void;
    productName: string;
    productDescription: string;
    productPrice: number;
    productStock: number;
    imageUrl: string;
}

//#region STYLES

const getDialogPaperStyles = (): SxProps => ({
    borderRadius: 16,
    overflow: 'hidden',
    padding: 0
});

const getMotionBoxStyles = (): SxProps => ({
    width: '100%'
});

const getDialogTitleStyles = (): SxProps => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    p: 2,
    bgcolor: '#F5F5F5'
});

const getTitleTypographyStyles = (): SxProps => ({
    fontWeight: 'bold'
});

const getCloseButtonStyles = (): SxProps => ({
    bgcolor: '#E0E0E0',
    '&:hover': { bgcolor: '#D0D0D0' }
});

const getDialogContentStyles = (): SxProps => ({
    p: 0,
    '&.MuiDialogContent-root': { overflowY: 'auto' },
    maxHeight: { xs: 'calc(100vh - 64px)', sm: 'auto' }
});

const getContentBoxStyles = (): SxProps => ({
    p: 3,
    maxHeight: { xs: '80vh', sm: 'auto' }
});

const getFlexContainerStyles = (): SxProps => ({
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: { xs: 3, sm: 4 }
});

const getImageContainerStyles = (): SxProps => ({
    width: { xs: '100%', sm: '40%' }
});

const getProductImageStyles = (): SxProps => ({
    width: '100%',
    height: { xs: 200, sm: 220 },
    objectFit: 'cover',
    borderRadius: 2
});

const getProductInfoContainerStyles = (): SxProps => ({
    width: { xs: '100%', sm: '60%' },
    display: 'flex',
    flexDirection: 'column'
});

const getProductNameStyles = (): SxProps => ({
    fontWeight: 'bold',
    mb: 1
});

const getPriceContainerStyles = (): SxProps => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2
});

const getPriceStyles = (): SxProps => ({
    fontWeight: 'bold'
});

const getStockContainerStyles = (): SxProps => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1
});

const getDescriptionStyles = (): SxProps => ({
    mb: 2,
    lineHeight: 1.6
});

const getBackButtonStyles = (): SxProps => ({
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
});

//#endregion

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
            sx={getDialogPaperStyles()}
        >
            <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                sx={getMotionBoxStyles()}
            >
                <DialogTitle sx={getDialogTitleStyles()}>
                    <Typography variant="h6" component="div" sx={getTitleTypographyStyles()}>
                        Product Information
                    </Typography>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                        sx={getCloseButtonStyles()}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={getDialogContentStyles()}>
                    <Box sx={getContentBoxStyles()}>
                        <Box sx={getFlexContainerStyles()}>
                            <Box sx={getImageContainerStyles()}>
                                <Box
                                    component="img"
                                    src={`./src/assets/${imageUrl}`}
                                    alt={productName}
                                    sx={getProductImageStyles()}
                                />
                            </Box>

                            <Box sx={getProductInfoContainerStyles()}>
                                <Typography variant="h5" gutterBottom sx={getProductNameStyles()}>
                                    {productName}
                                </Typography>

                                <Box sx={getPriceContainerStyles()}>
                                    <Typography variant="h6" color="primary" sx={getPriceStyles()}>
                                        {formatToLocalCurrency(productPrice, 'es-CO')}
                                    </Typography>

                                    <Box sx={getStockContainerStyles()}>
                                        <Inventory2Sharp style={{ color: '#4CAF50' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {productStock} kg in stock
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography variant="body1" paragraph sx={getDescriptionStyles()}>
                                    {productDescription}
                                </Typography>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={onClose}
                                    sx={getBackButtonStyles()}
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