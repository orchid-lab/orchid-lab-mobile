import React from 'react';
import Svg, { Path, Ellipse, Circle, G } from 'react-native-svg';
import { C } from '../constants/colors';

const LeafIllustration: React.FC = () => (
  <Svg width={300} height={260} viewBox="0 0 320 280">
    {/* Back large dark leaf */}
    <Path
      d="M160 260 C80 220 40 150 60 80 C80 20 140 10 180 40 C220 70 230 140 200 200 Z"
      fill={C.green1}
      opacity={0.85}
    />
    {/* Right monstera leaf */}
    <Path
      d="M200 240 C230 190 260 130 240 70 C225 25 185 15 165 50 C145 85 160 160 190 210 Z"
      fill={C.green2}
      opacity={0.9}
    />
    {/* Left wide leaf */}
    <Path
      d="M80 230 C40 180 30 110 60 60 C80 25 120 30 140 70 C160 110 140 180 110 220 Z"
      fill={C.green3}
      opacity={0.88}
    />
    {/* Center bright leaf */}
    <Path
      d="M155 255 C120 200 115 130 140 80 C155 50 180 50 190 80 C205 120 195 200 170 255 Z"
      fill={C.green4}
      opacity={0.95}
    />
    {/* Far right thin leaf */}
    <Path
      d="M255 200 C270 160 275 100 260 60 C250 35 235 40 228 65 C220 95 230 155 245 195 Z"
      fill={C.green1}
      opacity={0.7}
    />
    {/* Far left leaf */}
    <Path
      d="M50 190 C30 145 35 85 55 50 C68 28 85 35 88 62 C92 95 75 155 60 190 Z"
      fill={C.green2}
      opacity={0.65}
    />
    {/* Monstera holes */}
    <Ellipse cx={150} cy={140} rx={12} ry={18} fill={C.green2} opacity={0.45} />
    <Ellipse cx={170} cy={172} rx={9} ry={13} fill={C.green1} opacity={0.38} />
    {/* Yellow flower cluster left */}
    <G>
      <Circle cx={90} cy={95} r={8} fill={C.yellow} />
      <Circle cx={90} cy={95} r={4} fill={C.yellowDark} />
      <Circle cx={82} cy={88} r={5} fill={C.yellow} opacity={0.8} />
      <Circle cx={98} cy={88} r={5} fill={C.yellow} opacity={0.8} />
      <Circle cx={90} cy={83} r={5} fill={C.yellow} opacity={0.8} />
    </G>
    {/* Yellow flower cluster right */}
    <G>
      <Circle cx={235} cy={118} r={7} fill={C.yellow} />
      <Circle cx={235} cy={118} r={3} fill={C.yellowDark} />
      <Circle cx={228} cy={112} r={4} fill={C.yellow} opacity={0.8} />
      <Circle cx={242} cy={112} r={4} fill={C.yellow} opacity={0.8} />
    </G>
    {/* Yellow flower top */}
    <G>
      <Circle cx={145} cy={65} r={6} fill={C.yellow} opacity={0.9} />
      <Circle cx={153} cy={60} r={4} fill={C.yellow} opacity={0.7} />
      <Circle cx={137} cy={60} r={4} fill={C.yellow} opacity={0.7} />
    </G>
    {/* Tiny berries */}
    <Circle cx={200} cy={74} r={4} fill={C.yellow} opacity={0.8} />
    <Circle cx={207} cy={67} r={3} fill={C.yellowDark} opacity={0.7} />
    <Circle cx={65} cy={128} r={4} fill={C.yellow} opacity={0.7} />
  </Svg>
);

export default LeafIllustration;