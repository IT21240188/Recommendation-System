import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Button } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const userInfoString = localStorage.getItem('UserInfo');
  const storedUserInfo = JSON.parse(userInfoString);
  const [user, setUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response1 = await axios.get(
        `http://localhost:8080/api/users/getUserById/${storedUserInfo.id}`
      );
      setUser(response1.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
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
      position="fixed"
      style={{ backgroundColor: 'white', top: 0, zIndex: 1000 }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <div style={{ width: '16%', height: '76px' }}>
            <Link to='/'>
              <img src="/bookStoreLogo.png" width="100%" height="100%" />
            </Link>
          </div>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            ></Menu>
          </Box>

          <Box
            sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}
            margin={'auto'}
          >
            <a
              href="/"
              style={{
                textDecoration: 'none',
                fontWeight: 'bolder',
                fontSize: 'larger',
              }}
            >
              <MenuItem style={{ margin: '0 5%' }}>
                <h4>Home</h4>
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
              <MenuItem style={{ margin: '0 5%' }}>
                <p style={{margin:'4px 0px 0px 0px'}}>For You</p>
              </MenuItem>
            </a>
           
          </Box>
          {userInfoString ? (
            <>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src={user.profilePicURL} />
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
              <a href="/login">
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
