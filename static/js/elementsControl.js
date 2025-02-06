export function showPassword(input, icon) {

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
}

export function validateMatchInputs(firstInput, secondInput, secondIcon, event) {
    if (firstInput.value !== secondInput.value) {
        secondIcon.classList.add('text-danger');
        secondInput.classList.add('text-danger');
        event.preventDefault();
    } else {
        secondIcon.classList.remove('text-danger');
        secondInput.classList.remove('text-danger');
    }
}