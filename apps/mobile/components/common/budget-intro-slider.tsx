import React, { useRef } from "react";
import { View, Image, useWindowDimensions, Platform } from "react-native";
import { Text } from "@/components/ui";
import AppIntroSlider from "react-native-app-intro-slider";
import { colors } from "@/theme/colors";
import { useTheme } from "@/hooks/use-theme";
import CustomButton from "./custom-button";
import { translate } from "@/i18n/translate";

interface Slide {
  key: string;
  title: string;
  text: string;
  image: any;
}

interface BudgetIntroSliderProps {
  slides: Slide[];
  onDone: () => void;
  name: string;
}

const BudgetIntroSlider: React.FC<BudgetIntroSliderProps> = ({
  slides,
  onDone,
  name,
}) => {
  const sliderRef = useRef<AppIntroSlider>(null);
  const { width } = useWindowDimensions();
  const { theme, isDark } = useTheme();

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={[styles.slide, { backgroundColor: theme.background }]}>
      <View style={styles.contentContainer}>
        <Text weight="bold" style={[styles.title, { color: theme.textPrimary }]}>
          {translate("budgetOnboarding:welcome", {
            name: name?.trim() ? name.trim().split(" ")[0] : "",
          })}
        </Text>
        <Image
          source={item.image}
          style={[styles.image, { width: width * 0.8, height: width * 0.8 }]}
          resizeMode="contain"
        />
        <Text weight="light" style={[styles.text, { color: theme.textSecondary }]}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <AppIntroSlider
      ref={sliderRef}
      data={slides}
      renderItem={renderItem}
      onDone={onDone}
      showSkipButton={false}
      dotStyle={[styles.dot, { backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)" }]}
      activeDotStyle={styles.activeDot}
      renderNextButton={() => (
        <View style={[styles.buttonContainer, { backgroundColor: theme.background }]}>
          <CustomButton
            variant="primary"
            title="Siguiente"
            onPress={() =>
              sliderRef.current?.goToSlide(
                sliderRef.current.state.activeIndex + 1
              )
            }
            isEnabled={true}
          />
        </View>
      )}
      renderDoneButton={() => (
        <View style={[styles.buttonContainer, { backgroundColor: theme.background }]}>
          <CustomButton
            variant="primary"
            title="Listo"
            onPress={onDone}
            isEnabled={true}
          />
        </View>
      )}
      bottomButton
    />
  );
};

const styles = {
  slide: {
    flex: 1,
    marginTop: -130,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 2,
    textAlign: "center" as const,
  },
  text: {
    fontSize: 14,
    textAlign: "center" as const,
    marginTop: 2,
    paddingHorizontal: 10,
  },
  image: {
    marginVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.primary,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "android" ? 100 : 100,
  },
};

export default BudgetIntroSlider;
