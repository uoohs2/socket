import './App.css';
import io from 'socket.io-client';
import { useState } from 'react';
import Chat from './Chat';
import Kakao from './Kakao';
import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Route } from 'react-router-dom';
import { history } from './configureStore';
import { useDispatch } from 'react-redux';
import { kakaoLoginDB } from './login';
import { useSelector } from 'react-redux';

const socket = io.connect('http://3.34.98.41', { path: '/socket.io' });

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [join, setJoin] = useState('');
  const [showChat, setShowChat] = useState(false);

  const isLogin = useSelector((state) => state.login.isLogin);
  const userInfo = useSelector((state) => state.login.userInfo);
  React.useEffect(() => {
    if (isLogin) {
      setUsername(userInfo.userName);
      setRoom(userInfo.userId);
    }
  }, []);

  const joinRoom = () => {
    if (username !== '' && room !== '') {
      socket.emit('join_room', room);
      setShowChat(true);
    }
  };
  const onLeaveRoom = () => {
    //on= 연결 , emit = 전송
    socket.emit('leave-room', room, () => setRoom(null));
    setTimeout(() => {
      window.location.pathname = '/';
    }, 1000);
  };

  const REST_API_KEY = 'ebb64769e9ae562700e77df6554c840d';
  const REDIRECT_URI = 'http://localhost:3001/oauth/kakao/callback';
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  return (
    <ConnectedRouter history={history}>
      <Route exact path="/oauth/kakao/callback" component={Kakao}></Route>
      <div className="App">
        <div
          style={{
            width: '100px',
            height: '50px',
            backgroundColor: 'green',
            color: 'white',
          }}
        >
          <a href={KAKAO_AUTH_URL}>kakao</a>
        </div>
        {!showChat ? (
          <div className="joinChatContainer">
            <h3>채팅방 참여하기</h3>
            <input
              type="text"
              placeholder="John..."
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Room ID..."
              onChange={(event) => {
                setRoom(event.target.value);
              }}
            />
            <button onClick={joinRoom}>메세지 보내기</button>
          </div>
        ) : (
          <Chat
            socket={socket}
            username={username}
            room={room}
            onLeaveRoom={onLeaveRoom}
          />
        )}
      </div>
    </ConnectedRouter>
  );
}

export default App;
