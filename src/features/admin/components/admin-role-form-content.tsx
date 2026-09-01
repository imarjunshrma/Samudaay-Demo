import { FormikProvider } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useBackNavigation } from '@/src/core/navigation/back-navigation';

import { AppFormSkeleton, AppHeader, Button, FormScreenLayout, Text, TextField } from '@/src/components';
import { SkeletonBlock } from '@/src/components/ui/skeleton';
import { useAppForm } from '@/src/hooks/useForm';
import { useTranslations } from '@/src/i18n/use-translations';
import { colors, radius, spacing, typography } from '@/src/theme';
import { formSchemas } from '@/src/components/forms/validation';
import { useSafeNavigation } from '@/src/core/navigation/safe-navigation';
import { roleManagementService, type RoleCatalogItem, type RoleCatalogResponse, type RoleFormValues } from '../services/role-management-service';
import { AdminModulePermissionSwitches } from './admin-module-permission-switches';

type AdminRoleFormContentProps = {
  mode: 'add' | 'edit';
  roleId?: string;
};

function buildInitialValues(role?: RoleCatalogItem | null): RoleFormValues {
  return roleManagementService.toFormValues(role ?? null);
}

function groupPermissions(permissions: RoleCatalogResponse['permissions']) {
  return permissions.reduce<Record<string, RoleCatalogResponse['permissions']>>((acc, permission) => {
    const bucket = permission.module || 'general';
    if (!acc[bucket]) {
      acc[bucket] = [];
    }
    acc[bucket].push(permission);
    return acc;
  }, {});
}

function AdminRoleFormSkeleton() {
  return (
    <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center', paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[5], gap: spacing[4] }}>
      <View style={{ gap: spacing[2] }}>
        <SkeletonBlock width="26%" height={14} radiusSize={radius.sm} />
        <SkeletonBlock width="100%" height={56} radiusSize={radius.xl} />
      </View>
      <View style={{ gap: spacing[2] }}>
        <SkeletonBlock width="32%" height={14} radiusSize={radius.sm} />
        <SkeletonBlock width="100%" height={92} radiusSize={radius.xl} />
      </View>
      <View style={{ gap: spacing[3] }}>
        <SkeletonBlock width="24%" height={18} radiusSize={radius.sm} />
        {Array.from({ length: 4 }, (_, index) => (
          <View
            key={index}
            style={{
              borderRadius: radius.xl,
              backgroundColor: colors.background.surface,
              borderWidth: 1,
              borderColor: colors.primary.borderLight,
              padding: spacing[4],
              gap: spacing[3],
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] }}>
              <SkeletonBlock width="34%" height={16} radiusSize={radius.sm} />
              <SkeletonBlock width={44} height={24} radiusSize={radius.full} />
            </View>
            <SkeletonBlock width="72%" height={12} radiusSize={radius.sm} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function AdminRoleFormContent({ mode, roleId }: AdminRoleFormContentProps) {
  useBackNavigation();
  const { safeBack } = useSafeNavigation();
  const t = useTranslations('admin.role-form');
  const [catalog, setCatalog] = useState<RoleCatalogResponse | null>(null);
  const [role, setRole] = useState<RoleCatalogItem | null>(null);
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadError(null);

    Promise.all([
      roleManagementService.loadCatalog(),
      mode === 'edit' && roleId ? roleManagementService.loadRole(roleId) : Promise.resolve(null),
    ])
      .then(([result, loadedRole]) => {
        if (!active) {
          return;
        }
        setCatalog(result);
        if (mode === 'edit' && roleId) {
          if (!loadedRole) {
            setLoadError(t('notFound'));
          }
          setRole(loadedRole);
        }
      })
      .catch((error) => {
        if (!active) {
          return;
        }
        setLoadError(error instanceof Error ? error.message : t('errors.load'));
      })
      .finally(() => {
        if (!active) {
          return;
        }
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [mode, roleId, t]);

  const initialValues = useMemo(() => buildInitialValues(role), [role]);
  const groupedPermissions = useMemo(() => groupPermissions(catalog?.permissions ?? []), [catalog]);
  const handleClose = () => safeBack('/admin/roles');

  const formik = useAppForm<RoleFormValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema: formSchemas.roleCatalog,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(undefined);
      try {
        if (mode === 'edit' && roleId) {
          await roleManagementService.updateRole(roleId, values);
        } else {
          await roleManagementService.createRole(values);
        }
        handleClose();
      } catch (error) {
        helpers.setStatus({
          error: error instanceof Error ? error.message : t('errors.save'),
        });
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const footer = !isLoading && !loadError ? (
    <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT, borderTopWidth: 1, borderTopColor: colors.primary.borderLight, justifyContent: 'center' }}>
      <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center', flexDirection: 'row', gap: spacing[3] }}>
        <View style={{ flex: 1 }}>
          <Button variant="outline" fullWidth disabled={formik.isSubmitting} onPress={handleClose}>
            Cancel
          </Button>
        </View>
        <View style={{ flex: 2 }}>
          <Button fullWidth loading={formik.isSubmitting} disabled={formik.isSubmitting} onPress={() => formik.submitForm()}>
            Save
          </Button>
        </View>
      </View>
    </View>
  ) : isLoading ? (
    <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT, borderTopWidth: 1, borderTopColor: colors.primary.borderLight, justifyContent: 'center' }}>
      <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center' }}>
        <AppFormSkeleton fields={0} />
      </View>
    </View>
  ) : null;

  return (
    <FormScreenLayout
      header={
        <AppHeader
          title={mode === 'edit' ? t('title.edit') : t('title.add')}
          variant="back-inline"
          onLeftPress={handleClose}
        />
      }
      footer={footer}>
      {isLoading ? (
        <View style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
          <AdminRoleFormSkeleton />
        </View>
      ) : loadError ? (
        <View style={{ flex: 1, paddingHorizontal: spacing[4], paddingTop: spacing[6], backgroundColor: colors.background.DEFAULT }}>
          <View style={{ borderRadius: radius.xl, backgroundColor: colors.background.surface, borderWidth: 1, borderColor: colors.primary.borderLight, padding: spacing[4] }}>
            <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 18 }}>
              {loadError}
            </Text>
          </View>
        </View>
      ) : (
        <FormikProvider value={formik}>
          <View style={{ maxWidth: 672, width: '100%', alignSelf: 'center', paddingHorizontal: spacing[4], paddingTop: spacing[4], paddingBottom: spacing[5], gap: spacing[4] }}>
            <TextField
              name="name"
              label={t('labels.name')}
              placeholder={t('placeholders.name')}
              variant="registration"
              labelVariant="default"
              disabled={Boolean(role?.isSystem)}
              required
            />

            <TextField
              name="description"
              label={t('labels.description')}
              placeholder={t('placeholders.description')}
              variant="registration"
              labelVariant="default"
              disabled={Boolean(role?.isSystem)}
              multiline
              numberOfLines={3}
            />

            <View style={{ gap: spacing[3] }}>
              <Text style={{ color: colors.text.primary, fontFamily: typography.fontFamily.bold, fontSize: 16 }}>
                {t('labels.permissions')}
              </Text>
              <AdminModulePermissionSwitches
                permissions={groupedPermissions}
                selectedPermissions={formik.values.permissions}
                onTogglePermission={(permissionKey, nextValue) => {
                  formik.setFieldValue('permissions', {
                    ...formik.values.permissions,
                    [permissionKey]: nextValue,
                  });
                }}
              />
              {formik.submitCount > 0 && typeof formik.errors.permissions === 'string' ? (
                <Text style={{ color: colors.status.error }}>
                  {formik.errors.permissions}
                </Text>
              ) : null}
            </View>

            {formik.status?.error ? (
              <Text style={{ color: colors.status.error }}>
                {formik.status.error}
              </Text>
            ) : null}
          </View>
        </FormikProvider>
      )}
    </FormScreenLayout>
  );
}
