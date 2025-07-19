import React from 'react';
import { useParams } from 'react-router-dom';

const ClientDetail = () => {
  const { clientId } = useParams();

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <h1>Details for Client: {clientId}</h1>
      <p>This page would show all the detailed information for the selected client.</p>
    </div>
  );
};

export default ClientDetail;