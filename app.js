function validateForm(formSelector) {
  // Select main form and relevant DOM elements
  const formElement = document.querySelector(formSelector);
  const body = document.body;
  const successMessage = document.querySelector('.success-message__container');
  const newsletterWrapper = document.querySelector('.newsletter-wrapper');
  const input = formElement.querySelector('input');
  const dismissBtn = successMessage.querySelector('.submit-btn');

  const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_{|}~-]+)*@(?:(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}|\[(?:IPv6:[A-F0-9]{0,4}(?::[A-F0-9]{0,4}){2,7}|(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\])$/i;

  // Define validation rules and their error messages
  const validationOptions = [
    {
      attribute: 'required',
      isValid: input => input.value.trim() !== '',
      errorMessage: (input, label) => `${label.textContent} required`
    },
    {
      attribute: 'pattern',
      isValid: input => emailRegex.test(input.value.trim()),
      errorMessage: (input, label) => `Not a valid ${label.textContent}`
    }
  ];


   /* Validate a single form group (label + input + error container)
   /* Returns true if valid, false otherwise
   */
  function validateSingleFormGroup(formGroup) {
    const label = formGroup.querySelector('label');
    const input = formGroup.querySelector('input');
    const errorContainer = formGroup.querySelector('.label-wrapper #name-error');

    let formGroupError = false;

    // Check each validation rule (required, pattern, etc.)
    for (const option of validationOptions) {
      if (input.hasAttribute(option.attribute) && !option.isValid(input)) {
        // Display corresponding error message
        errorContainer.textContent = option.errorMessage(input, label);
        input.classList.add('error');
        formGroupError = true;
        break; // Stop after the first detected error
      }
    }

    // Clear previous error state if valid
    if (!formGroupError) {
      errorContainer.textContent = '';
      input.classList.remove('error');
    }

    return !formGroupError;
  }

  // Disable native browser validation
  formElement.setAttribute('novalidate', '');

  /**
   * Form submission handler
   */
  formElement.addEventListener('submit', event => {
    event.preventDefault();

    // Validate all .formGroup elements
    const formGroups = Array.from(formElement.querySelectorAll('.formGroup'));
    const isValid = formGroups.every(validateSingleFormGroup);

    if (isValid) {
      // Show the success message popup
      successMessage.style.display = 'flex';
      newsletterWrapper.style.opacity = 0;
      newsletterWrapper.style.pointerEvents = 'none';
      body.style.overflow = 'hidden'; // Prevent background scrolling
      dismissBtn.focus();

      // Insert the user's email into the confirmation message
      successMessage.querySelector('strong').textContent = input.value;

      // Clear the input field
      input.value = '';
    }
  });

  /**
   * Dismiss button handler: hides success message and restores the form
   */
  dismissBtn.addEventListener('click', () => {
    successMessage.style.display = 'none';
    newsletterWrapper.style.display = 'flex';
    newsletterWrapper.style.opacity = 1;
    newsletterWrapper.style.pointerEvents = 'auto';
    body.style.overflow = ''; // Re-enable scrolling
    input.focus();
  });

  /**
   * Live validation feedback:
   * Removes error state as soon as user starts typing or leaves the field
   */
  formElement.querySelectorAll('input').forEach(input => {
    const resetError = () => {
      input.classList.remove('error');
      const errorContainer = input.closest('.formGroup')?.querySelector('#name-error');
      if (errorContainer) errorContainer.textContent = '';
    };

    ['input', 'blur'].forEach(event => input.addEventListener(event, resetError));
  });
}

// Initialize the validation on the newsletter form
validateForm('#newsletterForm');
