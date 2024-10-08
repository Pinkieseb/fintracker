import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: "#e0f7fa",
      100: "#b2ebf2",
      200: "#80deea",
      300: "#4dd0e1",
      400: "#26c6da",
      500: "#00bcd4",
      600: "#00acc1",
      700: "#0097a7",
      800: "#00838f",
      900: "#006064",
    },
    accent: {
      50: "#fff3e0",
      100: "#ffe0b2",
      200: "#ffcc80",
      300: "#ffb74d",
      400: "#ffa726",
      500: "#ff9800",
      600: "#fb8c00",
      700: "#f57c00",
      800: "#ef6c00",
      900: "#e65100",
    },
  },
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
    "8xl": "6rem",
    "9xl": "8rem",
  },
  space: {
    px: "1px",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    3.5: "0.875rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    28: "7rem",
    32: "8rem",
    36: "9rem",
    40: "10rem",
    44: "11rem",
    48: "12rem",
    52: "13rem",
    56: "14rem",
    60: "15rem",
    64: "16rem",
    72: "18rem",
    80: "20rem",
    96: "24rem",
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.900" : "white",
        color: props.colorMode === "dark" ? "white" : "gray.800",
        fontSize: ["md", "lg", "xl"],
        lineHeight: "tall",
      },
    }),
  },
  components: {
    Heading: {
      baseStyle: (props: any) => ({
        color: props.colorMode === "dark" ? "white" : "gray.800",
        marginBottom: "6",
      }),
      sizes: {
        "4xl": { fontSize: ["4xl", "5xl", "6xl"] },
        "3xl": { fontSize: ["3xl", "4xl", "5xl"] },
        "2xl": { fontSize: ["2xl", "3xl", "4xl"] },
        xl: { fontSize: ["xl", "2xl", "3xl"] },
        lg: { fontSize: ["lg", "xl", "2xl"] },
        md: { fontSize: ["md", "lg", "xl"] },
        sm: { fontSize: ["sm", "md", "lg"] },
        xs: { fontSize: ["xs", "sm", "md"] },
      },
    },
    Button: {
      baseStyle: {
        fontWeight: "bold",
        borderRadius: "md",
        transition: "all 0.2s",
      },
      sizes: {
        lg: {
          fontSize: ["lg", "xl"],
          px: 8,
          py: 4,
        },
        md: {
          fontSize: ["md", "lg"],
          px: 6,
          py: 3,
        },
        sm: {
          fontSize: ["sm", "md"],
          px: 4,
          py: 2,
        },
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorMode === "dark" ? "brand.200" : "brand.500",
          color: props.colorMode === "dark" ? "gray.800" : "white",
          _hover: {
            bg: props.colorMode === "dark" ? "brand.300" : "brand.600",
            transform: "translateY(-2px)",
            boxShadow: "lg",
          },
        }),
        outline: (props: any) => ({
          borderColor: props.colorMode === "dark" ? "brand.200" : "brand.500",
          color: props.colorMode === "dark" ? "brand.200" : "brand.500",
          _hover: {
            bg: props.colorMode === "dark" ? "brand.200" : "brand.50",
            color: props.colorMode === "dark" ? "gray.800" : "brand.500",
            transform: "translateY(-2px)",
            boxShadow: "lg",
          },
        }),
        ghost: (props: any) => ({
          color: props.colorMode === "dark" ? "brand.200" : "brand.500",
          _hover: {
            bg: props.colorMode === "dark" ? "whiteAlpha.200" : "brand.50",
            transform: "translateY(-2px)",
          },
        }),
      },
    },
    Menu: {
      baseStyle: (props: any) => ({
        list: {
          bg: props.colorMode === "dark" ? "gray.800" : "white",
          borderColor: props.colorMode === "dark" ? "whiteAlpha.300" : "gray.200",
          boxShadow: "xl",
          borderRadius: "lg",
        },
        item: {
          bg: props.colorMode === "dark" ? "gray.800" : "white",
          _hover: {
            bg: props.colorMode === "dark" ? "whiteAlpha.200" : "gray.100",
          },
          _focus: {
            bg: props.colorMode === "dark" ? "whiteAlpha.200" : "gray.100",
          },
        },
      }),
    },
    Form: {
      baseStyle: (props: any) => ({
        helperText: {
          color: props.colorMode === "dark" ? "gray.400" : "gray.600",
          fontSize: ["sm", "md"],
        },
        errorMessage: {
          color: props.colorMode === "dark" ? "red.300" : "red.500",
          fontSize: ["sm", "md"],
        },
      }),
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: "md",
          transition: "all 0.2s",
        },
      },
      sizes: {
        lg: {
          field: { fontSize: ["lg", "xl"], px: 4, py: 3 },
        },
        md: {
          field: { fontSize: ["md", "lg"], px: 3, py: 2 },
        },
        sm: {
          field: { fontSize: ["sm", "md"], px: 2, py: 1 },
        },
      },
      variants: {
        filled: (props: any) => ({
          field: {
            bg: props.colorMode === "dark" ? "whiteAlpha.100" : "gray.100",
            _hover: {
              bg: props.colorMode === "dark" ? "whiteAlpha.200" : "gray.200",
            },
            _focus: {
              bg: props.colorMode === "dark" ? "whiteAlpha.300" : "gray.300",
              borderColor: "brand.500",
            },
          },
        }),
      },
      defaultProps: {
        variant: "filled",
        size: "lg",
      },
    },
    Select: {
      baseStyle: {
        field: {
          borderRadius: "md",
          transition: "all 0.2s",
        },
      },
      sizes: {
        lg: {
          field: { fontSize: ["lg", "xl"], px: 4, py: 3 },
        },
        md: {
          field: { fontSize: ["md", "lg"], px: 3, py: 2 },
        },
        sm: {
          field: { fontSize: ["sm", "md"], px: 2, py: 1 },
        },
      },
      variants: {
        filled: (props: any) => ({
          field: {
            bg: props.colorMode === "dark" ? "whiteAlpha.100" : "gray.100",
            _hover: {
              bg: props.colorMode === "dark" ? "whiteAlpha.200" : "gray.200",
            },
            _focus: {
              bg: props.colorMode === "dark" ? "whiteAlpha.300" : "gray.300",
              borderColor: "brand.500",
            },
          },
        }),
      },
      defaultProps: {
        variant: "filled",
        size: "lg",
      },
    },
    Textarea: {
      baseStyle: {
        borderRadius: "md",
        transition: "all 0.2s",
      },
      sizes: {
        lg: { fontSize: ["lg", "xl"], px: 4, py: 3 },
        md: { fontSize: ["md", "lg"], px: 3, py: 2 },
        sm: { fontSize: ["sm", "md"], px: 2, py: 1 },
      },
      variants: {
        filled: (props: any) => ({
          bg: props.colorMode === "dark" ? "whiteAlpha.100" : "gray.100",
          _hover: {
            bg: props.colorMode === "dark" ? "whiteAlpha.200" : "gray.200",
          },
          _focus: {
            bg: props.colorMode === "dark" ? "whiteAlpha.300" : "gray.300",
            borderColor: "brand.500",
          },
        }),
      },
      defaultProps: {
        variant: "filled",
        size: "lg",
      },
    },
    Checkbox: {
      baseStyle: (props: any) => ({
        control: {
          borderRadius: "md",
          _checked: {
            bg: props.colorMode === "dark" ? "brand.200" : "brand.500",
            borderColor: props.colorMode === "dark" ? "brand.200" : "brand.500",
          },
        },
        label: {
          fontSize: ["md", "lg"],
        },
      }),
      sizes: {
        lg: {
          control: { w: 6, h: 6 },
          label: { fontSize: ["lg", "xl"] },
        },
        md: {
          control: { w: 5, h: 5 },
          label: { fontSize: ["md", "lg"] },
        },
        sm: {
          control: { w: 4, h: 4 },
          label: { fontSize: ["sm", "md"] },
        },
      },
    },
    Card: {
      baseStyle: (props: any) => ({
        container: {
          bg: props.colorMode === "dark" ? "gray.800" : "white",
          boxShadow: "xl",
          borderRadius: "xl",
          p: [6, 8],
        },
      }),
    },
    Tabs: {
      variants: {
        enclosed: (props: any) => ({
          tab: {
            _selected: {
              color: props.colorMode === "dark" ? "brand.200" : "brand.600",
              borderColor: props.colorMode === "dark" ? "brand.200" : "brand.600",
              borderBottomColor: props.colorMode === "dark" ? "gray.800" : "white",
            },
            fontSize: ["md", "lg"],
          },
          tablist: {
            borderBottomColor: props.colorMode === "dark" ? "whiteAlpha.300" : "gray.200",
          },
          tabpanel: {
            bg: props.colorMode === "dark" ? "gray.800" : "white",
            p: [4, 6],
          },
        }),
      },
    },
    Table: {
      variants: {
        simple: (props: any) => ({
          th: {
            borderColor: props.colorMode === "dark" ? "whiteAlpha.300" : "gray.200",
            fontSize: ["sm", "md"],
          },
          td: {
            borderColor: props.colorMode === "dark" ? "whiteAlpha.300" : "gray.200",
            fontSize: ["md", "lg"],
          },
        }),
      },
    },
  },
  layerStyles: {
    formContainer: {
      maxWidth: "800px",
      width: "100%",
      margin: "auto",
      padding: [4, 6, 8],
    },
    card: {
      bg: "white",
      borderRadius: "xl",
      boxShadow: "xl",
      p: [6, 8],
    },
  },
  textStyles: {
    h1: {
      fontSize: ["4xl", "5xl", "6xl"],
      fontWeight: "bold",
      lineHeight: "110%",
      letterSpacing: "-2%",
    },
    h2: {
      fontSize: ["3xl", "4xl", "5xl"],
      fontWeight: "semibold",
      lineHeight: "110%",
      letterSpacing: "-1%",
    },
    h3: {
      fontSize: ["2xl", "3xl", "4xl"],
      fontWeight: "semibold",
      lineHeight: "110%",
      letterSpacing: "-1%",
    },
    h4: {
      fontSize: ["xl", "2xl", "3xl"],
      fontWeight: "semibold",
      lineHeight: "110%",
      letterSpacing: "-1%",
    },
    body: {
      fontSize: ["md", "lg", "xl"],
      lineHeight: "tall",
    },
  },
});

export default theme;
