import { useState, useEffect } from "react";

/**
 * サイドバーの幅を取得するカスタムフック
 * サイドバーが表示されている場合、その幅を返す
 */
export const useSidebarWidth = () => {
  const [sidebarWidth, setSidebarWidth] = useState<number>(0);

  useEffect(() => {
    const updateSidebarWidth = () => {
      // サイドバーの要素を取得
      const sidebar = document.querySelector(
        ".sidebar-wrapper aside, aside.w-\\[260px\\]",
      );
      if (sidebar) {
        const width = sidebar.getBoundingClientRect().width;
        setSidebarWidth(width);
      } else {
        // モバイル表示の場合は0
        setSidebarWidth(0);
      }
    };

    // 初回実行
    updateSidebarWidth();

    // リサイズイベントを監視
    window.addEventListener("resize", updateSidebarWidth);

    // MutationObserverでサイドバーの表示/非表示を監視
    const observer = new MutationObserver(updateSidebarWidth);
    const targetNode = document.body;
    observer.observe(targetNode, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("resize", updateSidebarWidth);
      observer.disconnect();
    };
  }, []);

  return sidebarWidth;
};
