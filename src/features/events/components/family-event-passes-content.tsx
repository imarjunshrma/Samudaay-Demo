import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, FlatList, NativeScrollEvent, NativeSyntheticEvent, Platform, Share, View, useWindowDimensions } from 'react-native';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { AppSafeAreaView } from '@/src/components/layout/AppSafeAreaView';
import { SkeletonBlock } from '@/src/components/ui/skeleton';

import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

import { AppHeader, Button, EventPassCard, Text } from '@/src/components';
import { useTranslations } from '@/src/i18n/use-translations';
import { createAndDeliverPdf } from '@/src/services/files/pdf-file';
import { colors, spacing, typography } from '@/src/theme';
import { eventService, type EventPassRecord } from '../services/event-service';

type RenderablePass = {
  id: string;
  title: string;
  qrImage: string;
  passLabel: string;
  addOns: string[];
};

export function FamilyEventPassesContent() {
  const passCardRefs = useRef<Record<string, View | null>>({});
  const carouselRef = useRef<FlatList<RenderablePass> | null>(null);
  const [passes, setPasses] = useState<EventPassRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const t = useTranslations('events.family-event-passes');
  const { width: windowWidth } = useWindowDimensions();
  const params = useLocalSearchParams<{ eventId?: string | string[] }>();
  const eventId = Array.isArray(params.eventId) ? params.eventId[0] : params.eventId;
  const visiblePasses = useMemo(
    () => (eventId ? passes.filter((pass) => pass.eventId === eventId) : passes),
    [eventId, passes],
  );
  const renderablePasses = useMemo<RenderablePass[]>(
    () =>
      visiblePasses.map((pass) => ({
        id: pass.id,
        title: pass.title,
        qrImage: pass.qrImage,
        passLabel: pass.passLabel,
        addOns: pass.addOns,
      })),
    [visiblePasses],
  );
  const passCardWidth = Math.min(windowWidth - spacing[8], 360);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    eventService
      .loadMyEventPasses()
      .then((records) => {
        if (active) {
          setPasses(records);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (activeIndex < renderablePasses.length) {
      return;
    }

    setActiveIndex(0);
  }, [activeIndex, renderablePasses.length]);

  function handleMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = windowWidth > 0 ? Math.round(event.nativeEvent.contentOffset.x / windowWidth) : 0;
    setActiveIndex(Math.max(0, Math.min(index, renderablePasses.length - 1)));
  }

  function escapeHtml(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function buildPassesPdfHtml(eventTitle: string, passesToRender: RenderablePass[]) {
    const title = escapeHtml(eventTitle || 'Event Passes');
    const generatedOn = escapeHtml(
      new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(new Date()),
    );

    const pages = passesToRender
      .map((pass) => {
        const passLabel = escapeHtml(pass.passLabel);
        const passEventTitle = escapeHtml(pass.title);
        const addOns = pass.addOns.length
          ? pass.addOns
              .map(
                (addOn) => `
                  <div class="addon">
                    <span class="addon-dot"></span>
                    <span>${escapeHtml(addOn)}</span>
                  </div>`,
              )
              .join('')
          : '<div class="empty-addon">No add-ons attached to this pass.</div>';

        return `
          <section class="page">
            <div class="ticket">
              <div class="ticket-header">
                <div>
                  <div class="eyebrow">Community Event Pass</div>
                  <h1>${passLabel}</h1>
                  <p class="event-title">${passEventTitle}</p>
                </div>
                <div class="meta">
                  <div class="meta-label">Generated</div>
                  <div class="meta-value">${generatedOn}</div>
                </div>
              </div>

              <div class="content">
                <div class="qr-panel">
                  <div class="qr-frame">
                    <img src="${pass.qrImage}" alt="${passLabel}" />
                  </div>
                  <div class="scan-note">Scan at entrance / service counter</div>
                </div>

                <div class="details-panel">
                  <div class="section-title">Registered Add-ons</div>
                  <div class="addons">${addOns}</div>
                </div>
              </div>
            </div>
          </section>
        `;
      })
      .join('');

    return `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 22px;
            }
            * {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              color: #0f172a;
              background: #fffaf5;
            }
            .page {
              page-break-after: always;
              min-height: calc(100vh - 44px);
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 10px 0;
            }
            .page:last-child {
              page-break-after: auto;
            }
            .ticket {
              width: 100%;
              border: 1px solid rgba(242,120,13,0.18);
              border-radius: 28px;
              background: #ffffff;
              overflow: hidden;
            }
            .ticket-header {
              display: flex;
              justify-content: space-between;
              gap: 16px;
              padding: 26px 28px 18px;
              background: linear-gradient(180deg, rgba(242,120,13,0.08), rgba(242,120,13,0.02));
            }
            .eyebrow {
              color: #f2780d;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.18em;
              text-transform: uppercase;
              margin-bottom: 10px;
            }
            h1 {
              margin: 0;
              font-size: 30px;
              line-height: 1.15;
            }
            .event-title {
              margin: 8px 0 0;
              color: #64748b;
              font-size: 15px;
            }
            .meta {
              min-width: 150px;
              text-align: right;
            }
            .meta-label {
              color: #94a3b8;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.16em;
              text-transform: uppercase;
              margin-bottom: 8px;
            }
            .meta-value {
              font-size: 14px;
              font-weight: 600;
            }
            .content {
              display: flex;
              gap: 28px;
              padding: 26px 28px 30px;
              align-items: center;
            }
            .qr-panel {
              width: 290px;
              flex-shrink: 0;
              text-align: center;
            }
            .qr-frame {
              border: 1px solid #e2e8f0;
              border-radius: 22px;
              padding: 16px;
              background: #ffffff;
            }
            .qr-frame img {
              width: 100%;
              display: block;
            }
            .scan-note {
              margin-top: 16px;
              color: #f2780d;
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 0.14em;
              text-transform: uppercase;
            }
            .details-panel {
              flex: 1;
              min-width: 0;
            }
            .section-title {
              color: #94a3b8;
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              margin-bottom: 14px;
            }
            .addons {
              display: grid;
              gap: 12px;
            }
            .addon {
              display: flex;
              align-items: center;
              gap: 10px;
              border: 1px solid rgba(242,120,13,0.12);
              border-radius: 16px;
              background: rgba(242,120,13,0.05);
              padding: 14px 16px;
              font-size: 15px;
              font-weight: 600;
            }
            .addon-dot {
              width: 10px;
              height: 10px;
              border-radius: 999px;
              background: #f2780d;
              flex-shrink: 0;
            }
            .empty-addon {
              color: #64748b;
              font-size: 14px;
            }
          </style>
        </head>
        <body>${pages}</body>
      </html>
    `;
  }

  const sharePass = async (pass: RenderablePass | undefined) => {
    if (!pass) return;
    const fallbackMessage = [
      pass.title,
      pass.passLabel,
      pass.addOns.length ? `Add-ons: ${pass.addOns.join(', ')}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const cardNode = passCardRefs.current[pass.id];
      if (Platform.OS !== 'web' && cardNode && await Sharing.isAvailableAsync()) {
        const capturedUri = await captureRef(cardNode, {
          format: 'png',
          quality: 1,
          result: 'tmpfile',
        });

        await Sharing.shareAsync(capturedUri, {
          mimeType: 'image/png',
          UTI: 'public.png',
          dialogTitle: `${pass.title} pass`,
        });
        return;
      }

      await Share.share({
        title: pass.title,
        message: fallbackMessage,
      });
    } catch (error) {
      Alert.alert('Share failed', error instanceof Error ? error.message : 'Unable to share this pass.');
    }
  };

  const shareAllPasses = async () => {
    if (!renderablePasses.length) {
      return;
    }

    try {
      const eventTitle = renderablePasses[0]?.title || 'Event';
      await createAndDeliverPdf({
        source: {
          type: 'html',
          html: buildPassesPdfHtml(eventTitle, renderablePasses),
          width: 794,
          height: 1123,
        },
        fileName: `${eventTitle.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'event'}-passes.pdf`,
        delivery: 'share',
      });
    } catch (error) {
      Alert.alert('Share failed', error instanceof Error ? error.message : 'Unable to share these passes.');
    }
  };

  return (
    <AppSafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <AppHeader title={t('title')} variant="back" rightIcon="share" onRightPress={() => void shareAllPasses()} />

        <View style={{ flex: 1, paddingVertical: spacing[8] }}>
          {isLoading ? (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
              <View style={{ alignItems: 'center', paddingHorizontal: spacing[6], gap: spacing[4] }}>
                <SkeletonBlock width={passCardWidth} height={420} radiusSize={24} />
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing[2], marginTop: spacing[1] }}>
                  {Array.from({ length: 3 }, (_, index) => (
                    <SkeletonBlock key={index} width={index === 0 ? 28 : 8} height={8} radiusSize={999} />
                  ))}
                </View>
                <SkeletonBlock width="46%" height={12} radiusSize={999} />
                <SkeletonBlock width="58%" height={14} radiusSize={999} />
              </View>
              <View style={{ paddingHorizontal: spacing[6], paddingTop: spacing[8], paddingBottom: spacing[6], gap: spacing[4] }}>
                <SkeletonBlock width="100%" height={48} radiusSize={24} />
                <SkeletonBlock width="72%" height={16} radiusSize={999} style={{ alignSelf: 'center' }} />
              </View>
            </View>
          ) : renderablePasses.length ? (
            <View style={{ flex: 1, alignItems: 'center' }}>
              <FlatList
                ref={carouselRef}
                data={renderablePasses}
                horizontal
                pagingEnabled
                bounces={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                renderItem={({ item }) => (
                  <View style={{ width: windowWidth, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing[4] }}>
                    <View
                      ref={(node) => {
                        passCardRefs.current[item.id] = node;
                      }}
                      collapsable={false}>
                      <EventPassCard
                        name={item.passLabel}
                        eventTitle={item.title}
                        qrImage={item.qrImage}
                        addOns={item.addOns.map((title) => ({ icon: 'confirmation-number' as const, title }))}
                        onSharePress={() => {
                          void sharePass(item);
                        }}
                      />
                    </View>
                  </View>
                )}
              />
              {renderablePasses.length > 1 ? (
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing[2], marginTop: spacing[5] }}>
                  {renderablePasses.map((pass, index) => (
                    <View
                      key={pass.id}
                      style={{
                        width: index === activeIndex ? 28 : 8,
                        height: 8,
                        borderRadius: 999,
                        backgroundColor: index === activeIndex ? colors.primary.DEFAULT : 'rgba(148,163,184,0.35)',
                      }}
                    />
                  ))}
                </View>
              ) : null}
              <Text variant="caption" color="#94a3b8" style={{ marginTop: spacing[4], fontFamily: typography.fontFamily.bold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 2 }}>
                {renderablePasses.length} passes available
              </Text>
              {renderablePasses.length > 1 ? (
                <Text variant="caption" color="#64748b" style={{ marginTop: spacing[2], textAlign: 'center' }}>
                  {t('helper.swipe')}
                </Text>
              ) : null}
            </View>
          ) : (
            <View style={{ flex: 1, paddingHorizontal: spacing[6] }}>
              <Text variant="body" color="#64748b" style={{ textAlign: 'center' }}>No event passes available.</Text>
            </View>
          )}

          {renderablePasses.length ? (
            <View style={{ paddingHorizontal: spacing[6], paddingTop: spacing[8], paddingBottom: spacing[6] }}>
              <Button
                fullWidth
                leftIcon={<MaterialIcons name="download" size={18} color="#ffffff" />}
                onPress={() => {
                  void shareAllPasses();
                }}>
                {t('actions.download')}
              </Button>
              <Text variant="caption" color="#64748b" style={{ marginTop: spacing[4], textAlign: 'center', lineHeight: 18 }}>
                {t('helper.ready')}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </AppSafeAreaView>
  );
}
