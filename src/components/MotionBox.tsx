import React from 'react';
import { Box, BoxProps } from "@chakra-ui/react";
import { useSpring, animated, SpringConfig } from "react-spring";

export interface MotionBoxProps extends Omit<BoxProps, 'transition'> {
  initial?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  animate?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  exit?: {
    opacity?: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  transition?: SpringConfig & {
    delay?: number;
  };
}

export const MotionBox: React.FC<MotionBoxProps> = ({ children, initial, animate, exit, transition, ...props }) => {
  const spring = useSpring({
    from: initial,
    to: animate,
    config: {
      tension: transition?.tension || 170,
      friction: transition?.friction || 26,
    },
    delay: transition?.delay,
  });

  return (
    <Box {...props}>
      <animated.div style={spring}>
        {children}
      </animated.div>
    </Box>
  );
};

export default MotionBox;