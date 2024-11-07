import React, { useState } from 'react';
import useGetReservations from './hooks';
import { ReservationDto } from './hooks/types.ts';
import { ReservationItemHeader, ReservationProductHeader } from './components';

interface ReservationItemProps {
  reservation: ReservationDto;
}

const ReservationItem = ({ reservation }: ReservationItemProps) => {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <div className="flex flex-col">
      <div
        className="grid grid-cols-3"
        onClick={() => setIsSelected(!isSelected)}
      >
        <div className="border p-2 text-center">
          {reservation.reservationUuid}
        </div>
        <div className="border p-2 text-center">
          {reservation.activePurchases}
        </div>
        <div className="border p-2 text-center">
          {reservation.sumOfActivePurchases}
        </div>
      </div>
      {isSelected ? (
        <div className="border text-center">
          <ReservationProductHeader />
          {reservation.productCharges.map((productCharge, idx) => (
            <div className="grid grid-cols-3" key={`product-${idx}`}>
              <span>{productCharge.productName}</span>
              <span>{productCharge.status}</span>
              <span>{productCharge.charge}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const Reservations = () => {
  const { reservations } = useGetReservations();

  return (
    <div>
      <ReservationItemHeader />
      {(reservations ?? []).map((reservation, idx) => (
        <ReservationItem key={`reservation-${idx}`} reservation={reservation} />
      ))}
    </div>
  );
};

export default Reservations;
