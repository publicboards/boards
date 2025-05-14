import React from 'react';

type UserProps = {
  name: string | "__ANONYMOUS__";
};

export const User: React.FC<UserProps> = ({ name }) => {
  return (
    <span><a href={`/@/${name}`}>@/{name}</a></span>
  );
};
