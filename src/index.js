import { doc } from 'prettier';
import SplitType from 'split-type';

// Webflow is initialized
window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('initiated');

  // Run code once webflow is initialized
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(Flip);

  //LENIS Smoothscroll
  const lenis = new Lenis({
    duration: 1,
    easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // https://easings.net
    touchMultiplier: 1.5,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // allow scrolling on overflow elements
  //document.querySelector('.over--scroll').setAttribute("onwheel", "event.stopPropagation()");

  //CURSOR CODE
  //Cursor .is-cursor-minor attribute
  // $("[cursor=minor]").on('mouseenter mouseleave', function() {
  //   $('.cursor_inner').toggleClass('is-cursor-minor');
  //   $('.cursor_outer').toggleClass('is-cursor-minor');
  // });

  //RANDOM INTERACTIONS CODE
  //Button .is-hovered added to button circle

  // Keep lenis and scrolltrigger in sync
  lenis.on('scroll', () => {
    if (!ScrollTrigger) return;
    ScrollTrigger.update();
  });

  // Split the text up
  function splitText() {
    let testimonialSplitInstance = new SplitType('.testimonial_quote', {
      types: 'lines',
    });
  }
  // button interaction
  const buttonHover = function () {
    const buttons = document.querySelectorAll('.button_link');
    const ACTIVE_CLASS = 'is-hovered';
    buttons.forEach((button) => {
      button.addEventListener('mouseenter', function () {
        button.classList.add(ACTIVE_CLASS);
        button.querySelector('.button_circle').classList.add(ACTIVE_CLASS);
      });
      button.addEventListener('mouseleave', function () {
        button.classList.remove(ACTIVE_CLASS);
        button.querySelector('.button_circle').classList.remove(ACTIVE_CLASS);
      });
    });
  };
  buttonHover();

  // Split animation
  let firstUpSplitElements = $('.first-up_paragraph');
  let instancesOfSplit = [];
  // Split the text up
  function firstUpSplit() {
    firstUpSplitElements.each(function (index) {
      let currentElement = $(this);
      instancesOfSplit[index] = new SplitType(currentElement, {
        types: 'lines',
      });
    });
  }
  firstUpSplit();
  // Update on window resize
  let windowWidth = $(window).innerWidth();
  window.addEventListener('resize', function () {
    if (windowWidth !== $(window).innerWidth()) {
      windowWidth = $(window).innerWidth();
      firstUpSplitElements.each(function (index) {
        instancesOfSplit[index].revert();
      });
      firstUpSplit();
      firstUpScroll();
    }
  });

  function firstUpScroll() {
    $('.first-up_paragraph .line').each(function (index) {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: $(this),
          // trigger element - viewport
          start: 'top 90%',
          end: 'bottom 70%',
          scrub: 0.5,
        },
      });
      tl.from($(this), {
        opacity: 0,
        duration: 1,
      });
    });
  }

  firstUpScroll();

  let mm = gsap.matchMedia();
  mm.add(
    {
      //Animation Media Query
      isAnimationSafe: '(prefers-reduced-motion: no-preference)',
      isDesktop: '(min-width: 768px)',
      isMobile: '(max-width: 767px)',
    },
    (context) => {
      let { isAnimationSafe, isDesktop, isMobile } = context.conditions;
      //Page Load Animation
      function heroLoad() {
        let headingSplit = new SplitType('.hero_h1', {
          types: 'words, chars',
        });
        let tl = gsap.timeline({
          delay: 0.5,
          defaults: {
            duration: 0.6,
            ease: 'power3.out',
          },
        });
        tl.set('.section_hero', {
          opacity: 1,
        });
        tl.from(
          '.hero_gilga-logo',
          {
            yPercent: -100,
            opacity: 0,
            rotateX: 45,
          },
          '<.3'
        );
        tl.from(
          '.hero_caleb-logo',
          {
            yPercent: 100,
            opacity: 0,
            rotateX: -45,
          },
          '<.3'
        );
        tl.from(
          '.hero_logo-line-fill',
          {
            width: '0%',
          },
          '<.3'
        );

        tl.from(
          'h1 .char',
          {
            yPercent: 25,
            opacity: 0,
            rotateX: 45,
            stagger: { each: isAnimationSafe ? 0.1 : 0, from: 'left' },
            duration: 0.8,
          },
          '<'
        );
        tl.from(
          '.hero_spinner-wrap',
          {
            opacity: 0,
            scale: 0,
          },
          '<.4'
        );
        tl.from(
          '.nav_layout',
          {
            xPercent: -100,
          },
          '<.4'
        );
      }

      function heroScroll() {
        const updateLogo = function (moveToHero = false) {
          const logoWrap = document.querySelector('.hero_logo-layout');
          const logoChildren = logoWrap.querySelectorAll('*');
          const heroWrap = document.querySelector('.hero_logo-wrapper');
          const navWrap = document.querySelector('.logo-nav_layout');
          //guard clause
          if (!logoWrap || !heroWrap || !navWrap) return;
          //get state
          let state = Flip.getState(logoWrap, logoChildren);
          console.log('move nav', moveToHero, state);
          //move element
          if (moveToHero) {
            heroWrap.insertAdjacentElement('beforeend', logoWrap);
          } else {
            navWrap.insertAdjacentElement('beforeend', logoWrap);
          }
          // animate element
          Flip.from(state, {
            duration: moveToHero ? 0.4 : 0.8,
            ease: 'power2.out',
          });
        };
        let tlFLip = gsap.timeline({
          scrollTrigger: {
            trigger: '.section_hero',
            start: 'bottom 90%',
            end: 'bottom 91%',
            scrub: false,
            onEnter: () => {
              console.log('onEnter');
              updateLogo(false);
            },
            onEnterBack: () => {
              console.log('onEnterBack');
              updateLogo(true);
            },
          },
        });
        // set up timeline
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.section_hero',
            start: 'bottom 90%',
            end: 'bottom 0%',
            scrub: 1,
          },
          defaults: {
            duration: 1,
            ease: 'none',
          },
        });
        tl.to('.hero_text-wrapper', {
          yPercent: 80,
        });
      }
      function firstUpTitle() {
        // set up timeline
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.first-up_h2',
            start: 'top 90%',
            end: 'top 40%',
            scrub: 0.5,
          },
          defaults: {
            duration: 0.8,
            ease: 'power3.out',
          },
        });
        tl.from('.first-up_h2 .char', {
          xPercent: -50,
          opacity: 0,
          stagger: { each: 0.2, from: 'left' },
        });
      }

      heroLoad();
      heroScroll();
      firstUpTitle();
      // Conditional Animations
      if (isAnimationSafe) {
      }
    }
  );
});
