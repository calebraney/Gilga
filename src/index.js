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

  // Lenis scroll to anchor
  const lenisAnchors = function () {
    // Grab all elements that have a "scroll-target" attribute
    const scrollButtons = document.querySelectorAll('[scroll-target]');
    // For each element, listen to a "click" event
    scrollButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();

        // get the DOM element by the ID (scroll-target value)
        let target = button.getAttribute('scroll-target'),
          el = document.getElementById(target);

        // Use lenis.scrollTo() to scroll the page to the right element
        lenis.scrollTo(el, {
          offset: 0,
          immediate: false,
          duration: 1,
          easing: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2), // https://easings.net
        });
      });
    });
  };
  lenisAnchors();

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Keep lenis and scrolltrigger in sync
  lenis.on('scroll', () => {
    if (!ScrollTrigger) return;
    ScrollTrigger.update();
  });

  // button interaction
  const buttonHover = function () {
    const buttons = document.querySelectorAll('.button_link');
    const bgOne = document.querySelector('.cta_bg.is-1');
    const bgTwo = document.querySelector('.cta_bg.is-2');

    const ACTIVE_CLASS = 'is-hovered';
    buttons.forEach((button, index) => {
      button.addEventListener('mouseenter', function () {
        button.classList.add(ACTIVE_CLASS);
        button.querySelector('.button_circle').classList.add(ACTIVE_CLASS);
        if (index === 0) {
          bgOne.classList.add(ACTIVE_CLASS);
        }
        if (index === 1) {
          bgTwo.classList.add(ACTIVE_CLASS);
        }
      });
      button.addEventListener('mouseleave', function () {
        button.classList.remove(ACTIVE_CLASS);
        bgOne.classList.remove(ACTIVE_CLASS);
        bgTwo.classList.remove(ACTIVE_CLASS);
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
      const heroLoad = function () {
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
            rotateX: 90,
          },
          '<.3'
        );
        tl.from(
          '.hero_caleb-logo',
          {
            yPercent: 100,
            opacity: 0,
            rotateX: -90,
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
            rotateX: 90,
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
      };

      const heroLogoScroll = function () {
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
            duration: moveToHero ? 0.3 : 0.8,
            ease: moveToHero ? 'power1.in' : 'power2.out',
          });
        };
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.section_hero',
            start: 'bottom 95%',
            end: 'bottom 96%',
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
      };
      const heroTextScroll = function () {
        // set up timeline
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.section_hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.7,
          },
          defaults: {
            duration: 1,
            ease: 'none',
          },
        });
        tl.to('.hero_text-wrapper', {
          yPercent: 80,
        });
        tl.to(
          '.hero_spinner-wrap',
          {
            rotateZ: 360,
          },
          '<'
        );
      };
      const firstUpTitle = function () {
        // set up timeline
        let headingSplit = new SplitType('.first-up_h2', {
          types: 'lines, words',
        });
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
        tl.from('.first-up_h2 .line', {
          x: '-3rem',
          skew: '-5',
          opacity: 0,
          stagger: { each: 0.2, from: 'left' },
        });
      };
      const firstUpScroll = function () {
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
      };
      const firstUpImage = function () {
        // set up timeline
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.section_first-up',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
          defaults: {
            duration: 1,
            ease: 'none',
          },
        });
        tl.to('.first-up_image', {
          scale: 1.1,
          yPercent: -15,
        });
      };
      const whyMeScroll = function () {
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.why_list',
            start: 'bottom bottom',
            end: 'bottom 85%',
            markers: false,
            scrub: true,
          },
          defaults: {
            duration: 1,
            ease: 'none',
          },
        });
        tl.to('.why_item-final', {
          height: '100%',
        });
      };
      const myWorkHover = function () {
        const trigger = document.querySelector('.work_link');
        let headingSplit = new SplitType('.work_h2', {
          types: 'words, chars',
        });
        // set up timeline
        let tl = gsap.timeline({
          paused: true,
          defaults: {
            duration: 0.6,
            ease: 'power2.out',
          },
        });
        tl.to(
          '.work_image',
          {
            scale: 1.2,
            duration: 0.8,
          },
          '<'
        );
        tl.to(
          '.work_arrow',
          {
            xPercent: 50,
          },
          '<'
        );
        tl.fromTo(
          '.work_h2.is-1 .char',
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
          },
          {
            yPercent: -75,
            opacity: 0,
            rotateX: 90,
            duration: 0.4,
            stagger: { each: 0.03, from: 'left' },
          },
          '<'
        );
        tl.fromTo(
          '.work_h2.is-2 .char',
          {
            yPercent: 75,
            opacity: 0,
            rotateX: -90,
          },
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.4,
            stagger: { each: 0.03, from: 'left' },
          },
          '<.2'
        );
        trigger.addEventListener('mouseenter', function () {
          tl.play();
        });
        trigger.addEventListener('mouseleave', function () {
          tl.reverse();
        });
      };
      heroLoad();
      heroTextScroll();
      firstUpTitle();
      firstUpScroll();
      firstUpImage();
      // Conditional Animations
      if (isAnimationSafe && isDesktop) {
        heroLogoScroll();
        whyMeScroll();
        myWorkHover();
      }
    }
  );
});
