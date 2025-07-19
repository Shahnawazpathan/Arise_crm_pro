
import { MedicalResultStatus, BookingStatus } from './types';

export const MEDICAL_RESULT_STATUS_COLORS: { [key in MedicalResultStatus]: string } = {
  [MedicalResultStatus.PENDING_RESULTS]: 'bg-purple-100 text-purple-800',
  [MedicalResultStatus.FIT]: 'bg-green-100 text-green-800',
  [MedicalResultStatus.UNFIT]: 'bg-red-100 text-red-800',
  [MedicalResultStatus.REQUIRES_RE_EXAMINATION]: 'bg-orange-100 text-orange-800',
  [MedicalResultStatus.N_A]: 'bg-gray-100 text-gray-800',
  [MedicalResultStatus.PENDING_INFO]: 'bg-yellow-100 text-yellow-800',
  [MedicalResultStatus.APPOINTMENT_BOOKED]: 'bg-blue-100 text-blue-800',
  [MedicalResultStatus.MEDICAL_DONE]: 'bg-indigo-100 text-indigo-800',
  [MedicalResultStatus.RESULTS_AWAITING]: 'bg-purple-100 text-purple-800',
  [MedicalResultStatus.ABSENT]: 'bg-gray-100 text-gray-800',
  [MedicalResultStatus.REFERRED]: 'bg-orange-100 text-orange-800',
};

export const BOOKING_STATUS_COLORS: { [key in BookingStatus]: string } = {
    [BookingStatus.NOT_INITIATED]: 'bg-gray-100 text-gray-800',
    [BookingStatus.DATA_PREPARED]: 'bg-yellow-100 text-yellow-800',
    [BookingStatus.BOOKING_IN_PROGRESS]: 'bg-blue-100 text-blue-800',
    [BookingStatus.BOOKED_PENDING_CONFIRMATION]: 'bg-indigo-100 text-indigo-800',
    [BookingStatus.BOOKED_CONFIRMED]: 'bg-green-100 text-green-800',
    [BookingStatus.CANCELLED]: 'bg-red-100 text-red-800',
};

export const STATUS_COLORS = {
    ...MEDICAL_RESULT_STATUS_COLORS,
    ...BOOKING_STATUS_COLORS
};
