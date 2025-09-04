export const isMacOS = (): boolean => {
  const nav = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };

  if (nav.userAgentData?.platform) {
    return nav.userAgentData.platform === "macOS";
  }

  return navigator.userAgent.includes("Macintosh");
};
