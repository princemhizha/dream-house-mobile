import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Radius, Shadow, Spacing } from '../../constants/spacing';

interface Props {
  imageUri: string;
}

export function IDPreviewCard({ imageUri }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.hint}>Ensure all text on the ID is clearly visible</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  image: {
    width: '100%',
    aspectRatio: 1.6,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.borderDefault,
    ...Shadow.md,
  },
  hint: {
    fontFamily: FontFamily.bodyLight,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
