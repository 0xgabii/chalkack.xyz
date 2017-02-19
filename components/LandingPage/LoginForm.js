import React from 'react';

const LoginForm = (props) =>
  <form action={props.action} onSubmit={props.onSubmit}>
    <label>이메일</label>
    <input type="email" name="email" required />
    <label>비밀번호</label>
    <input type="password" name="pwd" required />
    <button>로그인</button>
  </form>;
export default LoginForm;
