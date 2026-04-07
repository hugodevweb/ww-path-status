<template>
  <div class="status-stepper" :style="componentStyle" :class="{ vertical: isVertical }">
    <!-- Confirmation Panel (flat mode only — no sub-steps) -->
    <div v-if="showConfirmation && pendingStatus && content?.enableParentStatus === false" class="confirmation-panel">
      <div class="confirmation-content">
        <div class="confirmation-text">
          <span class="confirmation-title">{{ content?.confirmationTitle || 'Change Status?' }}</span>
          <span class="confirmation-message">{{ content?.confirmationMessage || 'Are you sure you want to change to this status?' }}</span>
          <span class="confirmation-step-name">→ {{ pendingStatus.label }}</span>
        </div>
        <div class="confirmation-actions">
          <button class="confirmation-btn cancel-btn" @click="cancelStatusChange">
            {{ content?.cancelButtonText || 'Cancel' }}
          </button>
          <button class="confirmation-btn confirm-btn" @click="confirmStatusChange">
            {{ content?.confirmButtonText || 'Confirm' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <template v-else>
      <!-- ===== GROUPED MODE (enableParentStatus = true) ===== -->
      <template v-if="content?.enableParentStatus !== false">
        <!-- Top-level groups row -->
        <div class="groups-row" :class="{ vertical: isVertical }">
          <div
            v-for="(group, gIndex) in parentGroups"
            :key="group.value"
            class="group-wrapper"
            :class="{ clickable: true, active: expandedGroupValue === group.value }"
            @click="handleGroupClick(group, gIndex)"
          >
            <div class="step-indicator-wrapper">
              <div
                class="step-indicator"
                :class="group.derivedStatus"
                :style="getIndicatorStyle(group)"
                :ref="el => { if (el) groupIndicators[gIndex] = el }"
              >
                <svg v-if="group.derivedStatus === 'done'" class="check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span v-else class="step-number">{{ gIndex + 1 }}</span>
              </div>
            </div>
            <div v-if="content?.showDescriptions !== false" class="step-content">
              <div class="step-label" :style="getLabelStyle(group)">
                {{ group.label }}
              </div>
              <div v-if="group.children.length > 0" class="step-sub-count">
                {{ group.children.length }} {{ content?.subStepsLabel || 'étapes' }}
              </div>
              <div v-if="group.derivedStatus !== 'pending'" class="step-status-badge" :class="[group.derivedStatus, { state: group.sort_index == null }]">
                {{ group.derivedStatus === 'done' ? (content?.doneLabel || 'Terminé') : (content?.activeLabel || 'En cours') }}
              </div>
            </div>
            <!-- Connector line to next group -->
            <div
              v-if="gIndex < parentGroups.length - 1"
              class="step-line"
              :class="[group.derivedStatus, { vertical: isVertical }]"
              :style="getLineStyle(group)"
            ></div>
          </div>
        </div>

        <!-- Panel area: confirmation (inside panel) OR sub-steps, both share the same transition -->
        <transition name="panel-slide" mode="out-in">
          <!-- Confirmation shown inside the panel when active in grouped mode -->
          <div v-if="showConfirmation && pendingStatus" key="confirmation" class="substeps-panel">
            <div class="confirmation-content">
              <div class="confirmation-text">
                <span class="confirmation-title">{{ content?.confirmationTitle || 'Change Status?' }}</span>
                <span class="confirmation-message">{{ content?.confirmationMessage || 'Are you sure you want to change to this status?' }}</span>
                <span class="confirmation-step-name">→ {{ pendingStatus.label }}</span>
              </div>
              <div class="confirmation-actions">
                <button class="confirmation-btn cancel-btn" @click="cancelStatusChange">
                  {{ content?.cancelButtonText || 'Cancel' }}
                </button>
                <button class="confirmation-btn confirm-btn" @click="confirmStatusChange">
                  {{ content?.confirmButtonText || 'Confirm' }}
                </button>
              </div>
            </div>
          </div>
          <!-- Normal sub-steps panel -->
          <div
            v-else-if="expandedGroupData && expandedGroupData.children.length > 0"
            :key="expandedGroupData.value"
            class="substeps-panel"
            :class="{ vertical: isVertical }"
          >
            <div class="substeps-panel-header">
              {{ expandedGroupData.label }}
            </div>
            <div class="substeps-row" :class="{ vertical: isVertical }">
              <div
                v-for="(child, cIndex) in expandedGroupData.children"
                :key="child.value"
                class="substep-wrapper"
                :class="{ clickable: content?.clickable }"
                @click="handleSubstepClick(child, cIndex)"
              >
                <div class="step-indicator-wrapper">
                  <div
                    class="step-indicator substep-size"
                    :class="child.derivedStatus"
                    :style="getIndicatorStyle(child)"
                    :ref="el => { if (el) substepIndicators[cIndex] = el }"
                  >
                    <svg v-if="child.derivedStatus === 'done'" class="check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    <span v-else class="step-number">{{ cIndex + 1 }}</span>
                  </div>
                </div>
                <div v-if="content?.showDescriptions !== false" class="step-content">
                  <div class="step-label substep-label-size" :style="getLabelStyle(child)">
                    {{ child.label }}
                  </div>
                </div>
                <!-- Sub-step connector line -->
                <div
                  v-if="cIndex < expandedGroupData.children.length - 1"
                  class="step-line substep-line"
                  :class="[child.derivedStatus, { vertical: isVertical }]"
                  :style="getLineStyle(child)"
                ></div>
              </div>
            </div>
          </div>
        </transition>
      </template>

      <!-- ===== FLAT MODE (enableParentStatus = false) ===== -->
      <template v-else>
        <div class="groups-row" :class="{ vertical: isVertical }">
          <div
            v-for="(group, gIndex) in parentGroups"
            :key="group.value"
            class="group-wrapper"
            :class="{ clickable: content?.clickable }"
            @click="handleFlatGroupClick(group, gIndex)"
          >
            <div class="step-indicator-wrapper">
              <div
                class="step-indicator"
                :class="group.derivedStatus"
                :style="getIndicatorStyle(group)"
                :ref="el => { if (el) groupIndicators[gIndex] = el }"
              >
                <svg v-if="group.derivedStatus === 'done'" class="check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span v-else class="step-number">{{ gIndex + 1 }}</span>
              </div>
            </div>
            <div v-if="content?.showDescriptions !== false" class="step-content">
              <div class="step-label" :style="getLabelStyle(group)">
                {{ group.label }}
              </div>
            </div>
            <!-- Connector line -->
            <div
              v-if="gIndex < parentGroups.length - 1"
              class="step-line"
              :class="[group.derivedStatus, { vertical: isVertical }]"
              :style="getLineStyle(group)"
            ></div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import confetti from 'canvas-confetti';
import { computed, watch, ref } from 'vue';

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

    /* wwEditor:start */
    const isEditing = computed(() => props.wwEditorState?.isEditing);
    /* wwEditor:end */

    // ========== INTERNAL VARIABLES ==========
    const { value: activeStatusValue, setValue: setActiveStatusValue } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'activeStatus',
      type: 'string',
      defaultValue: '',
    });

    const { value: expandedGroupVar, setValue: setExpandedGroupVar } = wwLib.wwVariable.useComponentVariable({
      uid: props.uid,
      name: 'expandedGroup',
      type: 'string',
      defaultValue: '',
    });

    // ========== LOCAL STATE ==========
    const showConfirmation = ref(false);
    const pendingStatus = ref(null);
    const expandedGroupValue = ref(null);
    const groupIndicators = ref([]);
    const substepIndicators = ref([]);

    // ========== HELPERS ==========
    const hexToRgba = (hex, alpha) => {
      if (!hex) return `rgba(0,0,0,${alpha})`;
      const h = hex.replace('#', '');
      const r = parseInt(h.substring(0, 2), 16);
      const g = parseInt(h.substring(2, 4), 16);
      const b = parseInt(h.substring(4, 6), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    };

    const isVertical = computed(() => props.content?.orientation === 'vertical');

    // ========== COMPUTED PIPELINE ==========

    // 1. Resolve all statuses with formula mapping
    const resolvedStatuses = computed(() => {
      const statuses = props.content?.statuses || [];
      const { resolveMappingFormula } = wwLib.wwFormula.useFormula();

      return statuses.map((item, index) => {
        const value = resolveMappingFormula(props.content?.statusesValueFormula, item) ?? item.value;
        const label = resolveMappingFormula(props.content?.statusesLabelFormula, item) ?? item.label;
        const sortIndex = resolveMappingFormula(props.content?.statusesSortIndexFormula, item) ?? item.sort_index;
        const parent = resolveMappingFormula(props.content?.statusesParentFormula, item) ?? item.parent;
        const isSuccess = resolveMappingFormula(props.content?.statusesIsSuccessFormula, item) ?? item.isSuccess;

        return {
          value: value || `status-${index}`,
          label: label || `Status ${index + 1}`,
          sort_index: sortIndex != null ? Number(sortIndex) : null,
          parent: parent || null,
          isSuccess: Boolean(isSuccess),
          originalItem: item,
        };
      });
    });

    // 2. Find the active status item
    const currentStatusValue = computed(() => {
      return props.content?.currentStatus ?? activeStatusValue.value ?? '';
    });

    const activeStatusItem = computed(() => {
      return resolvedStatuses.value.find(s => String(s.value) === String(currentStatusValue.value)) || null;
    });

    const activeSortIndex = computed(() => {
      return activeStatusItem.value?.sort_index ?? -1;
    });

    // 3. Build parent groups with children and derived statuses
    const parentGroups = computed(() => {
      const all = resolvedStatuses.value;

      // Separate top-level parents from children
      const parents = all.filter(s => !s.parent);
      const children = all.filter(s => s.parent);

      // Sort parents: those with a sort_index first, then those without (state-like) at the end
      const stepParents = parents.filter(p => p.sort_index != null)
        .sort((a, b) => a.sort_index - b.sort_index);
      const stateParents = parents.filter(p => p.sort_index == null);
      const sortedParents = [...stepParents, ...stateParents];

      return sortedParents.map(parent => {
        // Get children for this parent, sorted
        const parentChildren = children
          .filter(c => String(c.parent) === String(parent.value))
          .sort((a, b) => {
            if (a.sort_index != null && b.sort_index != null) return a.sort_index - b.sort_index;
            if (a.sort_index != null) return -1;
            if (b.sort_index != null) return 1;
            return 0;
          });

        // Derive status for each child
        const derivedChildren = parentChildren.map(child => ({
          ...child,
          derivedStatus: deriveStatus(child),
        }));

        // Derive parent status
        const parentDerivedStatus = deriveParentStatus(parent, derivedChildren);

        return {
          ...parent,
          derivedStatus: parentDerivedStatus,
          children: derivedChildren,
        };
      });
    });

    // Derive status for a single item based on sort_index comparison
    const deriveStatus = (item) => {
      const currentValue = currentStatusValue.value;

      // Direct match = active
      if (String(item.value) === String(currentValue)) return 'active';

      // State items (null sort_index): only active or pending
      if (item.sort_index == null) return 'pending';

      // Step items: compare sort_index
      if (activeSortIndex.value == null || activeSortIndex.value === -1) return 'pending';
      if (item.sort_index < activeSortIndex.value) return 'done';
      if (item.sort_index > activeSortIndex.value) return 'pending';
      return 'active';
    };

    // Derive parent group status from its children
    const deriveParentStatus = (parent, derivedChildren) => {
      const currentValue = currentStatusValue.value;

      // If the parent itself is the currentStatus
      if (String(parent.value) === String(currentValue)) return 'active';

      // If any child is active, parent is active
      if (derivedChildren.some(c => c.derivedStatus === 'active')) return 'active';

      // State parents (null sort_index): only active or pending
      if (parent.sort_index == null) return 'pending';

      // If all children are done, parent is done
      if (derivedChildren.length > 0 && derivedChildren.every(c => c.derivedStatus === 'done')) return 'done';

      // Check parent's own sort_index
      if (activeSortIndex.value == null || activeSortIndex.value === -1) return 'pending';
      if (parent.sort_index < activeSortIndex.value) return 'done';
      if (parent.sort_index > activeSortIndex.value) return 'pending';
      return 'active';
    };

    // 4. Expanded group data
    const expandedGroupData = computed(() => {
      if (!expandedGroupValue.value) return null;
      return parentGroups.value.find(g => String(g.value) === String(expandedGroupValue.value)) || null;
    });

    // ========== STYLE COMPUTEDS ==========
    const componentStyle = computed(() => {
      const stepSize = props.content?.stepSize || 40;
      return {
        '--step-size': `${stepSize}px`,
        '--step-font-size': `${Math.max(12, Math.floor(stepSize * 0.4))}px`,
        '--step-check-size': `${Math.max(16, Math.floor(stepSize * 0.5))}px`,
        '--step-label-size': `${Math.max(12, Math.floor(stepSize * 0.35))}px`,
        '--step-spacing': props.content?.stepSpacing || '24px',
        '--font-family': props.content?.fontFamily || 'Work Sans, system-ui, -apple-system, sans-serif',
        '--line-color': props.content?.lineColor || '#e5e7eb',
        '--upcoming-color': props.content?.upcomingColor || '#d1d5db',
        '--upcoming-bg-color': props.content?.upcomingBackgroundColor || '#f3f4f6',
        '--current-color': props.content?.currentColor || '#3b82f6',
        '--completed-color': props.content?.completedColor || '#10b981',
        '--completed-text-color': props.content?.completedTextColor || '#374151',
        '--current-text-color': props.content?.currentTextColor || '#1f2937',
        '--upcoming-text-color': props.content?.upcomingTextColor || '#9ca3af',
        '--badge-done-bg': hexToRgba(props.content?.completedColor || '#10b981', 0.12),
        '--badge-done-border': hexToRgba(props.content?.completedColor || '#10b981', 0.35),
        '--badge-active-bg': hexToRgba(props.content?.currentColor || '#3b82f6', 0.12),
        '--badge-active-border': hexToRgba(props.content?.currentColor || '#3b82f6', 0.35),
        '--state-color': props.content?.stateColor || '#6b7280',
        '--state-text-color': props.content?.stateTextColor || '#374151',
        '--badge-state-bg': hexToRgba(props.content?.stateColor || '#6b7280', 0.12),
        '--badge-state-border': hexToRgba(props.content?.stateColor || '#6b7280', 0.35),
        '--line-gap': '8px',
      };
    });

    const isStateItem = (item) => item.sort_index == null;

    const getIndicatorStyle = (item) => {
      const status = item.derivedStatus;
      const isState = isStateItem(item);

      if (status === 'done') {
        const color = props.content?.completedColor || '#10b981';
        return {
          backgroundColor: color,
          borderColor: color,
          color: '#ffffff',
        };
      }
      if (status === 'active') {
        const color = isState
          ? (props.content?.stateColor || '#6b7280')
          : (props.content?.currentColor || '#3b82f6');
        return {
          backgroundColor: color,
          borderColor: color,
          color: '#ffffff',
          boxShadow: `0 0 0 3px ${hexToRgba(color, 0.3)}`,
        };
      }
      // pending
      if (isState) {
        const color = props.content?.stateColor || '#6b7280';
        return {
          backgroundColor: props.content?.upcomingBackgroundColor || '#f3f4f6',
          borderColor: color,
          color: color,
        };
      }
      return {
        backgroundColor: props.content?.upcomingBackgroundColor || '#f3f4f6',
        borderColor: props.content?.upcomingColor || '#d1d5db',
        color: props.content?.upcomingColor || '#d1d5db',
      };
    };

    const getLineStyle = (item) => {
      if (item.derivedStatus === 'done') {
        return {
          backgroundColor: props.content?.completedLineColor || '#10b981',
        };
      }
      if (isStateItem(item) && item.derivedStatus === 'active') {
        return {
          backgroundColor: props.content?.stateColor || '#6b7280',
        };
      }
      return {
        backgroundColor: props.content?.lineColor || '#e5e7eb',
      };
    };

    const getLabelStyle = (item) => {
      const status = typeof item === 'string' ? item : item.derivedStatus;
      const isState = typeof item === 'object' && isStateItem(item);
      const style = {
        fontFamily: props.content?.fontFamily || 'Work Sans, system-ui, -apple-system, sans-serif',
      };
      if (status === 'done') {
        style.color = props.content?.completedTextColor || '#374151';
        style.fontWeight = '500';
      } else if (status === 'active') {
        style.color = isState
          ? (props.content?.stateTextColor || '#374151')
          : (props.content?.currentTextColor || '#1f2937');
        style.fontWeight = '600';
      } else {
        style.color = isState
          ? (props.content?.stateTextColor || '#374151')
          : (props.content?.upcomingTextColor || '#9ca3af');
        style.fontWeight = isState ? '500' : '400';
      }
      return style;
    };

    // ========== CONFETTI ==========
    const triggerConfettiFromElement = (element) => {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const frontWindow = wwLib.getFrontWindow();
      const windowWidth = frontWindow.innerWidth;
      const windowHeight = frontWindow.innerHeight;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: centerX / windowWidth, y: centerY / windowHeight },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#FFC700', '#FF0080'],
        startVelocity: 30,
        gravity: 1,
        ticks: 200,
      });
    };

    // ========== INTERACTION HANDLERS ==========

    // Grouped mode: click a parent group to expand/collapse
    const handleGroupClick = (group, gIndex) => {
      // Toggle expand/collapse
      if (expandedGroupValue.value === group.value) {
        expandedGroupValue.value = null;
        setExpandedGroupVar(null);
      } else {
        expandedGroupValue.value = group.value;
        setExpandedGroupVar(group.value);
        emit('trigger-event', {
          name: 'group-expand',
          event: { groupValue: group.value, groupLabel: group.label },
        });
      }
    };

    // Grouped mode: click a sub-step
    const handleSubstepClick = (child, cIndex) => {
      if (!props.content?.clickable) return;
      if (child.derivedStatus === 'active') return;

      if (props.content?.requireConfirmation) {
        pendingStatus.value = { ...child, displayNumber: cIndex + 1 };
        showConfirmation.value = true;
        return;
      }
      performStatusChange(child, substepIndicators.value[cIndex]);
    };

    // Flat mode: click a parent group to change status
    const handleFlatGroupClick = (group, gIndex) => {
      if (!props.content?.clickable) return;
      if (group.derivedStatus === 'active') return;

      if (props.content?.requireConfirmation) {
        pendingStatus.value = { ...group, displayNumber: gIndex + 1 };
        showConfirmation.value = true;
        return;
      }
      performStatusChange(group, groupIndicators.value[gIndex]);
    };

    const performStatusChange = (status, element) => {
      setActiveStatusValue(status.value);

      if (status.isSuccess && element) {
        setTimeout(() => {
          triggerConfettiFromElement(element);
        }, 200);
      }

      emit('trigger-event', {
        name: 'status-click',
        event: {
          status: status.originalItem || status,
          value: status.value,
          label: status.label,
          derivedStatus: status.derivedStatus,
          isParent: !status.parent,
        },
      });
    };

    const confirmStatusChange = () => {
      if (pendingStatus.value) {
        performStatusChange(pendingStatus.value, null);
      }
      closeConfirmation();
    };

    const cancelStatusChange = () => {
      closeConfirmation();
    };

    const closeConfirmation = () => {
      showConfirmation.value = false;
      pendingStatus.value = null;
    };

    // ========== WATCHERS ==========

    // Sync currentStatus prop → internal variable
    watch(
      () => props.content?.currentStatus,
      (newValue) => {
        if (newValue !== undefined && newValue !== activeStatusValue.value) {
          setActiveStatusValue(newValue);
        }
      },
      { immediate: true }
    );

    // Auto-expand the active group when currentStatus changes
    watch(
      activeStatusItem,
      (item) => {
        if (!item) return;
        if (props.content?.enableParentStatus === false) return;

        // Find which parent group contains this status
        let targetGroup = null;
        if (!item.parent) {
          // The active status IS a parent group
          targetGroup = item.value;
        } else {
          // The active status is a child — expand its parent
          targetGroup = item.parent;
        }

        if (targetGroup && targetGroup !== expandedGroupValue.value) {
          expandedGroupValue.value = targetGroup;
          setExpandedGroupVar(targetGroup);
        }
      },
      { immediate: true }
    );

    // Emit status-change event
    watch(
      activeStatusValue,
      (newValue, oldValue) => {
        if (newValue !== oldValue && oldValue !== undefined && oldValue !== '') {
          emit('trigger-event', {
            name: 'status-change',
            event: {
              newStatusValue: newValue,
              oldStatusValue: oldValue,
            },
          });
        }
      }
    );

    return {
      isVertical,
      componentStyle,
      parentGroups,
      expandedGroupValue,
      expandedGroupData,
      getIndicatorStyle,
      getLineStyle,
      getLabelStyle,
      handleGroupClick,
      handleSubstepClick,
      handleFlatGroupClick,
      showConfirmation,
      pendingStatus,
      confirmStatusChange,
      cancelStatusChange,
      groupIndicators,
      substepIndicators,
      /* wwEditor:start */
      isEditing,
      /* wwEditor:end */
    };
  },
};
</script>

<style lang="scss" scoped>
.status-stepper {
  width: 100%;
  font-family: var(--font-family);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  &.vertical {
    flex-direction: row;
    align-items: flex-start;
  }
}

// ========== GROUPS ROW ==========
.groups-row {
  display: flex;
  align-items: flex-start;
  width: 100%;

  &.vertical {
    flex-direction: column;
    gap: 0;
  }
}

.group-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 0;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover .step-indicator {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &.active .step-label {
    font-weight: 600 !important;
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

// ========== STEP INDICATOR ==========
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
  width: var(--step-size, 40px);
  height: var(--step-size, 40px);
  border-radius: 50%;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--step-font-size, 16px);
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  z-index: 2;

  &.done {
    animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    .check-icon {
      animation: checkFadeIn 0.35s ease-in-out;
    }
  }

  &.active {
    animation: pulse 2s ease-in-out infinite, popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);

    .step-number {
      animation: numberPulse 0.35s ease-in-out;
    }
  }

  .check-icon {
    width: var(--step-check-size, 20px);
    height: var(--step-check-size, 20px);
    display: block;
    flex-shrink: 0;
  }

  .step-number {
    font-size: var(--step-font-size, 16px);
  }
}

.substep-size {
  width: calc(var(--step-size, 40px) * 0.8);
  height: calc(var(--step-size, 40px) * 0.8);
  font-size: calc(var(--step-font-size, 16px) * 0.85);

  .check-icon {
    width: calc(var(--step-check-size, 20px) * 0.85);
    height: calc(var(--step-check-size, 20px) * 0.85);
  }

  .step-number {
    font-size: calc(var(--step-font-size, 16px) * 0.85);
  }
}

// ========== STEP CONTENT ==========
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
  font-size: var(--step-label-size, 14px);
  line-height: 1.4;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  word-wrap: break-word;
  max-width: 100%;
}

.substep-label-size {
  font-size: calc(var(--step-label-size, 14px) * 0.9);
}

// ========== STEP METADATA ==========
.step-sub-count {
  font-size: calc(var(--step-label-size, 14px) * 0.82);
  color: var(--upcoming-text-color);
  font-weight: 400;
  margin-top: 2px;
  font-family: var(--font-family);
}

.step-status-badge {
  display: inline-block;
  margin-top: 5px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: calc(var(--step-label-size, 14px) * 0.78);
  font-weight: 600;
  font-family: var(--font-family);
  border: 1px solid transparent;
  letter-spacing: 0.01em;

  &.done {
    background-color: var(--badge-done-bg);
    border-color: var(--badge-done-border);
    color: var(--completed-color);
  }

  &.active {
    background-color: var(--badge-active-bg);
    border-color: var(--badge-active-border);
    color: var(--current-color);
  }

  &.state.active {
    background-color: var(--badge-state-bg);
    border-color: var(--badge-state-border);
    color: var(--state-color);
  }
}

// ========== CONNECTOR LINES ==========
.step-line {
  position: absolute;
  background-color: var(--line-color);
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;

  // Horizontal — gap before and after circles
  top: calc(var(--step-size, 40px) / 2);
  left: calc(50% + var(--step-size, 40px) / 2 + var(--line-gap, 8px));
  width: calc(100% - var(--step-size, 40px) - 2 * var(--line-gap, 8px));
  height: 2px;
  transform: translateY(-50%);

  &.done {
    animation: lineFillIn 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  }

  // Vertical
  &.vertical {
    top: calc(var(--step-size, 40px) + var(--line-gap, 8px));
    bottom: calc(-32px + var(--line-gap, 8px));
    left: calc(var(--step-size, 40px) / 2);
    right: auto;
    width: 2px;
    height: auto;
    transform: translateX(-50%);

    &.done {
      animation: lineFillInVertical 0.45s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
}

.substep-line {
  // Substep horizontal line uses smaller indicator size + gap
  top: calc(var(--step-size, 40px) * 0.8 / 2);
  left: calc(50% + var(--step-size, 40px) * 0.8 / 2 + var(--line-gap, 8px));
  width: calc(100% - var(--step-size, 40px) * 0.8 - 2 * var(--line-gap, 8px));

  &.vertical {
    top: calc(var(--step-size, 40px) * 0.8 + var(--line-gap, 8px));
    left: calc(var(--step-size, 40px) * 0.8 / 2);
    width: 2px;
  }
}

// ========== SUB-STEPS PANEL ==========
.substeps-panel {
  margin-top: 16px;
  padding: 16px 12px 16px;
  border-radius: 10px;
  background: var(--upcoming-bg-color);
  border: 1px solid var(--line-color);

  &.vertical {
    margin-top: 0;
    margin-left: 16px;
    flex: 1;
  }
}

.substeps-panel-header {
  font-family: var(--font-family);
  font-size: calc(var(--step-label-size, 14px) * 0.85);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--completed-text-color);
  margin-bottom: 14px;
  padding-left: 4px;
}

.substeps-row {
  display: flex;
  align-items: flex-start;
  width: 100%;

  &.vertical {
    flex-direction: column;
    gap: 0;
  }
}

.substep-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 0;

  &.clickable {
    cursor: pointer;

    &:hover .step-indicator {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  .vertical & {
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
    padding-bottom: 24px;

    &:last-child {
      padding-bottom: 0;
    }
  }
}

// ========== PANEL TRANSITION ==========
.panel-slide-enter-active {
  transition: opacity 0.15s ease, transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-slide-leave-active {
  transition: opacity 0.08s ease;
}

.panel-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.panel-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

// ========== KEYFRAME ANIMATIONS ==========
@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(59, 130, 246, 0.15);
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

// ========== CONFIRMATION PANEL ==========
.confirmation-panel {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.15s ease-out;
}

.confirmation-content {
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  max-width: 100%;
  min-height: 56px;
}

.confirmation-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  min-width: 0;
  overflow: hidden;
}

.confirmation-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  font-family: var(--font-family);
}

.confirmation-message {
  font-size: 13px;
  color: #64748b;
  font-family: var(--font-family);
}

.confirmation-step-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--current-color);
  font-family: var(--font-family);
  padding: 3px 8px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.confirmation-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.confirmation-btn {
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font-family);
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
  white-space: nowrap;

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
    opacity: 0.9;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

// ========== RESPONSIVE ==========
@media (max-width: 768px) {
  .status-stepper {
    padding: 12px;
  }

  .step-indicator {
    width: calc(var(--step-size, 40px) * 0.9);
    height: calc(var(--step-size, 40px) * 0.9);
    font-size: calc(var(--step-font-size, 16px) * 0.875);

    .check-icon {
      width: calc(var(--step-check-size, 20px) * 0.9);
      height: calc(var(--step-check-size, 20px) * 0.9);
    }
  }

  .substep-size {
    width: calc(var(--step-size, 40px) * 0.72);
    height: calc(var(--step-size, 40px) * 0.72);
  }

  .step-label {
    font-size: calc(var(--step-label-size, 14px) * 0.93);
  }

  .step-line {
    top: calc(var(--step-size, 40px) * 0.45);
    left: calc(50% + var(--step-size, 40px) * 0.45 + var(--line-gap, 8px));
    width: calc(100% - var(--step-size, 40px) * 0.9 - 2 * var(--line-gap, 8px));

    &.vertical {
      top: calc(var(--step-size, 40px) * 0.9 + var(--line-gap, 8px));
      left: calc(var(--step-size, 40px) * 0.45);
    }
  }

  .substep-line {
    top: calc(var(--step-size, 40px) * 0.36);
    left: calc(50% + var(--step-size, 40px) * 0.36 + var(--line-gap, 8px));
    width: calc(100% - var(--step-size, 40px) * 0.72 - 2 * var(--line-gap, 8px));

    &.vertical {
      top: calc(var(--step-size, 40px) * 0.72 + var(--line-gap, 8px));
      left: calc(var(--step-size, 40px) * 0.36);
      width: 2px;
    }
  }

  .substeps-panel {
    padding: 12px 8px;
  }

  .confirmation-content {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 12px;
  }

  .confirmation-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 480px) {
  .confirmation-actions {
    flex-direction: column;

    .confirmation-btn {
      width: 100%;
      padding: 10px;
    }
  }
}
</style>
