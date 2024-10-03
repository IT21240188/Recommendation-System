import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const userInfoString = localStorage.getItem('UserInfo');
  const storedUserInfo = JSON.parse(userInfoString);
  const [user, setUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // const loadData = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response1 = await axios.get(
  //       `http://localhost:8080/api/users/getUserById/${storedUserInfo.id}`
  //     );
  //     setUser(response1.data);
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   loadData();
  // }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function handleSignOut() {
    localStorage.removeItem('UserInfo');
    window.location.href = '/login';
  }

  return (
    <AppBar
      position="sticky"
      style={{ backgroundColor: 'white', top: 0, zIndex: 1000 }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <div style={{ width: '16%', height: '76px' }}>
            <Link to="/">
              <img src="/bookStoreLogo.png" width="200px" height="100%" />
            </Link>
          </div>

          <Box sx={{ flexGrow: 0, display: { md: 'flex' } }} margin={'auto'}>
            <a
              href="/"
              style={{
                textDecoration: 'none',
                fontWeight: 'bolder',
                fontSize: 'larger',
              }}
            >
              <MenuItem style={{ margin: '0 5%', color: 'black' }}>
                Home
              </MenuItem>
            </a>
            <a
              href="/WorkoutPlans"
              style={{
                textDecoration: 'none',
                fontWeight: 'bolder',
                fontSize: 'larger',
              }}
            >
              <MenuItem style={{ margin: '0 5%', color: 'black' }}>
                For You
              </MenuItem>
            </a>
            <a
              href=""
              style={{
                textDecoration: 'none',
                fontWeight: 'bolder',
                fontSize: 'larger',
              }}
            >
              <MenuItem style={{ margin: '0 5%', color: 'black' }}>
                Others recommend
              </MenuItem>
            </a>
          </Box>
          {userInfoString ? (
            <>
              <Box sx={{ flexGrow: 0, minWidth: '200px', textAlign: 'center' }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src={storedUserInfo.user.profileImage}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <a
                    href="/myprofile"
                    style={{ textDecoration: 'none', color: 'black' }}
                  >
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Typography textAlign="center"> Profile</Typography>
                    </MenuItem>
                  </a>
                  <MenuItem onClick={handleSignOut}>
                    <Typography textAlign="center" color={'red'}>
                      Sign Out
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <>
              <a href="/login" style={{ marginRight: '1%' }}>
                <Button>Login</Button>
              </a>
              <a href="/register">
                <Button>Register</Button>
              </a>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
