import * as Yup from 'yup';
import { bloodGroupValues } from '@/src/constants/blood-groups';

function isValidMobileNumber(value?: string | null) {
  const normalized = String(value || '').replace(/[^\d+]/g, '');
  if (!normalized) {
    return false;
  }

  if (normalized.startsWith('+91')) {
    return /^\+91\d{10}$/.test(normalized);
  }

  return /^\+?[1-9]\d{7,14}$/.test(normalized);
}

function isAbsoluteOrBackendRelativeUrl(value?: string | null) {
  const normalized = String(value || '').trim();
  if (!normalized) {
    return true;
  }
  if (normalized.startsWith('/')) {
    return true;
  }
  if (
    /^[a-zA-Z]:[\\/]/.test(normalized) ||
    normalized.startsWith('./') ||
    normalized.startsWith('../') ||
    normalized.startsWith('public/') ||
    normalized.startsWith('uploads/') ||
    normalized.startsWith('promotion') ||
    normalized.startsWith('promotions/')
  ) {
    return true;
  }
  return Yup.string().url().isValidSync(normalized);
}

const dateOfBirthMaxDate = new Date();
dateOfBirthMaxDate.setHours(23, 59, 59, 999);

const dateOfBirthSchema = Yup.date()
  .max(dateOfBirthMaxDate, 'Date of birth cannot be in the future')
  .required('Date is required');

const bloodGroupSchema = Yup.string()
  .oneOf(bloodGroupValues, 'Select a valid blood group')
  .nullable()
  .optional();

const MAX_UPLOAD_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_UPLOAD_FILE_SIZE_LABEL = '5MB';

function isAllowedFileSize(value: unknown) {
  if (!value || typeof value !== 'object' || !('size' in value)) {
    return true;
  }

  const size = Number((value as { size?: number | null }).size);
  return !Number.isFinite(size) || size <= MAX_UPLOAD_FILE_SIZE_BYTES;
}

const fileSizeMessage = `File must be ${MAX_UPLOAD_FILE_SIZE_LABEL} or smaller.`;

export const fieldSchemas = {
  mobile: Yup.string().test('mobile', 'Enter a valid mobile number', (value) => !value || isValidMobileNumber(value)).required('Mobile number is required'),
  otp: Yup.string().matches(/^\d{6}$/, 'Enter 6-digit OTP').required('OTP is required'),
  name: Yup.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters').required('Name is required'),
  email: Yup.string().email('Enter valid email address').required('Email is required'),
  emailOptional: Yup.string().email('Enter valid email address'),
  amount: Yup.number().typeError('Amount is required').positive('Amount must be positive').min(1, 'Minimum amount is ₹1').required('Amount is required'),
  expenseTitle: Yup.string().min(2, 'Expense title must be at least 2 characters').max(80, 'Expense title must be less than 80 characters').required('Expense title is required'),
  requiredSelect: Yup.string().required('Please select an option'),
  pincode: Yup.string().max(6, 'Enter valid 6-digit pincode').matches(/^\d{6}$/, 'Enter valid 6-digit pincode').required('Pincode is required'),
  postalCode: Yup.string().trim().min(3, 'Enter valid postal code').max(12, 'Enter valid postal code').matches(/^[A-Z0-9 -]+$/i, 'Enter valid postal code').required('Postal code is required'),
  date: Yup.date().required('Date is required'),
  dateOptional: Yup.date().nullable(),
  consent: Yup.boolean().oneOf([true], 'You must accept the terms'),
  aadhaar: Yup.string().matches(/^\d{12}$/, 'Enter valid 12-digit Aadhaar number').required('Aadhaar number is required'),
  aadhaarOptional: Yup.string().matches(/^\d{12}$/, { message: 'Enter valid 12-digit Aadhaar number', excludeEmptyString: true }).nullable().optional(),
  pan: Yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Enter valid PAN number').required('PAN number is required'),
  panOptional: Yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: 'Enter valid PAN number', excludeEmptyString: true }).nullable().optional(),
  passportOptional: Yup.string().matches(/^[A-Z0-9]{6,12}$/i, { message: 'Enter valid passport number', excludeEmptyString: true }).nullable().optional(),
  address: Yup.string().min(10, 'Address must be at least 10 characters').max(200, 'Address must be less than 200 characters').required('Address is required'),
  phoneOptional: Yup.string().test('phone-optional', 'Enter a valid mobile number', (value) => !value || isValidMobileNumber(value)).nullable().optional(),
  file: Yup.mixed().test('file-size', fileSizeMessage, isAllowedFileSize).required('Please upload a file'),
  fileOptional: Yup.mixed().nullable().test('file-size', fileSizeMessage, isAllowedFileSize),
};

export const formSchemas = {
  registrationOTP: Yup.object({
    mobile: fieldSchemas.mobile,
    otp: fieldSchemas.otp,
  }),
  registrationAccess: Yup.object({
    mobile: fieldSchemas.mobile,
    otp: Yup.string().optional(),
  }),
  registrationProfile: Yup.object({
    tenantId: fieldSchemas.requiredSelect,
    subCommunity: Yup.string().max(80, 'Sub-community must be less than 80 characters').optional(),
    firstName: fieldSchemas.name,
    middleName: Yup.string().max(50, 'Middle name must be less than 50 characters').optional(),
    lastName: fieldSchemas.name,
    gender: fieldSchemas.requiredSelect,
    dob: dateOfBirthSchema,
    addressLine1: fieldSchemas.address,
    addressLine2: Yup.string().max(120, 'Address line 2 must be less than 120 characters').optional(),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    pincode: fieldSchemas.pincode.when('country', {
      is: (country: string) => String(country || '').trim().toLowerCase() === 'india',
      otherwise: () => fieldSchemas.postalCode,
    }),
    aadhaarNumber: fieldSchemas.aadhaarOptional.when('country', {
      is: (country: string) => String(country || '').trim().toLowerCase() === 'india',
      then: () => fieldSchemas.aadhaar,
    }),
    panNumber: fieldSchemas.panOptional,
    passportNumber: fieldSchemas.passportOptional.when('country', {
      is: (country: string) => String(country || '').trim().toLowerCase() !== 'india',
      then: () => fieldSchemas.passportOptional.required('Passport number is required'),
    }),
    bloodGroup: bloodGroupSchema,
  }),
  registrationKyc: Yup.object({
    country: Yup.string().optional(),
    aadhaarDocument: fieldSchemas.fileOptional,
    passportDocument: fieldSchemas.fileOptional,
    jatiNoDakhloDocument: fieldSchemas.fileOptional,
    schoolCertificateDocument: fieldSchemas.fileOptional,
    profilePhoto: fieldSchemas.file.required('Profile photo is required'),
    consent: fieldSchemas.consent,
  }).test('identity-document-required', 'Upload Aadhaar or Passport', function (value) {
    const isIndia = String(value?.country || '').trim().toLowerCase() === 'india';

    if (isIndia && value?.aadhaarDocument) {
      return true;
    }

    if (!isIndia && (value?.aadhaarDocument || value?.passportDocument)) {
      return true;
    }

    return this.createError({
      path: isIndia ? 'aadhaarDocument' : 'passportDocument',
      message: isIndia ? 'Upload Aadhaar Card' : 'Upload Aadhaar or Passport',
    });
  }).test('supporting-document-required', 'Upload Caste Certificate or School Certificate', function (value) {
    if (value?.jatiNoDakhloDocument || value?.schoolCertificateDocument) {
      return true;
    }

      return this.createError({
      path: 'jatiNoDakhloDocument',
      message: 'Upload Caste Certificate or School Certificate',
    });
  }),
  familyMember: Yup.object({
    fullName: fieldSchemas.name,
    relation: fieldSchemas.requiredSelect,
    gender: fieldSchemas.requiredSelect,
    dateOfBirth: dateOfBirthSchema,
    bloodGroup: bloodGroupSchema,
    aadhaarNumber: fieldSchemas.aadhaar,
    phone: fieldSchemas.phoneOptional,
    email: fieldSchemas.emailOptional,
    education: Yup.string().max(80, 'Education must be less than 80 characters').optional(),
    schoolName: Yup.string().max(120, 'School name must be less than 120 characters').optional(),
    currentClass: Yup.string().max(40, 'Class must be less than 40 characters').optional(),
    occupation: Yup.string().max(80, 'Occupation must be less than 80 characters').optional(),
  }),
  directoryMember: Yup.object({
    fullName: fieldSchemas.name,
    phone: Yup.string().test('directory-phone', 'Enter a valid mobile number', (value) => !value || isValidMobileNumber(value)).required('Phone number is required'),
    email: fieldSchemas.emailOptional,
    city: Yup.string().max(60, 'City must be less than 60 characters').optional(),
    state: Yup.string().max(60, 'State must be less than 60 characters').optional(),
    pincode: Yup.string().max(6, 'Enter valid 6-digit pincode').matches(/^\d{6}$/, 'Enter valid 6-digit pincode').optional().nullable(),
  }),
  donation: Yup.object({
    donorType: fieldSchemas.requiredSelect,
    donorName: fieldSchemas.name,
    relation: Yup.string().when('donorType', {
      is: 'behalf',
      then: (schema) => schema.required('Relation is required'),
      otherwise: (schema) => schema.optional(),
    }),
    amount: fieldSchemas.amount,
    message: Yup.string().max(200, 'Message must be less than 200 characters'),
  }),
  manualDonationRecord: Yup.object({
    registeredMemberSearch: Yup.string().max(80, 'Search text must be less than 80 characters').optional(),
    manualDonorName: Yup.string().max(80, 'Contributor name must be less than 80 characters').optional(),
    amount: fieldSchemas.amount,
    donationDate: fieldSchemas.date,
    paymentMode: fieldSchemas.requiredSelect,
    status: fieldSchemas.requiredSelect,
    panNumber: fieldSchemas.panOptional,
    referenceNumber: Yup.string().max(80, 'Reference number must be less than 80 characters').optional(),
    message: Yup.string().max(200, 'Message must be less than 200 characters').optional(),
    proof: fieldSchemas.fileOptional,
  }).test(
    'donor-name-required',
    'Search a member or enter a manual contributor name',
    function (value) {
      if (value?.registeredMemberSearch?.trim() || value?.manualDonorName?.trim()) {
        return true;
      }

      return this.createError({
        path: 'manualDonorName',
        message: 'Search a member or enter a manual contributor name',
      });
    },
  ),
  expense: Yup.object({
    title: fieldSchemas.expenseTitle,
    amount: fieldSchemas.amount,
    category: fieldSchemas.requiredSelect,
    expenseDate: fieldSchemas.date,
    eventLink: Yup.string().max(80, 'Event name must be less than 80 characters').optional(),
    paymentMode: Yup.string().oneOf(['cash', 'bank', 'cheque']).required('Payment mode is required'),
    receipt: fieldSchemas.fileOptional,
    description: Yup.string().max(250, 'Description must be less than 250 characters').optional(),
  }),
  manageEvent: Yup.object({
    title: Yup.string().trim().min(2, 'Event title must be at least 2 characters').max(120, 'Event title must be less than 120 characters').required('Event title is required'),
    description: Yup.string().max(1000, 'Description must be less than 1000 characters').optional(),
    eventType: fieldSchemas.requiredSelect,
    type: Yup.string().oneOf(['free', 'paid']).required('Event type is required'),
    fee: Yup.string().when('type', {
      is: 'paid',
      then: (schema) =>
        schema
          .required('Price is required')
          .test('paid-fee-valid', 'Enter a valid event price', (value) => {
            const amount = Number(value);
            return Boolean(value?.trim()) && Number.isFinite(amount) && amount > 0;
          }),
      otherwise: (schema) => schema.optional(),
    }),
    date: fieldSchemas.date,
    startTime: fieldSchemas.date,
    endTime: fieldSchemas.date.test('end-after-start', 'End time must be after start time', function (value) {
      const { startTime } = this.parent as { startTime?: Date };
      if (!value || !startTime) {
        return true;
      }

      const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
      const endMinutes = value.getHours() * 60 + value.getMinutes();
      return endMinutes > startMinutes;
    }),
    venueName: Yup.string().trim().min(2, 'Venue name must be at least 2 characters').max(120, 'Venue name must be less than 120 characters').required('Venue name is required'),
    address: fieldSchemas.address,
    addressLine2: Yup.string().max(120, 'Address line 2 must be less than 120 characters').optional(),
    area: Yup.string().max(80, 'Area must be less than 80 characters').optional(),
    status: Yup.string().oneOf(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']).required('Status is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    pincode: fieldSchemas.pincode,
    googlePlaceId: Yup.string().max(120, 'Google place ID must be less than 120 characters').optional(),
    lat: Yup.number().nullable().optional(),
    lng: Yup.number().nullable().optional(),
    locationUrl: Yup.string().url('Enter a valid map URL').nullable().transform((value) => (value?.trim() ? value.trim() : null)).optional(),
    youtubeUrl: Yup.string().url('Enter a valid YouTube URL').nullable().transform((value) => (value?.trim() ? value.trim() : null)).optional(),
    maxAttendees: Yup.string()
      .nullable()
      .transform((value) => (value?.trim() ? value.trim() : null))
      .test('attendees-valid', 'Enter a valid attendee limit', (value) => !value || (/^\d+$/.test(value) && Number(value) > 0)),
    addOns: Yup.array().of(
      Yup.object({
        id: Yup.string().required(),
        title: Yup.string().max(80, 'Add-on name must be less than 80 characters').optional(),
        price: Yup.string().test('add-on-price-valid', 'Enter a valid add-on price', function (value) {
          const { title } = this.parent as { title?: string };
          if (!title?.trim() && !value?.trim()) {
            return true;
          }

          const amount = Number(value);
          return Boolean(value?.trim()) && Number.isFinite(amount) && amount >= 0;
        }),
        limit: Yup.string().test('add-on-limit-valid', 'Enter a valid add-on limit', function (value) {
          if (!value?.trim()) {
            return true;
          }

          return /^\d+$/.test(value) && Number(value) > 0;
        }),
      }),
    ),
  }),
  roleCatalog: Yup.object({
    name: fieldSchemas.name,
    description: Yup.string().max(140, 'Description must be less than 140 characters').optional(),
    permissions: Yup.object()
      .test('has-permission', 'Select at least one permission', (value) =>
        Boolean(value && Object.values(value).some(Boolean)),
      )
      .required(),
  }),
  promotion: Yup.object({
    title: Yup.string().trim().min(2, 'Title must be at least 2 characters').max(120, 'Title must be less than 120 characters').required('Advertisement title is required'),
    description: Yup.string().max(600, 'Description must be less than 600 characters').optional(),
    contentType: fieldSchemas.requiredSelect,
    category: fieldSchemas.requiredSelect,
    imageUrl: Yup.string()
      .nullable()
      .transform((value) => (value?.trim() ? value.trim() : null))
      .test('image-url', 'Enter a valid image URL', (value) => isAbsoluteOrBackendRelativeUrl(value))
      .optional(),
    videoUrl: Yup.string().url('Enter a valid video URL').nullable().transform((value) => (value?.trim() ? value.trim() : null)).optional(),
    redirectUrl: Yup.string().url('Enter a valid redirect URL').nullable().transform((value) => (value?.trim() ? value.trim() : null)).optional(),
    startAt: fieldSchemas.dateOptional,
    endAt: fieldSchemas.dateOptional,
    pricingType: fieldSchemas.requiredSelect,
    amount: Yup.string().matches(/^\d*(\.\d{0,2})?$/, { message: 'Enter a valid amount', excludeEmptyString: true }).optional(),
    paymentReference: Yup.string().max(120, 'Payment reference must be less than 120 characters').optional(),
    status: fieldSchemas.requiredSelect,
    displayIntervalSeconds: Yup.string().matches(/^\d+$/, 'Display interval must be a number').required('Display interval is required'),
    displayDurationSeconds: Yup.string().matches(/^\d+$/, 'Display duration must be a number').required('Display duration is required'),
    skipEnabled: Yup.boolean().required(),
    skipAfterSeconds: Yup.string().matches(/^\d+$/, 'Skip delay must be a number').required('Skip delay is required'),
    maxAdsPerSession: Yup.string().matches(/^\d*$/, { message: 'Max shows per user must be a number', excludeEmptyString: true }).optional(),
    priorityWeight: Yup.string().matches(/^\d*$/, { message: 'Priority weight must be a number', excludeEmptyString: true }).optional(),
  })
    .test('start-required', 'Start date is required', function (value) {
      if (value?.startAt) {
        return true;
      }

      return this.createError({
        path: 'startAt',
        message: 'Start date is required',
      });
    })
    .test('end-required', 'End date is required', function (value) {
      if (value?.endAt) {
        return true;
      }

      return this.createError({
        path: 'endAt',
        message: 'End date is required',
      });
    })
    .test('start-not-in-past', 'Start date cannot be in the past', function (value) {
      if (!value?.startAt) {
        return true;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = new Date(value.startAt);
      startDate.setHours(0, 0, 0, 0);

      if (startDate.getTime() >= today.getTime()) {
        return true;
      }

      return this.createError({
        path: 'startAt',
        message: 'Start date cannot be in the past',
      });
    })
    .test('content-media', 'Provide valid media for the selected advertisement type', function (value) {
      if (value?.contentType === 'IMAGE' && value.imageUrl) {
        return true;
      }
      if (value?.contentType === 'VIDEO' && value.videoUrl) {
        return true;
      }
      if (value?.contentType === 'TEXT') {
        return true;
      }
      return this.createError({
        path: value?.contentType === 'VIDEO' ? 'videoUrl' : 'imageUrl',
        message: value?.contentType === 'VIDEO' ? 'Video advertisements require a valid video URL' : 'Image advertisements require an uploaded image',
      });
    })
    .test('active-duration', 'Active advertisements require a valid duration', function (value) {
      if (value?.status !== 'ACTIVE') {
        return true;
      }
      if (value.startAt && value.endAt && value.endAt.getTime() > value.startAt.getTime()) {
        return true;
      }
      return this.createError({
        path: 'endAt',
        message: 'Active advertisements require both start and end dates',
      });
    })
    .test('end-after-start', 'End date must be after start date', function (value) {
      if (!value?.startAt || !value?.endAt) {
        return true;
      }

      if (value.endAt.getTime() > value.startAt.getTime()) {
        return true;
      }

      return this.createError({
        path: 'endAt',
        message: 'End date must be after start date',
      });
    })
    .test('skip-within-duration', 'Skip delay must be less than or equal to display duration', function (value) {
      const duration = Number(value?.displayDurationSeconds || 0);
      const skipAfter = Number(value?.skipAfterSeconds || 0);
      if (!duration || !skipAfter || skipAfter <= duration) {
        return true;
      }
      return this.createError({
        path: 'skipAfterSeconds',
        message: 'Skip delay must be less than or equal to display duration',
      });
    }),
};
