import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function PayoffMatrix({ currentEffort, currentMinEffort }) {
  const effortLevels = [7, 6, 5, 4, 3, 2, 1];
  
  const calculatePayoff = (e, m) => {
    if (e < m) return '***'; // Impossible state
    return 60 - 10 * e + 20 * m;
  };

  return (
    <div className="rounded-md border bg-white/40 backdrop-blur-md overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/5 hover:bg-primary/5">
            <TableHead className="font-bold text-primary text-center border-r border-b">Your Effort \ Team Min</TableHead>
            {effortLevels.map(m => <TableHead key={`header-${m}`} className="text-center font-bold text-primary border-b">{m}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {effortLevels.map(e => (
            <TableRow key={`row-${e}`}>
              <TableCell className="font-medium text-center border-r bg-primary/5">{e}</TableCell>
              {effortLevels.map(m => {
                const payoff = calculatePayoff(e, m);
                const isImpossible = payoff === '***';
                const isCurrent = e === currentEffort && m === currentMinEffort;
                
                let className = "text-center transition-all duration-200 border-b border-r ";
                if (isImpossible) className += "bg-destructive/5 text-muted-foreground/40 ";
                if (isCurrent) className += "bg-green-100 font-bold border-2 border-green-500 text-green-700 text-lg shadow-inner ";
                
                return (
                  <TableCell key={`cell-${e}-${m}`} className={className}>
                    {payoff}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
