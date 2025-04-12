import { ErrorOutlined, FiberManualRecord } from '@mui/icons-material';
import { Box, Button, Container, Divider, List, ListItem, ListItemIcon, ListItemText, Paper, Stack, Typography } from '@mui/material';

interface ErrorPageProps {
    error: string;
}

const ErrorPage = ({ error }: ErrorPageProps) => {
    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80vh',
                px: 1
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    maxWidth: 'md',
                    width: '100%',
                    borderRadius: 2,
                    overflow: 'hidden',
                    p: 3
                }}
            >
                <Stack alignItems="center" textAlign="center" spacing={2}>
                    <Box
                        sx={{
                            mb: 2,
                            color: 'error.main',
                            animation: 'pulse 1.5s infinite',
                            '@keyframes pulse': {
                                '0%': { opacity: 0.7 },
                                '50%': { opacity: 1 },
                                '100%': { opacity: 0.7 }
                            }
                        }}
                    >
                        <ErrorOutlined fontSize="large" />
                    </Box>

                    <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
                        Something went wrong!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        We're sorry, an unexpected error occurred while processing your request.
                    </Typography>

                    <Divider flexItem sx={{ mb: 3 }} />

                    <Box sx={{ width: '100%', textAlign: 'left', mb: 3 }}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            You can try:
                        </Typography>
                        <List>
                            <ListItem disableGutters>
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <FiberManualRecord sx={{ color: 'primary.main', fontSize: 8 }} />
                                </ListItemIcon>
                                <ListItemText primary="Reload the page" />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <FiberManualRecord sx={{ color: 'primary.main', fontSize: 8 }} />
                                </ListItemIcon>
                                <ListItemText primary="Check your internet connection" />
                            </ListItem>
                            <ListItem disableGutters>
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <FiberManualRecord sx={{ color: 'primary.main', fontSize: 8 }} />
                                </ListItemIcon>
                                <ListItemText primary="Try again later" />
                            </ListItem>
                        </List>
                    </Box>

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        width="100%"
                    >
                        <Button
                            variant="outlined"
                            fullWidth
                            color="inherit"
                            onClick={() => window.history.back()}
                        >
                            Back to home
                        </Button>
                        <Button
                            variant="contained"
                            fullWidth
                            color="primary"
                            sx={{
                                py: 1,
                                bgcolor: '#2196f3',
                                '&:hover': { bgcolor: '#1976d2' },
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 'bold',
                                minWidth: '120px'
                            }}
                            onClick={() => window.location.reload()}
                        >
                            Try again
                        </Button>
                    </Stack>

                    <Typography variant="caption" color="text.secondary" fontFamily="monospace" sx={{ mt: 3 }}>
                        {error}
                    </Typography>
                </Stack>
            </Paper>
        </Container>
    );
};

export default ErrorPage;