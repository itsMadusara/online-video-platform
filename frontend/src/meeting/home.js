import Button from '@mui/material/Button';
import React from "react"
import { Typography, Container } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import ResponsiveAppBarLogin from '../navbar/navbarlogin';

const MeetingHome = () => {
    const token = localStorage.getItem('accessToken');
	if(token == null){
		window.location.href = '/';
	}
    
	return (
		<div>
			<div>
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
						<Typography component="h1" variant="h5" sx={{ marginTop: 2}}>
							Hi There! Take a meeting...
						</Typography>

						<Box sx={{ mt: 1 }}>
							<Button
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
								onClick={() => {window.location.href = '/meeting';}}
							>
								Connect
							</Button>
						</Box>
					</Box>
				</Container>
			</div>
		</div>
	)
}

export default MeetingHome;