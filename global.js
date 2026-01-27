const initGlobal = () => {
  /* ============================================================
   * 1. MEDIA FADE-IN (IMG + VIDEO)
   * ============================================================ */

  const medias = document.querySelectorAll("img, video");

  medias.forEach((media) => {
    // Images
    if (media.tagName === "IMG") {
      if (media.complete) {
        media.style.opacity = "1";
      } else {
        media.addEventListener("load", () => {
          media.style.opacity = "1";
        });
      }
    }

    // Videos
    if (media.tagName === "VIDEO") {
      if (media.readyState >= 1) {
        media.style.opacity = "1";
      } else {
        media.addEventListener("loadedmetadata", () => {
          media.style.opacity = "1";
        });
      }
    }
  });

  /* ============================================================
   * 2. VIDEO PLAY / PAUSE ON VIEWPORT
   * ============================================================ */

  const videos = document.querySelectorAll("video");

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  videos.forEach((video) => {
    videoObserver.observe(video);
  });

  /* ============================================================
   * 3. TIME (PARIS) + YEAR
   * ============================================================ */

  const timeEl = document.getElementById("time");
  const yearEl = document.getElementById("year");

  if (timeEl) {
    const updateTime = () => {
      const now = new Date();

      const formatter = new Intl.DateTimeFormat("fr-FR", {
        timeZone: "Europe/Paris",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      timeEl.textContent = `${formatter.format(now)} CET`;
    };

    updateTime();
    setInterval(updateTime, 1000);
  }

  if (yearEl) {
    yearEl.textContent = `©${new Date().getFullYear()}`;
  }
};
