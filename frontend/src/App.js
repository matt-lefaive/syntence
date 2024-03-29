import { Card, Tab, Tabs } from '@blueprintjs/core';
import { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from './context/UserContext';
import Loader from './components/loader';
import Login from './components/login';
import Register from './components/register';
import Workspace from './components/workspace';
import Title from './components/title';

const App = () => {
  const [currentTab, setCurrentTab] = useState('login');
  const [userContext, setUserContext] = useContext(UserContext);

  const verifyUser = useCallback(() => {
    fetch(process.env.REACT_APP_API_ENDPOINT + 'user/refreshToken', {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'}
    }).then(async response => {
      if (response.ok) {
        const data = await response.json()
        setUserContext(oldValues => {
          return { ...oldValues, token: data.token }
        })
      } else {
        setUserContext(oldValues => {
          return { ...oldValues, token: null}
        })
      }
      // call refreshToken every 30 minutes to renew the authentication token
      setTimeout(verifyUser, 30 * 60 * 1000);
    })
  }, [setUserContext]);

  useEffect(() => {
    verifyUser()
  }, [verifyUser]);

  /**
   * Sync logout across tabs
   */
  const syncLogout = useCallback(event => {
    if (event.key === 'logout') {
      // If using react-router-dom, may cal history.push('/')
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('storage', syncLogout);
    return () => {
      window.removeEventListener('storage', syncLogout)
    }
  }, [syncLogout]);

  return userContext.token === null ? (
    <>
      <Title />
      <Card elevation='1' className='auth-card'>
        <Tabs id='Tabs' onChange={setCurrentTab} selectedTabId={currentTab}>
          <Tab id='login' title='Login' panel={<Login />} />
          <Tab id='register' title='Register' panel={<Register />} />
          <Tabs.Expander />
        </Tabs>
      </Card>
    </>
  ) : userContext.token ? (
    <Workspace />
  ) : (
    <Loader />
  );
};

export default App;
