### **Moly-Frontend Design System - Version 1.1**

#### **1.0 Introduction**

**1.1 Vision**
To establish a unified design language that ensures perceptual and functional consistency across the entire Moly-Frontend application. This system serves as the single source of truth (SSoT) for both design and development, aiming to accelerate the creation process, improve user experience, and simplify maintenance.

**1.2 Core Principles**
*   **Clarity**: The UI must be intuitive and unambiguous. Visual hierarchy and clear affordances are paramount.
*   **Efficiency**: The design should enable users to complete tasks with minimum effort and cognitive load.
*   **Consistency**: Components and patterns must be predictable and reusable, ensuring a cohesive experience throughout the platform.
*   **Intentionality**: Every element, animation, and interaction must serve a purpose. We avoid decorative elements that do not enhance usability or understanding.

---

#### **2.0 Design Tokens (The Foundation)**

Design tokens are the atomic values of our visual language, managed centrally and propagated throughout the system.

**2.1 Color System**
The color palette is structured into three categories: Core, Semantic, and UI. All colors must meet WCAG 2.1 AA contrast ratios for accessibility.

| Category | Token Name | Value (HSL) | Primary Usage |
| :--- | :--- | :--- | :--- |
| **Core** | `primary` | `210, 40%, 50%` | Key CTAs, active states, brand moments. |
| | `secondary` | `210, 10%, 95%` | Secondary actions, subtle backgrounds. |
| **Semantic** | `success` | `140, 65%, 45%` | Success states, confirmations, validation. |
| | `warning` | `45, 90%, 50%` | Warnings, non-blocking issues. |
| | `destructive` | `0, 84%, 60%` | Errors, destructive actions, critical alerts. |
| **UI** | `background` | `0, 0%, 100%` | Main application background. |
| | `foreground` | `210, 20%, 15%` | Default text color. |
| | `border` | `210, 20%, 88%` | Component borders, dividers. |
| | `card` | `0, 0%, 100%` | Surface for cards, popovers, menus. |
| | `ring` | `210, 40%, 50%` | Focus indicators. |

**2.2 Typographic Scale**
The typographic scale establishes a clear hierarchy for all text content. We utilize a system font stack for optimal performance and native feel.

| Scale Name | Font Size / Line Height | Font Weight | Recommended Usage |
| :--- | :--- | :--- | :--- |
| `display` | 48px / 1.2 | Bold (700) | Marketing headlines, special titles. |
| `heading-1` | 36px / 1.2 | Bold (700) | Primary page titles (one per page). |
| `heading-2` | 30px / 1.3 | Semi-bold (600) | Major section titles. |
| `heading-3` | 24px / 1.4 | Semi-bold (600) | Sub-section or card titles. |
| `body-large` | 18px / 1.6 | Regular (400) | Article lead paragraphs. |
| `body-default` | 16px / 1.6 | Regular (400) | Default text for all content. |
| `body-small` | 14px / 1.5 | Regular (400) | Helper text, metadata, captions. |
| `label` | 12px / 1.4 | Medium (500) | Form labels, tags. |

**2.3 Spacing & Grid**
We enforce an **8-Point Grid System**. All spatial relationships (margins, paddings, gaps) must conform to a scale derived from an 8px base unit. This ensures vertical and horizontal rhythm.

*   **Base Unit**: `1x = 8px`
*   **Spacing Scale**: `4px (0.5x)`, `8px (1x)`, `12px (1.5x)`, `16px (2x)`, `24px (3x)`, `32px (4x)`, `48px (6x)`, `64px (8x)`.

**2.4 Layout**
*   **Breakpoints**: A standard set of breakpoints ensures a responsive experience: `sm (640px)`, `md (768px)`, `lg (1024px)`, `xl (1280px)`, `2xl (1536px)`.
*   **Container**: The main content container has a max-width of `1280px` with horizontal padding.

**2.5 Surface & Elevation**
*   **Border Radius**: A consistent radius scale is used to define the curvature of container corners.
    *   `sm`: 4px (Tags, Tooltips)
    *   `md`: 8px (Buttons, Inputs, Cards)
    *   `lg`: 16px (Modals, large containers)
*   **Shadow (Elevation)**: A subtle shadow system creates a sense of depth and hierarchy.
    *   `elevation-1`: `sm` - For low-lying surfaces like tooltips.
    *   `elevation-2`: `md` - For standard components like cards and dropdowns.
    *   `elevation-3`: `lg` - For critical, overlaying elements like modals.

---

#### **3.0 Core Components: Usage Guidelines**

*   **Buttons**: The choice of button variant must reflect the action's importance. A view should have only one `primary` button. Secondary actions use `secondary`, and tertiary or contextual actions use `ghost` or `link`.
*   **Forms**: All form inputs must have an associated `Label`. Labels are positioned above the input. Validation feedback is displayed below the input upon losing focus or on submission, using semantic colors.
*   **Cards**: Cards are the primary surface for grouped content. They must use `elevation-2` shadow and `md` border-radius. Padding must conform to the spacing scale, typically `24px (3x)`.

---

#### **4.0 Additional Dimensions**

**4.1 Iconography**
*   **Library**: Lucide React.
*   **Default Size**: 16px.
*   **Stroke Width**: 1.5px.
*   **Usage**: Icons must be accompanied by text labels unless the context makes their meaning universally understood (e.g., a close 'X' icon).

**4.2 Motion**
Animations must be purposeful, guiding the user and providing feedback without being distracting.
*   **Duration Scale**: `fast (150ms)`, `normal (300ms)`, `slow (500ms)`.
*   **Easing**: `ease-in-out` is the default for most state transitions.
*   **Principle**: Animate properties like `transform` and `opacity` over `width` or `height` for performance.

**4.3 Accessibility (A11y)**
*   **Standard**: All development must adhere to **WCAG 2.1 Level AA** guidelines.
*   **Keyboard Navigation**: All interactive elements must be reachable and operable via keyboard.
*   **Focus States**: Clear and visible focus states (`ring` token) are non-negotiable.
*   **ARIA**: Use appropriate ARIA roles and attributes to provide context to assistive technologies.

---

#### **5.0 Implementation & Governance**

This design system will be implemented within the project's Tailwind CSS v4 configuration (`globals.css`) using `@theme` and CSS variables. Any proposed changes or additions to the system must be formally reviewed to maintain its integrity.
