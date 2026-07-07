import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { MENU_CATEGORY_ICONS } from '../../../shared/constants';
import { FONTS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { useThemeStore } from '../../../shared/hooks/useThemeStore';
import { MenuCard } from './MenuCard';

// Agrupa los platillos de una categoría (ENTRADA, PLATO_FUERTE, ...) bajo un
// encabezado con icono. `section` viene ya agrupado y ordenado por useMenus.
export function MenuSection({ section, onAddItem }) {
  const { colors } = useThemeStore();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons
          name={MENU_CATEGORY_ICONS[section.category] || 'restaurant'}
          size={18}
          color={colors.primary}
        />
        <Text style={styles.title}>{section.title}</Text>
      </View>
      {section.data.map((menu) => (
        <MenuCard key={menu.id} menu={menu} onAdd={onAddItem} />
      ))}
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: { gap: SPACING.sm },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.sm },
  title: { fontSize: FONT_SIZE.md, fontFamily: FONTS.semibold, fontWeight: '700', color: colors.textSecondary },
});
