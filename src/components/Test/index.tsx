import React from 'react';

interface Props {
    color: string;
}

export const Test = ({ color }: Props) => <div style={{ color }}>Hello</div>;