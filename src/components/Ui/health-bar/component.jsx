import React from 'react';

import './component.scss';

export const HealthBar = ({ pct, display = '100%', color = '#d34549', style = {}, width = 200 }) => {
  return <div class="health-bar" style={style}>
    <p>{display}</p>
    <div class="health-bar-glass" style={{ width }}>
      <div style={{ width: `${pct}%`, background: color }} class="health-bar-fluid"></div>
    </div>
  </div>;
};

export default HealthBar;