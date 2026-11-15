document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener("click", e => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  const skills = document.querySelectorAll(".skill");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, { threshold: .08 });

  skills.forEach(skill => {
    skill.style.opacity = "0";
    skill.style.transform = "translateY(12px)";
    skill.style.transition = "opacity .5s ease, transform .5s ease";
    observer.observe(skill);
  });
});
