import React from 'react';

function UnitToggle({ unit, toggleUnit }) {
  return (
    <div className="unit-toggle">
      <button onClick={toggleUnit}>
        {unit === 'metric' ? 'Switch to °F' : 'Switch to °C'}
      </button>
    </div>
  );
}

export default UnitToggle;