import Svg, { Circle, Path, Rect } from 'react-native-svg';

export default function TractorIcon({ size = 24, color = '#22c55e' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Corps du tracteur */}
      <Path
        d="M5 15V9C5 8.45 5.45 8 6 8H12L14 10H17C17.55 10 18 10.45 18 11V15"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Cabine */}
      <Path
        d="M12 8V6C12 5.45 12.45 5 13 5H16C16.55 5 17 5.45 17 6V10"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Cheminée/échappement */}
      <Path
        d="M14 5V3"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* Grande roue arrière */}
      <Circle
        cx="7"
        cy="17"
        r="3"
        stroke={color}
        strokeWidth={1.5}
        fill="none"
      />
      <Circle
        cx="7"
        cy="17"
        r="1"
        fill={color}
      />
      {/* Petite roue avant */}
      <Circle
        cx="17"
        cy="17"
        r="2"
        stroke={color}
        strokeWidth={1.5}
        fill="none"
      />
      <Circle
        cx="17"
        cy="17"
        r="0.5"
        fill={color}
      />
      {/* Connexion entre les roues */}
      <Path
        d="M10 17H15"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}
