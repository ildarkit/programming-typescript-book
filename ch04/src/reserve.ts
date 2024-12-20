type Reservation = {
  date: Date,
  destination: string,
};

type Reserve = {
  (from: Date, to: Date, destination: string): Reservation
  (from: Date, destination: string): Reservation
  (destination: string): Reservation
}

export const reserve: Reserve = (
  fromOrDestination: Date | string,
  toOrDestination?: Date | string,
  destination?: string,
) => {
  return { date: new Date(), destination: '' };
};
