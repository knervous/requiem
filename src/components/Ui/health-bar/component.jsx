import React from 'react';

import './component.scss';

export const HealthBar = ({ pct, display = '100%', color = '#d34549', style = {}, width = 200 }) => {
  return <div className="health-bar" style={style}>
    <p>{display}</p>
    <div className="health-bar-glass" style={{ width }}>
      <div style={{ width: `${pct}%`, background: color }} className="health-bar-fluid"></div>
    </div>
  </div>;
};

export default HealthBar;