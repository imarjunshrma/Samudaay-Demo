export type DonorType = 'self' | 'behalf';

export interface DonationFormValues {
  donorType: DonorType;
  donorName: string;
  relation: string;
  amount: number | '';
  message: string;
}
