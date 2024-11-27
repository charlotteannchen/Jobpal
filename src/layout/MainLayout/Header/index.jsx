import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// project imports
import LogoSection from '../LogoSection';
import { useFirebase } from 'contexts/FirebaseContext';

// assets
import { IconMenu2, IconLogout } from '@tabler/icons-react';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();
  const { logout } = useFirebase();

  // For changing login/logout automatically
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <ButtonBase sx={{ borderRadius: '8px', overflow: 'hidden' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              '&:hover': {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light
              }
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>

      {/* Logout Button */}
      <ListItemButton
        onClick={handleLogout}
        sx={{
          borderRadius: '60px',          // 保持圓角
          width: 'auto',                 // 根據內容自動調整寬度
          padding: '8px 16px',           // 調整內邊距縮小按鈕大小
          justifyContent: 'flex-end',    // 使內容對齊右側
          marginLeft: 'auto',            // 讓按鈕靠右邊顯示
          display: 'flex',               // 設置為 flex 排版
          alignItems: 'center',          // 垂直居中
          maxWidth: '150px',             // 限制最大寬度，避免過大
        }}
      >
        <ListItemIcon>
          <IconLogout stroke={1.5} size="1.3rem" />
        </ListItemIcon>
        <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
      </ListItemButton>
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
