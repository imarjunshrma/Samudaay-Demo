import { AdvertisementFormContent } from '../components/advertisement-form-content';

type AdminAdvertisementFormScreenProps = {
  mode: 'create' | 'edit' | 'view';
  promotionId?: string;
};

export function AdminAdvertisementFormScreen({ mode, promotionId }: AdminAdvertisementFormScreenProps) {
  return <AdvertisementFormContent mode={mode} promotionId={promotionId} />;
}

export default AdminAdvertisementFormScreen;
