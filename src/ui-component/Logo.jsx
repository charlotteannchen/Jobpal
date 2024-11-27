// material-ui
import { useTheme } from '@mui/material/styles';

import logo from '../assets/images/JobPal-logo.png';

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const theme = useTheme();

  return (
  <img src={logo} alt="JobPal_logo" width="100" />
  );
};

export default Logo;
