import { useEffect, useState } from 'react';
import { Compound } from '../types';

type Compounds = Compound[];

export const useCompound = <T>(data: T[], flag: boolean, ...rest: string[]): Compounds => {
  const [compound, setCompound] = useState<Compounds>([]);

  useEffect(() => {
    if (flag && data.length > 0) {

      const calculateCompunds = (columns: string[]) => {
        const count = columns.reduce((a, b) => ({...a, [b]: 1 }), {}) as Record<string, number>;
        const flag = columns.reduce((a, b) => ({...a, [b]: 1 }), {}) as Record<string, boolean>;
        
        const res = [] as Compounds;
        
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < columns.length; j++) {
            const currentCol = columns[j];
  
            if (data[i]?.[currentCol as keyof T] === data[i+1]?.[currentCol as keyof T]) {
              count[currentCol]++;
              flag[currentCol] = true;
            } else flag[currentCol] = false;
            
            if (flag[currentCol]) {
              res[i] = { ...res[i], [`${currentCol}`]: { value: null }};
            } else {
              res[i] = { ...res[i], [`${currentCol}`]: { value: null }};
              let currentCount = count[currentCol]

              while (currentCount--) {
                const index = i - currentCount
                res[index][currentCol] = { value: null, virtualValue: currentCount + 1 };
              }
              const index = i - (count[currentCol] - 1);
              res[index][currentCol] = { value: count[currentCol] };
              count[currentCol] = 1;
            }
          }
        }
        return res;
      }
      
      if (rest.length === 0) {
        const [firstRow] = data;
        const keys = Object.keys(firstRow ?? {});
        const res = calculateCompunds(keys);
        setCompound(res);
      } else {
        const res = calculateCompunds(rest);
        setCompound(res);
      }
      
      
    }
  }, [data, flag])

  return compound;

}