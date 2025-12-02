import { Text, View } from '@/components';
import { getYakuById } from '@/data/yaku';
import type { YakuStackParamList } from '@/navigation/YakuStackNavigator';
import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type YakuDetailRouteProp = RouteProp<YakuStackParamList, 'YakuDetail'>;

export default function YakuDetailScreen() {
  const route = useRoute<YakuDetailRouteProp>();
  const { yakuId } = route.params;
  const styles = stylesheet;
  const yaku = getYakuById(yakuId);

  if (!yaku) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text type='title' style={styles.title}>
            Yaku Not Found
          </Text>
          <Text style={styles.errorText}>
            The requested yaku could not be found.
          </Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text type='title' style={styles.title}>
              {yaku.name}
            </Text>
            <Text style={styles.nameJp}>{yaku.nameJp}</Text>
            <Text style={styles.nameEn}>{yaku.nameEn}</Text>
          </View>
          <View
            style={[
              styles.hanBadge,
              yaku.type === 'yakuman' && styles.hanBadgeYakuman
            ]}>
            <Text
              style={[
                styles.hanText,
                yaku.type === 'yakuman' && styles.hanTextYakuman
              ]}>
              {yaku.han === 'yakuman' ? '役満' : `${yaku.han} han`}
            </Text>
          </View>
        </View>

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{yaku.category}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.descriptionText}>{yaku.description}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conditions</Text>
          <View style={styles.sectionContent}>
            {yaku.conditions.map((condition, index) => (
              <View key={index} style={styles.conditionItem}>
                <View style={styles.bullet} />
                <Text style={styles.conditionText}>{condition}</Text>
              </View>
            ))}
          </View>
        </View>

        {yaku.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={[styles.sectionContent, styles.notesContainer]}>
              <Text style={styles.notesText}>{yaku.notes}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type</Text>
          <View style={styles.sectionContent}>
            <View
              style={[
                styles.typeBadge,
                yaku.type === 'yakuman' && styles.typeBadgeYakuman
              ]}>
              <Text
                style={[
                  styles.typeText,
                  yaku.type === 'yakuman' && styles.typeTextYakuman
                ]}>
                {yaku.type === 'yakuman' ? 'Yakuman' : 'Regular Yaku'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const stylesheet = StyleSheet.create(theme => ({
  container: {
    flex: 1
  },
  content: {
    padding: theme.spacing.base,
    gap: theme.spacing.lg
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.base,
    marginBottom: theme.spacing.sm
  },
  titleContainer: {
    flex: 1,
    gap: theme.spacing.xs
  },
  title: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: '700',
    color: theme.colors.text
  },
  nameJp: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textSecondary,
    fontWeight: '500'
  },
  nameEn: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic'
  },
  hanBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  hanBadgeYakuman: {
    backgroundColor: theme.colors.warning
  },
  hanText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  hanTextYakuman: {
    fontSize: theme.typography.sizes.sm
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.backgroundSecondary,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.base
  },
  categoryText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: '500'
  },
  section: {
    gap: theme.spacing.sm
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '600',
    color: theme.colors.text
  },
  sectionContent: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.base,
    gap: theme.spacing.sm
  },
  descriptionText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeights.base
  },
  conditionItem: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'flex-start'
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginTop: 6
  },
  conditionText: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeights.base
  },
  notesContainer: {
    backgroundColor: theme.colors.warning + '15',
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.warning
  },
  notesText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeights.base,
    fontStyle: 'italic'
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.base,
    borderWidth: 1,
    borderColor: theme.colors.primary
  },
  typeBadgeYakuman: {
    backgroundColor: theme.colors.warning + '20',
    borderColor: theme.colors.warning
  },
  typeText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: '600'
  },
  typeTextYakuman: {
    color: theme.colors.warning
  },
  errorText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textSecondary,
    textAlign: 'center'
  }
}));
