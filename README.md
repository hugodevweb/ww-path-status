# Status Steps - WeWeb Custom Component

A professional, minimalist status steps component for progress indicators. Perfect for order tracking, onboarding flows, multi-step forms, and any process visualization.

## Features

✨ **Professional Design**
- Clean, modern minimalist aesthetic
- Flat design with soft shadows
- Smooth animations and transitions with easing
- Animated step state changes with bounce effects
- Progressive line fill animations
- Checkmark fade-in and number pulse effects
- Subtle pulse animation on current step

🎨 **Highly Customizable**
- 3 distinct states: Completed, Current, Upcoming
- Customizable colors for each state
- Separate text and description colors
- Adjustable spacing and typography
- Horizontal or vertical orientation

📱 **Fully Responsive**
- Adapts seamlessly from desktop to mobile
- Automatic layout adjustment on small screens
- Optimized for 3-6 steps

⚡ **Dynamic Data Binding**
- Professional formula mapping for external data
- Bind to APIs, databases, or collections
- Map any field names to labels, descriptions, status
- Real-time updates without re-render

🔧 **Interactive**
- Optional clickable steps
- Inline confirmation panel for step changes
- Customizable confirmation messages and buttons
- Smooth slide-down animation for confirmation
- Internal variable tracking (`activeStepId`)
- Trigger events: `step-click`, `step-change`
- Perfect for workflow navigation

## Component States

### Completed Step ✓
- Filled circle with checkmark icon
- Green accent color (#10b981)
- Connected with colored progress line
- Medium weight text

### Current Step →
- Filled circle with step number
- Blue primary color (#3b82f6)
- Pulsing animation effect
- Bold text for emphasis
- Enhanced shadow

### Upcoming Step ○
- Outlined circle with step number
- Muted grey color (#9ca3af)
- Standard grey connecting line
- Light text weight

## Properties

### Content Settings

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **Steps** | Array | 4 sample steps | Array of step objects with id, label, description |
| **Init Value** | Text | 'processing' | The current step ID/status from your API to match against step IDs |
| **Show Descriptions** | Boolean | true | Show/hide description text below labels |
| **Clickable Steps** | Boolean | false | Allow users to click steps to navigate |
| **Require Confirmation** | Boolean | false | Show confirmation dialog before changing steps (only when clickable) |
| **Confirmation Title** | Text | 'Change Step?' | Title text for confirmation dialog |
| **Confirmation Message** | Text | 'Are you sure...' | Message text for confirmation dialog |
| **Confirm Button Text** | Text | 'Confirm' | Text for confirm button |
| **Cancel Button Text** | Text | 'Cancel' | Text for cancel button |

### Layout Settings

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **Orientation** | Select | horizontal | Layout direction: horizontal or vertical |
| **Step Spacing** | Length | 24px | Space between steps |

### Colors (Style)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **Completed Color** | Color | #10b981 | Indicator color for completed steps |
| **Current Color** | Color | #3b82f6 | Indicator color for current step |
| **Upcoming Border Color** | Color | #9ca3af | Border color for upcoming steps |
| **Upcoming Background Color** | Color | #ffffff | Background color for upcoming step circles |
| **Line Color** | Color | #e5e7eb | Color for connecting lines |
| **Completed Line Color** | Color | #10b981 | Line color between completed steps |

### Text Colors (Style)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **Completed Text Color** | Color | #374151 | Label color for completed steps |
| **Current Text Color** | Color | #1f2937 | Label color for current step |
| **Upcoming Text Color** | Color | #9ca3af | Label color for upcoming steps |
| **Completed Desc Color** | Color | #6b7280 | Description color for completed |
| **Current Desc Color** | Color | #4b5563 | Description color for current |
| **Upcoming Desc Color** | Color | #d1d5db | Description color for upcoming |

### Typography

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **Font Family** | Text | Inter, system-ui | CSS font family for all text |

## Internal Variables

| Variable | Type | Description |
|----------|------|-------------|
| **activeStepId** | String | Currently active step ID (updated on click or programmatically) |

## Trigger Events

### step-click
Fires when a user clicks on a step (only when "Clickable Steps" is enabled).

**Event Data:**
```javascript
{
  step: {},      // Full step object
  index: 0,      // Step index (position in array)
  id: '',        // Step ID
  label: '',     // Step label
  status: ''     // Step status (completed/current/upcoming)
}
```

### step-change
Fires when the active step changes.

**Event Data:**
```javascript
{
  newStepId: '', // New active step ID
  oldStepId: ''  // Previous active step ID
}
```

## Usage Examples

### Basic Order Tracking
```javascript
// Steps data structure
[
  { 
    id: 'order_placed', 
    label: 'Order Placed', 
    description: 'Your order has been received'
  },
  { 
    id: 'processing', 
    label: 'Processing', 
    description: 'We are preparing your order'
  },
  { 
    id: 'shipped', 
    label: 'Shipped', 
    description: 'Your order is on the way'
  },
  { 
    id: 'delivered', 
    label: 'Delivered', 
    description: 'Order has been delivered'
  }
]

// Set Init Value to: 'processing'
// Result: 
//   - order_placed = completed ✓
//   - processing = current (highlighted)
//   - shipped = upcoming
//   - delivered = upcoming
```

### Dynamic Data Binding with API
When you bind an external data source to the Steps property:
1. Formula mapping fields appear automatically
2. Map your data fields to: ID, Label, Description
3. Set **Init Value** to your API's current status field
4. Component updates in real-time as data changes

Example API response mapping:
```javascript
// Your API returns:
{
  currentStatus: 'in_transit',
  timeline: [
    { status_code: 'order_confirmed', title: 'Order Confirmed', info: 'Jan 15, 10:00 AM' },
    { status_code: 'preparing', title: 'Preparing', info: 'Jan 15, 11:30 AM' },
    { status_code: 'in_transit', title: 'In Transit', info: 'Jan 16, 08:00 AM' },
    { status_code: 'delivered', title: 'Delivered', info: 'Pending' }
  ]
}

// Configuration:
// 1. Bind Steps → response.timeline
// 2. Map fields:
//    - ID Field → status_code
//    - Label Field → title
//    - Description Field → info
// 3. Bind Init Value → response.currentStatus
```

### Automatic Status Calculation
The component automatically calculates step statuses based on the **Init Value**:
1. Finds the step with ID matching Init Value
2. Steps before that step = 'completed' ✓
3. The matching step = 'current' (highlighted)
4. Steps after that step = 'upcoming' ○

**Example:**
- Init Value = 'shipped'
- Result: order_placed ✓, processing ✓, **shipped** (current), delivered ○

## Responsive Behavior

### Desktop (> 768px)
- Full spacing between steps
- Clear horizontal/vertical layout
- All text fully visible

### Tablet (480px - 768px)
- Slightly reduced spacing
- Smaller indicators (36px)
- Optimized font sizes

### Mobile (< 480px)
- Horizontal mode automatically converts to vertical-like layout
- Steps stack with connecting lines below indicators
- Left-aligned text for better readability
- Maximum width constraint for optimal UX

## Development

### Installation
```shell
npm install
```

### Local Development
```shell
npm run serve -- --port 3000
```
Then add the custom element in the WeWeb editor developer popup.

### Build for Production
```shell
npm run build
```

## Design Philosophy

This component follows modern UX principles:
- **Clarity**: Clear visual hierarchy and status indication
- **Simplicity**: Minimal design without unnecessary elements
- **Feedback**: Immediate visual response to state changes with delightful animations
- **Animation**: Smooth transitions using cubic-bezier easing for natural motion
  - **Completed steps**: Scale-in effect with rotating checkmark fade-in (0.6s)
  - **Current step**: Pop-in bounce effect with number pulse (0.5s)
  - **Lines**: Progressive fill animation from left to right (0.8s)
  - **Text**: Smooth color and weight transitions (0.5s)
- **Accessibility**: High contrast ratios and clear typography
- **Performance**: GPU-accelerated animations, optimized rendering with hardware acceleration

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT
