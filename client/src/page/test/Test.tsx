import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Nav from './layouts/dashboard/nav';
import Main from './layouts/dashboard/main';

export const Test = ({ children }) => {
  const [openNav, setOpenNav] = useState(false);

  return (
    <>
      <Box sx={{
        minHeight: 1,
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
      }}>
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />
        <Main>{children}</Main>
      </Box>
    </>
  );
}

Test.propTypes = {
  children: PropTypes.node,
};
