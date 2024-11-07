import React from 'react';

const ReservationItemHeader = () => (
  <div className="grid grid-cols-3">
    <div className="border p-2 text-center">Reservation UUID</div>
    <div className="border p-2 text-center">Active Purchases</div>
    <div className="border p-2 text-center">Sum of Active Purchases</div>
  </div>
);

export default ReservationItemHeader;
