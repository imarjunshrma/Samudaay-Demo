import { SearchInput } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';

export function AdminDirectorySearch({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (value: string) => void;
}) {
  const t = useTranslations('admin.manage-directory');
  return <SearchInput value={value} onChangeText={onChangeText} placeholder={t('search.placeholder')} />;
}
