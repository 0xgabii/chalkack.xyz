import React from 'react';

const RegisterForm = props =>
  <form action={props.action} onSubmit={props.onSubmit}>
    <label>이름</label>
    <input type="text" name="name" required />
    <label>이메일</label>
    <input type="email" name="email" required />
    <label>비밀번호</label>
    <input type="password" name="pwd" required />
    <button>계정 생성</button>
  </form>;
export default RegisterForm;
