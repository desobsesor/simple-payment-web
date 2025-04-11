import { Box, Button, Popover, TextField, Typography } from '@mui/material';
import { ChangeEvent, useState, useEffect } from 'react';

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
                sx: {
                    p: 2,
                    width: 230,
                    borderRadius: 2,
                    boxShadow: 3,
                    ml: 8,
                    mt: 2,
                }
            }}
        >
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium' }}>
                Edit quantity (kg)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={editingQuantity}
                    onChange={handleQuantityInputChange}
                    autoFocus
                    inputProps={{
                        min: 1,
                        max: stock,
                        style: { textAlign: 'center' }
                    }}
                    sx={{ mb: 1 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                    Available: {stock} kg
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleQuantitySubmit}
                    fullWidth
                    sx={{
                        bgcolor: '#069eda ',
                        '&:hover': { bgcolor: '#0fa0da' },
                        borderRadius: 2
                    }}
                >
                    Apply
                </Button>
            </Box>
        </Popover>
    );
};