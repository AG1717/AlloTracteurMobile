import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';

export default function Header({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  rightIcon,
  onRightPress,
  rightComponent,
  variant = 'default', // default, transparent, primary
  style,
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const getContainerStyle = () => {
    const baseStyle = [
      styles.container,
      { paddingTop: insets.top + 10 },
    ];

    switch (variant) {
      case 'transparent':
        baseStyle.push(styles.containerTransparent);
        break;
      case 'primary':
        baseStyle.push(styles.containerPrimary);
        break;
      default:
        baseStyle.push(styles.containerDefault);
    }

    return baseStyle;
  };

  const getTextColor = () => {
    return variant === 'primary' ? colors.textWhite : colors.textPrimary;
  };

  const getIconColor = () => {
    return variant === 'primary' ? colors.textWhite : colors.textPrimary;
  };

  return (
    <View style={[...getContainerStyle(), style]}>
      <View style={styles.content}>
        <View style={styles.left}>
          {showBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={getIconColor()}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.center}>
          <Text
            style={[styles.title, { color: getTextColor() }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                { color: variant === 'primary' ? colors.primaryLight : colors.textSecondary },
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.right}>
          {rightComponent ? (
            rightComponent
          ) : rightIcon ? (
            <TouchableOpacity
              style={styles.rightButton}
              onPress={onRightPress}
            >
              <Ionicons
                name={rightIcon}
                size={24}
                color={getIconColor()}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  containerDefault: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  containerTransparent: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  containerPrimary: {
    backgroundColor: colors.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  left: {
    width: 44,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    width: 44,
    alignItems: 'flex-end',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  rightButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -8,
  },
  placeholder: {
    width: 40,
  },
});
