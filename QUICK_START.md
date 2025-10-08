# Status Steps Component - Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally
```bash
npm run serve -- --port 3000
```

### 3. Add to WeWeb
1. Open your WeWeb editor
2. Open the developer popup (⌘/Ctrl + K)
3. Add custom element: `http://localhost:3000`

## ⚡ Quick Configuration

### Basic Setup (Static Steps)
1. Add the "Status Steps" component to your page
2. Default steps are pre-configured with IDs: `order_placed`, `processing`, `shipped`, `delivered`
3. Set **Init Value** to the ID of the current step (e.g., `'processing'`)
4. Toggle **Show Descriptions** on/off
5. Customize colors in the Style tab

### Advanced Setup (Dynamic Data)
1. Bind the **Steps** property to your data source (API, collection, variable)
2. Map your fields using the auto-appearing formula properties:
   - **ID Field** → Your step identifier field (e.g., `status_code`, `step_id`)
   - **Label Field** → Your step title field
   - **Description Field** → Your step description field
3. Bind **Init Value** to your API's current status field (e.g., `response.currentStatus`)
4. Component updates automatically as data changes

## 🎨 Visual Customization

### Color Themes

**Success/Green Theme (Default)**
- Completed: `#10b981` (Green)
- Current: `#3b82f6` (Blue)
- Upcoming Border: `#9ca3af` (Grey)
- Upcoming Background: `#ffffff` (White)

**Corporate Blue Theme**
- Completed: `#0ea5e9` (Sky Blue)
- Current: `#2563eb` (Blue)
- Upcoming Border: `#cbd5e1` (Slate)
- Upcoming Background: `#f8fafc` (Light Slate)

**Elegant Purple Theme**
- Completed: `#8b5cf6` (Purple)
- Current: `#a855f7` (Purple)
- Upcoming Border: `#d1d5db` (Grey)
- Upcoming Background: `#faf5ff` (Light Purple)

**Minimal Monochrome**
- Completed: `#1f2937` (Dark Grey)
- Current: `#4b5563` (Grey)
- Upcoming Border: `#e5e7eb` (Light Grey)
- Upcoming Background: `#ffffff` (White)

**Filled Style (All Solid Backgrounds)**
- Completed: `#10b981` (Green filled)
- Current: `#3b82f6` (Blue filled)
- Upcoming Border: `#e5e7eb` (Light Grey)
- Upcoming Background: `#f3f4f6` (Grey filled)

## 🔧 Interactive Features

### Enable Clicking
1. Toggle **Clickable Steps** to ON
2. Add workflow on **step-click** event:
   - Access `event.id` for step ID
   - Access `event.index` for step position
   - Access `event.label` for step name
   - Access `event.status` for step state

### Add Inline Confirmation Panel
1. Toggle **Clickable Steps** to ON
2. Toggle **Require Confirmation** to ON
3. Customize confirmation text (optional):
   - **Confirmation Title**: "Change Step?"
   - **Confirmation Message**: "Are you sure you want to change to this step?"
   - **Confirm Button Text**: "Confirm"
   - **Cancel Button Text**: "Cancel"
4. When users click a step, a beautiful inline panel slides down below the steps showing:
   - Step number in a colored circle
   - Confirmation title and message
   - Target step name highlighted
   - Confirm/Cancel buttons side by side
5. The panel integrates seamlessly into your layout with a smooth animation

### Track Active Step
The component exposes an internal variable: **activeStepId**
- Use in workflows: `component.activeStepId`
- Use in formulas: `@[componentId].activeStepId`
- Contains the ID of the currently active step
- Updates automatically when clicked or programmatically changed

## 📱 Layout Options

### Horizontal (Default)
Perfect for: Desktop layouts, wide containers
```
Step 1 ─── Step 2 ─── Step 3 ─── Step 4
```

### Vertical
Perfect for: Sidebars, mobile layouts, narrow containers
```
Step 1
  │
Step 2
  │
Step 3
  │
Step 4
```

## 💡 Real-World Examples

### Example 1: Order Tracking
```javascript
// Bind to order status API
GET /api/orders/123/status
Response: {
  steps: [
    { name: "Order Received", info: "Jan 15, 2025 10:30 AM", state: "completed" },
    { name: "Processing", info: "Preparing items", state: "current" },
    { name: "Shipped", info: "Pending", state: "upcoming" },
    { name: "Delivered", info: "Expected Jan 20", state: "upcoming" }
  ]
}

// Map fields:
// Steps → bind to response.steps
// Label Field → name
// Description Field → info
// Status Field → state
```

### Example 2: Multi-Step Form
```javascript
// Static steps with dynamic current step
Steps: [
  { label: "Personal Info", description: "Name and contact" },
  { label: "Address", description: "Shipping details" },
  { label: "Payment", description: "Payment method" },
  { label: "Review", description: "Confirm order" }
]

// Bind Current Step Index to: variable.formStep
// Enable Clickable Steps
// On step-click → Navigate to that form page
```

### Example 3: Onboarding Progress
```javascript
// Track user onboarding status
Steps: [
  { label: "Account Created", description: "Welcome!" },
  { label: "Profile Setup", description: "Add your details" },
  { label: "Preferences", description: "Customize experience" },
  { label: "First Action", description: "Try key features" }
]

// Bind Current Step Index to: user.onboardingStep
// Automatically shows user progress
```

## 🎯 Pro Tips

1. **Auto-Calculate Status**: Don't manually set status for each step. Just set **Current Step Index** and let the component auto-calculate completed/upcoming states.

2. **Responsive Design**: The component automatically adapts to mobile. On small screens (<480px), horizontal layout converts to vertical-style for better UX.

3. **Consistent Spacing**: Use the same **Step Spacing** value throughout your app for visual consistency (e.g., always 24px).

4. **Font Matching**: Set **Font Family** to match your app's typography system (e.g., "Inter", "Roboto", or your custom font).

5. **Color Harmony**: Keep completed and current colors in the same saturation level for visual balance. Use muted colors for upcoming steps.

## 🐛 Troubleshooting

**Steps not showing?**
- Check that Steps array is not empty
- Verify data binding is working (inspect in browser console)

**Colors not changing?**
- Make sure you're setting hex colors (e.g., #3b82f6)
- Check if binding has correct format

**Click events not firing?**
- Enable **Clickable Steps** toggle
- Add workflow on **step-click** trigger event

**Formula mapping not appearing?**
- Formula fields only show when Steps property is bound to dynamic data
- Unbind and rebind the Steps property if fields don't appear

## 📚 Additional Resources

- See `README.md` for complete API reference
- See `knowledge.md` for WeWeb component development patterns
- See `ww-config.js` for all available properties

## 🎉 You're Ready!

Your Status Steps component is production-ready. Start building beautiful progress indicators!

