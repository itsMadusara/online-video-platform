import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, { useEffect, useRef, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import Peer from "simple-peer"
import io from "socket.io-client"
import { Grid, Typography, Paper, Container } from '@mui/material';
import Alert from '@mui/material/Alert';
import { Assignment, Phone, PhoneDisabled } from '@mui/icons-material';

const socket = io.connect('http://localhost:5000')
const modelSocket = io.connect('http://127.0.0.1:5000')

const Meeting = () => {

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
		if(stream && !dowsy){
			sendFrame();
		}
    }, 10000/FPS);

	modelSocket.on('response_back', (data) => {
		console.log(data);
		setDowsy(true);
	});

	const sendFrame = () => {
		if (stream) {
		  const canvas = document.createElement('canvas');
		  canvas.width = myVideo.current.videoWidth;
		  canvas.height = myVideo.current.videoHeight;
		  const ctx = canvas.getContext('2d');
	
		  ctx.drawImage(myVideo.current, 0, 0, canvas.width, canvas.height);
		  const base64Data = canvas.toDataURL('image/jpeg'); // Convert canvas content to base64
	
		  modelSocket.emit('image', base64Data); // Send base64-encoded frame to socket
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
		if (stream) {
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

	return (
		<div>
			<Grid container>
				{stream && (
					<Paper>
					<Grid item xs={12} md={6}>
						<Typography variant="h5" gutterBottom>{name || 'Name'}</Typography>
						<video playsInline muted ref={myVideo} autoPlay />
					</Grid>
					</Paper>
				)}
				{callAccepted && !callEnded && call &&(
					<Paper>
					<Grid item xs={12} md={6}>
						<Typography variant="h5" gutterBottom>{call.name || 'Name'}</Typography>
						<video playsInline ref={userVideo} autoPlay />
					</Grid>
					</Paper>
				)}
			</Grid>

			{ dowsy && (<Alert severity="warning" onClose={() => {setDowsy(false)}}>
					You are {dowsy ? 'Dowsy' : 'Not Dowsy'}
			</Alert>)}

			<Container>
				<Paper elevation={10}>
					<form noValidate autoComplete="off">
					<Grid container>
						<Grid item xs={12} md={6}>
						<Typography gutterBottom variant="h6">Account Info</Typography>
						<TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
						<CopyToClipboard text={me}>
							<Button variant="contained" color="primary" fullWidth startIcon={<Assignment fontSize="large" />}>
							Copy Your ID
							</Button>
						</CopyToClipboard>
						</Grid>
						<Grid item xs={12} md={6}>
						<Typography gutterBottom variant="h6">Make a call</Typography>
						<TextField label="ID to call" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} fullWidth />
						{callAccepted && !callEnded ? (
							<Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large" />} fullWidth onClick={leaveCall}>
							Hang Up
							</Button>
						) : (
							<Button variant="contained" color="primary" startIcon={<Phone fontSize="large" />} fullWidth onClick={() => callUser(idToCall)}>
							Call
							</Button>
						)}
						</Grid>
					</Grid>
					</form>
					{call.isReceivingCall && !callAccepted && (
						<div style={{ display: 'flex', justifyContent: 'space-around' }}>
						<h1>{call.name} is calling:</h1>
						<Button variant="contained" color="primary" onClick={answerCall}>
							Answer
						</Button>
						</div>
					)}
				</Paper>
			</Container>
		</div>
	)
}

export default Meeting