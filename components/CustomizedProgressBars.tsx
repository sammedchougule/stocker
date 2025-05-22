import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

function GradientCircularProgress() {
  return (
    <React.Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="red" />
            <stop offset="50%" stopColor="white" />
            <stop offset="100%" stopColor="green" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
    </React.Fragment>
  );
}

export default function CustomizedProgressBars() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <GradientCircularProgress />
    </Box>
  );
}
