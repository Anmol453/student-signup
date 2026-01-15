import { LandingUIManager } from './landingUIManager.js';

class LandingPageController {
    constructor() {
        this.uiManager = new LandingUIManager();
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadStudents();
    }

    setupEventListeners() {
        const registerBtn = document.getElementById('registerBtn');
        const retryBtn = document.getElementById('retryBtn');

        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }

        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.loadStudents();
            });
        }
    }

    async loadStudents() {
        try {
            this.uiManager.showLoading();

            const response = await fetch(`${this.apiBaseUrl}/students`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success && result.data) {
                this.uiManager.renderStudents(result.data);
            } else {
                this.uiManager.showEmpty();
            }

        } catch (error) {
            console.error('Error loading students:', error);
            this.uiManager.showError(
                'Failed to load students. Please check if the server is running.'
            );
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LandingPageController();
});
