import { Close as CloseIcon } from '@mui/icons-material';
import {
    Box,
    Fade,
    IconButton,
    Modal,
    Paper,
    Typography
} from '@mui/material';

interface ProductImageModalProps {
    open: boolean;
    onClose: () => void;
    productName: string;
    imageUrl: string;
}

export const ProductImageModal = ({ open, onClose, productName, imageUrl }: ProductImageModalProps) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            aria-labelledby="product-image-modal-title"
            aria-describedby="product-image-modal-description"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 2, sm: 4 }
            }}
        >
            <Fade in={open}>
                <Paper
                    elevation={6}
                    sx={{
                        position: 'relative',
                        maxWidth: { xs: '95%', sm: '90%', md: '80%', lg: '70%' },
                        maxHeight: { xs: '95vh', sm: '90vh' },
                        width: 'auto',
                        p: 3,
                        borderRadius: 4,
                        overflow: 'hidden',
                        outline: 'none',
                        boxShadow: 10
                    }}
                >
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            bgcolor: 'rgba(0, 0, 0, 0.04)',
                            zIndex: 1,
                            '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.1)'
                            }
                        }}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography
                        id="product-image-modal-title"
                        variant="h6"
                        component="h2"
                        align="center"
                        gutterBottom
                        sx={{ mb: 2, fontWeight: 'bold' }}
                    >
                        {productName}
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: 'auto',
                            overflow: 'hidden',
                            borderRadius: 2,
                            bgcolor: '#f5f5f5'
                        }}
                    >
                        <Box
                            component="img"
                            src={`./src/assets/${imageUrl}`}
                            alt={productName}
                            sx={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                display: 'block',
                                p: 0,
                                m: 0
                            }}
                        />
                    </Box>
                </Paper>
            </Fade>
        </Modal>
    );
};