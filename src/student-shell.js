import {
  applyStudentFeatureVisibility,
  enforceStudentFeature,
  loadStudentAccess,
  renderStudentAccessBoundary,
} from "./student-visibility.js?v=20260906-studio1";

async function initialiseStudentShell() {
  const selector = document.body.dataset.studentShellMain || "main";
  try {
    const requiredFeature = String(document.body.dataset.studentShellFeature || "").trim();
    if (requiredFeature) {
      await enforceStudentFeature(requiredFeature, document.querySelector(selector), {
        title: "This page is hidden for your account.",
        titleJa: "このアカウントでは、このページは非表示です。",
        detail: "Your teacher has prepared a focused learning view for you.",
        detailJa: "担当の先生が、学習に必要な内容だけを表示しています。",
      });
    } else {
      const access = await loadStudentAccess({ refresh: true });
      applyStudentFeatureVisibility(access);
    }
  } catch {
    document.documentElement.dataset.studentAccess = "disabled";
    renderStudentAccessBoundary(document.querySelector(selector), {
      title: "We could not verify access to this page.",
      titleJa: "このページの利用権限を確認できませんでした。",
      detail: "Please return to the Review Hub and try again.",
      detailJa: "Review Hubへ戻り、もう一度お試しください。",
    });
  } finally {
    document.body.dataset.accessPending = "false";
  }
}

void initialiseStudentShell();
