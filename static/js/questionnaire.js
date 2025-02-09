/**
 * Navigates to the next or previous question in the questionnaire.
 *
 * @param {number} stepChange - Determines the navigation direction.
 *                              Use 1 to move forward, -1 to move backward.
 */
function navigateQuestion(stepChange) {
    let currentUrl = window.location.pathname;
    let parts = currentUrl.split('/');
    let currentStep = parts[2];
    let newStep;

    try {
        switch (currentStep) {
            case 'info':
                newStep = stepChange > 0 ? 1 : 'info'; // Start from step 1 or remain on 'info'
                break;
            case '6':
                newStep = stepChange > 0 ? 'summary' : 5; // Move to 'summary' or step 5
                break;
            case 'summary':
                newStep = stepChange > 0 ? 'summary' : '6'; // Remain on 'summary' or go back to step 6
                break;
            case '1':
                newStep = stepChange > 0 ? 2 : 'info'; // Move to step 2 or back to 'info'
                break;
            default:
                newStep = parseInt(currentStep) + stepChange; // Increment or decrement step
        }

        window.location.href = `/questionnaire/${newStep}/`;
    } catch (error) {
        console.error(error);
        window.location.href = `/questionnaire/info/`; // Redirect to 'info' in case of an error
    }
}

/**
 * Event listener for the "Next Question" button.
 * Moves the user to the next step in the questionnaire.
 */
document.getElementById('nextQuestion').addEventListener('click', function(e) {
    e.preventDefault();
    navigateQuestion(1);
});

/**
 * Event listener for the "Previous Question" button.
 * Moves the user to the previous step in the questionnaire.
 */
document.getElementById('backQuestion').addEventListener('click', function(e) {
    e.preventDefault();
    navigateQuestion(-1);
});
