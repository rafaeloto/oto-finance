const useIsDesktop = () => {
  const isDesktop = window.innerWidth > 768;

  return isDesktop;
};

export default useIsDesktop;
