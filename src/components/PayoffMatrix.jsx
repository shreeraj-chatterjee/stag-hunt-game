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
    if (e < m) return null; // Impossible state
    return 60 - 10 * e + 20 * m;
  };

  return (
    <div className="rounded-md border bg-white/40 backdrop-blur-md overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/5 hover:bg-primary/5">
            <TableHead rowSpan={2} colSpan={2} className="border-r border-b"></TableHead>
            <TableHead colSpan={7} className="text-center font-bold text-primary border-b uppercase tracking-wider text-xs md:text-sm bg-primary/10">
              Minimum Effort-Level chosen across teams
            </TableHead>
          </TableRow>
          <TableRow className="bg-primary/5 hover:bg-primary/5">
            {effortLevels.map(m => <TableHead key={`header-${m}`} className="text-center font-bold text-primary border-b border-r bg-primary/5 w-12 md:w-16">{m}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {effortLevels.map((e, index) => (
            <TableRow key={`row-${e}`}>
              {index === 0 && (
                <TableCell rowSpan={7} className="font-bold text-primary bg-primary/10 border-r border-b text-center align-middle p-2">
                  <div className="max-w-[70px] mx-auto whitespace-normal break-words leading-tight uppercase tracking-wider text-[10px] md:text-xs">
                    Effort chosen by your team
                  </div>
                </TableCell>
              )}
              <TableCell className="font-bold text-primary text-center border-r border-b bg-primary/5">{e}</TableCell>
              {effortLevels.map(m => {
                const payoff = calculatePayoff(e, m);
                const isImpossible = payoff === null;
                const isCurrent = e === currentEffort && m === currentMinEffort;
                
                let className = "text-center transition-all duration-200 border-b border-r ";
                if (isImpossible) {
                  className += "bg-gray-300/50 ";
                } else if (isCurrent) {
                  className += "bg-green-100 font-bold border-2 border-green-500 text-green-700 text-lg shadow-inner ";
                }
                
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
