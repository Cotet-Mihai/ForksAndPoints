import {showPassword} from "./elementsControl.js";

const signinPassword = document.getElementById('signinPassword');
const signinPasswordIcon = document.getElementById('show-password-toggle-icon');

signinPasswordIcon.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    showPassword(signinPassword, signinPasswordIcon)
})