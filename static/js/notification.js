export class Notification {
    static notifications = []; // Lista notificărilor active
    static MAX_NOTIFICATIONS = 3; // Numărul maxim de notificări afișate simultan

    /**
     * Displays a notification with a specific background color based on the category.
     *
     * @param {string} category - The category of the notification ('success', 'error', 'info').
     * @param {string} message - The message to display.
     */
    static showNotification(category, message) {
        if (Notification.notifications.length >= Notification.MAX_NOTIFICATIONS) {
            Notification.hideNotification(Notification.notifications[0]); // Șterge prima notificare
        }

        const notification = document.createElement('div');
        notification.classList.add('notification');

        const messageElement = document.createElement('p');
        messageElement.classList.add('notification-message');
        messageElement.innerText = message;

        notification.appendChild(messageElement);
        document.body.appendChild(notification);

        let backgroundColor;
        switch (category.toLowerCase()) {
            case 'success':
                backgroundColor = '#4CAF50';
                break;
            case 'error':
                backgroundColor = '#dc4c64';
                break;
            case 'info':
                backgroundColor = 'var(--yellow-level-0)';
                break;
            default:
                backgroundColor = '#333';
        }

        notification.style.background = backgroundColor;
        notification.style.opacity = '0';
        notification.style.transform = `translate(-50%, -500%)`;

        Notification.notifications.push(notification);
        Notification.updateNotificationPositions();

        // Afișează notificarea
        setTimeout(() => {
            notification.style.opacity = '1';
            Notification.updateNotificationPositions();
        }, 50);

        // Șterge notificarea după 3 secunde
        setTimeout(() => Notification.hideNotification(notification), 3000);
    }

    /**
     * Hides and removes the notification from the DOM.
     *
     * @param {HTMLElement} notification - The notification element to remove.
     */
    static hideNotification(notification) {
        notification.style.opacity = '0';

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
                Notification.notifications = Notification.notifications.filter(n => n !== notification);
                Notification.updateNotificationPositions();
            }
        }, 500);
    }

    /**
     * Updates the position of all active notifications.
     */
    static updateNotificationPositions() {
        Notification.notifications.forEach((notification, index) => {
            let yOffset = -650 + index * 120; // Spațiu de 120px între notificări
            notification.style.transform = `translate(-50%, ${yOffset}%)`;
        });
    }
}