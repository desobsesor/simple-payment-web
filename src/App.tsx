import { AppBar, Box, Container, CssBaseline, Slide, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import './App.css';
import { ProductList } from './core/products/presentation/components/ProductList';
import ErrorNotification from './shared/feedback/ErrorNotification';
import { PaymentMethodProvider } from './contexts/PaymentMethodContext';
import { CartProvider } from './contexts/CartContext';
import { ShoppingCart } from './core/products/presentation/components/ShoppingCart';
import { SxProps } from '@mui/system';

//#region STYLES

const getAppBarStyles = (scrolled: boolean, headerOpacity: number): SxProps => ({
  top: 0,
  left: 0,
  right: 0,
  width: '100%',
  transition: 'all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
  bgcolor: `rgba(255, 255, 255, ${headerOpacity * 0.95})`,
  backdropFilter: `blur(${headerOpacity * 6}px)`,
  boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
  py: scrolled ? 0 : { xs: 1, sm: 1.5, md: 2 },
  zIndex: 1000
});

const getToolbarStyles = (scrolled: boolean): SxProps => ({
  display: 'flex',
  flexDirection: scrolled ? 'row' : 'column',
  alignItems: scrolled ? 'center' : 'flex-start',
  justifyContent: scrolled ? 'space-between' : 'center',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  px: scrolled ? 3 : 0,
  py: scrolled ? 1 : 2,
  minHeight: {
    xs: scrolled ? '5px' : '80px',
    sm: scrolled ? '6px' : '20px',
    md: scrolled ? '4px' : '50px',
  }
});

const getBoxStyles = (scrolled: boolean): SxProps => ({
  display: 'flex',
  flexDirection: scrolled ? 'row' : 'row',
  alignItems: scrolled ? 'center' : 'flex-start',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  verticalAlign: 'middle',
  textAlign: 'center',
  justifyContent: scrolled ? 'flex-start' : 'center',
  flexGrow: 1,
  flexShrink: 0,
  flexBasis: 'auto',
  flexWrap: 'wrap',
  marginLeft: scrolled ? 0 : 'auto',
  marginRight: scrolled ? 0 : 'auto',
  padding: scrolled ? 0 : { xs: 1, sm: 1.5, md: 2 }
});

const getTypographyStyles = (scrolled: boolean): SxProps => ({
  transition: 'all 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)',
  mr: scrolled ? 2 : 0,
  mb: scrolled ? 0 : 1,
  fontWeight: 'bold',
  color: scrolled ? 'primary.main' : 'text.primary',
  fontSize: {
    xs: scrolled ? '1.2rem' : '1.8rem',
    sm: scrolled ? '1.3rem' : '2.2rem',
    md: scrolled ? '1.5rem' : '2.5rem',
  },
  lineHeight: 1,
});

const getContainerStyles = (scrolled: boolean): SxProps => ({
  px: 0,
  mt: {
    xs: scrolled ? 8 : 4,
    sm: scrolled ? 8 : 6,
    md: scrolled ? 8 : 8
  }
});

//#endregion

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Detect scroll with debounce to smooth the detection
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      //Higher threshold to avoid sudden changes
      const isScrolled = position > 100;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Calculate opacity and scale values ​​based on the scroll position
  // Smooth the transition by making the changes more gradual
  const headerOpacity = Math.min(1, scrollPosition / 120);

  return (
    <PaymentMethodProvider>
      <CartProvider>
        <CssBaseline />
        <AppBar
          position="fixed"
          color="default"
          elevation={scrolled ? 4 : 0}
          sx={getAppBarStyles(scrolled, headerOpacity)}
        >
          <Toolbar sx={getToolbarStyles(scrolled)}>
            <Box sx={getBoxStyles(scrolled)}>
              <Slide direction="down" in={true} mountOnEnter unmountOnExit>
                <Typography
                  variant={scrolled ? "h6" : "h3"}
                  component="h1"
                  gutterBottom={!scrolled}
                  sx={getTypographyStyles(scrolled)}
                >
                  Our products
                </Typography>
              </Slide>
            </Box>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={getContainerStyles(scrolled)}>
          <ProductList />
          <ErrorNotification />
          <ShoppingCart />
        </Container>
      </CartProvider>
    </PaymentMethodProvider >
  )
}

export default App
