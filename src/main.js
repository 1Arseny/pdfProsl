document.addEventListener('DOMContentLoaded', function () {
  // ===== 1. Модалка (работает для всех кнопок с .openIframeBtn) =====
  const openBtns = document.querySelectorAll('.openIframeBtn');
  const modal = document.getElementById('iframeModal');
  const dialog = document.getElementById('modalDialog');
  const closeBtn = document.getElementById('closeIframeBtn');

  if (openBtns.length && modal && dialog && closeBtn) {
    openBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        modal.classList.remove('hidden');
        setTimeout(() => {
          dialog.classList.remove('opacity-0', 'scale-95');
          dialog.classList.add('opacity-100', 'scale-100');
        }, 10);
        document.body.style.overflow = 'hidden';
      });
    });

    function closeModal() {
      dialog.classList.remove('opacity-100', 'scale-100');
      dialog.classList.add('opacity-0', 'scale-95');
      setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }, 300);
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
    });
  }

  // ===== 2. Rain-дождик для rain-section =====
  const rainSection = document.getElementById('rain-section');
  const rainContainer = document.getElementById('rain-drops');
  if (rainSection && rainContainer) {
    function randomBetween(a, b) { return Math.random() * (b - a) + a; }
    function spawnDrop() {
      const drop = document.createElement('div');
      const size = randomBetween(18, 52);
      const left = randomBetween(0, 100);
      const top = randomBetween(0, 100);
      const borderList = [
        'rgba(255,255,255,0.32)',
        'rgba(59,130,246,0.23)',
        'rgba(139,92,246,0.22)',
        'rgba(16,185,129,0.16)'
      ];
      const borderColor = borderList[Math.floor(Math.random() * borderList.length)];
      drop.className = 'rain-drop';
      drop.style.width = drop.style.height = `${size}px`;
      drop.style.left = `${left}%`;
      drop.style.top = `${top}%`;
      drop.style.borderColor = borderColor;
      drop.style.boxSizing = 'border-box';
      rainContainer.appendChild(drop);
      setTimeout(() => {
        if (drop.parentNode) rainContainer.removeChild(drop);
      }, 1200);
    }
    setInterval(() => {
      const rect = rainSection.getBoundingClientRect();
      if (
        rainSection.offsetParent !== null &&
        rect.bottom > 0 && rect.top < window.innerHeight
      ) {
        for (let i = 0; i < Math.random() * 2 + 1; ++i) {
          spawnDrop();
        }
      }
    }, 210);
  }

  // ===== 3. Rain-дождик для tools-section =====
  const rainContainerTools = document.getElementById('rain-drops-tools');
  const sectionTools = rainContainerTools?.parentElement;
  if (rainContainerTools && sectionTools) {
    function randomBetween(a, b) { return Math.random() * (b - a) + a; }
    function spawnDropTools() {
      const drop = document.createElement('div');
      const size = randomBetween(12, 32);
      const left = randomBetween(0, 100);
      const top = randomBetween(0, 100);
      const borderList = [
        'rgba(59,130,246,0.09)',
        'rgba(139,92,246,0.08)',
        'rgba(16,185,129,0.09)',
        'rgba(255,255,255,0.13)'
      ];
      const borderColor = borderList[Math.floor(Math.random() * borderList.length)];
      drop.className = 'rain-drop-tools';
      drop.style.width = drop.style.height = `${size}px`;
      drop.style.left = `${left}%`;
      drop.style.top = `${top}%`;
      drop.style.borderColor = borderColor;
      drop.style.boxSizing = 'border-box';
      rainContainerTools.appendChild(drop);
      setTimeout(() => {
        if (drop.parentNode) rainContainerTools.removeChild(drop);
      }, 1250);
    }
    setInterval(() => {
      const rect = sectionTools.getBoundingClientRect();
      if (
        sectionTools.offsetParent !== null &&
        rect.bottom > 0 && rect.top < window.innerHeight
      ) {
        for (let i = 0; i < Math.random() * 2 + 1; ++i) {
          spawnDropTools();
        }
      }
    }, 310);
  }

  // ===== 4. IntersectionObserver для секций с анимацией =====

  const animatedSections = [
    { id: 'rain-section', animate: startRainSectionAnimation },
    { id: 'tools-section', animate: startToolsSectionAnimation },
    { id: 'author-section', animate: startAuthorSectionAnimation },
    { id: 'bonus-section', animate: startBonusSectionAnimation },
    { id: 'cta-section', animate: startCtaSectionAnimation },
  ];

  animatedSections.forEach(({ id, animate }) => {
    const section = document.getElementById(id);
    if (!section) return;
    let triggered = false;
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          animate();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.24 });
    observer.observe(section);
  });

  // ===== 5. ФУНКЦИИ АНИМАЦИИ ДЛЯ КАЖДОЙ СЕКЦИИ =====

  // --- 1. Главный терминал rain-section ---
   let termLine = 0, charIdx = 0, history = [];
  const terminalEl = document.getElementById('typed-terminal-lines');
  const terminalLines = [
    'journalctl -f --unit=NetworkManager',
    'rfkill list all && rfkill block bluetooth',
    'bluetoothctl scan on  # поиск BLE-устройств поблизости',
    'sudo ausearch -m NETFILTER -ts today',
    'arecord -l  # проверка доступных аудиоустройств',
    'sudo ufw status verbose  # сетевые правила и слушающие порты'
  ];
  function typeNextLine() {
    if (!terminalEl) return;
    const current = terminalLines[termLine];
    if (charIdx <= current.length) {
      const safeLines = history.map(line => `<div class="whitespace-nowrap">${escapeHtml(line)}</div>`).join('');
      terminalEl.innerHTML = safeLines +
        `<div class="whitespace-nowrap">${escapeHtml(current.slice(0, charIdx))}<span class="term-cursor"></span></div>`;
      charIdx++;
      setTimeout(typeNextLine, Math.random() * 40 + 35);
    } else {
      history.push(current);
      termLine++;
      charIdx = 0;
      if (termLine < terminalLines.length) {
        setTimeout(typeNextLine, 800);
      } else {
        const safeLines = history.map(line => `<div class="whitespace-nowrap">${escapeHtml(line)}</div>`).join('');
        terminalEl.innerHTML = safeLines +
          `<div><span class="term-cursor"></span></div>`;
      }
    }
  }
  function startRainSectionAnimation() {
    termLine = 0; charIdx = 0; history = [];
    if (terminalEl) terminalEl.innerHTML = '';
    typeNextLine();
  }

  // Простая функция экранирования для вывода в терминал
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Запуск анимации при загрузке секции
  document.addEventListener('DOMContentLoaded', () => {
    startRainSectionAnimation();
  });

  // --- 2. Tools-section анимация списка ---
  function startToolsSectionAnimation() {
    const toolsSection = document.getElementById('tools-section');
    if (toolsSection) toolsSection.classList.add('opacity-100', 'translate-y-0');
    const toolsList = document.getElementById('tools-list');
    if (toolsList) {
      const items = Array.from(toolsList.querySelectorAll('.tool-item'));
      items.forEach((item, idx) => {
        setTimeout(() => {
          item.classList.remove('opacity-0', 'translate-y-8');
          item.classList.add('opacity-100', 'translate-y-0');
        }, idx * 140);
      });
    }
  }

  // --- 3. Author-section терминал ---
  const authorTerminalBg = document.getElementById('author-terminal-bg');
  let authorCmdIdx = 0, authorCharIdx = 0, authorHistory = [];
  const authorCommands = [
    'theHarvester -d example.com -b all',
    'amass enum -d example.com',
    'exiftool IMG_0420.jpg | grep GPS',
    'holehe -l target@example.com'
  ];
  function typeAuthorCmd() {
    if (!authorTerminalBg) return;
    const current = authorCommands[authorCmdIdx];
    let html = '';
    authorHistory.forEach(line => {
      html += `<div class="author-terminal-line">
        <span class="author-terminal-prompt">pentester@codeby:~$</span>
        <span>${line}</span>
      </div>`;
    });
    html += `<div class="author-terminal-line">
      <span class="author-terminal-prompt">pentester@codeby:~$</span>
      <span>${current.slice(0, authorCharIdx)}<span class="term-cursor"></span></span>
    </div>`;
    authorTerminalBg.innerHTML = html;

    if (authorCharIdx < current.length) {
      authorCharIdx++;
      setTimeout(typeAuthorCmd, Math.random() * 36 + 32);
    } else {
      authorHistory.push(current);
      if (authorHistory.length > 5) authorHistory.shift();
      authorCmdIdx = (authorCmdIdx + 1) % authorCommands.length;
      authorCharIdx = 0;
      setTimeout(typeAuthorCmd, 800);
    }
  }
  function startAuthorSectionAnimation() {
    authorCmdIdx = 0; authorCharIdx = 0; authorHistory = [];
    if (authorTerminalBg) authorTerminalBg.innerHTML = '';
    typeAuthorCmd();
  }

  // --- 4. Bonus-section заголовок typing ---
  const bonusTitleEl = document.getElementById('bonus-type-title');
  const bonusText = "Бонус за подписку";
  let bonusIdx = 0;
  function typeBonusTitle() {
    if (!bonusTitleEl) return;
    bonusTitleEl.textContent = bonusText.slice(0, bonusIdx);
    bonusIdx++;
    if (bonusIdx <= bonusText.length) {
      setTimeout(typeBonusTitle, Math.random() * 45 + 35);
    }
  }
  function startBonusSectionAnimation() {
    bonusIdx = 0;
    if (bonusTitleEl) bonusTitleEl.textContent = '';
    typeBonusTitle();
  }
  // 4.1 
  function startAudienceSectionAnimation() {
  const items = document.querySelectorAll('.audience-item');
  items.forEach((item, index) => {
    setTimeout(() => {
      item.classList.remove('opacity-0', 'translate-y-6');
      item.classList.add('opacity-100', 'translate-y-0');
    }, index * 400); // задержка 0.4s между пунктами
  });
}

// запуск при появлении секции в зоне видимости
const audienceObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      startAudienceSectionAnimation();
      audienceObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

audienceObserver.observe(document.getElementById('audience-section'));



  // --- 5. CTA-section анимация заголовка/описания ---
  const ctaTitleEl = document.getElementById('cta-type-title');
  const ctaDescEl = document.getElementById('cta-desc');
  const ctaTitleText = "Получи гайд прямо сейчас:";
  const ctaDescText = "📩 Введи свой email и получи гайд в ответном письме!";
  let titleIdx = 0, descIdx = 0;
  function typeCtaTitle() {
    if (!ctaTitleEl) return;
    ctaTitleEl.textContent = ctaTitleText.slice(0, titleIdx);
    titleIdx++;
    if (titleIdx <= ctaTitleText.length) {
      setTimeout(typeCtaTitle, Math.random() * 38 + 32);
    } else {
      setTimeout(typeCtaDesc, 250);
    }
  }
  function typeCtaDesc() {
    if (!ctaDescEl) return;
    ctaDescEl.textContent = ctaDescText.slice(0, descIdx);
    descIdx++;
    if (descIdx <= ctaDescText.length) {
      setTimeout(typeCtaDesc, Math.random() * 36 + 29);
    }
  }
  function startCtaSectionAnimation() {
    titleIdx = 0; descIdx = 0;
    if (ctaTitleEl) ctaTitleEl.textContent = '';
    if (ctaDescEl) ctaDescEl.textContent = '';
    typeCtaTitle();
    // Wiggle-анимация кнопки (привлечение внимания)
    const btn = document.getElementById('openIframeBtn');
    if (btn) {
      setInterval(() => {
        btn.classList.add('wiggle');
        setTimeout(() => btn.classList.remove('wiggle'), 600);
      }, 6000);
    }
  }

  // ===== 6. (опционально) Слушатель для Telegram канала =====
  window.addEventListener('message', function(event) {
    if (event.data === 'open_tg_channel') {
      window.open('https://t.me/codeby_sec', '_blank');
    }
  });
//    ===== 7. =====
  // FAQ секция: анимация появления при скролле
const faqSection = document.getElementById('faq-section');
if (faqSection) {
  const faqItems = faqSection.querySelectorAll('.faq-item');
  let triggered = false;
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        faqSection.classList.remove('opacity-0', 'translate-y-12');
        faqSection.classList.add('opacity-100', 'translate-y-0');
        faqItems.forEach((item, idx) => {
          setTimeout(() => {
            item.classList.remove('opacity-0', 'translate-y-10');
            item.classList.add('opacity-100', 'translate-y-0');
          }, idx * 180);
        });
        observer.unobserve(faqSection);
      }
    });
  }, { threshold: 0.2 });
  obs.observe(faqSection);
}
// Typewriter-анимация для "FAQ" заголовка
const faqTypeTitle = document.getElementById('faq-type-title');
const faqText = "FAQ";
let faqIdx = 0;
function typeFaqTitle() {
  if (!faqTypeTitle) return;
  faqTypeTitle.textContent = faqText.slice(0, faqIdx);
  faqIdx++;
  if (faqIdx <= faqText.length) {
    setTimeout(typeFaqTitle, Math.random() * 100 + 50);
  }
}
// Вызови typeFaqTitle только когда секция появляется!
if (faqSection) {
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        typeFaqTitle();
        observer.unobserve(faqSection);
      }
    });
  }, { threshold: 0.18 });
  obs.observe(faqSection);
}
});
