<template>
  <div class="status-steps" :style="componentStyle" :class="{ vertical: isVertical }">
    <div class="steps-container" :class="{ vertical: isVertical }">
      <div
        v-for="(step, index) in processedSteps"
        :key="step.id"
        class="step-wrapper"
        :class="{ clickable: content?.clickable }"
        @click="handleStepClick(step, index)"
      >
        <!-- Step Circle Indicator -->
        <div class="step-indicator-wrapper">
          <div
            class="step-indicator"
            :class="step.status"
            :style="getStepIndicatorStyle(step.status)"
          >
            <span v-if="step.status === 'completed'" class="check-icon">✓</span>
            <span v-else-if="step.status === 'current'" class="step-number">{{ index + 1 }}</span>
            <span v-else class="step-number">{{ index + 1 }}</span>
          </div>
        </div>

        <!-- Step Content -->
        <div class="step-content">
          <div class="step-label" :style="getStepLabelStyle(step.status)">
            {{ step.label }}
          </div>
          <div
            v-if="content?.showDescriptions && step.description"
            class="step-description"
            :style="getStepDescriptionStyle(step.status)"
          >
            {{ step.description }}
          </div>
        </div>

        <!-- Connecting Line (between wrappers) -->
        <div
          v-if="index < processedSteps.length - 1"
          class="step-line"
          :class="[step.status, { vertical: isVertical }]"
          :style="getStepLineStyle(step.status)"
        ></div>
      </div>
    </div>

    <!-- Inline Confirmation Panel -->
    <div v-if="showConfirmation && pendingStep" class="confirmation-panel">
      <div class="confirmation-content">
        <div class="confirmation-info">
          <div class="confirmation-icon">
            <span>{{ processedSteps.findIndex(s => s.id === pendingStep.id) + 1 }}</span>
          </div>
          <div class="confirmation-text">
            <div class="confirmation-title">{{ content?.confirmationTitle || 'Change Step?' }}</div>
            <div class="confirmation-message">{{ content?.confirmationMessage || 'Are you sure you want to change to this step?' }}</div>
            <div class="confirmation-step-name">→ {{ pendingStep.label }}</div>
          </div>
        </div>
        <div class="confirmation-actions">
          <button class="confirmation-btn cancel-btn" @click="cancelStepChange">
            {{ content?.cancelButtonText || 'Cancel' }}
          </button>
          <button class="confirmation-btn confirm-btn" @click="confirmStepChange">
            {{ content?.confirmButtonText || 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    uid: { type: String, required: true },
    content: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    const { computed, watch } = window.Vue;

    /* wwEditor:start */
    const isEditing = computed(() => props.wwEditorState?.isEditing);
    /* wwEditor:end */

    // Internal variable for active step ID
    const { value: activeStepId, setValue: setActiveStepId } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'activeStepId',
      type: 'string',
      defaultValue: '',
    });

    // Confirmation dialog state
    const { ref } = window.Vue;
    const showConfirmation = ref(false);
    const pendingStep = ref(null);
    const pendingStepIndex = ref(null);

    // Check if orientation is vertical
    const isVertical = computed(() => props.content?.orientation === 'vertical');

    // Process steps array with formula mapping
    const processedSteps = computed(() => {
      const steps = props.content?.steps || [];
      const { resolveMappingFormula } = wwLib.wwFormula.useFormula();
      const currentValue = props.content?.initValue ?? activeStepId.value ?? '';

      // Find the index of the current step based on initValue
      let currentStepIndex = -1;

      const processedItems = steps.map((step, index) => {
        // Use formula mapping for dynamic field resolution
        const id = resolveMappingFormula(props.content?.stepsIdFormula, step) ?? step.id;
        const label = resolveMappingFormula(props.content?.stepsLabelFormula, step) ?? step.label;
        const description = resolveMappingFormula(props.content?.stepsDescriptionFormula, step) ?? step.description;

        const finalId = id || `step-${index}`;
        
        // Check if this step matches the current value
        if (String(finalId) === String(currentValue)) {
          currentStepIndex = index;
        }

        return {
          id: finalId,
          label: label || `Step ${index + 1}`,
          description: description || '',
          status: 'upcoming', // Will be set below
          originalItem: step,
          ...step,
        };
      });

      // If no match found, default to first step
      if (currentStepIndex === -1 && processedItems.length > 0) {
        currentStepIndex = 0;
      }

      // Set status based on current step index
      return processedItems.map((step, index) => {
        let status;
        if (index < currentStepIndex) {
          status = 'completed';
        } else if (index === currentStepIndex) {
          status = 'current';
        } else {
          status = 'upcoming';
        }

      return {
          ...step,
          status,
        };
      });
    });

    // Watch for initValue changes and update internal variable
    watch(
      () => props.content?.initValue,
      (newValue) => {
        if (newValue !== undefined && newValue !== activeStepId.value) {
          setActiveStepId(newValue);
        }
      },
      { immediate: true }
    );

    // Component style
    const componentStyle = computed(() => ({
      '--completed-color': props.content?.completedColor || '#10b981',
      '--current-color': props.content?.currentColor || '#3b82f6',
      '--upcoming-color': props.content?.upcomingColor || '#9ca3af',
      '--line-color': props.content?.lineColor || '#e5e7eb',
      '--completed-line-color': props.content?.completedLineColor || props.content?.completedColor || '#10b981',
      '--step-spacing': props.content?.stepSpacing || '24px',
      '--font-family': props.content?.fontFamily || 'Inter, system-ui, -apple-system, sans-serif',
    }));

    // Get step indicator style based on status
    const getStepIndicatorStyle = (status) => {
      const baseStyle = {};
      
      if (status === 'completed') {
        baseStyle.backgroundColor = props.content?.completedColor || '#10b981';
        baseStyle.borderColor = props.content?.completedColor || '#10b981';
        baseStyle.color = '#ffffff';
      } else if (status === 'current') {
        baseStyle.backgroundColor = props.content?.currentColor || '#3b82f6';
        baseStyle.borderColor = props.content?.currentColor || '#3b82f6';
        baseStyle.color = '#ffffff';
      } else {
        baseStyle.backgroundColor = props.content?.upcomingBackgroundColor || '#ffffff';
        baseStyle.borderColor = props.content?.upcomingColor || '#9ca3af';
        baseStyle.color = props.content?.upcomingColor || '#9ca3af';
      }
      
      return baseStyle;
    };

    // Get step line style based on status
    const getStepLineStyle = (status) => {
      const baseStyle = {};
      
      if (status === 'completed') {
        baseStyle.backgroundColor = props.content?.completedLineColor || props.content?.completedColor || '#10b981';
      } else {
        baseStyle.backgroundColor = props.content?.lineColor || '#e5e7eb';
      }
      
      return baseStyle;
    };

    // Get step label style based on status
    const getStepLabelStyle = (status) => {
      const baseStyle = {
        fontFamily: props.content?.fontFamily || 'Inter, system-ui, -apple-system, sans-serif',
      };
      
      if (status === 'completed') {
        baseStyle.color = props.content?.completedTextColor || '#374151';
        baseStyle.fontWeight = '500';
      } else if (status === 'current') {
        baseStyle.color = props.content?.currentTextColor || '#1f2937';
        baseStyle.fontWeight = '600';
      } else {
        baseStyle.color = props.content?.upcomingTextColor || '#9ca3af';
        baseStyle.fontWeight = '500';
      }
      
      return baseStyle;
    };

    // Get step description style based on status
    const getStepDescriptionStyle = (status) => {
      const baseStyle = {
        fontFamily: props.content?.fontFamily || 'Inter, system-ui, -apple-system, sans-serif',
      };
      
      if (status === 'completed') {
        baseStyle.color = props.content?.completedDescColor || '#6b7280';
      } else if (status === 'current') {
        baseStyle.color = props.content?.currentDescColor || '#4b5563';
      } else {
        baseStyle.color = props.content?.upcomingDescColor || '#d1d5db';
      }
      
      return baseStyle;
    };

    // Handle step click
    const handleStepClick = (step, index) => {
      if (!props.content?.clickable) return;

      // Check if confirmation is required
      if (props.content?.requireConfirmation) {
        pendingStep.value = step;
        pendingStepIndex.value = index;
        showConfirmation.value = true;
        return;
      }

      // Proceed with step change
      performStepChange(step, index);
    };

    // Perform the actual step change
    const performStepChange = (step, index) => {
      // Update internal variable with step ID
      setActiveStepId(step.id);

      // Emit trigger event
      emit('trigger-event', {
        name: 'step-click',
        event: {
          step: step,
          index: index,
          id: step.id,
          label: step.label,
          status: step.status,
        },
      });
    };

    // Confirm step change
    const confirmStepChange = () => {
      if (pendingStep.value && pendingStepIndex.value !== null) {
        performStepChange(pendingStep.value, pendingStepIndex.value);
      }
      closeConfirmation();
    };

    // Cancel step change
    const cancelStepChange = () => {
      closeConfirmation();
    };

    // Close confirmation dialog
    const closeConfirmation = () => {
      showConfirmation.value = false;
      pendingStep.value = null;
      pendingStepIndex.value = null;
    };

    // Watch for active step ID changes and emit event
    watch(
      activeStepId,
      (newValue, oldValue) => {
        if (newValue !== oldValue && oldValue !== undefined && oldValue !== '') {
          emit('trigger-event', {
            name: 'step-change',
            event: {
              newStepId: newValue,
              oldStepId: oldValue,
            },
          });
        }
      }
    );

    return {
      processedSteps,
      isVertical,
      componentStyle,
      getStepIndicatorStyle,
      getStepLineStyle,
      getStepLabelStyle,
      getStepDescriptionStyle,
      handleStepClick,
      showConfirmation,
      pendingStep,
      confirmStepChange,
      cancelStepChange,
      /* wwEditor:start */
      isEditing,
      /* wwEditor:end */
    };
  },
};
</script>

<style lang="scss" scoped>
.status-steps {
  width: 100%;
  height: 100%;
  font-family: var(--font-family);
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.steps-container {
  display: flex;
  align-items: flex-start;
  gap: var(--step-spacing);
  width: 100%;
  
  &.vertical {
    flex-direction: column;
    gap: 0;
  }
}

.step-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 0;
  
  &.clickable {
    cursor: pointer;
    transition: transform 0.2s ease;
    
    &:hover .step-indicator {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
  
  .vertical & {
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
    padding-bottom: 32px;
    
    &:last-child {
      padding-bottom: 0;
    }
  }
}

.step-indicator-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 12px;
  z-index: 2;
  
  .vertical & {
    margin-bottom: 0;
    margin-right: 16px;
  }
}

.step-indicator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  z-index: 2;
  background-color: #ffffff;
  
  &.completed {
    box-shadow: 0 2px 12px rgba(16, 185, 129, 0.3);
    animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    
    .check-icon {
      animation: checkFadeIn 0.6s ease-in-out;
    }
  }
  
  &.current {
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
    animation: pulse 2s ease-in-out infinite, popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    
    .step-number {
      animation: numberPulse 0.5s ease-in-out;
    }
  }
  
  &.upcoming {
    animation: fadeToUpcoming 0.4s ease-in-out;
  }
  
  .check-icon {
    font-size: 20px;
    font-weight: bold;
  }
  
  .step-number {
    font-size: 16px;
  }
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.6);
  }
}

@keyframes scaleIn {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes popIn {
  0% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes checkFadeIn {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-45deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.2) rotate(0deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes numberPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes fadeToUpcoming {
  0% {
    opacity: 0.5;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes lineFillIn {
  0% {
    opacity: 0;
    transform: translateY(-50%) scaleX(0);
    transform-origin: left center;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: translateY(-50%) scaleX(1);
    transform-origin: left center;
  }
}

@keyframes lineFillInVertical {
  0% {
    opacity: 0;
    transform: translateX(-50%) scaleY(0);
    transform-origin: center top;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) scaleY(1);
    transform-origin: center top;
  }
}

.step-line {
  position: absolute;
  background-color: var(--line-color);
  transition: background-color 0.6s cubic-bezier(0.4, 0, 0.2, 1), 
              width 0.4s ease-in-out,
              transform 0.4s ease-in-out;
  z-index: 1;
  
  // Horizontal layout - line connects from right of this step to left of next step
  top: 20px; // Half of indicator height (40px / 2)
  left: calc(50% + 20px); // Start from right edge of indicator (center + radius)
  width: calc(50% + var(--step-spacing) + 50% - 40px); // Extend to left edge of next indicator
  height: 2px;
  transform: translateY(-50%);
  
  &.completed {
    background-color: var(--completed-line-color);
    animation: lineFillIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  // Vertical layout
  &.vertical {
    top: calc(40px + 8px); // Below the indicator
    bottom: -32px; // Extend to next step
    left: 20px; // Center under indicator
    right: auto;
    width: 2px;
    height: auto;
    transform: translateX(-50%);
    
    &.completed {
      animation: lineFillInVertical 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
}

.step-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  
  .vertical & {
    align-items: flex-start;
    text-align: left;
  }
}

.step-label {
  font-size: 14px;
  line-height: 1.4;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  word-wrap: break-word;
  max-width: 100%;
}

.step-description {
  font-size: 12px;
  line-height: 1.5;
  margin-top: 4px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  word-wrap: break-word;
  max-width: 100%;
}

// Responsive design
@media (max-width: 768px) {
  .status-steps {
    padding: 12px;
  }
  
  .steps-container:not(.vertical) {
    gap: 12px;
  }
  
  .step-indicator {
    width: 36px;
    height: 36px;
    font-size: 14px;
    
    .check-icon {
    font-size: 18px;
    }
  }
  
  .step-label {
    font-size: 13px;
  }
  
  .step-description {
    font-size: 11px;
  }
  
  .step-line {
    // Adjust line position for smaller indicators
    top: 18px; // Half of 36px
    left: calc(50% + 18px);
    width: calc(50% + var(--step-spacing) + 50% - 36px);
    
    &.vertical {
      top: calc(36px + 8px);
      left: 18px;
    }
  }
}

@media (max-width: 480px) {
  .steps-container:not(.vertical) {
    flex-direction: column;
    align-items: center;
    
    .step-wrapper {
      width: 100%;
      max-width: 320px;
      margin-bottom: 16px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    .step-line {
      top: auto;
      left: 18px; // Half of 36px indicator on mobile
      right: auto;
      bottom: -20px;
      width: 2px;
      height: 16px;
      transform: translateX(-50%);
      
      &:not(.vertical) {
        // Keep width calculation for horizontal that becomes vertical on mobile
        width: 2px;
      }
    }
    
    .step-content {
      width: 100%;
    }
  }
}

// Inline Confirmation Panel Styles
.confirmation-panel {
  width: 100%;
  margin-top: 20px;
  animation: slideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.confirmation-content {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px solid var(--current-color);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
}

.confirmation-info {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.confirmation-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--current-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.confirmation-text {
  flex: 1;
}

.confirmation-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
  font-family: var(--font-family);
}

.confirmation-message {
  font-size: 14px;
  line-height: 1.5;
  color: #64748b;
  margin-bottom: 8px;
  font-family: var(--font-family);
}

.confirmation-step-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--current-color);
  font-family: var(--font-family);
  padding: 6px 12px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 6px;
  display: inline-block;
}

.confirmation-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.confirmation-btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-family);
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
  
  &:active {
    transform: scale(0.96);
  }
}

.cancel-btn {
  background: white;
  color: #64748b;
  border: 2px solid #e2e8f0;
  
  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #475569;
  }
}

.confirm-btn {
  background: var(--current-color);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  
  &:hover {
    background: var(--current-color);
    opacity: 0.9;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 200px;
  }
}

// Responsive confirmation panel
@media (max-width: 480px) {
  .confirmation-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .confirmation-actions {
    flex-direction: column;
    
    .confirmation-btn {
      width: 100%;
    }
  }
}
</style>

