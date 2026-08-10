import React from 'react';

export default function PayoffMatrix({ currentEffort, currentMinEffort }) {
  const effortLevels = [7, 6, 5, 4, 3, 2, 1];
  
  const calculatePayoff = (e, m) => {
    if (e < m) return '***'; // Impossible state
    return 60 - 10 * e + 20 * m;
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="matrix-table">
        <thead>
          <tr>
            <th>Your Effort \ Team Min</th>
            {effortLevels.map(m => <th key={`header-${m}`}>{m}</th>)}
          </tr>
        </thead>
        <tbody>
          {effortLevels.map(e => (
            <tr key={`row-${e}`}>
              <th>{e}</th>
              {effortLevels.map(m => {
                const payoff = calculatePayoff(e, m);
                const isImpossible = payoff === '***';
                const isCurrent = e === currentEffort && m === currentMinEffort;
                
                let className = '';
                if (isImpossible) className = 'impossible';
                if (isCurrent) className = 'highlighted';
                
                return (
                  <td key={`cell-${e}-${m}`} className={className}>
                    {payoff}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
