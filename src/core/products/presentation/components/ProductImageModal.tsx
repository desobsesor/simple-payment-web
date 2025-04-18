import { Close as CloseIcon } from '@mui/icons-material';
import {
    Box,
    Fade,
    IconButton,
    Modal,
    Paper,
    Typography
} from '@mui/material';
import { SxProps } from '@mui/system';

interface ProductImageModalProps {
    open: boolean;
    onClose: () => void;
    productName: string;
    imageUrl: string;
}

//#region STYLES

const getModalStyles = (): SxProps => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: { xs: 2, sm: 4 }
});

const getPaperStyles = (): SxProps => ({
    position: 'relative',
    maxWidth: { xs: '95%', sm: '90%', md: '80%', lg: '70%' },
    maxHeight: { xs: '95vh', sm: '90vh' },
    width: 'auto',
    p: 3,
    borderRadius: 4,
    overflow: 'hidden',
    outline: 'none',
    boxShadow: 10
});

const getCloseButtonStyles = (): SxProps => ({
    position: 'absolute',
    right: 8,
    top: 8,
    bgcolor: 'rgba(0, 0, 0, 0.04)',
    zIndex: 1,
    '&:hover': {
        bgcolor: 'rgba(0, 0, 0, 0.1)'
    }
});

const getTitleStyles = (): SxProps => ({
    mb: 2,
    fontWeight: 'bold'
});

const getImageContainerStyles = (): SxProps => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    overflow: 'hidden',
    borderRadius: 2,
    bgcolor: '#f5f5f5'
});

const getImageStyles = (): SxProps => ({
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    display: 'block',
    p: 0,
    m: 0
});

//#endregion

export const ProductImageModal = ({ open, onClose, productName, imageUrl }: ProductImageModalProps) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            aria-labelledby="product-image-modal-title"
            aria-describedby="product-image-modal-description"
            sx={getModalStyles()}
        >
            <Fade in={open}>
                <Paper
                    elevation={6}
                    sx={getPaperStyles()}
                >
                    <IconButton
                        onClick={onClose}
                        sx={getCloseButtonStyles()}
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
                        sx={getTitleStyles()}
                    >
                        {productName}
                    </Typography>

                    <Box
                        sx={getImageContainerStyles()}
                    >
                        <Box
                            component="img"
                            src={`./src/assets/${imageUrl}`}
                            alt={productName}
                            sx={getImageStyles()}
                        />
                    </Box>
                </Paper>
            </Fade>
        </Modal>
    );
};