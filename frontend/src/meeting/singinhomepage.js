import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ResponsiveAppBarLogin from '../navbar/navbarlogin';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

const SigninHomePage = () => {
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
          roomkey: data.get('roomkey'),
        });
    };
    
    return (
        <ThemeProvider theme={defaultTheme}>
          <ResponsiveAppBarLogin />
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                <ConnectWithoutContactIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Connect to a Room
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="roomkey"
                  label="Room Key"
                  name="roomkey"
                  autoFocus
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Connect
                </Button>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
    );
}

export default SigninHomePage;