export interface ProductAssigment {
  id: number;
  reservationUuid: string;
  name: string;
}

export interface ProductCharge {
  specialProductAssignmentId: number;
  active: boolean;
  amount: number;
}

export interface ReservationDto {
  reservationUuid: string;
  activePurchases: number;
  sumOfActivePurchases: number;
  productCharges: ReadonlyArray<{
    productName: string;
    status: 'active' | 'cancelled';
    charge: number;
  }>;
}
