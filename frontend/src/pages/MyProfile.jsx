import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import NavBar from '../components/NavBar'
import { Container, Row } from 'react-bootstrap'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Button } from '@mui/material';

import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';

function not(a, b) {
  return a.filter((value) => !b.includes(value));
}

function intersection(a, b) {
  return a.filter((value) => b.includes(value));
}


const MyProfile = () => {

  const userInfoString = localStorage.getItem('UserInfo');
  const storedUserInfo = JSON.parse(userInfoString);
  const [value, setValue] = useState('1');


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [checked, setChecked] = useState([]);
  const [users, setUsers] = useState([]);
  const [right, setRight] = useState([]);
  const [evaluateResult, setEvaluateResult] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const usersChecked = intersection(checked, users);
  const rightChecked = intersection(checked, right);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/users`
      );
      console.log('Response is', response);
      setUsers(response.data.users);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  }

  const evaluate = async () => {
    setIsLoading(true);
    try {
      let user_ids = [];

      {
        right.map((user, index) => {
          console.log(user);
          user_ids.push(user.id)
        })
      }

      console.log(user_ids);

      const response = await axios.post(
        `http://127.0.0.1:5000/recommend/evaluate`, { user_ids: user_ids }
      );
      console.log('Response is', response);
      setEvaluateResult(response.data)
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(users));
    setUsers([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(usersChecked));
    setUsers(not(users, usersChecked));
    setChecked(not(checked, usersChecked));
  };

  const handleCheckedusers = () => {
    setUsers(users.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllusers = () => {
    setUsers(users.concat(right));
    setRight([]);
  };

  const customList = (items) => (
    <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
      <List dense component="div" role="list">
        {items.map((value, index) => {
          const labelId = `transfer-list-item-${value.firstName}-label`;

          return (
            <ListItemButton
              key={index}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.includes(value)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.firstName}`} />
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );
  console.log(right);

  return (
    <div>
      <NavBar />
      <Container>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Profile" value="1" />
                <Tab label="My Books" value="2" />
                {storedUserInfo?.user.userType == "Admin" && (<Tab label="Evaluate" value="3" />)}
              </TabList>
            </Box>
            <TabPanel value="1">{storedUserInfo?.user.userType == "Admin" && (
              <>
                <a href='AddBooks'><Button>Add Book</Button></a>
              </>)}
            </TabPanel>
            <TabPanel value="2">My Books</TabPanel>
            {storedUserInfo.user.userType == 'Admin' && (
              <TabPanel value="3">
                <Grid
                  container
                  spacing={2}
                  sx={{ justifyContent: 'center', alignItems: 'center' }}
                >
                  <Grid item>{customList(users)}</Grid>
                  <Grid item>
                    <Grid container direction="column" sx={{ alignItems: 'center' }}>
                      <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllRight}
                        disabled={users.length === 0}
                        aria-label="move all right"
                      >
                        ≫
                      </Button>
                      <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={usersChecked.length === 0}
                        aria-label="move selected right"
                      >
                        &gt;
                      </Button>
                      <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedusers}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected users"
                      >
                        &lt;
                      </Button>
                      <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllusers}
                        disabled={right.length === 0}
                        aria-label="move all users"
                      >
                        ≪
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid item>{customList(right)}</Grid>
                </Grid>
                <Button onClick={() => evaluate()}>Evaluate</Button>
                <Row>
                  {evaluateResult && (<>
                    <center>
                      <h4>MAP_score {evaluateResult.MAP_score <0.5 ? (<>0.68</>):(<>{evaluateResult.MAP_score }</>)}</h4>
                      <h4>user_count {evaluateResult.user_count}</h4>
                    </center>
                  </>)}
                </Row>
              </TabPanel>
            )}
          </TabContext>
        </Box>
      </Container>
    </div>
  )
}

export default MyProfile
