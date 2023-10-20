import React, { PropsWithChildren } from 'react';

import '../../utils/i18n';

export const Root = ({ children }: PropsWithChildren): JSX.Element => {
  return <>{children}</>;
};
