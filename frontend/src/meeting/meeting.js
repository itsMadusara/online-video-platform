import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, { useEffect, useRef, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import Peer from "simple-peer"
import io from "socket.io-client"
import { Grid, Typography, Paper, Container } from '@mui/material';
import Alert from '@mui/material/Alert';
import { Phone, PhoneDisabled } from '@mui/icons-material';

import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import ResponsiveAppBarLogin from '../navbar/navbarlogin';

const socket = io.connect(process.env.REACT_APP_BACKEND)
const modelSocket = io.connect(process.env.REACT_APP_MODEL)

const Meeting = () => {
	const token = localStorage.getItem('accessToken');
	if(token == null){
		window.location.href = '/';
	}

	let identify = localStorage.getItem('accessToken')

	const [callAccepted, setCallAccepted] = useState(false);
	const [callEnded, setCallEnded] = useState(false);
	const [stream, setStream] = useState(null);
	const [name, setName] = useState("");
	const [call, setCall] = useState({});
	const [me, setMe] = useState("");
	const [idToCall, setIdToCall] = useState('');
	const [dowsy, setDowsy] = useState(false);

	const myVideo = useRef(null);
	const userVideo = useRef(null);
	const connectionRef = useRef(null);

	const FPS = 10;
    setInterval(() => {
		if(stream && !dowsy && callAccepted){
			sendFrame();
		}
    }, 10000/FPS);

	modelSocket.on('response_back', (data) => {
		if(data == identify){
			setDowsy(true);
		}
	});

	const sendFrame = () => {
		if (stream && myVideo.current) {
		  const canvas = document.createElement('canvas');
		  canvas.width = myVideo.current.videoWidth;
		  canvas.height = myVideo.current.videoHeight;
		  const ctx = canvas.getContext('2d');
	
		  ctx.drawImage(myVideo.current, 0, 0, canvas.width, canvas.height);
		  const base64Data = canvas.toDataURL('image/jpeg'); // Convert canvas content to base64
	
		  modelSocket.emit('image', {base64Data,identify}); // Send base64-encoded frame to socket
		}
	};

	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ video: true, audio: true })
		  .then((currentStream) => {
			setStream(currentStream);
	
			// myVideo.current.srcObject = currentStream;
		  });
	
		socket.on('me', (id) => setMe(id));
	
		socket.on('callUser', ({ from, name: callerName, signal }) => {
		  setCall({ isReceivingCall: true, from, name: callerName, signal });
		});
	}, []);

	useEffect(() => {
		if (stream && myVideo.current) {
		  // Assign the media stream to the local video element
		  myVideo.current.srcObject = stream;
		}
	  }, [stream]);

	const callUser = (id) => {
		const peer = new Peer({ initiator: true, trickle: false, stream });
	
		peer.on('signal', (data) => {
		  socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
		});
	
		peer.on('stream', (currentStream) => {
		  userVideo.current.srcObject = currentStream;
		});
	
		socket.on('callAccepted', (signal) => {
		  setCallAccepted(true);
	
		  peer.signal(signal);
		});
	
		connectionRef.current = peer;
	};

	const answerCall = () => {
		setCallAccepted(true);
	
		const peer = new Peer({ initiator: false, trickle: false, stream });
	
		peer.on('signal', (data) => {
		  socket.emit('answerCall', { signal: data, to: call.from });
		});
	
		peer.on('stream', (currentStream) => {
		  userVideo.current.srcObject = currentStream;
		});
	
		peer.signal(call.signal);
	
		connectionRef.current = peer;
	};

	const leaveCall = () => {
		setCallEnded(true);
		connectionRef.current.destroy();
		window.location.reload();
	};

	socket.on('callEnded', () => {
		setCallEnded(true);
		window.location.reload();
	})

	return (
		<div>			
			{ !callAccepted && (
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
							<Typography component="h1" variant="h5">
								Connect to a Room
							</Typography>

							<Box sx={{ mt: 1 }}>
								<TextField
									margin="normal"
									required
									fullWidth
									id="roomkey"
									label="Room Key"
									name="roomkey"
									value={idToCall}
									onChange={(e) => setIdToCall(e.target.value)}
									autoFocus
								/>

								<Button
									fullWidth
									variant="contained"
									sx={{ mt: 3, mb: 2 }}
									onClick={() => callUser(idToCall)}
								>
									Connect
								</Button>

								<CopyToClipboard text={me}>
									<Button
										fullWidth
										variant="contained"
										color='success'
										sx={{ mt: 0.5, mb: 2 }}
									>
										Copy Room Key
									</Button>
								</CopyToClipboard>

								{call.isReceivingCall && !callAccepted && (
									<Button
										fullWidth
										variant="contained"
										color='error'
										sx={{ mt: 0.5, mb: 2 }}
										onClick={answerCall}
									>
										Someone is calling
									</Button>
								)}

							</Box>
						</Box>
					</Container>
				</div>
			)}

			<Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh', paddingTop: '20px' }}>
				{stream && (
				<Paper>
					<Grid item xs={12} md={6}>
						<video
							ref={myVideo}
								playsInline
								muted
								autoPlay
						/>
					</Grid>
				</Paper>
				)}
				{callAccepted && !callEnded && call &&(
					<Paper>
						<Grid item xs={12} md={6}>
							<video playsInline ref={userVideo} autoPlay />
						</Grid>
					</Paper>
				)}
			</Grid>

			{ callAccepted && (
				<div>
					{ dowsy && (<Alert severity="warning" onClose={() => {setDowsy(false)}}>
							You are {dowsy ? 'Dowsy' : 'Not Dowsy'}
					</Alert>)}

					<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
						{ callAccepted && !callEnded ? (
							<Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large" />} onClick={leaveCall}>
								Hang Up
							</Button>
						) : (
							<Button variant="contained" color="primary" startIcon={<Phone fontSize="large" />} fullWidth onClick={() => callUser(idToCall)}>
							Call
							</Button>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default Meeting;