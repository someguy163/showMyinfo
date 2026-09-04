// 테마 토글 — 저장된 선택이 없으면 OS 설정을 따릅니다.
(function () {
  var root = document.documentElement;

  function current() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "밝은 화면으로 전환" : "어두운 화면으로 전환"
      );
    }
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest(".theme-toggle");
    if (!btn) return;
    var next = current() === "dark" ? "light" : "dark";
    apply(next);
    try {
      localStorage.setItem("theme", next);
    } catch (err) {
      /* 저장이 막힌 브라우저에서는 이번 방문에만 적용됩니다. */
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    apply(current());
    initGalleries();
    initNav();
  });

  // 좌우 스크롤 갤러리
  function initGalleries() {
    document.querySelectorAll("[data-gallery]").forEach(function (strip) {
      var id = strip.getAttribute("data-gallery");
      document
        .querySelectorAll('[data-gallery-nav="' + id + '"]')
        .forEach(function (btn) {
          btn.addEventListener("click", function () {
            var first = strip.querySelector("figure");
            if (!first) return;
            var step = first.getBoundingClientRect().width + 16;
            var dir = btn.getAttribute("data-dir") === "prev" ? -1 : 1;
            strip.scrollBy({ left: step * dir, behavior: "smooth" });
          });
        });
    });
  }

  // 현재 보고 있는 섹션을 상단 메뉴에 표시
  function initNav() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll(".top-nav a[href^='#']")
    );
    if (!links.length || !("IntersectionObserver" in window)) return;

    var byId = {};
    var targets = [];
    links.forEach(function (a) {
      var el = document.getElementById(a.getAttribute("href").slice(1));
      if (!el) return;
      byId[el.id] = a;
      targets.push(el);
    });

    var visible = {};
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible[entry.target.id] = entry.isIntersecting;
        });
        var active = targets.filter(function (t) {
          return visible[t.id];
        })[0];
        links.forEach(function (a) {
          a.removeAttribute("aria-current");
        });
        if (active && byId[active.id]) {
          byId[active.id].setAttribute("aria-current", "true");
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    targets.forEach(function (t) {
      io.observe(t);
    });
  }
})();
