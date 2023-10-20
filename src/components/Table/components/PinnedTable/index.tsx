import React, { FC, PropsWithChildren } from 'react';

type PinnedTableProps = PropsWithChildren<{
  width: number;
  className: string;
}>;

export const PinnedTable: FC<PinnedTableProps> = ({
  className,
  width,
  children
}) => width > 0 ? <table
  style={{ width }}
  className={className}
>
  {children}
</table> : null;
