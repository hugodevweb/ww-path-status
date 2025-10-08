export default {
  editor: {
    label: {
      en: "Status Steps",
    },
    icon: "view-list",
  },
  properties: {
    // ========== CONTENT SECTION ==========
    steps: {
      label: { en: 'Steps' },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [
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
        },
      ],
      options: {
        expandable: true,
        getItemLabel(item) {
          return item.label || item.title || item.name || `Step ${item.id || 'Unknown'}`;
        },
        item: {
          type: 'Object',
          defaultValue: { 
            id: 'new_step', 
            label: 'New Step', 
            description: ''
          },
          options: {
            item: {
              id: { 
                label: { en: 'ID' }, 
                type: 'Text',
                bindable: true,
              },
      label: {
                label: { en: 'Label' }, 
                type: 'Text',
                bindable: true,
              },
              description: { 
                label: { en: 'Description' }, 
                type: 'Text',
                bindable: true,
              },
            },
          },
        },
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Array of step objects with id, label, and description'
      },
      /* wwEditor:end */
    },

    // Formula properties for dynamic field mapping
    stepsLabelFormula: {
      label: { en: 'Label Field' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.steps) && content.steps.length > 0 ? content.steps[0] : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['label']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.steps) || !content.steps?.length || !boundProps.steps,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Field to use as step label'
      },
      /* wwEditor:end */
    },

    stepsDescriptionFormula: {
      label: { en: 'Description Field' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.steps) && content.steps.length > 0 ? content.steps[0] : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['description']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.steps) || !content.steps?.length || !boundProps.steps,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Field to use as step description'
      },
      /* wwEditor:end */
    },

    stepsIdFormula: {
      label: { en: 'ID Field' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.steps) && content.steps.length > 0 ? content.steps[0] : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['id']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.steps) || !content.steps?.length || !boundProps.steps,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Field to use as step identifier (matched with Init Value)'
      },
      /* wwEditor:end */
    },

    initValue: {
      label: { en: 'Init Value' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: 'processing',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'The ID/status value from your API to match against step IDs'
      },
      propertyHelp: 'Set the current step by matching this value with step IDs. Steps before will be completed, steps after will be upcoming.'
      /* wwEditor:end */
    },

    showDescriptions: {
      label: { en: 'Show Descriptions' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Show/hide step descriptions'
      },
      /* wwEditor:end */
    },

    clickable: {
      label: { en: 'Clickable Steps' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: false,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Allow users to click on steps'
      },
      propertyHelp: 'Enable clicking on steps to trigger events and change the active step'
      /* wwEditor:end */
    },

    requireConfirmation: {
      label: { en: 'Require Confirmation' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: false,
      bindable: true,
      hidden: content => !content?.clickable,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Show confirmation dialog before changing steps'
      },
      propertyHelp: 'When enabled, users must confirm before navigating to a different step'
      /* wwEditor:end */
    },

    confirmationTitle: {
      label: { en: 'Confirmation Title' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Change Step?',
      bindable: true,
      hidden: content => !content?.clickable || !content?.requireConfirmation,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Title text for confirmation dialog'
      },
      /* wwEditor:end */
    },

    confirmationMessage: {
      label: { en: 'Confirmation Message' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Are you sure you want to change to this step?',
      bindable: true,
      hidden: content => !content?.clickable || !content?.requireConfirmation,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Message text for confirmation dialog'
      },
      /* wwEditor:end */
    },

    confirmButtonText: {
      label: { en: 'Confirm Button Text' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Confirm',
      bindable: true,
      hidden: content => !content?.clickable || !content?.requireConfirmation,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text for confirm button'
      },
      /* wwEditor:end */
    },

    cancelButtonText: {
      label: { en: 'Cancel Button Text' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Cancel',
      bindable: true,
      hidden: content => !content?.clickable || !content?.requireConfirmation,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text for cancel button'
      },
      /* wwEditor:end */
    },

    // ========== LAYOUT SECTION ==========
    orientation: {
      label: { en: 'Orientation' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: 'horizontal', label: 'Horizontal' },
          { value: 'vertical', label: 'Vertical' },
        ],
      },
      defaultValue: 'horizontal',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Valid values: horizontal | vertical'
      },
      /* wwEditor:end */
    },

    stepSpacing: {
      label: { en: 'Step Spacing' },
      type: 'Length',
      section: 'settings',
      defaultValue: '24px',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Space between steps (e.g., 24px, 2rem)'
      },
      /* wwEditor:end */
    },

    // ========== COLORS SECTION ==========
    completedColor: {
      label: { en: 'Completed Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#10b981',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color for completed steps'
      },
      /* wwEditor:end */
    },

    currentColor: {
      label: { en: 'Current Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#3b82f6',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color for the current active step'
      },
      /* wwEditor:end */
    },

    upcomingColor: {
      label: { en: 'Upcoming Border Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#9ca3af',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Border color for upcoming steps'
      },
      /* wwEditor:end */
    },

    upcomingBackgroundColor: {
      label: { en: 'Upcoming Background Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#ffffff',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Background color for upcoming step circles'
      },
      /* wwEditor:end */
    },

    lineColor: {
      label: { en: 'Line Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#e5e7eb',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color for connecting lines between steps'
      },
      /* wwEditor:end */
    },

    completedLineColor: {
      label: { en: 'Completed Line Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#10b981',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color for lines connecting completed steps'
      },
      /* wwEditor:end */
    },

    // ========== TEXT COLORS ==========
    completedTextColor: {
      label: { en: 'Completed Text Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#374151',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text color for completed step labels'
      },
      /* wwEditor:end */
    },

    currentTextColor: {
      label: { en: 'Current Text Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#1f2937',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text color for current step label'
      },
      /* wwEditor:end */
    },

    upcomingTextColor: {
      label: { en: 'Upcoming Text Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#9ca3af',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text color for upcoming step labels'
      },
      /* wwEditor:end */
    },

    completedDescColor: {
      label: { en: 'Completed Description Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#6b7280',
      bindable: true,
      hidden: content => !content?.showDescriptions,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Description text color for completed steps'
      },
      /* wwEditor:end */
    },

    currentDescColor: {
      label: { en: 'Current Description Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#4b5563',
      bindable: true,
      hidden: content => !content?.showDescriptions,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Description text color for current step'
      },
      /* wwEditor:end */
    },

    upcomingDescColor: {
      label: { en: 'Upcoming Description Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#d1d5db',
      bindable: true,
      hidden: content => !content?.showDescriptions,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Description text color for upcoming steps'
      },
      /* wwEditor:end */
    },

    // ========== TYPOGRAPHY ==========
    fontFamily: {
      label: { en: 'Font Family' },
      type: 'Text',
      section: 'style',
      defaultValue: 'Inter, system-ui, -apple-system, sans-serif',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'CSS font family'
      },
      propertyHelp: 'Set the font family for all text (e.g., "Inter, sans-serif")'
      /* wwEditor:end */
    },
  },

  triggerEvents: [
    {
      name: 'step-click',
      label: { en: 'On step click' },
      event: {
        step: {},
        index: 0,
        id: '',
        label: '',
        status: '',
      },
      /* wwEditor:start */
      default: true,
      /* wwEditor:end */
    },
    {
      name: 'step-change',
      label: { en: 'On step change' },
      event: {
        newStepId: '',
        oldStepId: '',
      },
    },
  ],
};
