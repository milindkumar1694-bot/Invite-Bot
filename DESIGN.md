---
name: Aethel
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#504444'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#827473'
  outline-variant: '#d4c2c2'
  surface-tint: '#7b5455'
  primary: '#7b5455'
  on-primary: '#ffffff'
  primary-container: '#f4c2c2'
  on-primary-container: '#734e4e'
  inverse-primary: '#ecbaba'
  secondary: '#8c4b55'
  on-secondary: '#ffffff'
  secondary-container: '#feaab6'
  on-secondary-container: '#7a3c46'
  tertiary: '#a13c3f'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffbebc'
  on-tertiary-container: '#983639'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad9'
  primary-fixed-dim: '#ecbaba'
  on-primary-fixed: '#2f1314'
  on-primary-fixed-variant: '#613d3e'
  secondary-fixed: '#ffd9dd'
  secondary-fixed-dim: '#ffb2bc'
  on-secondary-fixed: '#3a0915'
  on-secondary-fixed-variant: '#70343e'
  tertiary-fixed: '#ffdad8'
  tertiary-fixed-dim: '#ffb3b1'
  on-tertiary-fixed: '#410007'
  on-tertiary-fixed-variant: '#82252a'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.15em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1140px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
This design system embodies an intimate, romantic aesthetic tailored for high-end personal invitations and private event storytelling. The brand personality is poised between timeless elegance and modern sophistication, evoking the feeling of a hand-pressed linen card or a whispered confidence.

The visual direction utilizes a refined **Glassmorphism** mixed with **Minimalism**. It relies on deep whitespace to create "breathing room" for the content, while utilizing soft, glowing highlights and translucent layers to suggest depth and luminosity. The emotional response should be one of exclusivity, warmth, and quiet luxury—less like a public announcement and more like a private love note.

## Colors
The palette is a harmonic progression of warmth and depth.
- **Primary (Blush Pink):** Used for soft backgrounds and subtle highlights to keep the interface approachable and romantic.
- **Secondary (Rose Gold):** Applied to interactive elements and decorative accents to provide a metallic, premium feel.
- **Tertiary (Soft Burgundy):** Reserved for high-contrast text and critical call-to-actions to ensure legibility and weight.
- **Neutral (Warm Cream):** The foundational canvas color, replacing pure white to avoid clinical coldness and provide a tactile, paper-like quality.
- **Subtle Gold:** Used sparingly for thin borders, iconography, and glowing highlights to reinforce the luxury narrative.

## Typography
The typographic strategy relies on a high-contrast pairing between a sophisticated serif and a grounded geometric sans-serif. 

**Playfair Display** serves as the voice of the brand, used for headlines and quotes. It should be typeset with generous leading and occasional italicization for emphasis. **DM Sans** provides a modern, functional counterpoint for body copy and navigation, ensuring that logistical details remain clear and legible. Wide letter spacing is applied to labels and uppercase subheadings to enhance the feeling of premium luxury.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to maintain a centered, editorial look that feels like an invitation card. 

A 12-column grid is utilized with wide margins to create a sense of focused intimacy. Vertical spacing is intentional and oversized; sections should be separated by large padding (80px to 120px) to allow imagery and text to exist without clutter. On mobile, the layout transitions to a single column with increased safe areas to prevent content from feeling cramped.

## Elevation & Depth
Depth is achieved through **Glassmorphism** and **Tonal Layers** rather than heavy shadows.
- **Surfaces:** Use semi-transparent cream layers (`rgba(255, 253, 249, 0.7)`) with a `20px` backdrop blur for modals and navigation bars.
- **Shadows:** Avoid black or grey. Use extremely soft, diffused shadows tinted with the secondary color (`rgba(183, 110, 121, 0.08)`) to create a subtle lift.
- **Glows:** Apply a soft radial gradient highlight (using the primary blush color at 20% opacity) behind key images or headings to simulate a soft lighting effect.

## Shapes
The shape language is consistently soft and organic. Sharp corners are avoided to maintain the "soft luxury" aesthetic. All container elements, buttons, and input fields utilize a medium corner radius. Images should feature either the standard roundedness or, for decorative elements, a soft elliptical crop to mimic vintage portrait photography.

## Components
- **Buttons:** Primary buttons use a solid Secondary (Rose Gold) background with white text. Secondary buttons use a Rose Gold border (1px) with a transparent background. All buttons have a subtle transition effect that increases the background opacity on hover.
- **Input Fields:** Styled as "Minimalist Floating Labels" with only a bottom border in Gold or Rose Gold. Focus states should trigger a soft blush-colored glow beneath the field.
- **Cards:** Feature a Warm Cream background with a thin 0.5px Gold border. Cards should appear to "float" using the tinted ambient shadows defined in the Elevation section.
- **Chips/Tags:** Used for event categories or guest status. These should be pill-shaped with a light Blush Pink tint and deep Burgundy text.
- **Dividers:** Instead of solid lines, use 1px gradients that fade out at the edges, or a single small Rose Gold diamond glyph centered between sections.
- **Interactive Details:** Use soft-entry animations (fade and slight upward slide) for all component transitions to maintain a dreamy, fluid user experience.