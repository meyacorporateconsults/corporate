(function () {
  // Get the contact form element
  const contactForm = document.getElementById("contact-form");

  // Form validation function
  function validateForm(formData) {
    let errors = {};
    let isValid = true;

    // Validate name (required, at least 2 characters)
    const name = formData.get("name");
    if (!name || name.trim().length < 2) {
      errors.name = "Please enter a valid name (at least 2 characters)";
      isValid = false;
    }

    // Validate phone number (required, numeric, at least 10 digits)
    const phone = formData.get("email"); // Note: incorrectly named 'email' in HTML
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phone || !phoneRegex.test(phone.replace(/[\s-()]/g, ""))) {
      errors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    // Validate service selection (required)
    const service = formData.get("select");
    console.log("Service value:", service);

    if (!service || service.trim() === "") {
      errors.service = "Please select a service";
      isValid = false;
    }

    // Validate email (required, valid email format)
    const email = formData.get("subject"); // Note: incorrectly named 'subject' in HTML
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Validate message (required, at least 10 characters)
    const message = formData.get("message");
    if (!message || message.trim().length < 10) {
      errors.message = "Please enter a message (at least 10 characters)";
      isValid = false;
    }

    return { isValid, errors };
  }

  // Function to display validation errors
  function displayErrors(errors) {
    // Remove any existing error messages
    const existingErrors = document.querySelectorAll(".form-error");
    existingErrors.forEach((error) => error.remove());

    // Display new error messages
    Object.keys(errors).forEach((field) => {
      const inputElement = document.querySelector(
        `[name="${
          field === "phone" ? "email" : field === "email" ? "subject" : field
        }"]`
      );
      if (inputElement) {
        const errorElement = document.createElement("div");
        errorElement.className = "form-error";
        errorElement.style.color = "red";
        errorElement.style.fontSize = "12px";
        errorElement.style.marginTop = "5px";
        errorElement.textContent = errors[field];
        inputElement.parentNode.appendChild(errorElement);

        // Highlight the input field
        inputElement.style.borderColor = "red";
      }
    });
  }

  // Function to clear validation errors
  function clearErrors() {
    const errorElements = document.querySelectorAll(".form-error");
    errorElements.forEach((element) => element.remove());

    // Reset input field styling
    const inputFields = contactForm.querySelectorAll("input, textarea, select");
    inputFields.forEach((field) => {
      field.style.borderColor = "";
    });
  }

  // Form submission handler
  function handleFormSubmit(event) {
    event.preventDefault();
    clearErrors();

    const formData = new FormData(contactForm);
    const { isValid, errors } = validateForm(formData);
    console.log(isValid, errors, formData.get("select"));
    if (isValid) {
      // Prepare data for submission
      const formValues = {
        name: formData.get("name"),
        phone: formData.get("email"), // Note: incorrectly named 'email' in HTML
        field: formData.get("select"), // Using the value of the selected option
        email: formData.get("subject"), // Note: incorrectly named 'subject' in HTML
        message: formData.get("message"),
      };

      // Here you would typically send the data to a server
      // For now, we'll just log it and show a success message
      console.log("Form data to be submitted:", formValues);

      // Show success message
      const successMessage = document.createElement("div");
      successMessage.className = "form-success";
      successMessage.style.color = "green";
      successMessage.style.padding = "15px";
      successMessage.style.marginTop = "15px";
      successMessage.style.backgroundColor = "#e8f5e9";
      successMessage.style.borderRadius = "4px";
      successMessage.style.textAlign = "center";
      successMessage.textContent =
        "Thank you for your message! We will contact you soon.";

      // Clear the form
      contactForm.reset();

      // Add success message to the form

      emailjs
        .send("service_id", "template_id", formValues, "public_key")
        .then(function (response) {
          console.log("Email sent successfully:", response);
          contactForm.appendChild(successMessage);
        })
        .catch(function (error) {
          console.error("Email sending failed:", error);
        });

      // Remove success message after 5 seconds
      setTimeout(() => {
        successMessage.remove();
      }, 5000);
    } else {
      // Display validation errors
      displayErrors(errors);
    }
  }

  // Add event listener to the form if it exists
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  } else {
    console.error("Contact form not found on this page");
  }
})();
