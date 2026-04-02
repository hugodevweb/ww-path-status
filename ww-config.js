export default {
  editor: {
    label: {
      en: "Status Steps",
    },
    icon: "view-list",
  },
  properties: {
    // ========== CONTENT SECTION ==========
    statuses: {
      label: { en: 'Statuses' },
      type: 'Array',
      section: 'settings',
      bindable: true,
      defaultValue: [
        { value: 'clerk', label: 'Clerc', sort_index: 0, parent: null },
        { value: 'clerk_to_start', label: 'À lancer', sort_index: 1, parent: 'clerk' },
        { value: 'clerk_compromis_signed', label: 'Compromis signé', sort_index: 2, parent: 'clerk' },
        { value: 'formalities', label: 'Formalités', sort_index: 4, parent: null },
        { value: 'formalities_to_visa', label: 'À viser', sort_index: 5, parent: 'formalities' },
        { value: 'formalities_validated', label: 'Validé', sort_index: 6, parent: 'formalities' },
        { value: 'accounting', label: 'Comptabilité', sort_index: 8, parent: null },
        { value: 'accounting_to_settle', label: 'À solder', sort_index: 9, parent: 'accounting' },
        { value: 'done', label: 'Clôturé', sort_index: 10, parent: 'accounting', isSuccess: true },
      ],
      options: {
        expandable: true,
        getItemLabel(item) {
          return item.label || item.value || 'Status';
        },
        item: {
          type: 'Object',
          defaultValue: {
            value: 'new_status',
            label: 'New Status',
            sort_index: 0,
            parent: null,
          },
          options: {
            item: {
              value: {
                label: { en: 'Value' },
                type: 'Text',
                bindable: true,
              },
              label: {
                label: { en: 'Label' },
                type: 'Text',
                bindable: true,
              },
              sort_index: {
                label: { en: 'Sort Index' },
                type: 'Number',
                bindable: true,
              },
              parent: {
                label: { en: 'Parent' },
                type: 'Text',
                bindable: true,
              },
              isSuccess: {
                label: { en: 'Is Success' },
                type: 'OnOff',
                bindable: true,
                defaultValue: false,
              },
            },
          },
        },
      },
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'Array of status objects with value, label, sort_index, parent, and isSuccess'
      },
      /* wwEditor:end */
    },

    // Formula properties for dynamic field mapping
    statusesValueFormula: {
      label: { en: 'Value Field' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.statuses) && content.statuses.length > 0 ? content.statuses[0] : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['value']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.statuses) || !content.statuses?.length || !boundProps.statuses,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Field to use as status value identifier'
      },
      /* wwEditor:end */
    },

    statusesLabelFormula: {
      label: { en: 'Label Field' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.statuses) && content.statuses.length > 0 ? content.statuses[0] : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['label']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.statuses) || !content.statuses?.length || !boundProps.statuses,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Field to use as status label'
      },
      /* wwEditor:end */
    },

    statusesSortIndexFormula: {
      label: { en: 'Sort Index Field' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.statuses) && content.statuses.length > 0 ? content.statuses[0] : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['sort_index']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.statuses) || !content.statuses?.length || !boundProps.statuses,
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'Field to use as sort index for ordering'
      },
      /* wwEditor:end */
    },

    statusesParentFormula: {
      label: { en: 'Parent Field' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.statuses) && content.statuses.length > 0 ? content.statuses[0] : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['parent']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.statuses) || !content.statuses?.length || !boundProps.statuses,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Field to use as parent reference (null for top-level groups)'
      },
      /* wwEditor:end */
    },

    statusesIsSuccessFormula: {
      label: { en: 'Is Success Field' },
      type: 'Formula',
      section: 'settings',
      options: content => ({
        template: Array.isArray(content.statuses) && content.statuses.length > 0 ? content.statuses[0] : null,
      }),
      defaultValue: {
        type: 'f',
        code: "context.mapping?.['isSuccess']",
      },
      hidden: (content, sidepanelContent, boundProps) =>
        !Array.isArray(content.statuses) || !content.statuses?.length || !boundProps.statuses,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Field to determine if step triggers confetti'
      },
      /* wwEditor:end */
    },

    currentStatus: {
      label: { en: 'Current Status' },
      type: 'Text',
      section: 'settings',
      bindable: true,
      defaultValue: 'clerk_compromis_signed',
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'The value of the currently active status'
      },
      propertyHelp: 'Set the current status by matching this value with status values. Statuses before will be done, statuses after will be pending.'
      /* wwEditor:end */
    },

    subStepsLabel: {
      label: { en: 'Sub-Steps Suffix' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'étapes',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Text shown after the sub-step count (e.g. "étapes", "steps")'
      },
      /* wwEditor:end */
    },

    doneLabel: {
      label: { en: 'Done Badge Label' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Terminé',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Badge text shown on completed parent groups'
      },
      /* wwEditor:end */
    },

    activeLabel: {
      label: { en: 'Active Badge Label' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'En cours',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Badge text shown on the current active parent group'
      },
      /* wwEditor:end */
    },

    enableParentStatus: {
      label: { en: 'Show Sub-Steps' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'When enabled, clicking a group reveals its sub-steps. When disabled, only parent groups are shown.'
      },
      propertyHelp: 'Toggle between grouped mode (with expandable sub-steps) and flat mode (parent circles only)'
      /* wwEditor:end */
    },

    showDescriptions: {
      label: { en: 'Show Labels' },
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'boolean',
        tooltip: 'Show/hide step labels'
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
      propertyHelp: 'Enable clicking on steps to trigger events and change the active status'
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
        tooltip: 'Show confirmation dialog before changing status'
      },
      propertyHelp: 'When enabled, users must confirm before navigating to a different status'
      /* wwEditor:end */
    },

    confirmationTitle: {
      label: { en: 'Confirmation Title' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'Change Status?',
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
      defaultValue: 'Are you sure you want to change to this status?',
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

    stepSize: {
      label: { en: 'Step Size' },
      type: 'Number',
      section: 'settings',
      min: 24,
      max: 80,
      step: 2,
      defaultValue: 40,
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'Size of the step indicator circle in pixels (24-80px)'
      },
      propertyHelp: 'Controls the size of step indicator circles and their font size proportionally'
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
        tooltip: 'Fallback color for completed steps (used when step has no color)'
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
        tooltip: 'Fallback color for the current active step'
      },
      /* wwEditor:end */
    },

    upcomingColor: {
      label: { en: 'Upcoming Border Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#d1d5db',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Border color for upcoming/pending steps'
      },
      /* wwEditor:end */
    },

    upcomingBackgroundColor: {
      label: { en: 'Upcoming Background Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#f3f4f6',
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
        tooltip: 'Fallback color for lines connecting completed steps'
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

    // ========== TYPOGRAPHY ==========
    fontFamily: {
      label: { en: 'Font Family' },
      type: 'Text',
      section: 'style',
      defaultValue: 'Work Sans, system-ui, -apple-system, sans-serif',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'CSS font family'
      },
      propertyHelp: 'Set the font family for all text (e.g., "Work Sans, sans-serif")'
      /* wwEditor:end */
    },
  },

  triggerEvents: [
    {
      name: 'status-click',
      label: { en: 'On status click' },
      event: {
        status: {},
        value: '',
        label: '',
        derivedStatus: '',
        isParent: false,
      },
      /* wwEditor:start */
      default: true,
      /* wwEditor:end */
    },
    {
      name: 'status-change',
      label: { en: 'On status change' },
      event: {
        newStatusValue: '',
        oldStatusValue: '',
      },
    },
    {
      name: 'group-expand',
      label: { en: 'On group expand' },
      event: {
        groupValue: '',
        groupLabel: '',
      },
    },
  ],
};
