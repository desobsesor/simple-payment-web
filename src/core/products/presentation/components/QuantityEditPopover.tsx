import { Box, Button, Popover, TextField, Typography } from '@mui/material';
import { ChangeEvent, useState, useEffect } from 'react';
import { SxProps } from '@mui/system';

interface QuantityEditPopoverProps {
    open: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;
    productId: string;
    stock: number;
    initialQuantity: number;
    onSubmit: (productId: string, quantity: number) => void;
    onNotification?: (message: string, severity: 'error' | 'warning' | 'info' | 'success') => void;
}

//#region STYLES

const getPopoverPaperStyles = (): SxProps => ({
    p: 2,
    width: 230,
    borderRadius: 2,
    boxShadow: 3,
    ml: 8,
    mt: 2,
});

const getTitleStyles = (): SxProps => ({
    mb: 1,
    fontWeight: 'medium'
});

const getBoxContainerStyles = (): SxProps => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 1
});

const getTextFieldStyles = (): SxProps => ({
    mb: 1
});

const getAvailableTextStyles = (): SxProps => ({
    mb: 1
});

const getButtonStyles = (): SxProps => ({
    bgcolor: '#069eda',
    '&:hover': { bgcolor: '#0fa0da' },
    borderRadius: 2
});

//#endregion

export const QuantityEditPopover = ({
    open,
    anchorEl,
    onClose,
    productId,
    stock,
    initialQuantity,
    onSubmit,
    onNotification
}: QuantityEditPopoverProps) => {
    const [editingQuantity, setEditingQuantity] = useState<string>('');

    useEffect(() => {
        if (open) {
            setEditingQuantity(String(initialQuantity));
        }
    }, [open, initialQuantity]);

    /**
     * 
     * @param event 
     * @returns 
     * 
     * This function is used to handle the change event of the quantity input field.
     * It allows only numbers to be entered and updates the editingQuantity state accordingly.
     * If the entered value is greater than the stock, it displays an error notification.
     * If the entered value is less than 1, it displays a warning notification.
     * 
     */
    const handleQuantityInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        // Allow only numbers
        if (/^\d*$/.test(value)) {
            setEditingQuantity(value);

            if (value) {
                const numValue = parseInt(value, 10);

                if (numValue > stock) {
                    onNotification?.(
                        `The quantity cannot be greater than the available stock (${stock} kg)`,
                        'error'
                    );
                } else if (numValue < 1) {
                    onNotification?.(
                        'The quantity must be at least 1 kg',
                        'warning'
                    );
                }
            }
        }
    };

    /**
     * This function is used to handle the submit event of the quantity input field.
     * It checks if the entered quantity is valid and calls the onSubmit callback with the new quantity.
     * If the entered quantity is invalid, it displays an error notification.
     */
    const handleQuantitySubmit = () => {
        const newQuantity = parseInt(editingQuantity, 10) || 1;

        if (newQuantity > 0 && newQuantity <= stock) {
            onSubmit(productId, newQuantity);
        } else if (newQuantity > stock) {
            onNotification?.(
                `The quantity cannot be greater than the available stock (${stock} kg)`,
                'error'
            );
        } else if (newQuantity < 1) {
            onNotification?.(
                'The quantity must be at least 1 kg',
                'warning'
            );
        }

        onClose();
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            PaperProps={{
                sx: getPopoverPaperStyles()
            }}
        >
            <Typography variant="subtitle2" sx={getTitleStyles()}>
                Edit quantity (kg)
            </Typography>
            <Box sx={getBoxContainerStyles()}>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={editingQuantity}
                    onChange={handleQuantityInputChange}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleQuantitySubmit();
                        }
                    }}
                    autoFocus
                    inputProps={{
                        min: 1,
                        max: stock,
                        style: { textAlign: 'center' }
                    }}
                    sx={getTextFieldStyles()}
                />
                <Typography variant="caption" color="text.secondary" sx={getAvailableTextStyles()}>
                    Available: {stock} kg
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleQuantitySubmit}
                    fullWidth
                    sx={getButtonStyles()}
                >
                    Apply
                </Button>
            </Box>
        </Popover>
    );
};