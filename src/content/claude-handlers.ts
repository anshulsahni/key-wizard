/**
 * Claude.ai Action Handlers
 *
 * Functions to interact with Claude.ai web interface elements.
 * Uses generic element detection strategies to find UI components.
 */

/**
 * Find and open the model dropdown
 */
export function openModelDropdown(): void {
  console.log("Key Wizard: Attempting to open model dropdown...");

  const modelSelectorButton = document.querySelector(
    'button[data-testid="model-selector-dropdown"]'
  );
  if (modelSelectorButton instanceof HTMLElement) {
    modelSelectorButton.click();
    console.log("Key Wizard: Model dropdown opened");
    return;
  }

  console.warn(
    "Key Wizard: Could not find model dropdown. Please check the page structure."
  );
}

/**
 * Find and toggle the research option
 *
 * TODO: Current selectors aren't working perfectly. Need to identify the exact selector
 * for the research toggle/checkbox element.
 *
 * Strategy:
 * 1. Look for checkboxes or toggle switches with research-related labels
 * 2. Check for buttons/toggles with text containing "research"
 * 3. Look for elements with ARIA labels related to research
 * 4. Search by common patterns (data attributes, classes)
 */
export function toggleResearchOption(): void {
  console.log("Key Wizard: Attempting to toggle research option...");

  // Strategy 1: Look for checkboxes with research-related labels
  const checkboxes = Array.from(
    document.querySelectorAll('input[type="checkbox"]')
  );
  const researchCheckbox = checkboxes.find((checkbox) => {
    if (!(checkbox instanceof HTMLInputElement)) {
      return false;
    }
    const id = checkbox.id;
    const name = checkbox.name?.toLowerCase() || "";
    const ariaLabel = checkbox.getAttribute("aria-label")?.toLowerCase() || "";

    // Find associated label
    let labelText = "";
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      labelText = label?.textContent?.toLowerCase() || "";
    }

    // Check parent for text
    const parentText =
      checkbox.closest("label, div, span")?.textContent?.toLowerCase() || "";

    return (
      name.includes("research") ||
      ariaLabel.includes("research") ||
      labelText.includes("research") ||
      parentText.includes("research")
    );
  });

  if (researchCheckbox instanceof HTMLInputElement) {
    researchCheckbox.checked = !researchCheckbox.checked;
    // Trigger change event
    researchCheckbox.dispatchEvent(new Event("change", { bubbles: true }));
    console.log(
      `Key Wizard: Research option toggled to ${researchCheckbox.checked}`
    );
    return;
  }

  // Strategy 2: Look for toggle switches (button-based toggles)
  const buttons = Array.from(
    document.querySelectorAll('button, [role="switch"], [role="checkbox"]')
  );
  const researchToggle = buttons.find((btn) => {
    const text = btn.textContent?.toLowerCase() || "";
    const ariaLabel = btn.getAttribute("aria-label")?.toLowerCase() || "";
    const ariaChecked = btn.getAttribute("aria-checked");

    return (
      (text.includes("research") || ariaLabel.includes("research")) &&
      (ariaChecked !== null ||
        btn.getAttribute("role") === "switch" ||
        btn.getAttribute("role") === "checkbox")
    );
  });

  if (researchToggle instanceof HTMLElement) {
    researchToggle.click();
    console.log("Key Wizard: Research option toggled via button/toggle");
    return;
  }

  // Strategy 3: Look for elements with data attributes
  const dataResearchElement = document.querySelector(
    '[data-research], [data-testid*="research" i]'
  );
  if (dataResearchElement instanceof HTMLElement) {
    if (
      dataResearchElement instanceof HTMLInputElement &&
      dataResearchElement.type === "checkbox"
    ) {
      dataResearchElement.checked = !dataResearchElement.checked;
      dataResearchElement.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      dataResearchElement.click();
    }
    console.log("Key Wizard: Research option toggled via data attribute");
    return;
  }

  // Strategy 4: Look for switch/toggle components
  const switches = document.querySelectorAll('[role="switch"], [aria-checked]');
  for (const switchEl of switches) {
    const label = switchEl.getAttribute("aria-label")?.toLowerCase() || "";
    const text = switchEl.textContent?.toLowerCase() || "";
    const parentText =
      switchEl.closest("div, span, label")?.textContent?.toLowerCase() || "";

    if (
      label.includes("research") ||
      text.includes("research") ||
      parentText.includes("research")
    ) {
      if (switchEl instanceof HTMLElement) {
        switchEl.click();
        console.log("Key Wizard: Research option toggled via switch");
        return;
      }
    }
  }

  console.warn(
    "Key Wizard: Could not find research option toggle. Please check the page structure."
  );
}

/**
 * Navigate to the projects page
 */
export function navigateToProjects(): void {
  window.location.href = "https://claude.ai/projects?search=";
}

/**
 * Navigate to the new project page
 */
export function navigateToNewProject(): void {
  window.location.href = "https://claude.ai/projects/create";
}

