import React, { useState, ChangeEvent, FormEvent } from 'react';
import PageComponent from '../components/PageComponent';
import styled from 'styled-components';

// import { useHistory, useLocation, RouteComponentProps } from 'react-router-dom';
// import authentication from '../api/authentication';

// const Login: React.FunctionComponent<RouteComponentProps> = () => {

const FormGroup = styled.div`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  margin: 10px;
  display: block;
`;

const Label = styled.label`
  width: 100%;
`;

const Login: React.FC = () => {
  // let history = useHistory();
  // let location = useLocation();

  // let { from } = location.state || { from: { pathname: "/" } };

  // let login = () => {
  //   authentication.authenticate(() => {
  //     history.replace(from);
  //   });
  // };

  const [emailAddress, setEmailAddress] = useState('');
  const [passWord, setPassword] = useState('');

  // TODO : Add validators
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailAddress(e.target.value);
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO : Do post request
  };

  return (
    <PageComponent hasNavigation={false}>
      <form action="#" method="post" onSubmit={submit}>
        <FormGroup>
          <Label htmlFor="email">E-mail</Label>
          <Input
            onChange={handleEmailChange}
            type="email"
            name="email"
            id="email"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            onChange={handlePasswordChange}
            type="password"
            name="password"
            id="password"
          />
        </FormGroup>
        <button type="submit">Login</button>
      </form>
    </PageComponent>
  );

  // return (
  //   <div>
  //     {/* <p>You must log in to view the page at {from.pathname}</p>
  //     <button onClick={login}>Log in</button> */}
  //     This is the login Page.
  //   </div>
  // );
};

export default Login;
