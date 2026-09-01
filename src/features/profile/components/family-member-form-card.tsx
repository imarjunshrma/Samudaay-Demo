import { View } from 'react-native';

import {
  DateField,
  SelectField,
  Text,
  TextField,
} from '@/src/components';
import { bloodGroupOptions } from '@/src/constants/blood-groups';
import { useTranslations } from '@/src/i18n/use-translations';
import { spacing } from '@/src/theme';

export type FamilyMemberFormValues = {
  fullName: string;
  relation: string;
  gender: 'male' | 'female' | 'other' | '';
  dateOfBirth?: Date;
  bloodGroup: string;
  aadhaarNumber: string;
  phone: string;
  email: string;
  education: string;
  schoolName: string;
  currentClass: string;
  occupation: string;
};

const DOB_MIN_DATE = new Date(1900, 0, 1);

export function FamilyMemberFormCard() {
  const t = useTranslations('profile.family-member-form');

  return (
    <View style={{ gap: spacing[5] }}>
      <View style={{ gap: spacing[4] }}>
        <View>
          <TextField
            name="fullName"
            label={t('fields.fullName')}
            labelVariant="default"
            required
            placeholder={t('placeholders.fullName')}
            variant="registration"
          />
        </View>

        <View style={{ flexDirection: 'row', gap: spacing[4] }}>
          <View style={{ flex: 1 }}>
            <SelectField
              name="relation"
              label={t('fields.relation')}
              labelVariant="default"
              required
              variant="registration"
              placeholder={t('placeholders.relation')}
              options={[
                { label: t('options.relation.father'), value: 'father' },
                { label: t('options.relation.mother'), value: 'mother' },
                { label: t('options.relation.spouse'), value: 'spouse' },
                { label: t('options.relation.son'), value: 'son' },
                { label: t('options.relation.daughter'), value: 'daughter' },
                { label: t('options.relation.daughterInLaw'), value: 'daughter_in_law' },
                { label: t('options.relation.grandSon'), value: 'grand_son' },
                { label: t('options.relation.grandDaughter'), value: 'grand_daughter' },
                { label: t('options.relation.other'), value: 'other' },
              ]}
            />
          </View>
          <View style={{ flex: 1 }}>
            <SelectField
              name="gender"
              label={t('fields.gender')}
              labelVariant="default"
              required
              variant="registration"
              placeholder={t('placeholders.gender')}
              options={[
                { label: t('options.gender.male'), value: 'male' },
                { label: t('options.gender.female'), value: 'female' },
                { label: t('options.gender.other'), value: 'other' },
              ]}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: spacing[4] }}>
          <View style={{ flex: 1 }}>
            <DateField
              name="dateOfBirth"
              label={t('fields.dateOfBirth')}
              labelVariant="default"
              required
              variant="registration"
              minimumDate={DOB_MIN_DATE}
              maximumDate={new Date()}
            />
          </View>
          <View style={{ flex: 1 }}>
            <SelectField
              name="bloodGroup"
              label={t('fields.bloodGroup')}
              labelVariant="default"
              variant="registration"
              placeholder={t('placeholders.bloodGroup')}
              options={bloodGroupOptions.map((option) => ({ label: option.label, value: option.value }))}
            />
          </View>
        </View>

        <View>
          <TextField
            name="aadhaarNumber"
            label={t('fields.aadhaarNumber')}
            labelVariant="default"
            required
            placeholder={t('placeholders.aadhaarNumber')}
            variant="registration"
            keyboardType="number-pad"
          />
        </View>

        <View>
          <TextField
            name="education"
            label={t('fields.education')}
            labelVariant="default"
            placeholder={t('placeholders.education')}
            variant="registration"
          />
        </View>

        <View style={{ gap: spacing[3], borderWidth: 1, borderColor: '#f1e4d6', backgroundColor: '#fff8f3', padding: spacing[4], borderRadius: 16 }}>
          <Text variant="body" style={{ fontWeight: '600' }}>
            {t('sections.education.title')}
          </Text>
          <View>
            <TextField
              name="schoolName"
              label={t('fields.schoolName')}
              labelVariant="default"
              placeholder={t('placeholders.schoolName')}
              variant="registration"
            />
          </View>
          <View>
            <SelectField
              name="currentClass"
              label={t('fields.currentClass')}
              labelVariant="default"
              placeholder={t('placeholders.currentClass')}
              variant="registration"
              options={[
                { label: t('options.class.nursery'), value: 'nursery' },
                { label: t('options.class.lkg'), value: 'lkg' },
                { label: t('options.class.ukg'), value: 'ukg' },
                ...Array.from({ length: 12 }, (_, index) => {
                  const standard = String(index + 1);
                  return { label: t('options.class.standard').replace('{count}', standard), value: standard };
                }),
                { label: t('options.class.diploma'), value: 'diploma' },
                { label: t('options.class.undergraduate'), value: 'undergraduate' },
                { label: t('options.class.postgraduate'), value: 'postgraduate' },
                { label: t('options.class.other'), value: 'other' },
              ]}
            />
          </View>
        </View>

        <View>
          <TextField
            name="occupation"
            label={t('fields.occupation')}
            labelVariant="default"
            placeholder={t('placeholders.occupation')}
            variant="registration"
          />
        </View>

        <View style={{ flexDirection: 'row', gap: spacing[4] }}>
          <View style={{ flex: 1 }}>
            <TextField
              name="phone"
              label={t('fields.phone')}
              labelVariant="default"
              placeholder={t('placeholders.phone')}
              variant="registration"
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextField
              name="email"
              label={t('fields.email')}
              labelVariant="default"
              placeholder={t('placeholders.email')}
              variant="registration"
            />
          </View>
        </View>

      </View>
    </View>
  );
}
