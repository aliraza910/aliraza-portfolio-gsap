let mouse = document.querySelector("#cursor");
let link = document.querySelectorAll("a");
document.addEventListener("mousemove", function (details) {
  details.clientX;
  details.clientY;

  setTimeout(function () {
    mouse.style.top = details.y + "px";
    mouse.style.left = details.x + "px";
  }, 100);
});

link.forEach(function (alinks) {
  alinks.addEventListener("mousemove", () => {
    mouse.style.backgroundColor = "transparent";
    mouse.style.border = "0.5px solid #000";
    mouse.style.scale = 3;
  });
  alinks.addEventListener("mouseleave", () => {
    mouse.style.backgroundColor = "#EF0454";
    mouse.style.border = "none";
    mouse.style.scale = 1;
  });
});
function revealToSpan() {
  document.querySelectorAll(".reveal").forEach((e) => {
    let parent = document.createElement("span");
    let child = document.createElement("span");
    parent.classList.add("parent");
    child.classList.add("child");

    child.innerHTML = e.innerHTML;
    parent.appendChild(child);

    e.innerHTML = "";
    e.appendChild(parent);
  });
}
revealToSpan();

function subMenu() {
  let freelance = document.querySelectorAll(".freelance");
  let social = document.querySelectorAll(".social");

  freelance.forEach((item) => {
    let subfreelance = item.querySelector(".subfreelance");
    item.addEventListener("mouseenter", () => {
      subfreelance.style.display = "block";
    });
    item.addEventListener("mouseleave", () => {
      subfreelance.style.display = "none";
    });
  });

  social.forEach((item) => {
    let subsocial = item.querySelector(".subsocial");
    item.addEventListener("mouseover", () => {
      subsocial.style.display = "block";
    });
    item.addEventListener("mouseout", () => {
      subsocial.style.display = "none";
    });
  });
}
subMenu();

gsap.to(".nav", {
  duration: 1,
  height: "80px",
  scrollTrigger: {
    trigger: ".nav",
    scroller: "body",
    start: "top -10%",
    end: "top -11%",
    scrub: true,
  },
});
var tl = gsap.timeline();

tl;
tl.from(".loader .child span", {
  x: 100,
  duration: 1.3,
  stagger: 0.2,
  ease: Power2.easeInOut,
}).to(".loader .parent .child", {
  y: "-100",
  duration: 1,
  ease: "Circ.easeInOut",
});
tl.to(".loader", {
  height: 0,
  duration: 1,
  delay: -0.5,
  ease: "Circ.easeInOut",
})
  .to(".pink", {
    height: "100%",
    top: 0,
    duration: 1,
    delay: -1,
    ease: "Circ.easeInOut",
  })
  .to(".pink", {
    height: "0%",
    duration: 1,
    delay: -0.4,
    ease: "Circ.easeInOut",
  })
  .from(".nav", {
    opacity: 0,
    duration: 0.5,
    ease: "Circ.easeInOut",
  })
  .from(".hero1 h1", {
    x: -30,
    opacity: 0,
  })
  .from(".hero2 h2", {
    y: 30,
    opacity: 0,
  })
  .from(".hero2 h1", {
    y: 30,
    opacity: 0,
  })
  .from(".hero1 h5", {
    rotate: 360,
    opacity: 0,
  })
  .from(".hero2 .herimg", {
    y: 10,
    opacity: 0,
    rotate: 360,
  })
  .from(".about", {
    y: 30,
    opacity: 0,
  })
  .from(".eximg", {
    x: 5,
    y: 5,
    repeat: -1,
    duration: 1.5,
    yoyo: true,
  })
  .from(".about .aboutimg .profileimg", {
    scale: 1.1,
    x: -10,
    duration: 1,
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".about .aboutimg .profileimg",
      scroller: "body",
      scrub: 2,
      start: "-16% 80%",
      end: "bottom 60%",
    },
  })
  .from(".work .workimg", {
    rotate: 270,
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".about .aboutimg .profileimg",
      scroller: "body",
      scrub: 2,
      start: "-16% 82%",
      end: "bottom 42%",
    },
  })
  .from(".work .tagline", {
    y: 70,
    duration: 0.5,
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".work .tagline",
      scroller: "body",
      scrub: 1,
      start: "top 85%",
      end: "bottom 60%",
    },
  })
  .from(".featwork h1", {
    y: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".featwork h1",
      scroller: "body",
      scrub: 1,
      start: "top 90%",
      end: "bottom 75%",
    },
  })
  .from(".featwork img", {
    y: -30,
    duration: 1,
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".featwork h1",
      scroller: "body",
      scrub: 1,
      start: "top 90%",
      end: "bottom 75%",
    },
  })
  .from(".featwork .images", {
    y: 40,
    scale: 1.01,
    duration: 1,
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".featwork .images",
      scroller: "body",
      scrub: 1,
      start: "top 95%",
      end: "bottom 75%",
    },
  })
  .to(".featwork .images3", {
    y: 10,
    duration: 1,
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".featwork .images3",
      scroller: "body",
      scrub: 1,
      start: "top 95%",
      end: "bottom 75%",
    },
  })
  .from(".skills .skillsheading .skillimg h2", {
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".skills",
      scroller: "body",
      scrub: 1,
      start: "top 90%",
      end: "bottom 70%",
    },
  })
  .from(".skills .skillsheading .skillimg img", {
    rotate: 180,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".skills",
      scroller: "body",
      scrub: 1,
      start: "top 90%",
      end: "bottom 70%",
    },
  })
  .to(".footer h2", {
    y: -30,
    duration: 1,
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".footer",
      scroller: "body",
      scrub: 1,
      start: "top 70%",
      end: "bottom 30%",
    },
  })
  .to(".footer .footerbtn", {
    y: -30,
    duration: 1,
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".footer",
      scroller: "body",
      scrub: 1,
      start: "top 70%",
      end: "bottom 30%",
    },
  });

const skillBoxes = document.querySelectorAll(".skill-box");

skillBoxes.forEach((box, index) => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: box,
      start: "top bottom-=100",
      end: "+=100",
      toggleActions: "play none none reverse",
    },
  });

  tl.fromTo(
    box.querySelector(".skill-bar .skill-per"),
    { width: 0, opacity: 0 },
    {
      width: box.querySelector(".skill-bar .skill-per").style.width,
      opacity: 1,
      duration: 1,
    }
  );
});
