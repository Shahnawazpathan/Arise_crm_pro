
export interface User {
  id: string;
  username: string;
  role: 'employee' | 'client' | 'admin';
  email: string;
  clientId?: string; // For client users to link to their data
}

export enum MedicalResultStatus {
  PENDING_RESULTS = 'Pending Results',
  FIT = 'Fit',
  UNFIT = 'Unfit',
  REQUIRES_RE_EXAMINATION = 'Requires Re-examination',
  N_A = 'N/A',
  // Old statuses for compatibility if needed
  PENDING_INFO = 'Pending Info',
  APPOINTMENT_BOOKED = 'Appointment Booked',
  MEDICAL_DONE = 'Medical Done',
  RESULTS_AWAITING = 'Results Awaiting',
  ABSENT = 'Absent',
  REFERRED = 'Referred',
}

export enum BookingStatus {
    NOT_INITIATED = 'Not Initiated',
    DATA_PREPARED = 'Data Prepared',
    BOOKING_IN_PROGRESS = 'Booking In Progress',
    BOOKED_PENDING_CONFIRMATION = 'Booked - Pending Confirmation',
    BOOKED_CONFIRMED = 'Booked - Confirmed',
    CANCELLED = 'Cancelled'
}

export enum PaymentStatus {
  PENDING_PAYMENT = 'Pending Payment',
  PAID = 'Paid',
  N_A = 'N/A',
  // Old statuses
  PENDING = 'Pending',
  FAILED = 'Failed',
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string; 
  contactNumber: string;
  email: string;
  profilePicture?: string; // Optional Base64 encoded string for image
  appointment?: Appointment;
  location?: string;
}

export interface AppointmentHistory {
    status: MedicalResultStatus | BookingStatus;
    date: string; // ISO string
    notes: string;
}

export interface Appointment {
  id: string;
  wafidApplicationId?: string;
  appointmentDate: string; // ISO string date
  appointmentTime?: string; // e.g., "14:30"
  medicalCenterName: string;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  medicalResultStatus: MedicalResultStatus;
  bookingDate: string; // ISO string date
  medicalSlipUrl?: string;
  history?: AppointmentHistory[];
}