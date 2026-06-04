(function () {
  const data = window.courseData;

  if (!data) {
    return;
  }

  const chapterMenu = document.getElementById("chapter-menu");
  const chapterCount = document.getElementById("chapter-count");
  const courseTitle = document.getElementById("course-title");
  const courseSummary = document.getElementById("course-summary");
  const activeChapterTitle = document.getElementById("active-chapter-title");
  const activeChapterHook = document.getElementById("active-chapter-hook");
  const chapterHeading = document.getElementById("chapter-heading");
  const chapterDescription = document.getElementById("chapter-description");
  const subsectionList = document.getElementById("subsection-list");
  const materialsList = document.getElementById("materials-list");
  const progressList = document.getElementById("progress-list");
  const progressIndicator = document.getElementById("progress-indicator");
  const progressFill = document.getElementById("progress-fill");
  const toggleSubsections = document.getElementById("toggle-subsections");

  if (!chapterMenu) {
    return;
  }

  let activeChapterIndex = 0;
  let subsectionsCollapsed = false;

  function renderMaterials() {
    materialsList.innerHTML = data.materials
      .map(function (item) {
        return (
          '<article class="materials-item">' +
          "<span>" + item.type + "</span>" +
          "<h3>" + item.title + "</h3>" +
          "<p>" + item.description + "</p>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderProgress() {
    const total = data.chapters.length;
    const completed = Math.min(data.completedChapters, total);
    const percent = total ? Math.round((completed / total) * 100) : 0;

    progressIndicator.textContent = completed + "/" + total;
    progressFill.style.width = percent + "%";

    progressList.innerHTML = data.chapters
      .map(function (chapter, index) {
        const isComplete = index < completed;
        return (
          "<li>" +
          '<span class="progress-marker' + (isComplete ? " is-complete" : "") + '"></span>' +
          "<span>" + chapter.title + "</span>" +
          "</li>"
        );
      })
      .join("");
  }

  function renderChapterMenu() {
    chapterCount.textContent = data.chapters.length + " total";

    chapterMenu.innerHTML = data.chapters
      .map(function (chapter, index) {
        const activeSubsections = index === activeChapterIndex
          ? (
            '<div class="subchapter-list">' +
            chapter.subsections
              .map(function (subsection, subsectionIndex) {
                return (
                  '<button class="subchapter-link" data-subsection-index="' + subsectionIndex + '" type="button">' +
                  subsection.title +
                  "</button>"
                );
              })
              .join("") +
            "</div>"
          )
          : "";

        return (
          '<div class="chapter-group">' +
          '<button class="chapter-link' + (index === activeChapterIndex ? " is-active" : "") + '" data-index="' + index + '" type="button">' +
          chapter.title +
          "</button>" +
          activeSubsections +
          "</div>"
        );
      })
      .join("");

    chapterMenu.querySelectorAll(".chapter-link").forEach(function (button) {
      button.addEventListener("click", function () {
        activeChapterIndex = Number(button.getAttribute("data-index"));
        renderChapterMenu();
        renderActiveChapter();
      });
    });

    chapterMenu.querySelectorAll(".subchapter-link").forEach(function (button) {
      button.addEventListener("click", function () {
        const subsectionIndex = Number(button.getAttribute("data-subsection-index"));
        const card = document.getElementById("subsection-" + subsectionIndex);

        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  function renderActiveChapter() {
    const chapter = data.chapters[activeChapterIndex];

    courseTitle.textContent = data.title;
    courseSummary.textContent = data.summary;
    activeChapterTitle.textContent = chapter.title;
    activeChapterHook.textContent = chapter.hook;
    chapterHeading.textContent = chapter.title;
    chapterDescription.textContent = chapter.description;

    subsectionList.classList.toggle("is-collapsed", subsectionsCollapsed);
    subsectionList.innerHTML = chapter.subsections
      .map(function (subsection, index) {
        return (
          '<article class="subsection-card" id="subsection-' + index + '">' +
          "<h3>" + (index + 1) + ". " + subsection.title + "</h3>" +
          "<p>" + subsection.description + "</p>" +
          '<span class="subsection-tag">' + subsection.tag + "</span>" +
          "</article>"
        );
      })
      .join("");
  }

  toggleSubsections.addEventListener("click", function () {
    subsectionsCollapsed = !subsectionsCollapsed;
    subsectionList.classList.toggle("is-collapsed", subsectionsCollapsed);
    toggleSubsections.textContent = subsectionsCollapsed ? "Expand subsections" : "Collapse subsections";
  });

  renderMaterials();
  renderProgress();
  renderChapterMenu();
  renderActiveChapter();
})();
