/* ==========================================================================
   MAIN ENTRY POINT
   ========================================================================== */

import { initBackgroundSwitcher } from './background-switcher.js';
import { initFairyCanvas } from './canvas-engine.js';
import { initTerminalAndPipeline } from './terminal-cli.js';
import { initGitHubTelemetry } from './github-telemetry.js';

const AVATAR_FALLBACK_URL =
  'https://ui-avatars.com/api/?name=Rodrigo+Godinho&background=061812&color=10b981&size=256';

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundSwitcher();
  initFairyCanvas();
  initTerminalAndPipeline();
  initGitHubTelemetry();

  const avatarImg = document.getElementById('author-avatar');
  if (avatarImg) {
    avatarImg.addEventListener(
      'error',
      () => {
        avatarImg.src = AVATAR_FALLBACK_URL;
      },
      { once: true }
    );
  }

  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    const closeMobileMenu = () => {
      mobileMenu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
    };

    menuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', String(!isHidden));
    });

    for (const link of mobileMenu.querySelectorAll('a')) {
      link.addEventListener('click', closeMobileMenu);
    }

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        closeMobileMenu();
        menuBtn.focus();
      }
    });
  }
});
