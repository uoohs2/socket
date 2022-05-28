import React from 'react';
import { useDispatch } from 'react-redux';
import { kakaoLoginDB } from './login';

const Kakao = (props) => {
  const dispatch = useDispatch();

  // 인가코드
  let code = new URL(window.location.href).searchParams.get('code');

  React.useEffect(async () => {
    await dispatch(kakaoLoginDB(code));
  }, []);

  return null;
};

export default Kakao;
