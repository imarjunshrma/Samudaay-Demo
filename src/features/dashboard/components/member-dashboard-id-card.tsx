import { DigitalIdCard } from '@/src/components';

export function MemberDashboardIdCard({
  memberName,
  memberId,
  location,
  validity,
  photo,
  qrImage,
  memberLabel,
  idLabel,
  validityLabel,
}: {
  memberName: string;
  memberId: string;
  location: string;
  validity: string;
  photo?: string | null;
  qrImage?: string | null;
  memberLabel?: string;
  idLabel?: string;
  validityLabel?: string;
}) {
  return (
    <DigitalIdCard
      memberName={memberName}
      memberId={memberId}
      location={location}
      validity={validity}
      photo={photo}
      qrImage={qrImage}
      memberLabel={memberLabel}
      idLabel={idLabel}
      validityLabel={validityLabel}
    />
  );
}
